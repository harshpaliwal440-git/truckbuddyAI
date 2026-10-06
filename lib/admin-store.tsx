'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

export type AdminAccessRole = 'ADMIN' | 'MANAGER' | UserRole | 'CUSTOMER_GUEST';

export interface PlatformUser {
  id: string;
  name: string;
  companyName: string;
  role: 'shipper' | 'transporter' | 'driver';
  email: string;
  phone: string;
  city: string;
  hubAddress: string;
  gstinOrLicense: string;
  status: 'ACTIVE' | 'PENDING_REVIEW' | 'SUSPENDED';
  verificationStatus: 'VERIFIED' | 'PENDING_KYC' | 'REJECTED';
  joinedDate: string;
  lastActive: string;
  totalTripsOrShipments: number;
  totalVolumeInr: number;
  rating: number;
  subscriptionTier: 'PRO_PASS_500' | 'FREE_TIER_1_OF_2' | 'FREE_TIER_2_OF_2';
  assignedVehicleNumber?: string;
  fleetCount?: number;
}

export interface PlatformShipment {
  id: string;
  bookingId: string;
  type: 'OUTBOUND_PRIMARY' | 'AI_RETURN_BACKHAUL';
  shipperId: string;
  shipperName: string;
  transporterId: string;
  transporterName: string;
  truckId: string;
  vehicleNumber: string;
  truckType: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  originCity: string;
  pickupHub: string;
  destinationCity: string;
  destinationHub: string;
  highwayCorridor: string;
  cargoMaterial: string;
  weightTons: number;
  distanceKm: number;
  freightRateInr: number;
  platformCommissionInr: number;
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING' | 'CANCELLED';
  progressPercent: number;
  currentLocation: string;
  etaText: string;
  weatherAdvisory: string;
  createdAt: string;
}

export interface PlatformBooking {
  id: string;
  shipmentId: string;
  loadType: 'PRIMARY_DISPATCH' | 'RETURN_BACKHAUL';
  shipperName: string;
  transporterName: string;
  driverName: string;
  vehicleNumber: string;
  originCity: string;
  destinationCity: string;
  material: string;
  weightTons: number;
  agreedAmountInr: number;
  platformFeeInr: number;
  isFreeRide: boolean;
  bookingStatus: 'PENDING' | 'ACCEPTED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PAID' | 'PENDING_PAYMENT' | 'REFUNDED';
  aiMatchScore: number;
  createdAt: string;
}

export interface PlatformIssue {
  id: string;
  category: 'USER_COMPLAINT' | 'DISPUTE' | 'WEATHER_HAZARD' | 'SYSTEM_ALERT';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  reportedByRole: 'shipper' | 'transporter' | 'driver' | 'system';
  reportedByName: string;
  relatedEntityId: string;
  corridor: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  resolutionNote?: string;
}

export interface MonthlyMetric {
  month: string;
  bookingsCount: number;
  outboundCount: number;
  backhaulCount: number;
  shipmentTons: number;
  grossFreightInr: number;
  platformRevenueInr: number;
  activeUsers: number;
  transporterActivityPct: number;
  driverActivityPct: number;
}

export const INITIAL_PLATFORM_USERS: PlatformUser[] = [
  // Shippers
  {
    id: 'USR-SHP-101',
    name: 'Vikramaditya Deshmukh',
    companyName: 'Cipla & Pithampur Auto Components',
    role: 'shipper',
    email: 'v.deshmukh@cipla-pithampur.in',
    phone: '+91 98260 11200',
    city: 'Indore',
    hubAddress: 'Pithampur Industrial Area, Sector 3, MP',
    gstinOrLicense: '23AABCC1092D1Z5',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    joinedDate: '12 Jan 2026',
    lastActive: '2m ago',
    totalTripsOrShipments: 28,
    totalVolumeInr: 1348500,
    rating: 4.94,
    subscriptionTier: 'PRO_PASS_500',
  },
  {
    id: 'USR-SHP-102',
    name: 'Meenakshi Iyer',
    companyName: 'Reliance Retail Supply Chain',
    role: 'shipper',
    email: 'meenakshi.iyer@relianceretail-scm.in',
    phone: '+91 98201 44810',
    city: 'Mumbai',
    hubAddress: 'JNPT Nhava Sheva Port Gate 2 / Bhiwandi',
    gstinOrLicense: '27AAACR5091K1Z8',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    joinedDate: '04 Feb 2026',
    lastActive: '8m ago',
    totalTripsOrShipments: 34,
    totalVolumeInr: 1620000,
    rating: 4.91,
    subscriptionTier: 'PRO_PASS_500',
  },
  {
    id: 'USR-SHP-103',
    name: 'Saurabh Patel',
    companyName: 'Larsen & Toubro Heavy Engg',
    role: 'shipper',
    email: 'saurabh.patel@larsentoubro.com',
    phone: '+91 98982 77310',
    city: 'Ahmedabad',
    hubAddress: 'Sanand GIDC Phase II, Gujarat',
    gstinOrLicense: '24AAACL0124E1Z2',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    joinedDate: '19 Feb 2026',
    lastActive: '14m ago',
    totalTripsOrShipments: 19,
    totalVolumeInr: 1045000,
    rating: 4.96,
    subscriptionTier: 'PRO_PASS_500',
  },
  {
    id: 'USR-SHP-104',
    name: 'Rohini Kulkarni',
    companyName: 'Godrej & Boyce Industrial Freight',
    role: 'shipper',
    email: 'r.kulkarni@godrej-logistics.in',
    phone: '+91 98214 66390',
    city: 'Mumbai',
    hubAddress: 'Bhiwandi Logistics Park, Thane, MH',
    gstinOrLicense: '27AAACG3319H1Z1',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    joinedDate: '08 Mar 2026',
    lastActive: '21m ago',
    totalTripsOrShipments: 15,
    totalVolumeInr: 690000,
    rating: 4.89,
    subscriptionTier: 'PRO_PASS_500',
  },
  {
    id: 'USR-SHP-105',
    name: 'Aravind Nair',
    companyName: 'Tata Chemicals Import Desk',
    role: 'shipper',
    email: 'anair@tatachemicals.com',
    phone: '+91 98208 91420',
    city: 'Mumbai',
    hubAddress: 'JNPT Nhava Sheva CFS Sector 4',
    gstinOrLicense: '27AAACT1182L1Z4',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    joinedDate: '15 May 2026',
    lastActive: '1h ago',
    totalTripsOrShipments: 9,
    totalVolumeInr: 397800,
    rating: 4.85,
    subscriptionTier: 'FREE_TIER_1_OF_2',
  },
  {
    id: 'USR-SHP-106',
    name: 'Priyank Joshi',
    companyName: 'Sun Pharma Central Dispatch',
    role: 'shipper',
    email: 'p.joshi@sunpharma-logistics.in',
    phone: '+91 97551 30988',
    city: 'Indore',
    hubAddress: 'Dewas Naka Pharma Zone, Indore',
    gstinOrLicense: '23AAACS8810P1Z7',
    status: 'PENDING_REVIEW',
    verificationStatus: 'PENDING_KYC',
    joinedDate: '18 Sep 2026',
    lastActive: '35m ago',
    totalTripsOrShipments: 4,
    totalVolumeInr: 150000,
    rating: 4.78,
    subscriptionTier: 'FREE_TIER_2_OF_2',
  },

  // Transporters
  {
    id: 'USR-TRN-201',
    name: 'Devendra Singh Rathore',
    companyName: 'Malwa Express Fleet Co.',
    role: 'transporter',
    email: 'dispatch@malwaexpress.in',
    phone: '+91 98260 90111',
    city: 'Indore',
    hubAddress: 'Loha Mandi & Pithampur Link Road, Indore',
    gstinOrLicense: '23AABCM8821F1Z9',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    joinedDate: '10 Jan 2026',
    lastActive: 'Just now',
    totalTripsOrShipments: 64,
    totalVolumeInr: 2890000,
    rating: 4.93,
    subscriptionTier: 'PRO_PASS_500',
    fleetCount: 14,
  },
  {
    id: 'USR-TRN-202',
    name: 'Shrikant Shinde',
    companyName: 'Sahyadri Prime Logistics',
    role: 'transporter',
    email: 'ops@sahyadriprime.co.in',
    phone: '+91 98220 77401',
    city: 'Mumbai',
    hubAddress: 'Bhiwandi-Kalyan Corridor Sector 2, MH',
    gstinOrLicense: '27AABCS4092K1Z4',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    joinedDate: '22 Jan 2026',
    lastActive: '5m ago',
    totalTripsOrShipments: 49,
    totalVolumeInr: 1940000,
    rating: 4.87,
    subscriptionTier: 'PRO_PASS_500',
    fleetCount: 9,
  },
  {
    id: 'USR-TRN-203',
    name: 'Gurpreet Singh Gill',
    companyName: 'Western Corridor Heavy Haul',
    role: 'transporter',
    email: 'gill@westernheavyhaul.in',
    phone: '+91 98980 11223',
    city: 'Ahmedabad',
    hubAddress: 'Sarkhej-Bavla NH-48 Freight Hub, GJ',
    gstinOrLicense: '24AABCW7710M1Z3',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    joinedDate: '09 Feb 2026',
    lastActive: '11m ago',
    totalTripsOrShipments: 41,
    totalVolumeInr: 2214000,
    rating: 4.91,
    subscriptionTier: 'PRO_PASS_500',
    fleetCount: 11,
  },
  {
    id: 'USR-TRN-204',
    name: 'Kamlesh Verma',
    companyName: 'Narmada Valley Freight Carriers',
    role: 'transporter',
    email: 'kverma@narmadafreight.in',
    phone: '+91 94250 61239',
    city: 'Indore',
    hubAddress: 'Rau-Pithampur Bypass Plaza, MP',
    gstinOrLicense: '23AABCN3310Q1Z1',
    status: 'PENDING_REVIEW',
    verificationStatus: 'PENDING_KYC',
    joinedDate: '24 Sep 2026',
    lastActive: '2h ago',
    totalTripsOrShipments: 6,
    totalVolumeInr: 245000,
    rating: 4.72,
    subscriptionTier: 'FREE_TIER_2_OF_2',
    fleetCount: 5,
  },

  // Drivers (Mapped directly from DRIVER_OPTIONS + fleet captains)
  {
    id: 'DRV-101',
    name: 'Rajeshwar Yadav',
    companyName: 'Malwa Express Fleet Co.',
    role: 'driver',
    email: 'rajeshwar.yadav@malwaexpress.in',
    phone: '+91 98260 44190',
    city: 'Indore',
    hubAddress: 'NH-52 Dhule / Indore Base',
    gstinOrLicense: 'DL-MP09-20150088219',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    joinedDate: '12 Jan 2026',
    lastActive: 'Live on NH-52',
    totalTripsOrShipments: 412,
    totalVolumeInr: 985000,
    rating: 4.95,
    subscriptionTier: 'PRO_PASS_500',
    assignedVehicleNumber: 'MP 09 HH 8821',
  },
  {
    id: 'DRV-102',
    name: 'Santosh Kulkarni',
    companyName: 'Sahyadri Prime Logistics',
    role: 'driver',
    email: 'santosh.k@sahyadriprime.co.in',
    phone: '+91 98220 19833',
    city: 'Mumbai',
    hubAddress: 'Bhiwandi / Sendhwa NH-52 Corridor',
    gstinOrLicense: 'DL-MH12-20180040921',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    joinedDate: '25 Jan 2026',
    lastActive: 'Live at Sendhwa Ghat',
    totalTripsOrShipments: 285,
    totalVolumeInr: 742000,
    rating: 4.86,
    subscriptionTier: 'PRO_PASS_500',
    assignedVehicleNumber: 'MH 12 QW 4092',
  },
  {
    id: 'DRV-103',
    name: 'Harjinder Singh',
    companyName: 'Western Corridor Heavy Haul',
    role: 'driver',
    email: 'harjinder.singh@westernheavyhaul.in',
    phone: '+91 98980 55120',
    city: 'Ahmedabad',
    hubAddress: 'Sanand / Bharuch NH-48 Corridor',
    gstinOrLicense: 'DL-GJ01-20120077104',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    joinedDate: '10 Feb 2026',
    lastActive: 'Live at Bharuch Bridge',
    totalTripsOrShipments: 350,
    totalVolumeInr: 910000,
    rating: 4.92,
    subscriptionTier: 'PRO_PASS_500',
    assignedVehicleNumber: 'GJ 01 VX 7710',
  },
  {
    id: 'DRV-104',
    name: 'Mahendra Parmar',
    companyName: 'Malwa Express Fleet Co.',
    role: 'driver',
    email: 'mahendra.p@malwaexpress.in',
    phone: '+91 97550 88219',
    city: 'Indore',
    hubAddress: 'Pithampur Sector 3 Standby',
    gstinOrLicense: 'DL-MP09-20200019442',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    joinedDate: '05 Mar 2026',
    lastActive: '40m ago',
    totalTripsOrShipments: 174,
    totalVolumeInr: 468000,
    rating: 4.79,
    subscriptionTier: 'PRO_PASS_500',
    assignedVehicleNumber: 'MP 09 HH 8821 (Relief)',
  },
  {
    id: 'DRV-105',
    name: 'Bhanwarlal Jat',
    companyName: 'Narmada Valley Freight Carriers',
    role: 'driver',
    email: 'bhanwarlal@narmadafreight.in',
    phone: '+91 94254 71209',
    city: 'Dewas',
    hubAddress: 'Dewas Industrial Bypass',
    gstinOrLicense: 'DL-MP41-20190033812',
    status: 'PENDING_REVIEW',
    verificationStatus: 'PENDING_KYC',
    joinedDate: '25 Sep 2026',
    lastActive: '3h ago',
    totalTripsOrShipments: 92,
    totalVolumeInr: 215000,
    rating: 4.71,
    subscriptionTier: 'FREE_TIER_1_OF_2',
    assignedVehicleNumber: 'MP 41 GA 5512',
  },
];

export const INITIAL_PLATFORM_ISSUES: PlatformIssue[] = [
  {
    id: 'ISS-2026-01',
    category: 'WEATHER_HAZARD',
    severity: 'CRITICAL',
    title: 'Kasara Ghat (NH-160) Cloudburst & 2.5ft Underpass Waterlogging',
    description:
      'Live Google Weather API reports 36.2 mm/hr rainfall at Kasara Ghat & Shahapur Basin. AI Router has automatically diverted MP 09 HH 8821 via Saputara–Vapi–NH-48 concrete corridor.',
    reportedByRole: 'system',
    reportedByName: 'TruckBuddy Weather & RAG Sentinel',
    relatedEntityId: 'TRK-MP09-8821',
    corridor: 'Indore ⇄ Mumbai (NH-52 / NH-160)',
    status: 'IN_PROGRESS',
    createdAt: '29 Sep 2026, 08:40 IST',
  },
  {
    id: 'ISS-2026-02',
    category: 'DISPUTE',
    severity: 'HIGH',
    title: 'Unloading Bay Detention Claim — JNPT CFS Gate 4 (2.5 Hours)',
    description:
      'Transporter Sahyadri Prime Logistics requested ₹1,800 detention allowance due to crane queue delay at Nhava Sheva CFS Sector 4.',
    reportedByRole: 'transporter',
    reportedByName: 'Sahyadri Prime Logistics (Shrikant Shinde)',
    relatedEntityId: 'INV-TB-2026-882',
    corridor: 'Mumbai → Indore',
    status: 'OPEN',
    createdAt: '29 Sep 2026, 09:15 IST',
  },
  {
    id: 'ISS-2026-03',
    category: 'USER_COMPLAINT',
    severity: 'MEDIUM',
    title: 'Fastag Toll Reconciliation Variance on Bharuch Narmada Bridge',
    description:
      'Driver Harjinder Singh (GJ 01 VX 7710) reported double Fastag deduction of ₹440 at Bharuch Plaza. Awaiting NHAI/Razorpay settlement credit.',
    reportedByRole: 'driver',
    reportedByName: 'Harjinder Singh (DRV-103)',
    relatedEntityId: 'TRK-GJ01-7710',
    corridor: 'Ahmedabad → Mumbai (NH-48)',
    status: 'IN_PROGRESS',
    createdAt: '28 Sep 2026, 19:20 IST',
  },
  {
    id: 'ISS-2026-04',
    category: 'SYSTEM_ALERT',
    severity: 'LOW',
    title: 'Priority #1 Return Backhaul Matched for Arriving Indore Truck',
    description:
      'Godrej & Boyce 15.8T return load (Mumbai → Indore, ₹46,000) matched with 99% AI score for MP 09 HH 8821 to eliminate 598 km empty backhaul.',
    reportedByRole: 'system',
    reportedByName: 'AI Backhaul Matcher',
    relatedEntityId: 'RET-MUM-IND-901',
    corridor: 'Mumbai → Indore',
    status: 'RESOLVED',
    createdAt: '28 Sep 2026, 16:05 IST',
    resolutionNote: 'Priority notification delivered to Malwa Express Fleet Co. and Captain Rajeshwar Yadav.',
  },
];

export const MONTHLY_ANALYTICS_DATA: MonthlyMetric[] = [
  {
    month: 'Apr 2026',
    bookingsCount: 84,
    outboundCount: 54,
    backhaulCount: 30,
    shipmentTons: 1340,
    grossFreightInr: 3680000,
    platformRevenueInr: 142000,
    activeUsers: 68,
    transporterActivityPct: 78,
    driverActivityPct: 81,
  },
  {
    month: 'May 2026',
    bookingsCount: 102,
    outboundCount: 62,
    backhaulCount: 40,
    shipmentTons: 1650,
    grossFreightInr: 4490000,
    platformRevenueInr: 178500,
    activeUsers: 82,
    transporterActivityPct: 82,
    driverActivityPct: 85,
  },
  {
    month: 'Jun 2026',
    bookingsCount: 119,
    outboundCount: 69,
    backhaulCount: 50,
    shipmentTons: 1920,
    grossFreightInr: 5240000,
    platformRevenueInr: 214000,
    activeUsers: 96,
    transporterActivityPct: 86,
    driverActivityPct: 88,
  },
  {
    month: 'Jul 2026',
    bookingsCount: 138,
    outboundCount: 76,
    backhaulCount: 62,
    shipmentTons: 2280,
    grossFreightInr: 6120000,
    platformRevenueInr: 258000,
    activeUsers: 114,
    transporterActivityPct: 90,
    driverActivityPct: 92,
  },
  {
    month: 'Aug 2026',
    bookingsCount: 156,
    outboundCount: 84,
    backhaulCount: 72,
    shipmentTons: 2590,
    grossFreightInr: 6980000,
    platformRevenueInr: 296500,
    activeUsers: 129,
    transporterActivityPct: 93,
    driverActivityPct: 95,
  },
  {
    month: 'Sep 2026',
    bookingsCount: 178,
    outboundCount: 92,
    backhaulCount: 86,
    shipmentTons: 2940,
    grossFreightInr: 7895000,
    platformRevenueInr: 342000,
    activeUsers: 148,
    transporterActivityPct: 96,
    driverActivityPct: 97,
  },
];

// Build initial unified shipments & bookings from INITIAL_TRUCKS and INITIAL_RETURN_LOADS
function buildInitialShipments(
  trucks: TruckTelemetry[],
  returnLoads: ReturnLoadOffer[]
): PlatformShipment[] {
  const fromTrucks: PlatformShipment[] = trucks.map((t, idx) => {
    const activeRoute =
      t.routes.find((r) => r.id === t.activeRouteId) || t.routes[0];
    return {
      id: `SHP-2026-10${idx + 1}`,
      bookingId: `BKG-2026-50${idx + 1}`,
      type: 'OUTBOUND_PRIMARY',
      shipperId: `USR-SHP-10${idx + 1}`,
      shipperName: t.shipperName,
      transporterId: `USR-TRN-20${idx + 1}`,
      transporterName: t.transporterName,
      truckId: t.id,
      vehicleNumber: t.vehicleNumber,
      truckType: t.truckType,
      driverId: t.driverId,
      driverName: t.driverName,
      driverPhone: t.driverPhone,
      originCity: t.originCity,
      pickupHub: t.originHub,
      destinationCity: t.destinationCity,
      destinationHub: t.destinationHub,
      highwayCorridor: activeRoute.highwayTag,
      cargoMaterial: t.cargoMaterial,
      weightTons: t.cargoWeightTons,
      distanceKm: activeRoute.distanceKm,
      freightRateInr: t.freightAmountInr,
      platformCommissionInr: idx === 0 ? 0 : 500,
      status: t.progressPercent >= 100 ? 'COMPLETED' : 'ACTIVE',
      progressPercent: t.progressPercent,
      currentLocation: t.currentLocationName,
      etaText: t.etaText,
      weatherAdvisory: activeRoute.summaryReason,
      createdAt: '28 Sep 2026, 06:30 IST',
    };
  });

  const fromReturnLoads: PlatformShipment[] = returnLoads.map((rl, idx) => ({
    id: `SHP-RET-90${idx + 1}`,
    bookingId: `BKG-RET-90${idx + 1}`,
    type: 'AI_RETURN_BACKHAUL',
    shipperId: `USR-SHP-10${idx + 4}`,
    shipperName: rl.shipperCompany,
    transporterId: idx < 2 ? 'USR-TRN-201' : 'USR-TRN-202',
    transporterName: rl.transporterName,
    truckId: rl.matchedForTruckId,
    vehicleNumber:
      rl.matchedForTruckId === 'TRK-MP09-8821'
        ? 'MP 09 HH 8821'
        : 'MH 12 QW 4092',
    truckType: rl.requiredTruckType,
    driverId: rl.matchedForTruckId === 'TRK-MP09-8821' ? 'DRV-101' : 'DRV-102',
    driverName:
      rl.matchedForTruckId === 'TRK-MP09-8821'
        ? 'Rajeshwar Yadav'
        : 'Santosh Kulkarni',
    driverPhone:
      rl.matchedForTruckId === 'TRK-MP09-8821'
        ? '+91 98260 44190'
        : '+91 98220 19833',
    originCity: rl.originCity,
    pickupHub: rl.originHub,
    destinationCity: rl.destinationCity,
    destinationHub: rl.destinationHub,
    highwayCorridor: 'NH-48 / NH-52 Backhaul Corridor',
    cargoMaterial: rl.material,
    weightTons: rl.weightTons,
    distanceKm: rl.distanceKm,
    freightRateInr: rl.offeredRateInr,
    platformCommissionInr: 500,
    status: rl.status === 'BOOKED' ? 'ACTIVE' : 'PENDING',
    progressPercent: rl.status === 'BOOKED' ? 15 : 0,
    currentLocation:
      rl.status === 'BOOKED'
        ? `Dispatched from ${rl.originCity}`
        : `Awaiting Truck Arrival at ${rl.originCity} (${rl.deadheadKmFromDrop} km deadhead)`,
    etaText: rl.pickupWindow,
    weatherAdvisory: rl.aiPredictiveNote,
    createdAt: '29 Sep 2026, 07:45 IST',
  }));

  const historicalCompleted: PlatformShipment[] = [
    {
      id: 'SHP-2026-098',
      bookingId: 'BKG-2026-498',
      type: 'OUTBOUND_PRIMARY',
      shipperId: 'USR-SHP-101',
      shipperName: 'Cipla & Pithampur Auto Components',
      transporterId: 'USR-TRN-201',
      transporterName: 'Malwa Express Fleet Co.',
      truckId: 'TRK-MP09-8821',
      vehicleNumber: 'MP 09 HH 8821',
      truckType: '32ft Multi-Axle Container',
      driverId: 'DRV-101',
      driverName: 'Rajeshwar Yadav',
      driverPhone: '+91 98260 44190',
      originCity: 'Indore',
      pickupHub: 'Pithampur Sector 3',
      destinationCity: 'Mumbai',
      destinationHub: 'Bhiwandi Logistics Park',
      highwayCorridor: 'NH-52 / NH-48',
      cargoMaterial: 'Sterile Medical Formulations',
      weightTons: 15.9,
      distanceKm: 612,
      freightRateInr: 49000,
      platformCommissionInr: 0,
      status: 'COMPLETED',
      progressPercent: 100,
      currentLocation: 'Delivered at Bhiwandi Bay 8',
      etaText: 'Delivered on time',
      weatherAdvisory: 'Zero flood delay via Saputara bypass',
      createdAt: '24 Sep 2026, 05:00 IST',
    },
    {
      id: 'SHP-2026-099',
      bookingId: 'BKG-2026-499',
      type: 'AI_RETURN_BACKHAUL',
      shipperId: 'USR-SHP-104',
      shipperName: 'Godrej & Boyce Industrial Freight',
      transporterId: 'USR-TRN-201',
      transporterName: 'Malwa Express Fleet Co.',
      truckId: 'TRK-MP09-8821',
      vehicleNumber: 'MP 09 HH 8821',
      truckType: '32ft Multi-Axle Container',
      driverId: 'DRV-101',
      driverName: 'Rajeshwar Yadav',
      driverPhone: '+91 98260 44190',
      originCity: 'Mumbai',
      pickupHub: 'Vikhroli / Bhiwandi Hub',
      destinationCity: 'Indore',
      destinationHub: 'Pithampur Auto Cluster',
      highwayCorridor: 'NH-48 / NH-52 Return',
      cargoMaterial: 'Industrial Locking Assemblies',
      weightTons: 16.8,
      distanceKm: 598,
      freightRateInr: 45500,
      platformCommissionInr: 500,
      status: 'COMPLETED',
      progressPercent: 100,
      currentLocation: 'Delivered at Pithampur Gate 2',
      etaText: 'Delivered 35m early',
      weatherAdvisory: 'Saved 152L diesel via AI Backhaul match',
      createdAt: '25 Sep 2026, 19:30 IST',
    },
  ];

  return [...fromTrucks, ...fromReturnLoads, ...historicalCompleted];
}

function buildInitialBookings(
  shipments: PlatformShipment[]
): PlatformBooking[] {
  const mapped: PlatformBooking[] = shipments.map((s, idx) => ({
    id: s.bookingId,
    shipmentId: s.id,
    loadType:
      s.type === 'AI_RETURN_BACKHAUL' ? 'RETURN_BACKHAUL' : 'PRIMARY_DISPATCH',
    shipperName: s.shipperName,
    transporterName: s.transporterName,
    driverName: s.driverName,
    vehicleNumber: s.vehicleNumber,
    originCity: s.originCity,
    destinationCity: s.destinationCity,
    material: s.cargoMaterial,
    weightTons: s.weightTons,
    agreedAmountInr: s.freightRateInr,
    platformFeeInr: s.platformCommissionInr,
    isFreeRide: s.platformCommissionInr === 0,
    bookingStatus:
      s.status === 'ACTIVE'
        ? 'ACTIVE'
        : s.status === 'COMPLETED'
        ? 'COMPLETED'
        : idx === 3
        ? 'ACCEPTED'
        : 'PENDING',
    paymentStatus:
      s.status === 'COMPLETED' ? 'PAID' : 'PENDING_PAYMENT',
    aiMatchScore: s.type === 'AI_RETURN_BACKHAUL' ? 99 - idx : 96,
    createdAt: s.createdAt,
  }));

  mapped.push({
    id: 'BKG-2026-495',
    shipmentId: 'SHP-2026-095',
    loadType: 'PRIMARY_DISPATCH',
    shipperName: 'Tata Chemicals Import Desk',
    transporterName: 'Narmada Valley Freight Carriers',
    driverName: 'Bhanwarlal Jat',
    vehicleNumber: 'MP 41 GA 5512',
    originCity: 'Mumbai',
    destinationCity: 'Indore',
    material: 'Soda Ash Bulk Bags (Cancelled due to Kasara Ghat closure)',
    weightTons: 18.0,
    agreedAmountInr: 39500,
    platformFeeInr: 0,
    isFreeRide: true,
    bookingStatus: 'CANCELLED',
    paymentStatus: 'REFUNDED',
    aiMatchScore: 84,
    createdAt: '22 Sep 2026, 11:10 IST',
  });

  return mapped;
}

const EXTRA_BILLS: RideBill[] = [
  ...INITIAL_BILLS,
  {
    invoiceId: 'INV-TB-2026-882',
    truckId: 'TRK-MH12-4092',
    vehicleNumber: 'MH 12 QW 4092',
    transporterName: 'Sahyadri Prime Logistics',
    transporterGstin: '27AABCS4092K1Z4',
    shipperName: 'Reliance Retail Supply Chain',
    driverName: 'Santosh Kulkarni',
    driverRating: 4.86,
    originCity: 'Mumbai',
    destinationCity: 'Indore',
    highwayUsed: 'NH-48 / NH-52 Express',
    distanceKm: 605,
    cargoMaterial: 'FMCG & Packaged Consumer Goods',
    weightTons: 11.2,
    baseFreightInr: 36000,
    tollChargesInr: 2390,
    platformFeeInr: 500,
    gstInr: 1945,
    totalPayableInr: 40835,
    isFreeRideApplied: false,
    status: 'PAID',
    razorpayOrderId: 'order_RzpTB99281IndMum',
    razorpayPaymentId: 'pay_RzpTB99281Verified',
    paidAt: '28 Sep 2026, 18:40 IST',
    createdAt: '28 Sep 2026, 14:20 IST',
  },
  {
    invoiceId: 'INV-TB-2026-883',
    truckId: 'TRK-GJ01-7710',
    vehicleNumber: 'GJ 01 VX 7710',
    transporterName: 'Western Corridor Heavy Haul',
    transporterGstin: '24AABCW7710M1Z3',
    shipperName: 'Larsen & Toubro Heavy Engg',
    driverName: 'Harjinder Singh',
    driverRating: 4.92,
    originCity: 'Ahmedabad',
    destinationCity: 'Mumbai',
    highwayUsed: 'NH-48 Elevated Express',
    distanceKm: 528,
    cargoMaterial: 'Solar Structural Steel Coils',
    weightTons: 23.5,
    baseFreightInr: 54000,
    tollChargesInr: 2680,
    platformFeeInr: 500,
    gstInr: 2859,
    totalPayableInr: 60039,
    isFreeRideApplied: false,
    status: 'PAID',
    razorpayOrderId: 'order_RzpTB77102AmdMum',
    razorpayPaymentId: 'pay_RzpTB77102Verified',
    paidAt: '27 Sep 2026, 21:10 IST',
    createdAt: '27 Sep 2026, 17:05 IST',
  },
  {
    invoiceId: 'INV-TB-2026-884',
    truckId: 'TRK-MP09-8821',
    vehicleNumber: 'MP 09 HH 8821',
    transporterName: 'Malwa Express Fleet Co.',
    transporterGstin: '23AABCM8821F1Z9',
    shipperName: 'Godrej & Boyce Industrial Freight',
    driverName: 'Rajeshwar Yadav',
    driverRating: 4.95,
    originCity: 'Mumbai',
    destinationCity: 'Indore',
    highwayUsed: 'NH-48 / NH-52 Backhaul',
    distanceKm: 598,
    cargoMaterial: 'Industrial Locking Assemblies (Return Load)',
    weightTons: 16.8,
    baseFreightInr: 45500,
    tollChargesInr: 2410,
    platformFeeInr: 500,
    gstInr: 2421,
    totalPayableInr: 50831,
    isFreeRideApplied: false,
    status: 'PAID',
    razorpayOrderId: 'order_RzpTB88409RetLoad',
    razorpayPaymentId: 'pay_RzpTB88409Verified',
    paidAt: '26 Sep 2026, 11:30 IST',
    createdAt: '25 Sep 2026, 20:00 IST',
  },
];

interface AdminPlatformContextType {
  // RBAC & Admin/Manager Auth State
  currentAuthRole: AdminAccessRole;
  adminEmail: string;
  adminName: string;
  isAuthenticatedAdmin: boolean;
  loginAsAdmin: (
    email?: string,
    passcode?: string,
    role?: 'ADMIN' | 'MANAGER'
  ) => { ok: boolean; error?: string };
  logoutAdmin: () => void;
  switchSimulatedRole: (role: AdminAccessRole) => void;

  // Shared Entities (from same database/models as Mobile App)
  users: PlatformUser[];
  trucks: TruckTelemetry[];
  drivers: DriverOption[];
  returnLoads: ReturnLoadOffer[];
  shipments: PlatformShipment[];
  bookings: PlatformBooking[];
  bills: RideBill[];
  issues: PlatformIssue[];
  monthlyAnalytics: MonthlyMetric[];

  // Admin Mutations
  updateUserStatus: (
    userId: string,
    status: PlatformUser['status'],
    verificationStatus?: PlatformUser['verificationStatus']
  ) => void;
  updateShipmentStatus: (
    shipmentId: string,
    status: PlatformShipment['status'],
    progressPercent?: number
  ) => void;
  createAdminShipment: (payload: {
    shipperName: string;
    transporterName: string;
    originCity: string;
    pickupHub: string;
    destinationCity: string;
    destinationHub: string;
    cargoMaterial: string;
    weightTons: number;
    freightRateInr: number;
    type: 'OUTBOUND_PRIMARY' | 'AI_RETURN_BACKHAUL';
  }) => void;
  updateBookingStatus: (
    bookingId: string,
    bookingStatus: PlatformBooking['bookingStatus']
  ) => void;
  verifyTruck: (truckId: string, verified: boolean) => void;
  assignDriverToTruck: (truckId: string, driverId: string) => void;
  updateTruckTelemetryProgress: (truckId: string, progress: number) => void;
  markBillPaidInAdmin: (invoiceId: string) => void;
  updateIssueStatus: (
    issueId: string,
    status: PlatformIssue['status'],
    resolutionNote?: string
  ) => void;
  createAdminAlert: (payload: {
    title: string;
    description: string;
    category: PlatformIssue['category'];
    severity: PlatformIssue['severity'];
    corridor: string;
  }) => void;
  platformSettings: {
    proPassMonthlyInr: number;
    freeRidesQuota: number;
    gstRatePercent: number;
    autoWeatherReroute: boolean;
    priorityBackhaulRadiusKm: number;
    razorpayLiveWebhook: boolean;
  };
  updatePlatformSettings: (
    partial: Partial<AdminPlatformContextType['platformSettings']>
  ) => void;
}

const AdminPlatformContext = createContext<AdminPlatformContextType | null>(
  null
);

const STORAGE_KEY = 'truckbuddy_unified_platform_v1';

export function AdminPlatformProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentAuthRole, setCurrentAuthRole] =
    useState<AdminAccessRole>('ADMIN');
  const [adminEmail, setAdminEmail] = useState<string>(
    'harshpaliwal440@gmail.com'
  );
  const [adminName, setAdminName] = useState<string>(
    'Harsh Paliwal · Platform Admin'
  );

  const [users, setUsers] = useState<PlatformUser[]>(INITIAL_PLATFORM_USERS);
  const [trucks, setTrucks] = useState<TruckTelemetry[]>(INITIAL_TRUCKS);
  const [drivers, setDrivers] = useState<DriverOption[]>(DRIVER_OPTIONS);
  const [returnLoads, setReturnLoads] =
    useState<ReturnLoadOffer[]>(INITIAL_RETURN_LOADS);
  const [shipments, setShipments] = useState<PlatformShipment[]>(() =>
    buildInitialShipments(INITIAL_TRUCKS, INITIAL_RETURN_LOADS)
  );
  const [bookings, setBookings] = useState<PlatformBooking[]>(() =>
    buildInitialBookings(
      buildInitialShipments(INITIAL_TRUCKS, INITIAL_RETURN_LOADS)
    )
  );
  const [bills, setBills] = useState<RideBill[]>(EXTRA_BILLS);
  const [issues, setIssues] = useState<PlatformIssue[]>(
    INITIAL_PLATFORM_ISSUES
  );
  const [monthlyAnalytics] = useState<MonthlyMetric[]>(MONTHLY_ANALYTICS_DATA);
  const [platformSettings, setPlatformSettings] = useState({
    proPassMonthlyInr: 500,
    freeRidesQuota: 2,
    gstRatePercent: 5,
    autoWeatherReroute: true,
    priorityBackhaulRadiusKm: 50,
    razorpayLiveWebhook: true,
  });

  // Hydrate shared state from localStorage if available
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.users) && parsed.users.length > 0)
          setUsers(parsed.users);
        if (Array.isArray(parsed.trucks) && parsed.trucks.length > 0)
          setTrucks(parsed.trucks);
        if (Array.isArray(parsed.shipments) && parsed.shipments.length > 0)
          setShipments(parsed.shipments);
        if (Array.isArray(parsed.bookings) && parsed.bookings.length > 0)
          setBookings(parsed.bookings);
        if (Array.isArray(parsed.bills) && parsed.bills.length > 0)
          setBills(parsed.bills);
        if (Array.isArray(parsed.issues) && parsed.issues.length > 0)
          setIssues(parsed.issues);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Persist changes to localStorage so Mobile & Admin stay in sync
  const persistState = useCallback(
    (next: {
      users?: PlatformUser[];
      trucks?: TruckTelemetry[];
      shipments?: PlatformShipment[];
      bookings?: PlatformBooking[];
      bills?: RideBill[];
      issues?: PlatformIssue[];
    }) => {
      try {
        const snapshot = {
          users: next.users || users,
          trucks: next.trucks || trucks,
          shipments: next.shipments || shipments,
          bookings: next.bookings || bookings,
          bills: next.bills || bills,
          issues: next.issues || issues,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      } catch {
        // Ignore
      }
    },
    [users, trucks, shipments, bookings, bills, issues]
  );

  const loginAsAdmin = useCallback(
    (
      email?: string,
      passcode?: string,
      requestedRole: 'ADMIN' | 'MANAGER' = 'ADMIN'
    ): { ok: boolean; error?: string } => {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPass = (passcode || '').trim();

      // Block known Customer / Shipper / Transporter / Driver accounts
      const matchedCustomer = users.find(
        (u) => u.email.toLowerCase() === cleanEmail
      );
      if (matchedCustomer) {
        setCurrentAuthRole(matchedCustomer.role);
        return {
          ok: false,
          error: `Access Denied: ${matchedCustomer.email} is a registered ${matchedCustomer.role.toUpperCase()} account. Customers, Transporters, and Drivers cannot access the Admin/Manager portal.`,
        };
      }

      if (
        cleanPass !== 'TB-ADMIN-2026' &&
        cleanPass !== 'TB-MANAGER-2026'
      ) {
        return {
          ok: false,
          error:
            'Invalid Admin/Manager Security Token. Use TB-ADMIN-2026 (Admin) or TB-MANAGER-2026 (Manager).',
        };
      }

      const resolvedRole: 'ADMIN' | 'MANAGER' =
        cleanPass === 'TB-MANAGER-2026' || requestedRole === 'MANAGER'
          ? 'MANAGER'
          : 'ADMIN';

      setAdminEmail(
        cleanEmail ||
          (resolvedRole === 'MANAGER'
            ? 'manager@truckbuddy.in'
            : 'harshpaliwal440@gmail.com')
      );
      setAdminName(
        resolvedRole === 'MANAGER'
          ? 'Operations Manager · Corridor Desk'
          : 'Harsh Paliwal · Platform Admin'
      );
      setCurrentAuthRole(resolvedRole);
      return { ok: true };
    },
    [users]
  );

  const logoutAdmin = useCallback(() => {
    setCurrentAuthRole('CUSTOMER_GUEST');
  }, []);

  const switchSimulatedRole = useCallback((role: AdminAccessRole) => {
    setCurrentAuthRole(role);
    if (role === 'MANAGER') {
      setAdminEmail('manager@truckbuddy.in');
      setAdminName('Operations Manager · Corridor Desk');
    } else if (role === 'ADMIN') {
      setAdminEmail('harshpaliwal440@gmail.com');
      setAdminName('Harsh Paliwal · Platform Admin');
    }
  }, []);

  const updateUserStatus = useCallback(
    (
      userId: string,
      status: PlatformUser['status'],
      verificationStatus?: PlatformUser['verificationStatus']
    ) => {
      setUsers((prev) => {
        const next = prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                status,
                verificationStatus:
                  verificationStatus ?? u.verificationStatus,
              }
            : u
        );
        persistState({ users: next });
        return next;
      });
    },
    [persistState]
  );

  const updateShipmentStatus = useCallback(
    (
      shipmentId: string,
      status: PlatformShipment['status'],
      progressPercent?: number
    ) => {
      setShipments((prev) => {
        const next = prev.map((s) =>
          s.id === shipmentId
            ? {
                ...s,
                status,
                progressPercent:
                  typeof progressPercent === 'number'
                    ? progressPercent
                    : status === 'COMPLETED'
                    ? 100
                    : s.progressPercent,
                etaText:
                  status === 'COMPLETED'
                    ? `Delivered at ${s.destinationCity}`
                    : status === 'CANCELLED'
                    ? 'Cancelled by Admin'
                    : s.etaText,
              }
            : s
        );
        persistState({ shipments: next });
        return next;
      });

      setBookings((prev) => {
        const next = prev.map((b) =>
          b.shipmentId === shipmentId
            ? {
                ...b,
                bookingStatus:
                  status === 'COMPLETED'
                    ? 'COMPLETED'
                    : status === 'CANCELLED'
                    ? 'CANCELLED'
                    : status === 'ACTIVE'
                    ? 'ACTIVE'
                    : b.bookingStatus,
              }
            : b
        );
        persistState({ bookings: next });
        return next;
      });
    },
    [persistState]
  );

  const createAdminShipment = useCallback(
    (payload: {
      shipperName: string;
      transporterName: string;
      originCity: string;
      pickupHub: string;
      destinationCity: string;
      destinationHub: string;
      cargoMaterial: string;
      weightTons: number;
      freightRateInr: number;
      type: 'OUTBOUND_PRIMARY' | 'AI_RETURN_BACKHAUL';
    }) => {
      const newShipmentId = `SHP-2026-${Math.floor(200 + Math.random() * 700)}`;
      const newBookingId = `BKG-2026-${Math.floor(600 + Math.random() * 390)}`;
      const matchedTruck =
        trucks.find((t) => t.transporterName === payload.transporterName) ||
        trucks[0];

      const newShipment: PlatformShipment = {
        id: newShipmentId,
        bookingId: newBookingId,
        type: payload.type,
        shipperId: 'USR-SHP-101',
        shipperName: payload.shipperName,
        transporterId: 'USR-TRN-201',
        transporterName: payload.transporterName,
        truckId: matchedTruck.id,
        vehicleNumber: matchedTruck.vehicleNumber,
        truckType: matchedTruck.truckType,
        driverId: matchedTruck.driverId,
        driverName: matchedTruck.driverName,
        driverPhone: matchedTruck.driverPhone,
        originCity: payload.originCity,
        pickupHub: payload.pickupHub,
        destinationCity: payload.destinationCity,
        destinationHub: payload.destinationHub,
        highwayCorridor: `${payload.originCity} ⇄ ${payload.destinationCity} NH-52/48`,
        cargoMaterial: payload.cargoMaterial,
        weightTons: payload.weightTons,
        distanceKm: 605,
        freightRateInr: payload.freightRateInr,
        platformCommissionInr: 500,
        status: 'ACTIVE',
        progressPercent: 12,
        currentLocation: `Dispatched from ${payload.originCity} (${payload.pickupHub})`,
        etaText: '10h 45m left',
        weatherAdvisory: 'Clear highway dispatch verified by Admin',
        createdAt: 'Just now',
      };

      const newBooking: PlatformBooking = {
        id: newBookingId,
        shipmentId: newShipmentId,
        loadType:
          payload.type === 'AI_RETURN_BACKHAUL'
            ? 'RETURN_BACKHAUL'
            : 'PRIMARY_DISPATCH',
        shipperName: payload.shipperName,
        transporterName: payload.transporterName,
        driverName: matchedTruck.driverName,
        vehicleNumber: matchedTruck.vehicleNumber,
        originCity: payload.originCity,
        destinationCity: payload.destinationCity,
        material: payload.cargoMaterial,
        weightTons: payload.weightTons,
        agreedAmountInr: payload.freightRateInr,
        platformFeeInr: 500,
        isFreeRide: false,
        bookingStatus: 'ACTIVE',
        paymentStatus: 'PENDING_PAYMENT',
        aiMatchScore: 98,
        createdAt: 'Just now',
      };

      setShipments((prev) => {
        const next = [newShipment, ...prev];
        persistState({ shipments: next });
        return next;
      });
      setBookings((prev) => {
        const next = [newBooking, ...prev];
        persistState({ bookings: next });
        return next;
      });
    },
    [trucks, persistState]
  );

  const updateBookingStatus = useCallback(
    (bookingId: string, bookingStatus: PlatformBooking['bookingStatus']) => {
      setBookings((prev) => {
        const next = prev.map((b) =>
          b.id === bookingId
            ? {
                ...b,
                bookingStatus,
                paymentStatus:
                  bookingStatus === 'COMPLETED'
                    ? 'PAID'
                    : bookingStatus === 'CANCELLED'
                    ? 'REFUNDED'
                    : b.paymentStatus,
              }
            : b
        );
        persistState({ bookings: next });
        return next;
      });
    },
    [persistState]
  );

  const verifyTruck = useCallback(
    (truckId: string, verified: boolean) => {
      setTrucks((prev) => {
        const next = prev.map((t) =>
          t.id === truckId ? { ...t, transporterVerified: verified } : t
        );
        persistState({ trucks: next });
        return next;
      });
    },
    [persistState]
  );

  const assignDriverToTruck = useCallback(
    (truckId: string, driverId: string) => {
      const drv = drivers.find((d) => d.id === driverId);
      if (!drv) return;

      setTrucks((prev) => {
        const next = prev.map((t) =>
          t.id === truckId
            ? {
                ...t,
                driverId: drv.id,
                driverName: drv.name,
                driverPhone: drv.phone,
                driverRating: drv.rating,
                driverReviewsCount: drv.totalReviews,
              }
            : t
        );
        persistState({ trucks: next });
        return next;
      });

      setDrivers((prev) =>
        prev.map((d) =>
          d.id === driverId ? { ...d, assignedTruckId: truckId } : d
        )
      );
    },
    [drivers, persistState]
  );

  const updateTruckTelemetryProgress = useCallback(
    (truckId: string, progress: number) => {
      const clamped = Math.max(0, Math.min(100, progress));
      setTrucks((prev) => {
        const next = prev.map((t) => {
          if (t.id !== truckId) return t;
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

          return {
            ...t,
            progressPercent: clamped,
            currentCoords: { lat, lng },
            status:
              clamped >= 100
                ? ('UNLOADING' as const)
                : clamped === 48
                ? ('STAYING_AT_HALT' as const)
                : ('EN_ROUTE' as const),
            speedKmh: clamped >= 100 || clamped === 48 ? 0 : 62,
            currentLocationName:
              clamped >= 100
                ? `${t.destinationCity} (${t.destinationHub})`
                : `Cruising ${route.highwayTag} (${clamped}%)`,
            etaText:
              clamped >= 100
                ? `Delivered at ${t.destinationCity}`
                : `${Math.max(
                    1,
                    Math.round(((100 - clamped) / 100) * route.durationHrs)
                  )}h left`,
          };
        });
        persistState({ trucks: next });
        return next;
      });
    },
    [persistState]
  );

  const markBillPaidInAdmin = useCallback(
    (invoiceId: string) => {
      setBills((prev) => {
        const next = prev.map((b) =>
          b.invoiceId === invoiceId
            ? {
                ...b,
                status: 'PAID' as const,
                razorpayOrderId:
                  b.razorpayOrderId || `order_AdminSettle_${Date.now()}`,
                razorpayPaymentId:
                  b.razorpayPaymentId || `pay_AdminVerified_${Date.now()}`,
                paidAt: 'Just now (Admin Verified)',
              }
            : b
        );
        persistState({ bills: next });
        return next;
      });
    },
    [persistState]
  );

  const updateIssueStatus = useCallback(
    (
      issueId: string,
      status: PlatformIssue['status'],
      resolutionNote?: string
    ) => {
      setIssues((prev) => {
        const next = prev.map((iss) =>
          iss.id === issueId
            ? {
                ...iss,
                status,
                resolutionNote: resolutionNote ?? iss.resolutionNote,
              }
            : iss
        );
        persistState({ issues: next });
        return next;
      });
    },
    [persistState]
  );

  const createAdminAlert = useCallback(
    (payload: {
      title: string;
      description: string;
      category: PlatformIssue['category'];
      severity: PlatformIssue['severity'];
      corridor: string;
    }) => {
      const newIssue: PlatformIssue = {
        id: `ISS-2026-0${issues.length + 1}`,
        category: payload.category,
        severity: payload.severity,
        title: payload.title,
        description: payload.description,
        reportedByRole: 'system',
        reportedByName: 'Platform Administrator Broadcast',
        relatedEntityId: 'ALL-FLEETS',
        corridor: payload.corridor,
        status: 'OPEN',
        createdAt: 'Just now',
      };
      setIssues((prev) => {
        const next = [newIssue, ...prev];
        persistState({ issues: next });
        return next;
      });
    },
    [issues.length, persistState]
  );

  const updatePlatformSettings = useCallback(
    (partial: Partial<AdminPlatformContextType['platformSettings']>) => {
      setPlatformSettings((prev) => ({ ...prev, ...partial }));
    },
    []
  );

  return (
    <AdminPlatformContext.Provider
      value={{
        currentAuthRole,
        adminEmail,
        adminName,
        isAuthenticatedAdmin:
          currentAuthRole === 'ADMIN' || currentAuthRole === 'MANAGER',
        loginAsAdmin,
        logoutAdmin,
        switchSimulatedRole,
        users,
        trucks,
        drivers,
        returnLoads,
        shipments,
        bookings,
        bills,
        issues,
        monthlyAnalytics,
        updateUserStatus,
        updateShipmentStatus,
        createAdminShipment,
        updateBookingStatus,
        verifyTruck,
        assignDriverToTruck,
        updateTruckTelemetryProgress,
        markBillPaidInAdmin,
        updateIssueStatus,
        createAdminAlert,
        platformSettings,
        updatePlatformSettings,
      }}
    >
      {children}
    </AdminPlatformContext.Provider>
  );
}

export function useAdminPlatform() {
  const ctx = useContext(AdminPlatformContext);
  if (!ctx) {
    throw new Error(
      'useAdminPlatform must be used within an AdminPlatformProvider'
    );
  }
  return ctx;
}
