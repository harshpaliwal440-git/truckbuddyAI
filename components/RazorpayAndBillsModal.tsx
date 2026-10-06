'use client';

import React, { useState } from 'react';
import { RideBill } from '@/lib/freight-data';
import {
  Receipt,
  CheckCircle2,
  CreditCard,
  Building2,
  Star,
  Printer,
  X,
  ShieldCheck,
  Smartphone,
  Landmark,
  ArrowRight,
} from 'lucide-react';

interface RazorpayAndBillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: RideBill;
  onMarkBillPaid: (
    invoiceId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string
  ) => void;
  onRateDriverFromBill: (stars: number) => void;
}

export default function RazorpayAndBillsModal({
  isOpen,
  onClose,
  bill,
  onMarkBillPaid,
  onRateDriverFromBill,
}: RazorpayAndBillsModalProps) {
  const [step, setStep] = useState<'INVOICE' | 'RAZORPAY_CHECKOUT'>('INVOICE');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [upiId, setUpiId] = useState('shipper@okicici');
  const [processing, setProcessing] = useState(false);
  const [orderInfo, setOrderInfo] = useState<{
    orderId: string;
    keyId: string;
  } | null>(null);
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  async function handleStartRazorpayCheckout() {
    setProcessing(true);
    try {
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountInr: bill.totalPayableInr,
          purpose: `Freight Invoice ${bill.invoiceId}`,
          invoiceId: bill.invoiceId,
          transporterName: bill.transporterName,
          shipperName: bill.shipperName,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrderInfo({ orderId: data.orderId, keyId: data.keyId });
      } else {
        setOrderInfo({
          orderId: `order_TB${Date.now().toString().slice(-6)}`,
          keyId: 'rzp_test_truckbuddy',
        });
      }
      setStep('RAZORPAY_CHECKOUT');
    } finally {
      setProcessing(false);
    }
  }

  function handleConfirmRazorpayPayment(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      const paymentId = `pay_TB${Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase()}`;
      onMarkBillPaid(
        bill.invoiceId,
        orderInfo?.orderId || 'order_TB99281',
        paymentId
      );
      setProcessing(false);
      setStep('INVOICE');
    }, 650);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="bg-[#1E293B] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-300">
                TRUCKBUDDY FREIGHT BILL & RAZORPAY GATEWAY
              </div>
              <h3
                className="text-base font-bold"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}
              >
                {step === 'INVOICE'
                  ? `Tax Invoice #${bill.invoiceId}`
                  : 'Razorpay Secure In-App Checkout'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'INVOICE' ? (
          <div className="p-6 space-y-5">
            {/* Status & Parties Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200">
              <div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-teal-700" />
                  <span>Transporter:</span>
                  <strong className="text-slate-900">
                    {bill.transporterName}
                  </strong>
                  <span className="font-mono text-[10px] text-slate-400">
                    (GSTIN: {bill.transporterGstin})
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Billed To: <strong className="text-slate-900">{bill.shipperName}</strong> · Truck:{' '}
                  <span className="font-mono font-semibold text-slate-900">
                    {bill.vehicleNumber}
                  </span>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-md font-mono text-xs font-bold uppercase ${
                  bill.status === 'PAID'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-900 border border-amber-200'
                }`}
              >
                {bill.status === 'PAID' ? '✓ PAID VIA RAZORPAY' : 'PAYMENT DUE'}
              </span>
            </div>

            {/* Journey & Driver Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  ROUTE COMPLETED
                </span>
                <span className="font-bold text-slate-900">
                  {bill.originCity} → {bill.destinationCity}
                </span>
                <span className="block text-[11px] text-slate-500">
                  {bill.distanceKm} km · {bill.highwayUsed}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  ASSIGNED DRIVER
                </span>
                <span className="font-bold text-slate-900">
                  {bill.driverName}
                </span>
                <span className="block text-[11px] text-amber-700 font-semibold">
                  ★ {bill.driverRating.toFixed(2)} Customer Rated
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  CARGO DELIVERED
                </span>
                <span className="font-bold text-slate-900 truncate block">
                  {bill.cargoMaterial}
                </span>
                <span className="block text-[11px] text-slate-500">
                  {bill.weightTons} Tons Verified POD
                </span>
              </div>
            </div>

            {/* Itemized Bill Breakdown */}
            <div className="space-y-2 text-xs border border-slate-200 rounded-xl p-4">
              <div className="flex justify-between text-slate-700">
                <span>Base Freight ({bill.originCity} → {bill.destinationCity})</span>
                <span className="font-mono font-semibold">
                  ₹{bill.baseFreightInr.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>FASTag Highway Toll Charges ({bill.highwayUsed})</span>
                <span className="font-mono font-semibold">
                  ₹{bill.tollChargesInr.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-teal-700 font-medium">
                <span>
                  TruckBuddy Platform Fee{' '}
                  {bill.isFreeRideApplied && '(First 2 Rides Free Waiver)'}
                </span>
                <span className="font-mono font-semibold">
                  ₹{bill.platformFeeInr.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (5% GTA Freight Tax)</span>
                <span className="font-mono">
                  ₹{bill.gstInr.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="pt-2.5 mt-2 border-t border-slate-200 flex items-center justify-between text-sm font-bold text-slate-900">
                <span>Total Invoice Amount</span>
                <span className="font-mono text-base">
                  ₹{bill.totalPayableInr.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Customer Driver Rating Widget on Completed Ride Bill */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Rate Captain {bill.driverName} ({bill.transporterName})
                </div>
                <div className="text-[11px] text-slate-500">
                  Your rating helps AI recommend top drivers to future customers.
                </div>
              </div>
              {ratingSubmitted ? (
                <span className="text-xs font-semibold text-teal-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Rated {selectedStars}★!</span>
                </span>
              ) : (
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSelectedStars(s);
                        onRateDriverFromBill(s);
                        setRatingSubmitted(true);
                      }}
                      className={`p-1 rounded hover:bg-amber-100 cursor-pointer transition-colors ${
                        s <= selectedStars ? 'text-amber-500' : 'text-slate-300'
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Receipt or Pay with Razorpay CTA */}
            {bill.status === 'PAID' ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-emerald-950">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Paid via Razorpay ({bill.razorpayPaymentId})</span>
                  </div>
                  <div className="text-[11px] text-emerald-800 font-mono mt-0.5">
                    Order: {bill.razorpayOrderId} · Settled to {bill.transporterName}
                  </div>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Bill</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={handleStartRazorpayCheckout}
                  disabled={processing}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#0F766E] hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {processing
                      ? 'Initializing Razorpay...'
                      : `Pay ₹${bill.totalPayableInr.toLocaleString('en-IN')} with Razorpay`}
                  </span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Razorpay In-App Checkout Step */
          <form onSubmit={handleConfirmRazorpayPayment} className="p-6 space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {bill.transporterName}
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  Razorpay Order: {orderInfo?.orderId}
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-base font-bold text-slate-900">
                  ₹{bill.totalPayableInr.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-emerald-700">100% Escrow Protected</div>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'UPI', label: 'UPI / QR', icon: Smartphone },
                  { id: 'CARD', label: 'Corp Card', icon: CreditCard },
                  { id: 'NETBANKING', label: 'Netbanking', icon: Landmark },
                ] as const
              ).map((m) => {
                const Icon = m.icon;
                const active = paymentMethod === m.id;
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {paymentMethod === 'UPI' && (
              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
                  Enter UPI ID (GPay / PhonePe / Corporate UPI)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50"
                />
              </div>
            )}

            {paymentMethod === 'CARD' && (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  defaultValue="4532 •••• •••• 8891"
                  className="col-span-2 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50"
                  placeholder="Card Number"
                />
                <input
                  type="text"
                  defaultValue="09/29"
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50"
                  placeholder="MM/YY"
                />
                <input
                  type="password"
                  defaultValue="882"
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50"
                  placeholder="CVV"
                />
              </div>
            )}

            {paymentMethod === 'NETBANKING' && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                Corporate NEFT / IMPS Instant Settlement via HDFC, ICICI, or SBI Corporate Portal.
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('INVOICE')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={processing}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#0F766E] hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {processing
                    ? 'Verifying Payment...'
                    : `Authorize ₹${bill.totalPayableInr.toLocaleString('en-IN')} via Razorpay`}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
