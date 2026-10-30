import React, { useState, useEffect } from 'react';
import { X, Edit3, Trash2, Check, UserCheck, UserX } from 'lucide-react';
import { RegulationGroup, Recipient } from '../types/jaspel';

interface EditRecipientModalProps {
  recipient: Recipient | null;
  groups: RegulationGroup[];
  isOpen: boolean;
  onClose: () => void;
  onSaveRecipient: (updated: Recipient) => void;
  onDeleteRecipient: (id: string, name: string) => void;
}

export const EditRecipientModal: React.FC<EditRecipientModalProps> = ({
  recipient,
  groups,
  isOpen,
  onClose,
  onSaveRecipient,
  onDeleteRecipient,
}) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [groupId, setGroupId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (recipient) {
      setName(recipient.name);
      setPosition(recipient.position);
      setGroupId(recipient.groupId);
      setIsActive(recipient.isActive);
      setNotes(recipient.notes || '');
    }
  }, [recipient]);

  if (!isOpen || !recipient) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !position.trim() || !groupId) return;

    onSaveRecipient({
      ...recipient,
      name: name.trim().toUpperCase(),
      position: position.trim().toUpperCase(),
      groupId,
      isActive,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  const handleDelete = () => {
    onDeleteRecipient(recipient.id, recipient.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold">Edit Data Pegawai Penerima</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
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
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Jabatan / Penugasan SK *
            </label>
            <input
              type="text"
              required
              value={position}
              onChange={(e) => setPosition(e.target.value)}
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

          {/* Toggle Active Switch */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="block font-semibold text-slate-800">Status Kehadiran / Hak</span>
              <span className="text-[11px] text-slate-500">
                {isActive ? 'Aktif bertugas & menerima hak jasa' : 'Cuti / non-aktif (tidak menerima jasa)'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {isActive ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Aktif</span>
                </>
              ) : (
                <>
                  <UserX className="w-3.5 h-3.5 text-amber-600" />
                  <span>Cuti / Non-Aktif</span>
                </>
              )}
            </button>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Catatan Khusus (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Non-aktif cuti / Tugas khusus"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDelete}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Pegawai</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
