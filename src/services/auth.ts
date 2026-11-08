import { UserProfile, UserRole } from '../types/jaspel';

export const DEFAULT_ADMIN_USER: UserProfile = {
  uid: 'usr_admin_direktur',
  name: 'dr. H. Armin, M.Kes',
  title: 'Direktur RSUD Siwa / Administrator SK',
  role: 'admin',
  email: 'direktur.rsudsiwa@wajo.go.id',
  avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
};

export const PRESET_USERS: Record<UserRole, UserProfile> = {
  admin: DEFAULT_ADMIN_USER,
  manager: {
    uid: 'usr_manager_kabag',
    name: 'Hj. Sukrawati, S.ST',
    title: 'Kepala Bagian Tata Usaha (Manager)',
    role: 'manager',
    email: 'sukrawati.tu@rsudsiwa.id',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  employee: {
    uid: 'usr_employee_staff',
    name: 'Laetobdo Sali, S.Kep., Ns',
    title: 'Pegawai / Staf RSUD Siwa',
    role: 'employee',
    email: 'laetobdo.sali@rsudsiwa.id',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
};

export const ROLE_PERMISSIONS = {
  admin: {
    canEditMatrix: true,
    canUploadMatrix: true,
    canEditEmployees: true,
    canChangeAttendance: true,
    canEditSignatories: true,
    canSubmitPeriod: true,
    canApprovePeriod: true,
    canLockPeriod: true,
    canUnlockPeriod: true,
    canSaveCloud: true,
    canDeletePeriod: true,
    roleLabel: 'Administrator (Akses Penuh)',
    badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  },
  manager: {
    canEditMatrix: true,
    canUploadMatrix: true,
    canEditEmployees: true,
    canChangeAttendance: true,
    canEditSignatories: true,
    canSubmitPeriod: true,
    canApprovePeriod: true,
    canLockPeriod: true,
    canUnlockPeriod: true,
    canSaveCloud: true,
    canDeletePeriod: true,
    roleLabel: 'Administrator (Akses Penuh)',
    badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  },
  employee: {
    canEditMatrix: true,
    canUploadMatrix: true,
    canEditEmployees: true,
    canChangeAttendance: true,
    canEditSignatories: true,
    canSubmitPeriod: true,
    canApprovePeriod: true,
    canLockPeriod: true,
    canUnlockPeriod: true,
    canSaveCloud: true,
    canDeletePeriod: true,
    roleLabel: 'Administrator (Akses Penuh)',
    badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  },
};
