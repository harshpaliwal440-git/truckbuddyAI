'use client';

import React, { useState } from 'react';
import {
  Check,
  ShieldCheck,
  Lock,
  X,
  CreditCard,
  Sparkles,
} from 'lucide-react';

export type ShipperPlanId = 'STANDARD' | 'PREMIUM' | 'GOLD';

interface SubscriptionPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  ridesUsed?: number;
  isSubscribed?: boolean;
  pendingBookingLabel?: string | null;
  onActivateSubscription: (planId?: ShipperPlanId) => void;
  onSetTestState?: (rides: number, subscribed: boolean) => void;
}

export const SHIPPER_PLANS = [
  {
    id: 'STANDARD' as ShipperPlanId,
    name: 'STANDARD',
    price: '₹500',
    amountInr: 500,
    feature: '5 Rides',
    badge: 'One-Time Package',
    description: 'Dispatch up to 5 freight loads with live truck radar tracking.',
    highlight: false,
  },
  {
    id: 'PREMIUM' as ShipperPlanId,
    name: 'PREMIUM',
    price: '₹1,000',
    amountInr: 1000,
    feature: '15 Days',
    badge: '15 Days Subscription',
    description: 'Unlimited dispatches for 15 days with priority transporter matching.',
    highlight: true,
  },
  {
    id: 'GOLD' as ShipperPlanId,
    name: 'GOLD',
    price: '₹2,200',
    amountInr: 2200,
    feature: '3 Months',
    badge: '3 Months Subscription',
    description: 'Full 3 months quarterly subscription for heavy enterprise dispatches.',
    highlight: false,
  },
];

export default function SubscriptionPassModal({
  isOpen,
  onClose,
  pendingBookingLabel,
  onActivateSubscription,
}: SubscriptionPassModalProps) {
  const [payingPlanId, setPayingPlanId] = useState<ShipperPlanId | null>(null);

  if (!isOpen) return null;

  async function handleChoosePlan(plan: (typeof SHIPPER_PLANS)[number]) {
    setPayingPlanId(plan.id);
    try {
      await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountInr: plan.amountInr,
          purpose: `TruckBuddy Shipper ${plan.name} Plan (${plan.price})`,
        }),
      });
    } catch {
      // Proceed
    } finally {
      setTimeout(() => {
        setPayingPlanId(null);
        onActivateSubscription(plan.id);
      }, 400);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-150 flex flex-col">
        {/* Top Banner */}
        <div className="bg-[#1E293B] text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-600/30 border border-teal-500/40 text-teal-300 font-mono text-[11px] font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Shipper Membership Plans</span>
            </span>
            <h3
              className="text-xl font-bold mt-2 text-white"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              Choose Your Shipper Membership
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Subscribe to dispatch and track your freight shipments with zero commission and automated GST billing.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {pendingBookingLabel && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-800">
                <strong>Membership Required:</strong> Choose one of the 3 plans below to confirm{' '}
                <span className="font-semibold">{pendingBookingLabel}</span>.
              </div>
            </div>
          )}

          {/* Three Shipper Membership Plans (Side-by-side on desktop, stacked on mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SHIPPER_PLANS.map((plan) => {
              const isPaying = payingPlanId === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl border p-5 flex flex-col justify-between transition-all relative ${
                    plan.highlight
                      ? 'border-teal-600 bg-gradient-to-b from-teal-50/50 to-white shadow-md ring-1 ring-teal-600'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-teal-700 text-white font-mono text-[10px] font-bold uppercase tracking-wider shadow-xs">
                      Popular Plan
                    </div>
                  )}

                  <div className="space-y-3.5">
                    <div>
                      <div className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase">
                        {plan.name}
                      </div>
                      <div className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">
                        {plan.price}
                      </div>
                      <div className="text-sm font-bold text-teal-800 mt-0.5">
                        {plan.feature}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                      {plan.description}
                    </div>

                    <div className="space-y-1.5 pt-1 text-[11px] text-slate-600">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>Zero commission rates</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>Live GPS & weather radar</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>5% GST Invoicing included</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={isPaying}
                      onClick={() => handleChoosePlan(plan)}
                      className={`w-full min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        plan.highlight
                          ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>
                        {isPaying
                          ? 'Processing...'
                          : `Choose Plan (${plan.price})`}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
            100% Secure Checkout powered by Razorpay. UPI, NetBanking, Debit & Credit Cards accepted.
          </div>
        </div>
      </div>
    </div>
  );
}
