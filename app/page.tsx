'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
import SubscriptionPassModal from '@/components/SubscriptionPassModal';
import RazorpayAndBillsModal from '@/components/RazorpayAndBillsModal';
import {
  ShipperMobileApp,
  TransporterMobileApp,
  DriverMobileApp,
  ShipperScreen,
  TransporterScreen,
  DriverScreen,
} from '@/components/RoleWorkspaces';
import {
  Truck,
  Package,
  Compass,
  MapPin,
  Bell,
  User,
  Home,
  ArrowLeft,
  Receipt,
  Sparkles,
  Lock,
  KeyRound,
  ShieldCheck,
  Award,
  Globe,
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import LanguageSelectionModal from '@/components/LanguageSelectionModal';
import { ShipperPlanId } from '@/components/SubscriptionPassModal';

const SHIPPER_TITLES_HI: Record<ShipperScreen, string> = {
  OVERVIEW: 'शिपर होम',
  CREATE_SHIPMENT: 'नया शिपमेंट बनाएं',
  ACTIVE_SHIPMENTS: 'सक्रिय शिपमेंट्स',
  BOOKING_STATUS: 'बुकिंग स्थिति',
  LIVE_TRACKING: 'लाइव ट्रैकिंग',
  SHIPMENT_HISTORY: 'शिपमेंट इतिहास',
  AVAILABLE_TRANSPORTERS: 'ट्रांसपोर्टर्स और एआई',
  PAYMENTS: 'मेंबरशिप प्लान्स और बिल',
  NOTIFICATIONS: 'सूचनाएं',
  PROFILE: 'शिपर प्रोफाइल',
};

const TRANSPORTER_TITLES_HI: Record<TransporterScreen, string> = {
  OVERVIEW: 'ट्रांसपोर्टर होम',
  AVAILABLE_LOADS: 'उपलब्ध लोड',
  MY_BOOKINGS: 'मेरी बुकिंग्स',
  TRUCKS: 'फ्लीट ट्रक्स',
  DRIVERS: 'ड्राइवर्स और रेटिंग',
  ACTIVE_TRIPS: 'सक्रिय ट्रिप्स',
  EARNINGS: 'कमाई और बिल',
  COMPLETED_TRIPS: 'पूर्ण ट्रिप्स',
  REQUESTS: 'लोड अनुरोध',
  NOTIFICATIONS: 'सूचनाएं',
  PROFILE: 'ट्रांसपोर्टर प्रोफाइल',
};

const DRIVER_TITLES_HI: Record<DriverScreen, string> = {
  CURRENT_TRIP: 'ड्राइवर कॉकपिट',
  ASSIGNED_SHIPMENT: 'सौंपा गया माल',
  PICKUP_LOCATION: 'पिकअप स्थान',
  DESTINATION: 'गंतव्य स्थल',
  ROUTE_NAVIGATION: 'रूट और मौसम',
  TRIP_STATUS: 'ट्रिप स्थिति',
  RETURN_BACKHAUL: 'रिटर्न बैकहाल',
  TRIP_HISTORY: 'ट्रिप इतिहास',
  EARNINGS: 'ड्राइवर कमाई',
  NOTIFICATIONS: 'सूचनाएं',
  PROFILE: 'ड्राइवर प्रोफाइल',
};

const SHIPPER_TITLES: Record<ShipperScreen, string> = {
  OVERVIEW: 'Shipper Home',
  CREATE_SHIPMENT: 'Create Shipment',
  ACTIVE_SHIPMENTS: 'Active Shipments',
  BOOKING_STATUS: 'Booking Status',
  LIVE_TRACKING: 'Live Tracking',
  SHIPMENT_HISTORY: 'Shipment History',
  AVAILABLE_TRANSPORTERS: 'Transporters & AI',
  PAYMENTS: 'Razorpay & Bills',
  NOTIFICATIONS: 'Notifications',
  PROFILE: 'Shipper Profile',
};

const TRANSPORTER_TITLES: Record<TransporterScreen, string> = {
  OVERVIEW: 'Transporter Home',
  AVAILABLE_LOADS: 'Available Loads',
  MY_BOOKINGS: 'My Bookings',
  TRUCKS: 'My Fleet Trucks',
  DRIVERS: 'Drivers & Ratings',
  ACTIVE_TRIPS: 'Active Trips',
  EARNINGS: 'Earnings & Bills',
  COMPLETED_TRIPS: 'Completed Trips',
  REQUESTS: 'Load Requests',
  NOTIFICATIONS: 'Notifications',
  PROFILE: 'Transporter Profile',
};

const DRIVER_TITLES: Record<DriverScreen, string> = {
  CURRENT_TRIP: 'Driver Cockpit',
  ASSIGNED_SHIPMENT: 'Assigned Shipment',
  PICKUP_LOCATION: 'Pickup Location',
  DESTINATION: 'Destination Hub',
  ROUTE_NAVIGATION: 'Route & Weather',
  TRIP_STATUS: 'Trip Status',
  RETURN_BACKHAUL: 'Return Backhaul',
  TRIP_HISTORY: 'Trip History',
  EARNINGS: 'Driver Earnings',
  NOTIFICATIONS: 'Notifications',
  PROFILE: 'Driver Profile',
};

export default function TruckBuddyMobilePlatform() {
  const router = useRouter();
  const { t, language, hasSelectedInitialLanguage } = useLanguage();
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [shipperPlan, setShipperPlan] = useState<ShipperPlanId | null>('STANDARD');
  const [shipperRidesRemaining, setShipperRidesRemaining] = useState<number>(5);

  // Active Role & Role-Specific Mobile Screens
  const [role, setRole] = useState<UserRole>('transporter');
  const [isStaffGateOpen, setIsStaffGateOpen] = useState(false);
  const [staffKeyInput, setStaffKeyInput] = useState('');
  const [staffGateError, setStaffGateError] = useState<string | null>(null);
  const [logoTapCount, setLogoTapCount] = useState(0);
  const [shipperScreen, setShipperScreen] = useState<ShipperScreen>('OVERVIEW');
  const [transporterScreen, setTransporterScreen] =
    useState<TransporterScreen>('OVERVIEW');
  const [driverScreen, setDriverScreen] =
    useState<DriverScreen>('CURRENT_TRIP');

  // Core Logistics State (Preserved 100%)
  const [trucks, setTrucks] = useState<TruckTelemetry[]>(INITIAL_TRUCKS);
  const [selectedTruckId, setSelectedTruckId] = useState<string>(
    INITIAL_TRUCKS[0].id
  );
  const [drivers, setDrivers] = useState<DriverOption[]>(DRIVER_OPTIONS);
  const [returnLoads, setReturnLoads] =
    useState<ReturnLoadOffer[]>(INITIAL_RETURN_LOADS);
  const [bookedLoadIds, setBookedLoadIds] = useState<string[]>([]);

  // Bills & Razorpay State
  const [bills, setBills] = useState<RideBill[]>(INITIAL_BILLS);
  const [activeBillModal, setActiveBillModal] = useState<RideBill | null>(null);

  // First 2 Rides Free + ₹500 Subscription State
  const [ridesUsed, setRidesUsed] = useState<number>(1);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState<boolean>(false);
  const [pendingBooking, setPendingBooking] = useState<{
    id: string;
    routeLabel: string;
    rateInr: number;
    shipper: string;
  } | null>(null);

  // Live Simulation & Weather/Routes API State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [encodedPolylines, setEncodedPolylines] = useState<
    Record<string, string>
  >({});
  const [toastBanner, setToastBanner] = useState<{
    title: string;
    detail: string;
  } | null>(null);

  const selectedTruck =
    trucks.find((t) => t.id === selectedTruckId) || trucks[0];
  const currentTruckBill =
    bills.find((b) => b.truckId === selectedTruck.id) || bills[0];

  // Fetch live Google Routes API v2 & Google Weather API v1 telemetry
  const syncLiveWeatherAndRoutes = useCallback(async (truck: TruckTelemetry) => {
    try {
      const primaryRoute =
        truck.routes.find((r) => r.id === truck.activeRouteId) ||
        truck.routes[0];
      const res = await fetch('/api/weather-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: truck.originCoords,
          destination: truck.destinationCoords,
          checkpoints: primaryRoute.checkpoints,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (
          Array.isArray(data.computedRoutes) &&
          data.computedRoutes.length > 0
        ) {
          const polyMap: Record<string, string> = {};
          truck.routes.forEach((r, idx) => {
            const apiRoute =
              data.computedRoutes[idx] || data.computedRoutes[0];
            if (apiRoute?.polyline?.encodedPolyline) {
              polyMap[r.id] = apiRoute.polyline.encodedPolyline;
            }
          });
          setEncodedPolylines((prev) => ({ ...prev, ...polyMap }));
        }

        if (Array.isArray(data.checkpoints) && data.checkpoints.length > 0) {
          setTrucks((prev) =>
            prev.map((t) => {
              if (t.id !== truck.id) return t;
              return {
                ...t,
                routes: t.routes.map((r) =>
                  r.id === primaryRoute.id
                    ? { ...r, checkpoints: data.checkpoints }
                    : r
                ),
              };
            })
          );
        }
      }
    } catch {
      // Fallback to verified corridor checkpoints
    }
  }, []);

  useEffect(() => {
    syncLiveWeatherAndRoutes(selectedTruck);
  }, [selectedTruck.id, syncLiveWeatherAndRoutes]);

  // Generate or open Bill for a completed ride
  const generateOrOpenRideBill = useCallback(
    (truckObj: TruckTelemetry) => {
      const existing = bills.find((b) => b.truckId === truckObj.id);
      if (existing) {
        setActiveBillModal(existing);
        return;
      }
      const routeUsed =
        truckObj.routes.find((r) => r.id === truckObj.activeRouteId) ||
        truckObj.routes[0];
      const base = truckObj.freightAmountInr;
      const toll = routeUsed.tollCostInr;
      const fee = isSubscribed || ridesUsed < 2 ? 0 : 500;
      const gst = Math.round((base + toll) * 0.05);
      const newBill: RideBill = {
        invoiceId: `INV-TB-${Math.floor(100 + Math.random() * 899)}`,
        truckId: truckObj.id,
        vehicleNumber: truckObj.vehicleNumber,
        transporterName: truckObj.transporterName,
        transporterGstin: '27AABCT4092K1Z4',
        shipperName: truckObj.shipperName,
        driverName: truckObj.driverName,
        driverRating: truckObj.driverRating,
        originCity: truckObj.originCity,
        destinationCity: truckObj.destinationCity,
        highwayUsed: routeUsed.highwayTag,
        distanceKm: routeUsed.distanceKm,
        cargoMaterial: truckObj.cargoMaterial,
        weightTons: truckObj.cargoWeightTons,
        baseFreightInr: base,
        tollChargesInr: toll,
        platformFeeInr: fee,
        gstInr: gst,
        totalPayableInr: base + toll + fee + gst,
        isFreeRideApplied: ridesUsed < 2,
        status: 'PENDING_PAYMENT',
        createdAt: '28 Sep 2026, Just Completed',
      };
      setBills((prev) => [newBill, ...prev]);
      setActiveBillModal(newBill);
    },
    [bills, isSubscribed, ridesUsed]
  );

  // Interpolate truck coordinates along active route waypoints
  const handleUpdateProgress = useCallback(
    (newProgress: number) => {
      const clamped = Math.max(0, Math.min(100, newProgress));
      setTrucks((prev) =>
        prev.map((t) => {
          if (t.id !== selectedTruckId) return t;
          const route =
            t.routes.find((r) => r.id === t.activeRouteId) || t.routes[0];
          const pts = route.waypoints;
          const totalSegments = pts.length - 1;
          const exactIdx = (clamped / 100) * totalSegments;
          const lowIdx = Math.floor(exactIdx);
          const highIdx = Math.min(totalSegments, lowIdx + 1);
          const frac = exactIdx - lowIdx;

          const lat =
            pts[lowIdx].lat + (pts[highIdx].lat - pts[lowIdx].lat) * frac;
          const lng =
            pts[lowIdx].lng + (pts[highIdx].lng - pts[lowIdx].lng) * frac;

          const isArrived = clamped >= 100;
          const isHalted = clamped === 48;

          return {
            ...t,
            progressPercent: clamped,
            currentCoords: { lat, lng },
            status: isArrived
              ? 'UNLOADING'
              : isHalted
              ? 'STAYING_AT_HALT'
              : 'EN_ROUTE',
            speedKmh: isArrived || isHalted ? 0 : 62,
            currentLocationName: isArrived
              ? `${t.destinationCity} (${t.destinationHub})`
              : isHalted
              ? 'Dhule NH-52 Logistics Plaza, MH'
              : `Cruising ${route.highwayTag} (${clamped}%)`,
            stayingLocationDetail: isArrived
              ? `Delivered at ${t.destinationHub} — GST Bill Generated`
              : isHalted
              ? 'Halted at Bay 4, Dhule Highway Plaza'
              : `Moving at 62 km/h along ${route.highwayTag}`,
            etaText: isArrived
              ? `Delivered at ${t.destinationCity}`
              : `${Math.max(
                  1,
                  Math.round(((100 - clamped) / 100) * route.durationHrs)
                )}h left (${Math.round(
                  ((100 - clamped) / 100) * route.distanceKm
                )} km)`,
          };
        })
      );

      if (clamped >= 100) {
        setIsSimulating(false);
        generateOrOpenRideBill(selectedTruck);
        setToastBanner({
          title: `Ride Completed · GST Bill Generated`,
          detail: `Pay via Razorpay or lock your ${selectedTruck.destinationCity} → ${selectedTruck.originCity} return load.`,
        });
      }
    },
    [selectedTruckId, selectedTruck, generateOrOpenRideBill]
  );

  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setTrucks((prev) =>
        prev.map((t) => {
          if (t.id !== selectedTruckId) return t;
          const nextProg = Math.min(100, t.progressPercent + 5);
          const route =
            t.routes.find((r) => r.id === t.activeRouteId) || t.routes[0];
          const pts = route.waypoints;
          const totalSegments = pts.length - 1;
          const exactIdx = (nextProg / 100) * totalSegments;
          const lowIdx = Math.floor(exactIdx);
          const highIdx = Math.min(totalSegments, lowIdx + 1);
          const frac = exactIdx - lowIdx;

          const lat =
            pts[lowIdx].lat + (pts[highIdx].lat - pts[lowIdx].lat) * frac;
          const lng =
            pts[lowIdx].lng + (pts[highIdx].lng - pts[lowIdx].lng) * frac;

          if (nextProg >= 100) {
            setIsSimulating(false);
          }

          return {
            ...t,
            progressPercent: nextProg,
            currentCoords: { lat, lng },
            status: nextProg >= 100 ? 'UNLOADING' : 'EN_ROUTE',
            speedKmh: nextProg >= 100 ? 0 : 62,
            currentLocationName:
              nextProg >= 100
                ? `${t.destinationCity} (${t.destinationHub})`
                : `Cruising ${route.highwayTag} (${nextProg}%)`,
            stayingLocationDetail:
              nextProg >= 100
                ? `Arrived at ${t.destinationHub}`
                : `In transit at 62 km/h`,
            etaText:
              nextProg >= 100
                ? 'Delivered'
                : `${Math.max(
                    1,
                    Math.round(((100 - nextProg) / 100) * route.durationHrs)
                  )}h left`,
          };
        })
      );
    }, 850);

    return () => clearInterval(interval);
  }, [isSimulating, selectedTruckId]);

  function handleSelectRoute(routeId: string) {
    setTrucks((prev) =>
      prev.map((t) =>
        t.id === selectedTruckId ? { ...t, activeRouteId: routeId } : t
      )
    );
  }

  function handleSelectDriver(drv: DriverOption) {
    setTrucks((prev) =>
      prev.map((t) =>
        t.id === selectedTruckId
          ? {
              ...t,
              driverId: drv.id,
              driverName: drv.name,
              driverPhone: drv.phone,
              driverRating: drv.rating,
              driverReviewsCount: drv.totalReviews,
              transporterName: drv.transporterName,
            }
          : t
      )
    );
    setBills((prev) =>
      prev.map((b) =>
        b.truckId === selectedTruckId
          ? {
              ...b,
              driverName: drv.name,
              driverRating: drv.rating,
              transporterName: drv.transporterName,
            }
          : b
      )
    );
    setToastBanner({
      title: `Driver Selected: ${drv.name} (${drv.rating.toFixed(2)}★)`,
      detail: `${drv.transporterName}`,
    });
  }

  function handleRateDriver(driverId: string, stars: number) {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id !== driverId) return d;
        const newTotal = d.totalReviews + 1;
        const newRating = Number(
          ((d.rating * d.totalReviews + stars) / newTotal).toFixed(2)
        );
        return {
          ...d,
          rating: newRating,
          totalReviews: newTotal,
        };
      })
    );
    setTrucks((prev) =>
      prev.map((t) => {
        if (t.driverId !== driverId) return t;
        const newTotal = t.driverReviewsCount + 1;
        const newRating = Number(
          ((t.driverRating * t.driverReviewsCount + stars) / newTotal).toFixed(2)
        );
        return {
          ...t,
          driverRating: newRating,
          driverReviewsCount: newTotal,
        };
      })
    );
  }

  function handleMarkBillPaid(
    invoiceId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string
  ) {
    setBills((prev) =>
      prev.map((b) =>
        b.invoiceId === invoiceId
          ? {
              ...b,
              status: 'PAID',
              razorpayOrderId,
              razorpayPaymentId,
              paidAt: 'Just now',
            }
          : b
      )
    );
    setActiveBillModal((prev) =>
      prev && prev.invoiceId === invoiceId
        ? {
            ...prev,
            status: 'PAID',
            razorpayOrderId,
            razorpayPaymentId,
            paidAt: 'Just now',
          }
        : prev
    );
    setToastBanner({
      title: `Paid via Razorpay (${razorpayPaymentId})`,
      detail: `Invoice #${invoiceId} settled.`,
    });
  }

  function handleBookReturnLoad(loadInfo: {
    id: string;
    routeLabel: string;
    rateInr: number;
    shipper: string;
  }) {
    if (bookedLoadIds.includes(loadInfo.id)) return;

    if (role === 'shipper') {
      if (!shipperPlan) {
        setPendingBooking(loadInfo);
        setIsPassModalOpen(true);
        return;
      }
      if (shipperPlan === 'STANDARD' && shipperRidesRemaining <= 0) {
        setPendingBooking(loadInfo);
        setIsPassModalOpen(true);
        return;
      }
      if (shipperPlan === 'STANDARD') {
        setShipperRidesRemaining((prev) => Math.max(0, prev - 1));
      }
    }

    setBookedLoadIds((prev) => [...prev, loadInfo.id]);
    setToastBanner({
      title: language === 'hi'
        ? `लोड बुक किया गया: ${loadInfo.routeLabel}`
        : `Return Load Booked: ${loadInfo.routeLabel}`,
      detail: `${loadInfo.shipper} · ₹${loadInfo.rateInr.toLocaleString('en-IN')}`,
    });
  }

  function handleActivateSubscription(planId: ShipperPlanId = 'STANDARD') {
    setShipperPlan(planId);
    if (planId === 'STANDARD') {
      setShipperRidesRemaining(5);
    }
    setIsSubscribed(true);
    if (pendingBooking) {
      setBookedLoadIds((prev) => [...prev, pendingBooking.id]);
      if (planId === 'STANDARD') {
        setShipperRidesRemaining(4);
      }
      setToastBanner({
        title: language === 'hi'
          ? `${planId} प्लान सक्रिय + लोड बुक हुआ`
          : `${planId} Plan Activated + Booked ${pendingBooking.routeLabel}`,
        detail: language === 'hi'
          ? `शून्य कमीशन के साथ माल लोड दर्ज किया गया।`
          : `Freight dispatch registered with zero commission.`,
      });
      setPendingBooking(null);
    } else {
      setToastBanner({
        title: language === 'hi' ? `${planId} शिपर प्लान सक्रिय!` : `${planId} Shipper Plan Activated!`,
        detail: planId === 'STANDARD'
          ? (language === 'hi' ? '5 माल ढुलाई राइड्स उपलब्ध।' : '5 freight dispatches unlocked.')
          : planId === 'PREMIUM'
          ? (language === 'hi' ? '15 दिनों की असीमित बुकिंग सक्रिय।' : '15 days unlimited dispatches active.')
          : (language === 'hi' ? '3 महीने की असीमित बुकिंग सक्रिय।' : '3 months unlimited dispatches active.'),
      });
    }
    setIsPassModalOpen(false);
  }

  function handlePostNewShipperLoad(newLoad: {
    originCity: string;
    originHub: string;
    destinationCity: string;
    destinationHub: string;
    shipperCompany: string;
    material: string;
    weightTons: number;
    offeredRateInr: number;
  }) {
    if (ridesUsed >= 2 && !isSubscribed) {
      setPendingBooking({
        id: `RET-CUSTOM-${Date.now()}`,
        routeLabel: `${newLoad.originCity} → ${newLoad.destinationCity}`,
        rateInr: newLoad.offeredRateInr,
        shipper: newLoad.shipperCompany,
      });
      setIsPassModalOpen(true);
      return;
    }

    const created: ReturnLoadOffer = {
      id: `RET-${Date.now().toString().slice(-4)}`,
      originCity: newLoad.originCity,
      originHub: newLoad.originHub,
      originCoords: { lat: 19.2967, lng: 73.0631 },
      destinationCity: newLoad.destinationCity,
      destinationHub: newLoad.destinationHub,
      destinationCoords: { lat: 22.7196, lng: 75.8577 },
      shipperCompany: newLoad.shipperCompany,
      transporterName: selectedTruck.transporterName,
      shipperVerified: true,
      material: newLoad.material,
      weightTons: newLoad.weightTons,
      requiredTruckType: '32ft Multi-Axle Container',
      offeredRateInr: newLoad.offeredRateInr,
      marketAvgRateInr: Math.round(newLoad.offeredRateInr * 0.92),
      pickupWindow: 'Immediate / Matched to Arriving Truck',
      distanceKm: 598,
      deadheadKmFromDrop: 2.1,
      aiMatchScore: 99,
      priorityRank: 1,
      matchedForTruckId: selectedTruck.id,
      weatherOnReturn: 'CLEAR',
      aiPredictiveNote: `Notified ${selectedTruck.transporterName} (${selectedTruck.vehicleNumber}) first!`,
      status: 'PRIORITY_NOTIFIED',
    };

    const nextRideNum = ridesUsed + 1;
    setRidesUsed(nextRideNum);
    setReturnLoads((prev) => [created, ...prev]);
    setToastBanner({
      title: `Shipment Created (${newLoad.originCity} → ${newLoad.destinationCity})`,
      detail: `Alerted ${selectedTruck.transporterName} (${selectedTruck.vehicleNumber}).`,
    });
  }

  function handleSwitchRole(targetRole: UserRole) {
    setRole(targetRole);
    if (targetRole === 'shipper') setShipperScreen('OVERVIEW');
    if (targetRole === 'transporter') setTransporterScreen('OVERVIEW');
    if (targetRole === 'driver') setDriverScreen('CURRENT_TRIP');
  }

  // Determine current screen title & whether Back button should show
  const isHomeScreen =
    (role === 'shipper' && shipperScreen === 'OVERVIEW') ||
    (role === 'transporter' && transporterScreen === 'OVERVIEW') ||
    (role === 'driver' && driverScreen === 'CURRENT_TRIP');

  const currentScreenTitle =
    role === 'shipper'
      ? (language === 'hi' && SHIPPER_TITLES_HI[shipperScreen] ? SHIPPER_TITLES_HI[shipperScreen] : SHIPPER_TITLES[shipperScreen])
      : role === 'transporter'
      ? (language === 'hi' && TRANSPORTER_TITLES_HI[transporterScreen] ? TRANSPORTER_TITLES_HI[transporterScreen] : TRANSPORTER_TITLES[transporterScreen])
      : (language === 'hi' && DRIVER_TITLES_HI[driverScreen] ? DRIVER_TITLES_HI[driverScreen] : DRIVER_TITLES[driverScreen]);

  function handleBackToHome() {
    if (role === 'shipper') setShipperScreen('OVERVIEW');
    if (role === 'transporter') setTransporterScreen('OVERVIEW');
    if (role === 'driver') setDriverScreen('CURRENT_TRIP');
  }

  const sharedProps = {
    trucks,
    selectedTruck,
    onSelectTruck: setSelectedTruckId,
    drivers,
    onSelectDriver: handleSelectDriver,
    onRateDriver: handleRateDriver,
    returnLoads,
    bookedLoadIds,
    onBookReturnLoad: handleBookReturnLoad,
    onPostNewReturnLoad: handlePostNewShipperLoad,
    bills,
    currentBill: currentTruckBill,
    onOpenBillModal: (b?: RideBill) =>
      setActiveBillModal(b || currentTruckBill),
    ridesUsed,
    isSubscribed,
    onOpenSubscriptionModal: () => {
      setPendingBooking(null);
      setIsPassModalOpen(true);
    },
    onSelectRoute: handleSelectRoute,
    onProgressChange: handleUpdateProgress,
    isSimulating,
    onToggleSimulation: () => setIsSimulating((s) => !s),
    onUpdateTruckStatus: (
      newStatus: 'EN_ROUTE' | 'STAYING_AT_HALT',
      newProg?: number
    ) => {
      if (typeof newProg === 'number') {
        handleUpdateProgress(newProg);
      } else {
        setTrucks((prev) =>
          prev.map((t) =>
            t.id === selectedTruck.id
              ? {
                  ...t,
                  status: newStatus,
                  speedKmh: newStatus === 'STAYING_AT_HALT' ? 0 : 58,
                }
              : t
          )
        );
      }
    },
    encodedPolylines,
    onSwitchRole: handleSwitchRole,
    shipperPlan,
    shipperRidesRemaining,
    onSelectShipperPlan: handleActivateSubscription,
    onOpenLanguageModal: () => setIsLanguageModalOpen(true),
  };

  return (
    <div className="min-h-screen bg-slate-200/70 flex justify-center">
      {/* Mobile Application Viewport Frame (max-w-[440px] on desktop, 100% full screen on mobile) */}
      <div className="w-full max-w-[440px] min-h-screen bg-[#F5F6F8] text-[#1E293B] flex flex-col relative shadow-xl border-x border-slate-200/80">
        {/* Sticky Mobile App Top Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3.5 pt-2.5 pb-2 space-y-2">
          <div className="flex items-center justify-between gap-2">
            {/* Left: Back Button or Brand + Screen Title */}
            <div className="flex items-center gap-2 min-w-0">
              {!isHomeScreen ? (
                <button
                  onClick={handleBackToHome}
                  aria-label="Back"
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-transform"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const nextCount = logoTapCount + 1;
                    if (nextCount >= 3) {
                      setLogoTapCount(0);
                      setStaffGateError(null);
                      setIsStaffGateOpen(true);
                    } else {
                      setLogoTapCount(nextCount);
                    }
                  }}
                  title="TruckBuddy (Tap 3x for Staff Login)"
                  className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-2xs cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                </button>
              )}
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-teal-700 font-bold leading-none">
                  TruckBuddy App
                </div>
                <h1 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                  {currentScreenTitle}
                </h1>
              </div>
            </div>

            {/* Right: 4-in-1 Showcase, Language Switcher & Quick Bill */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsLanguageModalOpen(true)}
                className="min-h-[36px] px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
                title="Select Language / भाषा चुनें"
              >
                <Globe className="w-3.5 h-3.5 text-teal-700" />
                <span>{language === 'hi' ? 'हिं' : 'EN'}</span>
              </button>

              <Link
                href="/showcase"
                className="min-h-[36px] px-2.5 py-1 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold flex items-center gap-1 shrink-0 shadow-2xs transition-colors"
                title="Professor Showcase: View all 3 mobile dashboards & admin together"
              >
                <Award className="w-3 h-3 text-amber-300" />
                <span>4-in-1 Demo</span>
              </Link>

              <button
                onClick={() => setActiveBillModal(currentTruckBill)}
                className="min-h-[36px] px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Receipt className="w-3.5 h-3.5 text-teal-700" />
                <span>{language === 'hi' ? 'बिल' : 'Bill'}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    currentTruckBill.status === 'PAID'
                      ? 'bg-emerald-500'
                      : 'bg-amber-500'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 3-Role Switcher Segmented Bar (Opens Dedicated Role App) */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/70">
            {(
              [
                { id: 'shipper', label: language === 'hi' ? 'शिपर' : 'Shipper', icon: Package },
                { id: 'transporter', label: language === 'hi' ? 'ट्रांसपोर्टर' : 'Transporter', icon: Truck },
                { id: 'driver', label: language === 'hi' ? 'ड्राइवर' : 'Driver', icon: Compass },
              ] as const
            ).map((r) => {
              const Icon = r.icon;
              const active = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => handleSwitchRole(r.id)}
                  className={`min-h-[36px] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    active
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      active ? 'text-teal-700' : 'text-slate-400'
                    }`}
                  />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </header>

        {/* Compact Mobile Toast Banner */}
        {toastBanner && (
          <div className="mx-3.5 mt-2.5 p-3 rounded-2xl bg-slate-900 text-white flex items-start justify-between gap-2 shadow-sm">
            <div className="text-xs">
              <div className="font-bold text-teal-300">{toastBanner.title}</div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                {toastBanner.detail}
              </div>
            </div>
            <button
              onClick={() => setToastBanner(null)}
              className="text-xs text-slate-400 hover:text-white px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Scrollable Dedicated Role Screen Content */}
        <main className="flex-1 px-3.5 pt-3.5 pb-24 overflow-y-auto">
          {role === 'shipper' && (
            <ShipperMobileApp
              screen={shipperScreen}
              onNavigate={setShipperScreen}
              props={sharedProps}
            />
          )}

          {role === 'transporter' && (
            <TransporterMobileApp
              screen={transporterScreen}
              onNavigate={setTransporterScreen}
              props={sharedProps}
            />
          )}

          {role === 'driver' && (
            <DriverMobileApp
              screen={driverScreen}
              onNavigate={setDriverScreen}
              props={sharedProps}
            />
          )}
        </main>

        {/* Fixed Bottom Mobile Navigation Bar (Role-Specific) */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5">
          {role === 'shipper' && (
            <div className="grid grid-cols-5 items-center">
              {(
                [
                  { id: 'OVERVIEW', label: 'Home', icon: Home },
                  { id: 'ACTIVE_SHIPMENTS', label: 'Shipments', icon: Package },
                  { id: 'LIVE_TRACKING', label: 'Track', icon: MapPin },
                  { id: 'NOTIFICATIONS', label: 'Alerts', icon: Bell },
                  { id: 'PROFILE', label: 'Profile', icon: User },
                ] as const
              ).map((nav) => {
                const Icon = nav.icon;
                const active = shipperScreen === nav.id;
                return (
                  <button
                    key={nav.id}
                    onClick={() => setShipperScreen(nav.id)}
                    className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer ${
                      active ? 'text-teal-700' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-semibold mt-0.5">
                      {nav.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {role === 'transporter' && (
            <div className="grid grid-cols-5 items-center">
              {(
                [
                  { id: 'OVERVIEW', label: 'Home', icon: Home },
                  { id: 'AVAILABLE_LOADS', label: 'Loads', icon: Sparkles },
                  { id: 'ACTIVE_TRIPS', label: 'Trips', icon: MapPin },
                  { id: 'NOTIFICATIONS', label: 'Alerts', icon: Bell },
                  { id: 'PROFILE', label: 'Profile', icon: User },
                ] as const
              ).map((nav) => {
                const Icon = nav.icon;
                const active = transporterScreen === nav.id;
                return (
                  <button
                    key={nav.id}
                    onClick={() => setTransporterScreen(nav.id)}
                    className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer ${
                      active ? 'text-teal-700' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-semibold mt-0.5">
                      {nav.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {role === 'driver' && (
            <div className="grid grid-cols-5 items-center">
              {(
                [
                  { id: 'CURRENT_TRIP', label: 'Trip', icon: Compass },
                  { id: 'ROUTE_NAVIGATION', label: 'Route', icon: MapPin },
                  { id: 'RETURN_BACKHAUL', label: 'Backhaul', icon: Sparkles },
                  { id: 'NOTIFICATIONS', label: 'Alerts', icon: Bell },
                  { id: 'PROFILE', label: 'Profile', icon: User },
                ] as const
              ).map((nav) => {
                const Icon = nav.icon;
                const active = driverScreen === nav.id;
                return (
                  <button
                    key={nav.id}
                    onClick={() => setDriverScreen(nav.id)}
                    className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer ${
                      active ? 'text-teal-700' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-semibold mt-0.5">
                      {nav.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </nav>

        {/* First-Time or On-Demand Language Selection Modal */}
        <LanguageSelectionModal
          isOpen={isLanguageModalOpen || !hasSelectedInitialLanguage}
          onClose={() => setIsLanguageModalOpen(false)}
          isFirstTime={!hasSelectedInitialLanguage}
        />

        {/* Post-Ride GST Bill & Razorpay Checkout Modal */}
        {activeBillModal && (
          <RazorpayAndBillsModal
            isOpen={true}
            onClose={() => setActiveBillModal(null)}
            bill={activeBillModal}
            onMarkBillPaid={handleMarkBillPaid}
            onRateDriverFromBill={(stars) =>
              handleRateDriver(selectedTruck.driverId, stars)
            }
          />
        )}

        {/* First 2 Rides Free + ₹500 Pro Subscription Modal */}
        <SubscriptionPassModal
          isOpen={isPassModalOpen}
          onClose={() => {
            setIsPassModalOpen(false);
            setPendingBooking(null);
          }}
          ridesUsed={ridesUsed}
          isSubscribed={isSubscribed}
          pendingBookingLabel={
            pendingBooking
              ? `${pendingBooking.routeLabel} (₹${pendingBooking.rateInr.toLocaleString('en-IN')})`
              : null
          }
          onActivateSubscription={handleActivateSubscription}
          onSetTestState={(rides, sub) => {
            setRidesUsed(rides);
            setIsSubscribed(sub);
          }}
        />
      </div>

      {/* Desktop-only Professor Showcase Link (Outside Mobile Frame) */}
      <Link
        href="/showcase"
        className="hidden lg:flex fixed bottom-5 left-5 z-40 items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-600 hover:to-emerald-600 text-white shadow-xl text-xs font-bold cursor-pointer transition-all border border-teal-500/30"
      >
        <Award className="w-4 h-4 text-amber-300" />
        <span>🎓 Professor Showcase (All 4 Dashboards Together)</span>
      </Link>

      {/* Desktop-only Staff Portal Lock Trigger (Outside Customer Mobile Frame) */}
      <button
        type="button"
        onClick={() => {
          setStaffGateError(null);
          setIsStaffGateOpen(true);
        }}
        className="hidden lg:flex fixed bottom-5 right-5 z-40 items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-slate-200 border border-slate-700 shadow-lg text-xs font-semibold cursor-pointer transition-all"
      >
        <Lock className="w-3.5 h-3.5 text-teal-400" />
        <span>Staff / Admin Portal</span>
      </button>

      {/* Password-Protected Staff / Admin Security Gate Modal */}
      {isStaffGateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Admin & Manager Security Gate
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Customers cannot access this area
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsStaffGateOpen(false)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {staffGateError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 font-medium">
                {staffGateError}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const clean = staffKeyInput.trim();
                if (clean === 'TB-ADMIN-2026' || clean === 'TB-MANAGER-2026') {
                  setIsStaffGateOpen(false);
                  router.push('/admin');
                } else {
                  setStaffGateError(
                    'Access Denied: Only Admins (TB-ADMIN-2026) or Managers (TB-MANAGER-2026) are permitted.'
                  );
                }
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Enter Admin or Manager Security Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={staffKeyInput}
                    onChange={(e) => setStaffKeyInput(e.target.value)}
                    placeholder="TB-ADMIN-2026 or TB-MANAGER-2026"
                    required
                    className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setStaffKeyInput('TB-ADMIN-2026');
                    setStaffGateError(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 font-mono cursor-pointer"
                >
                  Fill Admin Key
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStaffKeyInput('TB-MANAGER-2026');
                    setStaffGateError(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 font-mono cursor-pointer"
                >
                  Fill Manager Key
                </button>
              </div>

              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Verify Key & Launch Web Admin Dashboard</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
