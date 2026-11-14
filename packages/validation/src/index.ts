/**
 * WorkForce 360 - Enterprise Validation Schemas (Zod)
 * Input Sanitization, Contract Guarantees, and Domain Invariants
 */

import { z } from 'zod';

// =============================================================================
// 1. AUTH & ONBOARDING SCHEMAS
// =============================================================================

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid work email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  rememberMe: z.boolean().default(false),
});

export const organizationCreationSchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters').max(100),
  nameBn: z.string().optional(),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric lowercase with hyphens'),
  code: z.string().min(2).max(10).toUpperCase(),
  currency: z.string().default('BDT'),
  timezone: z.string().default('Asia/Dhaka'),
  contactPhone: z.string().regex(/^\+?880?1[3-9]\d{8}$/, 'Valid Bangladesh phone number required (+8801XXXXXXXXX)'),
  contactEmail: z.string().email(),
  headquartersAddress: z.string().min(5),
});

// =============================================================================
// 2. EMPLOYEE LIFECYCLE SCHEMAS
// =============================================================================

export const employeeCreateSchema = z.object({
  organizationId: z.string().uuid(),
  employeeCode: z.string().min(2).max(20),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  firstNameBn: z.string().optional(),
  lastNameBn: z.string().optional(),
  email: z.string().email('Valid corporate email required'),
  phone: z.string().min(10, 'Valid contact number required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  joiningDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'REMOTE', 'SEASONAL']),
  branchId: z.string().uuid(),
  departmentId: z.string().uuid(),
  designationId: z.string().uuid(),
  reportingManagerId: z.string().uuid().optional(),
  shiftId: z.string().uuid(),
  basicSalaryBDT: z.number().nonnegative('Basic salary must be non-negative'),
  grossSalaryBDT: z.number().positive('Gross salary must be positive'),
  nidNumber: z.string().optional(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
});

// =============================================================================
// 3. ATTENDANCE & GEOFENCING SCHEMAS
// =============================================================================

export const attendanceCheckInSchema = z.object({
  organizationId: z.string().uuid(),
  employeeId: z.string().uuid(),
  shiftId: z.string().uuid(),
  timestamp: z.string().datetime(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracyMeters: z.number().nonnegative(),
  method: z.enum(['GPS_GEOFENCE', 'QR_CODE', 'BIOMETRIC_DEVICE', 'MANUAL_WEB', 'OFFLINE_SYNC']),
  idempotencyKey: z.string().uuid(),
  notes: z.string().max(250).optional(),
});

export const attendanceCorrectionSchema = z.object({
  attendanceRecordId: z.string().uuid(),
  requestedCheckInTime: z.string().datetime(),
  requestedCheckOutTime: z.string().datetime(),
  reason: z.string().min(10, 'Please provide a detailed reason for the correction').max(500),
});

// =============================================================================
// 4. LEAVE SCHEMAS
// =============================================================================

export const leaveRequestSchema = z.object({
  organizationId: z.string().uuid(),
  employeeId: z.string().uuid(),
  leaveTypeId: z.string().uuid(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  reason: z.string().min(5, 'Reason must be at least 5 characters').max(500),
  attachmentUrl: z.string().url().optional(),
}).refine(data => data.endDate >= data.startDate, {
  message: 'End date cannot precede start date',
  path: ['endDate'],
});

// =============================================================================
// 5. PAYROLL SCHEMAS
// =============================================================================

export const payrollCalculationSchema = z.object({
  organizationId: z.string().uuid(),
  periodMonth: z.number().min(1).max(12),
  periodYear: z.number().min(2020).max(2100),
  employeeIds: z.array(z.string().uuid()).optional(), // empty means whole org
  dryRun: z.boolean().default(false),
});

export const payrollFinalizeSchema = z.object({
  payrollRunId: z.string().uuid(),
  approvalNotes: z.string().optional(),
});

// =============================================================================
// 6. APPROVAL ENGINE SCHEMAS
// =============================================================================

export const approvalActionSchema = z.object({
  instanceId: z.string().uuid(),
  action: z.enum(['APPROVE', 'REJECT', 'REQUEST_CHANGES', 'CANCEL']),
  comments: z.string().max(500).optional(),
});

// =============================================================================
// 7. REMOTE CONFIG & FEATURE FLAG SCHEMAS
// =============================================================================

export const remoteConfigPublishSchema = z.object({
  appSettings: z.object({
    maintenanceMode: z.boolean(),
    maintenanceMessage: z.string().optional(),
    minimumSupportedVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
    latestAppVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
    forceUpdate: z.boolean(),
    updateUrl: z.string().url().optional(),
  }),
  features: z.record(z.string(), z.boolean()),
  theme: z.object({
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    darkThemeDefault: z.boolean(),
    companyLogoUrl: z.string().url().optional(),
  }),
  mobileNavigation: z.object({
    visibleTabs: z.array(z.enum(['home', 'attendance', 'work', 'leave', 'profile'])).min(3),
    quickActionOrder: z.array(z.string()),
  }),
});
