import React from 'react';
import { 
  X, 
  ShieldCheck, 
  UserCheck, 
  User, 
  Check, 
  Lock, 
  Crown, 
  Briefcase, 
  Sparkles,
  Info
} from 'lucide-react';
import { UserProfile, UserRole } from '../types/jaspel';
import { PRESET_USERS, ROLE_PERMISSIONS } from '../services/auth';

interface AuthRoleModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
}

export const AuthRoleModal: React.FC<AuthRoleModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onSelectRole,
}) => {
  if (!isOpen) return null;

  const roles: { role: UserRole; title: string; subtitle: string; icon: any; color: string }[] = [
    {
      role: 'admin',
      title: 'Administrator / Direktur',
      subtitle: 'Akses Penuh: Hak edit Matriks Regulasi SK, Unggah Matriks, Edit Pegawai, Persetujuan Akhir & Kunci Periode.',
      icon: Crown,
      color: 'from-amber-500 to-amber-600 text-amber-500',
    },
    {
      role: 'manager',
      title: 'Manager (Kabag TU / Keuangan)',
      subtitle: 'Akses Manajerial: Atur Kehadiran (Aktif/Cuti), Edit Data Pegawai, Ajukan Draft Distribusi untuk Persetujuan Direktur.',
      icon: Briefcase,
      color: 'from-sky-500 to-sky-600 text-sky-500',
    },
    {
      role: 'employee',
      title: 'Pegawai / Staf Berhak',
      subtitle: 'Akses Personal: Pratinjau Slip Jasa Manajemen Pribadi, Cek Transparansi Alokasi, Unduh Slip & Laporan Sah.',
      icon: User,
      color: 'from-emerald-500 to-emerald-600 text-emerald-500',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 dark:from-slate-950 dark:to-slate-900 text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Profil &amp; Otorisasi Pengguna</h3>
              <p className="text-xs text-slate-400">Role-Based Access Control (RBAC) Rumah Sakit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Active User Banner */}
        <div className="p-5 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-bold flex items-center justify-center text-base shadow-sm ring-2 ring-teal-500/20 shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Sedang Aktif
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {currentUser.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {currentUser.title}
                </p>
              </div>
            </div>

            <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${ROLE_PERMISSIONS[currentUser.role].badgeColor}`}>
              {ROLE_PERMISSIONS[currentUser.role].roleLabel}
            </span>
          </div>
        </div>

        {/* Role Selector List */}
        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Pilih Hak Akses (Ganti Peran Pengguna):</span>
          </div>

          {roles.map((item) => {
            const isSelected = currentUser.role === item.role;
            const Icon = item.icon;
            const preset = PRESET_USERS[item.role];

            return (
              <button
                key={item.role}
                onClick={() => {
                  onSelectRole(item.role);
                  onClose();
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 group ${
                  isSelected
                    ? 'bg-teal-50/70 dark:bg-teal-950/30 border-teal-500/50 ring-1 ring-teal-500/30 shadow-sm'
                    : 'bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/80'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  isSelected 
                    ? 'bg-teal-600 text-white border-teal-500' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {item.title}
                    </h5>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-teal-600 dark:text-teal-400">
                        <Check className="w-3.5 h-3.5" />
                        <span>Aktif</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {item.subtitle}
                  </p>
                  <div className="mt-2 text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <span>Contoh Nama:</span>
                    <strong className="text-slate-700 dark:text-slate-300">{preset.name}</strong>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-teal-500" />
            <span>Hak akses melindungi perubahan regulasi dan data nominal.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
