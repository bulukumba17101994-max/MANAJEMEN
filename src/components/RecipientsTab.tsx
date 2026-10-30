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
  Building2
} from 'lucide-react';
import { Recipient, CalculatedRecipient, DistributionSummary } from '../types/jaspel';
import { formatRupiah, formatPercentage } from '../utils/jaspelCalculations';

interface RecipientsTabProps {
  summary: DistributionSummary;
  recipients: Recipient[];
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

  return (
    <div className="space-y-4 pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Search & Filter Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600" />
              Daftar Pegawai Penerima Jasa Manajemen
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola status kehadiran dan perincian hak terima masing-masing pegawai
            </p>
          </div>

          <button
            onClick={onOpenAddModal}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pegawai</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama pegawai, jabatan (cth: Sukrawati, Kasubag, Keuangan)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-slate-50 focus:bg-white transition-all"
          />
        </div>

        {/* Group Filter & Status Chips */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
          {/* Group Dropdown */}
          <div className="flex items-center gap-2 min-w-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedGroupFilter}
              onChange={(e) => setSelectedGroupFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 max-w-[260px] truncate"
            >
              <option value="all">Semua Kelompok Regulasi</option>
              {summary.groupAllocations.map((ga) => (
                <option key={ga.group.id} value={ga.group.id}>
                  {ga.group.name} ({ga.activeMemberCount} org)
                </option>
              ))}
            </select>
          </div>

          {/* Status Segmented Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({summary.totalRecipients})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'active'
                  ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Aktif ({summary.activeRecipients})
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'inactive'
                  ? 'bg-white text-amber-800 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Non-Aktif ({summary.totalRecipients - summary.activeRecipients})
            </button>
          </div>
        </div>
      </div>

      {/* Recipient Cards List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1 text-xs text-slate-500">
          <span>Menampilkan {filteredRecipients.length} pegawai penerima</span>
          <span>Klik tombol slip untuk tanda terima resmi</span>
        </div>

        {filteredRecipients.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">Tidak Ada Pegawai Ditemukan</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Tidak ada data yang cocok dengan kriteria pencarian atau filter yang dipilih.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGroupFilter('all');
                setStatusFilter('all');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors"
            >
              Reset Filter Pencarian
            </button>
          </div>
        ) : (
          filteredRecipients.map((rec) => {
            return (
              <div
                key={rec.id}
                className={`bg-white rounded-2xl p-4 border transition-all ${
                  rec.isActive
                    ? 'border-slate-200/90 shadow-2xs hover:border-teal-300'
                    : 'border-slate-200/60 bg-slate-50/50 opacity-75'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Info Pegawai */}
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                        {rec.name}
                      </h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {rec.groupName}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium">
                      {rec.position}
                    </p>

                    {rec.notes && (
                      <p className="text-[11px] text-amber-700 italic">
                        Catatan: {rec.notes}
                      </p>
                    )}
                  </div>

                  {/* Nominal & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* Nominal */}
                    <div className="text-left sm:text-right">
                      <div className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">
                        {rec.isActive ? formatRupiah(rec.allocatedAmount) : 'Rp 0'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {rec.isActive ? 'Nominal Bersih' : 'Cuti / Non-Aktif'}
                      </div>
                    </div>

                    {/* Toggle Active Button */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onToggleActive(rec.id)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                          rec.isActive
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                            : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                        }`}
                        title={rec.isActive ? 'Klik untuk non-aktifkan' : 'Klik untuk aktifkan'}
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
                        onClick={() => onEditRecipient(rec)}
                        className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-teal-700 flex items-center justify-center transition-colors shadow-2xs"
                        title="Edit Data Pegawai"
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
                            ? 'bg-slate-900 text-white hover:bg-slate-800 border-slate-900 shadow-2xs'
                            : 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
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
