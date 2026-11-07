import { 
  RegulationGroup, 
  Recipient, 
  CalculatedRecipient, 
  GroupAllocationResult, 
  DistributionSummary,
  ComplianceAuditReport,
  ComplianceIssue,
  ReportConfig,
  PeriodApprovalInfo
} from '../types/jaspel';

/**
 * Format a number into Indonesian Rupiah currency format.
 * e.g., 80143754 -> "Rp 80.143.754"
 */
export function formatRupiah(value: number, withPrefix = true): string {
  if (isNaN(value) || value === null || value === undefined) {
    return withPrefix ? 'Rp 0' : '0';
  }
  const rounded = Math.round(value);
  const formatted = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(rounded);
  
  return withPrefix ? `Rp ${formatted}` : formatted;
}

/**
 * Format percentage into Indonesian locale format.
 * e.g., 20.98 -> "20,98%"
 */
export function formatPercentage(value: number): string {
  if (isNaN(value) || value === null || value === undefined) return '0,00%';
  return `${value.toFixed(2).replace('.', ',')}%`;
}

/**
 * Clean and parse user currency input string to integer number.
 */
export function parseRupiahInput(input: string): number {
  if (!input) return 0;
  // Remove non-digit characters except minus
  const cleaned = input.replace(/[^\d]/g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Validates the sum of group percentages.
 * Returns sum and whether it equals 100% (within 0.05% margin for rounding).
 */
export function validateMatrixPercentage(groups: RegulationGroup[]): {
  totalPercentage: number;
  isValid: boolean;
  delta: number;
} {
  const sum = groups.reduce((acc, g) => acc + (Number(g.percentage) || 0), 0);
  const totalPercentage = Math.round(sum * 100) / 100;
  const delta = Math.round((100 - totalPercentage) * 100) / 100;
  const isValid = Math.abs(delta) < 0.05;

  return {
    totalPercentage,
    isValid,
    delta,
  };
}

/**
 * Automated Regulatory Compliance Engine
 * Validates proposed management fee distributions against the active regulatory matrix.
 * Flags discrepancies, deficits, surpluses, empty groups, and unassigned members.
 */
export function auditRegulatoryCompliance(
  groups: RegulationGroup[],
  recipients: Recipient[],
  totalFund: number,
  calculatedRecipients: CalculatedRecipient[]
): ComplianceAuditReport {
  const issues: ComplianceIssue[] = [];
  const { totalPercentage, isValid: isPercentageValid, delta } = validateMatrixPercentage(groups);

  // 1. Percentage check
  if (!isPercentageValid) {
    if (delta > 0) {
      issues.push({
        id: 'pct-under',
        title: 'Alokasi Matriks Kurang Dari 100%',
        description: `Total persentase kelompok baru mencapai ${formatPercentage(totalPercentage)}. Masih ada ${formatPercentage(delta)} dana belum teralokasi ke regulasi SK.`,
        severity: 'error',
        suggestedFix: 'Gunakan tombol "Seimbangkan Otomatis" atau sesuaikan persentase kelompok.',
      });
    } else {
      issues.push({
        id: 'pct-over',
        title: 'Alokasi Matriks Melebihi 100%',
        description: `Total persentase kelompok mencapai ${formatPercentage(totalPercentage)} (kelebihan ${formatPercentage(Math.abs(delta))}). Berisiko defisit anggaran.`,
        severity: 'error',
        suggestedFix: 'Kurangi persentase salah satu kelompok regulasi hingga total tepat 100,00%.',
      });
    }
  }

  // 2. Minimum Fund check
  if (totalFund <= 0) {
    issues.push({
      id: 'fund-zero',
      title: 'Nominal Dana Jasa Manajemen Kosong',
      description: 'Total anggaran dana jasa manajemen yang dimasukkan bernilai Rp 0.',
      severity: 'warning',
      suggestedFix: 'Tentukan pagu nominal anggaran jasa manajemen untuk periode ini.',
    });
  }

  // 3. Unassigned recipients check
  const groupIds = new Set(groups.map((g) => g.id));
  const unassignedRecipients = recipients.filter((r) => !groupIds.has(r.groupId));
  if (unassignedRecipients.length > 0) {
    issues.push({
      id: 'rec-unassigned',
      title: `${unassignedRecipients.length} Pegawai Belum Memiliki Kelompok Regulasi`,
      description: `Pegawai (${unassignedRecipients.map((r) => r.name).slice(0, 3).join(', ')}${unassignedRecipients.length > 3 ? '...' : ''}) terdaftar tetapi ID kelompok tidak ditemukan di matriks SK.`,
      severity: 'error',
      suggestedFix: 'Tetapkan kelompok regulasi yang valid melalui menu edit pegawai.',
    });
  }

  // 4. Empty active members check for non-pooled groups
  let emptyGroupsCount = 0;
  for (const group of groups) {
    if (group.percentage > 0) {
      const groupRecipients = recipients.filter((r) => r.groupId === group.id);
      const activeCount = groupRecipients.filter((r) => r.isActive).length;

      if (groupRecipients.length === 0 && !group.isSpecialGroup) {
        emptyGroupsCount++;
        issues.push({
          id: `grp-empty-${group.id}`,
          title: `Kelompok ${group.name} Tidak Memiliki Anggota`,
          description: `Porsi ${formatPercentage(group.percentage)} telah dialokasikan pada matriks, namun tidak ada satu pun pegawai yang terdaftar pada kelompok ini.`,
          severity: 'warning',
          groupId: group.id,
          suggestedFix: 'Daftarkan pegawai ke kelompok ini atau pindahkan persentasenya ke kelompok lain.',
        });
      } else if (activeCount === 0 && groupRecipients.length > 0 && !group.isSpecialGroup) {
        issues.push({
          id: `grp-inactive-${group.id}`,
          title: `Seluruh Anggota ${group.name} Berstatus Cuti / Non-Aktif`,
          description: `Terdapat ${groupRecipients.length} anggota terdaftar tetapi semuanya non-aktif. Dana kelompok tidak dapat didistribusikan.`,
          severity: 'warning',
          groupId: group.id,
          suggestedFix: 'Aktifkan minimal satu pegawai atau alihkan alokasi dana sementara.',
        });
      }
    }
  }

  // Calculate overall compliance score
  let score = 100;
  for (const issue of issues) {
    if (issue.severity === 'error') score -= 30;
    else if (issue.severity === 'warning') score -= 15;
    else if (issue.severity === 'info') score -= 5;
  }
  score = Math.max(0, Math.min(100, score));

  return {
    isCompliant: issues.filter((i) => i.severity === 'error').length === 0,
    score,
    issues,
    totalPercentage,
    unassignedRecipientsCount: unassignedRecipients.length,
    emptyGroupsCount,
    deficitOrSurplus: Math.round(delta * 100) / 100,
  };
}

/**
 * Core engine: calculate exact distribution based on total fund, groups, and recipients.
 */
export function calculateDistribution(
  totalFund: number,
  groups: RegulationGroup[],
  recipients: Recipient[],
  period: string = 'Oktober 2026',
  hospitalName: string = 'RSUD SIWA - KABUPATEN WAJO',
  reportConfig?: ReportConfig,
  approvalInfo?: PeriodApprovalInfo
): DistributionSummary {
  const calculatedRecipients: CalculatedRecipient[] = [];
  const groupAllocations: GroupAllocationResult[] = [];
  let totalAllocated = 0;

  for (const group of groups) {
    // Allocation for this regulation group
    const percentage = Number(group.percentage) || 0;
    const groupAllocatedAmount = Math.round((percentage / 100) * totalFund);
    totalAllocated += groupAllocatedAmount;

    // Filter recipients belonging to this group
    const groupRecipients = recipients.filter((r) => r.groupId === group.id);
    const activeRecipients = groupRecipients.filter((r) => r.isActive);
    const activeCount = activeRecipients.length;
    const totalCount = groupRecipients.length;

    let amountPerMember = 0;
    if (activeCount > 0) {
      amountPerMember = Math.round(groupAllocatedAmount / activeCount);
    } else if (group.isSpecialGroup && group.defaultMemberCount) {
      amountPerMember = Math.round(groupAllocatedAmount / group.defaultMemberCount);
    }

    // Allocate to each recipient
    for (const r of groupRecipients) {
      let recipientAmount = 0;
      if (r.isActive) {
        if (r.customSharePercentage && r.customSharePercentage > 0) {
          recipientAmount = Math.round((r.customSharePercentage / 100) * groupAllocatedAmount);
        } else {
          recipientAmount = amountPerMember;
        }
      }

      const calculated: CalculatedRecipient = {
        ...r,
        groupName: group.name,
        groupPercentage: group.percentage,
        allocatedAmount: recipientAmount,
      };

      calculatedRecipients.push(calculated);
    }

    groupAllocations.push({
      group,
      allocatedAmount: groupAllocatedAmount,
      activeMemberCount: activeCount,
      totalMemberCount: totalCount,
      amountPerMember,
      recipients: calculatedRecipients.filter((cr) => cr.groupId === group.id),
    });
  }

  const { totalPercentage } = validateMatrixPercentage(groups);
  const activeRecipientsCount = recipients.filter((r) => r.isActive).length;
  const complianceReport = auditRegulatoryCompliance(groups, recipients, totalFund, calculatedRecipients);

  return {
    totalFund,
    totalAllocated,
    difference: totalFund - totalAllocated,
    totalPercentage,
    totalRecipients: recipients.length,
    activeRecipients: activeRecipientsCount,
    groupAllocations,
    calculatedRecipients,
    period,
    hospitalName,
    reportConfig,
    approvalInfo: approvalInfo || { status: 'draft' },
    complianceReport,
  };
}

/**
 * Generate CSV text for download / export of official decree report.
 */
export function generateExportCSV(summary: DistributionSummary): string {
  const lines: string[] = [];
  lines.push(`DAFTAR PEMBAGIAN JASA MANAJEMEN - ${summary.hospitalName}`);
  lines.push(`PERIODE: ${summary.period}`);
  lines.push(`TOTAL DANA JASA MANAJEMEN: ${formatRupiah(summary.totalFund)}`);
  lines.push(`TOTAL DIALOKASIKAN: ${formatRupiah(summary.totalAllocated)}`);
  lines.push(`STATUS KEPATUHAN: ${summary.complianceReport.isCompliant ? '100% SESUAI REGULASI SK' : 'TERDAPAT ISU REGULASI'}`);
  lines.push('');
  lines.push('No,Kategori/Kelompok,Jabatan,Nama Penerima,Status,Porsi Kelompok (%),Nominal (Rp)');

  let counter = 1;
  for (const group of summary.groupAllocations) {
    for (const rec of group.recipients) {
      const status = rec.isActive ? 'Aktif' : 'Non-Aktif';
      lines.push(
        `${counter},"${group.group.name}","${rec.position}","${rec.name}","${status}","${formatPercentage(group.group.percentage)}","${rec.allocatedAmount}"`
      );
      counter++;
    }
  }

  return lines.join('\n');
}

/**
 * Generate JSON template of the regulatory matrix for upload / backup.
 */
export function exportRegulatoryMatrixJSON(groups: RegulationGroup[]): string {
  return JSON.stringify({
    version: '1.0',
    title: 'Matriks Regulasi SK Pembagian Jasa Manajemen RSUD Siwa',
    exportedAt: new Date().toISOString(),
    totalPercentage: groups.reduce((acc, g) => acc + (Number(g.percentage) || 0), 0),
    groups: groups.map((g) => ({
      id: g.id,
      name: g.name,
      category: g.category,
      percentage: g.percentage,
      description: g.description || '',
      defaultMemberCount: g.defaultMemberCount || 1,
      isSpecialGroup: Boolean(g.isSpecialGroup),
    })),
  }, null, 2);
}

/**
 * Parse an uploaded regulatory matrix file (supports JSON or CSV).
 */
export function parseRegulatoryMatrixFile(fileContent: string, isJson: boolean): RegulationGroup[] {
  if (isJson) {
    const parsed = JSON.parse(fileContent);
    const rawGroups = Array.isArray(parsed) ? parsed : (parsed.groups || []);
    if (!Array.isArray(rawGroups) || rawGroups.length === 0) {
      throw new Error('Format berkas JSON tidak memiliki daftar kelompok regulasi yang valid.');
    }
    return rawGroups.map((item: any, idx: number) => ({
      id: item.id || `custom_group_${Date.now()}_${idx}`,
      name: String(item.name || `Kelompok ${idx + 1}`).toUpperCase(),
      category: (item.category as any) || 'staf',
      percentage: Number(item.percentage) || 0,
      description: item.description || '',
      defaultMemberCount: Number(item.defaultMemberCount) || 1,
      isSpecialGroup: Boolean(item.isSpecialGroup),
    }));
  }

  // Parse CSV
  const lines = fileContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    throw new Error('Berkas CSV kosong atau tidak memiliki baris header.');
  }

  const groups: RegulationGroup[] = [];
  const header = lines[0].toLowerCase();
  const hasHeader = header.includes('nama') || header.includes('kelompok') || header.includes('persen');
  const startIdx = hasHeader ? 1 : 0;

  for (let i = startIdx; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.replace(/(^"|"$)/g, '').trim());
    if (cols.length >= 2) {
      const name = cols[0];
      const pct = parseFloat(cols[1].replace('%', '').replace(',', '.'));
      const cat = (cols[2] as any) || 'staf';
      const desc = cols[3] || '';
      if (name && !isNaN(pct)) {
        groups.push({
          id: name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          name: name.toUpperCase(),
          category: cat,
          percentage: pct,
          description: desc,
        });
      }
    }
  }

  if (groups.length === 0) {
    throw new Error('Tidak ada baris kelompok valid yang dapat diimpor dari berkas CSV.');
  }

  return groups;
}
