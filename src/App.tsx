/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { CalculatorTab } from './components/CalculatorTab';
import { MatrixRegulationTab } from './components/MatrixRegulationTab';
import { RecipientsTab } from './components/RecipientsTab';
import { ReportsTab } from './components/ReportsTab';
import { RecipientSlipModal } from './components/RecipientSlipModal';
import { AddRecipientModal } from './components/AddRecipientModal';
import { EditRecipientModal } from './components/EditRecipientModal';
import { AddGroupModal } from './components/AddGroupModal';
import { PeriodFolderModal } from './components/PeriodFolderModal';

import { 
  DEFAULT_TOTAL_FUND, 
  DEFAULT_PERIOD, 
  DEFAULT_HOSPITAL_NAME, 
  DEFAULT_REGULATION_GROUPS, 
  DEFAULT_RECIPIENTS,
  DEFAULT_REPORT_CONFIG,
  MONTH_NAMES
} from './utils/jaspelData';
import { calculateDistribution } from './utils/jaspelCalculations';
import { 
  RegulationGroup, 
  Recipient, 
  CalculatedRecipient, 
  PeriodArchive, 
  ReportConfig 
} from './types/jaspel';
import {
  subscribeToPeriods,
  savePeriodToCloud,
  deletePeriodFromCloud,
  seedInitialPeriodIfEmpty,
  testFirestoreConnection,
} from './services/firebase';

export default function App() {
  // Application State with LocalStorage persistence and Firebase Real-Time Cloud Sync
  const [totalFund, setTotalFund] = useState<number>(() => {
    const saved = localStorage.getItem('sip_jasman_fund');
    return saved ? Number(saved) : DEFAULT_TOTAL_FUND;
  });

  const [period, setPeriod] = useState<string>(() => {
    const saved = localStorage.getItem('sip_jasman_period');
    return saved || DEFAULT_PERIOD;
  });

  const [hospitalName] = useState<string>(DEFAULT_HOSPITAL_NAME);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const [groups, setGroups] = useState<RegulationGroup[]>(() => {
    const saved = localStorage.getItem('sip_jasman_groups');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_REGULATION_GROUPS;
      }
    }
    return DEFAULT_REGULATION_GROUPS;
  });

  const [recipients, setRecipients] = useState<Recipient[]>(() => {
    const saved = localStorage.getItem('sip_jasman_recipients');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_RECIPIENTS;
      }
    }
    return DEFAULT_RECIPIENTS;
  });

  const [reportConfig, setReportConfig] = useState<ReportConfig>(() => {
    const saved = localStorage.getItem('sip_jasman_report_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_REPORT_CONFIG;
      }
    }
    return DEFAULT_REPORT_CONFIG;
  });

  // Month & Year Archives
  const [archives, setArchives] = useState<PeriodArchive[]>(() => {
    const saved = localStorage.getItem('sip_jasman_archives');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback default archive
      }
    }
    return [
      {
        id: '2026-10',
        year: 2026,
        month: 10,
        label: 'Oktober 2026',
        savedAt: new Date().toISOString(),
        totalFund: DEFAULT_TOTAL_FUND,
        groups: DEFAULT_REGULATION_GROUPS,
        recipients: DEFAULT_RECIPIENTS,
        reportConfig: DEFAULT_REPORT_CONFIG,
      },
    ];
  });

  const [activeTab, setActiveTab] = useState<TabType>('kalkulator');
  const [activeSlipRecipient, setActiveSlipRecipient] = useState<CalculatedRecipient | null>(null);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
  const [isAddRecipientOpen, setIsAddRecipientOpen] = useState(false);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [isPeriodFolderOpen, setIsPeriodFolderOpen] = useState(false);
  const [groupFilterFromCalculator, setGroupFilterFromCalculator] = useState<string | null>(null);

  // Real-time Cloud Sync Subscription across all devices
  useEffect(() => {
    testFirestoreConnection();
    
    // Seed initial baseline if cloud is empty
    seedInitialPeriodIfEmpty({
      id: '2026-10',
      year: 2026,
      month: 10,
      label: 'Oktober 2026',
      savedAt: new Date().toISOString(),
      totalFund: DEFAULT_TOTAL_FUND,
      groups: DEFAULT_REGULATION_GROUPS,
      recipients: DEFAULT_RECIPIENTS,
      reportConfig: DEFAULT_REPORT_CONFIG,
    });

    // Real-time listener: triggers whenever ANY device modifies cloud data
    const unsubscribe = subscribeToPeriods((cloudArchives) => {
      if (cloudArchives && cloudArchives.length > 0) {
        setArchives(cloudArchives);

        // Sync active period from incoming cloud data
        const currentInCloud = cloudArchives.find((a) => a.label === period);
        if (currentInCloud) {
          setTotalFund(currentInCloud.totalFund);
          setGroups(currentInCloud.groups);
          setRecipients(currentInCloud.recipients);
          if (currentInCloud.reportConfig) {
            setReportConfig(currentInCloud.reportConfig);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [period]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('sip_jasman_fund', totalFund.toString());
  }, [totalFund]);

  useEffect(() => {
    localStorage.setItem('sip_jasman_period', period);
  }, [period]);

  useEffect(() => {
    localStorage.setItem('sip_jasman_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('sip_jasman_recipients', JSON.stringify(recipients));
  }, [recipients]);

  useEffect(() => {
    localStorage.setItem('sip_jasman_report_config', JSON.stringify(reportConfig));
  }, [reportConfig]);

  useEffect(() => {
    localStorage.setItem('sip_jasman_archives', JSON.stringify(archives));
  }, [archives]);

  // Derived calculation summary
  const summary = useMemo(() => {
    return calculateDistribution(totalFund, groups, recipients, period, hospitalName, reportConfig);
  }, [totalFund, groups, recipients, period, hospitalName, reportConfig]);

  // Period & Folder Handlers with Cloud Push
  const handleSaveCurrentPeriod = async () => {
    setIsSyncing(true);
    const existingIndex = archives.findIndex((a) => a.label === period);
    const updatedArchive: PeriodArchive = {
      id: existingIndex >= 0 ? archives[existingIndex].id : `period_${Date.now()}`,
      year: existingIndex >= 0 ? archives[existingIndex].year : 2026,
      month: existingIndex >= 0 ? archives[existingIndex].month : 10,
      label: period,
      savedAt: new Date().toISOString(),
      totalFund,
      groups,
      recipients,
      reportConfig,
    };

    try {
      await savePeriodToCloud(updatedArchive);
      if (existingIndex >= 0) {
        setArchives((prev) => prev.map((a, i) => (i === existingIndex ? updatedArchive : a)));
      } else {
        setArchives((prev) => [updatedArchive, ...prev]);
      }
    } catch (err) {
      console.error('Cloud save fallback to local:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSelectPeriod = (archive: PeriodArchive) => {
    setPeriod(archive.label);
    setTotalFund(archive.totalFund);
    setGroups(archive.groups);
    setRecipients(archive.recipients);
    if (archive.reportConfig) {
      setReportConfig(archive.reportConfig);
    }
  };

  const handleCreateNewPeriod = async (
    month: number,
    year: number,
    copyFromCurrent: boolean,
    initialFund?: number
  ) => {
    setIsSyncing(true);
    const monthName = MONTH_NAMES[month - 1] || 'Bulan';
    const label = `${monthName} ${year}`;
    const id = `${year}-${String(month).padStart(2, '0')}`;

    const newArchive: PeriodArchive = {
      id,
      year,
      month,
      label,
      savedAt: new Date().toISOString(),
      totalFund: initialFund || (copyFromCurrent ? totalFund : DEFAULT_TOTAL_FUND),
      groups: copyFromCurrent ? [...groups] : DEFAULT_REGULATION_GROUPS,
      recipients: copyFromCurrent ? [...recipients] : DEFAULT_RECIPIENTS,
      reportConfig: {
        ...reportConfig,
        documentDate: `30 ${monthName} ${year}`,
      },
    };

    try {
      await savePeriodToCloud(newArchive);
      setArchives((prev) => {
        const filtered = prev.filter((a) => a.label !== label);
        return [newArchive, ...filtered];
      });
      handleSelectPeriod(newArchive);
    } catch (err) {
      console.error('Cloud create period:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeletePeriod = async (id: string, label: string) => {
    if (window.confirm(`Hapus folder arsip "${label}" dari cloud dan semua perangkat?`)) {
      setIsSyncing(true);
      try {
        await deletePeriodFromCloud(id);
        setArchives((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        console.error('Cloud delete period:', err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  // Action handlers
  const handleResetToDefault = () => {
    setTotalFund(DEFAULT_TOTAL_FUND);
    setPeriod(DEFAULT_PERIOD);
    setGroups(DEFAULT_REGULATION_GROUPS);
    setRecipients(DEFAULT_RECIPIENTS);
    setReportConfig(DEFAULT_REPORT_CONFIG);
    localStorage.removeItem('sip_jasman_fund');
    localStorage.removeItem('sip_jasman_period');
    localStorage.removeItem('sip_jasman_groups');
    localStorage.removeItem('sip_jasman_recipients');
    localStorage.removeItem('sip_jasman_report_config');
  };

  const handleToggleRecipientActive = (id: string) => {
    setRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const handleAddRecipient = (newRec: Omit<Recipient, 'id'>) => {
    const created: Recipient = {
      ...newRec,
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };
    setRecipients((prev) => [...prev, created]);
  };

  const handleSaveEditedRecipient = (updated: Recipient) => {
    setRecipients((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
    setEditingRecipient(null);
  };

  const handleDeleteRecipient = (id: string, name: string) => {
    if (window.confirm(`Hapus pegawai "${name}" dari daftar?`)) {
      setRecipients((prev) => prev.filter((r) => r.id !== id));
      if (editingRecipient?.id === id) {
        setEditingRecipient(null);
      }
    }
  };

  const handleAddGroup = (newGroup: RegulationGroup) => {
    setGroups((prev) => [...prev, newGroup]);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Header */}
      <Header
        hospitalName={hospitalName}
        period={period}
        totalFund={totalFund}
        isSyncing={isSyncing}
        onPeriodChange={setPeriod}
        onOpenPeriodFolder={() => setIsPeriodFolderOpen(true)}
        onResetToDefault={handleResetToDefault}
      />

      {/* Desktop Navigation Tabs (Hidden on mobile) */}
      <div className="hidden md:block bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <nav className="flex space-x-8" aria-label="Tabs Desktop">
            <button
              onClick={() => setActiveTab('kalkulator')}
              className={`py-3.5 px-1 border-b-2 text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === 'kalkulator'
                  ? 'border-teal-600 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              Kalkulator Jasa
            </button>
            <button
              onClick={() => setActiveTab('matriks')}
              className={`py-3.5 px-1 border-b-2 text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'matriks'
                  ? 'border-teal-600 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <span>Matriks Regulasi SK</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                100%
              </span>
            </button>
            <button
              onClick={() => setActiveTab('penerima')}
              className={`py-3.5 px-1 border-b-2 text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'penerima'
                  ? 'border-teal-600 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <span>Daftar Penerima</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                {summary.activeRecipients} Orang
              </span>
            </button>
            <button
              onClick={() => setActiveTab('laporan')}
              className={`py-3.5 px-1 border-b-2 text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === 'laporan'
                  ? 'border-teal-600 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              Laporan &amp; Berita Acara
            </button>
          </nav>

          <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
            <span>Folder: <strong>{period}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === 'kalkulator' && (
          <CalculatorTab
            summary={summary}
            onUpdateTotalFund={setTotalFund}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onSelectGroupFilter={(groupId) => setGroupFilterFromCalculator(groupId)}
          />
        )}

        {activeTab === 'matriks' && (
          <MatrixRegulationTab
            summary={summary}
            groups={groups}
            onUpdateGroups={setGroups}
            onResetGroups={() => setGroups(DEFAULT_REGULATION_GROUPS)}
            onAddGroupModal={() => setIsAddGroupOpen(true)}
          />
        )}

        {activeTab === 'penerima' && (
          <RecipientsTab
            summary={summary}
            recipients={recipients}
            initialGroupIdFilter={groupFilterFromCalculator}
            onToggleActive={handleToggleRecipientActive}
            onOpenSlip={(rec) => setActiveSlipRecipient(rec)}
            onOpenAddModal={() => setIsAddRecipientOpen(true)}
            onEditRecipient={(rec) => setEditingRecipient(rec)}
            onDeleteRecipient={handleDeleteRecipient}
          />
        )}

        {activeTab === 'laporan' && (
          <ReportsTab 
            summary={summary} 
            reportConfig={reportConfig}
            onUpdateReportConfig={setReportConfig}
          />
        )}
      </main>

      {/* Mobile Ergonomic Bottom Bar */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        activeRecipientsCount={summary.activeRecipients}
        totalRecipientsCount={summary.totalRecipients}
      />

      {/* Individual Slip Modal */}
      <RecipientSlipModal
        recipient={activeSlipRecipient}
        summary={summary}
        onClose={() => setActiveSlipRecipient(null)}
      />

      {/* Add Recipient Modal */}
      <AddRecipientModal
        groups={groups}
        isOpen={isAddRecipientOpen}
        onClose={() => setIsAddRecipientOpen(false)}
        onAddRecipient={handleAddRecipient}
      />

      {/* Edit Recipient Modal */}
      <EditRecipientModal
        recipient={editingRecipient}
        groups={groups}
        isOpen={Boolean(editingRecipient)}
        onClose={() => setEditingRecipient(null)}
        onSaveRecipient={handleSaveEditedRecipient}
        onDeleteRecipient={handleDeleteRecipient}
      />

      {/* Add Group Modal */}
      <AddGroupModal
        isOpen={isAddGroupOpen}
        onClose={() => setIsAddGroupOpen(false)}
        onAddGroup={handleAddGroup}
      />

      {/* Period & Month/Year Folder Modal */}
      <PeriodFolderModal
        isOpen={isPeriodFolderOpen}
        currentPeriod={period}
        totalFund={totalFund}
        groups={groups}
        recipients={recipients}
        reportConfig={reportConfig}
        archives={archives}
        onClose={() => setIsPeriodFolderOpen(false)}
        onSelectPeriod={handleSelectPeriod}
        onSaveCurrentPeriod={handleSaveCurrentPeriod}
        onCreateNewPeriod={handleCreateNewPeriod}
        onDeletePeriod={handleDeletePeriod}
      />
    </div>
  );
}
