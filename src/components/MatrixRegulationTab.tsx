import React, { useState } from 'react';
import { 
  Table2, 
  RotateCcw, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  Info,
  Layers,
  Percent,
  Sparkles
} from 'lucide-react';
import { RegulationGroup, DistributionSummary } from '../types/jaspel';
import { formatRupiah, formatPercentage, validateMatrixPercentage } from '../utils/jaspelCalculations';

interface MatrixRegulationTabProps {
  summary: DistributionSummary;
  groups: RegulationGroup[];
  onUpdateGroups: (groups: RegulationGroup[]) => void;
  onResetGroups: () => void;
  onAddGroupModal: () => void;
}

export const MatrixRegulationTab: React.FC<MatrixRegulationTabProps> = ({
  summary,
  groups,
  onUpdateGroups,
  onResetGroups,
  onAddGroupModal,
}) => {
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editPercentageVal, setEditPercentageVal] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const { totalPercentage, isValid, delta } = validateMatrixPercentage(groups);

  const categories = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'struktural', label: 'Eselon & Struktural' },
    { id: 'keuangan', label: 'Keuangan' },
    { id: 'staf', label: 'Staf Manajemen' },
    { id: 'unit', label: 'Unit & Loket' },
    { id: 'khusus', label: 'Khusus' },
    { id: 'pengelola', label: 'Pengelola' },
  ];

  const filteredAllocations = summary.groupAllocations.filter((ga) => {
    if (selectedCategoryFilter === 'all') return true;
    return ga.group.category === selectedCategoryFilter;
  });

  const handleStartEdit = (group: RegulationGroup) => {
    setEditingGroupId(group.id);
    setEditPercentageVal(group.percentage.toString());
  };

  const handleSavePercentage = (groupId: string) => {
    const val = parseFloat(editPercentageVal.replace(',', '.'));
    if (!isNaN(val) && val >= 0) {
      const updated = groups.map((g) => (g.id === groupId ? { ...g, percentage: val } : g));
      onUpdateGroups(updated);
    }
    setEditingGroupId(null);
  };

  const handleDeleteGroup = (groupId: string, name: string) => {
    if (window.confirm(`Hapus aturan kelompok "${name}" dari matriks regulasi?`)) {
      const updated = groups.filter((g) => g.id !== groupId);
      onUpdateGroups(updated);
    }
  };

  const handleAutoBalance = () => {
    if (groups.length === 0) return;
    // Distribute delta to the last or biggest group, or proportionally
    const currentSum = groups.reduce((acc, g) => acc + g.percentage, 0);
    if (currentSum <= 0) return;

    const factor = 100 / currentSum;
    const balanced = groups.map((g) => ({
      ...g,
      percentage: Math.round(g.percentage * factor * 1000) / 1000,
    }));

    onUpdateGroups(balanced);
  };

  return (
    <div className="space-y-5 pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Header Info & Balance Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Table2 className="w-5 h-5 text-teal-600" />
              Matriks Regulasi SK Pembagian Jasa Manajemen
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tabel persentase ketetapan resmi per kelompok jabatan dan eselon
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetGroups}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Matriks SK</span>
            </button>
            <button
              onClick={onAddGroupModal}
              className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Aturan</span>
            </button>
          </div>
        </div>

        {/* 100% Precision Balance Meter */}
        <div className={`p-4 rounded-xl border ${isValid ? 'bg-emerald-50/70 border-emerald-200' : 'bg-amber-50/70 border-amber-200'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl shrink-0 ${isValid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {isValid ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    Total Porsi Regulasi:
                  </span>
                  <span className={`text-base font-extrabold tabular-nums ${isValid ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {formatPercentage(totalPercentage)}
                  </span>
                  <span className="text-xs text-slate-500">/ 100,00%</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {isValid 
                    ? 'Seluruh anggaran teralokasi secara sempurna ke 15 kelompok regulasi tanpa surplus/defisit.'
                    : `Terdapat selisih porsi sebesar ${delta > 0 ? `kekurangan ${delta}%` : `kelebihan ${Math.abs(delta)}%`}.`}
                </p>
              </div>
            </div>

            {!isValid && (
              <button
                onClick={handleAutoBalance}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Seimbangkan 100% Otomatis</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategoryFilter(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  selectedCategoryFilter === c.id
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Regulation Matrix Cards & Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Menampilkan <span className="font-semibold text-slate-800">{filteredAllocations.length}</span> aturan kelompok regulasi
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Total Dana: <span className="font-bold text-slate-900 tabular-nums">{formatRupiah(summary.totalFund)}</span>
          </div>
        </div>

        {/* Matrix List (Optimized for Mobile Touch) */}
        <div className="divide-y divide-slate-100">
          {filteredAllocations.map((alloc, idx) => {
            const { group, allocatedAmount, activeMemberCount, totalMemberCount, amountPerMember } = alloc;
            const isEditing = editingGroupId === group.id;

            return (
              <div 
                key={group.id} 
                className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                          {group.name}
                        </h3>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {group.category}
                        </span>
                      </div>
                      {group.description && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {group.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Edit/Delete triggers */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleStartEdit(group)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                      title="Ubah Persentase"
                      aria-label="Ubah Persentase"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {!['kabag_kabid', 'kasubag_kasie', 'pengelola'].includes(group.id) && (
                      <button
                        onClick={() => handleDeleteGroup(group.id, group.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Aturan"
                        aria-label="Hapus Aturan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Percentage Edit Form (if active) */}
                {isEditing ? (
                  <div className="p-3 bg-teal-50/80 rounded-xl border border-teal-200 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-teal-900">Persentase Baru:</span>
                      <div className="relative w-28">
                        <input
                          type="number"
                          step="0.01"
                          value={editPercentageVal}
                          onChange={(e) => setEditPercentageVal(e.target.value)}
                          className="w-full pl-3 pr-7 py-1.5 text-sm font-bold text-slate-900 bg-white border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 tabular-nums"
                          autoFocus
                        />
                        <span className="absolute right-2.5 top-2 text-xs font-bold text-slate-400">%</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSavePercentage(group.id)}
                        className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-2xs"
                      >
                        Simpan
                      </button>
                      <button
                        onClick={() => setEditingGroupId(null)}
                        className="px-3 py-1.5 bg-white text-slate-600 hover:bg-slate-100 text-xs font-medium rounded-lg border border-slate-200"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Metric Summary Grid for this Group */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                  {/* Porsi % */}
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                      Porsi SK
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-teal-800 tabular-nums mt-0.5 block">
                      {formatPercentage(group.percentage)}
                    </span>
                  </div>

                  {/* Total Alokasi Rp */}
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                      Total Alokasi
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums mt-0.5 block truncate">
                      {formatRupiah(allocatedAmount)}
                    </span>
                  </div>

                  {/* Nominal per Orang */}
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                      Per Pegawai ({activeMemberCount} org)
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-700 tabular-nums mt-0.5 block truncate">
                      {formatRupiah(amountPerMember)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
