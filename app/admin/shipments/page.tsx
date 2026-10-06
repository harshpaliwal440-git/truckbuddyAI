'use client';

import React, { useState, useMemo } from 'react';
import { useAdminPlatform, PlatformShipment } from '@/lib/admin-store';
import {
  Package,
  Search,
  MapPin,
  Truck,
  Sparkles,
  CheckCircle2,
  Clock,
  Navigation,
  Plus,
  Eye,
  X,
} from 'lucide-react';

export default function AdminShipmentsPage() {
  const { shipments, updateShipmentStatus, createAdminShipment } =
    useAdminPlatform();

  const [tab, setTab] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'PENDING'>(
    'ALL'
  );
  const [typeFilter, setTypeFilter] = useState<
    'ALL' | 'OUTBOUND_PRIMARY' | 'AI_RETURN_BACKHAUL'
  >('ALL');
  const [search, setSearch] = useState('');
  const [selectedShipment, setSelectedShipment] =
    useState<PlatformShipment | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const [newForm, setNewForm] = useState({
    shipperName: 'Cipla & Pithampur Auto Components',
    transporterName: 'Malwa Express Fleet Co.',
    originCity: 'Indore',
    pickupHub: 'Pithampur Industrial Area, Sector 3',
    destinationCity: 'Mumbai',
    destinationHub: 'Bhiwandi Logistics Park / JNPT',
    cargoMaterial: 'Sterile Pharma Export Pallets',
    weightTons: 16.0,
    freightRateInr: 48000,
    type: 'OUTBOUND_PRIMARY' as 'OUTBOUND_PRIMARY' | 'AI_RETURN_BACKHAUL',
  });

  const filtered = useMemo(() => {
    return shipments.filter((s) => {
      if (tab !== 'ALL' && s.status !== tab) return false;
      if (typeFilter !== 'ALL' && s.type !== typeFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const match =
          s.id.toLowerCase().includes(q) ||
          s.shipperName.toLowerCase().includes(q) ||
          s.transporterName.toLowerCase().includes(q) ||
          s.originCity.toLowerCase().includes(q) ||
          s.destinationCity.toLowerCase().includes(q) ||
          s.pickupHub.toLowerCase().includes(q) ||
          s.destinationHub.toLowerCase().includes(q) ||
          s.vehicleNumber.toLowerCase().includes(q) ||
          s.cargoMaterial.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [shipments, tab, typeFilter, search]);

  const counts = {
    ALL: shipments.length,
    ACTIVE: shipments.filter((s) => s.status === 'ACTIVE').length,
    COMPLETED: shipments.filter((s) => s.status === 'COMPLETED').length,
    PENDING: shipments.filter((s) => s.status === 'PENDING').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Shipment Management
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Track and control all outbound dispatches and AI-matched return
            backhaul shipments with pickup and destination hub telemetry.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="h-10 px-4 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Platform Shipment</span>
        </button>
      </div>

      {/* Status Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(
          [
            {
              id: 'ALL',
              label: 'All Shipments',
              count: counts.ALL,
              icon: Package,
            },
            {
              id: 'ACTIVE',
              label: 'Active In-Transit',
              count: counts.ACTIVE,
              icon: Navigation,
            },
            {
              id: 'COMPLETED',
              label: 'Completed Deliveries',
              count: counts.COMPLETED,
              icon: CheckCircle2,
            },
            {
              id: 'PENDING',
              label: 'Pending / Scheduled',
              count: counts.PENDING,
              icon: Clock,
            },
          ] as const
        ).map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                active
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div
                  className={`text-xs font-semibold ${
                    active ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {item.label}
                </div>
                <div className="text-2xl font-bold font-mono mt-1">
                  {item.count}
                </div>
              </div>
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  active
                    ? 'bg-white/10 text-teal-300'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Corridor Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Shipment ID, pickup/destination hub, shipper, truck, or material..."
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
          />
        </div>

        <select
          aria-label="Filter by Shipment Type"
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(
              e.target.value as
                | 'ALL'
                | 'OUTBOUND_PRIMARY'
                | 'AI_RETURN_BACKHAUL'
            )
          }
          className="h-10 px-3.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-teal-600"
        >
          <option value="ALL">All Load Types (Outbound + Backhaul)</option>
          <option value="OUTBOUND_PRIMARY">Outbound Primary Shipments</option>
          <option value="AI_RETURN_BACKHAUL">
            AI Return Backhaul Shipments
          </option>
        </select>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-mono uppercase text-slate-500">
                <th className="py-3.5 px-4">Shipment & Type</th>
                <th className="py-3.5 px-4">Pickup & Destination Hubs</th>
                <th className="py-3.5 px-4">Shipper & Cargo</th>
                <th className="py-3.5 px-4">Fleet & Captain</th>
                <th className="py-3.5 px-4">Status & Progress</th>
                <th className="py-3.5 px-4 text-right">Freight</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900">
                      {s.id}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        s.type === 'AI_RETURN_BACKHAUL'
                          ? 'bg-teal-50 text-teal-800 border border-teal-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {s.type === 'AI_RETURN_BACKHAUL' && (
                        <Sparkles className="w-3 h-3 text-teal-600" />
                      )}
                      {s.type === 'AI_RETURN_BACKHAUL'
                        ? 'AI BACKHAUL'
                        : 'OUTBOUND'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      <span>
                        {s.originCity} → {s.destinationCity}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      <strong>Pickup:</strong> {s.pickupHub}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      <strong>Drop:</strong> {s.destinationHub}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">
                      {s.shipperName}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {s.cargoMaterial} ({s.weightTons}T · {s.distanceKm} km)
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-slate-500" />
                      <span>{s.vehicleNumber}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      {s.transporterName}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Capt. {s.driverName}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          s.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.status === 'COMPLETED'
                            ? 'bg-slate-900 text-white'
                            : s.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {s.status}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-slate-700">
                        {s.progressPercent}%
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 truncate max-w-[180px]">
                      {s.etaText}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono">
                    <div className="font-bold text-slate-900">
                      ₹{s.freightRateInr.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Fee: ₹{s.platformCommissionInr}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {s.status !== 'COMPLETED' && (
                        <button
                          onClick={() =>
                            updateShipmentStatus(
                              s.id,
                              s.status === 'PENDING' ? 'ACTIVE' : 'COMPLETED',
                              s.status === 'PENDING' ? 25 : 100
                            )
                          }
                          className="h-8 px-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-semibold cursor-pointer"
                        >
                          {s.status === 'PENDING' ? 'Dispatch' : 'Complete'}
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedShipment(s)}
                        className="h-8 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shipment Details Modal */}
      {selectedShipment && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-700">
                    {selectedShipment.id}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold">
                    Booking: {selectedShipment.bookingId}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedShipment.originCity} →{' '}
                  {selectedShipment.destinationCity}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedShipment.highwayCorridor} ·{' '}
                  {selectedShipment.distanceKm} km
                </p>
              </div>
              <button
                onClick={() => setSelectedShipment(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="text-[10px] font-mono uppercase text-slate-400">
                  Pickup Origin Hub
                </div>
                <div className="font-bold text-slate-900">
                  {selectedShipment.originCity}
                </div>
                <div className="text-slate-600">
                  {selectedShipment.pickupHub}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="text-[10px] font-mono uppercase text-slate-400">
                  Destination Drop Hub
                </div>
                <div className="font-bold text-slate-900">
                  {selectedShipment.destinationCity}
                </div>
                <div className="text-slate-600">
                  {selectedShipment.destinationHub}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="text-[10px] font-mono uppercase text-slate-400">
                  Shipper & Cargo
                </div>
                <div className="font-bold text-slate-900">
                  {selectedShipment.shipperName}
                </div>
                <div className="text-slate-600">
                  {selectedShipment.cargoMaterial} (
                  {selectedShipment.weightTons} Tons)
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="text-[10px] font-mono uppercase text-slate-400">
                  Transporter & Assigned Captain
                </div>
                <div className="font-bold text-slate-900">
                  {selectedShipment.transporterName} (
                  {selectedShipment.vehicleNumber})
                </div>
                <div className="text-slate-600">
                  {selectedShipment.driverName} · {selectedShipment.driverPhone}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 text-xs space-y-1">
              <div className="font-bold text-teal-900">
                Live Position & Weather Advisory ({selectedShipment.progressPercent}%)
              </div>
              <div className="text-teal-800">
                {selectedShipment.currentLocation} · {selectedShipment.etaText}
              </div>
              <div className="text-[11px] text-teal-700">
                {selectedShipment.weatherAdvisory}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    updateShipmentStatus(selectedShipment.id, 'ACTIVE', 55);
                    setSelectedShipment({
                      ...selectedShipment,
                      status: 'ACTIVE',
                      progressPercent: 55,
                    });
                  }}
                  className="h-9 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer"
                >
                  Set Active (55%)
                </button>
                <button
                  onClick={() => {
                    updateShipmentStatus(selectedShipment.id, 'COMPLETED', 100);
                    setSelectedShipment({
                      ...selectedShipment,
                      status: 'COMPLETED',
                      progressPercent: 100,
                    });
                  }}
                  className="h-9 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Mark Delivered (100%)
                </button>
              </div>
              <button
                onClick={() => setSelectedShipment(null)}
                className="h-9 px-4 rounded-lg bg-slate-900 text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Shipment Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createAdminShipment(newForm);
              setIsNewModalOpen(false);
            }}
            className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Create & Dispatch Platform Shipment
              </h3>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Origin City
                </label>
                <input
                  type="text"
                  value={newForm.originCity}
                  onChange={(e) =>
                    setNewForm({ ...newForm, originCity: e.target.value })
                  }
                  required
                  className="w-full h-9 px-3 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pickup Hub
                </label>
                <input
                  type="text"
                  value={newForm.pickupHub}
                  onChange={(e) =>
                    setNewForm({ ...newForm, pickupHub: e.target.value })
                  }
                  required
                  className="w-full h-9 px-3 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Destination City
                </label>
                <input
                  type="text"
                  value={newForm.destinationCity}
                  onChange={(e) =>
                    setNewForm({ ...newForm, destinationCity: e.target.value })
                  }
                  required
                  className="w-full h-9 px-3 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Destination Hub
                </label>
                <input
                  type="text"
                  value={newForm.destinationHub}
                  onChange={(e) =>
                    setNewForm({ ...newForm, destinationHub: e.target.value })
                  }
                  required
                  className="w-full h-9 px-3 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Cargo Material
                </label>
                <input
                  type="text"
                  value={newForm.cargoMaterial}
                  onChange={(e) =>
                    setNewForm({ ...newForm, cargoMaterial: e.target.value })
                  }
                  required
                  className="w-full h-9 px-3 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Freight Rate (₹)
                </label>
                <input
                  type="number"
                  value={newForm.freightRateInr}
                  onChange={(e) =>
                    setNewForm({
                      ...newForm,
                      freightRateInr: Number(e.target.value),
                    })
                  }
                  required
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="h-9 px-4 rounded-lg border border-slate-200 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-9 px-4 rounded-lg bg-teal-700 text-white text-xs font-semibold cursor-pointer"
              >
                Create Shipment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
