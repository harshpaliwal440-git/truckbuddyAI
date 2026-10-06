'use client';

import React, { useState } from 'react';
import { useAdminPlatform } from '@/lib/admin-store';
import {
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Lock,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const {
    adminEmail,
    adminName,
    currentAuthRole,
    platformSettings,
    updatePlatformSettings,
    switchSimulatedRole,
  } = useAdminPlatform();

  const [savedNotice, setSavedNotice] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Admin Profile, RBAC Security & Platform Settings
        </h1>
        <p className="text-sm text-slate-600 mt-0.5">
          Manage platform administrator credentials, role-based access control
          (RBAC) rules, ₹500 Pro Pass tariffs, and AI routing parameters.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            Platform configuration saved and synchronized with TruckBuddy
            Mobile applications.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Admin Profile & RBAC Access Matrix */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-11 h-11 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold">
                HP
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {adminName}
                </div>
                <div className="text-xs font-mono text-slate-500">
                  {adminEmail} · Role:{' '}
                  <strong className="text-teal-700">{currentAuthRole}</strong>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-teal-700" />
                <span>Role-Based Access Control (RBAC) Enforcement Matrix</span>
              </div>
              <p className="text-slate-600">
                Regular Shippers, Transporters, and Drivers are restricted to
                the mobile viewport (<code className="font-mono">/</code>) and
                cannot access <code className="font-mono">/admin/*</code>{' '}
                routes.
              </p>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left border-collapse border border-slate-200 text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-mono uppercase text-slate-500">
                      <th className="py-2 px-3">Role</th>
                      <th className="py-2 px-3">Mobile App (/)</th>
                      <th className="py-2 px-3">Web Admin (/admin/*)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    <tr>
                      <td className="py-2 px-3 font-bold text-teal-800">
                        ADMIN
                      </td>
                      <td className="py-2 px-3 text-emerald-700">
                        Full Access
                      </td>
                      <td className="py-2 px-3 font-bold text-emerald-700">
                        Full Read / Write Access
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-teal-800">
                        MANAGER
                      </td>
                      <td className="py-2 px-3 text-emerald-700">
                        Operations Access
                      </td>
                      <td className="py-2 px-3 font-bold text-emerald-700">
                        Authorized Operations & Dispatch Access
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-700">
                        CUSTOMER / SHIPPER
                      </td>
                      <td className="py-2 px-3 text-emerald-700">
                        Shipper Mobile App Only
                      </td>
                      <td className="py-2 px-3 text-rose-700">
                        Blocked (HTTP 403 · Hidden from UI)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-700">
                        TRANSPORTER
                      </td>
                      <td className="py-2 px-3 text-emerald-700">
                        Transporter Mobile App Only
                      </td>
                      <td className="py-2 px-3 text-rose-700">
                        Blocked (HTTP 403 · Hidden from UI)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-700">
                        DRIVER
                      </td>
                      <td className="py-2 px-3 text-emerald-700">
                        Driver Mobile Cockpit Only
                      </td>
                      <td className="py-2 px-3 text-rose-700">
                        Blocked (HTTP 403 · Hidden from UI)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-500">
                  Switch / Test Role:
                </span>
                <button
                  type="button"
                  onClick={() => switchSimulatedRole('ADMIN')}
                  className="h-8 px-3 rounded-lg border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold cursor-pointer"
                >
                  Admin View
                </button>
                <button
                  type="button"
                  onClick={() => switchSimulatedRole('MANAGER')}
                  className="h-8 px-3 rounded-lg border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold cursor-pointer"
                >
                  Manager View
                </button>
                <button
                  type="button"
                  onClick={() => switchSimulatedRole('shipper')}
                  className="h-8 px-3 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold cursor-pointer"
                >
                  Simulate Customer Access (Triggers 403)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Platform Tariff, GST & AI Routing Config */}
        <div className="lg:col-span-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSavedNotice(true);
              setTimeout(() => setSavedNotice(false), 3500);
            }}
            className="bg-white rounded-xl border border-slate-200 p-6 space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders className="w-4 h-4 text-teal-700" />
              <h2 className="text-sm font-bold text-slate-900">
                Commercial Billing & AI Dispatch Rules
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  TruckBuddy Pro Pass (₹/Month)
                </label>
                <input
                  type="number"
                  value={platformSettings.proPassMonthlyInr}
                  onChange={(e) =>
                    updatePlatformSettings({
                      proPassMonthlyInr: Number(e.target.value),
                    })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Free Rides Quota (New Accounts)
                </label>
                <input
                  type="number"
                  value={platformSettings.freeRidesQuota}
                  onChange={(e) =>
                    updatePlatformSettings({
                      freeRidesQuota: Number(e.target.value),
                    })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  GTA Tax Invoice GST Rate (%)
                </label>
                <input
                  type="number"
                  value={platformSettings.gstRatePercent}
                  onChange={(e) =>
                    updatePlatformSettings({
                      gstRatePercent: Number(e.target.value),
                    })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Priority #1 Backhaul Match Radius (km)
                </label>
                <input
                  type="number"
                  value={platformSettings.priorityBackhaulRadiusKm}
                  onChange={(e) =>
                    updatePlatformSettings({
                      priorityBackhaulRadiusKm: Number(e.target.value),
                    })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 font-mono font-bold"
                />
              </div>
            </div>

            <div className="space-y-2.5 pt-2 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900">
                    Automatic Flood & Weather Corridor Rerouting
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Divert trucks via NH-48 when rainfall exceeds 20mm/hr on
                    NH-160 Kasara Ghat
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={platformSettings.autoWeatherReroute}
                  onChange={(e) =>
                    updatePlatformSettings({
                      autoWeatherReroute: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-teal-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900">
                    Razorpay Live Order & Signature Verification
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Generate instant GTA GST Tax Invoices upon ride completion
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={platformSettings.razorpayLiveWebhook}
                  onChange={(e) =>
                    updatePlatformSettings({
                      razorpayLiveWebhook: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-teal-600"
                />
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="h-10 px-5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Save Platform Settings</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
