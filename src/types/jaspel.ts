export type CategoryTier = 
  | 'struktural' 
  | 'keuangan' 
  | 'staf' 
  | 'unit' 
  | 'khusus' 
  | 'pengelola';

export type UserRole = 'admin' | 'manager' | 'employee';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  title: string;
}

export type PeriodApprovalStatus = 'draft' | 'pending_approval' | 'approved';

export interface PeriodApprovalInfo {
  status: PeriodApprovalStatus;
  submittedBy?: string;
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export type ComplianceSeverity = 'error' | 'warning' | 'info';

export interface ComplianceIssue {
  id: string;
  title: string;
  description: string;
  severity: ComplianceSeverity;
  groupId?: string;
  suggestedFix?: string;
}

export interface ComplianceAuditReport {
  isCompliant: boolean;
  score: number; // 0 - 100%
  issues: ComplianceIssue[];
  totalPercentage: number;
  unassignedRecipientsCount: number;
  emptyGroupsCount: number;
  deficitOrSurplus: number;
}

export interface RegulationGroup {
  id: string;
  name: string;
  category: CategoryTier;
  percentage: number; // e.g. 20.98 for 20.98%
  description?: string;
  defaultMemberCount?: number;
  isSpecialGroup?: boolean; // For pooled groups like Pengelola (15 orang) or individual specific
  maxCapPercentage?: number;
  minFloorPercentage?: number;
}

export interface Recipient {
  id: string;
  groupId: string;
  name: string;
  position: string; // e.g. "KABAG", "KASUBAG PERENCANAAN", "BENDAHARA PENERIMAAN"
  isActive: boolean; // e.g. RESKI YULIANTI & NURHIDAYAT are registered but inactive (0) in current period
  nip?: string;
  bankAccount?: string;
  customSharePercentage?: number; // Optional override if non-uniform split within group
  notes?: string;
}

export interface GroupAllocationResult {
  group: RegulationGroup;
  allocatedAmount: number;
  activeMemberCount: number;
  totalMemberCount: number;
  amountPerMember: number;
  recipients: CalculatedRecipient[];
}

export interface CalculatedRecipient extends Recipient {
  groupName: string;
  groupPercentage: number;
  allocatedAmount: number;
}

export interface Signatory {
  id: string;
  role: string; // e.g. "Ketua Tim Pengelola Jaspel"
  name: string; // e.g. "TIM PENGELOLA JASPEL"
  nip?: string;
}

export interface ReportConfig {
  showSignatureColumn: boolean; // toggle whether table has signature column
  showApprovalBlock: boolean; // toggle whether bottom approval/signatory block is shown
  documentCity: string; // e.g. "Siwa"
  documentDate: string; // e.g. "30 Oktober 2026"
  signatories: Signatory[];
}

export interface PeriodArchive {
  id: string; // e.g. "2026-10"
  year: number;
  month: number; // 1-12
  label: string; // e.g. "Oktober 2026"
  savedAt: string;
  totalFund: number;
  groups: RegulationGroup[];
  recipients: Recipient[];
  reportConfig?: ReportConfig;
  approvalInfo?: PeriodApprovalInfo;
  notes?: string;
}

export interface DistributionSummary {
  totalFund: number;
  totalAllocated: number;
  difference: number;
  totalPercentage: number;
  totalRecipients: number;
  activeRecipients: number;
  groupAllocations: GroupAllocationResult[];
  calculatedRecipients: CalculatedRecipient[];
  period: string; // e.g. "Oktober 2026"
  hospitalName: string;
  reportConfig?: ReportConfig;
  approvalInfo?: PeriodApprovalInfo;
  complianceReport: ComplianceAuditReport;
}
