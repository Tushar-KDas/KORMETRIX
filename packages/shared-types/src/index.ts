/**
 * WorkForce 360 - Shared TypeScript Models & Interfaces
 * Universal types shared across Next.js Web, API, and Edge Functions
 */

// =============================================================================
// 1. IDENTITY, ROLES & PERMISSIONS
// =============================================================================

export type UserRole = 
  | 'PLATFORM_SUPER_ADMIN'
  | 'PLATFORM_SUPPORT'
  | 'COMPANY_OWNER'
  | 'COMPANY_ADMIN'
  | 'HR_ADMIN'
  | 'FINANCE_ADMIN'
  | 'DEPARTMENT_HEAD'
  | 'BRANCH_MANAGER'
  | 'TEAM_LEAD'
  | 'EMPLOYEE';

export type EmploymentStatus = 
  | 'PROBATION'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'ON_LEAVE'
  | 'NOTICE_PERIOD'
  | 'RESIGNED'
  | 'TERMINATED'
  | 'OFFBOARDED';

export type EmploymentType = 
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACT'
  | 'INTERN'
  | 'REMOTE'
  | 'SEASONAL';

export interface Profile {
  id: string; // matches auth.users.id
  email: string;
  fullName: string;
  fullNameBn?: string;
  phone?: string;
  avatarUrl?: string;
  isPlatformAdmin: boolean;
  mfaEnabled: boolean;
  preferredLanguage: 'bn' | 'en';
  preferredTheme: 'light' | 'dark' | 'system';
  createdAt: string;
  updatedAt: string;
}

export interface PlatformAdmin {
  id: string;
  userId: string;
  role: 'SUPER_ADMIN' | 'SUPPORT_STAFF' | 'BILLING_MANAGER';
  grantedBy: string;
  createdAt: string;
}

// =============================================================================
// 2. MULTI-TENANT ORGANIZATIONS & BRANCHES
// =============================================================================

export interface Organization {
  id: string;
  name: string;
  nameBn?: string;
  slug: string;
  code: string;
  logoUrl?: string;
  status: 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'ARCHIVED';
  subscriptionPlanId?: string;
  currency: string;
  timezone: string;
  fiscalYearStartMonth: number;
  country: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationBranch {
  id: string;
  organizationId: string;
  name: string;
  nameBn?: string;
  code: string;
  isHeadquarters: boolean;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  radiusMeters: number; // Geofence radius
  contactPhone?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  organizationId: string;
  branchId?: string;
  name: string;
  nameBn?: string;
  code: string;
  headEmployeeId?: string;
  budgetBDT?: number;
  createdAt: string;
}

export interface Designation {
  id: string;
  organizationId: string;
  departmentId?: string;
  title: string;
  titleBn?: string;
  level: number;
  minSalaryBDT?: number;
  maxSalaryBDT?: number;
  createdAt: string;
}

export interface OrganizationMembership {
  id: string;
  userId: string;
  organizationId: string;
  employeeId?: string;
  role: UserRole;
  departmentScope?: string[];
  branchScope?: string[];
  isActive: boolean;
  createdAt: string;
}

// =============================================================================
// 3. EMPLOYEES & LIFECYCLE
// =============================================================================

export interface Employee {
  id: string;
  organizationId: string;
  userId?: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  firstNameBn?: string;
  lastNameBn?: string;
  email: string;
  phone: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  joiningDate: string;
  confirmationDate?: string;
  employmentType: EmploymentType;
  status: EmploymentStatus;
  branchId: string;
  departmentId: string;
  designationId: string;
  reportingManagerId?: string;
  shiftId: string;
  photoUrl?: string;
  nidNumber?: string;
  passportNumber?: string;
  bloodGroup?: string;
  basicSalaryBDT: number;
  grossSalaryBDT: number;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// 4. ATTENDANCE & SHIFTS
// =============================================================================

export type AttendanceStatus = 'PRESENT' | 'LATE' | 'HALF_DAY' | 'ABSENT' | 'ON_LEAVE' | 'HOLIDAY' | 'WEEKLY_OFF';
export type VerificationMethod = 'GPS_GEOFENCE' | 'QR_CODE' | 'BIOMETRIC_DEVICE' | 'MANUAL_WEB' | 'OFFLINE_SYNC';

export interface Shift {
  id: string;
  organizationId: string;
  name: string;
  nameBn?: string;
  startTime: string; // '09:00:00'
  endTime: string;   // '18:00:00'
  gracePeriodMinutes: number; // e.g. 15
  halfDayHours: number;
  fullDayHours: number;
  isNightShift: boolean;
  weeklyOffDays: number[]; // [5, 6] for Friday/Saturday in Bangladesh
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  organizationId: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  shiftId: string;
  checkInTime?: string; // timestamptz
  checkOutTime?: string;
  status: AttendanceStatus;
  workingMinutes: number;
  overtimeMinutes: number;
  lateMinutes: number;
  earlyDepartureMinutes: number;
  checkInMethod: VerificationMethod;
  checkOutMethod?: VerificationMethod;
  checkInLatitude?: number;
  checkInLongitude?: number;
  checkInAccuracy?: number;
  isWithinGeofence: boolean;
  isOfflineSynced: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// 5. LEAVE MANAGEMENT & LEDGER
// =============================================================================

export type LeaveApprovalStatus = 'PENDING' | 'APPROVED_STAGE_1' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface LeaveType {
  id: string;
  organizationId: string;
  name: string;
  nameBn: string;
  code: 'ANNUAL' | 'CASUAL' | 'SICK' | 'MATERNITY' | 'PATERNITY' | 'SPECIAL' | 'UNPAID';
  annualAllocationDays: number;
  carryForwardMaxDays: number;
  isEncashable: boolean;
  requiresMedicalCertificateAfterDays?: number;
  isPaid: boolean;
  createdAt: string;
}

export interface LeaveBalance {
  id: string;
  organizationId: string;
  employeeId: string;
  leaveTypeId: string;
  fiscalYear: number;
  allocatedDays: number;
  usedDays: number;
  pendingDays: number;
  remainingDays: number;
  carriedOverDays: number;
  updatedAt: string;
}

export interface LeaveRequest {
  id: string;
  organizationId: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveApprovalStatus;
  currentStepOrder: number;
  attachmentUrl?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

// =============================================================================
// 6. PAYROLL, SALARY & TAX ENGINE (BANGLADESH)
// =============================================================================

export type PayrollRunStatus = 'DRAFT' | 'PREVIEW_GENERATED' | 'PENDING_APPROVAL' | 'APPROVED' | 'LOCKED' | 'PAID' | 'CANCELLED';

export interface PayrollPeriod {
  id: string;
  organizationId: string;
  title: string; // e.g. "April 2025 Payroll"
  month: number;
  year: number;
  startDate: string;
  endDate: string;
  workingDaysCount: number;
  isLocked: boolean;
  createdAt: string;
}

export interface PayrollRun {
  id: string;
  organizationId: string;
  periodId: string;
  status: PayrollRunStatus;
  totalGrossSalaryBDT: number;
  totalAllowancesBDT: number;
  totalDeductionsBDT: number;
  totalTaxBDT: number;
  totalNetPayableBDT: number;
  totalEmployeesProcessed: number;
  finalizedBy?: string;
  finalizedAt?: string;
  lockedAt?: string;
  paymentMethod?: 'BANK_TRANSFER' | 'BKASH' | 'CASH';
  paymentReference?: string;
  createdAt: string;
}

export interface PayslipItem {
  id: string;
  payrollRunId: string;
  employeeId: string;
  organizationId: string;
  basicSalaryBDT: number;
  houseRentBDT: number;
  medicalAllowanceBDT: number;
  conveyanceAllowanceBDT: number;
  festivalBonusBDT: number;
  overtimeHours: number;
  overtimePayBDT: number;
  grossSalaryBDT: number;
  taxDeductionBDT: number;
  providentFundBDT: number;
  loanDeductionBDT: number;
  unpaidLeaveDeductionBDT: number;
  totalDeductionsBDT: number;
  netPayableBDT: number;
  paymentStatus: 'UNPAID' | 'PAID';
  bankAccountNumber?: string;
  bankName?: string;
  generatedPdfUrl?: string;
  createdAt: string;
}

// =============================================================================
// 7. PROJECTS, TASKS & PERFORMANCE
// =============================================================================

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'BLOCKED';

export interface Task {
  id: string;
  organizationId: string;
  projectId?: string;
  title: string;
  description?: string;
  assignedToEmployeeId: string;
  createdById: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline?: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
  checklistCount?: number;
  checklistCompletedCount?: number;
  createdAt: string;
}

// =============================================================================
// 8. REMOTE CONFIGURATION ENGINE & DEVICE CONTROLS
// =============================================================================

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  isEnabledGlobally: boolean;
  targetOrganizations?: string[];
  targetRoles?: UserRole[];
  rolloutPercentage: number;
  requiredMinVersion?: string;
}

export interface RemoteConfig {
  version: number;
  publishedAt: string;
  publishedBy: string;
  appSettings: {
    maintenanceMode: boolean;
    maintenanceMessage?: string;
    minimumSupportedVersion: string;
    latestAppVersion: string;
    forceUpdate: boolean;
    updateUrl?: string;
  };
  features: Record<string, boolean>;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    darkThemeDefault: boolean;
    companyLogoUrl?: string;
  };
  mobileNavigation: {
    visibleTabs: ('home' | 'attendance' | 'work' | 'leave' | 'profile')[];
    quickActionOrder: string[];
  };
}

// =============================================================================
// 9. AUDIT LOGGING & SECURITY
// =============================================================================

export interface AuditLog {
  id: string;
  organizationId?: string;
  actorUserId: string;
  actorEmail?: string;
  action: string; // e.g. "PAYROLL_FINALIZED", "LEAVE_APPROVED", "EMPLOYEE_CREATED"
  resourceType: string;
  resourceId: string;
  ipAddress?: string;
  userAgent?: string;
  beforeSnapshot?: Record<string, any>;
  afterSnapshot?: Record<string, any>;
  createdAt: string;
}
