/**
 * WorkForce 360 - Automated Test Suite for Core Packages & Business Rules
 */

const assert = require('assert');
const { formatBDT } = require('../packages/design-tokens/dist/index.js');
const { hasPermission, canAccessEmployee, canViewPayslip } = require('../packages/permission-engine/dist/index.js');
const { employeeCreateSchema, attendanceCheckInSchema, leaveRequestSchema } = require('../packages/validation/dist/index.js');

console.log('====================================================');
console.log('RUNNING WORKFORCE 360 CORE PACKAGES TEST SUITE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] ${name}: ${err.message}`);
    process.exitCode = 1;
  }
}

// 1. Bangladesh Currency Formatting Tests
test('FormatBDT formats amounts correctly in Bangladesh style', () => {
  assert.strictEqual(formatBDT(245000), '৳ 2,45,000');
  assert.strictEqual(formatBDT(18500), '৳ 18,500');
  assert.strictEqual(formatBDT(10000000), '৳ 1,00,00,000');
});

// 2. Permission Engine Tests
test('Platform Super Admin has global management permissions', () => {
  assert.strictEqual(hasPermission('PLATFORM_SUPER_ADMIN', 'platform:manage_organizations'), true);
  assert.strictEqual(hasPermission('PLATFORM_SUPER_ADMIN', 'platform:publish_remote_config'), true);
  assert.strictEqual(hasPermission('EMPLOYEE', 'platform:publish_remote_config'), false);
});

test('Company Admin can manage company employees and payroll', () => {
  assert.strictEqual(hasPermission('COMPANY_ADMIN', 'employee:create'), true);
  assert.strictEqual(hasPermission('COMPANY_ADMIN', 'payroll:finalize_and_lock'), true);
  assert.strictEqual(hasPermission('EMPLOYEE', 'payroll:finalize_and_lock'), false);
});

test('Employee can only mark own attendance and view own payslip', () => {
  assert.strictEqual(hasPermission('EMPLOYEE', 'attendance:mark_own'), true);
  assert.strictEqual(hasPermission('EMPLOYEE', 'payroll:view_own_payslip'), true);
  assert.strictEqual(hasPermission('EMPLOYEE', 'payroll:view_all'), false);
});

// 3. Multi-Tenant Scoping Isolation Tests
test('Cross-tenant employee access is strictly forbidden', () => {
  const membershipOrgA = {
    id: 'mem-1',
    userId: 'user-admin-a',
    organizationId: 'org-A',
    role: 'COMPANY_ADMIN',
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  const employeeOrgB = {
    id: 'emp-b',
    organizationId: 'org-B',
    employeeCode: 'EMP-001',
    firstName: 'Other',
    lastName: 'User',
    email: 'other@org-b.com',
    phone: '01700000000',
    gender: 'MALE',
    joiningDate: '2024-01-01',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    branchId: 'branch-b',
    departmentId: 'dept-b',
    designationId: 'desig-b',
    shiftId: 'shift-b',
    basicSalaryBDT: 30000,
    grossSalaryBDT: 60000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const allowed = canAccessEmployee(membershipOrgA, null, employeeOrgB);
  assert.strictEqual(allowed, false, 'Admin of Org A should NEVER access Org B employees');
});

// 4. Confidential Payslip Access Guard
test('Employees cannot access another employee private payslip', () => {
  const membershipEmp = {
    id: 'mem-2',
    userId: 'user-emp-ahmed',
    organizationId: 'org-A',
    role: 'EMPLOYEE',
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  // Ahmed viewing his own payslip -> ALLOWED
  const selfAccess = canViewPayslip(membershipEmp, 'user-emp-ahmed', 'user-emp-ahmed');
  assert.strictEqual(selfAccess, true);

  // Ahmed attempting to view Sarah's payslip -> FORBIDDEN
  const otherAccess = canViewPayslip(membershipEmp, 'user-emp-ahmed', 'user-emp-sarah');
  assert.strictEqual(otherAccess, false, 'Employee must never view another employee payslip');
});

// 5. Validation Schema Invariants
test('Attendance check-in schema validates valid coordinates', () => {
  const validPunch = {
    organizationId: 'b0000000-0000-0000-0000-000000000001',
    employeeId: '30000000-0000-0000-0000-000000000002',
    shiftId: '10000000-0000-0000-0000-000000000001',
    timestamp: new Date().toISOString(),
    latitude: 23.7937,
    longitude: 90.4048,
    accuracyMeters: 12.5,
    method: 'GPS_GEOFENCE',
    idempotencyKey: 'c0000000-0000-0000-0000-000000000099',
    notes: 'Regular check-in at Banani HQ',
  };

  const result = attendanceCheckInSchema.safeParse(validPunch);
  assert.strictEqual(result.success, true);
});

test('Leave request schema rejects end date earlier than start date', () => {
  const invalidLeave = {
    organizationId: 'b0000000-0000-0000-0000-000000000001',
    employeeId: '30000000-0000-0000-0000-000000000002',
    leaveTypeId: '20000000-0000-0000-0000-000000000001',
    startDate: '2025-05-10',
    endDate: '2025-05-02', // Invalid! Before start date
    reason: 'Vacation',
  };

  const result = leaveRequestSchema.safeParse(invalidLeave);
  assert.strictEqual(result.success, false);
});

console.log(`\n====================================================`);
console.log(`TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
console.log('====================================================\n');
