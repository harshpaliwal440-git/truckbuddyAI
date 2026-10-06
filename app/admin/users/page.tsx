'use client';

import React, { useState, useMemo } from 'react';
import { useAdminPlatform, PlatformUser } from '@/lib/admin-store';
import {
  Users,
  Building2,
  Truck,
  UserCheck,
  Search,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  X,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

export default function AdminUsersPage() {
  const { users, updateUserStatus } = useAdminPlatform();

  const [roleFilter, setRoleFilter] = useState<
    'ALL' | 'shipper' | 'transporter' | 'driver'
  >('ALL');
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | PlatformUser['status']
  >('ALL');
  const [kycFilter, setKycFilter] = useState<
    'ALL' | PlatformUser['verificationStatus']
  >('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
      if (statusFilter !== 'ALL' && u.status !== statusFilter) return false;
      if (kycFilter !== 'ALL' && u.verificationStatus !== kycFilter)
        return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          u.name.toLowerCase().includes(q) ||
          u.companyName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.city.toLowerCase().includes(q) ||
          u.gstinOrLicense.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [users, roleFilter, statusFilter, kycFilter, searchQuery]);

  const counts = {
    ALL: users.length,
    shipper: users.filter((u) => u.role === 'shipper').length,
    transporter: users.filter((u) => u.role === 'transporter').length,
    driver: users.filter((u) => u.role === 'driver').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            User & Role Management
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Verify KYC, GSTIN/Driving Licenses, Pro Pass subscriptions, and
            account permissions across Shippers, Transporters, and Drivers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-white border border-slate-200 rounded-lg px-3.5 py-2">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          <span>
            {
              users.filter((u) => u.verificationStatus === 'VERIFIED')
                .length
            }{' '}
            / {users.length} KYC Verified
          </span>
        </div>
      </div>

      {/* Role Summary Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(
          [
            {
              id: 'ALL',
              label: 'All Platform Users',
              icon: Users,
              count: counts.ALL,
            },
            {
              id: 'shipper',
              label: 'Shippers (Enterprises)',
              icon: Building2,
              count: counts.shipper,
            },
            {
              id: 'transporter',
              label: 'Transporters (Fleet Owners)',
              icon: Truck,
              count: counts.transporter,
            },
            {
              id: 'driver',
              label: 'Drivers (Highway Captains)',
              icon: UserCheck,
              count: counts.driver,
            },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const active = roleFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                active
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div
                  className={`text-xs font-semibold ${
                    active ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {tab.label}
                </div>
                <div className="text-2xl font-bold font-mono mt-1">
                  {tab.count}
                </div>
              </div>
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  active
                    ? 'bg-white/10 text-teal-300'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user name, company, GSTIN/DL, city, or ID..."
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            aria-label="Filter by User Status"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as 'ALL' | PlatformUser['status']
              )
            }
            className="h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-teal-600"
          >
            <option value="ALL">All Account Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          <select
            aria-label="Filter by Verification Status"
            value={kycFilter}
            onChange={(e) =>
              setKycFilter(
                e.target.value as 'ALL' | PlatformUser['verificationStatus']
              )
            }
            className="h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-teal-600"
          >
            <option value="ALL">All KYC Statuses</option>
            <option value="VERIFIED">KYC Verified</option>
            <option value="PENDING_KYC">Pending KYC</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Users High-Density Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-mono uppercase text-slate-500">
                <th className="py-3.5 px-4">User / Company</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">City & GSTIN / License</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Verification (KYC)</th>
                <th className="py-3.5 px-4 text-right">Volume & Rating</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-400">
                        {u.id}
                      </span>
                      <span className="font-bold text-slate-900">
                        {u.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      {u.companyName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {u.email} · {u.phone}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase ${
                        u.role === 'shipper'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : u.role === 'transporter'
                          ? 'bg-teal-50 text-teal-800 border border-teal-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {u.role}
                    </span>
                    <div className="text-[10px] font-mono text-slate-500 mt-1">
                      {u.subscriptionTier === 'PRO_PASS_500'
                        ? '₹500 Pro Pass'
                        : 'Free Tier (2 Rides)'}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">
                      {u.city}
                    </div>
                    <div className="font-mono text-[11px] text-slate-500">
                      {u.gstinOrLicense}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : u.status === 'PENDING_REVIEW'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {u.status}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Active: {u.lastActive}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        u.verificationStatus === 'VERIFIED'
                          ? 'bg-teal-100 text-teal-800'
                          : u.verificationStatus === 'PENDING_KYC'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {u.verificationStatus === 'VERIFIED' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : u.verificationStatus === 'PENDING_KYC' ? (
                        <Clock className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {u.verificationStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono">
                    <div className="font-bold text-slate-900">
                      ₹{u.totalVolumeInr.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {u.totalTripsOrShipments} trips · ★ {u.rating.toFixed(2)}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {u.verificationStatus !== 'VERIFIED' && (
                        <button
                          onClick={() =>
                            updateUserStatus(u.id, 'ACTIVE', 'VERIFIED')
                          }
                          className="h-8 px-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-semibold cursor-pointer"
                        >
                          Verify KYC
                        </button>
                      )}
                      <button
                        onClick={() =>
                          updateUserStatus(
                            u.id,
                            u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
                          )
                        }
                        className="h-8 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold cursor-pointer"
                      >
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="h-8 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Details</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-700">
                    {selectedUser.id}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold uppercase text-slate-800">
                    {selectedUser.role}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedUser.name}
                </h3>
                <p className="text-xs text-slate-600">
                  {selectedUser.companyName}
                </p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="text-[10px] font-mono uppercase text-slate-400">
                  GSTIN / License No.
                </div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">
                  {selectedUser.gstinOrLicense}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="text-[10px] font-mono uppercase text-slate-400">
                  Platform Volume
                </div>
                <div className="font-mono font-bold text-teal-700 mt-0.5">
                  ₹{selectedUser.totalVolumeInr.toLocaleString('en-IN')} (
                  {selectedUser.totalTripsOrShipments} Trips)
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="text-[10px] font-mono uppercase text-slate-400">
                  Contact Details
                </div>
                <div className="font-medium text-slate-800 mt-0.5 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{selectedUser.phone}</span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span className="truncate">{selectedUser.email}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="text-[10px] font-mono uppercase text-slate-400">
                  Operating Hub
                </div>
                <div className="font-medium text-slate-800 mt-0.5 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>{selectedUser.hubAddress}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    updateUserStatus(selectedUser.id, 'ACTIVE', 'VERIFIED');
                    setSelectedUser({
                      ...selectedUser,
                      status: 'ACTIVE',
                      verificationStatus: 'VERIFIED',
                    });
                  }}
                  className="h-9 px-3.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Approve & Verify KYC
                </button>
                <button
                  onClick={() => {
                    const nextStatus =
                      selectedUser.status === 'SUSPENDED'
                        ? 'ACTIVE'
                        : 'SUSPENDED';
                    updateUserStatus(selectedUser.id, nextStatus);
                    setSelectedUser({ ...selectedUser, status: nextStatus });
                  }}
                  className="h-9 px-3.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  {selectedUser.status === 'SUSPENDED'
                    ? 'Restore Account'
                    : 'Suspend User'}
                </button>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="h-9 px-4 rounded-lg bg-slate-900 text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
