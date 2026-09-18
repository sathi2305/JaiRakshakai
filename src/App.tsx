import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { MasterDashboard } from './components/dashboard/MasterDashboard';
import { RealTimeMonitoring } from './components/monitoring/RealTimeMonitoring';
import { DigitalWaterTwin } from './components/digitaltwin/DigitalWaterTwin';
import { AnomalyLeakageCenter } from './components/anomaly/AnomalyLeakageCenter';
import { ForecastOptimization } from './components/forecast/ForecastOptimization';
import { RecommendationsView } from './components/recommendations/RecommendationsView';
import { DigitalTwinSimulator } from './components/simulator/DigitalTwinSimulator';
import { PredictiveMaintenance } from './components/maintenance/PredictiveMaintenance';
import { WaterQualityModule } from './components/quality/WaterQualityModule';
import { GeospatialMap } from './components/geospatial/GeospatialMap';
import { MultiBuildingComparison } from './components/comparison/MultiBuildingComparison';
import { SustainabilityCenter } from './components/sustainability/SustainabilityCenter';
import { ReportCenter } from './components/reports/ReportCenter';
import { SensorHealthView } from './components/sensors/SensorHealthView';
import { AuditLogView } from './components/audit/AuditLogView';
import { JalRakshakCopilot } from './components/copilot/JalRakshakCopilot';
import { SimulatorDrawer } from './components/simulator/SimulatorDrawer';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MasterDashboard />;
      case 'monitoring':
        return <RealTimeMonitoring />;
      case 'digital-twin':
        return <DigitalWaterTwin />;
      case 'anomalies':
        return <AnomalyLeakageCenter />;
      case 'forecast':
        return <ForecastOptimization />;
      case 'recommendations':
        return <RecommendationsView />;
      case 'simulator':
        return <DigitalTwinSimulator />;
      case 'maintenance':
        return <PredictiveMaintenance />;
      case 'quality':
        return <WaterQualityModule />;
      case 'geospatial':
        return <GeospatialMap />;
      case 'comparison':
        return <MultiBuildingComparison />;
      case 'sustainability':
        return <SustainabilityCenter />;
      case 'reports':
        return <ReportCenter />;
      case 'sensors':
        return <SensorHealthView />;
      case 'audit':
        return <AuditLogView />;
      default:
        return <MasterDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-cyan-500 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Main Body with Sidebar and Active Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Scrollable Active View Canvas */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Slide-Over Drawers & Modals */}
      <JalRakshakCopilot />
      <SimulatorDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
