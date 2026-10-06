import { GoogleGenAI, Type } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      truck,
      availableReturnLoads = [],
      customOrigin,
      customDestination,
      deliveryStatus,
    } = body;

    const pointA = customOrigin || truck?.originCity || 'Indore';
    const pointB = customDestination || truck?.destinationCity || 'Mumbai';
    const truckType = truck?.truckType || '32ft Multi-Axle Container';
    const capacityTons = truck?.capacityTons || 18;
    const vehicleNumber = truck?.vehicleNumber || 'MP 09 HH 8821';

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return NextResponse.json(
        buildDeterministicPrediction(
          pointA,
          pointB,
          vehicleNumber,
          truckType,
          capacityTons,
          availableReturnLoads
        )
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are the AI Return Load & Backhaul Optimization Engine for TruckBuddy, an Indian freight dispatch platform for Transporters, Shippers, and Drivers.

Outbound Delivery Context:
- Truck: ${vehicleNumber} (${truckType}, ${capacityTons}T capacity)
- Transporter: ${truck?.transporterName || 'Malwa Express Fleet Co.'}
- Outbound Journey: Point A (${pointA}) -> Point B (${pointB})
- Current Status: ${deliveryStatus || truck?.status || 'Completing delivery / Halted en route'}
- Current Location: ${truck?.currentLocationName || pointB}
- Outbound Freight Earned: ₹${truck?.freightAmountInr || 48500}

Candidate Return Loads waiting in/near ${pointB} heading back to ${pointA} or nearby corridor hubs:
${JSON.stringify(availableReturnLoads, null, 2)}

Task:
1. Analyze how completing the delivery from ${pointA} to ${pointB} positions this truck for priority return load notification from ${pointB} (or nearby satellite hubs within 35km) back to ${pointA} (or nearby industrial estates).
2. Generate a priority notification headline and concise executive briefing explaining why this transporter is notified FIRST before open-market brokers.
3. Evaluate and rank 3 concrete return load opportunities from ${pointB} (or nearby hub) back to ${pointA} (include existing candidate loads if they match ${pointB}->${pointA}, and generate realistic Indian industrial backhaul loads if custom cities were chosen).
4. Provide weather & flood corridor guidance for the return leg (${pointB} -> ${pointA}) so the driver avoids waterlogging or ghat bottlenecks.
5. Calculate round-trip efficiency metrics (deadhead km saved, net return profit in INR, empty-mile reduction %, and fuel saved in litres).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priorityHeadline: {
              type: Type.STRING,
              description:
                'Short, punchy priority alert headline notifying the transporter first.',
            },
            executiveBriefing: {
              type: Type.STRING,
              description:
                '2-sentence analysis of the Point B to Point A backhaul match and turnaround timing.',
            },
            weatherReturnAdvisory: {
              type: Type.STRING,
              description:
                'Specific highway and weather/flood avoidance recommendation for the return journey.',
            },
            efficiencyMetrics: {
              type: Type.OBJECT,
              properties: {
                deadheadKmSaved: { type: Type.NUMBER },
                estimatedNetProfitBoostInr: { type: Type.NUMBER },
                roundTripUtilizationPercent: { type: Type.NUMBER },
                fuelSavedLitres: { type: Type.NUMBER },
              },
              required: [
                'deadheadKmSaved',
                'estimatedNetProfitBoostInr',
                'roundTripUtilizationPercent',
                'fuelSavedLitres',
              ],
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  loadId: { type: Type.STRING },
                  pickupCityAndHub: { type: Type.STRING },
                  dropCityAndHub: { type: Type.STRING },
                  isNearbyHubMatch: {
                    type: Type.BOOLEAN,
                    description:
                      'True if pickup or drop is a nearby satellite industrial hub along the corridor.',
                  },
                  shipperCompany: { type: Type.STRING },
                  cargoMaterial: { type: Type.STRING },
                  weightTons: { type: Type.NUMBER },
                  offeredRateInr: { type: Type.NUMBER },
                  deadheadKmFromDrop: { type: Type.NUMBER },
                  matchScore: { type: Type.NUMBER },
                  turnaroundWindow: { type: Type.STRING },
                  whyNotifiedFirst: { type: Type.STRING },
                  recommendedHighway: { type: Type.STRING },
                },
                required: [
                  'loadId',
                  'pickupCityAndHub',
                  'dropCityAndHub',
                  'isNearbyHubMatch',
                  'shipperCompany',
                  'cargoMaterial',
                  'weightTons',
                  'offeredRateInr',
                  'deadheadKmFromDrop',
                  'matchScore',
                  'turnaroundWindow',
                  'whyNotifiedFirst',
                  'recommendedHighway',
                ],
              },
            },
          },
          required: [
            'priorityHeadline',
            'executiveBriefing',
            'weatherReturnAdvisory',
            'efficiencyMetrics',
            'recommendations',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return NextResponse.json({
      ...parsed,
      source: 'gemini-2.5-flash',
      analyzedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      buildDeterministicPrediction(
        'Indore',
        'Mumbai',
        'MP 09 HH 8821',
        '32ft Multi-Axle Container',
        18,
        []
      )
    );
  }
}

function buildDeterministicPrediction(
  pointA: string,
  pointB: string,
  vehicleNumber: string,
  truckType: string,
  capacityTons: number,
  _availableLoads: unknown[]
) {
  return {
    priorityHeadline: `Priority #1 Backhaul Alert: 3 Verified Return Loads from ${pointB} → ${pointA} Locked for ${vehicleNumber}`,
    executiveBriefing: `Because your ${truckType} (${vehicleNumber}) is completing an outbound ${pointA} → ${pointB} delivery, SwiftHaul AI has placed you first in queue for ${pointB} → ${pointA} return shipments. Taking the top Bhiwandi match eliminates 598 km of empty return running and boosts round-trip margin by 44%.`,
    weatherReturnAdvisory: `Take NH-48 (Vapi–Saputara elevated bypass) on the ${pointB} → ${pointA} return leg to avoid heavy rain & waterlogging at Kasara Ghat (NH-160).`,
    efficiencyMetrics: {
      deadheadKmSaved: 596,
      estimatedNetProfitBoostInr: 34800,
      roundTripUtilizationPercent: 98,
      fuelSavedLitres: 152,
    },
    recommendations: [
      {
        loadId: 'RET-MUM-IND-901',
        pickupCityAndHub: `${pointB} · Bhiwandi Logistics Park (2.4 km from drop)`,
        dropCityAndHub: `${pointA} · Pithampur Auto Cluster Sector 3`,
        isNearbyHubMatch: false,
        shipperCompany: 'Godrej & Boyce Industrial Freight',
        cargoMaterial: 'Sealed Appliance Compressors & Copper Coils',
        weightTons: Math.min(15.8, capacityTons),
        offeredRateInr: 46000,
        deadheadKmFromDrop: 2.4,
        matchScore: 99,
        turnaroundWindow: 'Pickup 1h 15m after unloading',
        whyNotifiedFirst: `Exact corridor inverse (${pointB} → ${pointA}) with bay-to-bay proximity (2.4 km deadhead) and matching ${capacityTons}T container spec.`,
        recommendedHighway: 'NH-48 → Saputara → NH-52 (Flood-Free)',
      },
      {
        loadId: 'RET-MUM-IND-902',
        pickupCityAndHub: `${pointB} · JNPT Nhava Sheva CFS Sector 4`,
        dropCityAndHub: `${pointA} · Sanwer Road Industrial Estate`,
        isNearbyHubMatch: false,
        shipperCompany: 'Tata Chemicals Import Desk',
        cargoMaterial: 'Palletized Food-Grade Polymers',
        weightTons: Math.min(17.2, capacityTons),
        offeredRateInr: 44200,
        deadheadKmFromDrop: 34.0,
        matchScore: 94,
        turnaroundWindow: 'Pickup Tomorrow 06:00 IST',
        whyNotifiedFirst: `Verified outbound ${pointA} fleet operator; priority port gate pass pre-cleared.`,
        recommendedHighway: 'NH-48 → Vapi → Sendhwa → NH-52',
      },
      {
        loadId: 'RET-NEAR-904',
        pickupCityAndHub: `Vapi GIDC (Corridor En-Route Hub near ${pointB})`,
        dropCityAndHub: `Dewas Industrial Area (28 km from ${pointA})`,
        isNearbyHubMatch: true,
        shipperCompany: 'Aarti Industries Chemical Logistics',
        cargoMaterial: 'Drummed Specialty Agro-Intermediates',
        weightTons: Math.min(16.0, capacityTons),
        offeredRateInr: 41800,
        deadheadKmFromDrop: 18.5,
        matchScore: 91,
        turnaroundWindow: 'Flexible 4-hour loading window along return highway',
        whyNotifiedFirst: `Zero-detour en-route pickup along the weather-safe NH-48 corridor back toward ${pointA}.`,
        recommendedHighway: 'NH-48 → NH-52 Direct',
      },
    ],
    source: 'deterministic-fallback',
    analyzedAt: new Date().toISOString(),
  };
}
