/**
 * WorkForce 360 - Enterprise Permission Engine
 * Strict Multi-Tenant RBAC, Scoping & Authorization Policies
 */

import { UserRole, Employee, OrganizationMembership } from '@workforce360/shared-types';

export type ActionName =
  // Platform Level
  | 'platform:manage_organizations'
  | 'platform:manage_subscriptions'
  | 'platform:publish_remote_config'
  | 'platform:view_system_health'
  | 'platform:view_audit_logs'
  // Organization Level
  | 'org:view_settings'
  | 'org:manage_settings'
  | 'org:manage_branches'
  | 'org:manage_departments'
  | 'org:publish_config_override'
  // Employee Lifecycle
  | 'employee:view_all'
  | 'employee:view_team'
  | 'employee:create'
  | 'employee:edit'
  | 'employee:terminate'
  | 'employee:view_profile'
  // Attendance
  | 'attendance:mark_own'
  | 'attendance:view_all'
  | 'attendance:view_team'
  | 'attendance:correct_request'
  | 'attendance:approve_correction'
  // Leave
  | 'leave:apply'
  | 'leave:view_own'
  | 'leave:view_team'
  | 'leave:view_all'
  | 'leave:approve_level_1'
  | 'leave:approve_level_2'
  // Payroll
  | 'payroll:view_own_payslip'
  | 'payroll:view_all'
  | 'payroll:create_run'
  | 'payroll:finalize_and_lock'
  | 'payroll:disburse'
  // Tasks & Projects
  | 'task:create'
  | 'task:assign'
  | 'task:complete_own'
  | 'task:view_all'
  // Expenses
  | 'expense:submit'
  | 'expense:approve'
  | 'expense:view_all'
  // Reports
  | 'reports:view_org'
  | 'reports:view_team'
  | 'reports:export';

/**
 * Role Permission Definition
 */
const ROLE_PERMISSIONS: Record<UserRole, ActionName[]> = {
  PLATFORM_SUPER_ADMIN: [
    'platform:manage_organizations',
    'platform:manage_subscriptions',
    'platform:publish_remote_config',
    'platform:view_system_health',
    'platform:view_audit_logs',
    'reports:view_org',
    'reports:export',
  ],
  PLATFORM_SUPPORT: [
    'platform:view_system_health',
    'platform:view_audit_logs',
  ],
  COMPANY_OWNER: [
    'org:view_settings',
    'org:manage_settings',
    'org:manage_branches',
    'org:manage_departments',
    'org:publish_config_override',
    'employee:view_all',
    'employee:create',
    'employee:edit',
    'employee:terminate',
    'employee:view_profile',
    'attendance:mark_own',
    'attendance:view_all',
    'attendance:approve_correction',
    'leave:apply',
    'leave:view_own',
    'leave:view_all',
    'leave:approve_level_1',
    'leave:approve_level_2',
    'payroll:view_own_payslip',
    'payroll:view_all',
    'payroll:create_run',
    'payroll:finalize_and_lock',
    'payroll:disburse',
    'task:create',
    'task:assign',
    'task:complete_own',
    'task:view_all',
    'expense:submit',
    'expense:approve',
    'expense:view_all',
    'reports:view_org',
    'reports:export',
  ],
  COMPANY_ADMIN: [
    'org:view_settings',
    'org:manage_branches',
    'org:manage_departments',
    'employee:view_all',
    'employee:create',
    'employee:edit',
    'employee:terminate',
    'employee:view_profile',
    'attendance:mark_own',
    'attendance:view_all',
    'attendance:approve_correction',
    'leave:apply',
    'leave:view_own',
    'leave:view_all',
    'leave:approve_level_1',
    'leave:approve_level_2',
    'payroll:view_own_payslip',
    'payroll:view_all',
    'payroll:create_run',
    'payroll:finalize_and_lock',
    'payroll:disburse',
    'task:create',
    'task:assign',
    'task:complete_own',
    'task:view_all',
    'expense:submit',
    'expense:approve',
    'expense:view_all',
    'reports:view_org',
    'reports:export',
  ],
  HR_ADMIN: [
    'employee:view_all',
    'employee:create',
    'employee:edit',
    'employee:terminate',
    'employee:view_profile',
    'attendance:mark_own',
    'attendance:view_all',
    'attendance:approve_correction',
    'leave:apply',
    'leave:view_own',
    'leave:view_all',
    'leave:approve_level_2',
    'payroll:view_own_payslip',
    'payroll:view_all',
    'task:create',
    'task:assign',
    'task:complete_own',
    'expense:submit',
    'reports:view_org',
    'reports:export',
  ],
  FINANCE_ADMIN: [
    'payroll:view_own_payslip',
    'payroll:view_all',
    'payroll:create_run',
    'payroll:finalize_and_lock',
    'payroll:disburse',
    'expense:view_all',
    'expense:approve',
    'reports:view_org',
    'reports:export',
    'attendance:mark_own',
    'leave:apply',
    'leave:view_own',
  ],
  DEPARTMENT_HEAD: [
    'employee:view_team',
    'employee:view_profile',
    'attendance:mark_own',
    'attendance:view_team',
    'attendance:approve_correction',
    'leave:apply',
    'leave:view_own',
    'leave:view_team',
    'leave:approve_level_1',
    'payroll:view_own_payslip',
    'task:create',
    'task:assign',
    'task:complete_own',
    'expense:submit',
    'expense:approve',
    'reports:view_team',
  ],
  BRANCH_MANAGER: [
    'employee:view_team',
    'employee:view_profile',
    'attendance:mark_own',
    'attendance:view_team',
    'attendance:approve_correction',
    'leave:apply',
    'leave:view_own',
    'leave:view_team',
    'leave:approve_level_1',
    'payroll:view_own_payslip',
    'task:create',
    'task:assign',
    'task:complete_own',
    'expense:submit',
    'expense:approve',
    'reports:view_team',
  ],
  TEAM_LEAD: [
    'employee:view_team',
    'employee:view_profile',
    'attendance:mark_own',
    'attendance:view_team',
    'leave:apply',
    'leave:view_own',
    'leave:view_team',
    'leave:approve_level_1',
    'payroll:view_own_payslip',
    'task:create',
    'task:assign',
    'task:complete_own',
    'expense:submit',
  ],
  EMPLOYEE: [
    'attendance:mark_own',
    'attendance:correct_request',
    'leave:apply',
    'leave:view_own',
    'payroll:view_own_payslip',
    'task:complete_own',
    'expense:submit',
  ],
};

/**
 * Checks if a membership role has permission for a specific action
 */
export function hasPermission(role: UserRole, action: ActionName): boolean {
  const allowed = ROLE_PERMISSIONS[role];
  if (!allowed) return false;
  return allowed.includes(action);
}

/**
 * Validates whether an actor has scoping authorization to access or modify a target employee's data
 */
export function canAccessEmployee(
  membership: OrganizationMembership,
  actorEmployee: Employee | null,
  targetEmployee: Employee
): boolean {
  // 1. Cross-organization boundary is strictly forbidden
  if (membership.organizationId !== targetEmployee.organizationId) {
    return false;
  }

  // 2. Global Company Admins & HR Admins have organization-wide access
  if (
    membership.role === 'COMPANY_OWNER' ||
    membership.role === 'COMPANY_ADMIN' ||
    membership.role === 'HR_ADMIN'
  ) {
    return true;
  }

  // 3. Employee can always access their own record
  if (actorEmployee && actorEmployee.id === targetEmployee.id) {
    return true;
  }

  // 4. Branch Manager scope check
  if (membership.role === 'BRANCH_MANAGER') {
    if (membership.branchScope && membership.branchScope.length > 0) {
      return membership.branchScope.includes(targetEmployee.branchId);
    }
    return actorEmployee?.branchId === targetEmployee.branchId;
  }

  // 5. Department Head scope check
  if (membership.role === 'DEPARTMENT_HEAD') {
    if (membership.departmentScope && membership.departmentScope.length > 0) {
      return membership.departmentScope.includes(targetEmployee.departmentId);
    }
    return actorEmployee?.departmentId === targetEmployee.departmentId;
  }

  // 6. Direct reporting manager check
  if (actorEmployee && targetEmployee.reportingManagerId === actorEmployee.id) {
    return true;
  }

  return false;
}

/**
 * Strict Payslip Access Guard:
 * Only the employee themselves, or Company Owner, Admin, or authorized Finance Admin can view a payslip.
 */
export function canViewPayslip(
  membership: OrganizationMembership,
  viewerUserId: string,
  targetEmployeeUserId?: string
): boolean {
  // Self check
  if (targetEmployeeUserId && viewerUserId === targetEmployeeUserId) {
    return true;
  }

  // Role check within same organization
  return (
    membership.role === 'COMPANY_OWNER' ||
    membership.role === 'COMPANY_ADMIN' ||
    membership.role === 'FINANCE_ADMIN'
  );
}
