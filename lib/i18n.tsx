'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi';

export interface Translations {
  // Brand & Header
  appTitle: string;
  selectLanguage: string;
  chooseLanguagePrompt: string;
  english: string;
  hindi: string;
  continueBtn: string;
  changeLanguage: string;
  currentLanguage: string;
  billBtn: string;

  // Roles
  shipper: string;
  transporter: string;
  driver: string;
  roleShipper: string;
  roleTransporter: string;
  roleDriver: string;

  // Shipper Screens
  shipperHome: string;
  createShipment: string;
  activeShipments: string;
  bookingStatus: string;
  liveTracking: string;
  shipmentHistory: string;
  availableTransporters: string;
  paymentsAndBills: string;
  notifications: string;
  profile: string;

  // Common UI
  trackLiveCargo: string;
  choosePlan: string;
  subscribe: string;
  activePlan: string;
  noActivePlan: string;
  chooseMembership: string;
  shipperMembershipTitle: string;
  shipperMembershipSub: string;

  // Membership Plans
  standardPlan: string;
  standardPrice: string;
  standardFeature: string;
  premiumPlan: string;
  premiumPrice: string;
  premiumFeature: string;
  goldPlan: string;
  goldPrice: string;
  goldFeature: string;

  // Transporter & Driver
  availableLoads: string;
  activeTrips: string;
  earnings: string;
  routeNavigation: string;
  returnBackhaul: string;
  tripStatus: string;
  assignedShipment: string;
  pickupLocation: string;
  destination: string;
}

const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'TruckBuddy App',
    selectLanguage: 'Select Language',
    chooseLanguagePrompt: 'Choose your preferred language to continue',
    english: 'English',
    hindi: 'हिंदी (Hindi)',
    continueBtn: 'Continue',
    changeLanguage: 'Change Language',
    currentLanguage: 'Language: English',
    billBtn: 'Bill',

    shipper: 'Shipper',
    transporter: 'Transporter',
    driver: 'Driver',
    roleShipper: 'Shipper',
    roleTransporter: 'Transporter',
    roleDriver: 'Driver',

    shipperHome: 'Shipper Home',
    createShipment: 'Create Shipment',
    activeShipments: 'Active Shipments',
    bookingStatus: 'Booking Status',
    liveTracking: 'Live Tracking',
    shipmentHistory: 'Shipment History',
    availableTransporters: 'Available Transporters',
    paymentsAndBills: 'Payments & Bills',
    notifications: 'Notifications',
    profile: 'Profile',

    trackLiveCargo: 'Track Live Cargo',
    choosePlan: 'Choose Plan',
    subscribe: 'Subscribe',
    activePlan: 'Active Plan',
    noActivePlan: 'No Active Membership',
    chooseMembership: 'Choose Membership Plan',
    shipperMembershipTitle: 'Shipper Membership Plans',
    shipperMembershipSub: 'Select a plan to dispatch and track your freight loads with zero hassle',

    standardPlan: 'STANDARD',
    standardPrice: '₹500',
    standardFeature: '5 Rides',
    premiumPlan: 'PREMIUM',
    premiumPrice: '₹1,000',
    premiumFeature: '15 Days',
    goldPlan: 'GOLD',
    goldPrice: '₹2,200',
    goldFeature: '3 Months',

    availableLoads: 'Available Loads',
    activeTrips: 'Active Trips',
    earnings: 'Earnings',
    routeNavigation: 'Route Navigation',
    returnBackhaul: 'Return Backhaul',
    tripStatus: 'Trip Status',
    assignedShipment: 'Assigned Shipment',
    pickupLocation: 'Pickup Location',
    destination: 'Destination',
  },
  hi: {
    appTitle: 'ट्रकबड्डी ऐप',
    selectLanguage: 'भाषा चुनें',
    chooseLanguagePrompt: 'आगे बढ़ने के लिए अपनी पसंदीदा भाषा चुनें',
    english: 'English (अंग्रेजी)',
    hindi: 'हिंदी',
    continueBtn: 'आगे बढ़ें',
    changeLanguage: 'भाषा बदलें',
    currentLanguage: 'भाषा: हिंदी',
    billBtn: 'बिल',

    shipper: 'शिपर',
    transporter: 'ट्रांसपोर्टर',
    driver: 'ड्राइवर',
    roleShipper: 'शिपर (माल भेजने वाले)',
    roleTransporter: 'ट्रांसपोर्टर (फ्लीट मालिक)',
    roleDriver: 'ड्राइवर (चालक)',

    shipperHome: 'शिपर होम',
    createShipment: 'नया शिपमेंट बनाएं',
    activeShipments: 'सक्रिय शिपमेंट्स',
    bookingStatus: 'बुकिंग स्थिति',
    liveTracking: 'लाइव ट्रैकिंग',
    shipmentHistory: 'शिपमेंट इतिहास',
    availableTransporters: 'उपलब्ध ट्रांसपोर्टर्स',
    paymentsAndBills: 'भुगतान और बिल',
    notifications: 'सूचनाएं',
    profile: 'प्रोफाइल',

    trackLiveCargo: 'लाइव माल ट्रैक करें',
    choosePlan: 'प्लान चुनें',
    subscribe: 'सब्सक्राइब करें',
    activePlan: 'सक्रिय प्लान',
    noActivePlan: 'कोई सक्रिय मेंबरशिप नहीं',
    chooseMembership: 'मेंबरशिप प्लान चुनें',
    shipperMembershipTitle: 'शिपर मेंबरशिप प्लान्स',
    shipperMembershipSub: 'अपने माल को बिना किसी परेशानी के भेजने और ट्रैक करने के लिए प्लान चुनें',

    standardPlan: 'STANDARD',
    standardPrice: '₹500',
    standardFeature: '5 राइड्स (5 Rides)',
    premiumPlan: 'PREMIUM',
    premiumPrice: '₹1,000',
    premiumFeature: '15 दिन (15 Days)',
    goldPlan: 'GOLD',
    goldPrice: '₹2,200',
    goldFeature: '3 महीने (3 Months)',

    availableLoads: 'उपलब्ध लोड',
    activeTrips: 'सक्रिय ट्रिप्स',
    earnings: 'कमाई',
    routeNavigation: 'रूट नेविगेशन',
    returnBackhaul: 'रिटर्न लोड (वापसी माल)',
    tripStatus: 'ट्रिप स्थिति',
    assignedShipment: 'सौंपा गया शिपमेंट',
    pickupLocation: 'पिकअप स्थान',
    destination: 'गंतव्य स्थल',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
  hasSelectedInitialLanguage: boolean;
  setHasSelectedInitialLanguage: (selected: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => translations.en[key] || String(key),
  hasSelectedInitialLanguage: true,
  setHasSelectedInitialLanguage: () => {},
});

const LANG_STORAGE_KEY = 'truckbuddy_language_v1';
const LANG_SELECTED_KEY = 'truckbuddy_language_selected_v1';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [hasSelectedInitialLanguage, setHasSelectedInitialLanguageState] = useState<boolean>(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClient(true);
      try {
        const storedLang = localStorage.getItem(LANG_STORAGE_KEY) as Language | null;
        const storedSelected = localStorage.getItem(LANG_SELECTED_KEY);

        if (storedLang === 'hi' || storedLang === 'en') {
          setLanguageState(storedLang);
        }

        if (storedSelected === 'true') {
          setHasSelectedInitialLanguageState(true);
        } else {
          setHasSelectedInitialLanguageState(false);
        }
      } catch {
        setHasSelectedInitialLanguageState(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
      localStorage.setItem(LANG_SELECTED_KEY, 'true');
    } catch {
      // Ignore
    }
  };

  const setHasSelectedInitialLanguage = (selected: boolean) => {
    setHasSelectedInitialLanguageState(selected);
    try {
      localStorage.setItem(LANG_SELECTED_KEY, selected ? 'true' : 'false');
    } catch {
      // Ignore
    }
  };

  const t = (key: keyof Translations): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || String(key);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        hasSelectedInitialLanguage,
        setHasSelectedInitialLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
