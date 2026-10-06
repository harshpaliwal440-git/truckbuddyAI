'use client';

import React, { useState } from 'react';
import { useAdminPlatform } from '@/lib/admin-store';
import { RideBill } from '@/lib/freight-data';
import RazorpayAndBillsModal from '@/components/RazorpayAndBillsModal';
import {
  CreditCard,
  IndianRupee,
  Receipt,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';

export default function AdminPaymentsRevenuePage() {
  const { bills, users, markBillPaidInAdmin } = useAdminPlatform();
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'PAID' | 'PENDING_PAYMENT'
  >('ALL');
  const [search, setSearch] = useState('');
  const [selectedBillModal, setSelectedBillModal] = useState<RideBill | null>(
    null
  );

  const proPassSubscribers = users.filter(
    (u) => u.subscriptionTier === 'PRO_PASS_500'
  );
  const proPassRevenueInr = proPassSubscribers.length * 500;
  const totalInvoicedInr = bills.reduce(
    (acc, b) => acc + b.totalPayableInr,
    0
  );
  const totalSettledInr = bills
    .filter((b) => b.status === 'PAID')
    .reduce((acc, b) => acc + b.totalPayableInr, 0);
  const totalPendingInr = bills
    .filter((b) => b.status === 'PENDING_PAYMENT')
    .reduce((acc, b) => acc + b.totalPayableInr, 0);
  const totalPlatformFeesInr =
    bills.reduce((acc, b) => acc + b.platformFeeInr, 0) + proPassRevenueInr;

  const filteredBills = bills.filter((b) => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        b.invoiceId.toLowerCase().includes(q) ||
        b.shipperName.toLowerCase().includes(q) ||
        b.transporterName.toLowerCase().includes(q) ||
        b.vehicleNumber.toLowerCase().includes(q) ||
        (b.razorpayPaymentId || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Payments, GST Invoices & Platform Revenue
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Razorpay GTA freight settlements, 5% GST tax ledgers, First-2-Free
            Rides audit, and ₹500/month Pro Pass subscription revenue.
          </p>
        </div>
      </div>

      {/* 4 Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Gross Invoiced Freight</span>
            <Receipt className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            ₹{totalInvoicedInr.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across {bills.length} GST GTA Tax Invoices
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Razorpay Settled Volume</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-2">
            ₹{totalSettledInr.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {bills.filter((b) => b.status === 'PAID').length} Paid Invoices
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Pending Receivables</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-2">
            ₹{totalPendingInr.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {bills.filter((b) => b.status === 'PENDING_PAYMENT').length}{' '}
            Awaiting Settlement
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Net Platform Commission & Passes</span>
            <IndianRupee className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-teal-700 mt-2">
            ₹{totalPlatformFeesInr.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {proPassSubscribers.length} Active ₹500 Pro Passes
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Invoice ID, Razorpay Payment ID, Shipper, Transporter, or Truck..."
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
          />
        </div>

        <div className="flex items-center gap-2">
          {(
            [
              { id: 'ALL', label: 'All Transactions' },
              { id: 'PAID', label: 'Paid (Razorpay)' },
              { id: 'PENDING_PAYMENT', label: 'Pending Payment' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`h-9 px-3.5 rounded-lg text-xs font-semibold cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices & Razorpay Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-mono uppercase text-slate-500">
                <th className="py-3.5 px-4">Invoice & Date</th>
                <th className="py-3.5 px-4">Shipper & Transporter</th>
                <th className="py-3.5 px-4">Corridor & Truck</th>
                <th className="py-3.5 px-4 text-right">
                  Base + Toll + 5% GST
                </th>
                <th className="py-3.5 px-4 text-right">Platform Fee</th>
                <th className="py-3.5 px-4 text-right">Total Payable</th>
                <th className="py-3.5 px-4">Razorpay Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredBills.map((b) => (
                <tr
                  key={b.invoiceId}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="font-mono font-bold text-slate-900">
                      {b.invoiceId}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {b.createdAt}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-900">
                      {b.shipperName}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {b.transporterName} (GST: {b.transporterGstin})
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-900">
                      {b.originCity} → {b.destinationCity}
                    </div>
                    <div className="font-mono text-[11px] text-slate-500">
                      {b.vehicleNumber} · {b.distanceKm} km
                    </div>
                  </td>

                  <td className="py-4 px-4 text-right font-mono text-[11px] text-slate-600">
                    <div>
                      Freight: ₹{b.baseFreightInr.toLocaleString('en-IN')}
                    </div>
                    <div>
                      Toll: ₹{b.tollChargesInr.toLocaleString('en-IN')} · GST: ₹
                      {b.gstInr.toLocaleString('en-IN')}
                    </div>
                  </td>

                  <td className="py-4 px-4 text-right font-mono">
                    {b.isFreeRideApplied ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-50 text-teal-800 text-[10px] font-bold">
                        <Sparkles className="w-3 h-3" />
                        ₹0 (FREE RIDE)
                      </span>
                    ) : (
                      <span className="font-bold text-teal-700">
                        ₹{b.platformFeeInr}
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                    ₹{b.totalPayableInr.toLocaleString('en-IN')}
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        b.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.status}
                    </span>
                    {b.razorpayPaymentId && (
                      <div className="font-mono text-[10px] text-slate-400 mt-1">
                        {b.razorpayPaymentId}
                      </div>
                    )}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {b.status === 'PENDING_PAYMENT' && (
                        <button
                          onClick={() => markBillPaidInAdmin(b.invoiceId)}
                          className="h-8 px-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-semibold cursor-pointer"
                        >
                          Mark Paid
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedBillModal(b)}
                        className="h-8 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <CreditCard className="w-3 h-3" />
                        <span>GST Bill</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reused Razorpay & GST Bill Modal */}
      {selectedBillModal && (
        <RazorpayAndBillsModal
          isOpen={true}
          onClose={() => setSelectedBillModal(null)}
          bill={selectedBillModal}
          onMarkBillPaid={(invId) => {
            markBillPaidInAdmin(invId);
            setSelectedBillModal((prev) =>
              prev ? { ...prev, status: 'PAID' } : null
            );
          }}
          onRateDriverFromBill={() => {}}
        />
      )}
    </div>
  );
}
