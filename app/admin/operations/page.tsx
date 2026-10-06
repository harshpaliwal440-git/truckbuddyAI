'use client';

import React, { useState } from 'react';
import { useAdminPlatform } from '@/lib/admin-store';
import LiveFreightMap from '@/components/LiveFreightMap';
import {
  Radio,
  Truck,
  MapPin,
  Sparkles,
  CloudRain,
  Navigation,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function AdminLiveOperationsPage() {
  const { trucks, returnLoads, updateTruckTelemetryProgress } =
    useAdminPlatform();

  const [selectedTruckId, setSelectedTruckId] = useState<string>(
    trucks[0]?.id || 'TRK-MP09-8821'
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const selectedTruck =
    trucks.find((t) => t.id === selectedTruckId) || trucks[0];
  const activeRoute =
    selectedTruck.routes.find((r) => r.id === selectedTruck.activeRouteId) ||
    selectedTruck.routes[0];
  const priorityReturnLoad = returnLoads.find(
    (rl) => rl.matchedForTruckId === selectedTruck.id
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-teal-700">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Live Highway Telemetry & AI Backhaul Control</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            Live Operations & Corridor Tracking
          </h1>
        </div>

        {/* Fleet Selector Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {trucks.map((t) => {
            const active = t.id === selectedTruck.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTruckId(t.id)}
                className={`h-10 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Truck className="w-3.5 h-3.5 text-teal-500" />
                <span className="font-mono font-bold">{t.vehicleNumber}</span>
                <span className="text-[11px] opacity-80">
                  ({t.originCity}→{t.destinationCity})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Split Grid: Live Google Maps Corridor (7 cols) + Active Telemetry & Return Load Queue (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Live Interactive Map + Route Checkpoints */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-xs font-mono font-bold text-teal-700">
                  {selectedTruck.vehicleNumber} · {selectedTruck.transporterName}
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  {selectedTruck.originCity} ({selectedTruck.originHub}) →{' '}
                  {selectedTruck.destinationCity} (
                  {selectedTruck.destinationHub})
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-mono text-xs font-bold">
                {selectedTruck.status} · {selectedTruck.progressPercent}%
              </span>
            </div>

            <LiveFreightMap
              truck={selectedTruck}
              selectedRouteId={activeRoute.id}
              onSelectRoute={() => {}}
              onProgressChange={(prog) =>
                updateTruckTelemetryProgress(selectedTruck.id, prog)
              }
              isSimulating={isSimulating}
              onToggleSimulation={() => setIsSimulating((s) => !s)}
              priorityReturnLoad={priorityReturnLoad}
              onOpenReturnLoadModal={() => {}}
              onOpenBillModal={() => {}}
              encodedPolylines={{}}
            />

            {/* Admin Dispatch Progress Slider */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  Admin Telemetry Simulator (Adjust Highway Progress)
                </span>
                <span className="font-mono font-bold text-teal-700">
                  {selectedTruck.progressPercent}% · {selectedTruck.etaText}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={selectedTruck.progressPercent}
                onChange={(e) =>
                  updateTruckTelemetryProgress(
                    selectedTruck.id,
                    Number(e.target.value)
                  )
                }
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>0% Pickup ({selectedTruck.originCity})</span>
                <span>48% Highway Halt</span>
                <span>100% Unloading ({selectedTruck.destinationCity})</span>
              </div>
            </div>
          </div>

          {/* Highway Weather Checkpoints Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-teal-700" />
                <span>
                  Corridor Weather & Flood Risk Checkpoints (
                  {activeRoute.highwayTag})
                </span>
              </h3>
              <span className="font-mono text-xs font-bold text-emerald-700">
                Safety Score: {activeRoute.weatherSafetyScore}/100
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeRoute.checkpoints.map((cp) => (
                <div
                  key={cp.id}
                  className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{cp.name}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold ${
                        cp.floodRisk === 'LOW'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {cp.floodRisk} RISK
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-600">
                    KM {cp.kmMark} · {cp.tempC}°C · {cp.condition} · Rain:{' '}
                    {cp.rainMmPerHr}mm/h
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {cp.roadAdvisory}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Active Shipment Telemetry + Return-Load Backhaul Activity */}
        <div className="lg:col-span-5 space-y-4">
          {/* Current Shipment & Pickup/Destination Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-teal-700" />
              <span>Selected Trip & Shipment Status</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="text-[10px] font-mono uppercase text-slate-400">
                  Pickup Origin
                </div>
                <div className="font-bold text-slate-900">
                  {selectedTruck.originCity} — {selectedTruck.originHub}
                </div>
                <div className="text-slate-500">
                  Shipper: {selectedTruck.shipperName}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="text-[10px] font-mono uppercase text-slate-400">
                  Current Live Position
                </div>
                <div className="font-bold text-teal-800">
                  {selectedTruck.currentLocationName}
                </div>
                <div className="text-slate-600">
                  {selectedTruck.stayingLocationDetail}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="text-[10px] font-mono uppercase text-slate-400">
                  Destination Unloading Hub
                </div>
                <div className="font-bold text-slate-900">
                  {selectedTruck.destinationCity} —{' '}
                  {selectedTruck.destinationHub}
                </div>
                <div className="text-slate-500">
                  Cargo: {selectedTruck.cargoMaterial} (
                  {selectedTruck.cargoWeightTons}T)
                </div>
              </div>
            </div>
          </div>

          {/* Return-Load / Backhaul Activity Queue */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-teal-700 uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Zero-Deadhead AI Backhaul Engine</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  Return-Load / Backhaul Activity
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-teal-50 border border-teal-200 font-mono text-[10px] font-bold text-teal-800">
                {returnLoads.length} Active Matches
              </span>
            </div>

            <div className="space-y-3">
              {returnLoads.map((rl) => (
                <div
                  key={rl.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-600/50 transition-colors space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-mono text-[10px] font-bold">
                      PRIORITY #{rl.priorityRank} · {rl.aiMatchScore}% AI MATCH
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      ₹{rl.offeredRateInr.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-700" />
                    <span>{rl.originCity}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span>{rl.destinationCity}</span>
                    <span className="text-[11px] font-normal text-slate-500">
                      ({rl.deadheadKmFromDrop} km deadhead)
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600">
                    <strong>Shipper:</strong> {rl.shipperCompany} ·{' '}
                    <strong>Cargo:</strong> {rl.material} ({rl.weightTons}T)
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] font-mono text-teal-800">
                    <span>Matched Truck: {rl.matchedForTruckId}</span>
                    <span className="inline-flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      {rl.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
