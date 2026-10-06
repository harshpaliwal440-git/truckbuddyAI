'use client';

import React, { useState, useMemo } from 'react';
import { useAdminPlatform, PlatformBooking } from '@/lib/admin-store';
import {
  CalendarCheck2,
  Search,
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  Navigation,
} from 'lucide-react';

export default function AdminBookingsPage() {
  const { bookings, updateBookingStatus } = useAdminPlatform();

  const [statusTab, setStatusTab] = useState<
    'ALL' | PlatformBooking['bookingStatus']
  >('ALL');
  const [search, setSearch] = useState('');

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (statusTab !== 'ALL' && b.bookingStatus !== statusTab) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const match =
          b.id.toLowerCase().includes(q) ||
          b.shipmentId.toLowerCase().includes(q) ||
          b.shipperName.toLowerCase().includes(q) ||
          b.transporterName.toLowerCase().includes(q) ||
          b.driverName.toLowerCase().includes(q) ||
          b.vehicleNumber.toLowerCase().includes(q) ||
          b.originCity.toLowerCase().includes(q) ||
          b.destinationCity.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [bookings, statusTab, search]);

  const statusTabs: {
    id: 'ALL' | PlatformBooking['bookingStatus'];
    label: string;
    count: number;
  }[] = [
    { id: 'ALL', label: 'All Bookings', count: bookings.length },
    {
      id: 'PENDING',
      label: 'Pending',
      count: bookings.filter((b) => b.bookingStatus === 'PENDING').length,
    },
    {
      id: 'ACCEPTED',
      label: 'Accepted',
      count: bookings.filter((b) => b.bookingStatus === 'ACCEPTED').length,
    },
    {
      id: 'ACTIVE',
      label: 'Active',
      count: bookings.filter((b) => b.bookingStatus === 'ACTIVE').length,
    },
    {
      id: 'COMPLETED',
      label: 'Completed',
      count: bookings.filter((b) => b.bookingStatus === 'COMPLETED').length,
    },
    {
      id: 'CANCELLED',
      label: 'Cancelled',
      count: bookings.filter((b) => b.bookingStatus === 'CANCELLED').length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Booking Management
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Monitor and manage all primary freight dispatches and AI-matched
            return-load backhaul bookings across every lifecycle stage.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-white border border-slate-200 rounded-lg px-3.5 py-2">
          <CalendarCheck2 className="w-4 h-4 text-teal-700" />
          <span>
            Total Value: ₹
            {bookings
              .reduce((acc, b) => acc + b.agreedAmountInr, 0)
              .toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Segmented Status Tabs (All / Pending / Accepted / Active / Completed / Cancelled) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {statusTabs.map((t) => {
          const active = statusTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setStatusTab(t.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                active
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div
                className={`text-[11px] font-semibold uppercase tracking-wider ${
                  active ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {t.label}
              </div>
              <div className="text-2xl font-bold font-mono mt-1">{t.count}</div>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookings by Booking ID, Shipment ID, shipper, transporter, driver, or city..."
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
          />
        </div>
      </div>

      {/* Bookings Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-mono uppercase text-slate-500">
                <th className="py-3.5 px-4">Booking & Shipment</th>
                <th className="py-3.5 px-4">Load Type & AI Score</th>
                <th className="py-3.5 px-4">Shipper & Transporter</th>
                <th className="py-3.5 px-4">Corridor & Cargo</th>
                <th className="py-3.5 px-4">Booking Status</th>
                <th className="py-3.5 px-4 text-right">Agreed Rate & Fee</th>
                <th className="py-3.5 px-4 text-right">Update Lifecycle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredBookings.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900">
                      {b.id}
                    </div>
                    <div className="font-mono text-[11px] text-slate-500">
                      Ref: {b.shipmentId}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {b.createdAt}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        b.loadType === 'RETURN_BACKHAUL'
                          ? 'bg-teal-50 text-teal-800 border border-teal-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {b.loadType === 'RETURN_BACKHAUL' && (
                        <Sparkles className="w-3 h-3 text-teal-600" />
                      )}
                      {b.loadType}
                    </span>
                    <div className="font-mono text-[11px] text-teal-700 font-semibold mt-1">
                      AI Match: {b.aiMatchScore}%
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">
                      {b.shipperName}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      {b.transporterName}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      {b.vehicleNumber} · {b.driverName}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">
                      {b.originCity} → {b.destinationCity}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                      {b.material} ({b.weightTons}T)
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
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
                      {b.bookingStatus === 'ACTIVE' && (
                        <Navigation className="w-3 h-3" />
                      )}
                      {b.bookingStatus === 'COMPLETED' && (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      {b.bookingStatus === 'PENDING' && (
                        <Clock className="w-3 h-3" />
                      )}
                      {b.bookingStatus === 'CANCELLED' && (
                        <XCircle className="w-3 h-3" />
                      )}
                      {b.bookingStatus}
                    </span>
                    <div className="text-[10px] font-mono text-slate-500 mt-1">
                      Payment: {b.paymentStatus}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono">
                    <div className="font-bold text-slate-900">
                      ₹{b.agreedAmountInr.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {b.isFreeRide
                        ? '2-Free-Rides Applied (₹0)'
                        : `Pro Fee: ₹${b.platformFeeInr}`}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <select
                      aria-label={`Change status for ${b.id}`}
                      value={b.bookingStatus}
                      onChange={(e) =>
                        updateBookingStatus(
                          b.id,
                          e.target.value as PlatformBooking['bookingStatus']
                        )
                      }
                      className="h-8 px-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-white cursor-pointer focus:outline-none focus:border-teal-600"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="ACCEPTED">Accepted</option>
                      <option value="ACTIVE">Active</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
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
