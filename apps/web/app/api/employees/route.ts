import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jklphtbxlmxbldmfiwnf.supabase.co';
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbHBodGJ4bG14YmxkbWZpd25mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDYzMDIxMiwiZXhwIjoyMTEwMjA2MjEyfQ.pIvNxvHhFVbTuWQsr_AUabVMbGdIg1FGxdzRMiNJIIo';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function GET() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/employees?select=*&order=created_at.desc`, {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from Supabase' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, count: data.length, employees: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const payload = {
      organization_id: body.organization_id || 'b0000000-0000-0000-0000-000000000001',
      employee_code: body.employee_code || `EMP-${Math.floor(100 + Math.random() * 900)}`,
      first_name: body.first_name || body.name?.split(' ')[0] || 'Employee',
      last_name: body.last_name || body.name?.split(' ').slice(1).join(' ') || 'Staff',
      email: body.email,
      phone: body.phone || '+880 1711-000000',
      gender: body.gender || 'MALE',
      joining_date: body.joining_date || new Date().toISOString().split('T')[0],
      branch_id: body.branch_id || 'd0000000-0000-0000-0000-000000000001',
      employment_type: body.employment_type || 'FULL_TIME',
      status: body.status || 'ACTIVE',
      department_id: body.department_id || 'e0000000-0000-0000-0000-000000000001',
      designation_id: body.designation_id || 'f0000000-0000-0000-0000-000000000001',
      blood_group: body.blood_group || 'O+',
      gross_salary_bdt: body.gross_salary_bdt || 50000,
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/employees`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(payload),
    });

    const resData = await res.json();

    if (!res.ok) {
      console.error('Supabase employee insert error:', resData);
      return NextResponse.json({ error: resData.message || 'Insert failed', details: resData }, { status: res.status });
    }

    return NextResponse.json({ success: true, employee: resData[0] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json({ error: 'Employee ID required' }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/employees?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(body),
    });

    const resData = await res.json();
    return NextResponse.json({ success: true, employee: resData[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Employee ID required' }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/employees?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
