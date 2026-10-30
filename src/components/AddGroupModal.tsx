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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
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

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Kelompok Regulasi *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: TIM IT & SIMRS"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kategori Fungsi *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryTier)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="struktural">Eselon / Struktural</option>
                <option value="keuangan">Keuangan</option>
                <option value="staf">Staf Manajemen</option>
                <option value="unit">Unit Penunjang</option>
                <option value="khusus">Penugasan Khusus</option>
                <option value="pengelola">Tim Pengelola</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Porsi Matriks (%) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  required
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  placeholder="1.50"
                  className="w-full pl-3 pr-7 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 tabular-nums"
                />
                <span className="absolute right-3 top-2.5 font-bold text-slate-400">%</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Deskripsi Fungsi SK (Opsional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Pengelola Sistem Informasi Manajemen RSUD"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-xs"
            >
              Simpan Aturan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
