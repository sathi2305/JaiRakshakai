import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Droplets,
  Bell,
  Sparkles,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Clock,
  ChevronDown
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    setUserRole,
    simulationMode,
    setIsSimulatorDrawerOpen,
    setIsCopilotOpen,
    notifications,
    unreadNotificationsCount,
    markAllNotificationsRead,
    injectSimulationEvent
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const roles: { role: UserRole; label: string; badgeColor: string }[] = [
    { role: 'admin', label: 'Admin', badgeColor: 'bg-purple-100 text-purple-700 border-purple-200' },
    { role: 'facility_manager', label: 'Facility Manager', badgeColor: 'bg-blue-100 text-blue-700 border-blue-200' },
    { role: 'sustainability_manager', label: 'Sustainability Manager', badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { role: 'maintenance', label: 'Maintenance Team', badgeColor: 'bg-amber-100 text-amber-700 border-amber-200' },
    { role: 'viewer', label: 'Viewer (Read-Only)', badgeColor: 'bg-slate-100 text-slate-700 border-slate-200' }
  ];

  const currentRoleObj = roles.find(r => r.role === currentUser.role) || roles[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                JalRakshak<span className="text-cyan-600 ml-0.5">AI</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-cyan-50 text-cyan-700 border border-cyan-200 px-1.5 py-0.5 rounded-sm">
                Enterprise IoT
              </span>
            </div>
            <p className="text-[11px] text-slate-700 hidden sm:block">
              Predict Water Loss. Prevent Waste. Protect Tomorrow.
            </p>
          </div>
        </div>

        {/* Live Simulation Indicator & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Active Mode Pill */}
          <button
            id="simulation-mode-indicator-btn"
            onClick={() => setIsSimulatorDrawerOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
            title="Click to open IoT Simulation controls"
          >
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                simulationMode === 'NORMAL' ? 'bg-emerald-400' :
                simulationMode === 'LEAKAGE_RISK' ? 'bg-rose-400' : 'bg-amber-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                simulationMode === 'NORMAL' ? 'bg-emerald-500' :
                simulationMode === 'LEAKAGE_RISK' ? 'bg-rose-500' : 'bg-amber-500'
              }`}></span>
            </span>
            <span className="hidden md:inline text-slate-500">Mode:</span>
            <span className="font-semibold text-slate-800">{simulationMode}</span>
            <Sliders className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {/* Quick Inject Leak Button for Demo */}
          <button
            id="quick-inject-leak-btn"
            onClick={() => injectSimulationEvent(simulationMode === 'LEAKAGE_RISK' ? 'RESET' : 'LEAK')}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              simulationMode === 'LEAKAGE_RISK'
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="Toggle live pipe leak injection scenario"
          >
            <Radio className={`w-3.5 h-3.5 ${simulationMode === 'LEAKAGE_RISK' ? 'text-rose-600 animate-pulse' : 'text-slate-400'}`} />
            <span>{simulationMode === 'LEAKAGE_RISK' ? 'Clear Leak (Reset)' : 'Inject Leak'}</span>
          </button>

          {/* Copilot Launcher */}
          <button
            id="copilot-header-btn"
            onClick={() => setIsCopilotOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-linear-to-r from-cyan-600 to-blue-600 text-white shadow-xs hover:from-cyan-700 hover:to-blue-700 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">JalRakshak</span> Copilot
          </button>

          {/* Notification Center */}
          <div className="relative">
            <button
              id="notifications-toggle-btn"
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900">Telemetry Notifications</span>
                    {unreadNotificationsCount > 0 && (
                      <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {unreadNotificationsCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-cyan-600 hover:text-cyan-700 font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-2 rounded-lg text-xs flex gap-2.5 items-start ${
                        n.read ? 'bg-slate-50 text-slate-600' : 'bg-blue-50/70 text-slate-800 border border-blue-100'
                      }`}
                    >
                      {n.type === 'critical' ? (
                        <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      ) : n.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium leading-snug">{n.title}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher (RBAC) */}
          <div className="relative">
            <button
              id="role-switcher-btn"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-md bg-slate-800 text-white text-[11px] font-bold flex items-center justify-center">
                {currentUser?.avatar || (currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'OP')}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                  {currentUser?.name ? currentUser.name.split(' ')[0] : 'Operator'}
                </p>
                <span className={`inline-block text-[10px] font-medium px-1.5 py-0.2 rounded border ${currentRoleObj.badgeColor}`}>
                  {currentRoleObj.label}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                <div className="px-2 py-1.5 border-b border-slate-100 mb-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Switch Active Role (RBAC)</p>
                  <p className="text-xs font-medium text-slate-700">{currentUser.name}</p>
                </div>
                <div className="space-y-1">
                  {roles.map(r => (
                    <button
                      key={r.role}
                      onClick={() => {
                        setUserRole(r.role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                        currentUser.role === r.role ? 'bg-cyan-50 text-cyan-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span>{r.label}</span>
                      </div>
                      {currentUser.role === r.role && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
