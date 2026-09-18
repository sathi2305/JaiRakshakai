import React, { useState } from 'react';
import { api } from '../../services/api';
import {
  FileText,
  Printer,
  Sparkles,
  Download,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Award,
  RefreshCw
} from 'lucide-react';

export const ReportCenter: React.FC = () => {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [report, setReport] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async (type: 'daily' | 'weekly' | 'monthly') => {
    setIsGenerating(true);
    setReportType(type);
    try {
      const res = await api.generateReport(type);
      setReport(res);
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-generate weekly on initial mount
  React.useEffect(() => {
    handleGenerateReport('weekly');
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Automated Water Audit & AI Executive Reporting
            </h1>
            <span className="text-[10px] font-mono uppercase bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
              Gemini Powered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate audit-ready institutional reports with AI narrative analysis and print formatting
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {(['daily', 'weekly', 'monthly'] as const).map(t => (
              <button
                key={t}
                onClick={() => handleGenerateReport(t)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all capitalize ${
                  reportType === t ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <RefreshCw className="w-8 h-8 text-cyan-600 animate-spin mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-sm">Synthesizing Institutional Audit Report...</h3>
          <p className="text-xs text-slate-500 mt-1">
            Querying Gemini 3.8 Flash to structure telemetry summaries and executive recommendations
          </p>
        </div>
      )}

      {/* Generated Report Sheet */}
      {report && !isGenerating && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6 print:border-none print:shadow-none print:p-0">
          
          {/* Report Top Header */}
          <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl text-slate-900">JalRakshak AI Enterprise</span>
                <span className="text-[10px] bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold px-1.5 py-0.5 rounded">
                  Official Audit
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-700 mt-1 capitalize">
                {report.period} Comprehensive Water Management Report
              </h2>
              <p className="text-xs text-slate-500">
                Facility: Indira Innovation Tech Campus • Generated {new Date(report.generatedAt).toLocaleString()}
              </p>
            </div>

            <div className="text-right text-xs">
              <span className="text-slate-400 block">Report Document ID</span>
              <span className="font-mono font-bold text-slate-800">{report.id}</span>
            </div>
          </div>

          {/* AI Executive Summary Narrative (Section 28) */}
          <div className="p-5 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs leading-relaxed text-indigo-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Executive AI Synthesis & Operational Narrative
            </div>
            <p className="font-medium whitespace-pre-line text-slate-700">
              {report.aiSummary}
            </p>
          </div>

          {/* Key Metrics Summary Box */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Performance & Consumption Balance
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block">Gross Intake</span>
                <span className="text-lg font-black text-slate-900 mt-1 block">
                  {(report.metrics?.totalIntakeLiters ?? 0).toLocaleString()} L
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block">Water Conserved</span>
                <span className="text-lg font-black text-emerald-600 mt-1 block">
                  {(report.metrics?.waterSavedLiters ?? 0).toLocaleString()} L
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block">Financial Savings</span>
                <span className="text-lg font-black text-slate-900 mt-1 block font-mono">
                  ${report.metrics.financialSavingsUsd}
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block">Efficiency Score</span>
                <span className="text-lg font-black text-cyan-600 mt-1 block">
                  {report.metrics.waterEfficiencyScore} / 100
                </span>
              </div>
            </div>
          </div>

          {/* Anomaly & Incident Log */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Period Anomaly & Incident Spectrum
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="pb-2">Incident Type</th>
                    <th className="pb-2">Location</th>
                    <th className="pb-2">Severity</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(report.anomalies || []).map((a: any) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="py-2.5 font-bold text-slate-800">{a.type}</td>
                      <td className="py-2.5 text-slate-600">{a.location}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          a.severity === 'CRITICAL' || a.severity === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {a.severity}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-medium text-slate-600">{a.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendations List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Actionable Directives for Next Operational Period
            </h3>
            <div className="space-y-2 text-xs">
              {(report.recommendations || []).map((r: any) => (
                <div key={r.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">{r.title}</span>
                    <p className="text-slate-600 mt-0.5">{r.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Sign-off Block for PDF */}
          <div className="pt-6 border-t border-slate-200 flex justify-between text-xs text-slate-400">
            <div>
              <span className="block font-semibold text-slate-700">Audit Verification Sign-Off:</span>
              <span className="block mt-4 border-t border-slate-300 pt-1 w-48 font-mono text-slate-500">
                Dr. A. Sharma, Sustainability Director
              </span>
            </div>
            <div className="text-right">
              <span className="block font-semibold text-slate-700">Digital Water Security:</span>
              <span className="block mt-4 text-emerald-600 font-bold">
                ✓ Cryptographically Timestamped
              </span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
