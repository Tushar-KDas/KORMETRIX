const fs = require('fs');
const path = require('path');

const teamsDef = [
  {
    id: 'engineering',
    name: 'Engineering & Technology',
    leadName: 'Tanvir Hasan',
    leadRole: 'Engineering Director / Manager',
    members: [
      { name: 'Tanvir Hasan', role: 'Engineering Director / Manager', designation: 'Engineering Director', roleType: 'manager' },
      { name: 'Ahmed Rahman', role: 'Lead Software Engineer', designation: 'Lead Software Engineer', roleType: 'employee' },
      { name: 'Sarah Khan', role: 'Senior Backend Engineer', designation: 'Senior Backend Engineer', roleType: 'employee' },
      { name: 'Mike Johnson', role: 'Senior DevOps Architect', designation: 'Senior DevOps Architect', roleType: 'employee' },
      { name: 'Ayesha Rahman', role: 'Full Stack Developer', designation: 'Full Stack Developer', roleType: 'employee' },
      { name: 'Fahim Montasir', role: 'Frontend Next.js Engineer', designation: 'Frontend Engineer', roleType: 'employee' },
      { name: 'Nusrat Jahan', role: 'Mobile Flutter Lead', designation: 'Mobile App Lead', roleType: 'employee' },
      { name: 'Shakib Al Hasan', role: 'Database Administrator', designation: 'PostgreSQL DBA', roleType: 'employee' },
      { name: 'Tahmid Chowdhury', role: 'Cloud Solutions Architect', designation: 'Cloud Architect', roleType: 'employee' },
      { name: 'Farhana Yeasmin', role: 'QA Automation Lead', designation: 'QA Lead', roleType: 'employee' },
      { name: 'Arifur Rahman', role: 'Security Engineer', designation: 'Application Security Engineer', roleType: 'employee' },
      { name: 'Mehedi Hasan', role: 'Site Reliability Engineer', designation: 'SRE Specialist', roleType: 'employee' },
      { name: 'Sadia Afrin', role: 'Backend Python Engineer', designation: 'Python Developer', roleType: 'employee' },
      { name: 'Rashedul Islam', role: 'API Gateway Specialist', designation: 'API Engineer', roleType: 'employee' },
      { name: 'Nabila Sultana', role: 'Flutter Developer', designation: 'Mobile Developer', roleType: 'employee' },
      { name: 'Zubair Ahmed', role: 'Golang Systems Engineer', designation: 'Systems Programmer', roleType: 'employee' },
      { name: 'Tasnim Hossain', role: 'React Native Specialist', designation: 'Cross-Platform Engineer', roleType: 'employee' },
      { name: 'Imtiaz Mahmud', role: 'Cybersecurity Analyst', designation: 'Security Analyst', roleType: 'employee' },
      { name: 'Afsana Mimi', role: 'QA Automation Engineer', designation: 'QA Engineer', roleType: 'employee' },
      { name: 'Mahfuzur Rahman', role: 'Infrastructure Engineer', designation: 'Infra Engineer', roleType: 'employee' },
      { name: 'Joynal Abedin', role: 'Firmware / IoT Engineer', designation: 'Hardware Systems Engineer', roleType: 'employee' },
      { name: 'Rumana Akter', role: 'Junior Software Engineer', designation: 'Software Engineer', roleType: 'employee' },
      { name: 'Tanmoy Das', role: 'System Administrator', designation: 'Linux Admin', roleType: 'employee' },
      { name: 'Shuvo Karmakar', role: 'Network Engineer', designation: 'Network Admin', roleType: 'employee' },
      { name: 'Rifat Bin Alam', role: 'DevSecOps Specialist', designation: 'DevOps Engineer', roleType: 'employee' },
    ]
  },
  {
    id: 'design',
    name: 'Product, UI/UX & Design',
    leadName: 'Sadia Islam',
    leadRole: 'Head of Product Design / Manager',
    members: [
      { name: 'Sadia Islam', role: 'Head of Product Design', designation: 'Design Director', roleType: 'manager' },
      { name: 'Rayhan Kabir', role: 'Senior Product Manager - Mobile', designation: 'Staff Product Manager', roleType: 'employee' },
      { name: 'Tasnia Firoz', role: 'Senior UX Researcher', designation: 'Lead UX Researcher', roleType: 'employee' },
      { name: 'Anisur Rahman', role: 'Design Systems Lead', designation: 'Design Systems Architect', roleType: 'employee' },
      { name: 'Fariha Zaman', role: 'Visual & Interaction Designer', designation: 'UI/UX Designer', roleType: 'employee' },
      { name: 'Sifat Ullah', role: 'Product Owner - Core HRMS', designation: 'Product Owner', roleType: 'employee' },
      { name: 'Sumaiya Akhtar', role: 'Motion Graphics Designer', designation: 'Motion Designer', roleType: 'employee' },
      { name: 'Nazmus Sakib', role: 'Brand & Marketing Designer', designation: 'Brand Designer', roleType: 'employee' },
      { name: 'Munira Khatun', role: 'Accessibility (A11y) Designer', designation: 'Accessibility Specialist', roleType: 'employee' },
      { name: 'Ashraful Haque', role: 'Technical Product Writer', designation: 'UX Content Strategist', roleType: 'employee' },
      { name: 'Dilruba Shampa', role: 'Information Architect', designation: 'Information Architect', roleType: 'employee' },
      { name: 'Rubel Mia', role: '3D & Iconographer', designation: 'Visual Asset Designer', roleType: 'employee' },
      { name: 'Samira Tanjim', role: 'Junior UI Designer', designation: 'UI Designer', roleType: 'employee' },
      { name: 'Kazi Asif', role: 'Product Analyst', designation: 'Product Data Analyst', roleType: 'employee' },
      { name: 'Farzana Bobby', role: 'User Journey Researcher', designation: 'UX Researcher', roleType: 'employee' },
      { name: 'Shamsul Arefin', role: 'Design Technologist', designation: 'UI Prototyper', roleType: 'employee' },
      { name: 'Nayla Tarannum', role: 'Micro-interactions Designer', designation: 'Interactive Designer', roleType: 'employee' },
      { name: 'Jashim Uddin', role: 'Design Operations Lead', designation: 'DesignOps Manager', roleType: 'employee' },
      { name: 'Shirin Sharmin', role: 'Mobile UX Specialist', designation: 'Mobile UX Designer', roleType: 'employee' },
      { name: 'Touhidul Islam', role: 'Associate Product Manager', designation: 'Associate PM', roleType: 'employee' },
    ]
  },
  {
    id: 'hr',
    name: 'Human Resources & Talent Operations',
    leadName: 'Nusrat Jahan',
    leadRole: 'Chief People Officer / HR Director',
    members: [
      { name: 'Nusrat Jahan', role: 'Chief People Officer', designation: 'HR Director', roleType: 'hr_admin' },
      { name: 'Kamrun Nahar', role: 'Head of Talent Acquisition', designation: 'Recruitment Lead', roleType: 'hr_admin' },
      { name: 'Saifuddin Ahmed', role: 'People Operations Specialist', designation: 'People Ops Manager', roleType: 'hr_admin' },
      { name: 'Tania Parveen', role: 'Employee Relations Executive', designation: 'Employee Relations', roleType: 'employee' },
      { name: 'Mokhlesur Rahman', role: 'Learning & Development Lead', designation: 'L&D Manager', roleType: 'employee' },
      { name: 'Nasrin Akter', role: 'HR Compliance & Labor Law Specialist', designation: 'Compliance Officer', roleType: 'employee' },
      { name: 'Belal Hossain', role: 'Onboarding Coordinator', designation: 'Onboarding Specialist', roleType: 'employee' },
      { name: 'Sharmin Sultana', role: 'Culture & Wellbeing Specialist', designation: 'Wellbeing Partner', roleType: 'employee' },
      { name: 'Atiqul Islam', role: 'Workplace Safety & Admin Lead', designation: 'Facility & Admin Lead', roleType: 'employee' },
      { name: 'Farhana Haque', role: 'Benefits & Compensation Analyst', designation: 'Compensation Analyst', roleType: 'employee' },
      { name: 'Ziaur Rahman', role: 'HR Data Analyst', designation: 'People Analytics Specialist', roleType: 'employee' },
      { name: 'Pervin Sultana', role: 'Tech Recruitment Officer', designation: 'Technical Recruiter', roleType: 'employee' },
      { name: 'Monirul Islam', role: 'Facility Manager', designation: 'Admin & Infrastructure', roleType: 'employee' },
      { name: 'Sabina Yasmin', role: 'Staff Happiness Officer', designation: 'Internal Culture Partner', roleType: 'employee' },
      { name: 'Muntasir Billah', role: 'HR Operations Associate', designation: 'HR Generalist', roleType: 'employee' },
      { name: 'Jesmin Ara', role: 'Leave & Attendance Admin', designation: 'Time & Attendance Officer', roleType: 'employee' },
      { name: 'Anwar Hossain', role: 'Workplace Concierge', designation: 'Administrative Executive', roleType: 'employee' },
      { name: 'Nilufar Yasmin', role: 'Employee Engagement Lead', designation: 'Engagement Manager', roleType: 'employee' },
    ]
  },
  {
    id: 'finance',
    name: 'Finance, Payroll & Accounts',
    leadName: 'Kamrul Ahsan',
    leadRole: 'Chief Financial Officer / Finance Manager',
    members: [
      { name: 'Kamrul Ahsan', role: 'Chief Financial Officer', designation: 'CFO / Finance Director', roleType: 'company_admin' },
      { name: 'Md. Zahidul Islam', role: 'Senior Accounts Manager', designation: 'Accounts Head', roleType: 'employee' },
      { name: 'Fatema Begum', role: 'Lead Payroll Specialist (Bangladesh Tax)', designation: 'Senior Payroll Manager', roleType: 'employee' },
      { name: 'Habibur Rahman', role: 'Statutory Tax & Audit Consultant', designation: 'Tax & Compliance Advisor', roleType: 'employee' },
      { name: 'Shahnaz Parvin', role: 'Treasury & Cash Flow Officer', designation: 'Treasury Specialist', roleType: 'employee' },
      { name: 'Rezaul Karim', role: 'Billing & Invoicing Executive', designation: 'Billing Lead', roleType: 'employee' },
      { name: 'Morshed Alam', role: 'Procurement Specialist', designation: 'Commercial Procurement Head', roleType: 'employee' },
      { name: 'Parveen Akhtar', role: 'Disbursement Officer', designation: 'Banking Disbursement Specialist', roleType: 'employee' },
      { name: 'Selim Reza', role: 'Financial Risk Analyst', designation: 'Risk & Strategy Analyst', roleType: 'employee' },
      { name: 'Shahinur Rahman', role: 'Accountant (Payables)', designation: 'Accounts Payable Specialist', roleType: 'employee' },
      { name: 'Nazma Begum', role: 'Accountant (Receivables)', designation: 'Accounts Receivable Specialist', roleType: 'employee' },
      { name: 'Tariqul Islam', role: 'Expense & Claims Auditor', designation: 'Reimbursement Auditor', roleType: 'employee' },
      { name: 'Rina Begum', role: 'Internal Auditor', designation: 'Audit Officer', roleType: 'employee' },
      { name: 'Enamul Haque', role: 'Banking Liaison Officer', designation: 'Corporate Banking Specialist', roleType: 'employee' },
      { name: 'Hasina Akhter', role: 'Financial Reporting Executive', designation: 'Financial Controller', roleType: 'employee' },
      { name: 'Liton Kumar', role: 'Junior Accountant', designation: 'Assistant Accountant', roleType: 'employee' },
      { name: 'Anwara Khatun', role: 'Payroll Assistant', designation: 'Payroll Associate', roleType: 'employee' },
    ]
  },
  {
    id: 'sales',
    name: 'Sales, Marketing & Customer Success',
    leadName: 'Asif Iqbal',
    leadRole: 'VP of Sales & Growth / Manager',
    members: [
      { name: 'Asif Iqbal', role: 'VP of Sales & Growth', designation: 'Growth Director', roleType: 'manager' },
      { name: 'Farhan Kabir', role: 'Head of Enterprise Client Acquisition', designation: 'Enterprise Sales Head', roleType: 'employee' },
      { name: 'Shamima Nasrin', role: 'Digital Marketing Strategist', designation: 'Marketing Lead', roleType: 'employee' },
      { name: 'Babul Mia', role: 'Territory Sales Lead (Chittagong)', designation: 'Regional Sales Manager', roleType: 'employee' },
      { name: 'Rokeya Begum', role: 'Customer Success Team Lead', designation: 'CSM Lead', roleType: 'employee' },
      { name: 'Jahangir Alam', role: 'Senior SEO & Performance Marketer', designation: 'Growth Marketer', roleType: 'employee' },
      { name: 'Rehana Akhter', role: 'Key Account Manager', designation: 'Strategic Account Manager', roleType: 'employee' },
      { name: 'Sirajul Islam', role: 'Enterprise Sales Executive', designation: 'SaaS Sales Executive', roleType: 'employee' },
      { name: 'Maya Rani', role: 'Content Strategist & Copywriter', designation: 'Brand Content Lead', roleType: 'employee' },
      { name: 'Delwar Hossain', role: 'Client Onboarding Manager', designation: 'Implementation Specialist', roleType: 'employee' },
      { name: 'Shima Sultana', role: 'Lead Generation Specialist', designation: 'Inbound Specialist', roleType: 'employee' },
      { name: 'Motaleb Hossain', role: 'Customer Support Lead (24/7)', designation: 'Support Operations Head', roleType: 'employee' },
      { name: 'Parul Akter', role: 'Technical Support Specialist', designation: 'Tier-2 Support Engineer', roleType: 'employee' },
      { name: 'Golam Mostafa', role: 'Solutions Consultant', designation: 'Pre-Sales Solutions Engineer', roleType: 'employee' },
      { name: 'Shafiul Alam', role: 'Brand Ambassador', designation: 'PR & Outreach Executive', roleType: 'employee' },
      { name: 'Shahadat Hossain', role: 'SaaS SDR', designation: 'Business Development Rep', roleType: 'employee' },
      { name: 'Salma Begum', role: 'Customer Retention Specialist', designation: 'Retention Account Manager', roleType: 'employee' },
      { name: 'Azim Uddin', role: 'Sales Operations Coordinator', designation: 'CRM Admin', roleType: 'employee' },
      { name: 'Morium Begum', role: 'Email Marketing Specialist', designation: 'Lifecycle Marketer', roleType: 'employee' },
      { name: 'Zakir Hossain', role: 'Field Sales Officer (Sylhet)', designation: 'Regional Sales Rep', roleType: 'employee' },
    ]
  }
];

const bloodGroups = ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB+'];
const branches = ['Banani HQ, Dhaka', 'Gulshan Tech Hub', 'Chattogram Port Branch', 'Sylhet IT Park'];
const avatarList = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop',
];

let globalIndex = 0;
const allEmployees = [];

teamsDef.forEach((team) => {
  team.members.forEach((m) => {
    globalIndex++;
    const empId = `WF-${1000 + globalIndex}`;
    const cleanName = m.name.toLowerCase().replace(/[^a-z]/g, '');
    const email = `${m.name.toLowerCase().replace(/[^a-z]/g, '.').replace(/\.+/g, '.')}@workforce360.com`;
    const phone = `+880 17${String(10000000 + globalIndex * 71324).slice(0, 8)}`;
    const avatar = avatarList[(globalIndex - 1) % avatarList.length];
    const blood = bloodGroups[(globalIndex - 1) % bloodGroups.length];
    const branch = branches[(globalIndex - 1) % branches.length];
    const joinYear = 2021 + ((globalIndex * 3) % 5);
    const joinMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][(globalIndex * 7) % 12];
    const joinDay = 1 + ((globalIndex * 11) % 28);
    const joiningDate = `${joinDay} ${joinMonth}, ${joinYear}`;

    allEmployees.push({
      id: String(globalIndex),
      employeeId: empId,
      name: m.name,
      email: email,
      phone: phone,
      team: team.name,
      teamId: team.id,
      designation: m.designation,
      role: m.roleType,
      branch: branch,
      bloodGroup: blood,
      joiningDate: joiningDate,
      emergencyContact: {
        name: `${m.name.split(' ')[0]} Guardian`,
        relation: globalIndex % 2 === 0 ? 'Spouse' : 'Parent',
        phone: `+880 18${String(20000000 + globalIndex * 92143).slice(0, 8)}`,
      },
      loginDetails: {
        username: email,
        defaultPassword: `WF360@Pass${1000 + globalIndex}`,
        pin: `${1000 + (globalIndex % 9000)}`,
        lastLogin: `${Math.floor(globalIndex / 10) + 1} hours ago`,
        status: 'Active',
      },
      avatar: avatar,
      status: globalIndex % 15 === 0 ? 'On Leave' : 'Active',
      attendanceRate: 90 + (globalIndex % 10),
    });
  });
});

console.log(`Generated ${allEmployees.length} employees across ${teamsDef.length} teams.`);

// Write TypeScript file
const tsContent = `// Auto-generated 100 Employees Dataset across 5 Teams for WorkForce 360
export interface FullEmployee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  team: string;
  teamId: string;
  designation: string;
  role: 'super_admin' | 'company_admin' | 'hr_admin' | 'manager' | 'employee';
  branch: string;
  bloodGroup: string;
  joiningDate: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  loginDetails: {
    username: string;
    defaultPassword: string;
    pin: string;
    lastLogin: string;
    status: 'Active' | 'Suspended';
  };
  avatar: string;
  status: 'Active' | 'On Leave';
  attendanceRate: number;
}

export interface TeamGroup {
  id: string;
  name: string;
  leadName: string;
  leadRole: string;
  memberCount: number;
}

export const mockTeamsList: TeamGroup[] = ${JSON.stringify(
  teamsDef.map(t => ({
    id: t.id,
    name: t.name,
    leadName: t.leadName,
    leadRole: t.leadRole,
    memberCount: t.members.length,
  })),
  null,
  2
)};

export const mock100Employees: FullEmployee[] = ${JSON.stringify(allEmployees, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../apps/web/lib/employees-100.ts'), tsContent, 'utf8');
console.log('Saved apps/web/lib/employees-100.ts');

// Write Dart file for Flutter
const dartEmployees = allEmployees.map(e => `    EmployeeItem(
      id: '${e.id}',
      employeeId: '${e.employeeId}',
      name: '${e.name}',
      email: '${e.email}',
      phone: '${e.phone}',
      team: '${e.team}',
      teamId: '${e.teamId}',
      designation: '${e.designation}',
      role: '${e.role}',
      branch: '${e.branch}',
      bloodGroup: '${e.bloodGroup}',
      joiningDate: '${e.joiningDate}',
      emergencyName: '${e.emergencyContact.name}',
      emergencyRelation: '${e.emergencyContact.relation}',
      emergencyPhone: '${e.emergencyContact.phone}',
      loginEmail: '${e.loginDetails.username}',
      defaultPassword: '${e.loginDetails.defaultPassword}',
      loginPin: '${e.loginDetails.pin}',
      lastLogin: '${e.loginDetails.lastLogin}',
      avatar: '${e.avatar}',
      status: '${e.status}',
      attendanceRate: ${e.attendanceRate},
    )`).join(',\n');

const dartContent = `// Auto-generated 100 Employees Dataset across 5 Teams for WorkForce 360 Flutter
class EmployeeItem {
  final String id;
  final String employeeId;
  final String name;
  final String email;
  final String phone;
  final String team;
  final String teamId;
  final String designation;
  final String role;
  final String branch;
  final String bloodGroup;
  final String joiningDate;
  final String emergencyName;
  final String emergencyRelation;
  final String emergencyPhone;
  final String loginEmail;
  final String defaultPassword;
  final String loginPin;
  final String lastLogin;
  final String avatar;
  final String status;
  final int attendanceRate;

  const EmployeeItem({
    required this.id,
    required this.employeeId,
    required this.name,
    required this.email,
    required this.phone,
    required this.team,
    required this.teamId,
    required this.designation,
    required this.role,
    required this.branch,
    required this.bloodGroup,
    required this.joiningDate,
    required this.emergencyName,
    required this.emergencyRelation,
    required this.emergencyPhone,
    required this.loginEmail,
    required this.defaultPassword,
    required this.loginPin,
    required this.lastLogin,
    required this.avatar,
    required this.status,
    required this.attendanceRate,
  });
}

class TeamGroupItem {
  final String id;
  final String name;
  final String leadName;
  final String leadRole;
  final int memberCount;

  const TeamGroupItem({
    required this.id,
    required this.name,
    required this.leadName,
    required this.leadRole,
    required this.memberCount,
  });
}

const mockTeamsListDart = [
${teamsDef.map(t => `  TeamGroupItem(
    id: '${t.id}',
    name: '${t.name}',
    leadName: '${t.leadName}',
    leadRole: '${t.leadRole}',
    memberCount: ${t.members.length},
  )`).join(',\n')}
];

const mock100EmployeesDart = [
${dartEmployees}
];
`;

fs.mkdirSync(path.join(__dirname, '../apps/mobile/lib/core/data'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '../apps/mobile/lib/core/data/employees_100.dart'), dartContent, 'utf8');
console.log('Saved apps/mobile/lib/core/data/employees_100.dart');
