'use client';

import React, { useState } from 'react';
import { Check, ShieldCheck, X, Sparkles, CreditCard, Lock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export type ShipperPlanType = 'STANDARD' | 'PREMIUM' | 'GOLD';

export interface ShipperMembershipInfo {
  planType: ShipperPlanType | null;
  ridesRemaining: number;
  daysRemaining?: number;
  isActive: boolean;
}

interface ShipperMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMembership?: ShipperMembershipInfo;
  onSelectPlan: (plan: ShipperPlanType) => void;
  pendingActionLabel?: string | null;
}

export const SHIPPER_PLANS = [
  {
    id: 'STANDARD' as ShipperPlanType,
    name: 'STANDARD',
    priceText: '₹500',
    amountInr: 500,
    featureText: '5 Rides',
    typeBadge: 'One-Time Package',
    description: 'Perfect for occasional dispatches. 5 freight dispatches with live tracking.',
    highlight: false,
  },
  {
    id: 'PREMIUM' as ShipperPlanType,
    name: 'PREMIUM',
    priceText: '₹1,000',
    amountInr: 1000,
    featureText: '15 Days',
    typeBadge: '15 Days Subscription',
    description: 'Ideal for regular industrial dispatches. Unlimited loads for 15 days.',
    highlight: true,
  },
  {
    id: 'GOLD' as ShipperPlanType,
    name: 'GOLD',
    priceText: '₹2,200',
    amountInr: 2200,
    featureText: '3 Months',
    typeBadge: 'Quarterly Subscription',
    description: 'Best enterprise value for heavy shippers. Unlimited shipments for 3 full months.',
    highlight: false,
  },
];

export default function ShipperMembershipModal({
  isOpen,
  onClose,
  currentMembership,
  onSelectPlan,
  pendingActionLabel,
}: ShipperMembershipModalProps) {
  const { t, language } = useLanguage();
  const [loadingPlan, setLoadingPlan] = useState<ShipperPlanType | null>(null);

  if (!isOpen) return null;

  async function handleChoosePlan(plan: (typeof SHIPPER_PLANS)[number]) {
    setLoadingPlan(plan.id);
    try {
      await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountInr: plan.amountInr,
          purpose: `TruckBuddy Shipper ${plan.name} Plan (${plan.priceText})`,
        }),
      });
    } catch {
      // Proceed
    } finally {
      setTimeout(() => {
        setLoadingPlan(null);
        onSelectPlan(plan.id);
        onClose();
      }, 400);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-mono font-bold uppercase tracking-wider mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('shipperMembershipTitle')}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {language === 'hi' ? 'शिपर मेंबरशिप प्लान चुनें' : 'Choose Your Shipper Membership'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              {t('shipperMembershipSub')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {pendingActionLabel && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-xs text-amber-900">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>{language === 'hi' ? 'मेंबरशिप आवश्यक:' : 'Membership Required:'}</strong>{' '}
                {language === 'hi'
                  ? `"${pendingActionLabel}" बुक करने के लिए कृपया नीचे दिए गए 3 प्लान्स में से एक चुनें।`
                  : `Please subscribe to one of the 3 plans below to dispatch "${pendingActionLabel}".`}
              </span>
            </div>
          )}

          {/* Three Shipper Membership Plans (Side-by-side on desktop, stacked on mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SHIPPER_PLANS.map((plan) => {
              const isCurrent = currentMembership?.isActive && currentMembership.planType === plan.id;
              const isLoading = loadingPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl border p-5 flex flex-col justify-between transition-all relative ${
                    plan.highlight
                      ? 'border-teal-600 bg-gradient-to-b from-teal-50/40 to-white shadow-md ring-1 ring-teal-600'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-teal-700 text-white font-mono text-[10px] font-bold uppercase tracking-wider shadow-xs">
                      {language === 'hi' ? 'लोकप्रिय विकल्प' : 'Most Popular'}
                    </div>
                  )}

                  <div className="space-y-3.5">
                    {/* Plan Header */}
                    <div>
                      <div className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase">
                        {plan.name}
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-mono">
                        {plan.priceText}
                      </div>
                      <div className="text-sm font-bold text-teal-800 mt-0.5">
                        {plan.featureText}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                      {plan.description}
                    </div>

                    <div className="space-y-1.5 pt-1 text-[11px] text-slate-600">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{language === 'hi' ? 'जीरो कमीशन रेट्स' : 'Zero commission charges'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{language === 'hi' ? 'लाइव जीपीएस ट्रैकिंग' : 'Live GPS & Weather Radar'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{language === 'hi' ? '5% जीएसटी इनवॉइस' : '5% GST Invoicing included'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Button */}
                  <div className="pt-5 mt-4 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleChoosePlan(plan)}
                      className={`w-full min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        plan.highlight
                          ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>
                        {isLoading
                          ? language === 'hi' ? 'प्रोसेसिंग...' : 'Processing...'
                          : isCurrent
                          ? language === 'hi' ? 'वर्तमान प्लान' : 'Current Active Plan'
                          : language === 'hi' ? `${t('choosePlan')} (${plan.priceText})` : `Choose Plan (${plan.priceText})`}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Secure Payment Note */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
            {language === 'hi'
              ? 'रेज़रपे (Razorpay) द्वारा 100% सुरक्षित भुगतान। यूपीआई, नेटबैंकिंग, डेबिट और क्रेडिट कार्ड समर्थित।'
              : '100% Secure Checkout powered by Razorpay. UPI, NetBanking, Debit & Credit Cards accepted.'}
          </div>
        </div>
      </div>
    </div>
  );
}
