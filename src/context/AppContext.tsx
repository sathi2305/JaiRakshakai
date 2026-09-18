import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Building, SmartAlert, SimulationMode } from '../types';
import { INITIAL_USERS, INITIAL_BUILDINGS } from '../data/mockDatabase';
import { api } from '../services/api';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  setUserRole: (role: UserRole) => void;
  activeBuildingId: string;
  setActiveBuildingId: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  buildings: Building[];
  alerts: SmartAlert[];
  refreshAlerts: () => Promise<void>;
  simulationMode: SimulationMode;
  setSimulationMode: (mode: SimulationMode) => Promise<void>;
  injectSimulationEvent: (event: 'LEAK' | 'PRESSURE_DROP' | 'HIGH_CONSUMPTION' | 'SENSOR_FAILURE' | 'RESET') => Promise<void>;
  telemetry: any;
  kpis: any;
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  isSimulatorDrawerOpen: boolean;
  setIsSimulatorDrawerOpen: (open: boolean) => void;
  notifications: { id: string; title: string; time: string; read: boolean; type: string }[];
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [activeBuildingId, setActiveBuildingId] = useState<string>('bld-1');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [buildings, setBuildings] = useState<Building[]>(INITIAL_BUILDINGS);
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [simulationMode, setSimulationModeState] = useState<SimulationMode>('LEAKAGE_RISK');
  const [telemetry, setTelemetry] = useState<any>({
    flowRateLpm: 48.5,
    pressureBar: 2.7,
    tankLevelPercent: 78,
    leakageRiskPercent: 87,
    leakRiskLevel: 'HIGH',
    consumptionRateLph: 1420,
    waterQualityScore: 92
  });
  const [kpis, setKpis] = useState<any>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isSimulatorDrawerOpen, setIsSimulatorDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 'notif-1', title: 'High Leakage Risk (87%) detected in Block A Floor 2', time: '38m ago', read: false, type: 'critical' },
    { id: 'notif-2', title: 'Abnormal dishwashing water consumption in Block D', time: '1h ago', read: false, type: 'warning' },
    { id: 'notif-3', title: 'Weekly Sustainability Milestone: 42,000L saved', time: '4h ago', read: true, type: 'success' },
    { id: 'notif-4', title: 'Sensor FLW-401 battery low (34%)', time: '5h ago', read: true, type: 'info' }
  ]);

  const setUserRole = (role: UserRole) => {
    const user = INITIAL_USERS.find(u => u.role === role) || {
      ...currentUser,
      role
    };
    setCurrentUser(user);
  };

  const refreshAlerts = async () => {
    try {
      const data = await api.getAlerts();
      setAlerts(data);
    } catch (e) {
      console.warn('Failed to load alerts:', e);
    }
  };

  const setSimulationMode = async (mode: SimulationMode) => {
    try {
      setSimulationModeState(mode);
      await api.setSimulationMode(mode);
    } catch (e) {
      console.warn('Failed to set simulation mode:', e);
    }
  };

  const injectSimulationEvent = async (event: 'LEAK' | 'PRESSURE_DROP' | 'HIGH_CONSUMPTION' | 'SENSOR_FAILURE' | 'RESET') => {
    try {
      const res = await api.injectSimulationEvent(event);
      if (res.mode) setSimulationModeState(res.mode);
      if (res.telemetry) setTelemetry(res.telemetry);
    } catch (e) {
      console.warn('Failed to inject simulation event:', e);
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Initial fetch
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [sumData, bldData, altData] = await Promise.all([
          api.getDashboardSummary(),
          api.getBuildings(),
          api.getAlerts()
        ]);
        if (sumData?.kpis) setKpis(sumData.kpis);
        if (sumData?.currentSimulationMode) setSimulationModeState(sumData.currentSimulationMode);
        if (bldData) setBuildings(bldData);
        if (altData) setAlerts(altData);
      } catch (err) {
        console.error('Error loading initial data:', err);
      }
    };
    loadInitialData();

    // Subscribe to real-time Server-Sent Events
    const unsubscribe = api.subscribeToTelemetry((streamData) => {
      if (streamData.telemetry) setTelemetry(streamData.telemetry);
      if (streamData.buildings) setBuildings(streamData.buildings);
      if (streamData.mode) setSimulationModeState(streamData.mode);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        setUserRole,
        activeBuildingId,
        setActiveBuildingId,
        activeTab,
        setActiveTab,
        buildings,
        alerts,
        refreshAlerts,
        simulationMode,
        setSimulationMode,
        injectSimulationEvent,
        telemetry,
        kpis,
        isCopilotOpen,
        setIsCopilotOpen,
        isSimulatorDrawerOpen,
        setIsSimulatorDrawerOpen,
        notifications,
        markAllNotificationsRead,
        unreadNotificationsCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
