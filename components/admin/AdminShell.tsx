'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminPlatform, AdminAccessRole } from '@/lib/admin-store';
import {
  LayoutDashboard,
  Users,
  Package,
  CalendarCheck2,
  Truck,
  UserCheck,
  Radio,
  CreditCard,
  AlertTriangle,
  BarChart3,
  Settings,
  ShieldCheck,
  ShieldAlert,
  Bell,
  Smartphone,
  ChevronRight,
  Lock,
  KeyRound,
  CheckCircle2,
  ArrowUpRight,
  Award,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  group: 'OVERVIEW' | 'MANAGEMENT' | 'FINANCE_OPS';
}

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const {
    currentAuthRole,
    adminEmail,
    adminName,
    isAuthenticatedAdmin,
    loginAsAdmin,
    logoutAdmin,
    switchSimulatedRole,
    shipments,
    bookings,
    issues,
    users,
  } = useAdminPlatform();

  const [emailInput, setEmailInput] = useState(adminEmail);
  const [passcodeInput, setPasscodeInput] = useState('TB-ADMIN-2026');
  const [selectedLoginRole, setSelectedLoginRole] = useState<'ADMIN' | 'MANAGER'>('ADMIN');
  const [authError, setAuthError] = useState<string | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);

  const openIssuesCount = issues.filter((i) => i.status !== 'RESOLVED').length;
  const activeShipmentsCount = shipments.filter(
    (s) => s.status === 'ACTIVE'
  ).length;
  const pendingBookingsCount = bookings.filter(
    (b) => b.bookingStatus === 'PENDING'
  ).length;
  const pendingKycCount = users.filter(
    (u) => u.verificationStatus === 'PENDING_KYC'
  ).length;

  const navItems: NavItem[] = [
    {
      label: 'Dashboard Overview',
      href: '/admin',
      icon: LayoutDashboard,
      group: 'OVERVIEW',
    },
    {
      label: 'Live Operations',
      href: '/admin/operations',
      icon: Radio,
      badge: `${activeShipmentsCount} Live`,
      group: 'OVERVIEW',
    },
    {
      label: 'User Management',
      href: '/admin/users',
      icon: Users,
      badge: pendingKycCount > 0 ? `${pendingKycCount} KYC` : undefined,
      group: 'MANAGEMENT',
    },
    {
      label: 'Shipment Management',
      href: '/admin/shipments',
      icon: Package,
      badge: shipments.length,
      group: 'MANAGEMENT',
    },
    {
      label: 'Booking Management',
      href: '/admin/bookings',
      icon: CalendarCheck2,
      badge:
        pendingBookingsCount > 0 ? `${pendingBookingsCount} New` : undefined,
      group: 'MANAGEMENT',
    },
    {
      label: 'Truck Management',
      href: '/admin/trucks',
      icon: Truck,
      group: 'MANAGEMENT',
    },
    {
      label: 'Driver Management',
      href: '/admin/drivers',
      icon: UserCheck,
      group: 'MANAGEMENT',
    },
    {
      label: 'Payments & Revenue',
      href: '/admin/payments',
      icon: CreditCard,
      group: 'FINANCE_OPS',
    },
    {
      label: 'Notifications & Issues',
      href: '/admin/issues',
      icon: AlertTriangle,
      badge: openIssuesCount > 0 ? openIssuesCount : undefined,
      group: 'FINANCE_OPS',
    },
    {
      label: 'Analytics & Reports',
      href: '/admin/analytics',
      icon: BarChart3,
      group: 'FINANCE_OPS',
    },
    {
      label: 'Admin Settings',
      href: '/admin/settings',
      icon: Settings,
      group: 'FINANCE_OPS',
    },
  ];

  const currentNav =
    navItems.find((item) =>
      item.href === '/admin'
        ? pathname === '/admin'
        : pathname.startsWith(item.href)
    ) || navItems[0];

  // RBAC Security Gate: Block Customers (Shippers, Transporters, Drivers, Guests) from accessing the Admin Web Console
  if (!isAuthenticatedAdmin) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[11px] font-mono font-semibold uppercase tracking-wider">
                  HTTP 403 · Customers Blocked
                </div>
                <h1 className="text-xl font-bold text-white mt-1">
                  Admin & Manager Access Only
                </h1>
              </div>
            </div>
            <Link
              href="/"
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Smartphone className="w-3.5 h-3.5 text-teal-400" />
              <span>Customer Mobile App</span>
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/50 text-xs text-rose-200 space-y-1.5">
            <div className="font-semibold text-rose-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>
                Current Session Role:{' '}
                <strong className="uppercase font-mono">
                  {currentAuthRole}
                </strong>{' '}
                — Customer & Driver Access Strictly Prohibited
              </span>
            </div>
            <p className="text-rose-200/80 leading-relaxed">
              Customers (<strong>Shippers</strong>, <strong>Transporters</strong>,
              and <strong>Drivers</strong>) cannot view or access this service
              and have no Admin link in their mobile app. Only verified{' '}
              <code className="font-mono font-bold text-white">ADMIN</code> or{' '}
              <code className="font-mono font-bold text-white">MANAGER</code>{' '}
              credentials can unlock <code className="font-mono">{pathname}</code>.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-xs text-amber-200 font-medium">
              {authError}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setAuthError(null);
              const res = loginAsAdmin(emailInput, passcodeInput, selectedLoginRole);
              if (!res.ok && res.error) {
                setAuthError(res.error);
              }
            }}
            className="space-y-4 pt-1"
          >
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedLoginRole('ADMIN');
                  setEmailInput('harshpaliwal440@gmail.com');
                  setPasscodeInput('TB-ADMIN-2026');
                  setAuthError(null);
                }}
                className={`h-10 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  selectedLoginRole === 'ADMIN'
                    ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Platform Admin</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedLoginRole('MANAGER');
                  setEmailInput('manager@truckbuddy.in');
                  setPasscodeInput('TB-MANAGER-2026');
                  setAuthError(null);
                }}
                className={`h-10 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  selectedLoginRole === 'MANAGER'
                    ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Operations Manager</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Admin or Manager Email
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="w-full h-10 px-3.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Admin / Manager Security Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  required
                  className="w-full h-10 pl-9 pr-3.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white font-mono focus:outline-none focus:border-teal-500"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Valid keys: <code className="font-mono text-slate-300">TB-ADMIN-2026</code> (Admin) or <code className="font-mono text-slate-300">TB-MANAGER-2026</code> (Manager)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 h-11 px-5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  Unlock as {selectedLoginRole === 'MANAGER' ? 'Operations Manager' : 'Platform Admin'}
                </span>
              </button>
              <Link
                href="/"
                className="h-11 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Return to Customer App</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex">
      {/* Desktop Left Sidebar Navigation (264px fixed width) */}
      <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none">
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/90">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-white">
                  TruckBuddy
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-teal-500/20 text-teal-300 rounded border border-teal-500/30">
                  ADMIN
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Enterprise Control Tower
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Links Grouped by Domain */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {(
            [
              { id: 'OVERVIEW', title: 'Command & Live Ops' },
              { id: 'MANAGEMENT', title: 'Core Logistics Registry' },
              { id: 'FINANCE_OPS', title: 'Finance, Risks & Insights' },
            ] as const
          ).map((group) => (
            <div key={group.id} className="space-y-1">
              <div className="px-3 pb-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
                {group.title}
              </div>
              {navItems
                .filter((item) => item.group === group.id)
                .map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`h-10 px-3 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        isActive
                          ? 'bg-teal-600 text-white font-semibold shadow-2xs'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-white' : 'text-slate-400'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer: Mobile App Switcher & Admin Status */}
        <div className="p-3 border-t border-slate-800 space-y-2.5 bg-slate-950/50">
          <div className="px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Database Sync</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                SHARED LIVE
              </span>
            </div>
            <div className="text-slate-300 font-medium truncate">
              {adminEmail}
            </div>
          </div>

          <Link
            href="/showcase"
            className="w-full h-9 px-3 rounded-lg bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 text-xs font-semibold flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-teal-400" />
              <span>🎓 4-in-1 Professor Preview</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-teal-400" />
          </Link>

          <Link
            href="/"
            className="w-full h-9 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2">
              <Smartphone className="w-3.5 h-3.5 text-teal-400" />
              <span>Mobile App (3 Roles)</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Desktop Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
          {/* Left: Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-500 min-w-0">
            <Link
              href="/admin"
              className="hover:text-slate-900 font-medium transition-colors"
            >
              Admin Console
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-900 truncate">
              {currentNav.label}
            </span>
          </div>

          {/* Right: RBAC Role Guard Tester, Notifications, Profile */}
          <div className="flex items-center gap-3">
            {/* RBAC Role Verification / Test Selector */}
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700 shrink-0" />
              <span className="text-[11px] font-semibold text-slate-600">
                Access Role:
              </span>
              <select
                aria-label="Test RBAC Role Access"
                value={currentAuthRole}
                onChange={(e) =>
                  switchSimulatedRole(e.target.value as AdminAccessRole)
                }
                className="text-xs font-mono font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="ADMIN">ADMIN (Authorized)</option>
                <option value="MANAGER">MANAGER (Authorized)</option>
                <option value="shipper">CUSTOMER / SHIPPER (Blocked 403)</option>
                <option value="transporter">
                  TRANSPORTER (Blocked 403)
                </option>
                <option value="driver">DRIVER (Blocked 403)</option>
              </select>
            </div>

            <button
              onClick={logoutAdmin}
              title="Lock Admin Console"
              className="h-9 px-2.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-slate-600 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Lock</span>
            </button>

            {/* Notifications Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="h-9 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Bell className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Alerts</span>
                {openIssuesCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-rose-600 text-white text-[10px] font-mono font-bold rounded-full">
                    {openIssuesCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl border border-slate-200 shadow-xl p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-900">
                      Platform Alerts & Issues ({openIssuesCount} Open)
                    </span>
                    <Link
                      href="/admin/issues"
                      onClick={() => setNotifOpen(false)}
                      className="text-[11px] font-semibold text-teal-700 hover:underline"
                    >
                      View All →
                    </Link>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {issues.slice(0, 4).map((iss) => (
                      <div
                        key={iss.id}
                        className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-slate-500">
                            {iss.id} · {iss.category}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                              iss.severity === 'CRITICAL'
                                ? 'bg-rose-100 text-rose-800'
                                : iss.severity === 'HIGH'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {iss.severity}
                          </span>
                        </div>
                        <div className="font-semibold text-slate-900">
                          {iss.title}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {iss.corridor} · {iss.createdAt}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Pill */}
            <Link
              href="/admin/settings"
              className="h-9 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden md:inline">{adminName}</span>
              <span className="md:hidden">Admin</span>
            </Link>
          </div>
        </header>

        {/* Main Desktop Viewport */}
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
