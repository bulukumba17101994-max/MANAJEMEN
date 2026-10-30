import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatRupiah,
  formatPercentage,
  parseRupiahInput,
  validateMatrixPercentage,
  calculateDistribution,
} from './jaspelCalculations';
import {
  DEFAULT_REGULATION_GROUPS,
  DEFAULT_RECIPIENTS,
  DEFAULT_TOTAL_FUND,
} from './jaspelData';

test('validateMatrixPercentage validates that default groups sum to 100%', () => {
  const result = validateMatrixPercentage(DEFAULT_REGULATION_GROUPS);
  assert.equal(result.isValid, true);
  assert.equal(result.totalPercentage, 100);
  assert.equal(result.delta, 0);
});

test('formatRupiah formats currency correctly', () => {
  assert.equal(formatRupiah(80143754), 'Rp 80.143.754');
  assert.equal(formatRupiah(4203540), 'Rp 4.203.540');
  assert.equal(formatRupiah(0), 'Rp 0');
});

test('parseRupiahInput handles strings with symbols and decimals', () => {
  assert.equal(parseRupiahInput('Rp 80.143.754'), 80143754);
  assert.equal(parseRupiahInput('100.000.000'), 100000000);
  assert.equal(parseRupiahInput('50000'), 50000);
});

test('formatPercentage formats decimal with Indonesian comma', () => {
  assert.equal(formatPercentage(20.98), '20,98%');
  assert.equal(formatPercentage(100), '100,00%');
});

test('calculateDistribution correctly computes group and individual amounts matching baseline', () => {
  const summary = calculateDistribution(
    DEFAULT_TOTAL_FUND,
    DEFAULT_REGULATION_GROUPS,
    DEFAULT_RECIPIENTS
  );

  // Total fund should match
  assert.equal(summary.totalFund, 80143754);

  // Kabag/Kabid check: 20.98% of 80.143.754 = 16.814.160 / 4 = 4.203.540
  const kabagGroup = summary.groupAllocations.find((g) => g.group.id === 'kabag_kabid');
  assert.ok(kabagGroup);
  assert.equal(kabagGroup.allocatedAmount, 16814160);
  assert.equal(kabagGroup.activeMemberCount, 4);
  assert.equal(kabagGroup.amountPerMember, 4203540);

  // Kasubag/Kasie check: 28.59% of 80.143.754 = 22.913.099, 7 active = 3.273.300
  const kasubagGroup = summary.groupAllocations.find((g) => g.group.id === 'kasubag_kasie');
  assert.ok(kasubagGroup);
  assert.equal(kasubagGroup.allocatedAmount, 22913099);
  assert.equal(kasubagGroup.activeMemberCount, 7);
  assert.equal(kasubagGroup.amountPerMember, 3273300);

  // Bendahara Penerimaan check: 1.75% = 1.402.516
  const bendaharaPen = summary.groupAllocations.find((g) => g.group.id === 'bendahara_penerimaan');
  assert.ok(bendaharaPen);
  assert.equal(bendaharaPen.allocatedAmount, 1402516);

  // Bendahara Pengeluaran check: 2.00% = 1.602.875
  const bendaharaPeng = summary.groupAllocations.find((g) => g.group.id === 'bendahara_pengeluaran');
  assert.ok(bendaharaPeng);
  assert.equal(bendaharaPeng.allocatedAmount, 1602875);

  // Reski Eka Wahyuni khusus check: 8.50% = 6.812.219
  const khususRezki = summary.groupAllocations.find((g) => g.group.id === 'khusus_rezki');
  assert.ok(khususRezki);
  assert.equal(khususRezki.allocatedAmount, 6812219);

  // Pengelola (15 orang) check: 17.12% = 13.716.603
  const pengelolaGroup = summary.groupAllocations.find((g) => g.group.id === 'pengelola');
  assert.ok(pengelolaGroup);
  assert.equal(pengelolaGroup.allocatedAmount, 13716603);
});
