/**
 * WorkForce 360 - High-Fidelity Enterprise Mock & Initial Database State
 * Matches exact UI mockups and specifications
 */

export interface SystemHealthItem {
  name: string;
  status: 'Online' | 'Healthy' | 'Degraded';
  latencyMs: number;
}

export interface ActivityItem {
  id: string;
  avatarText: string;
  title: string;
  timeAgo: string;
  type: 'leave' | 'employee' | 'payroll' | 'project' | 'expense';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  attendanceRate: number;
  status: 'Present' | 'Late' | 'On Leave' | 'Absent';
  avatar: string;
}

export interface RemoteDevice {
  id: string;
  name: string;
  ownerName: string;
  model: string;
  os: 'Android' | 'iOS';
  appVersion: string;
  batteryPercentage: number;
  status: 'Online' | 'Offline' | 'Locked';
  lastSeen: string;
}

export const mockDashboardData = {
  kpis: {
    totalOrganizations: 128,
    totalOrganizationsGrowth: '+12.5%',
    totalUsers: '25.8K',
    totalUsersGrowth: '+8.2%',
    activeEmployees: '18.5K',
    activeEmployeesGrowth: '+10.1%',
    monthlyRevenueBDT: 245000,
    monthlyRevenueGrowth: '+15.3%',
  },
  businessOverview: [
    { month: 'Jan', revenue: 75000, organizations: 85, users: 14000 },
    { month: 'Feb', revenue: 95000, organizations: 92, users: 15500 },
    { month: 'Mar', revenue: 110000, organizations: 98, users: 16800 },
    { month: 'Apr', revenue: 135000, organizations: 105, users: 19500 },
    { month: 'May', revenue: 145000, organizations: 112, users: 21000 },
    { month: 'Jun', revenue: 160000, organizations: 116, users: 22200 },
    { month: 'Jul', revenue: 175000, organizations: 120, users: 23500 },
    { month: 'Aug', revenue: 190000, organizations: 122, users: 24000 },
    { month: 'Sep', revenue: 205000, organizations: 124, users: 24600 },
    { month: 'Oct', revenue: 220000, organizations: 126, users: 25100 },
    { month: 'Nov', revenue: 235000, organizations: 127, users: 25400 },
    { month: 'Dec', revenue: 245000, organizations: 128, users: 25800 },
  ],
  attendance: {
    rate: 92,
    presentCount: 16472,
    totalCount: 18000,
    onTimePercentage: 84,
    latePercentage: 8,
    absentPercentage: 8,
    onLeaveCount: 642,
    absentCount: 358,
  },
  departmentDistribution: [
    { name: 'Engineering', percentage: 35, count: 6475, color: '#3758D8' },
    { name: 'Marketing', percentage: 25, count: 4625, color: '#8B5CF6' },
    { name: 'Sales', percentage: 20, count: 3700, color: '#10B981' },
    { name: 'HR', percentage: 12, count: 2220, color: '#F59E0B' },
    { name: 'Others', percentage: 8, count: 1480, color: '#06B6D4' },
  ],
  recentActivities: [
    {
      id: 'act-1',
      avatarText: 'SK',
      title: 'Sarah Khan applied for Annual Leave',
      timeAgo: '2 min ago',
      type: 'leave',
    },
    {
      id: 'act-2',
      avatarText: 'TH',
      title: 'New employee added: Tanvir Hasan',
      timeAgo: '5 min ago',
      type: 'employee',
    },
    {
      id: 'act-3',
      avatarText: 'PR',
      title: 'Payroll processed for April 2025',
      timeAgo: '12 min ago',
      type: 'payroll',
    },
    {
      id: 'act-4',
      avatarText: 'WR',
      title: "Project 'Website Redesign' updated",
      timeAgo: '20 min ago',
      type: 'project',
    },
    {
      id: 'act-5',
      avatarText: 'RA',
      title: 'Expense claim submitted by Rafiq Ahmed',
      timeAgo: '25 min ago',
      type: 'expense',
    },
  ] as ActivityItem[],
  upcomingEvents: [
    {
      title: 'Team Meeting',
      time: 'Today, 11:00 AM',
      type: 'Meeting',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      title: 'Project Deadline',
      time: '25 Apr 2025',
      type: 'Project',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      title: 'Salary Disbursement',
      time: '30 Apr 2025',
      type: 'Finance',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
  ],
  systemHealth: [
    { name: 'Database', status: 'Healthy', latencyMs: 14 },
    { name: 'API Services', status: 'Healthy', latencyMs: 28 },
    { name: 'File Storage', status: 'Healthy', latencyMs: 42 },
    { name: 'Realtime', status: 'Healthy', latencyMs: 9 },
  ] as SystemHealthItem[],
  leaveBalances: {
    annual: 18,
    sick: 12,
    casual: 8,
    emergency: 5,
  },
};

export const mockManagerTeam: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Sarah Khan',
    role: 'Developer',
    department: 'Engineering',
    attendanceRate: 98,
    status: 'Present',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    id: 'tm-2',
    name: 'Mike Johnson',
    role: 'Designer',
    department: 'Engineering',
    attendanceRate: 96,
    status: 'Present',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: 'tm-3',
    name: 'Ayesha Rahman',
    role: 'Developer',
    department: 'Engineering',
    attendanceRate: 92,
    status: 'On Leave',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
  },
  {
    id: 'tm-4',
    name: 'Tanvir Hasan',
    role: 'QA Engineer',
    department: 'Engineering',
    attendanceRate: 95,
    status: 'Present',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
];

export const mockRemoteDevices: RemoteDevice[] = [
  {
    id: 'dev-1',
    name: 'Ahmed iPhone 15 Pro',
    ownerName: 'Ahmed Rahman',
    model: 'iPhone 15 Pro (iOS 18.2)',
    os: 'iOS',
    appVersion: '2.0.0',
    batteryPercentage: 88,
    status: 'Online',
    lastSeen: '2 min ago',
  },
  {
    id: 'dev-2',
    name: 'Sarah Samsung S24',
    ownerName: 'Sarah Khan',
    model: 'Samsung Galaxy S24 (Android 15)',
    os: 'Android',
    appVersion: '2.0.0',
    batteryPercentage: 74,
    status: 'Online',
    lastSeen: 'Just now',
  },
  {
    id: 'dev-3',
    name: 'Tanvir Pixel 8',
    ownerName: 'Tanvir Hasan',
    model: 'Google Pixel 8 (Android 14)',
    os: 'Android',
    appVersion: '1.9.8',
    batteryPercentage: 42,
    status: 'Locked',
    lastSeen: '1 hour ago',
  },
];

export const mockOrganizationsList = [
  {
    id: 'org-1',
    name: 'WorkForce 360 Ltd',
    code: 'WF360',
    plan: 'Enterprise',
    employeesCount: 100,
    status: 'Active',
    joinedDate: '12 Jan 2024',
  },
];


export interface EmployeeDirectoryItem {
  id: string;
  name: string;
  employeeId: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  branch: string;
  status: string;
  avatar: string;
}

export const mockEmployees: EmployeeDirectoryItem[] = [
  {
    id: '1',
    name: 'Ahmed Rahman',
    employeeId: 'ENG-042',
    email: 'ahmed@innovatebd.com',
    phone: '+880 1712 345678',
    department: 'Engineering',
    designation: 'Software Engineer',
    branch: 'Banani HQ',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: '2',
    name: 'Sarah Khan',
    employeeId: 'HR-012',
    email: 'sarah@innovatebd.com',
    phone: '+880 1711 987654',
    department: 'HR',
    designation: 'HR Lead',
    branch: 'Banani HQ',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    id: '3',
    name: 'Tanvir Hasan',
    employeeId: 'ENG-008',
    email: 'tanvir@innovatebd.com',
    phone: '+880 1819 123456',
    department: 'Engineering',
    designation: 'Engineering Manager',
    branch: 'Banani HQ',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    id: '4',
    name: 'Sadia Islam',
    employeeId: 'DSG-019',
    email: 'sadia@innovatebd.com',
    phone: '+880 1678 554433',
    department: 'Design',
    designation: 'Product Designer',
    branch: 'Gulshan Hub',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
  },
  {
    id: '5',
    name: 'Kamrul Ahsan',
    employeeId: 'FIN-005',
    email: 'kamrul@innovatebd.com',
    phone: '+880 1912 667788',
    department: 'Finance',
    designation: 'Finance Controller',
    branch: 'Banani HQ',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: '6',
    name: 'Nusrat Jahan',
    employeeId: 'HR-024',
    email: 'nusrat@innovatebd.com',
    phone: '+880 1521 889900',
    department: 'HR',
    designation: 'Recruiter',
    branch: 'Banani HQ',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  },
];
