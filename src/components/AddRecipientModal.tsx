import React, { useState } from 'react';
import { X, Plus, UserPlus } from 'lucide-react';
import { RegulationGroup, Recipient } from '../types/jaspel';

interface AddRecipientModalProps {
  groups: RegulationGroup[];
  isOpen: boolean;
  onClose: () => void;
  onAddRecipient: (newRec: Omit<Recipient, 'id'>) => void;
}

export const AddRecipientModal: React.FC<AddRecipientModalProps> = ({
  groups,
  isOpen,
  onClose,
  onAddRecipient,
}) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [groupId, setGroupId] = useState(groups[0]?.id || '');
  const [isActive, setIsActive] = useState(true);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !position.trim() || !groupId) return;

    onAddRecipient({
      name: name.trim().toUpperCase(),
      position: position.trim().toUpperCase(),
      groupId,
      isActive,
      notes: notes.trim() || undefined,
    });

    setName('');
    setPosition('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold">Tambah Pegawai Penerima</h3>
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
              Nama Lengkap Pegawai *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: DR. H. AHMAD FAUZI, SP.PD"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Jabatan / Penugasan *
            </label>
            <input
              type="text"
              required
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Contoh: STAF ADMINISTRASI RAWAT INAP"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Kelompok Regulasi (Matriks SK) *
            </label>
            <select
              required
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.percentage}%)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is-active-check"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
            />
            <label htmlFor="is-active-check" className="text-xs font-medium text-slate-700 select-none">
              Pegawai Aktif Bertugas (Menerima hak periode ini)
            </label>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Catatan Khusus (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Penugasan tambahan SK Panitia BLUD"
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
              Simpan Pegawai
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
