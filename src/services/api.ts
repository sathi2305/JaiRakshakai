import { SimulationMode } from '../types';

export const api = {
  async getDashboardSummary() {
    const res = await fetch('/api/dashboard/summary');
    return res.json();
  },

  async getCampuses() {
    const res = await fetch('/api/campuses');
    return res.json();
  },

  async getBuildings() {
    const res = await fetch('/api/buildings');
    return res.json();
  },

  async getBuilding(id: string) {
    const res = await fetch(`/api/buildings/${id}`);
    return res.json();
  },

  async getSensors() {
    const res = await fetch('/api/sensors');
    return res.json();
  },

  async getLatestReadings() {
    const res = await fetch('/api/readings/latest');
    return res.json();
  },

  async getHistoricalReadings(hours = 24) {
    const res = await fetch(`/api/readings/history?hours=${hours}`);
    return res.json();
  },

  async setSimulationMode(mode: SimulationMode) {
    const res = await fetch('/api/simulator/mode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode })
    });
    return res.json();
  },

  async injectSimulationEvent(eventType: 'LEAK' | 'PRESSURE_DROP' | 'HIGH_CONSUMPTION' | 'SENSOR_FAILURE' | 'RESET') {
    const res = await fetch('/api/simulator/inject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType })
    });
    return res.json();
  },

  async getAnomalies() {
    const res = await fetch('/api/anomalies');
    return res.json();
  },

  async getLeakageRisk() {
    const res = await fetch('/api/leakage-risk');
    return res.json();
  },

  async getForecast(horizon: '24h' | '7d' | '30d' = '24h') {
    const res = await fetch(`/api/forecast?horizon=${horizon}`);
    return res.json();
  },

  async getRecommendations() {
    const res = await fetch('/api/recommendations');
    return res.json();
  },

  async applyRecommendation(id: string) {
    const res = await fetch(`/api/recommendations/${id}/apply`, { method: 'POST' });
    return res.json();
  },

  async getAlerts() {
    const res = await fetch('/api/alerts');
    return res.json();
  },

  async acknowledgeAlert(id: string) {
    const res = await fetch(`/api/alerts/${id}/acknowledge`, { method: 'POST' });
    return res.json();
  },

  async resolveAlert(id: string) {
    const res = await fetch(`/api/alerts/${id}/resolve`, { method: 'POST' });
    return res.json();
  },

  async getWaterQuality() {
    const res = await fetch('/api/water-quality');
    return res.json();
  },

  async getMaintenanceTasks() {
    const res = await fetch('/api/maintenance');
    return res.json();
  },

  async createMaintenanceTask(task: any) {
    const res = await fetch('/api/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    return res.json();
  },

  async updateMaintenanceTask(id: string, update: any) {
    const res = await fetch(`/api/maintenance/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    });
    return res.json();
  },

  async getSustainability() {
    const res = await fetch('/api/sustainability');
    return res.json();
  },

  async runSimulation(params: any) {
    const res = await fetch('/api/simulations/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return res.json();
  },

  async generateReport(type: 'daily' | 'weekly' | 'monthly') {
    const res = await fetch('/api/reports/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type })
    });
    return res.json();
  },

  async sendCopilotMessage(message: string, conversationHistory: { sender: 'user' | 'ai'; text: string }[] = []) {
    const res = await fetch('/api/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationHistory })
    });
    return res.json();
  },

  async getAuditLogs() {
    const res = await fetch('/api/audit');
    return res.json();
  },

  subscribeToTelemetry(onMessage: (data: any) => void) {
    const eventSource = new EventSource('/api/readings/stream');
    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        onMessage(parsed);
      } catch (err) {
        console.error('Failed to parse telemetry SSE:', err);
      }
    };
    return () => {
      eventSource.close();
    };
  }
};
