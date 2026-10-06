'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  INITIAL_TRUCKS,
  INITIAL_RETURN_LOADS,
  INITIAL_BILLS,
  DRIVER_OPTIONS,
  TruckTelemetry,
  ReturnLoadOffer,
  RideBill,
  DriverOption,
  UserRole,
} from '@/lib/freight-data';
import { useAdminPlatform } from '@/lib/admin-store';
import {
  ShipperMobileApp,
  TransporterMobileApp,
  DriverMobileApp,
  ShipperScreen,
  TransporterScreen,
  DriverScreen,
} from '@/components/RoleWorkspaces';
import LiveFreightMap from '@/components/LiveFreightMap';
import RazorpayAndBillsModal from '@/components/RazorpayAndBillsModal';
import SubscriptionPassModal from '@/components/SubscriptionPassModal';
import {
  Truck,
  Package,
  Compass,
  LayoutDashboard,
  ShieldCheck,
  Smartphone,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  DollarSign,
  CloudRain,
  MapPin,
  RefreshCw,
  Eye,
  Sliders,
  Award,
  ChevronRight,
  BookOpen,
  Receipt,
  Users,
  Radio,
  Lock,
} from 'lucide-react';

export default function ProfessorShowcasePage() {
  const {
    users,
    trucks,
    shipments,
    bookings,
    bills,
    issues,
    currentAuthRole,
    switchSimulatedRole,
    updateShipmentStatus,
    updateBookingStatus,
    markBillPaidInAdmin,
  } = useAdminPlatform();

  // Active Presentation Mode
  const [activeTab, setActiveTab] = useState<
    'QUAD_VIEW' | 'SHIPPER' | 'TRANSPORTER' | 'DRIVER' | 'ADMIN' | 'ARCHITECTURE'
  >('QUAD_VIEW');

  // Shared Logistics State for Mobile Dashboards
  const [selectedTruckId, setSelectedTruckId] = useState<string>(
    INITIAL_TRUCKS[0].id
  );
  const [mobileTrucks, setMobileTrucks] = useState<TruckTelemetry[]>(INITIAL_TRUCKS);
  const [drivers, setDrivers] = useState<DriverOption[]>(DRIVER_OPTIONS);
  const [returnLoads, setReturnLoads] =
    useState<ReturnLoadOffer[]>(INITIAL_RETURN_LOADS);
  const [bookedLoadIds, setBookedLoadIds] = useState<string[]>([]);
  const [mobileBills, setMobileBills] = useState<RideBill[]>(INITIAL_BILLS);
  const [activeBillModal, setActiveBillModal] = useState<RideBill | null>(null);
  const [ridesUsed, setRidesUsed] = useState<number>(1);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState<boolean>(false);

  // Independent Screen Navigation for each Mobile Device Mockup
  const [shipperScreen, setShipperScreen] = useState<ShipperScreen>('OVERVIEW');
  const [transporterScreen, setTransporterScreen] =
    useState<TransporterScreen>('OVERVIEW');
  const [driverScreen, setDriverScreen] =
    useState<DriverScreen>('CURRENT_TRIP');

  // Presentation Simulation Toast
  const [demoBanner, setDemoBanner] = useState<string | null>(
    'Tip: You can interact with all 3 phones & the Admin dashboard simultaneously! Tap any card to test.'
  );

  const selectedTruck =
    mobileTrucks.find((t) => t.id === selectedTruckId) || mobileTrucks[0];
  const currentBill =
    mobileBills.find((b) => b.truckId === selectedTruck.id) || mobileBills[0];

  const handleBookReturnLoad = (loadInfo: {
    id: string;
    routeLabel: string;
    rateInr: number;
    shipper: string;
  }) => {
    setBookedLoadIds((prev) => [...prev, loadInfo.id]);
    setDemoBanner(
      `AI Return-Load Booked! Backhaul trip "${loadInfo.routeLabel}" registered for ₹${loadInfo.rateInr.toLocaleString('en-IN')}. Visible in Transporter & Driver cockpits!`
    );
  };

  const handlePostNewReturnLoad = (newLoad: {
    originCity: string;
    originHub: string;
    destinationCity: string;
    destinationHub: string;
    shipperCompany: string;
    material: string;
    weightTons: number;
    offeredRateInr: number;
  }) => {
    const offer: ReturnLoadOffer = {
      id: `RET-DEMO-${Date.now()}`,
      originCity: newLoad.originCity,
      originHub: newLoad.originHub,
      originCoords: { lat: 19.076, lng: 72.8777 },
      destinationCity: newLoad.destinationCity,
      destinationHub: newLoad.destinationHub,
      destinationCoords: { lat: 22.7196, lng: 75.8577 },
      shipperCompany: newLoad.shipperCompany,
      transporterName: selectedTruck.transporterName,
      shipperVerified: true,
      material: newLoad.material,
      weightTons: newLoad.weightTons,
      requiredTruckType: selectedTruck.truckType,
      offeredRateInr: newLoad.offeredRateInr,
      marketAvgRateInr: Math.round(newLoad.offeredRateInr * 0.95),
      pickupWindow: 'Today within 3 hrs',
      distanceKm: 585,
      deadheadKmFromDrop: 12,
      aiMatchScore: 98,
      priorityRank: 1,
      matchedForTruckId: selectedTruck.id,
      weatherOnReturn: 'CLEAR',
      aiPredictiveNote: 'Pre-matched return load from Mumbai back to Indore.',
      status: 'AVAILABLE',
    };
    setReturnLoads((prev) => [offer, ...prev]);
    setDemoBanner(`New load posted by Shipper! AI matching algorithm updated recommendations.`);
  };

  const sharedProps = {
    trucks: mobileTrucks,
    selectedTruck,
    onSelectTruck: setSelectedTruckId,
    drivers,
    onSelectDriver: (drv: DriverOption) => {
      setDemoBanner(`Driver Captain ${drv.name} (${drv.rating}★) selected based on AI safety score!`);
    },
    onRateDriver: (driverId: string, stars: number) => {
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === driverId
            ? { ...d, rating: Number(((d.rating * 10 + stars) / 11).toFixed(2)) }
            : d
        )
      );
      setDemoBanner(`Feedback registered: ${stars}★ recorded for driver.`);
    },
    returnLoads,
    bookedLoadIds,
    onBookReturnLoad: handleBookReturnLoad,
    onPostNewReturnLoad: handlePostNewReturnLoad,
    bills: mobileBills,
    currentBill,
    onOpenBillModal: (bill?: RideBill) => {
      setActiveBillModal(bill || currentBill);
    },
    ridesUsed,
    isSubscribed,
    onOpenSubscriptionModal: () => setIsPassModalOpen(true),
    onSelectRoute: (routeId: string) => {
      setMobileTrucks((prev) =>
        prev.map((t) =>
          t.id === selectedTruck.id
            ? { ...t, activeRouteId: routeId }
            : t
        )
      );
      setDemoBanner(`Route updated to ${routeId} for truck ${selectedTruck.vehicleNumber}. Weather status checked.`);
    },
    onProgressChange: (newProgress: number) => {
      setMobileTrucks((prev) =>
        prev.map((t) =>
          t.id === selectedTruck.id
            ? { ...t, progressPercent: newProgress }
            : t
        )
      );
    },
    isSimulating: false,
    onToggleSimulation: () => {
      setDemoBanner('Live GPS trip telemetry simulation toggled.');
    },
    onUpdateTruckStatus: (
      newStatus: 'EN_ROUTE' | 'STAYING_AT_HALT',
      newProgress?: number
    ) => {
      setMobileTrucks((prev) =>
        prev.map((t) =>
          t.id === selectedTruck.id
            ? {
                ...t,
                status: newStatus,
                progressPercent: newProgress !== undefined ? newProgress : t.progressPercent,
              }
            : t
        )
      );
      setDemoBanner(`Truck ${selectedTruck.vehicleNumber} status updated to ${newStatus}. Synchronized across all 4 views.`);
    },
    encodedPolylines: {},
    onSwitchRole: (targetRole: UserRole) => {
      if (targetRole === 'shipper') setActiveTab('SHIPPER');
      else if (targetRole === 'transporter') setActiveTab('TRANSPORTER');
      else if (targetRole === 'driver') setActiveTab('DRIVER');
    },
    shipperPlan: 'STANDARD' as const,
    shipperRidesRemaining: 5,
    onSelectShipperPlan: (plan: string) => {
      setDemoBanner(`Shipper ${plan} Membership selected!`);
    },
    onOpenLanguageModal: () => {},
  };

  const handleMarkBillPaid = (invoiceId: string) => {
    setMobileBills((prev) =>
      prev.map((b) =>
        b.invoiceId === invoiceId
          ? {
              ...b,
              status: 'PAID' as const,
              razorpayOrderId: `order_DemoRzp_${Date.now()}`,
              razorpayPaymentId: `pay_DemoVerified_${Date.now()}`,
              paidAt: 'Just now (Razorpay Demo)',
            }
          : b
      )
    );
    markBillPaidInAdmin(invoiceId);
    setActiveBillModal(null);
    setDemoBanner(`Invoice #${invoiceId} settled via Razorpay! Updated in Shipper app & Admin Revenue.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Academic Showcase Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3.5">
        <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-white">
                  TruckBuddy
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-teal-500/20 text-teal-300 rounded border border-teal-500/30">
                  Professor Showcase Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Live 4-in-1 Platform Demonstration (Shipper · Transporter · Driver · Admin)
              </p>
            </div>
          </div>

          {/* Navigation Mode Switcher */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('QUAD_VIEW')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'QUAD_VIEW'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>4-in-1 Quad Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('SHIPPER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'SHIPPER'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>1. Shipper</span>
            </button>
            <button
              onClick={() => setActiveTab('TRANSPORTER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'TRANSPORTER'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>2. Transporter</span>
            </button>
            <button
              onClick={() => setActiveTab('DRIVER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'DRIVER'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>3. Driver</span>
            </button>
            <button
              onClick={() => setActiveTab('ADMIN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'ADMIN'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>4. Web Admin</span>
            </button>
            <button
              onClick={() => setActiveTab('ARCHITECTURE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'ARCHITECTURE'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Viva & Architecture Notes</span>
            </button>
          </div>

          {/* Quick Exit Links */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5 text-teal-400" />
              <span>Launch Single Mobile App</span>
            </Link>
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Open Full Web Admin</span>
            </Link>
          </div>
        </div>

        {/* Live Presentation Demo Banner */}
        {demoBanner && (
          <div className="max-w-[1720px] mx-auto mt-2.5 px-3 py-2 rounded-xl bg-teal-950/80 border border-teal-800/60 text-xs text-teal-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
              <span>{demoBanner}</span>
            </div>
            <button
              onClick={() => setDemoBanner(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-0.5 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </header>

      {/* Main Showcase Body */}
      <main className="flex-1 p-4 lg:p-8 max-w-[1720px] w-full mx-auto space-y-8">
        {/* ============================================================== */}
        {/* VIEW 1: 4-in-1 QUAD VIEW (ALL DASHBOARDS SHOWN TOGETHER) */}
        {/* ============================================================== */}
        {activeTab === 'QUAD_VIEW' && (
          <div className="space-y-8">
            {/* Academic Presentation Overview Card */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 rounded-2xl border border-slate-800 p-5 lg:p-6 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Complete 4-Tier Logistics Ecosystem
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Simultaneous Multi-Role Platform Simulation
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                    Below are the <strong>three mobile apps</strong> (Shipper, Transporter, Driver) running live side-by-side, plus the <strong>Web Admin Dashboard</strong> control tower. Every action—such as booking a load, weather rerouting, driver selection, or Razorpay payment—synchronizes across all four interfaces.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs shrink-0">
                  <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 font-mono text-slate-300">
                    Active Route: <strong className="text-teal-400">Indore ⇄ Mumbai</strong>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 font-mono text-slate-300">
                    Corridor: <strong className="text-teal-400">NH-52 / NH-48</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Half: 3 Mobile Phone Mockups Side-by-Side */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-teal-400" />
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
                    Part A: Three Dedicated Mobile Applications (Shipper · Transporter · Driver)
                  </h3>
                </div>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Interactive screens · Click any button or tab to test
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* 1. SHIPPER MOBILE APP FRAME */}
                <div className="bg-slate-900/90 rounded-3xl border border-slate-750 p-3.5 shadow-2xl flex flex-col">
                  {/* Phone Bezel Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-bold text-white">1. Shipper Mobile App</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">
                      Role: Shipper
                    </span>
                  </div>

                  {/* Device Viewport Simulation */}
                  <div className="bg-slate-50 text-slate-900 rounded-2xl overflow-hidden border border-slate-300 h-[640px] flex flex-col relative shadow-inner">
                    {/* App Internal Bar */}
                    <div className="bg-white border-b border-slate-200 px-3.5 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
                          S
                        </div>
                        <div>
                          <div className="text-[9px] font-mono uppercase text-teal-700 font-bold">TruckBuddy Shipper</div>
                          <div className="text-xs font-bold text-slate-900">
                            {shipperScreen === 'OVERVIEW' ? 'Shipper Overview' : shipperScreen}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveBillModal(currentBill)}
                        className="px-2 py-1 rounded-md bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200 flex items-center gap-1 cursor-pointer"
                      >
                        <Receipt className="w-3 h-3" />
                        <span>GST Bill</span>
                      </button>
                    </div>

                    {/* Scrollable Screen Content */}
                    <div className="flex-1 p-3 overflow-y-auto space-y-3">
                      <ShipperMobileApp
                        screen={shipperScreen}
                        onNavigate={setShipperScreen}
                        props={sharedProps}
                      />
                    </div>

                    {/* Bottom Navigation */}
                    <div className="bg-white border-t border-slate-200 px-2 py-1 grid grid-cols-5 text-center text-[9px] font-semibold">
                      {(
                        [
                          { id: 'OVERVIEW', label: 'Home' },
                          { id: 'ACTIVE_SHIPMENTS', label: 'Shipments' },
                          { id: 'LIVE_TRACKING', label: 'Track' },
                          { id: 'AVAILABLE_TRANSPORTERS', label: 'Fleets' },
                          { id: 'PROFILE', label: 'Profile' },
                        ] as const
                      ).map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setShipperScreen(item.id)}
                          className={`py-1 rounded-md transition-colors cursor-pointer ${
                            shipperScreen === item.id
                              ? 'text-teal-700 font-bold bg-teal-50'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. TRANSPORTER MOBILE APP FRAME */}
                <div className="bg-slate-900/90 rounded-3xl border border-slate-750 p-3.5 shadow-2xl flex flex-col">
                  {/* Phone Bezel Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-bold text-white">2. Transporter Mobile App</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-semibold">
                      Role: Transporter
                    </span>
                  </div>

                  {/* Device Viewport Simulation */}
                  <div className="bg-slate-50 text-slate-900 rounded-2xl overflow-hidden border border-slate-300 h-[640px] flex flex-col relative shadow-inner">
                    {/* App Internal Bar */}
                    <div className="bg-white border-b border-slate-200 px-3.5 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
                          T
                        </div>
                        <div>
                          <div className="text-[9px] font-mono uppercase text-teal-700 font-bold">TruckBuddy Transporter</div>
                          <div className="text-xs font-bold text-slate-900">
                            {transporterScreen === 'OVERVIEW' ? 'Fleet Overview' : transporterScreen}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ₹500 Pro Pass Active
                      </span>
                    </div>

                    {/* Scrollable Screen Content */}
                    <div className="flex-1 p-3 overflow-y-auto space-y-3">
                      <TransporterMobileApp
                        screen={transporterScreen}
                        onNavigate={setTransporterScreen}
                        props={sharedProps}
                      />
                    </div>

                    {/* Bottom Navigation */}
                    <div className="bg-white border-t border-slate-200 px-2 py-1 grid grid-cols-5 text-center text-[9px] font-semibold">
                      {(
                        [
                          { id: 'OVERVIEW', label: 'Home' },
                          { id: 'AVAILABLE_LOADS', label: 'Return Loads' },
                          { id: 'ACTIVE_TRIPS', label: 'Trips' },
                          { id: 'EARNINGS', label: 'Earnings' },
                          { id: 'PROFILE', label: 'Profile' },
                        ] as const
                      ).map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setTransporterScreen(item.id)}
                          className={`py-1 rounded-md transition-colors cursor-pointer ${
                            transporterScreen === item.id
                              ? 'text-teal-700 font-bold bg-teal-50'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. DRIVER MOBILE APP FRAME */}
                <div className="bg-slate-900/90 rounded-3xl border border-slate-750 p-3.5 shadow-2xl flex flex-col">
                  {/* Phone Bezel Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-bold text-white">3. Driver Mobile Cockpit</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                      Role: Driver
                    </span>
                  </div>

                  {/* Device Viewport Simulation */}
                  <div className="bg-slate-50 text-slate-900 rounded-2xl overflow-hidden border border-slate-300 h-[640px] flex flex-col relative shadow-inner">
                    {/* App Internal Bar */}
                    <div className="bg-white border-b border-slate-200 px-3.5 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
                          D
                        </div>
                        <div>
                          <div className="text-[9px] font-mono uppercase text-teal-700 font-bold">TruckBuddy Driver</div>
                          <div className="text-xs font-bold text-slate-900">
                            {driverScreen === 'CURRENT_TRIP' ? 'Trip Cockpit' : driverScreen}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CloudRain className="w-3 h-3 text-teal-600" />
                        <span>Flood-Free NH-48</span>
                      </div>
                    </div>

                    {/* Scrollable Screen Content */}
                    <div className="flex-1 p-3 overflow-y-auto space-y-3">
                      <DriverMobileApp
                        screen={driverScreen}
                        onNavigate={setDriverScreen}
                        props={sharedProps}
                      />
                    </div>

                    {/* Bottom Navigation */}
                    <div className="bg-white border-t border-slate-200 px-2 py-1 grid grid-cols-5 text-center text-[9px] font-semibold">
                      {(
                        [
                          { id: 'CURRENT_TRIP', label: 'Trip' },
                          { id: 'ROUTE_NAVIGATION', label: 'Route' },
                          { id: 'RETURN_BACKHAUL', label: 'Backhaul' },
                          { id: 'EARNINGS', label: 'Earnings' },
                          { id: 'PROFILE', label: 'Profile' },
                        ] as const
                      ).map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setDriverScreen(item.id)}
                          className={`py-1 rounded-md transition-colors cursor-pointer ${
                            driverScreen === item.id
                              ? 'text-teal-700 font-bold bg-teal-50'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Half: Full-Featured Web Admin Dashboard Control Tower */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-600/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                    <LayoutDashboard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Part B: Web Admin Control Tower (Desktop Web Dashboard)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Live administration console showing all users, shipments, bookings, live radar, and financial commissions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/admin"
                    className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Open Full Dedicated Admin App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Web Admin Embedded Interactive View */}
              <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                {/* Admin Header Bar */}
                <div className="bg-slate-850 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        TruckBuddy Platform Admin & Manager Control Tower
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Logged in as: <strong>Harsh Paliwal (harshpaliwal440@gmail.com)</strong> · Role: <strong className="text-teal-400 font-mono">ADMIN</strong>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px] flex items-center gap-1.5 border border-emerald-500/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE SYNC ACTIVE
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">
                      RBAC Security: ENFORCED (403 Gate)
                    </span>
                  </div>
                </div>

                {/* Admin Live KPI Cards */}
                <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 border-b border-slate-800/80 bg-slate-900/50">
                  <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Total Users</div>
                    <div className="text-xl font-bold text-white">{users.length}</div>
                    <div className="text-[10px] text-teal-400">Shippers, Fleets, Drivers</div>
                  </div>
                  <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Active Trips</div>
                    <div className="text-xl font-bold text-teal-400">
                      {trucks.filter((t) => t.status === 'EN_ROUTE').length}
                    </div>
                    <div className="text-[10px] text-slate-400">Kasara & Dhule Corridors</div>
                  </div>
                  <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">AI Return Matches</div>
                    <div className="text-xl font-bold text-emerald-400">{returnLoads.length}</div>
                    <div className="text-[10px] text-emerald-400/80">98% Backhaul Fill Rate</div>
                  </div>
                  <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Total Shipments</div>
                    <div className="text-xl font-bold text-white">{shipments.length}</div>
                    <div className="text-[10px] text-slate-400">Outbound + Return Loads</div>
                  </div>
                  <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Settled Invoices</div>
                    <div className="text-xl font-bold text-white">
                      ₹{bills.reduce((a, b) => a + (b.status === 'PAID' ? b.totalPayableInr : 0), 0).toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-teal-400">Via Razorpay Gateway</div>
                  </div>
                  <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Platform Profit</div>
                    <div className="text-xl font-bold text-emerald-400">
                      ₹{(users.filter((u) => u.subscriptionTier === 'PRO_PASS_500').length * 500 + bills.reduce((a, b) => a + b.platformFeeInr, 0) + 342000).toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-400">Subscriptions + 1% Fee</div>
                  </div>
                </div>

                {/* Admin Live Operations Radar + Shipments Table Split */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left 6 Cols: Interactive Map Radar */}
                  <div className="lg:col-span-6 bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Radio className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                          Live Truck Telemetry & Radar (Google Maps)
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-teal-300">
                        {selectedTruck.vehicleNumber} ({selectedTruck.currentLocationName})
                      </span>
                    </div>

                    <div className="h-[320px] rounded-xl overflow-hidden border border-slate-800 relative">
                      <LiveFreightMap
                        truck={selectedTruck}
                        selectedRouteId={selectedTruck.activeRouteId}
                        onSelectRoute={(rId) => {
                          setMobileTrucks((prev) =>
                            prev.map((t) =>
                              t.id === selectedTruck.id
                                ? { ...t, activeRouteId: rId }
                                : t
                            )
                          );
                        }}
                        onProgressChange={(prog) => {
                          setMobileTrucks((prev) =>
                            prev.map((t) =>
                              t.id === selectedTruck.id
                                ? { ...t, progressPercent: prog }
                                : t
                            )
                          );
                        }}
                        isSimulating={false}
                        onToggleSimulation={() => {}}
                        onOpenReturnLoadModal={() => setActiveTab('TRANSPORTER')}
                        onOpenBillModal={() => setActiveBillModal(currentBill)}
                      />
                    </div>
                  </div>

                  {/* Right 6 Cols: Live Bookings & Shipments Management Table */}
                  <div className="lg:col-span-6 bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-3 flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-teal-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                          Live Bookings & Dispatch Table
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {bookings.length} Bookings Active
                      </span>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                      <table className="w-full text-left text-[11px] border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                            <th className="py-2 px-2">Booking ID</th>
                            <th className="py-2 px-2">Route</th>
                            <th className="py-2 px-2">Transporter</th>
                            <th className="py-2 px-2">Amount</th>
                            <th className="py-2 px-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850 font-mono">
                          {bookings.map((b) => (
                            <tr key={b.id} className="hover:bg-slate-900/60">
                              <td className="py-2.5 px-2 font-bold text-white">{b.id}</td>
                              <td className="py-2.5 px-2 text-slate-300">
                                {b.originCity} → {b.destinationCity}
                              </td>
                              <td className="py-2.5 px-2 text-slate-400">{b.transporterName}</td>
                              <td className="py-2.5 px-2 font-bold text-emerald-400">
                                ₹{b.agreedAmountInr.toLocaleString('en-IN')}
                              </td>
                              <td className="py-2.5 px-2">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    b.bookingStatus === 'COMPLETED'
                                      ? 'bg-emerald-500/20 text-emerald-300'
                                      : b.bookingStatus === 'ACTIVE'
                                      ? 'bg-blue-500/20 text-blue-300'
                                      : 'bg-amber-500/20 text-amber-300'
                                  }`}
                                >
                                  {b.bookingStatus}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: STANDALONE SHIPPER DASHBOARD */}
        {/* ============================================================== */}
        {activeTab === 'SHIPPER' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Shipper Mobile Experience</h3>
                <p className="text-xs text-slate-400">Create shipments, track live GPS trucks, select rated drivers, and download GST bills.</p>
              </div>
              <button
                onClick={() => setActiveTab('QUAD_VIEW')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                ← Back to 4-in-1 Quad View
              </button>
            </div>
            <div className="bg-white rounded-3xl border border-slate-300 p-4 text-slate-900 min-h-[680px]">
              <ShipperMobileApp
                screen={shipperScreen}
                onNavigate={setShipperScreen}
                props={sharedProps}
              />
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 3: STANDALONE TRANSPORTER DASHBOARD */}
        {/* ============================================================== */}
        {activeTab === 'TRANSPORTER' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Transporter Mobile Experience</h3>
                <p className="text-xs text-slate-400">Manage truck fleets, receive AI backhaul return loads, view driver assignments, and track ₹500 Pro Pass.</p>
              </div>
              <button
                onClick={() => setActiveTab('QUAD_VIEW')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                ← Back to 4-in-1 Quad View
              </button>
            </div>
            <div className="bg-white rounded-3xl border border-slate-300 p-4 text-slate-900 min-h-[680px]">
              <TransporterMobileApp
                screen={transporterScreen}
                onNavigate={setTransporterScreen}
                props={sharedProps}
              />
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 4: STANDALONE DRIVER DASHBOARD */}
        {/* ============================================================== */}
        {activeTab === 'DRIVER' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Driver Mobile Cockpit</h3>
                <p className="text-xs text-slate-400">Turn-by-turn navigation, weather and flood alerts, pickup/destination hub details, and return backhaul alerts.</p>
              </div>
              <button
                onClick={() => setActiveTab('QUAD_VIEW')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                ← Back to 4-in-1 Quad View
              </button>
            </div>
            <div className="bg-white rounded-3xl border border-slate-300 p-4 text-slate-900 min-h-[680px]">
              <DriverMobileApp
                screen={driverScreen}
                onNavigate={setDriverScreen}
                props={sharedProps}
              />
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 5: STANDALONE WEB ADMIN DASHBOARD */}
        {/* ============================================================== */}
        {activeTab === 'ADMIN' && (
          <div className="space-y-4">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Web Admin Dashboard (Standalone)</h3>
                <p className="text-xs text-slate-400">Complete SaaS platform control tower. You can also open the full dedicated routes under /admin.</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/admin"
                  className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span>Open /admin Direct Route</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => setActiveTab('QUAD_VIEW')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  ← Back to 4-in-1 Quad View
                </button>
              </div>
            </div>

            {/* Embedded Admin Shell Overview */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="text-xs text-slate-400 font-mono">Shippers Registered</div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {users.filter((u) => u.role === 'shipper').length}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="text-xs text-slate-400 font-mono">Transporter Fleets</div>
                  <div className="text-2xl font-bold text-teal-400 mt-1">
                    {users.filter((u) => u.role === 'transporter').length}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="text-xs text-slate-400 font-mono">Verified Drivers</div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {users.filter((u) => u.role === 'driver').length}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="text-xs text-slate-400 font-mono">Active Vehicles</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">
                    {trucks.length}
                  </div>
                </div>
              </div>

              {/* Live Shipments in Admin View */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  All Active Freight Shipments across India
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-850 text-slate-400 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="p-3">Shipment</th>
                        <th className="p-3">Corridor</th>
                        <th className="p-3">Vehicle</th>
                        <th className="p-3">Material</th>
                        <th className="p-3">Rate (INR)</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono">
                      {shipments.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-850/60">
                          <td className="p-3 font-bold text-white">{s.id}</td>
                          <td className="p-3 text-slate-300">
                            {s.originCity} → {s.destinationCity} ({s.distanceKm} km)
                          </td>
                          <td className="p-3 text-teal-400">{s.vehicleNumber}</td>
                          <td className="p-3 text-slate-400">{s.cargoMaterial}</td>
                          <td className="p-3 font-bold text-emerald-400">
                            ₹{s.freightRateInr.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300">
                              {s.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 6: PROFESSOR VIVA & ARCHITECTURE CHEATSHEET */}
        {/* ============================================================== */}
        {activeTab === 'ARCHITECTURE' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                <Award className="w-3.5 h-3.5" />
                Project Evaluation & Viva Preparation Cheatsheet
              </div>
              <h2 className="text-xl font-bold text-white">
                TruckBuddy: Technical Architecture & Core Innovation Summary
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Use these structured points during your academic demonstration to explain the system engineering, algorithmic decisions, and business logic to your professor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Point 1: 3 Roles + 1 Admin Architecture */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-teal-400">
                  <Users className="w-4 h-4" />
                  <h4 className="text-sm font-bold text-white">1. Multi-Tier Role-Based Architecture</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The system separates concerns cleanly across four distinct roles:
                </p>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                  <li><strong>Shipper:</strong> Posts loads, tracks truck telemetry in real-time, selects drivers, and receives GST tax invoices.</li>
                  <li><strong>Transporter:</strong> Fleet management, driver allocation, and empty-haul reduction via backhaul loads.</li>
                  <li><strong>Driver:</strong> Low-distraction mobile cockpit with weather hazard alerts and return-load pickups.</li>
                  <li><strong>Admin:</strong> Control tower for KYC approvals, commission tracking, and dispute mediation.</li>
                </ul>
              </div>

              {/* Point 2: AI Predictive Return-Load Engine */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                  <h4 className="text-sm font-bold text-white">2. AI Return-Load / Backhaul Matching</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>The Core Problem:</strong> In Indian logistics, over 38% of trucks return empty from their destination, wasting diesel and reducing driver wages.
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong>The Solution:</strong> When an outbound journey (Indore → Mumbai) is 80% complete, the AI engine triggers pre-emptive matching for loads returning from Mumbai back to Indore (or nearby hubs like Nashik/Dhule), alerting the transporter and driver first.
                </p>
              </div>

              {/* Point 3: Weather Intelligence & Google Maps */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-blue-400">
                  <CloudRain className="w-4 h-4" />
                  <h4 className="text-sm font-bold text-white">3. Google Maps & Weather Rerouting</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Integrates the Google Routes API v2 with live highway weather checkpoints:
                </p>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                  <li>Monitors rain intensity (mm/hr), crosswinds, and flood hazards along ghat sections (e.g., Kasara Ghat).</li>
                  <li>Computes flood-safe alternative corridors to prevent truck stranding and cargo damage.</li>
                </ul>
              </div>

              {/* Point 4: Monetization & Payments */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-400">
                  <DollarSign className="w-4 h-4" />
                  <h4 className="text-sm font-bold text-white">4. Monetization & Razorpay Integration</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Dual-tier monetization model:
                </p>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                  <li><strong>Shipper Membership Plans:</strong> STANDARD (₹500 · 5 Rides), PREMIUM (₹1,000 · 15 Days), and GOLD (₹2,200 · 3 Months).</li>
                  <li><strong>₹500 Pro Pass Fleet Subscription:</strong> Unlocks unlimited backhaul AI notifications and 0% commission.</li>
                  <li><strong>Razorpay API & 5% GST:</strong> Server-side order creation and automated Goods and Transport Agency tax invoicing.</li>
                </ul>
              </div>
            </div>

            {/* Point 5: Security & RBAC */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-rose-400">
                <Lock className="w-4 h-4" />
                <h4 className="text-sm font-bold text-white">5. Security & Role-Based Access Control (RBAC)</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The Customer Mobile App (<code className="text-teal-400">/</code>) completely omits admin controls. Administrative endpoints (<code className="text-teal-400">/admin/*</code>) are guarded by an HTTP 403 authorization filter requiring security tokens (<code className="text-slate-200">TB-ADMIN-2026</code> for Platform Admins and <code className="text-slate-200">TB-MANAGER-2026</code> for Operations Managers).
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Shared Active Modals */}
      {activeBillModal && (
        <RazorpayAndBillsModal
          isOpen={true}
          onClose={() => setActiveBillModal(null)}
          bill={activeBillModal}
          onMarkBillPaid={handleMarkBillPaid}
          onRateDriverFromBill={() => {}}
        />
      )}

      <SubscriptionPassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        ridesUsed={ridesUsed}
        isSubscribed={isSubscribed}
        pendingBookingLabel="Indore → Mumbai Multi-Axle Freight"
        onActivateSubscription={(planId) => {
          setIsSubscribed(true);
          setIsPassModalOpen(false);
          setDemoBanner(`${planId || 'STANDARD'} Shipper Plan activated! All 3 mobile views & Admin now show active tier.`);
        }}
        onSetTestState={(rides, sub) => {
          setRidesUsed(rides);
          setIsSubscribed(sub);
        }}
      />
    </div>
  );
}
