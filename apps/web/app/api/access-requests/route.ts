import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export interface AccessRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  requestedRole: 'employee' | 'manager';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

const DB_PATH = path.join(process.cwd(), 'lib', 'access-requests-data.json');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jklphtbxlmxbldmfiwnf.supabase.co';
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbHBodGJ4bG14YmxkbWZpd25mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDYzMDIxMiwiZXhwIjoyMTEwMjA2MjEyfQ.pIvNxvHhFVbTuWQsr_AUabVMbGdIg1FGxdzRMiNJIIo';

const defaultRequests: AccessRequest[] = [
  {
    id: 'req-001',
    fullName: 'Mahmudul Hasan',
    email: 'mahmudul@workforce360.com',
    phone: '+880 1819-445566',
    department: 'Engineering & Technology',
    designation: 'Frontend React Developer',
    requestedRole: 'employee',
    status: 'PENDING',
    requestedAt: '2026-11-14 10:15 AM',
    notes: 'Mobile app onboarding request via Android APK v2.0.0',
  },
  {
    id: 'req-002',
    fullName: 'Farhana Akter',
    email: 'farhana@workforce360.com',
    phone: '+880 1712-334455',
    department: 'Product, UI/UX & Design',
    designation: 'UI/UX Visual Designer',
    requestedRole: 'employee',
    status: 'PENDING',
    requestedAt: '2026-11-14 11:30 AM',
    notes: 'Requested access for Product Design squad.',
  },
];

function readDB(): AccessRequest[] {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultRequests, null, 2));
      return defaultRequests;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return defaultRequests;
  }
}

function writeDB(data: AccessRequest[]) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to write access requests DB:', e);
  }
}

// GET all requests - queries live Supabase PENDING employees & merges with local storage
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const status = searchParams.get('status');

  let all = readDB();

  // Also query live Supabase employees with status = 'PENDING'
  try {
    const sbRes = await fetch(`${SUPABASE_URL}/rest/v1/employees?status=eq.PENDING&select=*`, {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
    });

    if (sbRes.ok) {
      const sbPending = await sbRes.json();
      if (Array.isArray(sbPending)) {
        for (const emp of sbPending) {
          const empEmail = emp.email?.toLowerCase();
          const existing = all.find((r) => r.email.toLowerCase() === empEmail);
          if (!existing) {
            const mapped: AccessRequest = {
              id: emp.id || `req-sb-${emp.employee_code}`,
              fullName: `${emp.first_name || ''} ${emp.last_name || ''}`.trim() || 'New Staff',
              email: emp.email,
              phone: emp.phone || '+880 1711-000000',
              department: 'Engineering & Technology',
              designation: 'Staff Associate',
              requestedRole: 'employee',
              status: 'PENDING',
              requestedAt: new Date(emp.created_at || Date.now()).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              }),
              notes: 'Submitted live via WorkForce 360 Mobile App APK (Supabase Synced)',
            };
            all.unshift(mapped);
          }
        }
        writeDB(all);
      }
    }
  } catch (err) {
    console.warn('Supabase fetch in GET /api/access-requests:', err);
  }

  if (email) {
    const found = all.find((r) => r.email.toLowerCase() === email.toLowerCase());
    return NextResponse.json({ success: true, request: found || null });
  }

  if (status) {
    const filtered = all.filter((r) => r.status === status);
    return NextResponse.json({ success: true, count: filtered.length, requests: filtered });
  }

  return NextResponse.json({ success: true, count: all.length, requests: all });
}

// POST new access request from mobile or web
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.fullName || !body.email) {
      return NextResponse.json({ error: 'Full name and email are required' }, { status: 400 });
    }

    const emailNorm = body.email.toLowerCase().trim();
    const all = readDB();
    const existing = all.find((r) => r.email.toLowerCase() === emailNorm);

    if (existing) {
      if (existing.status === 'PENDING') {
        return NextResponse.json(
          {
            error: 'You already have a pending registration request waiting for HR/Admin approval.',
            status: 'PENDING',
          },
          { status: 400 }
        );
      }
      if (existing.status === 'APPROVED') {
        return NextResponse.json(
          {
            message: 'Your account is already approved. You may proceed to login directly.',
            status: 'APPROVED',
          },
          { status: 200 }
        );
      }
    }

    const newRequest: AccessRequest = {
      id: `req-${Date.now().toString().slice(-6)}`,
      fullName: body.fullName.trim(),
      email: emailNorm,
      phone: body.phone || '+880 1711-000000',
      department: body.department || 'Engineering & Technology',
      designation: body.designation || 'Staff Associate',
      requestedRole: body.requestedRole || 'employee',
      status: 'PENDING',
      requestedAt: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      notes: body.notes || 'Submitted via WorkForce 360 Mobile App APK v2.0.0',
    };

    all.unshift(newRequest);
    writeDB(all);

    // Also insert row into live Supabase employees with status = 'PENDING'
    try {
      const empPayload = {
        organization_id: 'b0000000-0000-0000-0000-000000000001',
        employee_code: `REQ-${Math.floor(1000 + Math.random() * 8999)}`,
        first_name: newRequest.fullName.split(' ')[0],
        last_name: newRequest.fullName.split(' ').slice(1).join(' ') || 'Applicant',
        email: newRequest.email,
        phone: newRequest.phone,
        gender: 'MALE',
        joining_date: new Date().toISOString().split('T')[0],
        branch_id: 'd0000000-0000-0000-0000-000000000001',
        employment_type: 'FULL_TIME',
        status: 'PENDING',
        department_id: 'e0000000-0000-0000-0000-000000000001',
        designation_id: 'f0000000-0000-0000-0000-000000000001',
        blood_group: 'B+',
        gross_salary_bdt: 50000,
      };

      await fetch(`${SUPABASE_URL}/rest/v1/employees`, {
        method: 'POST',
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify(empPayload),
      });
    } catch (e) {
      console.warn('Supabase employee insertion on access request:', e);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Access request successfully registered. Pending HR / Company Admin review and approval.',
        request: newRequest,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH to Approve or Reject
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action, reviewedBy } = body; // action: 'APPROVE' | 'REJECT'

    if (!id || !action) {
      return NextResponse.json({ error: 'Request ID and action required' }, { status: 400 });
    }

    const all = readDB();
    const index = all.findIndex((r) => r.id === id || r.email.toLowerCase() === id.toLowerCase());

    if (index === -1) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const reqItem = all[index];
    const isApprove = action.toString().toUpperCase() === 'APPROVE';
    const newStatus = isApprove ? 'APPROVED' : 'REJECTED';

    reqItem.status = newStatus;
    reqItem.reviewedAt = new Date().toLocaleString();
    reqItem.reviewedBy = reviewedBy || 'HR Admin / Company Admin';

    all[index] = reqItem;
    writeDB(all);

    // Update live Supabase employee status
    try {
      const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/employees?email=eq.${encodeURIComponent(reqItem.email)}`, {
        method: 'PATCH',
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          status: isApprove ? 'ACTIVE' : 'REJECTED',
        }),
      });

      // If the row was not found in Supabase and it is being approved, create it now!
      if (isApprove) {
        const patchData = await patchRes.json();
        if (Array.isArray(patchData) && patchData.length === 0) {
          const empPayload = {
            organization_id: 'b0000000-0000-0000-0000-000000000001',
            employee_code: `EMP-${Math.floor(100 + Math.random() * 899)}`,
            first_name: reqItem.fullName.split(' ')[0],
            last_name: reqItem.fullName.split(' ').slice(1).join(' ') || 'Employee',
            email: reqItem.email,
            phone: reqItem.phone,
            gender: 'MALE',
            joining_date: new Date().toISOString().split('T')[0],
            branch_id: 'd0000000-0000-0000-0000-000000000001',
            employment_type: 'FULL_TIME',
            status: 'ACTIVE',
            department_id: 'e0000000-0000-0000-0000-000000000001',
            designation_id: 'f0000000-0000-0000-0000-000000000001',
            blood_group: 'B+',
            gross_salary_bdt: 55000,
          };

          await fetch(`${SUPABASE_URL}/rest/v1/employees`, {
            method: 'POST',
            headers: {
              apikey: SERVICE_KEY,
              Authorization: `Bearer ${SERVICE_KEY}`,
              'Content-Type': 'application/json',
              Prefer: 'return=representation',
            },
            body: JSON.stringify(empPayload),
          });
        }
      }
    } catch (e) {
      console.error('Supabase employee update error during approval:', e);
    }

    return NextResponse.json({
      success: true,
      message: `Access request ${newStatus.toLowerCase()} successfully. Account is now ${newStatus}.`,
      request: reqItem,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
