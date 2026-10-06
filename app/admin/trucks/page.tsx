'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdminPlatform } from '@/lib/admin-store';
import {
  Truck,
  UserCheck,
  Search,
  ShieldCheck,
  Fuel,
  Gauge,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function AdminTrucksPage() {
  const { trucks, drivers, verifyTruck, assignDriverToTruck } =
    useAdminPlatform();
  const [search, setSearch] = useState('');

  const filteredTrucks = trucks.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.vehicleNumber.toLowerCase().includes(q) ||
      t.truckType.toLowerCase().includes(q) ||
      t.transporterName.toLowerCase().includes(q) ||
      t.driverName.toLowerCase().includes(q) ||
      t.originCity.toLowerCase().includes(q) ||
      t.destinationCity.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header & Truck/Driver Sub-Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Truck & Driver Fleet Registry
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Inspect heavy commercial vehicles, RC/Fitness verification, assigned
            captains, and live highway telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-200/80 p-1 rounded-xl">
          <Link
            href="/admin/trucks"
            className="h-9 px-4 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center gap-2 shadow-2xs"
          >
            <Truck className="w-3.5 h-3.5 text-teal-400" />
            <span>Trucks ({trucks.length})</span>
          </Link>
          <Link
            href="/admin/drivers"
            className="h-9 px-4 rounded-lg text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-2"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Drivers ({drivers.length})</span>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by vehicle registration (e.g., MP 09 HH 8821), truck type, transporter, or assigned driver..."
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
          />
        </div>
      </div>

      {/* Fleet Trucks Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-mono uppercase text-slate-500">
                <th className="py-3.5 px-4">Vehicle Info & Specs</th>
                <th className="py-3.5 px-4">Transporter Fleet</th>
                <th className="py-3.5 px-4">Assigned Driver</th>
                <th className="py-3.5 px-4">Current Position & Corridor</th>
                <th className="py-3.5 px-4">Telemetry</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4 text-right">Reassign Captain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredTrucks.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="font-mono font-bold text-slate-900 text-sm">
                      {t.vehicleNumber}
                    </div>
                    <div className="text-slate-600 font-medium mt-0.5">
                      {t.truckType}
                    </div>
                    <div className="font-mono text-[11px] text-slate-400">
                      Capacity: {t.capacityTons}T · Loaded: {t.cargoWeightTons}T
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-900">
                      {t.transporterName}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Shipper: {t.shipperName}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">
                      {t.driverName}
                    </div>
                    <div className="font-mono text-[11px] text-amber-700">
                      ★ {t.driverRating.toFixed(2)} ({t.driverReviewsCount}{' '}
                      reviews)
                    </div>
                    <div className="font-mono text-[10px] text-slate-400">
                      {t.driverPhone}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-900 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      <span>
                        {t.originCity} → {t.destinationCity}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {t.currentLocationName}
                    </div>
                    <div className="font-mono text-[10px] text-teal-700 mt-0.5">
                      {t.etaText} ({t.progressPercent}%)
                    </div>
                  </td>

                  <td className="py-4 px-4 font-mono">
                    <div className="flex items-center gap-1.5 text-slate-800">
                      <Gauge className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.speedKmh} km/h</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 mt-1">
                      <Fuel className="w-3.5 h-3.5 text-slate-400" />
                      <span>Fuel: {t.fuelLevelPercent}%</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <button
                      onClick={() =>
                        verifyTruck(t.id, !t.transporterVerified)
                      }
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold cursor-pointer ${
                        t.transporterVerified
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.transporterVerified ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>RC & FITNESS VERIFIED</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3" />
                          <span>PENDING FITNESS</span>
                        </>
                      )}
                    </button>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <select
                      aria-label={`Assign driver for ${t.vehicleNumber}`}
                      value={t.driverId}
                      onChange={(e) =>
                        assignDriverToTruck(t.id, e.target.value)
                      }
                      className="h-9 px-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 bg-white cursor-pointer focus:outline-none focus:border-teal-600"
                    >
                      {drivers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.rating.toFixed(2)}★)
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
