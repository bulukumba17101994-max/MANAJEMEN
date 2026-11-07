import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  UserCheck, 
  UserX, 
  Receipt, 
  Edit3,
  Check, 
  ChevronRight,
  ShieldCheck,
  Building2,
  Lock
} from 'lucide-react';
import { Recipient, CalculatedRecipient, DistributionSummary, UserProfile } from '../types/jaspel';
import { formatRupiah, formatPercentage } from '../utils/jaspelCalculations';
import { ROLE_PERMISSIONS } from '../services/auth';

interface RecipientsTabProps {
  summary: DistributionSummary;
  recipients: Recipient[];
  currentUser: UserProfile;
  initialGroupIdFilter?: string | null;
  onToggleActive: (recipientId: string) => void;
  onOpenSlip: (recipient: CalculatedRecipient) => void;
  onOpenAddModal: () => void;
  onEditRecipient: (recipient: Recipient) => void;
  onDeleteRecipient: (recipientId: string, name: string) => void;
}

export const RecipientsTab: React.FC<RecipientsTabProps> = ({
  summary,
  recipients,
  currentUser,
  initialGroupIdFilter,
  onToggleActive,
  onOpenSlip,
  onOpenAddModal,
  onEditRecipient,
  onDeleteRecipient,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>(
    initialGroupIdFilter || 'all'
  );
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const permissions = ROLE_PERMISSIONS[currentUser.role];

  const filteredRecipients = summary.calculatedRecipients.filter((rec) => {
    // Search query
    const matchSearch =
      !searchQuery ||
      rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.groupName.toLowerCase().includes(searchQuery.toLowerCase());

    // Group filter
    const matchGroup =
      selectedGroupFilter === 'all' || rec.groupId === selectedGroupFilter;

    // Status filter
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && rec.isActive) ||
      (statusFilter === 'inactive' && !rec.isActive);

    return matchSearch && matchGroup && matchStatus;
  });

  const handleToggleClick = (rec: CalculatedRecipient) => {
    if (!permissions.canChangeAttendance) {
      alert('Peran Anda (' + currentUser.role + ') hanya memiliki akses baca. Silakan beralih ke peran Manager atau Admin untuk mengubah status kehadiran.');
      return;
    }
    onToggleActive(rec.id);
  };

  const handleEditClick = (rec: CalculatedRecipient) => {
    if (!permissions.canEditEmployees) {
      alert('Peran Anda (' + currentUser.role + ') hanya memiliki akses baca. Silakan beralih ke peran Manager atau Admin untuk mengedit data pegawai.');
      return;
    }
    onEditRecipient(rec);
  };

  return (
    <div className="space-y-4 pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Search & Filter Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                Data Penerima
              </span>
              <span className="text-xs text-slate-400">Total {summary.totalRecipients} Terdaftar</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mt-1">
              <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Daftar Pegawai Penerima Jasa Manajemen</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Kelola status kehadiran dan perincian hak terima masing-masing pegawai rumah sakit
            </p>
          </div>

          {permissions.canEditEmployees && (
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm hover:scale-[1.01] self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pegawai</span>
            </button>
          )}
        </div>

        {/* Search input & Group dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          <div className="sm:col-span-7 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama pegawai, jabatan (cth: Sukrawati, Kasie, Reski)..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="sm:col-span-5 flex gap-2">
            <select
              value={selectedGroupFilter}
              onChange={(e) => setSelectedGroupFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Semua Kelompok Regulasi</option>
              {summary.groupAllocations.map((g) => (
                <option key={g.group.id} value={g.group.id}>
                  {g.group.name} ({formatPercentage(g.group.percentage)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">Status:</span>
          {(['all', 'active', 'inactive'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st === 'all'
                ? `Semua (${summary.totalRecipients})`
                : st === 'active'
                ? `Aktif (${summary.activeRecipients})`
                : `Non-Aktif (${summary.totalRecipients - summary.activeRecipients})`}
            </button>
          ))}
        </div>
      </div>

      {/* Recipient Cards List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
          <span>
            Menampilkan <strong>{filteredRecipients.length}</strong> pegawai penerima
          </span>
          <span>Klik ikon slip untuk pratinjau bukti tanda terima resmi</span>
        </div>

        {filteredRecipients.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 text-slate-400 space-y-2">
            <Users className="w-10 h-10 mx-auto opacity-40" />
            <p className="text-sm font-semibold">Tidak ditemukan pegawai dengan filter ini.</p>
          </div>
        ) : (
          filteredRecipients.map((rec) => {
            return (
              <div
                key={rec.id}
                className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                  rec.isActive
                    ? 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-teal-500/50 shadow-2xs'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200/60 dark:border-slate-850 opacity-75'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Name & Position */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                        {rec.name}
                      </h3>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                        {rec.groupName}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {rec.position}
                    </p>

                    {rec.notes && (
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 italic">
                        Catatan: {rec.notes}
                      </p>
                    )}
                  </div>

                  {/* Nominal & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    {/* Nominal */}
                    <div className="text-left sm:text-right">
                      <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white tabular-nums">
                        {rec.isActive ? formatRupiah(rec.allocatedAmount) : 'Rp 0'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {rec.isActive ? 'Nominal Bersih' : 'Cuti / Non-Aktif'}
                      </div>
                    </div>

                    {/* Toggle Active Button */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleToggleClick(rec)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                          rec.isActive
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                        title={
                          !permissions.canChangeAttendance
                            ? 'Akses terbatas (Hanya Admin / Manager)'
                            : rec.isActive
                            ? 'Klik untuk non-aktifkan'
                            : 'Klik untuk aktifkan'
                        }
                      >
                        {rec.isActive ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Aktif</span>
                          </>
                        ) : (
                          <>
                            <UserX className="w-3.5 h-3.5 text-slate-400" />
                            <span>Cuti</span>
                          </>
                        )}
                      </button>

                      {/* Edit Pegawai Action */}
                      <button
                        onClick={() => handleEditClick(rec)}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-teal-700 flex items-center justify-center transition-colors shadow-2xs"
                        title={
                          !permissions.canEditEmployees
                            ? 'Akses terbatas (Hanya Admin / Manager)'
                            : 'Edit Data Pegawai'
                        }
                        aria-label="Edit Pegawai"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Slip Action */}
                      <button
                        onClick={() => onOpenSlip(rec)}
                        disabled={!rec.isActive}
                        className={`p-2 rounded-xl border flex items-center justify-center transition-colors ${
                          rec.isActive
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 border-slate-900 dark:border-white shadow-2xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 border-slate-200 dark:border-slate-800 cursor-not-allowed'
                        }`}
                        title="Buka Slip Pembagian Jasa"
                        aria-label="Buka Slip"
                      >
                        <Receipt className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
