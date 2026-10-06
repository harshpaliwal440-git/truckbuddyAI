import { NextRequest, NextResponse } from 'next/server';

const MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  'AIzaSyDx7fdX83xPZ-TKAstqS29JMbenJkxuU0I';

interface CheckpointInput {
  id: string;
  name: string;
  highway: string;
  kmMark: number;
  lat: number;
  lng: number;
  tempC: number;
  condition: string;
  precipProb: number;
  rainMmPerHr: number;
  windKmh: number;
  visibilityKm: number;
  floodRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  roadAdvisory: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { origin, destination, checkpoints = [] } = body as {
      origin: { lat: number; lng: number };
      destination: { lat: number; lng: number };
      checkpoints: CheckpointInput[];
    };

    // 1. Query Google Routes API v2 (computeRoutes) for primary & alternative routes
    let computedRoutes: Array<{
      distanceMeters?: number;
      duration?: string;
      polyline?: { encodedPolyline?: string };
      description?: string;
    }> = [];

    try {
      const routesRes = await fetch(
        'https://routes.googleapis.com/directions/v2:computeRoutes',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': MAPS_API_KEY,
            'X-Goog-FieldMask':
              'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.description',
          },
          body: JSON.stringify({
            origin: {
              location: {
                latLng: {
                  latitude: origin.lat,
                  longitude: origin.lng,
                },
              },
            },
            destination: {
              location: {
                latLng: {
                  latitude: destination.lat,
                  longitude: destination.lng,
                },
              },
            },
            travelMode: 'DRIVE',
            routingPreference: 'TRAFFIC_AWARE',
            computeAlternativeRoutes: true,
            units: 'METRIC',
          }),
        }
      );

      if (routesRes.ok) {
        const routesData = await routesRes.json();
        if (Array.isArray(routesData.routes)) {
          computedRoutes = routesData.routes;
        }
      }
    } catch {
      // Fallback gracefully to waypoint geometry if Routes API fails
    }

    // 2. Query Google Weather API v1 (currentConditions:lookup) for checkpoints
    const enrichedCheckpoints = await Promise.all(
      checkpoints.map(async (cp) => {
        try {
          const weatherUrl = `https://weather.googleapis.com/v1/currentConditions:lookup?key=${MAPS_API_KEY}&location.latitude=${cp.lat}&location.longitude=${cp.lng}&unitsSystem=METRIC`;
          const weatherRes = await fetch(weatherUrl, {
            method: 'GET',
            headers: { Accept: 'application/json' },
          });

          if (weatherRes.ok) {
            const wData = await weatherRes.json();
            const liveTemp =
              typeof wData?.temperature?.degrees === 'number'
                ? Math.round(wData.temperature.degrees)
                : cp.tempC;
            const liveCondition =
              wData?.weatherCondition?.description?.text || cp.condition;
            const livePrecip =
              typeof wData?.precipitation?.probability?.percent === 'number'
                ? wData.precipitation.probability.percent
                : cp.precipProb;
            const liveRainMm =
              typeof wData?.precipitation?.qpf?.quantity === 'number'
                ? Number(wData.precipitation.qpf.quantity.toFixed(1))
                : cp.rainMmPerHr;
            const liveWind =
              typeof wData?.wind?.speed?.value === 'number'
                ? Math.round(wData.wind.speed.value)
                : cp.windKmh;
            const liveVis =
              typeof wData?.visibility?.distance === 'number'
                ? Number(wData.visibility.distance.toFixed(1))
                : cp.visibilityKm;

            // Keep critical flood zones realistic while blending live weather API data
            const isCriticalGhat =
              cp.floodRisk === 'CRITICAL' || cp.floodRisk === 'HIGH';

            return {
              ...cp,
              tempC: liveTemp,
              condition: isCriticalGhat
                ? `${cp.condition} (Live ${liveTemp}°C)`
                : liveCondition,
              precipProb: isCriticalGhat
                ? Math.max(cp.precipProb, livePrecip)
                : livePrecip,
              rainMmPerHr: isCriticalGhat
                ? Math.max(cp.rainMmPerHr, liveRainMm)
                : liveRainMm,
              windKmh: isCriticalGhat ? Math.max(cp.windKmh, liveWind) : liveWind,
              visibilityKm: isCriticalGhat
                ? Math.min(cp.visibilityKm, liveVis)
                : liveVis,
              isLiveApi: true,
            };
          }
        } catch {
          // Return baseline checkpoint telemetry on network error
        }
        return { ...cp, isLiveApi: false };
      })
    );

    return NextResponse.json({
      computedRoutes,
      checkpoints: enrichedCheckpoints,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to compute weather-smart route',
      },
      { status: 500 }
    );
  }
}
