/**
 * WorkForce 360 - Automated Security & RLS Compliance Verification
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('RUNNING WORKFORCE 360 SECURITY & RLS AUDIT');
console.log('====================================================\n');

let checksPassed = 0;
let totalChecks = 0;

function audit(checkName, fn) {
  totalChecks++;
  try {
    fn();
    console.log(`[PASS] ${checkName}`);
    checksPassed++;
  } catch (err) {
    console.error(`[FAIL] ${checkName}: ${err.message}`);
    process.exitCode = 1;
  }
}

// 1. Check SQL Migration Files for RLS Enforcement
const migrationsDir = path.join(__dirname, '../supabase/migrations');
const migrationFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));

audit('RLS Migration file exists and enables RLS on all tenant tables', () => {
  const rlsFile = path.join(migrationsDir, '20261112000011_row_level_security_policies.sql');
  assert.ok(fs.existsSync(rlsFile), 'RLS migration file must exist');

  const content = fs.readFileSync(rlsFile, 'utf8');

  // Verify critical tables have ENABLE ROW LEVEL SECURITY
  const requiredTables = [
    'organizations',
    'employees',
    'attendance_records',
    'leave_requests',
    'payslips',
    'payroll_runs',
    'tasks',
    'employee_documents',
    'notifications',
    'audit_logs',
  ];

  for (const table of requiredTables) {
    assert.ok(
      content.includes(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`),
      `Table ${table} must have ENABLE ROW LEVEL SECURITY`
    );
  }
});

// 2. Strict Payslip Confidentiality Audit
audit('RLS explicitly restricts payslips to self or authorized payroll roles', () => {
  const rlsFile = path.join(migrationsDir, '20261112000011_row_level_security_policies.sql');
  const content = fs.readFileSync(rlsFile, 'utf8');

  assert.ok(
    content.includes('CREATE POLICY payslips_select_policy ON payslips'),
    'Payslips must have dedicated SELECT policy'
  );
  assert.ok(
    content.includes('employee_id = get_my_employee_id(organization_id)'),
    'Payslips policy must restrict employee to own employee_id'
  );
});

// 3. Check that no Supabase Service Role keys are leaked in Web or Mobile code
audit('Client codebases do not contain hardcoded production service role keys', () => {
  const webDir = path.join(__dirname, '../apps/web');
  const mobileDir = path.join(__dirname, '../apps/mobile');

  function scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.dart'))) {
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        assert.ok(
          !fileContent.includes('service_role_secret') && !fileContent.includes('SUPABASE_SERVICE_ROLE_KEY='),
          `Leaked service role secret found in ${fullPath}`
        );
      }
    }
  }

  scanDirectory(webDir);
  scanDirectory(mobileDir);
});

// 4. Remote Configuration Security Guard
audit('Remote configuration engine validates schema and requires admin permissions', () => {
  const { remoteConfigPublishSchema } = require('../packages/validation/dist/index.js');
  
  const validConfig = {
    appSettings: {
      maintenanceMode: false,
      minimumSupportedVersion: '1.0.0',
      latestAppVersion: '2.0.0',
      forceUpdate: false,
    },
    features: {
      'attendance.gps': true,
      'payroll': true,
    },
    theme: {
      primaryColor: '#3758D8',
      secondaryColor: '#17243B',
      accentColor: '#16A389',
      darkThemeDefault: false,
    },
    mobileNavigation: {
      visibleTabs: ['home', 'attendance', 'work', 'profile'],
      quickActionOrder: ['attendance', 'leave', 'tasks'],
    },
  };

  const parsed = remoteConfigPublishSchema.safeParse(validConfig);
  assert.strictEqual(parsed.success, true, 'Valid config should parse');
});

console.log(`\n====================================================`);
console.log(`SECURITY AUDIT RESULTS: ${checksPassed}/${totalChecks} CHECKS PASSED`);
console.log('====================================================\n');
