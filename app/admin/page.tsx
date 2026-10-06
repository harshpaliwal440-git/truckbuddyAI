'use client';

import React from 'react';
import Link from 'next/link';
import { useAdminPlatform } from '@/lib/admin-store';
import {
  Users,
  Building2,
  Truck,
  UserCheck,
  Package,
  Navigation,
  CheckCircle2,
  IndianRupee,
  ArrowUpRight,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  MapPin,
  Receipt,
} from 'lucide-react';

export default function AdminDashboardOverviewPage() {
  const {
    users,
    trucks,
    drivers,
    shipments,
    bookings,
    bills,
    issues,
    monthlyAnalytics,
  } = useAdminPlatform();

  const totalShippers = users.filter((u) => u.role === 'shipper').length;
  const totalTransporters = users.filter(
    (u) => u.role === 'transporter'
  ).length;
  const totalDrivers = users.filter((u) => u.role === 'driver').length;
  const totalUsers = users.length;
  const totalTrucks = trucks.length;

  const activeShipments = shipments.filter((s) => s.status === 'ACTIVE').length;
  const activeTrips = trucks.filter(
    (t) => t.status === 'EN_ROUTE' || t.status === 'STAYING_AT_HALT'
  ).length;
  const completedBookings = bookings.filter(
    (b) => b.bookingStatus === 'COMPLETED'
  ).length;

  // Platform Revenue/Commission calculation (Pro Passes + Platform fees + Paid Bills volume)
  const proPassSubscribers = users.filter(
    (u) => u.subscriptionTier === 'PRO_PASS_500'
  ).length;
  const platformFeeTotal = bills.reduce(
    (acc, b) => acc + b.platformFeeInr,
    0
  );
  const totalPlatformCommissionInr =
    proPassSubscribers * 500 + platformFeeTotal + 342000; // Sep 2026 cumulative platform commission
  const grossFreightSettledInr = bills.reduce(
    (acc, b) => acc + b.totalPayableInr,
    0
  );

  const kpiCards = [
    {
      label: 'Total Platform Users',
      value: totalUsers,
      sub: `${totalShippers} Shippers · ${totalTransporters} Transporters · ${totalDrivers} Drivers`,
      icon: Users,
      href: '/admin/users',
      accent: 'text-slate-900',
    },
    {
      label: 'Total Shippers',
      value: totalShippers,
      sub: `${users.filter((u) => u.role === 'shipper' && u.verificationStatus === 'VERIFIED').length} GST Verified Enterprises`,
      icon: Building2,
      href: '/admin/users?role=shipper',
      accent: 'text-teal-700',
    },
    {
      label: 'Total Transporters',
      value: totalTransporters,
      sub: '39 Registered Corridor Trucks',
      icon: Truck,
      href: '/admin/users?role=transporter',
      accent: 'text-teal-700',
    },
    {
      label: 'Total Drivers',
      value: Math.max(totalDrivers, drivers.length),
      sub: 'Avg Rating 4.89★ · Monsoon Certified',
      icon: UserCheck,
      href: '/admin/drivers',
      accent: 'text-teal-700',
    },
    {
      label: 'Total Active Trucks',
      value: totalTrucks,
      sub: 'Live GPS & Weather Telemetry Active',
      icon: Truck,
      href: '/admin/trucks',
      accent: 'text-slate-900',
    },
    {
      label: 'Active Shipments',
      value: activeShipments,
      sub: `${shipments.filter((s) => s.type === 'AI_RETURN_BACKHAUL').length} AI Return Backhauls Matched`,
      icon: Package,
      href: '/admin/shipments',
      accent: 'text-emerald-700',
    },
    {
      label: 'Active Highway Trips',
      value: activeTrips,
      sub: 'Indore ⇄ Mumbai & Ahmedabad → Mumbai',
      icon: Navigation,
      href: '/admin/operations',
      accent: 'text-emerald-700',
    },
    {
      label: 'Completed Bookings',
      value: completedBookings,
      sub: `${bookings.length} Total Platform Bookings`,
      icon: CheckCircle2,
      href: '/admin/bookings',
      accent: 'text-slate-900',
    },
    {
      label: 'Platform Revenue & Commission',
      value: `₹${totalPlatformCommissionInr.toLocaleString('en-IN')}`,
      sub: `₹${grossFreightSettledInr.toLocaleString('en-IN')} Recent Invoices · ${proPassSubscribers} Pro Passes (₹500/mo)`,
      icon: IndianRupee,
      href: '/admin/payments',
      accent: 'text-teal-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Platform Executive Overview
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Real-time desktop command center for Shippers, Transporters,
            Drivers, AI Backhaul Matching, and Razorpay GST Billing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/operations"
            className="h-10 px-4 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <MapPin className="w-4 h-4 text-teal-700" />
            <span>Live Corridor Map</span>
          </Link>
          <Link
            href="/admin/shipments"
            className="h-10 px-4 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>Manage Shipments</span>
          </Link>
        </div>
      </div>

      {/* 9 Executive KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:border-teal-600/50 transition-colors flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.label}
                </span>
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-teal-50 flex items-center justify-center text-slate-700 group-hover:text-teal-700 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div
                  className={`text-2xl font-bold font-mono tracking-tight ${card.accent}`}
                >
                  {card.value}
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
                  <span className="truncate">{card.sub}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 shrink-0" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Middle Row: Live Fleet Telemetry Table + Monthly Revenue & Backhaul Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Corridor Fleet & Trips Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Active Corridor Trips & Telemetry
              </h2>
              <p className="text-xs text-slate-500">
                Synchronized with TruckBuddy Mobile Driver & Transporter apps
              </p>
            </div>
            <Link
              href="/admin/operations"
              className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
            >
              <span>Open Live Control</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-mono uppercase text-slate-500">
                  <th className="py-3 px-4">Truck & Transporter</th>
                  <th className="py-3 px-4">Corridor & Hub</th>
                  <th className="py-3 px-4">Captain</th>
                  <th className="py-3 px-4">Status & Progress</th>
                  <th className="py-3 px-4 text-right">Freight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {trucks.map((truck) => (
                  <tr
                    key={truck.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900">
                        {truck.vehicleNumber}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {truck.transporterName}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        {truck.originCity} → {truck.destinationCity}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                        {truck.currentLocationName}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">
                        {truck.driverName}
                      </div>
                      <div className="font-mono text-[11px] text-amber-700">
                        ★ {truck.driverRating.toFixed(2)} (
                        {truck.driverReviewsCount})
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                            truck.status === 'EN_ROUTE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : truck.status === 'STAYING_AT_HALT'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          {truck.status}
                        </span>
                        <span className="font-mono font-bold text-slate-700">
                          {truck.progressPercent}%
                        </span>
                      </div>
                      <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                        <div
                          className="h-full bg-teal-600 rounded-full"
                          style={{ width: `${truck.progressPercent}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      ₹{truck.freightAmountInr.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Platform Growth & AI Backhaul Impact (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Bookings & AI Backhaul Volume (6M)
              </h2>
              <p className="text-xs text-slate-500">
                Outbound vs Zero-Deadhead Return Loads
              </p>
            </div>
            <Link
              href="/admin/analytics"
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              Full Analytics →
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            {monthlyAnalytics.map((m) => {
              const pct = Math.round((m.bookingsCount / 190) * 100);
              const backhaulRatio = Math.round(
                (m.backhaulCount / m.bookingsCount) * 100
              );
              return (
                <div key={m.month} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-semibold text-slate-700">
                      {m.month}
                    </span>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-slate-600">
                        {m.bookingsCount} Bookings ({backhaulRatio}% Backhaul)
                      </span>
                      <span className="font-bold text-teal-700">
                        ₹{(m.platformRevenueInr / 1000).toFixed(1)}k Rev
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-md overflow-hidden flex">
                    <div
                      className="h-full bg-slate-800"
                      style={{
                        width: `${Math.round(
                          (m.outboundCount / 190) * 100
                        )}%`,
                      }}
                      title={`Outbound: ${m.outboundCount}`}
                    />
                    <div
                      className="h-full bg-teal-500"
                      style={{
                        width: `${Math.round(
                          (m.backhaulCount / 190) * 100
                        )}%`,
                      }}
                      title={`AI Backhaul: ${m.backhaulCount}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-800" />
                Outbound Primary
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-teal-500" />
                AI Return Backhaul
              </span>
            </div>
            <span className="font-mono font-semibold text-emerald-700">
              +112% YoY Efficiency
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Bookings & Payments + Active Alerts & Disputes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Platform Bookings & Invoices (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Recent Bookings & GST Invoices
              </h2>
              <p className="text-xs text-slate-500">
                Includes First-2-Free Rides & ₹500 Pro Pass settlements
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/bookings"
                className="text-xs font-semibold text-teal-700 hover:underline"
              >
                All Bookings →
              </Link>
              <Link
                href="/admin/payments"
                className="text-xs font-semibold text-slate-700 hover:underline flex items-center gap-1"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Payments</span>
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-mono uppercase text-slate-500">
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Shipper & Transporter</th>
                  <th className="py-3 px-4">Route & Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {bookings.slice(0, 5).map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900">
                        {b.id}
                      </div>
                      <div className="font-mono text-[10px] text-slate-500">
                        {b.vehicleNumber}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 truncate max-w-[190px]">
                        {b.shipperName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {b.transporterName}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">
                        {b.originCity} → {b.destinationCity}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold ${
                          b.loadType === 'RETURN_BACKHAUL'
                            ? 'text-teal-700'
                            : 'text-slate-500'
                        }`}
                      >
                        {b.loadType === 'RETURN_BACKHAUL' && (
                          <Sparkles className="w-3 h-3" />
                        )}
                        {b.loadType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          b.bookingStatus === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.bookingStatus === 'COMPLETED'
                            ? 'bg-slate-900 text-white'
                            : b.bookingStatus === 'ACCEPTED'
                            ? 'bg-teal-100 text-teal-800'
                            : b.bookingStatus === 'CANCELLED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="font-mono font-bold text-slate-900">
                        ₹{b.agreedAmountInr.toLocaleString('en-IN')}
                      </div>
                      <div className="font-mono text-[10px] text-slate-500">
                        {b.isFreeRide
                          ? 'Free Ride (₹0 Fee)'
                          : `Fee: ₹${b.platformFeeInr}`}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Critical Weather, Disputes & Notifications Feed (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Active Incidents, Weather & Disputes
              </h2>
              <p className="text-xs text-slate-500">
                Real-time corridor alerts & user tickets
              </p>
            </div>
            <Link
              href="/admin/issues"
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              Manage Issues →
            </Link>
          </div>

          <div className="space-y-2.5">
            {issues.map((iss) => (
              <div
                key={iss.id}
                className="p-3 rounded-xl border border-slate-200/90 bg-slate-50/60 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle
                      className={`w-3.5 h-3.5 ${
                        iss.severity === 'CRITICAL'
                          ? 'text-rose-600'
                          : iss.severity === 'HIGH'
                          ? 'text-amber-600'
                          : 'text-teal-700'
                      }`}
                    />
                    <span className="font-mono text-[10px] font-bold text-slate-500">
                      {iss.id} · {iss.category}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      iss.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : iss.status === 'IN_PROGRESS'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {iss.status}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900">
                  {iss.title}
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2">
                  {iss.description}
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                  <span>{iss.reportedByName}</span>
                  <span>{iss.corridor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
