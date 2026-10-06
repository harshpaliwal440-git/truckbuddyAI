'use client';

import React, { useState } from 'react';
import { useAdminPlatform, PlatformIssue } from '@/lib/admin-store';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Plus,
  X,
} from 'lucide-react';

export default function AdminIssuesNotificationsPage() {
  const { issues, updateIssueStatus, createAdminAlert } = useAdminPlatform();

  const [categoryFilter, setCategoryFilter] = useState<
    'ALL' | PlatformIssue['category']
  >('ALL');
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    description: '',
    category: 'WEATHER_HAZARD' as PlatformIssue['category'],
    severity: 'HIGH' as PlatformIssue['severity'],
    corridor: 'Indore ⇄ Mumbai (NH-52 / NH-48)',
  });

  const filteredIssues = issues.filter(
    (iss) => categoryFilter === 'ALL' || iss.category === categoryFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Notifications, Complaints & Disputes
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Triage user complaints, detention/freight disputes, monsoon flood
            alerts, and automated AI backhaul notifications.
          </p>
        </div>

        <button
          onClick={() => setIsBroadcastOpen(true)}
          className="h-10 px-4 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Broadcast Corridor Alert</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {(
          [
            { id: 'ALL', label: 'All Tickets & Alerts', count: issues.length },
            {
              id: 'USER_COMPLAINT',
              label: 'User Complaints',
              count: issues.filter((i) => i.category === 'USER_COMPLAINT')
                .length,
            },
            {
              id: 'DISPUTE',
              label: 'Freight Disputes',
              count: issues.filter((i) => i.category === 'DISPUTE').length,
            },
            {
              id: 'WEATHER_HAZARD',
              label: 'Weather Hazards',
              count: issues.filter((i) => i.category === 'WEATHER_HAZARD')
                .length,
            },
            {
              id: 'SYSTEM_ALERT',
              label: 'System Notifications',
              count: issues.filter((i) => i.category === 'SYSTEM_ALERT').length,
            },
          ] as const
        ).map((tab) => {
          const active = categoryFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                active
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div
                className={`text-[11px] font-semibold uppercase ${
                  active ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </div>
              <div className="text-2xl font-bold font-mono mt-1">
                {tab.count}
              </div>
            </button>
          );
        })}
      </div>

      {/* Issues & Notifications List */}
      <div className="space-y-3">
        {filteredIssues.map((iss) => (
          <div
            key={iss.id}
            className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-900">
                  {iss.id}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    iss.severity === 'CRITICAL'
                      ? 'bg-rose-100 text-rose-800'
                      : iss.severity === 'HIGH'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-teal-100 text-teal-800'
                  }`}
                >
                  {iss.severity}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold">
                  {iss.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Ref: {iss.relatedEntityId} · {iss.corridor}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{iss.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {iss.description}
              </p>

              <div className="text-[11px] text-slate-500 pt-1">
                Reported by: <strong>{iss.reportedByName}</strong> (
                {iss.reportedByRole.toUpperCase()}) · {iss.createdAt}
              </div>
              {iss.resolutionNote && (
                <div className="text-[11px] text-emerald-700 font-medium">
                  Resolution: {iss.resolutionNote}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold ${
                  iss.status === 'RESOLVED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : iss.status === 'IN_PROGRESS'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {iss.status}
              </span>

              {iss.status !== 'RESOLVED' && (
                <button
                  onClick={() =>
                    updateIssueStatus(
                      iss.id,
                      'RESOLVED',
                      'Verified and resolved by Platform Administrator.'
                    )
                  }
                  className="h-9 px-3.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Resolve Ticket</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Broadcast Alert Modal */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createAdminAlert(broadcastForm);
              setIsBroadcastOpen(false);
            }}
            className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Broadcast Platform Alert
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBroadcastOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Alert Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Heavy Rain Diversion on NH-160 Kasara Ghat"
                  value={broadcastForm.title}
                  onChange={(e) =>
                    setBroadcastForm({
                      ...broadcastForm,
                      title: e.target.value,
                    })
                  }
                  className="w-full h-9 px-3 rounded-lg border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={broadcastForm.category}
                    onChange={(e) =>
                      setBroadcastForm({
                        ...broadcastForm,
                        category: e.target.value as PlatformIssue['category'],
                      })
                    }
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="WEATHER_HAZARD">Weather Hazard</option>
                    <option value="SYSTEM_ALERT">System Notification</option>
                    <option value="DISPUTE">Dispute Notice</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Severity
                  </label>
                  <select
                    value={broadcastForm.severity}
                    onChange={(e) =>
                      setBroadcastForm({
                        ...broadcastForm,
                        severity: e.target.value as PlatformIssue['severity'],
                      })
                    }
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Advisory Message
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed instructions for Shippers, Transporters, and Drivers..."
                  value={broadcastForm.description}
                  onChange={(e) =>
                    setBroadcastForm({
                      ...broadcastForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsBroadcastOpen(false)}
                className="h-9 px-4 rounded-lg border border-slate-200 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-9 px-4 rounded-lg bg-teal-700 text-white text-xs font-semibold cursor-pointer"
              >
                Broadcast Alert
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
