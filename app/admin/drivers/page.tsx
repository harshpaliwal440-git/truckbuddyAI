'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdminPlatform } from '@/lib/admin-store';
import {
  Truck,
  UserCheck,
  Search,
  Star,
  ShieldCheck,
  Award,
  Phone,
} from 'lucide-react';

export default function AdminDriversPage() {
  const { drivers, trucks, assignDriverToTruck } = useAdminPlatform();
  const [search, setSearch] = useState('');

  const filteredDrivers = drivers.filter((d) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.transporterName.toLowerCase().includes(q) ||
      d.aiBadge.toLowerCase().includes(q) ||
      d.languages.join(' ').toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header & Truck/Driver Sub-Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Driver Management & Safety Ratings
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Customer-rated highway captains, monsoon safety benchmarks,
            assigned vehicles, and verified shipper feedback.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-200/80 p-1 rounded-xl">
          <Link
            href="/admin/trucks"
            className="h-9 px-4 rounded-lg text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-2"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Trucks ({trucks.length})</span>
          </Link>
          <Link
            href="/admin/drivers"
            className="h-9 px-4 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center gap-2 shadow-2xs"
          >
            <UserCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Drivers ({drivers.length})</span>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search drivers by name, transporter fleet, language, or AI safety badge..."
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
          />
        </div>
      </div>

      {/* Drivers Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-mono uppercase text-slate-500">
                <th className="py-3.5 px-4">Captain & Transporter</th>
                <th className="py-3.5 px-4">Customer Rating & Trips</th>
                <th className="py-3.5 px-4">Monsoon Safety & Languages</th>
                <th className="py-3.5 px-4">Latest Shipper Review</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4 text-right">Assigned Truck</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredDrivers.map((d) => {
                const assignedTruck =
                  trucks.find((t) => t.id === d.assignedTruckId) || trucks[0];
                return (
                  <tr
                    key={d.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-400">
                          {d.id}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">
                          {d.name}
                        </span>
                      </div>
                      <div className="text-slate-600 font-medium mt-0.5">
                        {d.transporterName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{d.phone}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{d.rating.toFixed(2)}</span>
                        <span className="text-[10px] font-normal">
                          ({d.totalReviews})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1">
                        {d.completedTrips} Trips · {d.experienceYears} Yrs Exp
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-mono font-bold text-teal-700 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>Safety Score: {d.monsoonSafetyScore}/100</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Languages: {d.languages.join(', ')}
                      </div>
                      <div className="text-[10px] font-semibold text-slate-700 mt-0.5">
                        {d.aiBadge}
                      </div>
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      <p className="text-[11px] text-slate-700 italic line-clamp-2">
                        &ldquo;{d.recentCustomerReview}&rdquo;
                      </p>
                      <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
                        — {d.reviewerCompany}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                        <ShieldCheck className="w-3 h-3" />
                        DL & BACKGROUND VERIFIED
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <select
                        aria-label={`Assign vehicle for ${d.name}`}
                        value={assignedTruck.id}
                        onChange={(e) =>
                          assignDriverToTruck(e.target.value, d.id)
                        }
                        className="h-9 px-2.5 rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-900 bg-white cursor-pointer focus:outline-none focus:border-teal-600"
                      >
                        {trucks.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.vehicleNumber} ({t.originCity}→
                            {t.destinationCity})
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
