'use client';

import { useState, useEffect, useCallback } from 'react';
import { mock100Employees, FullEmployee, mockTeamsList, TeamGroup } from './employees-100';

const LOCAL_STORAGE_KEY = 'wf360_custom_employees_roster';

export function getStoredCustomEmployees(): FullEmployee[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveStoredCustomEmployees(list: FullEmployee[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('wf360_employees_updated'));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function useEmployeeStore() {
  const [employees, setEmployees] = useState<FullEmployee[]>(() => {
    const custom = getStoredCustomEmployees();
    return [...custom, ...mock100Employees];
  });
  const [isLoading, setIsLoading] = useState(false);

  const refreshList = useCallback(async () => {
    const custom = getStoredCustomEmployees();
    try {
      const res = await fetch('/api/employees');
      if (res.ok) {
        const json = await res.json();
        if (json.employees && Array.isArray(json.employees)) {
          // Map supabase rows to FullEmployee structure
          const mapped = json.employees
            .filter((row: any) => !mock100Employees.some((m) => m.email === row.email))
            .map((row: any): FullEmployee => ({
              id: row.id,
              employeeId: row.employee_code || `EMP-${row.id.slice(0, 4)}`,
              name: `${row.first_name || ''} ${row.last_name || ''}`.trim() || 'Employee',
              email: row.email,
              phone: row.phone || '+880 1711-000000',
              team: 'Engineering Squad (Tech & Core Systems)',
              teamId: 'team-engineering',
              designation: 'Software Associate',
              avatar: row.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
              joiningDate: row.joining_date || '2026-11-14',
              bloodGroup: row.blood_group || 'O+',
              branch: 'Banani HQ, Dhaka',
              status: row.status === 'ACTIVE' ? 'Active' : 'On Leave',
              role: 'employee',
              attendanceRate: 98,
              emergencyContact: {
                name: 'Emergency Desk',
                relation: 'HR Office',
                phone: '+880 1700-112233',
              },
              loginDetails: {
                username: row.email.split('@')[0],
                defaultPassword: 'password123',
                pin: '1234',
                lastLogin: 'Never logged in',
                status: 'Active',
              },
            }));

          // Merge custom local + remote + base
          const combined = [...custom, ...mapped, ...mock100Employees];
          // Deduplicate by email
          const seen = new Set();
          const unique = combined.filter((item) => {
            if (seen.has(item.email)) return false;
            seen.add(item.email);
            return true;
          });
          setEmployees(unique);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not sync with Supabase API, using local roster:', e);
    }
    setEmployees([...custom, ...mock100Employees]);
  }, []);

  useEffect(() => {
    refreshList();

    const handleUpdate = () => refreshList();
    window.addEventListener('wf360_employees_updated', handleUpdate);
    return () => window.removeEventListener('wf360_employees_updated', handleUpdate);
  }, [refreshList]);

  // Add new employee
  const addEmployee = async (newEmp: Partial<FullEmployee>) => {
    setIsLoading(true);

    const empId = newEmp.employeeId || `EMP-${Math.floor(100 + Math.random() * 899)}`;
    const full: FullEmployee = {
      id: `custom-${Date.now()}`,
      employeeId: empId,
      name: newEmp.name || 'New Staff',
      email: newEmp.email || `emp.${Date.now()}@workforce360.com`,
      phone: newEmp.phone || '+880 1711-000000',
      team: newEmp.team || 'Engineering Squad (Tech & Core Systems)',
      teamId: newEmp.teamId || 'team-engineering',
      designation: newEmp.designation || 'Staff Associate',
      avatar: newEmp.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      joiningDate: newEmp.joiningDate || new Date().toISOString().split('T')[0],
      bloodGroup: newEmp.bloodGroup || 'A+',
      branch: newEmp.branch || 'Banani HQ, Dhaka',
      status: (newEmp.status as any) || 'Active',
      role: (newEmp.role as any) || 'employee',
      attendanceRate: 98,
      emergencyContact: newEmp.emergencyContact || {
        name: 'Emergency Desk',
        relation: 'HQ Desk',
        phone: '+880 1700-000000',
      },
      loginDetails: {
        username: newEmp.email?.split('@')[0] || empId.toLowerCase(),
        defaultPassword: 'password123',
        pin: '1234',
        lastLogin: 'Never logged in',
        status: 'Active',
      },
    };

    // 1. Immediately update localStorage
    const currentCustom = getStoredCustomEmployees();
    saveStoredCustomEmployees([full, ...currentCustom]);

    // 2. Persist to Supabase via API
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_code: full.employeeId,
          first_name: full.name.split(' ')[0],
          last_name: full.name.split(' ').slice(1).join(' ') || 'Staff',
          email: full.email,
          phone: full.phone,
          blood_group: full.bloodGroup,
          joining_date: full.joiningDate,
          gender: 'MALE',
        }),
      });
      if (res.ok) {
        console.log('Employee persisted to Supabase successfully!');
      }
    } catch (e) {
      console.warn('API sync warning:', e);
    }

    setIsLoading(false);
    refreshList();
    return full;
  };

  // Edit employee
  const updateEmployee = async (id: string, updates: Partial<FullEmployee>) => {
    setIsLoading(true);
    const currentCustom = getStoredCustomEmployees();
    const updatedCustom = currentCustom.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp));
    saveStoredCustomEmployees(updatedCustom);

    // Also update in memory if it's in base list
    setEmployees((prev) => prev.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp)));
    setIsLoading(false);
  };

  // Delete employee
  const deleteEmployee = async (id: string) => {
    setIsLoading(true);
    const currentCustom = getStoredCustomEmployees();
    const filtered = currentCustom.filter((emp) => emp.id !== id);
    saveStoredCustomEmployees(filtered);

    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    setIsLoading(false);
  };

  return {
    employees,
    teams: mockTeamsList,
    isLoading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    refreshList,
  };
}
