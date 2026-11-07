import React, { useState } from 'react';
import { X, Plus, Layers } from 'lucide-react';
import { RegulationGroup, CategoryTier } from '../types/jaspel';

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGroup: (newGroup: RegulationGroup) => void;
}

export const AddGroupModal: React.FC<AddGroupModalProps> = ({
  isOpen,
  onClose,
  onAddGroup,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryTier>('staf');
  const [percentage, setPercentage] = useState<string>('1.00');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pct = parseFloat(percentage.replace(',', '.'));
    if (!name.trim() || isNaN(pct) || pct <= 0) return;

    const newGroup: RegulationGroup = {
      id: `custom_${Date.now()}`,
      name: name.trim().toUpperCase(),
      category,
      percentage: pct,
      description: description.trim() || undefined,
      defaultMemberCount: 1,
    };

    onAddGroup(newGroup);
    setName('');
    setDescription('');
    setPercentage('1.00');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-5 py-4 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold">Tambah Kelompok Regulasi Baru</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nama Kelompok Aturan *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: KEPALA INSTALASI / DOKTER UMUM"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Fungsi *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryTier)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              >
                <option value="struktural">Eselon &amp; Struktural</option>
                <option value="keuangan">Keuangan &amp; Bendahara</option>
                <option value="staf">Staf Manajemen &amp; TU</option>
                <option value="unit">Unit &amp; Loket</option>
                <option value="khusus">Penugasan Khusus</option>
                <option value="pengelola">Tim Pengelola</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Porsi SK (%) *
              </label>
              <input
                type="text"
                required
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="Contoh: 2.50"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Deskripsi Ketetapan SK (Opsional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Lampiran II Huruf A SK Direktur"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Kelompok</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
