'use client';

import React from 'react';
import { useAdminPlatform } from '@/lib/admin-store';
import {
  BarChart3,
  TrendingUp,
  Users,
  Truck,
  UserCheck,
  IndianRupee,
  Package,
  Star,
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { monthlyAnalytics, users, drivers } = useAdminPlatform();

  const transporters = users.filter((u) => u.role === 'transporter');
  const latestMonth = monthlyAnalytics[monthlyAnalytics.length - 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Platform Analytics & Corridor Intelligence
        </h1>
        <p className="text-sm text-slate-600 mt-0.5">
          6-month performance trends for Bookings, Shipment Tonnage, Platform
          Revenue, Active Users, Transporter Fleet Utilization, and Driver
          Safety Activity.
        </p>
      </div>

      {/* Top 4 Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
            <span>Sep 2026 Bookings</span>
            <BarChart3 className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {latestMonth.bookingsCount}
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            {latestMonth.outboundCount} Outbound · {latestMonth.backhaulCount}{' '}
            AI Backhauls
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
            <span>Shipment Volume (Tons)</span>
            <Package className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {latestMonth.shipmentTons.toLocaleString('en-IN')} T
          </div>
          <div className="text-xs text-slate-500 mt-1">
            +119% vs Apr 2026 baseline
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
            <span>Monthly Platform Revenue</span>
            <IndianRupee className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-teal-700 mt-2">
            ₹{latestMonth.platformRevenueInr.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Gross GMV: ₹
            {(latestMonth.grossFreightInr / 100000).toFixed(2)} Lakhs
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
            <span>Active Corridor Users</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {latestMonth.activeUsers}
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            {latestMonth.transporterActivityPct}% Fleet ·{' '}
            {latestMonth.driverActivityPct}% Driver Utilization
          </div>
        </div>
      </div>

      {/* Charts Grid: 1) Bookings & Shipment Volume Over Time, 2) Revenue & Active Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Bookings Over Time & Shipment Tonnage */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Bookings Over Time & Shipment Volume
              </h2>
              <p className="text-xs text-slate-500">
                Primary dispatches vs AI-matched return loads & tonnage
              </p>
            </div>
            <TrendingUp className="w-4 h-4 text-teal-700" />
          </div>

          <div className="space-y-3.5">
            {monthlyAnalytics.map((m) => (
              <div key={m.month} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-800">
                    {m.month}
                  </span>
                  <div className="flex items-center gap-4 font-mono text-[11px]">
                    <span className="text-slate-700">
                      <strong>{m.bookingsCount}</strong> Bookings (
                      {m.outboundCount} Out / {m.backhaulCount} Ret)
                    </span>
                    <span className="text-teal-700 font-bold">
                      {m.shipmentTons} Tons
                    </span>
                  </div>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-md overflow-hidden flex">
                  <div
                    className="h-full bg-slate-900"
                    style={{
                      width: `${Math.round((m.outboundCount / 185) * 100)}%`,
                    }}
                  />
                  <div
                    className="h-full bg-teal-500"
                    style={{
                      width: `${Math.round((m.backhaulCount / 185) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Revenue, Active Users, Transporter & Driver Activity */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Platform Revenue & User Activity Rates
              </h2>
              <p className="text-xs text-slate-500">
                Monthly commission revenue, active users, transporter & driver
                activity
              </p>
            </div>
            <IndianRupee className="w-4 h-4 text-teal-700" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-mono uppercase text-slate-500">
                  <th className="py-2.5 px-3">Month</th>
                  <th className="py-2.5 px-3 text-right">Gross GMV</th>
                  <th className="py-2.5 px-3 text-right">Net Revenue</th>
                  <th className="py-2.5 px-3 text-right">Active Users</th>
                  <th className="py-2.5 px-3 text-right">Transporter %</th>
                  <th className="py-2.5 px-3 text-right">Driver %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs font-mono">
                {monthlyAnalytics.map((m) => (
                  <tr key={m.month} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {m.month}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700">
                      ₹{(m.grossFreightInr / 100000).toFixed(2)}L
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-teal-700">
                      ₹{m.platformRevenueInr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-900">
                      {m.activeUsers}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-700">
                      {m.transporterActivityPct}%
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-700">
                      {m.driverActivityPct}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Row: Transporter Activity Leaderboard + Driver Activity Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transporter Activity */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-teal-700" />
              <span>Transporter Fleet Activity & Revenue Share</span>
            </h3>
          </div>

          <div className="space-y-3">
            {transporters.map((tr) => (
              <div
                key={tr.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">
                    {tr.companyName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Owner: {tr.name} · {tr.fleetCount || 8} Trucks · {tr.city}
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="font-bold text-slate-900">
                    ₹{tr.totalVolumeInr.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-teal-700">
                    {tr.totalTripsOrShipments} Trips · ★ {tr.rating.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Driver Activity */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-700" />
              <span>Driver Activity, Trips & Safety Leaderboard</span>
            </h3>
          </div>

          <div className="space-y-3">
            {drivers.map((drv) => (
              <div
                key={drv.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{drv.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {drv.transporterName} · {drv.aiBadge}
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="font-bold text-amber-700 flex items-center justify-end gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>
                      {drv.rating.toFixed(2)} ({drv.totalReviews} reviews)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {drv.completedTrips} Completed Trips · Safety{' '}
                    {drv.monsoonSafetyScore}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
