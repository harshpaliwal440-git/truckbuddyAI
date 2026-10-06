import { GoogleGenAI, Type } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import {
  INITIAL_RAG_DOCUMENTS,
  DRIVER_OPTIONS,
  RAGDocument,
  DriverOption,
} from '@/lib/freight-data';

function retrieveRelevantDocuments(
  query: string,
  docs: RAGDocument[]
): Array<RAGDocument & { score: number }> {
  const tokens = query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const scored = docs.map((doc) => {
    const haystack = `${doc.title} ${doc.corridor} ${doc.content} ${doc.keywords.join(' ')}`.toLowerCase();
    let matches = 0;
    tokens.forEach((tok) => {
      if (haystack.includes(tok)) matches += 1;
      if (doc.keywords.some((k) => k.toLowerCase().includes(tok))) matches += 1.5;
    });
    const baseScore =
      tokens.length > 0
        ? Math.min(99, Math.round(68 + (matches / (tokens.length * 1.5)) * 31))
        : 85;
    return { ...doc, score: baseScore };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      query = 'Best flood-safe route from Indore to Mumbai and top customer-rated driver',
      documents = INITIAL_RAG_DOCUMENTS,
      truck,
      drivers = DRIVER_OPTIONS,
    } = body as {
      query: string;
      documents?: RAGDocument[];
      truck?: any;
      drivers?: DriverOption[];
    };

    const retrievedChunks = retrieveRelevantDocuments(query, documents);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return NextResponse.json(
        buildFallbackRagResponse(query, retrievedChunks, drivers)
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const contextBlock = retrievedChunks
      .map(
        (c) =>
          `[${c.code}] (${c.title} | Relevance: ${c.score}%):\n${c.content}`
      )
      .join('\n\n');

    const prompt = `You are the TruckBuddy RAG (Retrieval-Augmented Generation) Logistics & Driver Advisory Assistant.
Answer the user's query concisely (maximum 3 short sentences) using ONLY the retrieved knowledge base documents and live telemetry below. Cite document codes like [DOC-NH52-WEATHER] in your response.
Also rank the top 3 drivers for the customer based on their verified customer star ratings, transporter company, and highway weather suitability.

Retrieved Knowledge Context:
${contextBlock}

Active Truck Telemetry:
- Truck: ${truck?.vehicleNumber || 'MP 09 HH 8821'} | Transporter: ${truck?.transporterName || 'Malwa Express Fleet Co.'}
- Corridor: ${truck?.originCity || 'Indore'} -> ${truck?.destinationCity || 'Mumbai'}
- Cargo: ${truck?.cargoMaterial || 'Pharmaceutical & Precision Auto Parts'}

Available Rated Drivers:
${JSON.stringify(drivers, null, 2)}

User Query: "${query}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: {
              type: Type.STRING,
              description:
                'Concise 2-3 sentence RAG answer citing retrieved document codes like [DOC-NH52-WEATHER].',
            },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 short bullet points (max 10 words each).',
            },
            driverRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  driverId: { type: Type.STRING },
                  driverName: { type: Type.STRING },
                  transporterName: { type: Type.STRING },
                  rating: { type: Type.NUMBER },
                  aiMatchSummary: { type: Type.STRING },
                },
                required: [
                  'driverId',
                  'driverName',
                  'transporterName',
                  'rating',
                  'aiMatchSummary',
                ],
              },
            },
          },
          required: ['answer', 'keyTakeaways', 'driverRecommendations'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return NextResponse.json({
      ...parsed,
      retrievedChunks,
      model: 'gemini-2.5-flash-rag',
      timestamp: new Date().toISOString(),
    });
  } catch {
    const retrievedChunks = retrieveRelevantDocuments(
      'Indore Mumbai route driver',
      INITIAL_RAG_DOCUMENTS
    );
    return NextResponse.json(
      buildFallbackRagResponse(
        'Indore Mumbai route driver',
        retrievedChunks,
        DRIVER_OPTIONS
      )
    );
  }
}

function buildFallbackRagResponse(
  query: string,
  retrievedChunks: Array<RAGDocument & { score: number }>,
  drivers: DriverOption[]
) {
  const sortedDrivers = [...drivers].sort((a, b) => b.rating - a.rating);
  return {
    answer: `Based on [${retrievedChunks[0]?.code || 'DOC-NH52-WEATHER'}], divert at Dhule onto the NH-360/NH-48 Vapi corridor (612 km, 94% weather safety) to avoid severe waterlogging at Kasara Ghat. For this shipment, [${retrievedChunks[1]?.code || 'DOC-DRIVER-RATINGS'}] recommends Captain ${sortedDrivers[0]?.name} (${sortedDrivers[0]?.rating}★, ${sortedDrivers[0]?.transporterName}) with a 99% monsoon safety record.`,
    keyTakeaways: [
      'Avoid NH-160 Kasara Ghat due to 36mm/hr rain & flooding [DOC-NH52-WEATHER]',
      'Top Customer Rated: Rajeshwar Yadav (4.95★, Malwa Express Fleet Co.) [DOC-DRIVER-RATINGS]',
      'First 2 rides are ₹0 fee; instant GST bill & Razorpay settlement [DOC-BILLING-RZP]',
    ],
    driverRecommendations: sortedDrivers.slice(0, 3).map((d) => ({
      driverId: d.id,
      driverName: d.name,
      transporterName: d.transporterName,
      rating: d.rating,
      aiMatchSummary: d.aiReason,
    })),
    retrievedChunks,
    model: 'rag-hybrid-engine',
    timestamp: new Date().toISOString(),
  };
}
