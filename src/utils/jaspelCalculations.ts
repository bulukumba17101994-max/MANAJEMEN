import { RegulationGroup, Recipient, CalculatedRecipient, GroupAllocationResult, DistributionSummary } from '../types/jaspel';

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
 * Core engine: calculate exact distribution based on total fund, groups, and recipients.
 */
export function calculateDistribution(
  totalFund: number,
  groups: RegulationGroup[],
  recipients: Recipient[],
  period: string = 'Oktober 2026',
  hospitalName: string = 'RSUD SIWA - KABUPATEN WAJO',
  reportConfig?: import('../types/jaspel').ReportConfig
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
  };
}

/**
 * Generate CSV text for download / export.
 */
export function generateExportCSV(summary: DistributionSummary): string {
  const lines: string[] = [];
  lines.push(`DAFTAR PEMBAGIAN JASA MANAJEMEN - ${summary.hospitalName}`);
  lines.push(`PERIODE: ${summary.period}`);
  lines.push(`TOTAL DANA JASA MANAJEMEN: ${formatRupiah(summary.totalFund)}`);
  lines.push(`TOTAL DIALOKASIKAN: ${formatRupiah(summary.totalAllocated)}`);
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
