'use client';

import { useState, useEffect } from 'react';

export interface CurrentUser {
  id?: string;
  employeeId: string;
  employeeCode?: string;
  name: string;
  email: string;
  designation: string;
  team: string;
  teamId?: string;
  department?: string;
  branch: string;
  role: 'super_admin' | 'company_admin' | 'hr_admin' | 'manager' | 'employee' | string;
  avatar: string;
  bloodGroup?: string;
  joiningDate?: string;
  grossSalaryBDT?: number;
}

const DEFAULT_USER: CurrentUser = {
  employeeId: 'WF-1026',
  employeeCode: 'WF-1026',
  name: 'Sadia Islam',
  email: 'sadia.islam@workforce360.com',
  designation: 'Design Director',
  team: 'Product, UI/UX & Design',
  department: 'Product, UI/UX & Design',
  teamId: 'team-design',
  branch: 'Banani HQ, Dhaka',
  role: 'employee',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
  bloodGroup: 'B+',
  joiningDate: '2024-01-01',
  grossSalaryBDT: 75000,
};

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser>(DEFAULT_USER);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('wf360_current_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser({
          ...DEFAULT_USER,
          ...parsed,
          employeeCode: parsed.employeeCode || parsed.employeeId || 'WF-1026',
          department: parsed.department || parsed.team || 'Product, UI/UX & Design',
          avatar: parsed.avatar || DEFAULT_USER.avatar,
        });
      }
    } catch (e) {
      console.error('Failed to read user from localStorage', e);
    }
  }, []);

  return {
    ...user,
    user,
    currentUser: user,
  };
}
