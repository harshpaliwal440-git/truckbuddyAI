'use client';

import React, { useState, useEffect } from 'react';
import { TruckTelemetry, ReturnLoadOffer } from '@/lib/freight-data';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Building2,
} from 'lucide-react';

export interface AIPredictionResult {
  priorityHeadline: string;
  executiveBriefing: string;
  weatherReturnAdvisory: string;
  efficiencyMetrics: {
    deadheadKmSaved: number;
    estimatedNetProfitBoostInr: number;
    roundTripUtilizationPercent: number;
    fuelSavedLitres: number;
  };
  recommendations: Array<{
    loadId: string;
    pickupCityAndHub: string;
    dropCityAndHub: string;
    isNearbyHubMatch: boolean;
    shipperCompany: string;
    cargoMaterial: string;
    weightTons: number;
    offeredRateInr: number;
    deadheadKmFromDrop: number;
    matchScore: number;
    turnaroundWindow: string;
    whyNotifiedFirst: string;
    recommendedHighway: string;
  }>;
  source?: string;
  analyzedAt?: string;
}

interface AIReturnLoadModuleProps {
  truck: TruckTelemetry;
  returnLoads: ReturnLoadOffer[];
  bookedLoadIds: string[];
  onBookReturnLoad: (loadInfo: {
    id: string;
    routeLabel: string;
    rateInr: number;
    shipper: string;
  }) => void;
  ridesUsed: number;
  isSubscribed: boolean;
}

export default function AIReturnLoadModule({
  truck,
  returnLoads,
  bookedLoadIds,
  onBookReturnLoad,
}: AIReturnLoadModuleProps) {
  const [pointA, setPointA] = useState(truck.originCity);
  const [pointB, setPointB] = useState(truck.destinationCity);
  const [loadingAI, setLoadingAI] = useState(false);
  const [prediction, setPrediction] = useState<AIPredictionResult | null>(null);

  useEffect(() => {
    setPointA(truck.originCity);
    setPointB(truck.destinationCity);
    runAIPrediction(truck.originCity, truck.destinationCity);
  }, [truck.id]);

  async function runAIPrediction(originOverride?: string, destOverride?: string) {
    const a = originOverride || pointA;
    const b = destOverride || pointB;
    setLoadingAI(true);
    try {
      const res = await fetch('/api/ai/return-load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          truck,
          availableReturnLoads: returnLoads,
          customOrigin: a,
          customDestination: b,
          deliveryStatus:
            truck.progressPercent >= 100
              ? `COMPLETED AT ${b.toUpperCase()}`
              : `${truck.progressPercent}% en route`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPrediction(data);
      }
    } catch {
      // Fallback
    } finally {
      setLoadingAI(false);
    }
  }

  const recommendations = prediction?.recommendations || [];

  return (
    <div className="space-y-4">
      {/* Mobile AI Corridor Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono text-[10px] font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>AI BACKHAUL MATCHER</span>
          </span>
          <span className="text-[11px] text-slate-300 font-mono">
            {truck.vehicleNumber}
          </span>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white">
            Outbound: {pointA} → {pointB} · Return: {pointB} → {pointA}
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {prediction?.executiveBriefing ||
              `Notified #1 for ${pointB} → ${pointA} return loads while travelling.`}
          </p>
        </div>

        {/* Mobile Route Pair Input + Refresh */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex-1 flex items-center bg-slate-800 border border-slate-700 rounded-xl px-3 h-11 text-xs">
            <input
              type="text"
              value={pointA}
              onChange={(e) => setPointA(e.target.value)}
              className="w-full bg-transparent text-white font-semibold focus:outline-none"
              placeholder="Origin"
            />
            <ArrowRight className="w-3.5 h-3.5 text-teal-400 mx-1.5 shrink-0" />
            <input
              type="text"
              value={pointB}
              onChange={(e) => setPointB(e.target.value)}
              className="w-full bg-transparent text-white font-semibold focus:outline-none text-right"
              placeholder="Dest"
            />
          </div>
          <button
            onClick={() => runAIPrediction(pointA, pointB)}
            disabled={loadingAI}
            className="h-11 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-[0.98]"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loadingAI ? 'animate-spin' : ''}`}
            />
            <span>{loadingAI ? '...' : 'Scan'}</span>
          </button>
        </div>

        {/* 3 Compact Mobile KPI Pills */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="p-2 rounded-xl bg-slate-800/90">
            <div className="text-[10px] text-slate-400">SAVED KMS</div>
            <div className="text-xs font-bold font-mono text-white mt-0.5">
              {prediction?.efficiencyMetrics?.deadheadKmSaved ?? 596} km
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/90">
            <div className="text-[10px] text-slate-400">NET PROFIT</div>
            <div className="text-xs font-bold font-mono text-teal-300 mt-0.5">
              +₹
              {(
                prediction?.efficiencyMetrics?.estimatedNetProfitBoostInr ??
                34800
              ).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/90">
            <div className="text-[10px] text-slate-400">DIESEL SAVED</div>
            <div className="text-xs font-bold font-mono text-white mt-0.5">
              {prediction?.efficiencyMetrics?.fuelSavedLitres ?? 152} L
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Return Load Stack */}
      <div className="space-y-3">
        {recommendations.map((rec, idx) => {
          const isBooked = bookedLoadIds.includes(rec.loadId);
          const isTop = idx === 0;

          return (
            <div
              key={rec.loadId}
              className={`rounded-2xl border p-4 space-y-3 transition-all ${
                isBooked
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : isTop
                  ? 'bg-white border-2 border-teal-700 shadow-xs'
                  : 'bg-white border-slate-200/90'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                    isTop
                      ? 'bg-teal-50 text-teal-800 border border-teal-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {rec.isNearbyHubMatch ? 'NEARBY HUB' : 'PRIORITY #1 MATCH'}
                </span>
                <span className="font-mono text-xs font-bold text-teal-700">
                  {rec.matchScore}% AI Match
                </span>
              </div>

              <div>
                <div className="text-sm font-bold text-slate-900">
                  {rec.pickupCityAndHub.split('(')[0]} →{' '}
                  {rec.dropCityAndHub.split('·')[0]}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{rec.shipperCompany}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-mono text-center">
                <div>
                  <div className="text-[10px] text-slate-400">RATE</div>
                  <div className="text-xs font-bold text-slate-900">
                    ₹{rec.offeredRateInr.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">DEADHEAD</div>
                  <div className="text-xs font-bold text-teal-700">
                    {rec.deadheadKmFromDrop} km
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">WEIGHT</div>
                  <div className="text-xs font-bold text-slate-900">
                    {rec.weightTons}T
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600">
                {rec.cargoMaterial} · <span className="font-medium">{rec.turnaroundWindow}</span>
              </div>

              <button
                onClick={() =>
                  onBookReturnLoad({
                    id: rec.loadId,
                    routeLabel: `${pointB} → ${pointA}`,
                    rateInr: rec.offeredRateInr,
                    shipper: rec.shipperCompany,
                  })
                }
                disabled={isBooked}
                className={`w-full min-h-[44px] py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-[0.98] cursor-pointer ${
                  isBooked
                    ? 'bg-emerald-600 text-white'
                    : isTop
                    ? 'bg-teal-700 hover:bg-teal-800 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {isBooked ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Return Load Booked</span>
                  </>
                ) : (
                  <>
                    <span>
                      Accept Return Load · ₹
                      {rec.offeredRateInr.toLocaleString('en-IN')}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
