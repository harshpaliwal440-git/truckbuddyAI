'use client';

import React, { useState } from 'react';
import {
  TruckTelemetry,
  ReturnLoadOffer,
  RideBill,
  DriverOption,
  UserRole,
} from '@/lib/freight-data';
import LiveFreightMap from '@/components/LiveFreightMap';
import AIReturnLoadModule from '@/components/AIReturnLoadModule';
import RAGAndDriverAdvisor from '@/components/RAGAndDriverAdvisor';
import {
  Truck,
  Package,
  PackagePlus,
  MapPin,
  Navigation,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  CreditCard,
  Receipt,
  Bell,
  User,
  Building2,
  Star,
  Clock,
  ChevronRight,
  Wallet,
  History,
  Users,
  ClipboardList,
  Compass,
  Zap,
  ArrowRight,
  Phone,
  Globe,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export type ShipperScreen =
  | 'OVERVIEW'
  | 'CREATE_SHIPMENT'
  | 'ACTIVE_SHIPMENTS'
  | 'BOOKING_STATUS'
  | 'LIVE_TRACKING'
  | 'SHIPMENT_HISTORY'
  | 'AVAILABLE_TRANSPORTERS'
  | 'PAYMENTS'
  | 'NOTIFICATIONS'
  | 'PROFILE';

export type TransporterScreen =
  | 'OVERVIEW'
  | 'AVAILABLE_LOADS'
  | 'MY_BOOKINGS'
  | 'TRUCKS'
  | 'DRIVERS'
  | 'ACTIVE_TRIPS'
  | 'EARNINGS'
  | 'COMPLETED_TRIPS'
  | 'REQUESTS'
  | 'NOTIFICATIONS'
  | 'PROFILE';

export type DriverScreen =
  | 'CURRENT_TRIP'
  | 'ASSIGNED_SHIPMENT'
  | 'PICKUP_LOCATION'
  | 'DESTINATION'
  | 'ROUTE_NAVIGATION'
  | 'TRIP_STATUS'
  | 'RETURN_BACKHAUL'
  | 'TRIP_HISTORY'
  | 'EARNINGS'
  | 'NOTIFICATIONS'
  | 'PROFILE';

interface SharedMobileProps {
  trucks: TruckTelemetry[];
  selectedTruck: TruckTelemetry;
  onSelectTruck: (truckId: string) => void;
  drivers: DriverOption[];
  onSelectDriver: (drv: DriverOption) => void;
  onRateDriver: (driverId: string, stars: number) => void;
  returnLoads: ReturnLoadOffer[];
  bookedLoadIds: string[];
  onBookReturnLoad: (loadInfo: {
    id: string;
    routeLabel: string;
    rateInr: number;
    shipper: string;
  }) => void;
  onPostNewReturnLoad: (newLoad: {
    originCity: string;
    originHub: string;
    destinationCity: string;
    destinationHub: string;
    shipperCompany: string;
    material: string;
    weightTons: number;
    offeredRateInr: number;
  }) => void;
  bills: RideBill[];
  currentBill: RideBill;
  onOpenBillModal: (bill?: RideBill) => void;
  ridesUsed: number;
  isSubscribed: boolean;
  onOpenSubscriptionModal: () => void;
  onSelectRoute: (routeId: string) => void;
  onProgressChange: (newProgress: number) => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onUpdateTruckStatus: (
    newStatus: 'EN_ROUTE' | 'STAYING_AT_HALT',
    newProgress?: number
  ) => void;
  encodedPolylines: Record<string, string>;
  onSwitchRole: (targetRole: UserRole) => void;
  shipperPlan?: 'STANDARD' | 'PREMIUM' | 'GOLD' | null;
  shipperRidesRemaining?: number;
  onSelectShipperPlan?: (plan: 'STANDARD' | 'PREMIUM' | 'GOLD') => void;
  onOpenLanguageModal?: () => void;
}

/* ============================================================================
   1. SHIPPER MOBILE APP DASHBOARD
   ============================================================================ */
export function ShipperMobileApp({
  screen,
  onNavigate,
  props,
}: {
  screen: ShipperScreen;
  onNavigate: (s: ShipperScreen) => void;
  props: SharedMobileProps;
}) {
  const { t, language } = useLanguage();
  const {
    trucks,
    selectedTruck,
    onSelectTruck,
    drivers,
    onSelectDriver,
    onRateDriver,
    bills,
    currentBill,
    onOpenBillModal,
    ridesUsed,
    isSubscribed,
    onOpenSubscriptionModal,
    onPostNewReturnLoad,
    onSelectRoute,
    onProgressChange,
    isSimulating,
    onToggleSimulation,
    encodedPolylines,
    onSwitchRole,
    shipperPlan,
    shipperRidesRemaining,
    onSelectShipperPlan,
    onOpenLanguageModal,
  } = props;

  const [originCity, setOriginCity] = useState('Mumbai');
  const [originHub, setOriginHub] = useState('Bhiwandi Logistics Park Gate 4');
  const [destinationCity, setDestinationCity] = useState('Indore');
  const [destinationHub, setDestinationHub] = useState('Pithampur Sector 2');
  const [material, setMaterial] = useState('Palletized Auto Assemblies');
  const [weightTons, setWeightTons] = useState(16);
  const [offeredRateInr, setOfferedRateInr] = useState(47500);

  const activeRoute =
    selectedTruck.routes.find((r) => r.id === selectedTruck.activeRouteId) ||
    selectedTruck.routes[0];
  const freeLeft = Math.max(0, 2 - ridesUsed);

  if (screen === 'CREATE_SHIPMENT') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-mono font-bold">
              NEW SHIPMENT
            </span>
            <span className="text-xs font-mono text-teal-700 font-semibold">
              {isSubscribed ? 'Pro Pass Active' : `${freeLeft}/2 Free Left`}
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onPostNewReturnLoad({
                originCity,
                originHub,
                destinationCity,
                destinationHub,
                shipperCompany: selectedTruck.shipperName,
                material,
                weightTons,
                offeredRateInr,
              });
              onNavigate('ACTIVE_SHIPMENTS');
            }}
            className="space-y-3.5"
          >
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Pickup City
                </label>
                <input
                  type="text"
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                  required
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Drop City
                </label>
                <input
                  type="text"
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  required
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Pickup Hub
                </label>
                <input
                  type="text"
                  value={originHub}
                  onChange={(e) => setOriginHub(e.target.value)}
                  required
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Delivery Hub
                </label>
                <input
                  type="text"
                  value={destinationHub}
                  onChange={(e) => setDestinationHub(e.target.value)}
                  required
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Cargo Material
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                required
                className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Weight (Tons)
                </label>
                <input
                  type="number"
                  value={weightTons}
                  onChange={(e) => setWeightTons(Number(e.target.value))}
                  required
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Offer Rate (₹)
                </label>
                <input
                  type="number"
                  value={offeredRateInr}
                  onChange={(e) => setOfferedRateInr(Number(e.target.value))}
                  required
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 bg-slate-50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <PackagePlus className="w-4 h-4" />
              <span>Create Shipment & Alert Returning Trucks</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (screen === 'ACTIVE_SHIPMENTS') {
    return (
      <div className="space-y-3">
        {trucks.map((t) => {
          const isSelected = t.id === selectedTruck.id;
          return (
            <div
              key={t.id}
              onClick={() => onSelectTruck(t.id)}
              className={`bg-white rounded-2xl border p-4 space-y-3 cursor-pointer transition-all ${
                isSelected
                  ? 'border-2 border-teal-700 shadow-xs'
                  : 'border-slate-200/90'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-mono text-[11px] font-bold">
                  {t.vehicleNumber}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    t.status === 'STAYING_AT_HALT'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-teal-50 text-teal-800 border border-teal-200'
                  }`}
                >
                  {t.status === 'STAYING_AT_HALT'
                    ? 'HALTED AT PLAZA'
                    : `${t.speedKmh} KM/H`}
                </span>
              </div>

              <div>
                <div className="text-sm font-bold text-slate-900">
                  {t.originCity} → {t.destinationCity}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {t.cargoMaterial} ({t.cargoWeightTons}T)
                </div>
              </div>

              {/* Tappable Transporter & Driver Row */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSwitchRole('transporter');
                  }}
                  className="text-left flex items-center gap-1.5 text-teal-800 font-semibold cursor-pointer hover:underline"
                >
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.transporterName}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSwitchRole('driver');
                  }}
                  className="font-mono text-[11px] text-slate-700 font-semibold cursor-pointer hover:underline"
                >
                  {t.driverName} ({t.driverRating}★)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTruck(t.id);
                    onNavigate('LIVE_TRACKING');
                  }}
                  className="min-h-[42px] rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Live Track</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTruck(t.id);
                    onNavigate('BOOKING_STATUS');
                  }}
                  className="min-h-[42px] rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Booking Status</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (screen === 'BOOKING_STATUS') {
    const steps = [
      {
        title: `Dispatched from ${selectedTruck.originCity}`,
        sub: selectedTruck.originHub,
        done: true,
      },
      {
        title: 'Weather & Highway Check',
        sub: `${activeRoute.highwayTag} (${activeRoute.weatherSafetyScore}% Safe)`,
        done: true,
      },
      {
        title: 'Current Position / Halt Status',
        sub: `${selectedTruck.currentLocationName} — ${selectedTruck.stayingLocationDetail}`,
        done: selectedTruck.progressPercent >= 48,
      },
      {
        title: `Arrival & Unloading at ${selectedTruck.destinationCity}`,
        sub: selectedTruck.destinationHub,
        done: selectedTruck.progressPercent >= 100,
      },
    ];

    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-teal-800 font-semibold">
                {selectedTruck.transporterName}
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {selectedTruck.vehicleNumber} · {selectedTruck.originCity} →{' '}
                {selectedTruck.destinationCity}
              </h3>
            </div>
            <span className="font-mono text-xs font-bold text-teal-700">
              {selectedTruck.progressPercent}%
            </span>
          </div>

          <div className="space-y-3">
            {steps.map((st, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    st.done
                      ? 'bg-teal-700 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {st.done ? '✓' : i + 1}
                </div>
                <div className="flex-1 pb-3 border-b border-slate-100">
                  <div className="text-xs font-bold text-slate-900">
                    {st.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {st.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('LIVE_TRACKING')}
            className="w-full min-h-[44px] rounded-xl bg-teal-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span>Open Live Map & Weather Radar</span>
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'LIVE_TRACKING') {
    return (
      <div className="space-y-3.5">
        {/* Compact Staying & Going Status Strip */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              {selectedTruck.vehicleNumber} · {selectedTruck.transporterName}
            </span>
            <span className="font-mono text-[11px] font-semibold text-teal-700">
              {selectedTruck.etaText}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70">
              <div className="text-[10px] font-mono text-amber-800 font-bold">
                WHERE STAYING
              </div>
              <div className="font-semibold text-slate-900 truncate mt-0.5">
                {selectedTruck.currentLocationName}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="text-[10px] font-mono text-slate-400 font-bold">
                WHERE GOING
              </div>
              <div className="font-semibold text-slate-900 truncate mt-0.5">
                {selectedTruck.destinationCity} Hub
              </div>
            </div>
          </div>
        </div>

        <LiveFreightMap
          truck={selectedTruck}
          selectedRouteId={activeRoute.id}
          onSelectRoute={onSelectRoute}
          onProgressChange={onProgressChange}
          isSimulating={isSimulating}
          onToggleSimulation={onToggleSimulation}
          onOpenReturnLoadModal={() => onNavigate('AVAILABLE_TRANSPORTERS')}
          onOpenBillModal={() => onOpenBillModal(currentBill)}
          encodedPolylines={encodedPolylines}
        />

        {/* Weather Route Comparison Cards */}
        <div className="space-y-2">
          {selectedTruck.routes.map((r) => {
            const active = r.id === activeRoute.id;
            return (
              <div
                key={r.id}
                onClick={() => onSelectRoute(r.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer ${
                  active
                    ? r.recommended
                      ? 'bg-teal-50/40 border-2 border-teal-700'
                      : 'bg-red-50/40 border-2 border-red-600'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    {r.recommended ? '✓ Weather-Safe Route' : '⚠️ Shortest (Flood Risk)'} ·{' '}
                    {r.highwayTag}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-800">
                    {r.distanceKm} km · {r.durationText}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  {r.summaryReason}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (screen === 'SHIPMENT_HISTORY') {
    return (
      <div className="space-y-3">
        {bills.map((b) => (
          <div
            key={b.invoiceId}
            className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-900">
                #{b.invoiceId}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  b.status === 'PAID'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-800'
                }`}
              >
                {b.status === 'PAID' ? 'PAID' : 'BILL READY'}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900">
              {b.originCity} → {b.destinationCity} ({b.distanceKm} km)
            </div>
            <div className="text-xs text-slate-600">
              Transporter: <strong>{b.transporterName}</strong> · Driver:{' '}
              {b.driverName} ({b.driverRating}★)
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-slate-900">
                ₹{b.totalPayableInr.toLocaleString('en-IN')}
              </span>
              <button
                onClick={() => onOpenBillModal(b)}
                className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
              >
                View GST Bill
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (screen === 'AVAILABLE_TRANSPORTERS') {
    return (
      <div className="space-y-4">
        <div className="space-y-2.5">
          <div className="text-xs font-bold text-slate-500 px-1">
            Verified Fleet Transporters (Tap to Open Profile)
          </div>
          {trucks.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-2.5 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.transporterName}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {t.truckType} · {t.vehicleNumber} ({t.capacityTons}T)
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-slate-900">
                  ₹{t.freightAmountInr.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    onSelectTruck(t.id);
                    onNavigate('LIVE_TRACKING');
                  }}
                  className="min-h-[42px] rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold cursor-pointer"
                >
                  Select Fleet
                </button>
                <button
                  onClick={() => {
                    onSelectTruck(t.id);
                    onSwitchRole('transporter');
                  }}
                  className="min-h-[42px] rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
                >
                  Transporter App →
                </button>
              </div>
            </div>
          ))}
        </div>

        <RAGAndDriverAdvisor
          truck={selectedTruck}
          drivers={drivers}
          selectedDriverId={selectedTruck.driverId}
          onSelectDriver={onSelectDriver}
          onRateDriver={onRateDriver}
          mode="BOTH"
        />
      </div>
    );
  }

  if (screen === 'PAYMENTS') {
    return (
      <div className="space-y-4">
        {/* Shipper Membership Plans (Clean stacked on mobile, side-by-side on desktop) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase text-slate-500 font-mono">
              {language === 'hi' ? 'शिपर मेंबरशिप प्लान्स' : 'Shipper Membership Plans'}
            </h3>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {shipperPlan ? `${shipperPlan} Active` : 'Choose Plan'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. STANDARD */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${shipperPlan === 'STANDARD' ? 'border-teal-600 bg-teal-50/40 ring-1 ring-teal-500 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'}`}>
              <div>
                <div className="text-xs font-mono font-bold text-slate-500 uppercase">
                  STANDARD
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
                  ₹500
                </div>
                <div className="text-sm font-bold text-teal-800 mt-0.5">
                  5 Rides
                </div>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                  {language === 'hi' ? '5 माल ढुलाई राइड्स पैकेज' : 'One-time ride package. 5 freight dispatches with live tracking.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectShipperPlan ? onSelectShipperPlan('STANDARD') : onOpenSubscriptionModal()}
                className="w-full min-h-[40px] rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'प्लान चुनें (₹500)' : 'Choose Plan (₹500)'}</span>
              </button>
            </div>

            {/* 2. PREMIUM */}
            <div className={`p-4 rounded-2xl border-2 flex flex-col justify-between space-y-3 transition-all relative ${shipperPlan === 'PREMIUM' ? 'border-teal-600 bg-teal-50/50 ring-1 ring-teal-500 shadow-xs' : 'border-teal-600 bg-gradient-to-b from-teal-50/40 to-white shadow-xs'}`}>
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-teal-700 text-white font-mono text-[9px] font-bold uppercase tracking-wider">
                {language === 'hi' ? 'लोकप्रिय' : 'Popular'}
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-teal-700 uppercase">
                  PREMIUM
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
                  ₹1,000
                </div>
                <div className="text-sm font-bold text-teal-800 mt-0.5">
                  15 Days
                </div>
                <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                  {language === 'hi' ? '15 दिनों की असीमित सब्सक्रिप्शन' : '15 days subscription. Unlimited dispatches with live tracking.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectShipperPlan ? onSelectShipperPlan('PREMIUM') : onOpenSubscriptionModal()}
                className="w-full min-h-[40px] rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'सब्सक्राइब करें (₹1,000)' : 'Subscribe (₹1,000)'}</span>
              </button>
            </div>

            {/* 3. GOLD */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${shipperPlan === 'GOLD' ? 'border-teal-600 bg-teal-50/40 ring-1 ring-teal-500 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'}`}>
              <div>
                <div className="text-xs font-mono font-bold text-slate-500 uppercase">
                  GOLD
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
                  ₹2,200
                </div>
                <div className="text-sm font-bold text-teal-800 mt-0.5">
                  3 Months
                </div>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                  {language === 'hi' ? '3 महीने की तिमाही सब्सक्रिप्शन' : '3 months quarterly subscription. Best enterprise value.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectShipperPlan ? onSelectShipperPlan('GOLD') : onOpenSubscriptionModal()}
                className="w-full min-h-[40px] rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'सब्सक्राइब करें (₹2,200)' : 'Subscribe (₹2,200)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* GST Bills & Razorpay Checkout List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-400 px-1">
            GST Freight Invoices & Razorpay
          </h3>
          {bills.map((b) => (
            <div
              key={b.invoiceId}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {b.transporterName}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    Invoice #{b.invoiceId} · {b.originCity} → {b.destinationCity}
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-slate-900">
                  ₹{b.totalPayableInr.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={() => onOpenBillModal(b)}
                className={`w-full min-h-[44px] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                  b.status === 'PAID'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-teal-700 text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>
                  {b.status === 'PAID'
                    ? `Paid via Razorpay (${b.razorpayPaymentId})`
                    : `Pay ₹${b.totalPayableInr.toLocaleString('en-IN')} via Razorpay`}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'NOTIFICATIONS') {
    const alerts = [
      {
        tag: 'WEATHER SAFE',
        title: `${selectedTruck.vehicleNumber} routed via NH-48 Flood-Free Corridor`,
        sub: `Avoided Kasara Ghat heavy rain (36mm/hr). ETA: ${selectedTruck.etaText}`,
      },
      {
        tag: 'DRIVER RATING',
        title: `Captain ${selectedTruck.driverName} (${selectedTruck.driverRating}★) assigned`,
        sub: `Operated by ${selectedTruck.transporterName}`,
      },
      {
        tag: 'RAZORPAY BILL',
        title: `GST Invoice #${currentBill.invoiceId} ready for settlement`,
        sub: `Total: ₹${currentBill.totalPayableInr.toLocaleString('en-IN')} (5% GTA GST included)`,
      },
    ];
    return (
      <div className="space-y-3">
        {alerts.map((a, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-1"
          >
            <span className="text-[10px] font-mono font-bold text-teal-700">
              {a.tag}
            </span>
            <div className="text-xs font-bold text-slate-900">{a.title}</div>
            <div className="text-xs text-slate-500">{a.sub}</div>
          </div>
        ))}
      </div>
    );
  }

  if (screen === 'PROFILE') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold text-base">
              SH
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-mono font-semibold">
                VERIFIED SHIPPER
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {selectedTruck.shipperName}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                GSTIN: 27AABCC4491E1Z2
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] font-mono text-slate-400">
                {language === 'hi' ? 'सक्रिय मेंबरशिप' : 'MEMBERSHIP PLAN'}
              </div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {shipperPlan
                  ? shipperPlan === 'STANDARD'
                    ? `Standard (${shipperRidesRemaining ?? 5} Rides)`
                    : shipperPlan === 'PREMIUM'
                    ? 'Premium (15 Days)'
                    : 'Gold (3 Months)'
                  : 'No Active Plan'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] font-mono text-slate-400">
                {language === 'hi' ? 'सक्रिय ट्रक' : 'ACTIVE SHIPMENTS'}
              </div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {trucks.length} Trucks Live
              </div>
            </div>
          </div>

          <button
            onClick={onOpenSubscriptionModal}
            className="w-full min-h-[44px] rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
          >
            {language === 'hi' ? 'शिपर मेंबरशिप प्लान्स देखें' : 'View Shipper Membership Plans'}
          </button>

          {/* Language Selection Setting */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-700" />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {language === 'hi' ? 'भाषा (Language)' : 'Language / भाषा'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {language === 'hi' ? 'हिंदी सक्रिय है' : 'English is active'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenLanguageModal}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
            >
              {language === 'hi' ? '🇮🇳 भाषा बदलें' : '🇬🇧 Change'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT: SHIPPER OVERVIEW (HOME SCREEN)
  const quickMenu: Array<{
    id: ShipperScreen;
    label: string;
    icon: any;
    badge?: string;
  }> = [
    { id: 'CREATE_SHIPMENT', label: 'Create Shipment', icon: PackagePlus },
    {
      id: 'ACTIVE_SHIPMENTS',
      label: 'Active Shipments',
      icon: Truck,
      badge: `${trucks.length}`,
    },
    { id: 'BOOKING_STATUS', label: 'Booking Status', icon: ClipboardList },
    { id: 'LIVE_TRACKING', label: 'Live Tracking', icon: MapPin },
    {
      id: 'AVAILABLE_TRANSPORTERS',
      label: 'Transporters & AI',
      icon: Users,
    },
    { id: 'PAYMENTS', label: 'Razorpay & Bills', icon: CreditCard },
    { id: 'SHIPMENT_HISTORY', label: 'Shipment History', icon: History },
    { id: 'NOTIFICATIONS', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-4">
      {/* Shipper Hero Status Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-teal-300 font-semibold">
              SHIPPER DASHBOARD
            </span>
            <h2 className="text-base font-bold text-white mt-0.5">
              {selectedTruck.shipperName}
            </h2>
          </div>
          <button
            onClick={onOpenSubscriptionModal}
            className="px-2.5 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 font-mono text-[10px] font-semibold cursor-pointer"
          >
            {shipperPlan ? `${shipperPlan} Active` : 'Membership Plans'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={() => onNavigate('CREATE_SHIPMENT')}
            className="min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <PackagePlus className="w-4 h-4" />
            <span>Create Shipment</span>
          </button>
          <button
            onClick={() => onNavigate('LIVE_TRACKING')}
            className="min-h-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-teal-400" />
            <span>Track Live Cargo</span>
          </button>
        </div>
      </div>

      {/* Active Shipment Summary Card */}
      <div
        onClick={() => onNavigate('LIVE_TRACKING')}
        className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-2.5 cursor-pointer shadow-2xs"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase text-teal-700">
            LIVE SHIPMENT · {selectedTruck.vehicleNumber}
          </span>
          <span className="font-mono text-xs font-bold text-slate-700">
            {selectedTruck.progressPercent}% · {selectedTruck.etaText}
          </span>
        </div>
        <div className="text-sm font-bold text-slate-900">
          {selectedTruck.originCity} → {selectedTruck.destinationCity}
        </div>
        <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-100">
          <span className="flex items-center gap-1 font-medium text-slate-800">
            <Building2 className="w-3.5 h-3.5 text-teal-700" />
            {selectedTruck.transporterName}
          </span>
          <span className="font-mono text-[11px]">
            Driver: {selectedTruck.driverName} ({selectedTruck.driverRating}★)
          </span>
        </div>
      </div>

      {/* 2x4 Mobile Icon Grid for All Shipper Sections */}
      <div>
        <div className="text-xs font-bold text-slate-500 px-1 mb-2">
          Shipper Services
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {quickMenu.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="min-h-[60px] p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 flex items-center justify-between text-left cursor-pointer active:scale-[0.99] transition-all shadow-2xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {item.label}
                  </span>
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-mono text-[10px] font-bold">
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   2. TRANSPORTER MOBILE APP DASHBOARD
   ============================================================================ */
export function TransporterMobileApp({
  screen,
  onNavigate,
  props,
}: {
  screen: TransporterScreen;
  onNavigate: (s: TransporterScreen) => void;
  props: SharedMobileProps;
}) {
  const { t, language } = useLanguage();
  const {
    trucks,
    selectedTruck,
    onSelectTruck,
    drivers,
    onSelectDriver,
    onRateDriver,
    returnLoads,
    bookedLoadIds,
    onBookReturnLoad,
    bills,
    currentBill,
    onOpenBillModal,
    ridesUsed,
    isSubscribed,
    onOpenSubscriptionModal,
    onSelectRoute,
    onProgressChange,
    isSimulating,
    onToggleSimulation,
    encodedPolylines,
    onSwitchRole,
    onOpenLanguageModal,
  } = props;

  const activeRoute =
    selectedTruck.routes.find((r) => r.id === selectedTruck.activeRouteId) ||
    selectedTruck.routes[0];
  const freeLeft = Math.max(0, 2 - ridesUsed);

  if (screen === 'AVAILABLE_LOADS' || screen === 'REQUESTS') {
    return (
      <AIReturnLoadModule
        truck={selectedTruck}
        returnLoads={returnLoads}
        bookedLoadIds={bookedLoadIds}
        onBookReturnLoad={onBookReturnLoad}
        ridesUsed={ridesUsed}
        isSubscribed={isSubscribed}
      />
    );
  }

  if (screen === 'MY_BOOKINGS') {
    return (
      <div className="space-y-3">
        {returnLoads.map((load) => {
          const booked =
            bookedLoadIds.includes(load.id) ||
            load.status === 'PRIORITY_NOTIFIED';
          return (
            <div
              key={load.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 font-mono text-[10px] font-bold">
                  {bookedLoadIds.includes(load.id)
                    ? 'CONFIRMED BOOKING'
                    : 'PRIORITY #1 MATCH'}
                </span>
                <span className="font-mono text-xs font-bold text-slate-900">
                  ₹{load.offeredRateInr.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {load.originCity} → {load.destinationCity}
              </div>
              <div className="text-xs text-slate-500">
                Shipper: {load.shipperCompany} · {load.material} ({load.weightTons}T)
              </div>
              {booked && (
                <button
                  onClick={() =>
                    onBookReturnLoad({
                      id: load.id,
                      routeLabel: `${load.originCity} → ${load.destinationCity}`,
                      rateInr: load.offeredRateInr,
                      shipper: load.shipperCompany,
                    })
                  }
                  disabled={bookedLoadIds.includes(load.id)}
                  className={`w-full min-h-[42px] rounded-xl text-xs font-semibold cursor-pointer ${
                    bookedLoadIds.includes(load.id)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-teal-700 text-white'
                  }`}
                >
                  {bookedLoadIds.includes(load.id)
                    ? '✓ Locked in My Bookings'
                    : 'Confirm Booking Now'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (screen === 'TRUCKS') {
    return (
      <div className="space-y-3">
        {trucks.map((t) => {
          const active = t.id === selectedTruck.id;
          return (
            <div
              key={t.id}
              onClick={() => onSelectTruck(t.id)}
              className={`bg-white rounded-2xl border p-4 space-y-3 cursor-pointer ${
                active ? 'border-2 border-teal-700' : 'border-slate-200/90'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                    {t.vehicleNumber}
                  </span>
                  <div className="text-xs font-semibold text-teal-800 mt-1">
                    {t.transporterName}
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-slate-700">
                  {t.capacityTons}T · Fuel {t.fuelLevelPercent}%
                </span>
              </div>

              <div className="text-xs text-slate-600">
                <div>
                  <strong>Route:</strong> {t.originCity} → {t.destinationCity}
                </div>
                <div className="mt-0.5">
                  <strong>Position:</strong> {t.currentLocationName}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTruck(t.id);
                    onSwitchRole('driver');
                  }}
                  className="text-xs font-semibold text-teal-700 hover:underline cursor-pointer"
                >
                  Driver: {t.driverName} ({t.driverRating}★) →
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTruck(t.id);
                    onNavigate('ACTIVE_TRIPS');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
                >
                  Track Map
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (screen === 'DRIVERS') {
    return (
      <RAGAndDriverAdvisor
        truck={selectedTruck}
        drivers={drivers}
        selectedDriverId={selectedTruck.driverId}
        onSelectDriver={onSelectDriver}
        onRateDriver={onRateDriver}
        mode="BOTH"
      />
    );
  }

  if (screen === 'ACTIVE_TRIPS') {
    return (
      <div className="space-y-3.5">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              {selectedTruck.vehicleNumber} ({selectedTruck.transporterName})
            </span>
            <span className="font-mono text-xs font-semibold text-teal-700">
              {selectedTruck.etaText}
            </span>
          </div>
          <div className="text-xs text-slate-600">
            <strong>Staying/Halt:</strong> {selectedTruck.stayingLocationDetail}
          </div>
        </div>

        <LiveFreightMap
          truck={selectedTruck}
          selectedRouteId={activeRoute.id}
          onSelectRoute={onSelectRoute}
          onProgressChange={onProgressChange}
          isSimulating={isSimulating}
          onToggleSimulation={onToggleSimulation}
          onOpenReturnLoadModal={() => onNavigate('AVAILABLE_LOADS')}
          onOpenBillModal={() => onOpenBillModal(currentBill)}
          encodedPolylines={encodedPolylines}
        />
      </div>
    );
  }

  if (screen === 'EARNINGS' || screen === 'COMPLETED_TRIPS') {
    const totalRevenue = trucks.reduce((acc, t) => acc + t.freightAmountInr, 0);
    return (
      <div className="space-y-4">
        <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2">
          <div className="text-[10px] font-mono uppercase text-teal-300">
            TRANSPORTER FREIGHT EARNINGS
          </div>
          <div className="text-2xl font-bold font-mono">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-300">
            {selectedTruck.transporterName} · Instant Razorpay Settlement
          </div>
        </div>

        <div className="space-y-3">
          {bills.map((b) => (
            <div
              key={b.invoiceId}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-900">
                  #{b.invoiceId} · {b.vehicleNumber}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    b.status === 'PAID'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  {b.status}
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {b.originCity} → {b.destinationCity}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="font-mono text-sm font-bold text-teal-700">
                  ₹{b.totalPayableInr.toLocaleString('en-IN')}
                </span>
                <button
                  onClick={() => onOpenBillModal(b)}
                  className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
                >
                  Open Invoice & Razorpay
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'NOTIFICATIONS') {
    return (
      <div className="space-y-3">
        <div className="bg-white rounded-2xl border border-teal-600 p-4 space-y-1.5">
          <span className="text-[10px] font-mono font-bold text-teal-700">
            PRIORITY #1 BACKHAUL ALERT
          </span>
          <div className="text-xs font-bold text-slate-900">
            Mumbai → Indore Return Load (₹46,000) Reserved First
          </div>
          <p className="text-xs text-slate-600">
            Matched for {selectedTruck.vehicleNumber} ({selectedTruck.transporterName}) only 2.4 km from your Mumbai unloading bay.
          </p>
        </div>
      </div>
    );
  }

  if (screen === 'PROFILE') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-base">
            TR
          </div>
          <div>
            <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-mono font-semibold">
              VERIFIED TRANSPORTER
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              {selectedTruck.transporterName}
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              GSTIN: {currentBill.transporterGstin}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSubscriptionModal}
          className="w-full min-h-[44px] rounded-xl bg-teal-700 text-white text-xs font-semibold cursor-pointer"
        >
          {isSubscribed
            ? '₹500 Pro Pass Active'
            : `${freeLeft}/2 Free Rides Left · Upgrade ₹500`}
        </button>

        {/* Language Selection Setting */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-teal-700" />
            <div>
              <div className="text-xs font-bold text-slate-900">
                {language === 'hi' ? 'भाषा (Language)' : 'Language / भाषा'}
              </div>
              <div className="text-[11px] text-slate-500">
                {language === 'hi' ? 'हिंदी सक्रिय है' : 'English is active'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenLanguageModal}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
          >
            {language === 'hi' ? '🇮🇳 भाषा बदलें' : '🇬🇧 Change'}
          </button>
        </div>
      </div>
    );
  }

  // DEFAULT: TRANSPORTER OVERVIEW (HOME)
  const transporterMenu: Array<{
    id: TransporterScreen;
    label: string;
    icon: any;
    badge?: string;
  }> = [
    {
      id: 'AVAILABLE_LOADS',
      label: 'Available Loads (AI)',
      icon: Sparkles,
      badge: 'Priority #1',
    },
    { id: 'ACTIVE_TRIPS', label: 'Active Trips & Map', icon: MapPin },
    { id: 'TRUCKS', label: 'My Trucks', icon: Truck, badge: `${trucks.length}` },
    {
      id: 'DRIVERS',
      label: 'Drivers & Ratings',
      icon: Users,
      badge: `${drivers.length}`,
    },
    { id: 'MY_BOOKINGS', label: 'My Bookings', icon: ClipboardList },
    { id: 'EARNINGS', label: 'Earnings & Bills', icon: Wallet },
    { id: 'COMPLETED_TRIPS', label: 'Completed Trips', icon: CheckCircle2 },
    { id: 'REQUESTS', label: 'Load Requests', icon: Package },
  ];

  return (
    <div className="space-y-4">
      {/* Transporter Hero Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-teal-300 font-semibold">
              TRANSPORTER CONSOLE
            </span>
            <h2 className="text-base font-bold text-white mt-0.5">
              {selectedTruck.transporterName}
            </h2>
          </div>
          <button
            onClick={onOpenSubscriptionModal}
            className="px-2.5 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 font-mono text-[10px] font-semibold cursor-pointer"
          >
            {isSubscribed ? '₹500 Pro Active' : `${freeLeft}/2 Free Left`}
          </button>
        </div>

        {/* Fleet Selector Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {trucks.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTruck(t.id)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold whitespace-nowrap cursor-pointer border ${
                t.id === selectedTruck.id
                  ? 'bg-teal-600 text-white border-teal-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {t.vehicleNumber} ({t.originCity}→{t.destinationCity})
            </button>
          ))}
        </div>
      </div>

      {/* Priority Return Load Highlight Card */}
      <div
        onClick={() => onNavigate('AVAILABLE_LOADS')}
        className="bg-white rounded-2xl border-2 border-teal-700 p-4 space-y-2 cursor-pointer shadow-xs"
      >
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 font-mono text-[10px] font-bold">
            ⚡ PRIORITY #1 RETURN LOAD
          </span>
          <span className="font-mono text-xs font-bold text-teal-700">
            ₹46,000 · 99% Match
          </span>
        </div>
        <div className="text-sm font-bold text-slate-900">
          {selectedTruck.destinationCity} → {selectedTruck.originCity} Backhaul Ready
        </div>
        <p className="text-xs text-slate-600">
          Notified first because {selectedTruck.vehicleNumber} is delivering{' '}
          {selectedTruck.originCity} → {selectedTruck.destinationCity}. Tap to lock return load.
        </p>
      </div>

      {/* 2x4 Mobile Icon Grid for All Transporter Sections */}
      <div>
        <div className="text-xs font-bold text-slate-500 px-1 mb-2">
          Fleet & Dispatch Menu
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {transporterMenu.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="min-h-[60px] p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 flex items-center justify-between text-left cursor-pointer active:scale-[0.99] transition-all shadow-2xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-teal-700" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   3. DRIVER MOBILE APP DASHBOARD
   ============================================================================ */
export function DriverMobileApp({
  screen,
  onNavigate,
  props,
}: {
  screen: DriverScreen;
  onNavigate: (s: DriverScreen) => void;
  props: SharedMobileProps;
}) {
  const { t, language } = useLanguage();
  const {
    selectedTruck,
    returnLoads,
    bookedLoadIds,
    onBookReturnLoad,
    currentBill,
    onOpenBillModal,
    onSelectRoute,
    onProgressChange,
    isSimulating,
    onToggleSimulation,
    onUpdateTruckStatus,
    encodedPolylines,
    onSwitchRole,
    onOpenLanguageModal,
  } = props;

  const activeRoute =
    selectedTruck.routes.find((r) => r.id === selectedTruck.activeRouteId) ||
    selectedTruck.routes[0];

  const matchingReturnLoad =
    returnLoads.find(
      (l) =>
        l.matchedForTruckId === selectedTruck.id ||
        l.originCity.toLowerCase() ===
          selectedTruck.destinationCity.toLowerCase()
    ) || returnLoads[0];

  const isReturnBooked = bookedLoadIds.includes(matchingReturnLoad.id);

  if (screen === 'ASSIGNED_SHIPMENT') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3.5">
        <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 font-mono text-[10px] font-bold">
          ASSIGNED SHIPMENT MANIFEST
        </span>
        <div className="text-base font-bold text-slate-900">
          {selectedTruck.cargoMaterial} ({selectedTruck.cargoWeightTons} Tons)
        </div>
        <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
          <div>
            <strong>Transporter:</strong> {selectedTruck.transporterName}
          </div>
          <div>
            <strong>Shipper:</strong> {selectedTruck.shipperName}
          </div>
          <div>
            <strong>Vehicle:</strong> {selectedTruck.vehicleNumber} ({selectedTruck.truckType})
          </div>
          <div>
            <strong>Pickup:</strong> {selectedTruck.originCity} — {selectedTruck.originHub}
          </div>
          <div>
            <strong>Destination:</strong> {selectedTruck.destinationCity} —{' '}
            {selectedTruck.destinationHub}
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'PICKUP_LOCATION' || screen === 'DESTINATION') {
    return (
      <div className="space-y-3">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-2">
          <span className="text-[10px] font-mono uppercase font-bold text-teal-700">
            PICKUP LOCATION (POINT A)
          </span>
          <div className="text-sm font-bold text-slate-900">
            {selectedTruck.originCity}
          </div>
          <div className="text-xs text-slate-600">{selectedTruck.originHub}</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-2">
          <span className="text-[10px] font-mono uppercase font-bold text-amber-700">
            DESTINATION HUB (POINT B)
          </span>
          <div className="text-sm font-bold text-slate-900">
            {selectedTruck.destinationCity}
          </div>
          <div className="text-xs text-slate-600">
            {selectedTruck.destinationHub}
          </div>
          <div className="text-xs font-mono font-semibold text-teal-700 pt-1">
            ETA: {selectedTruck.etaText}
          </div>
        </div>

        <button
          onClick={() => onNavigate('ROUTE_NAVIGATION')}
          className="w-full min-h-[46px] rounded-xl bg-teal-700 text-white text-xs font-semibold cursor-pointer"
        >
          Open Turn-by-Turn Weather Map
        </button>
      </div>
    );
  }

  if (screen === 'ROUTE_NAVIGATION') {
    return (
      <div className="space-y-3.5">
        <LiveFreightMap
          truck={selectedTruck}
          selectedRouteId={activeRoute.id}
          onSelectRoute={onSelectRoute}
          onProgressChange={onProgressChange}
          isSimulating={isSimulating}
          onToggleSimulation={onToggleSimulation}
          priorityReturnLoad={matchingReturnLoad}
          onOpenReturnLoadModal={() => onNavigate('RETURN_BACKHAUL')}
          onOpenBillModal={() => onOpenBillModal(currentBill)}
          encodedPolylines={encodedPolylines}
        />

        {/* Upcoming Highway Weather Checkpoints */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-500 px-1">
            Highway Weather Checkpoints ({activeRoute.highwayTag})
          </div>
          {activeRoute.checkpoints.map((cp) => (
            <div
              key={cp.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-3.5 flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-900">{cp.name}</div>
                <div className="text-[11px] text-slate-500">
                  {cp.roadAdvisory}
                </div>
              </div>
              <div className="text-right font-mono shrink-0">
                <div className="text-xs font-bold text-slate-900">
                  {cp.tempC}°C · {cp.precipProb}%🌧️
                </div>
                <div
                  className={`text-[10px] font-bold ${
                    cp.floodRisk === 'CRITICAL' || cp.floodRisk === 'HIGH'
                      ? 'text-red-600'
                      : 'text-teal-700'
                  }`}
                >
                  {cp.floodRisk} FLOOD
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'RETURN_BACKHAUL') {
    return (
      <AIReturnLoadModule
        truck={selectedTruck}
        returnLoads={returnLoads}
        bookedLoadIds={bookedLoadIds}
        onBookReturnLoad={onBookReturnLoad}
        ridesUsed={1}
        isSubscribed={true}
      />
    );
  }

  if (screen === 'TRIP_STATUS') {
    return (
      <div className="space-y-3">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3">
          <div className="text-xs font-bold text-slate-500">
            Update Live Driver Status
          </div>
          <button
            onClick={() => onUpdateTruckStatus('EN_ROUTE')}
            className={`w-full min-h-[52px] p-3.5 rounded-xl border text-left flex items-center justify-between cursor-pointer ${
              selectedTruck.status === 'EN_ROUTE' &&
              selectedTruck.progressPercent < 100
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 text-slate-800 border-slate-200'
            }`}
          >
            <span className="text-xs font-bold">1. Driving on Highway</span>
            <span className="font-mono text-xs">58 km/h</span>
          </button>

          <button
            onClick={() => onUpdateTruckStatus('STAYING_AT_HALT')}
            className={`w-full min-h-[52px] p-3.5 rounded-xl border text-left flex items-center justify-between cursor-pointer ${
              selectedTruck.status === 'STAYING_AT_HALT'
                ? 'bg-amber-100 text-slate-900 border-amber-300'
                : 'bg-slate-50 text-slate-800 border-slate-200'
            }`}
          >
            <span className="text-xs font-bold">2. Staying at Rest Plaza</span>
            <span className="font-mono text-xs">Halted</span>
          </button>

          <button
            onClick={() => {
              onUpdateTruckStatus('EN_ROUTE', 100);
              onOpenBillModal(currentBill);
            }}
            className="w-full min-h-[52px] p-3.5 rounded-xl bg-teal-700 text-white text-left flex items-center justify-between cursor-pointer"
          >
            <span className="text-xs font-bold">
              3. Mark Delivered & Generate Bill
            </span>
            <Receipt className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'TRIP_HISTORY' || screen === 'EARNINGS') {
    return (
      <div className="space-y-3">
        <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-1">
          <div className="text-[10px] font-mono text-teal-300">
            DRIVER TRIP PAYOUT & RATING
          </div>
          <div className="text-2xl font-bold font-mono">
            ₹{selectedTruck.freightAmountInr.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-300">
            Captain {selectedTruck.driverName} · {selectedTruck.driverRating}★ (
            {selectedTruck.driverReviewsCount} Customer Reviews)
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              {selectedTruck.originCity} → {selectedTruck.destinationCity}
            </span>
            <span className="font-mono text-xs text-teal-700 font-bold">
              #{currentBill.invoiceId}
            </span>
          </div>
          <div className="text-xs text-slate-500">
            Transporter: {selectedTruck.transporterName}
          </div>
          <button
            onClick={() => onOpenBillModal(currentBill)}
            className="w-full min-h-[42px] rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
          >
            View Ride Bill & Razorpay Status
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'NOTIFICATIONS') {
    return (
      <div className="space-y-3">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-1">
          <span className="text-[10px] font-mono font-bold text-teal-700">
            RETURN LOAD ALERT WHILE TRAVELLING
          </span>
          <div className="text-xs font-bold text-slate-900">
            {matchingReturnLoad.originCity} → {matchingReturnLoad.destinationCity} (₹
            {matchingReturnLoad.offeredRateInr.toLocaleString('en-IN')})
          </div>
          <div className="text-xs text-slate-500">
            Pickup at {matchingReturnLoad.originHub} right after you unload.
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'PROFILE') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold text-base">
            CP
          </div>
          <div>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-mono font-bold">
              ★ {selectedTruck.driverRating.toFixed(2)} CUSTOMER RATED
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Captain {selectedTruck.driverName}
            </h3>
            <p className="text-xs text-slate-500">
              {selectedTruck.transporterName} · {selectedTruck.vehicleNumber}
            </p>
          </div>
        </div>

        {/* Language Selection Setting */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-teal-700" />
            <div>
              <div className="text-xs font-bold text-slate-900">
                {language === 'hi' ? 'भाषा (Language)' : 'Language / भाषा'}
              </div>
              <div className="text-[11px] text-slate-500">
                {language === 'hi' ? 'हिंदी सक्रिय है' : 'English is active'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenLanguageModal}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
          >
            {language === 'hi' ? '🇮🇳 भाषा बदलें' : '🇬🇧 Change'}
          </button>
        </div>
      </div>
    );
  }

  // DEFAULT: DRIVER HOME SCREEN (CURRENT TRIP + VISIBLE RETURN LOAD WHILE TRAVELLING)
  return (
    <div className="space-y-4">
      {/* Current Trip Hero Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-[10px] font-semibold">
            CURRENT TRIP · {selectedTruck.vehicleNumber}
          </span>
          <span className="font-mono text-xs text-amber-300 font-bold">
            ★ {selectedTruck.driverRating.toFixed(2)}
          </span>
        </div>

        <div>
          <div className="text-base font-bold">
            {selectedTruck.originCity} → {selectedTruck.destinationCity}
          </div>
          <div className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-teal-400" />
            <span>{selectedTruck.transporterName}</span>
          </div>
        </div>

        {/* Pickup & Destination Compact Box */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-800/90 text-xs">
          <div onClick={() => onNavigate('PICKUP_LOCATION')} className="cursor-pointer">
            <div className="text-[10px] font-mono text-slate-400">PICKUP</div>
            <div className="font-semibold text-white truncate">
              {selectedTruck.originCity} Hub
            </div>
          </div>
          <div onClick={() => onNavigate('DESTINATION')} className="cursor-pointer">
            <div className="text-[10px] font-mono text-slate-400">
              DESTINATION
            </div>
            <div className="font-semibold text-teal-300 truncate">
              {selectedTruck.destinationCity} ({selectedTruck.etaText})
            </div>
          </div>
        </div>

        {/* 1-Tap Trip Status Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => onUpdateTruckStatus('EN_ROUTE')}
            className={`min-h-[42px] rounded-xl text-[11px] font-semibold cursor-pointer ${
              selectedTruck.status === 'EN_ROUTE' &&
              selectedTruck.progressPercent < 100
                ? 'bg-teal-600 text-white'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            Driving
          </button>
          <button
            onClick={() => onUpdateTruckStatus('STAYING_AT_HALT')}
            className={`min-h-[42px] rounded-xl text-[11px] font-semibold cursor-pointer ${
              selectedTruck.status === 'STAYING_AT_HALT'
                ? 'bg-amber-400 text-slate-900 font-bold'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            Halted
          </button>
          <button
            onClick={() => {
              onUpdateTruckStatus('EN_ROUTE', 100);
              onOpenBillModal(currentBill);
            }}
            className="min-h-[42px] rounded-xl bg-slate-800 hover:bg-teal-700 text-white text-[11px] font-semibold cursor-pointer"
          >
            Complete
          </button>
        </div>
      </div>

      {/* PROMINENT RETURN LOAD / BACKHAUL CARD WHILE TRAVELLING */}
      <div className="bg-white rounded-2xl border-2 border-teal-700 p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-mono text-[10px] font-bold">
            ⚡ RETURN LOAD WHILE TRAVELLING
          </span>
          <span className="font-mono text-xs font-bold text-teal-700">
            {matchingReturnLoad.aiMatchScore}% AI Match
          </span>
        </div>

        <div>
          <div className="text-sm font-bold text-slate-900">
            {matchingReturnLoad.originCity} → {matchingReturnLoad.destinationCity} Return Load
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Since you are travelling {selectedTruck.originCity} →{' '}
            {selectedTruck.destinationCity}, this{' '}
            <strong>
              {matchingReturnLoad.originCity} → {matchingReturnLoad.destinationCity}
            </strong>{' '}
            load is reserved for you just {matchingReturnLoad.deadheadKmFromDrop} km from your drop point.
          </p>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-mono">
          <span className="font-bold text-slate-900">
            ₹{matchingReturnLoad.offeredRateInr.toLocaleString('en-IN')}
          </span>
          <span className="text-slate-600">
            {matchingReturnLoad.weightTons}T · {matchingReturnLoad.shipperCompany.split(' ')[0]}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() =>
              onBookReturnLoad({
                id: matchingReturnLoad.id,
                routeLabel: `${matchingReturnLoad.originCity} → ${matchingReturnLoad.destinationCity}`,
                rateInr: matchingReturnLoad.offeredRateInr,
                shipper: matchingReturnLoad.shipperCompany,
              })
            }
            disabled={isReturnBooked}
            className={`min-h-[44px] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
              isReturnBooked
                ? 'bg-emerald-600 text-white'
                : 'bg-teal-700 text-white'
            }`}
          >
            {isReturnBooked ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Accepted</span>
              </>
            ) : (
              <span>Accept Return Load</span>
            )}
          </button>

          <button
            onClick={() => onNavigate('RETURN_BACKHAUL')}
            className="min-h-[44px] rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold cursor-pointer"
          >
            All Return Loads
          </button>
        </div>
      </div>

      {/* Driver Quick Navigation Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { id: 'ROUTE_NAVIGATION', label: 'Route & Weather Map', icon: Compass },
          { id: 'ASSIGNED_SHIPMENT', label: 'Assigned Shipment', icon: Package },
          { id: 'PICKUP_LOCATION', label: 'Pickup & Drop Info', icon: MapPin },
          { id: 'TRIP_STATUS', label: 'Trip Status Log', icon: Clock },
          { id: 'EARNINGS', label: 'Earnings & Bill', icon: Wallet },
          { id: 'TRIP_HISTORY', label: 'Trip History', icon: History },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as DriverScreen)}
              className="min-h-[58px] p-3.5 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-between text-left cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-teal-700 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {item.label}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
