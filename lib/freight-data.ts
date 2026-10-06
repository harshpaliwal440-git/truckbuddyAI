export type UserRole = 'transporter' | 'shipper' | 'driver';

export interface LatLngPoint {
  lat: number;
  lng: number;
}

export interface WeatherCheckpoint {
  id: string;
  name: string;
  highway: string;
  kmMark: number;
  lat: number;
  lng: number;
  tempC: number;
  condition: string;
  precipProb: number;
  rainMmPerHr: number;
  windKmh: number;
  visibilityKm: number;
  floodRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  roadAdvisory: string;
  isLiveApi?: boolean;
}

export interface RouteOption {
  id: string;
  name: string;
  highwayTag: string;
  type: 'WEATHER_SAFE' | 'SHORTEST_DIRECT' | 'ALTERNATE_EXPRESS';
  distanceKm: number;
  durationHrs: number;
  durationText: string;
  tollCostInr: number;
  fuelEstimateLitres: number;
  weatherSafetyScore: number;
  floodZonesAvoided: number;
  summaryReason: string;
  hazardAlert?: string;
  recommended: boolean;
  waypoints: LatLngPoint[];
  encodedPolyline?: string;
  checkpoints: WeatherCheckpoint[];
}

export interface DriverOption {
  id: string;
  name: string;
  phone: string;
  transporterName: string;
  rating: number;
  totalReviews: number;
  completedTrips: number;
  experienceYears: number;
  monsoonSafetyScore: number;
  languages: string[];
  recentCustomerReview: string;
  reviewerCompany: string;
  aiBadge: string;
  aiReason: string;
  assignedTruckId: string;
}

export interface RideBill {
  invoiceId: string;
  truckId: string;
  vehicleNumber: string;
  transporterName: string;
  transporterGstin: string;
  shipperName: string;
  driverName: string;
  driverRating: number;
  originCity: string;
  destinationCity: string;
  highwayUsed: string;
  distanceKm: number;
  cargoMaterial: string;
  weightTons: number;
  baseFreightInr: number;
  tollChargesInr: number;
  platformFeeInr: number;
  gstInr: number;
  totalPayableInr: number;
  isFreeRideApplied: boolean;
  status: 'PENDING_PAYMENT' | 'PAID';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paidAt?: string;
  createdAt: string;
}

export interface RAGDocument {
  id: string;
  code: string;
  title: string;
  category: 'CORRIDOR_WEATHER' | 'TRANSPORTER_TARIFF' | 'DRIVER_SAFETY' | 'BACKHAUL_SOP';
  corridor: string;
  updatedAt: string;
  content: string;
  keywords: string[];
}

export interface TruckTelemetry {
  id: string;
  vehicleNumber: string;
  truckType: string;
  capacityTons: number;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverRating: number;
  driverReviewsCount: number;
  transporterName: string;
  transporterVerified: boolean;
  shipperName: string;
  cargoMaterial: string;
  cargoWeightTons: number;
  freightAmountInr: number;
  originCity: string;
  originHub: string;
  originCoords: LatLngPoint;
  destinationCity: string;
  destinationHub: string;
  destinationCoords: LatLngPoint;
  status: 'EN_ROUTE' | 'STAYING_AT_HALT' | 'WEATHER_REROUTE' | 'UNLOADING';
  currentLocationName: string;
  stayingLocationDetail: string;
  stayingSince?: string;
  goingToDetail: string;
  currentCoords: LatLngPoint;
  progressPercent: number;
  speedKmh: number;
  fuelLevelPercent: number;
  etaText: string;
  activeRouteId: string;
  routes: RouteOption[];
}

export interface ReturnLoadOffer {
  id: string;
  originCity: string;
  originHub: string;
  originCoords: LatLngPoint;
  destinationCity: string;
  destinationHub: string;
  destinationCoords: LatLngPoint;
  shipperCompany: string;
  transporterName: string;
  shipperVerified: boolean;
  material: string;
  weightTons: number;
  requiredTruckType: string;
  offeredRateInr: number;
  marketAvgRateInr: number;
  pickupWindow: string;
  distanceKm: number;
  deadheadKmFromDrop: number;
  aiMatchScore: number;
  priorityRank: number;
  matchedForTruckId: string;
  weatherOnReturn: 'CLEAR' | 'LIGHT_RAIN' | 'ADVISORY';
  aiPredictiveNote: string;
  status: 'PRIORITY_NOTIFIED' | 'AVAILABLE' | 'BOOKED';
}

export const DRIVER_OPTIONS: DriverOption[] = [
  {
    id: 'DRV-101',
    name: 'Rajeshwar Yadav',
    phone: '+91 98260 44190',
    transporterName: 'Malwa Express Fleet Co.',
    rating: 4.95,
    totalReviews: 148,
    completedTrips: 412,
    experienceYears: 11,
    monsoonSafetyScore: 99,
    languages: ['Hindi', 'Marathi', 'English'],
    recentCustomerReview: 'Zero damage on fragile pharma shipment during heavy ghat rain. Arrived 40 mins early.',
    reviewerCompany: 'Cipla Supply Chain Desk',
    aiBadge: 'AI Top Pick · #1 Customer Rated',
    aiReason: 'Highest 4.95★ customer rating on Indore–Mumbai corridor with 99% flood-bypass compliance.',
    assignedTruckId: 'TRK-MP09-8821',
  },
  {
    id: 'DRV-102',
    name: 'Santosh Kulkarni',
    phone: '+91 98220 19833',
    transporterName: 'Sahyadri Prime Logistics',
    rating: 4.86,
    totalReviews: 94,
    completedTrips: 285,
    experienceYears: 8,
    monsoonSafetyScore: 96,
    languages: ['Marathi', 'Hindi'],
    recentCustomerReview: 'Very polite, shared live halt updates at Dhule and Bhiwandi unloading bay.',
    reviewerCompany: 'Reliance Retail Logistics',
    aiBadge: 'Fast Turnaround Specialist',
    aiReason: '4.86★ customer score; expert in JNPT Port & Bhiwandi express dock clearance.',
    assignedTruckId: 'TRK-MH12-4092',
  },
  {
    id: 'DRV-103',
    name: 'Harjinder Singh',
    phone: '+91 98980 55120',
    transporterName: 'Western Corridor Heavy Haul',
    rating: 4.92,
    totalReviews: 119,
    completedTrips: 350,
    experienceYears: 14,
    monsoonSafetyScore: 97,
    languages: ['Punjabi', 'Hindi', 'Gujarati'],
    recentCustomerReview: 'Handled 23T steel coil load smoothly across Narmada bridge and NH-48.',
    reviewerCompany: 'L&T Heavy Engineering',
    aiBadge: 'Heavy Tonnage Master',
    aiReason: '4.92★ customer rating for high-tonnage industrial coils & zero-halt highway discipline.',
    assignedTruckId: 'TRK-GJ01-7710',
  },
  {
    id: 'DRV-104',
    name: 'Mahendra Parmar',
    phone: '+91 97550 88219',
    transporterName: 'Malwa Express Fleet Co.',
    rating: 4.79,
    totalReviews: 62,
    completedTrips: 174,
    experienceYears: 6,
    monsoonSafetyScore: 92,
    languages: ['Hindi', 'Gujarati'],
    recentCustomerReview: 'Consistent speed and clean POD documentation at Pithampur.',
    reviewerCompany: 'Godrej Industrial Freight',
    aiBadge: 'Value & Punctuality Pick',
    aiReason: '4.79★ verified rating with 100% digital e-Way bill & POD compliance.',
    assignedTruckId: 'TRK-MP09-8821',
  },
];

export const INITIAL_RAG_DOCUMENTS: RAGDocument[] = [
  {
    id: 'rag-1',
    code: 'DOC-NH52-WEATHER',
    title: 'Indore–Mumbai Monsoon & Flood Routing Protocol (NH-52 vs NH-48)',
    category: 'CORRIDOR_WEATHER',
    corridor: 'Indore ⇄ Mumbai',
    updatedAt: '2026-09-28',
    content:
      'When rainfall exceeds 20mm/hr at Igatpuri/Kasara Ghat (NH-160), heavy multi-axle trucks from Malwa Express Fleet Co. and Sahyadri Prime Logistics must divert at Dhule via NH-360/Saputara to Vapi (NH-48). Although NH-160 is 29 km shorter (583 km vs 612 km), Kasara Ghat experiences critical mudslides and 2.5 ft waterlogging at Shahapur underpass, causing 3–5 hour delays. NH-48 6-lane concrete highway maintains 94/100 weather safety.',
    keywords: ['indore', 'mumbai', 'flood', 'weather', 'kasara', 'dhule', 'nh-52', 'nh-48', 'shortest', 'route', 'rain'],
  },
  {
    id: 'rag-2',
    code: 'DOC-BACKHAUL-AI',
    title: 'Priority #1 Return Load Matching & Zero-Deadhead Policy',
    category: 'BACKHAUL_SOP',
    corridor: 'Mumbai → Indore',
    updatedAt: '2026-09-28',
    content:
      'TruckBuddy AI monitors all outbound trucks completing Point A to Point B deliveries. When an Indore → Mumbai truck (e.g., MP 09 HH 8821 operated by Malwa Express Fleet Co.) reaches within 50 km of Bhiwandi/JNPT, it is placed #1 in queue for Mumbai → Indore return shipments (such as Godrej & Boyce ₹46,000 load, only 2.4 km deadhead). This eliminates 598 km of empty return running and saves 152L diesel.',
    keywords: ['return', 'backhaul', 'indore', 'mumbai', 'priority', 'notified', 'empty', 'godrej', 'load', 'ai'],
  },
  {
    id: 'rag-3',
    code: 'DOC-DRIVER-RATINGS',
    title: 'Customer-Rated Driver Selection & Transporter Quality Benchmark',
    category: 'DRIVER_SAFETY',
    corridor: 'All Western Corridors',
    updatedAt: '2026-09-28',
    content:
      'Customers can select specific drivers based on verified post-delivery star ratings. Top-rated captains include Rajeshwar Yadav (4.95★, 148 reviews, Malwa Express Fleet Co., 99% monsoon safety), Harjinder Singh (4.92★, 119 reviews, Western Corridor Heavy Haul), and Santosh Kulkarni (4.86★, 94 reviews, Sahyadri Prime Logistics). Drivers above 4.85★ qualify for priority pharma & fragile auto-component loads.',
    keywords: ['driver', 'rating', 'select', 'customer', 'rajeshwar', 'santosh', 'harjinder', 'transporter', 'malwa', 'sahyadri'],
  },
  {
    id: 'rag-4',
    code: 'DOC-BILLING-RZP',
    title: 'TruckBuddy Subscription (First 2 Rides Free + ₹500 Pro) & Razorpay GST Billing',
    category: 'TRANSPORTER_TARIFF',
    corridor: 'Platform Billing & GST',
    updatedAt: '2026-09-28',
    content:
      'TruckBuddy provides the first 2 dispatches/rides 100% free (₹0 platform fee). From the 3rd ride onward, users activate the flat ₹500/month Pro Pass via Razorpay for unlimited zero-commission bookings. Upon ride completion, an itemized GST GTA Tax Invoice (5% GST, toll breakdown, transporter GSTIN, and driver rating verification) is generated for instant in-app Razorpay settlement.',
    keywords: ['free', '500', 'subscription', 'razorpay', 'bill', 'invoice', 'gst', 'payment', 'ride', 'price'],
  },
];

export const INITIAL_TRUCKS: TruckTelemetry[] = [
  {
    id: 'TRK-MP09-8821',
    vehicleNumber: 'MP 09 HH 8821',
    truckType: '32ft Multi-Axle Container',
    capacityTons: 18,
    driverId: 'DRV-101',
    driverName: 'Rajeshwar Yadav',
    driverPhone: '+91 98260 44190',
    driverRating: 4.95,
    driverReviewsCount: 148,
    transporterName: 'Malwa Express Fleet Co.',
    transporterVerified: true,
    shipperName: 'Cipla & Pithampur Auto Components',
    cargoMaterial: 'Pharmaceutical & Precision Auto Parts',
    cargoWeightTons: 16.4,
    freightAmountInr: 48500,
    originCity: 'Indore',
    originHub: 'Pithampur Industrial Area, Sector 3',
    originCoords: { lat: 22.7196, lng: 75.8577 },
    destinationCity: 'Mumbai',
    destinationHub: 'Bhiwandi Logistics Park / JNPT Link',
    destinationCoords: { lat: 19.076, lng: 72.8777 },
    status: 'STAYING_AT_HALT',
    currentLocationName: 'Dhule NH-52 Logistics Plaza, MH',
    stayingLocationDetail: 'Halted at Bay 4, Dhule Highway Plaza (32m rest + weather check)',
    stayingSince: '32m ago',
    goingToDetail: 'Bhiwandi Hub, Mumbai via Saputara–NH48 Flood-Free Corridor',
    currentCoords: { lat: 20.9042, lng: 74.7749 },
    progressPercent: 48,
    speedKmh: 0,
    fuelLevelPercent: 74,
    etaText: '6h 20m left (298 km)',
    activeRouteId: 'route-ind-mum-safe',
    routes: [
      {
        id: 'route-ind-mum-safe',
        name: 'NH-52 → Saputara–Vapi–NH-48 Weather-Safe Corridor',
        highwayTag: 'NH-52 / NH-48',
        type: 'WEATHER_SAFE',
        distanceKm: 612,
        durationHrs: 11.4,
        durationText: '11h 25m',
        tollCostInr: 2450,
        fuelEstimateLitres: 158,
        weatherSafetyScore: 94,
        floodZonesAvoided: 2,
        summaryReason: 'Bypasses cloudburst & waterlogging at Kasara Ghat and Shahapur creek.',
        recommended: true,
        waypoints: [
          { lat: 22.7196, lng: 75.8577 },
          { lat: 22.1764, lng: 75.4855 },
          { lat: 21.6851, lng: 75.0973 },
          { lat: 20.9042, lng: 74.7749 },
          { lat: 20.579, lng: 73.7468 },
          { lat: 20.3893, lng: 72.9106 },
          { lat: 19.6967, lng: 72.7699 },
          { lat: 19.2967, lng: 73.0631 },
          { lat: 19.076, lng: 72.8777 },
        ],
        checkpoints: [
          {
            id: 'cp-indore',
            name: 'Indore (Pithampur)',
            highway: 'NH-52',
            kmMark: 0,
            lat: 22.7196,
            lng: 75.8577,
            tempC: 29,
            condition: 'Clear',
            precipProb: 10,
            rainMmPerHr: 0,
            windKmh: 14,
            visibilityKm: 10,
            floodRisk: 'LOW',
            roadAdvisory: 'Dry highway, normal dispatch.',
          },
          {
            id: 'cp-dhule',
            name: 'Dhule Junction (Halt)',
            highway: 'NH-52',
            kmMark: 284,
            lat: 20.9042,
            lng: 74.7749,
            tempC: 27,
            condition: 'Overcast',
            precipProb: 24,
            rainMmPerHr: 0.4,
            windKmh: 19,
            visibilityKm: 8.5,
            floodRisk: 'LOW',
            roadAdvisory: 'Divert via NH-48 to bypass Kasara Ghat storm.',
          },
          {
            id: 'cp-vapi',
            name: 'Vapi–Manor NH-48',
            highway: 'NH-48',
            kmMark: 445,
            lat: 20.3893,
            lng: 72.9106,
            tempC: 26,
            condition: 'Light Breeze',
            precipProb: 28,
            rainMmPerHr: 0.8,
            windKmh: 21,
            visibilityKm: 9.0,
            floodRisk: 'LOW',
            roadAdvisory: 'Elevated 6-lane concrete; zero waterlogging.',
          },
          {
            id: 'cp-mumbai',
            name: 'Mumbai (Bhiwandi)',
            highway: 'NH-48',
            kmMark: 612,
            lat: 19.076,
            lng: 72.8777,
            tempC: 27,
            condition: 'Partly Cloudy',
            precipProb: 32,
            rainMmPerHr: 1.1,
            windKmh: 22,
            visibilityKm: 8.0,
            floodRisk: 'LOW',
            roadAdvisory: 'Unloading Bay 12 ready.',
          },
        ],
      },
      {
        id: 'route-ind-mum-direct',
        name: 'NH-52 → Nashik → Kasara Ghat Direct (Shortest)',
        highwayTag: 'NH-52 / NH-160',
        type: 'SHORTEST_DIRECT',
        distanceKm: 583,
        durationHrs: 13.8,
        durationText: '13h 50m (+2h 25m delay)',
        tollCostInr: 2310,
        fuelEstimateLitres: 174,
        weatherSafetyScore: 38,
        floodZonesAvoided: 0,
        summaryReason: '29 km shorter, but severe rain & flooded underpass at Kasara Ghat / Shahapur.',
        hazardAlert: 'Avoid: 92% heavy rain (36mm/hr) & waterlogging at Kasara Ghat (NH-160).',
        recommended: false,
        waypoints: [
          { lat: 22.7196, lng: 75.8577 },
          { lat: 21.6851, lng: 75.0973 },
          { lat: 20.9042, lng: 74.7749 },
          { lat: 20.5537, lng: 74.5288 },
          { lat: 19.9975, lng: 73.7898 },
          { lat: 19.6961, lng: 73.5564 },
          { lat: 19.4559, lng: 73.3283 },
          { lat: 19.2967, lng: 73.0631 },
          { lat: 19.076, lng: 72.8777 },
        ],
        checkpoints: [
          {
            id: 'cp-d-nashik',
            name: 'Nashik Corridor',
            highway: 'NH-160',
            kmMark: 415,
            lat: 19.9975,
            lng: 73.7898,
            tempC: 23,
            condition: 'Heavy Rain',
            precipProb: 78,
            rainMmPerHr: 18.5,
            windKmh: 38,
            visibilityKm: 3.2,
            floodRisk: 'MODERATE',
            roadAdvisory: 'Slow queue ahead of ghat.',
          },
          {
            id: 'cp-d-kasara',
            name: 'Kasara Ghat Descent',
            highway: 'NH-160',
            kmMark: 462,
            lat: 19.6961,
            lng: 73.5564,
            tempC: 21,
            condition: 'Squall & Flood Risk',
            precipProb: 92,
            rainMmPerHr: 36.2,
            windKmh: 52,
            visibilityKm: 1.1,
            floodRisk: 'CRITICAL',
            roadAdvisory: 'Severe waterlogging on ghat bends.',
          },
          {
            id: 'cp-d-shahapur',
            name: 'Shahapur Basin',
            highway: 'NH-160',
            kmMark: 504,
            lat: 19.4559,
            lng: 73.3283,
            tempC: 24,
            condition: 'Flooded Underpass',
            precipProb: 86,
            rainMmPerHr: 28.0,
            windKmh: 41,
            visibilityKm: 2.0,
            floodRisk: 'HIGH',
            roadAdvisory: '2.5 ft water reported at underpass.',
          },
        ],
      },
    ],
  },
  {
    id: 'TRK-MH12-4092',
    vehicleNumber: 'MH 12 QW 4092',
    truckType: '24ft Closed Body Eicher',
    capacityTons: 12,
    driverId: 'DRV-102',
    driverName: 'Santosh Kulkarni',
    driverPhone: '+91 98220 19833',
    driverRating: 4.86,
    driverReviewsCount: 94,
    transporterName: 'Sahyadri Prime Logistics',
    transporterVerified: true,
    shipperName: 'Reliance Retail Supply Chain',
    cargoMaterial: 'FMCG & Packaged Consumer Goods',
    cargoWeightTons: 11.2,
    freightAmountInr: 36000,
    originCity: 'Mumbai',
    originHub: 'JNPT Nhava Sheva Port Gate 2',
    originCoords: { lat: 18.9499, lng: 72.9512 },
    destinationCity: 'Indore',
    destinationHub: 'Dewas Naka Warehousing Zone',
    destinationCoords: { lat: 22.7533, lng: 75.9048 },
    status: 'EN_ROUTE',
    currentLocationName: 'Sendhwa Ghat Ascent, MP Border',
    stayingLocationDetail: 'Cruising at 58 km/h (Last halt: Shirpur Plaza)',
    goingToDetail: 'Approaching Dhamnod → Indore Dewas Naka',
    currentCoords: { lat: 21.6851, lng: 75.0973 },
    progressPercent: 76,
    speedKmh: 58,
    fuelLevelPercent: 61,
    etaText: '2h 40m left (148 km)',
    activeRouteId: 'route-mum-ind-primary',
    routes: [
      {
        id: 'route-mum-ind-primary',
        name: 'NH-48 → Saputara → Sendhwa → Indore Clear Express',
        highwayTag: 'NH-48 / NH-52',
        type: 'WEATHER_SAFE',
        distanceKm: 605,
        durationHrs: 11.0,
        durationText: '11h 00m',
        tollCostInr: 2390,
        fuelEstimateLitres: 142,
        weatherSafetyScore: 96,
        floodZonesAvoided: 2,
        summaryReason: 'Clear visibility across Narmada basin & Sendhwa.',
        recommended: true,
        waypoints: [
          { lat: 18.9499, lng: 72.9512 },
          { lat: 20.3893, lng: 72.9106 },
          { lat: 20.9042, lng: 74.7749 },
          { lat: 21.6851, lng: 75.0973 },
          { lat: 22.7533, lng: 75.9048 },
        ],
        checkpoints: [
          {
            id: 'cp-m2i-1',
            name: 'JNPT Port / Panvel',
            highway: 'NH-48',
            kmMark: 0,
            lat: 18.9499,
            lng: 72.9512,
            tempC: 28,
            condition: 'Humid & Clear',
            precipProb: 20,
            rainMmPerHr: 0,
            windKmh: 18,
            visibilityKm: 9,
            floodRisk: 'LOW',
            roadAdvisory: 'Port gates clear.',
          },
          {
            id: 'cp-m2i-2',
            name: 'Sendhwa Ghat',
            highway: 'NH-52',
            kmMark: 452,
            lat: 21.6851,
            lng: 75.0973,
            tempC: 28,
            condition: 'Clear Sky',
            precipProb: 12,
            rainMmPerHr: 0,
            windKmh: 15,
            visibilityKm: 10,
            floodRisk: 'LOW',
            roadAdvisory: 'Smooth 4-lane highway to Indore.',
          },
        ],
      },
    ],
  },
  {
    id: 'TRK-GJ01-7710',
    vehicleNumber: 'GJ 01 VX 7710',
    truckType: '40ft Flatbed Trailer',
    capacityTons: 25,
    driverId: 'DRV-103',
    driverName: 'Harjinder Singh',
    driverPhone: '+91 98980 55120',
    driverRating: 4.92,
    driverReviewsCount: 119,
    transporterName: 'Western Corridor Heavy Haul',
    transporterVerified: true,
    shipperName: 'Larsen & Toubro Heavy Engg',
    cargoMaterial: 'Solar Structural Steel Coils',
    cargoWeightTons: 23.5,
    freightAmountInr: 54000,
    originCity: 'Ahmedabad',
    originHub: 'Sanand GIDC Phase II',
    originCoords: { lat: 23.0225, lng: 72.5714 },
    destinationCity: 'Mumbai',
    destinationHub: 'Taloja MIDC Navi Mumbai',
    destinationCoords: { lat: 19.0645, lng: 73.117 },
    status: 'EN_ROUTE',
    currentLocationName: 'Bharuch Narmada Bridge (NH-48)',
    stayingLocationDetail: 'In transit at 54 km/h (Next halt: Vapi Plaza)',
    goingToDetail: 'Heading south on NH-48 towards Taloja MIDC',
    currentCoords: { lat: 21.7051, lng: 72.9959 },
    progressPercent: 42,
    speedKmh: 54,
    fuelLevelPercent: 82,
    etaText: '5h 45m left (310 km)',
    activeRouteId: 'route-amd-mum-safe',
    routes: [
      {
        id: 'route-amd-mum-safe',
        name: 'NH-48 Elevated Express Corridor',
        highwayTag: 'NH-48 Express',
        type: 'WEATHER_SAFE',
        distanceKm: 528,
        durationHrs: 9.8,
        durationText: '9h 50m',
        tollCostInr: 2680,
        fuelEstimateLitres: 165,
        weatherSafetyScore: 91,
        floodZonesAvoided: 1,
        summaryReason: 'Uses New Narmada Bridge & Navsari flyover to avoid coastal waterlogging.',
        recommended: true,
        waypoints: [
          { lat: 23.0225, lng: 72.5714 },
          { lat: 22.3072, lng: 73.1812 },
          { lat: 21.7051, lng: 72.9959 },
          { lat: 21.1702, lng: 72.8311 },
          { lat: 20.3893, lng: 72.9106 },
          { lat: 19.0645, lng: 73.117 },
        ],
        checkpoints: [
          {
            id: 'cp-amd-1',
            name: 'Bharuch Narmada Bridge',
            highway: 'NH-48',
            kmMark: 195,
            lat: 21.7051,
            lng: 72.9959,
            tempC: 30,
            condition: 'Sunny & Breezy',
            precipProb: 15,
            rainMmPerHr: 0,
            windKmh: 22,
            visibilityKm: 10,
            floodRisk: 'LOW',
            roadAdvisory: 'All 6 lanes open.',
          },
        ],
      },
    ],
  },
];

export const INITIAL_RETURN_LOADS: ReturnLoadOffer[] = [
  {
    id: 'RET-MUM-IND-901',
    originCity: 'Mumbai',
    originHub: 'Bhiwandi Logistics Park (2.4 km from drop)',
    originCoords: { lat: 19.2967, lng: 73.0631 },
    destinationCity: 'Indore',
    destinationHub: 'Pithampur Auto Cluster, Indore',
    destinationCoords: { lat: 22.7196, lng: 75.8577 },
    shipperCompany: 'Godrej & Boyce Industrial Freight',
    transporterName: 'Malwa Express Fleet Co.',
    shipperVerified: true,
    material: 'Sealed Appliance Compressors & Coils',
    weightTons: 15.8,
    requiredTruckType: '32ft Multi-Axle Container',
    offeredRateInr: 46000,
    marketAvgRateInr: 41500,
    pickupWindow: 'Today, 20:30 IST (1h after unloading)',
    distanceKm: 598,
    deadheadKmFromDrop: 2.4,
    aiMatchScore: 99,
    priorityRank: 1,
    matchedForTruckId: 'TRK-MP09-8821',
    weatherOnReturn: 'CLEAR',
    aiPredictiveNote:
      'Priority #1 Match: Dispatched Indore → Mumbai truck notified first for zero empty return.',
    status: 'PRIORITY_NOTIFIED',
  },
  {
    id: 'RET-MUM-IND-902',
    originCity: 'Mumbai',
    originHub: 'JNPT Nhava Sheva CFS Sector 4',
    originCoords: { lat: 18.9499, lng: 72.9512 },
    destinationCity: 'Indore',
    destinationHub: 'Sanwer Road Industrial Estate',
    destinationCoords: { lat: 22.7685, lng: 75.8421 },
    shipperCompany: 'Tata Chemicals Import Desk',
    transporterName: 'Malwa Express Fleet Co.',
    shipperVerified: true,
    material: 'Palletized Food-Grade Polymers',
    weightTons: 17.2,
    requiredTruckType: '32ft Multi-Axle Container',
    offeredRateInr: 44200,
    marketAvgRateInr: 41000,
    pickupWindow: 'Tomorrow, 06:00 IST',
    distanceKm: 614,
    deadheadKmFromDrop: 34.0,
    aiMatchScore: 94,
    priorityRank: 2,
    matchedForTruckId: 'TRK-MP09-8821',
    weatherOnReturn: 'CLEAR',
    aiPredictiveNote: 'Fast palletized loading at JNPT for returning 32ft container.',
    status: 'AVAILABLE',
  },
  {
    id: 'RET-IND-MUM-903',
    originCity: 'Indore',
    originHub: 'Dewas Naka Pharma Zone',
    originCoords: { lat: 22.7533, lng: 75.9048 },
    destinationCity: 'Mumbai',
    destinationHub: 'Vashi / Turbhe Cold Link',
    destinationCoords: { lat: 19.0771, lng: 73.0072 },
    shipperCompany: 'Sun Pharma Central Dispatch',
    transporterName: 'Sahyadri Prime Logistics',
    shipperVerified: true,
    material: 'Export Carton Formulations',
    weightTons: 11.0,
    requiredTruckType: '24ft Closed Body Eicher',
    offeredRateInr: 37500,
    marketAvgRateInr: 34000,
    pickupWindow: 'Today, 18:00 IST',
    distanceKm: 590,
    deadheadKmFromDrop: 1.8,
    aiMatchScore: 97,
    priorityRank: 1,
    matchedForTruckId: 'TRK-MH12-4092',
    weatherOnReturn: 'CLEAR',
    aiPredictiveNote: 'Matched for Sahyadri Prime Logistics truck arriving in Indore.',
    status: 'PRIORITY_NOTIFIED',
  },
];

export const INITIAL_BILLS: RideBill[] = [
  {
    invoiceId: 'INV-TB-2026-881',
    truckId: 'TRK-MP09-8821',
    vehicleNumber: 'MP 09 HH 8821',
    transporterName: 'Malwa Express Fleet Co.',
    transporterGstin: '23AABCM8821F1Z9',
    shipperName: 'Cipla & Pithampur Auto Components',
    driverName: 'Rajeshwar Yadav',
    driverRating: 4.95,
    originCity: 'Indore',
    destinationCity: 'Mumbai',
    highwayUsed: 'NH-52 / NH-48 Weather-Safe',
    distanceKm: 612,
    cargoMaterial: 'Pharmaceutical & Precision Auto Parts',
    weightTons: 16.4,
    baseFreightInr: 48500,
    tollChargesInr: 2450,
    platformFeeInr: 0,
    gstInr: 2548,
    totalPayableInr: 53498,
    isFreeRideApplied: true,
    status: 'PENDING_PAYMENT',
    createdAt: '28 Sep 2026, 09:15 IST',
  },
];
