/**
 * WorkForce 360 - Universal API Contracts & Standardized Response Interfaces
 */

export interface ApiPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    correlationId?: string;
    pagination?: ApiPagination;
  };
}

export type ApiErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN_ORGANIZATION_MISMATCH'
  | 'FORBIDDEN_INSUFFICIENT_ROLE'
  | 'OUT_OF_SCOPE'
  | 'RESOURCE_NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'DUPLICATE_PUNCH'
  | 'OUTSIDE_GEOFENCE'
  | 'PAYROLL_ALREADY_LOCKED'
  | 'INSUFFICIENT_LEAVE_BALANCE'
  | 'REMOTE_CONFIG_INVALID_VERSION'
  | 'SUBSCRIPTION_LIMIT_REACHED'
  | 'ORGANIZATION_SUSPENDED'
  | 'INTERNAL_SERVER_ERROR';

export function successResponse<T>(data: T, pagination?: ApiPagination): ApiResponse<T> {
  return {
    success: true,
    data,
    metadata: {
      timestamp: new Date().toISOString(),
      pagination,
    },
  };
}

export function errorResponse(code: ApiErrorCode, message: string, details?: any): ApiResponse<null> {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    metadata: {
      timestamp: new Date().toISOString(),
    },
  };
}
