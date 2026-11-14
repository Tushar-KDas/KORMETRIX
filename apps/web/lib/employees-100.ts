// Auto-generated 100 Employees Dataset across 5 Teams for WorkForce 360
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

export const mockTeamsList: TeamGroup[] = [
  {
    "id": "engineering",
    "name": "Engineering & Technology",
    "leadName": "Tanvir Hasan",
    "leadRole": "Engineering Director / Manager",
    "memberCount": 25
  },
  {
    "id": "design",
    "name": "Product, UI/UX & Design",
    "leadName": "Sadia Islam",
    "leadRole": "Head of Product Design / Manager",
    "memberCount": 20
  },
  {
    "id": "hr",
    "name": "Human Resources & Talent Operations",
    "leadName": "Nusrat Jahan",
    "leadRole": "Chief People Officer / HR Director",
    "memberCount": 18
  },
  {
    "id": "finance",
    "name": "Finance, Payroll & Accounts",
    "leadName": "Kamrul Ahsan",
    "leadRole": "Chief Financial Officer / Finance Manager",
    "memberCount": 17
  },
  {
    "id": "sales",
    "name": "Sales, Marketing & Customer Success",
    "leadName": "Asif Iqbal",
    "leadRole": "VP of Sales & Growth / Manager",
    "memberCount": 20
  }
];

export const mock100Employees: FullEmployee[] = [
  {
    "id": "1",
    "employeeId": "WF-1001",
    "name": "Tanvir Hasan",
    "email": "tanvir.hasan@workforce360.com",
    "phone": "+880 1710071324",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "Engineering Director",
    "role": "manager",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A+",
    "joiningDate": "12 Aug, 2024",
    "emergencyContact": {
      "name": "Tanvir Guardian",
      "relation": "Parent",
      "phone": "+880 1820092143"
    },
    "loginDetails": {
      "username": "tanvir.hasan@workforce360.com",
      "defaultPassword": "WF360@Pass1001",
      "pin": "1001",
      "lastLogin": "1 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 91
  },
  {
    "id": "2",
    "employeeId": "WF-1002",
    "name": "Ahmed Rahman",
    "email": "ahmed.rahman@workforce360.com",
    "phone": "+880 1710142648",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "Lead Software Engineer",
    "role": "employee",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B+",
    "joiningDate": "23 Mar, 2022",
    "emergencyContact": {
      "name": "Ahmed Guardian",
      "relation": "Spouse",
      "phone": "+880 1820184286"
    },
    "loginDetails": {
      "username": "ahmed.rahman@workforce360.com",
      "defaultPassword": "WF360@Pass1002",
      "pin": "1002",
      "lastLogin": "1 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 92
  },
  {
    "id": "3",
    "employeeId": "WF-1003",
    "name": "Sarah Khan",
    "email": "sarah.khan@workforce360.com",
    "phone": "+880 1710213972",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "Senior Backend Engineer",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O+",
    "joiningDate": "6 Oct, 2025",
    "emergencyContact": {
      "name": "Sarah Guardian",
      "relation": "Parent",
      "phone": "+880 1820276429"
    },
    "loginDetails": {
      "username": "sarah.khan@workforce360.com",
      "defaultPassword": "WF360@Pass1003",
      "pin": "1003",
      "lastLogin": "1 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 93
  },
  {
    "id": "4",
    "employeeId": "WF-1004",
    "name": "Mike Johnson",
    "email": "mike.johnson@workforce360.com",
    "phone": "+880 1710285296",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "Senior DevOps Architect",
    "role": "employee",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "17 May, 2023",
    "emergencyContact": {
      "name": "Mike Guardian",
      "relation": "Spouse",
      "phone": "+880 1820368572"
    },
    "loginDetails": {
      "username": "mike.johnson@workforce360.com",
      "defaultPassword": "WF360@Pass1004",
      "pin": "1004",
      "lastLogin": "1 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 94
  },
  {
    "id": "5",
    "employeeId": "WF-1005",
    "name": "Ayesha Rahman",
    "email": "ayesha.rahman@workforce360.com",
    "phone": "+880 1710356620",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "Full Stack Developer",
    "role": "employee",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A-",
    "joiningDate": "28 Dec, 2021",
    "emergencyContact": {
      "name": "Ayesha Guardian",
      "relation": "Parent",
      "phone": "+880 1820460715"
    },
    "loginDetails": {
      "username": "ayesha.rahman@workforce360.com",
      "defaultPassword": "WF360@Pass1005",
      "pin": "1005",
      "lastLogin": "1 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 95
  },
  {
    "id": "6",
    "employeeId": "WF-1006",
    "name": "Fahim Montasir",
    "email": "fahim.montasir@workforce360.com",
    "phone": "+880 1710427944",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "Frontend Engineer",
    "role": "employee",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B-",
    "joiningDate": "11 Jul, 2024",
    "emergencyContact": {
      "name": "Fahim Guardian",
      "relation": "Spouse",
      "phone": "+880 1820552858"
    },
    "loginDetails": {
      "username": "fahim.montasir@workforce360.com",
      "defaultPassword": "WF360@Pass1006",
      "pin": "1006",
      "lastLogin": "1 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 96
  },
  {
    "id": "7",
    "employeeId": "WF-1007",
    "name": "Nusrat Jahan",
    "email": "nusrat.jahan@workforce360.com",
    "phone": "+880 1710499268",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "Mobile App Lead",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O-",
    "joiningDate": "22 Feb, 2022",
    "emergencyContact": {
      "name": "Nusrat Guardian",
      "relation": "Parent",
      "phone": "+880 1820645001"
    },
    "loginDetails": {
      "username": "nusrat.jahan@workforce360.com",
      "defaultPassword": "WF360@Pass1007",
      "pin": "1007",
      "lastLogin": "1 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 97
  },
  {
    "id": "8",
    "employeeId": "WF-1008",
    "name": "Shakib Al Hasan",
    "email": "shakib.al.hasan@workforce360.com",
    "phone": "+880 1710570592",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "PostgreSQL DBA",
    "role": "employee",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "5 Sep, 2025",
    "emergencyContact": {
      "name": "Shakib Guardian",
      "relation": "Spouse",
      "phone": "+880 1820737144"
    },
    "loginDetails": {
      "username": "shakib.al.hasan@workforce360.com",
      "defaultPassword": "WF360@Pass1008",
      "pin": "1008",
      "lastLogin": "1 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 98
  },
  {
    "id": "9",
    "employeeId": "WF-1009",
    "name": "Tahmid Chowdhury",
    "email": "tahmid.chowdhury@workforce360.com",
    "phone": "+880 1710641916",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "Cloud Architect",
    "role": "employee",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A+",
    "joiningDate": "16 Apr, 2023",
    "emergencyContact": {
      "name": "Tahmid Guardian",
      "relation": "Parent",
      "phone": "+880 1820829287"
    },
    "loginDetails": {
      "username": "tahmid.chowdhury@workforce360.com",
      "defaultPassword": "WF360@Pass1009",
      "pin": "1009",
      "lastLogin": "1 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 99
  },
  {
    "id": "10",
    "employeeId": "WF-1010",
    "name": "Farhana Yeasmin",
    "email": "farhana.yeasmin@workforce360.com",
    "phone": "+880 1710713240",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "QA Lead",
    "role": "employee",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B+",
    "joiningDate": "27 Nov, 2021",
    "emergencyContact": {
      "name": "Farhana Guardian",
      "relation": "Spouse",
      "phone": "+880 1820921430"
    },
    "loginDetails": {
      "username": "farhana.yeasmin@workforce360.com",
      "defaultPassword": "WF360@Pass1010",
      "pin": "1010",
      "lastLogin": "2 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 90
  },
  {
    "id": "11",
    "employeeId": "WF-1011",
    "name": "Arifur Rahman",
    "email": "arifur.rahman@workforce360.com",
    "phone": "+880 1710784564",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "Application Security Engineer",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O+",
    "joiningDate": "10 Jun, 2024",
    "emergencyContact": {
      "name": "Arifur Guardian",
      "relation": "Parent",
      "phone": "+880 1821013573"
    },
    "loginDetails": {
      "username": "arifur.rahman@workforce360.com",
      "defaultPassword": "WF360@Pass1011",
      "pin": "1011",
      "lastLogin": "2 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 91
  },
  {
    "id": "12",
    "employeeId": "WF-1012",
    "name": "Mehedi Hasan",
    "email": "mehedi.hasan@workforce360.com",
    "phone": "+880 1710855888",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "SRE Specialist",
    "role": "employee",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "21 Jan, 2022",
    "emergencyContact": {
      "name": "Mehedi Guardian",
      "relation": "Spouse",
      "phone": "+880 1821105716"
    },
    "loginDetails": {
      "username": "mehedi.hasan@workforce360.com",
      "defaultPassword": "WF360@Pass1012",
      "pin": "1012",
      "lastLogin": "2 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 92
  },
  {
    "id": "13",
    "employeeId": "WF-1013",
    "name": "Sadia Afrin",
    "email": "sadia.afrin@workforce360.com",
    "phone": "+880 1710927212",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "Python Developer",
    "role": "employee",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A-",
    "joiningDate": "4 Aug, 2025",
    "emergencyContact": {
      "name": "Sadia Guardian",
      "relation": "Parent",
      "phone": "+880 1821197859"
    },
    "loginDetails": {
      "username": "sadia.afrin@workforce360.com",
      "defaultPassword": "WF360@Pass1013",
      "pin": "1013",
      "lastLogin": "2 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 93
  },
  {
    "id": "14",
    "employeeId": "WF-1014",
    "name": "Rashedul Islam",
    "email": "rashedul.islam@workforce360.com",
    "phone": "+880 1710998536",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "API Engineer",
    "role": "employee",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B-",
    "joiningDate": "15 Mar, 2023",
    "emergencyContact": {
      "name": "Rashedul Guardian",
      "relation": "Spouse",
      "phone": "+880 1821290002"
    },
    "loginDetails": {
      "username": "rashedul.islam@workforce360.com",
      "defaultPassword": "WF360@Pass1014",
      "pin": "1014",
      "lastLogin": "2 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 94
  },
  {
    "id": "15",
    "employeeId": "WF-1015",
    "name": "Nabila Sultana",
    "email": "nabila.sultana@workforce360.com",
    "phone": "+880 1711069860",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "Mobile Developer",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O-",
    "joiningDate": "26 Oct, 2021",
    "emergencyContact": {
      "name": "Nabila Guardian",
      "relation": "Parent",
      "phone": "+880 1821382145"
    },
    "loginDetails": {
      "username": "nabila.sultana@workforce360.com",
      "defaultPassword": "WF360@Pass1015",
      "pin": "1015",
      "lastLogin": "2 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop",
    "status": "On Leave",
    "attendanceRate": 95
  },
  {
    "id": "16",
    "employeeId": "WF-1016",
    "name": "Zubair Ahmed",
    "email": "zubair.ahmed@workforce360.com",
    "phone": "+880 1711141184",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "Systems Programmer",
    "role": "employee",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "9 May, 2024",
    "emergencyContact": {
      "name": "Zubair Guardian",
      "relation": "Spouse",
      "phone": "+880 1821474288"
    },
    "loginDetails": {
      "username": "zubair.ahmed@workforce360.com",
      "defaultPassword": "WF360@Pass1016",
      "pin": "1016",
      "lastLogin": "2 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 96
  },
  {
    "id": "17",
    "employeeId": "WF-1017",
    "name": "Tasnim Hossain",
    "email": "tasnim.hossain@workforce360.com",
    "phone": "+880 1711212508",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "Cross-Platform Engineer",
    "role": "employee",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A+",
    "joiningDate": "20 Dec, 2022",
    "emergencyContact": {
      "name": "Tasnim Guardian",
      "relation": "Parent",
      "phone": "+880 1821566431"
    },
    "loginDetails": {
      "username": "tasnim.hossain@workforce360.com",
      "defaultPassword": "WF360@Pass1017",
      "pin": "1017",
      "lastLogin": "2 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 97
  },
  {
    "id": "18",
    "employeeId": "WF-1018",
    "name": "Imtiaz Mahmud",
    "email": "imtiaz.mahmud@workforce360.com",
    "phone": "+880 1711283832",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "Security Analyst",
    "role": "employee",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B+",
    "joiningDate": "3 Jul, 2025",
    "emergencyContact": {
      "name": "Imtiaz Guardian",
      "relation": "Spouse",
      "phone": "+880 1821658574"
    },
    "loginDetails": {
      "username": "imtiaz.mahmud@workforce360.com",
      "defaultPassword": "WF360@Pass1018",
      "pin": "1018",
      "lastLogin": "2 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 98
  },
  {
    "id": "19",
    "employeeId": "WF-1019",
    "name": "Afsana Mimi",
    "email": "afsana.mimi@workforce360.com",
    "phone": "+880 1711355156",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "QA Engineer",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O+",
    "joiningDate": "14 Feb, 2023",
    "emergencyContact": {
      "name": "Afsana Guardian",
      "relation": "Parent",
      "phone": "+880 1821750717"
    },
    "loginDetails": {
      "username": "afsana.mimi@workforce360.com",
      "defaultPassword": "WF360@Pass1019",
      "pin": "1019",
      "lastLogin": "2 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 99
  },
  {
    "id": "20",
    "employeeId": "WF-1020",
    "name": "Mahfuzur Rahman",
    "email": "mahfuzur.rahman@workforce360.com",
    "phone": "+880 1711426480",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "Infra Engineer",
    "role": "employee",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "25 Sep, 2021",
    "emergencyContact": {
      "name": "Mahfuzur Guardian",
      "relation": "Spouse",
      "phone": "+880 1821842860"
    },
    "loginDetails": {
      "username": "mahfuzur.rahman@workforce360.com",
      "defaultPassword": "WF360@Pass1020",
      "pin": "1020",
      "lastLogin": "3 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 90
  },
  {
    "id": "21",
    "employeeId": "WF-1021",
    "name": "Joynal Abedin",
    "email": "joynal.abedin@workforce360.com",
    "phone": "+880 1711497804",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "Hardware Systems Engineer",
    "role": "employee",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A-",
    "joiningDate": "8 Apr, 2024",
    "emergencyContact": {
      "name": "Joynal Guardian",
      "relation": "Parent",
      "phone": "+880 1821935003"
    },
    "loginDetails": {
      "username": "joynal.abedin@workforce360.com",
      "defaultPassword": "WF360@Pass1021",
      "pin": "1021",
      "lastLogin": "3 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 91
  },
  {
    "id": "22",
    "employeeId": "WF-1022",
    "name": "Rumana Akter",
    "email": "rumana.akter@workforce360.com",
    "phone": "+880 1711569128",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "Software Engineer",
    "role": "employee",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B-",
    "joiningDate": "19 Nov, 2022",
    "emergencyContact": {
      "name": "Rumana Guardian",
      "relation": "Spouse",
      "phone": "+880 1822027146"
    },
    "loginDetails": {
      "username": "rumana.akter@workforce360.com",
      "defaultPassword": "WF360@Pass1022",
      "pin": "1022",
      "lastLogin": "3 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 92
  },
  {
    "id": "23",
    "employeeId": "WF-1023",
    "name": "Tanmoy Das",
    "email": "tanmoy.das@workforce360.com",
    "phone": "+880 1711640452",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "Linux Admin",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O-",
    "joiningDate": "2 Jun, 2025",
    "emergencyContact": {
      "name": "Tanmoy Guardian",
      "relation": "Parent",
      "phone": "+880 1822119289"
    },
    "loginDetails": {
      "username": "tanmoy.das@workforce360.com",
      "defaultPassword": "WF360@Pass1023",
      "pin": "1023",
      "lastLogin": "3 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 93
  },
  {
    "id": "24",
    "employeeId": "WF-1024",
    "name": "Shuvo Karmakar",
    "email": "shuvo.karmakar@workforce360.com",
    "phone": "+880 1711711776",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "Network Admin",
    "role": "employee",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "13 Jan, 2023",
    "emergencyContact": {
      "name": "Shuvo Guardian",
      "relation": "Spouse",
      "phone": "+880 1822211432"
    },
    "loginDetails": {
      "username": "shuvo.karmakar@workforce360.com",
      "defaultPassword": "WF360@Pass1024",
      "pin": "1024",
      "lastLogin": "3 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 94
  },
  {
    "id": "25",
    "employeeId": "WF-1025",
    "name": "Rifat Bin Alam",
    "email": "rifat.bin.alam@workforce360.com",
    "phone": "+880 1711783100",
    "team": "Engineering & Technology",
    "teamId": "engineering",
    "designation": "DevOps Engineer",
    "role": "employee",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A+",
    "joiningDate": "24 Aug, 2021",
    "emergencyContact": {
      "name": "Rifat Guardian",
      "relation": "Parent",
      "phone": "+880 1822303575"
    },
    "loginDetails": {
      "username": "rifat.bin.alam@workforce360.com",
      "defaultPassword": "WF360@Pass1025",
      "pin": "1025",
      "lastLogin": "3 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 95
  },
  {
    "id": "26",
    "employeeId": "WF-1026",
    "name": "Sadia Islam",
    "email": "sadia.islam@workforce360.com",
    "phone": "+880 1711854424",
    "team": "Product, UI/UX & Design",
    "teamId": "design",
    "designation": "Design Director",
    "role": "manager",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B+",
    "joiningDate": "7 Mar, 2024",
    "emergencyContact": {
      "name": "Sadia Guardian",
      "relation": "Spouse",
      "phone": "+880 1822395718"
    },
    "loginDetails": {
      "username": "sadia.islam@workforce360.com",
      "defaultPassword": "WF360@Pass1026",
      "pin": "1026",
      "lastLogin": "3 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 96
  },
  {
    "id": "27",
    "employeeId": "WF-1027",
    "name": "Rayhan Kabir",
    "email": "rayhan.kabir@workforce360.com",
    "phone": "+880 1711925748",
    "team": "Product, UI/UX & Design",
    "teamId": "design",
    "designation": "Staff Product Manager",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O+",
    "joiningDate": "18 Oct, 2022",
    "emergencyContact": {
      "name": "Rayhan Guardian",
      "relation": "Parent",
      "phone": "+880 1822487861"
    },
    "loginDetails": {
      "username": "rayhan.kabir@workforce360.com",
      "defaultPassword": "WF360@Pass1027",
      "pin": "1027",
      "lastLogin": "3 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 97
  },
  {
    "id": "28",
    "employeeId": "WF-1028",
    "name": "Tasnia Firoz",
    "email": "tasnia.firoz@workforce360.com",
    "phone": "+880 1711997072",
    "team": "Product, UI/UX & Design",
    "teamId": "design",
    "designation": "Lead UX Researcher",
    "role": "employee",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "1 May, 2025",
    "emergencyContact": {
      "name": "Tasnia Guardian",
      "relation": "Spouse",
      "phone": "+880 1822580004"
    },
    "loginDetails": {
      "username": "tasnia.firoz@workforce360.com",
      "defaultPassword": "WF360@Pass1028",
      "pin": "1028",
      "lastLogin": "3 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 98
  },
  {
    "id": "29",
    "employeeId": "WF-1029",
    "name": "Anisur Rahman",
    "email": "anisur.rahman@workforce360.com",
    "phone": "+880 1712068396",
    "team": "Product, UI/UX & Design",
    "teamId": "design",
    "designation": "Design Systems Architect",
    "role": "employee",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A-",
    "joiningDate": "12 Dec, 2023",
    "emergencyContact": {
      "name": "Anisur Guardian",
      "relation": "Parent",
      "phone": "+880 1822672147"
    },
    "loginDetails": {
      "username": "anisur.rahman@workforce360.com",
      "defaultPassword": "WF360@Pass1029",
      "pin": "1029",
      "lastLogin": "3 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 99
  },
  {
    "id": "30",
    "employeeId": "WF-1030",
    "name": "Fariha Zaman",
    "email": "fariha.zaman@workforce360.com",
    "phone": "+880 1712139720",
    "team": "Product, UI/UX & Design",
    "teamId": "design",
    "designation": "UI/UX Designer",
    "role": "employee",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B-",
    "joiningDate": "23 Jul, 2021",
    "emergencyContact": {
      "name": "Fariha Guardian",
      "relation": "Spouse",
      "phone": "+880 1822764290"
    },
    "loginDetails": {
      "username": "fariha.zaman@workforce360.com",
      "defaultPassword": "WF360@Pass1030",
      "pin": "1030",
      "lastLogin": "4 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop",
    "status": "On Leave",
    "attendanceRate": 90
  },
  {
    "id": "31",
    "employeeId": "WF-1031",
    "name": "Sifat Ullah",
    "email": "sifat.ullah@workforce360.com",
    "phone": "+880 1712211044",
    "team": "Product, UI/UX & Design",
    "teamId": "design",
    "designation": "Product Owner",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O-",
    "joiningDate": "6 Feb, 2024",
    "emergencyContact": {
      "name": "Sifat Guardian",
      "relation": "Parent",
      "phone": "+880 1822856433"
    },
    "loginDetails": {
      "username": "sifat.ullah@workforce360.com",
      "defaultPassword": "WF360@Pass1031",
      "pin": "1031",
      "lastLogin": "4 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 91
  },
  {
    "id": "32",
    "employeeId": "WF-1032",
    "name": "Sumaiya Akhtar",
    "email": "sumaiya.akhtar@workforce360.com",
    "phone": "+880 1712282368",
    "team": "Product, UI/UX & Design",
    "teamId": "design",
    "designation": "Motion Designer",
    "role": "employee",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "17 Sep, 2022",
    "emergencyContact": {
      "name": "Sumaiya Guardian",
      "relation": "Spouse",
      "phone": "+880 1822948576"
    },
    "loginDetails": {
      "username": "sumaiya.akhtar@workforce360.com",
      "defaultPassword": "WF360@Pass1032",
      "pin": "1032",
      "lastLogin": "4 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 92
  },
  {
    "id": "33",
    "employeeId": "WF-1033",
    "name": "Nazmus Sakib",
    "email": "nazmus.sakib@workforce360.com",
    "phone": "+880 1712353692",
    "team": "Product, UI/UX & Design",
    "teamId": "design",
    "designation": "Brand Designer",
    "role": "employee",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A+",
    "joiningDate": "28 Apr, 2025",
    "emergencyContact": {
      "name": "Nazmus Guardian",
      "relation": "Parent",
      "phone": "+880 1823040719"
    },
    "loginDetails": {
      "username": "nazmus.sakib@workforce360.com",
      "defaultPassword": "WF360@Pass1033",
      "pin": "1033",
      "lastLogin": "4 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 93
  },
  {
    "id": "34",
    "employeeId": "WF-1034",
    "name": "Munira Khatun",
    "email": "munira.khatun@workforce360.com",
    "phone": "+880 1712425016",
    "team": "Product, UI/UX & Design",
    "teamId": "design",
    "designation": "Accessibility Specialist",
    "role": "employee",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B+",
    "joiningDate": "11 Nov, 2023",
    "emergencyContact": {
      "name": "Munira Guardian",
      "relation": "Spouse",
      "phone": "+880 1823132862"
    },
    "loginDetails": {
      "username": "munira.khatun@workforce360.com",
      "defaultPassword": "WF360@Pass1034",
      "pin": "1034",
      "lastLogin": "4 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 94
  },
  {
    "id": "35",
    "employeeId": "WF-1035",
    "name": "Ashraful Haque",
    "email": "ashraful.haque@workforce360.com",
    "phone": "+880 1712496340",
    "team": "Product, UI/UX & Design",
    "teamId": "design",
    "designation": "UX Content Strategist",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O+",
    "joiningDate": "22 Jun, 2021",
    "emergencyContact": {
      "name": "Ashraful Guardian",
      "relation": "Parent",
      "phone": "+880 1823225005"
    },
    "loginDetails": {
      "username": "ashraful.haque@workforce360.com",
      "defaultPassword": "WF360@Pass1035",
      "pin": "1035",
      "lastLogin": "4 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 95
  },
  {
    "id": "36",
    "employeeId": "WF-1036",
    "name": "Dilruba Shampa",
    "email": "dilruba.shampa@workforce360.com",
    "phone": "+880 1712567664",
    "team": "Product, UI/UX & Design",
    "teamId": "design",
    "designation": "Information Architect",
    "role": "employee",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "5 Jan, 2024",
    "emergencyContact": {
      "name": "Dilruba Guardian",
      "relation": "Spouse",
      "phone": "+880 1823317148"
    },
    "loginDetails": {
      "username": "dilruba.shampa@workforce360.com",
      "defaultPassword": "WF360@Pass1036",
      "pin": "1036",
      "lastLogin": "4 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 96
  },
  {
    "id": "37",
    "employeeId": "WF-1037",
    "name": "Rubel Mia",
    "email": "rubel.mia@workforce360.com",
    "phone": "+880 1712638988",
    "team": "Product, UI/UX & Design",
    "teamId": "design",
    "designation": "Visual Asset Designer",
    "role": "employee",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A-",
    "joiningDate": "16 Aug, 2022",
    "emergencyContact": {
      "name": "Rubel Guardian",
      "relation": "Parent",
      "phone": "+880 1823409291"
    },
    "loginDetails": {
      "username": "rubel.mia@workforce360.com",
      "defaultPassword": "WF360@Pass1037",
      "pin": "1037",
      "lastLogin": "4 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 97
  },
  {
    "id": "38",
    "employeeId": "WF-1038",
    "name": "Samira Tanjim",
    "email": "samira.tanjim@workforce360.com",
    "phone": "+880 1712710312",
    "team": "Product, UI/UX & Design",
    "teamId": "design",
    "designation": "UI Designer",
    "role": "employee",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B-",
    "joiningDate": "27 Mar, 2025",
    "emergencyContact": {
      "name": "Samira Guardian",
      "relation": "Spouse",
      "phone": "+880 1823501434"
    },
    "loginDetails": {
      "username": "samira.tanjim@workforce360.com",
      "defaultPassword": "WF360@Pass1038",
      "pin": "1038",
      "lastLogin": "4 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 98
  },
  {
    "id": "39",
    "employeeId": "WF-1039",
    "name": "Kazi Asif",
    "email": "kazi.asif@workforce360.com",
    "phone": "+880 1712781636",
    "team": "Product, UI/UX & Design",
    "teamId": "design",
    "designation": "Product Data Analyst",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O-",
    "joiningDate": "10 Oct, 2023",
    "emergencyContact": {
      "name": "Kazi Guardian",
      "relation": "Parent",
      "phone": "+880 1823593577"
    },
    "loginDetails": {
      "username": "kazi.asif@workforce360.com",
      "defaultPassword": "WF360@Pass1039",
      "pin": "1039",
      "lastLogin": "4 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 99
  },
  {
    "id": "40",
    "employeeId": "WF-1040",
    "name": "Farzana Bobby",
    "email": "farzana.bobby@workforce360.com",
    "phone": "+880 1712852960",
    "team": "Product, UI/UX & Design",
    "teamId": "design",
    "designation": "UX Researcher",
    "role": "employee",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "21 May, 2021",
    "emergencyContact": {
      "name": "Farzana Guardian",
      "relation": "Spouse",
      "phone": "+880 1823685720"
    },
    "loginDetails": {
      "username": "farzana.bobby@workforce360.com",
      "defaultPassword": "WF360@Pass1040",
      "pin": "1040",
      "lastLogin": "5 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 90
  },
  {
    "id": "41",
    "employeeId": "WF-1041",
    "name": "Shamsul Arefin",
    "email": "shamsul.arefin@workforce360.com",
    "phone": "+880 1712924284",
    "team": "Product, UI/UX & Design",
    "teamId": "design",
    "designation": "UI Prototyper",
    "role": "employee",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A+",
    "joiningDate": "4 Dec, 2024",
    "emergencyContact": {
      "name": "Shamsul Guardian",
      "relation": "Parent",
      "phone": "+880 1823777863"
    },
    "loginDetails": {
      "username": "shamsul.arefin@workforce360.com",
      "defaultPassword": "WF360@Pass1041",
      "pin": "1041",
      "lastLogin": "5 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 91
  },
  {
    "id": "42",
    "employeeId": "WF-1042",
    "name": "Nayla Tarannum",
    "email": "nayla.tarannum@workforce360.com",
    "phone": "+880 1712995608",
    "team": "Product, UI/UX & Design",
    "teamId": "design",
    "designation": "Interactive Designer",
    "role": "employee",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B+",
    "joiningDate": "15 Jul, 2022",
    "emergencyContact": {
      "name": "Nayla Guardian",
      "relation": "Spouse",
      "phone": "+880 1823870006"
    },
    "loginDetails": {
      "username": "nayla.tarannum@workforce360.com",
      "defaultPassword": "WF360@Pass1042",
      "pin": "1042",
      "lastLogin": "5 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 92
  },
  {
    "id": "43",
    "employeeId": "WF-1043",
    "name": "Jashim Uddin",
    "email": "jashim.uddin@workforce360.com",
    "phone": "+880 1713066932",
    "team": "Product, UI/UX & Design",
    "teamId": "design",
    "designation": "DesignOps Manager",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O+",
    "joiningDate": "26 Feb, 2025",
    "emergencyContact": {
      "name": "Jashim Guardian",
      "relation": "Parent",
      "phone": "+880 1823962149"
    },
    "loginDetails": {
      "username": "jashim.uddin@workforce360.com",
      "defaultPassword": "WF360@Pass1043",
      "pin": "1043",
      "lastLogin": "5 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 93
  },
  {
    "id": "44",
    "employeeId": "WF-1044",
    "name": "Shirin Sharmin",
    "email": "shirin.sharmin@workforce360.com",
    "phone": "+880 1713138256",
    "team": "Product, UI/UX & Design",
    "teamId": "design",
    "designation": "Mobile UX Designer",
    "role": "employee",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "9 Sep, 2023",
    "emergencyContact": {
      "name": "Shirin Guardian",
      "relation": "Spouse",
      "phone": "+880 1824054292"
    },
    "loginDetails": {
      "username": "shirin.sharmin@workforce360.com",
      "defaultPassword": "WF360@Pass1044",
      "pin": "1044",
      "lastLogin": "5 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 94
  },
  {
    "id": "45",
    "employeeId": "WF-1045",
    "name": "Touhidul Islam",
    "email": "touhidul.islam@workforce360.com",
    "phone": "+880 1713209580",
    "team": "Product, UI/UX & Design",
    "teamId": "design",
    "designation": "Associate PM",
    "role": "employee",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A-",
    "joiningDate": "20 Apr, 2021",
    "emergencyContact": {
      "name": "Touhidul Guardian",
      "relation": "Parent",
      "phone": "+880 1824146435"
    },
    "loginDetails": {
      "username": "touhidul.islam@workforce360.com",
      "defaultPassword": "WF360@Pass1045",
      "pin": "1045",
      "lastLogin": "5 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop",
    "status": "On Leave",
    "attendanceRate": 95
  },
  {
    "id": "46",
    "employeeId": "WF-1046",
    "name": "Nusrat Jahan",
    "email": "nusrat.jahan@workforce360.com",
    "phone": "+880 1713280904",
    "team": "Human Resources & Talent Operations",
    "teamId": "hr",
    "designation": "HR Director",
    "role": "hr_admin",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B-",
    "joiningDate": "3 Nov, 2024",
    "emergencyContact": {
      "name": "Nusrat Guardian",
      "relation": "Spouse",
      "phone": "+880 1824238578"
    },
    "loginDetails": {
      "username": "nusrat.jahan@workforce360.com",
      "defaultPassword": "WF360@Pass1046",
      "pin": "1046",
      "lastLogin": "5 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 96
  },
  {
    "id": "47",
    "employeeId": "WF-1047",
    "name": "Kamrun Nahar",
    "email": "kamrun.nahar@workforce360.com",
    "phone": "+880 1713352228",
    "team": "Human Resources & Talent Operations",
    "teamId": "hr",
    "designation": "Recruitment Lead",
    "role": "hr_admin",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O-",
    "joiningDate": "14 Jun, 2022",
    "emergencyContact": {
      "name": "Kamrun Guardian",
      "relation": "Parent",
      "phone": "+880 1824330721"
    },
    "loginDetails": {
      "username": "kamrun.nahar@workforce360.com",
      "defaultPassword": "WF360@Pass1047",
      "pin": "1047",
      "lastLogin": "5 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 97
  },
  {
    "id": "48",
    "employeeId": "WF-1048",
    "name": "Saifuddin Ahmed",
    "email": "saifuddin.ahmed@workforce360.com",
    "phone": "+880 1713423552",
    "team": "Human Resources & Talent Operations",
    "teamId": "hr",
    "designation": "People Ops Manager",
    "role": "hr_admin",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "25 Jan, 2025",
    "emergencyContact": {
      "name": "Saifuddin Guardian",
      "relation": "Spouse",
      "phone": "+880 1824422864"
    },
    "loginDetails": {
      "username": "saifuddin.ahmed@workforce360.com",
      "defaultPassword": "WF360@Pass1048",
      "pin": "1048",
      "lastLogin": "5 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 98
  },
  {
    "id": "49",
    "employeeId": "WF-1049",
    "name": "Tania Parveen",
    "email": "tania.parveen@workforce360.com",
    "phone": "+880 1713494876",
    "team": "Human Resources & Talent Operations",
    "teamId": "hr",
    "designation": "Employee Relations",
    "role": "employee",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A+",
    "joiningDate": "8 Aug, 2023",
    "emergencyContact": {
      "name": "Tania Guardian",
      "relation": "Parent",
      "phone": "+880 1824515007"
    },
    "loginDetails": {
      "username": "tania.parveen@workforce360.com",
      "defaultPassword": "WF360@Pass1049",
      "pin": "1049",
      "lastLogin": "5 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 99
  },
  {
    "id": "50",
    "employeeId": "WF-1050",
    "name": "Mokhlesur Rahman",
    "email": "mokhlesur.rahman@workforce360.com",
    "phone": "+880 1713566200",
    "team": "Human Resources & Talent Operations",
    "teamId": "hr",
    "designation": "L&D Manager",
    "role": "employee",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B+",
    "joiningDate": "19 Mar, 2021",
    "emergencyContact": {
      "name": "Mokhlesur Guardian",
      "relation": "Spouse",
      "phone": "+880 1824607150"
    },
    "loginDetails": {
      "username": "mokhlesur.rahman@workforce360.com",
      "defaultPassword": "WF360@Pass1050",
      "pin": "1050",
      "lastLogin": "6 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 90
  },
  {
    "id": "51",
    "employeeId": "WF-1051",
    "name": "Nasrin Akter",
    "email": "nasrin.akter@workforce360.com",
    "phone": "+880 1713637524",
    "team": "Human Resources & Talent Operations",
    "teamId": "hr",
    "designation": "Compliance Officer",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O+",
    "joiningDate": "2 Oct, 2024",
    "emergencyContact": {
      "name": "Nasrin Guardian",
      "relation": "Parent",
      "phone": "+880 1824699293"
    },
    "loginDetails": {
      "username": "nasrin.akter@workforce360.com",
      "defaultPassword": "WF360@Pass1051",
      "pin": "1051",
      "lastLogin": "6 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 91
  },
  {
    "id": "52",
    "employeeId": "WF-1052",
    "name": "Belal Hossain",
    "email": "belal.hossain@workforce360.com",
    "phone": "+880 1713708848",
    "team": "Human Resources & Talent Operations",
    "teamId": "hr",
    "designation": "Onboarding Specialist",
    "role": "employee",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "13 May, 2022",
    "emergencyContact": {
      "name": "Belal Guardian",
      "relation": "Spouse",
      "phone": "+880 1824791436"
    },
    "loginDetails": {
      "username": "belal.hossain@workforce360.com",
      "defaultPassword": "WF360@Pass1052",
      "pin": "1052",
      "lastLogin": "6 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 92
  },
  {
    "id": "53",
    "employeeId": "WF-1053",
    "name": "Sharmin Sultana",
    "email": "sharmin.sultana@workforce360.com",
    "phone": "+880 1713780172",
    "team": "Human Resources & Talent Operations",
    "teamId": "hr",
    "designation": "Wellbeing Partner",
    "role": "employee",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A-",
    "joiningDate": "24 Dec, 2025",
    "emergencyContact": {
      "name": "Sharmin Guardian",
      "relation": "Parent",
      "phone": "+880 1824883579"
    },
    "loginDetails": {
      "username": "sharmin.sultana@workforce360.com",
      "defaultPassword": "WF360@Pass1053",
      "pin": "1053",
      "lastLogin": "6 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 93
  },
  {
    "id": "54",
    "employeeId": "WF-1054",
    "name": "Atiqul Islam",
    "email": "atiqul.islam@workforce360.com",
    "phone": "+880 1713851496",
    "team": "Human Resources & Talent Operations",
    "teamId": "hr",
    "designation": "Facility & Admin Lead",
    "role": "employee",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B-",
    "joiningDate": "7 Jul, 2023",
    "emergencyContact": {
      "name": "Atiqul Guardian",
      "relation": "Spouse",
      "phone": "+880 1824975722"
    },
    "loginDetails": {
      "username": "atiqul.islam@workforce360.com",
      "defaultPassword": "WF360@Pass1054",
      "pin": "1054",
      "lastLogin": "6 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 94
  },
  {
    "id": "55",
    "employeeId": "WF-1055",
    "name": "Farhana Haque",
    "email": "farhana.haque@workforce360.com",
    "phone": "+880 1713922820",
    "team": "Human Resources & Talent Operations",
    "teamId": "hr",
    "designation": "Compensation Analyst",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O-",
    "joiningDate": "18 Feb, 2021",
    "emergencyContact": {
      "name": "Farhana Guardian",
      "relation": "Parent",
      "phone": "+880 1825067865"
    },
    "loginDetails": {
      "username": "farhana.haque@workforce360.com",
      "defaultPassword": "WF360@Pass1055",
      "pin": "1055",
      "lastLogin": "6 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 95
  },
  {
    "id": "56",
    "employeeId": "WF-1056",
    "name": "Ziaur Rahman",
    "email": "ziaur.rahman@workforce360.com",
    "phone": "+880 1713994144",
    "team": "Human Resources & Talent Operations",
    "teamId": "hr",
    "designation": "People Analytics Specialist",
    "role": "employee",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "1 Sep, 2024",
    "emergencyContact": {
      "name": "Ziaur Guardian",
      "relation": "Spouse",
      "phone": "+880 1825160008"
    },
    "loginDetails": {
      "username": "ziaur.rahman@workforce360.com",
      "defaultPassword": "WF360@Pass1056",
      "pin": "1056",
      "lastLogin": "6 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 96
  },
  {
    "id": "57",
    "employeeId": "WF-1057",
    "name": "Pervin Sultana",
    "email": "pervin.sultana@workforce360.com",
    "phone": "+880 1714065468",
    "team": "Human Resources & Talent Operations",
    "teamId": "hr",
    "designation": "Technical Recruiter",
    "role": "employee",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A+",
    "joiningDate": "12 Apr, 2022",
    "emergencyContact": {
      "name": "Pervin Guardian",
      "relation": "Parent",
      "phone": "+880 1825252151"
    },
    "loginDetails": {
      "username": "pervin.sultana@workforce360.com",
      "defaultPassword": "WF360@Pass1057",
      "pin": "1057",
      "lastLogin": "6 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 97
  },
  {
    "id": "58",
    "employeeId": "WF-1058",
    "name": "Monirul Islam",
    "email": "monirul.islam@workforce360.com",
    "phone": "+880 1714136792",
    "team": "Human Resources & Talent Operations",
    "teamId": "hr",
    "designation": "Admin & Infrastructure",
    "role": "employee",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B+",
    "joiningDate": "23 Nov, 2025",
    "emergencyContact": {
      "name": "Monirul Guardian",
      "relation": "Spouse",
      "phone": "+880 1825344294"
    },
    "loginDetails": {
      "username": "monirul.islam@workforce360.com",
      "defaultPassword": "WF360@Pass1058",
      "pin": "1058",
      "lastLogin": "6 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 98
  },
  {
    "id": "59",
    "employeeId": "WF-1059",
    "name": "Sabina Yasmin",
    "email": "sabina.yasmin@workforce360.com",
    "phone": "+880 1714208116",
    "team": "Human Resources & Talent Operations",
    "teamId": "hr",
    "designation": "Internal Culture Partner",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O+",
    "joiningDate": "6 Jun, 2023",
    "emergencyContact": {
      "name": "Sabina Guardian",
      "relation": "Parent",
      "phone": "+880 1825436437"
    },
    "loginDetails": {
      "username": "sabina.yasmin@workforce360.com",
      "defaultPassword": "WF360@Pass1059",
      "pin": "1059",
      "lastLogin": "6 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 99
  },
  {
    "id": "60",
    "employeeId": "WF-1060",
    "name": "Muntasir Billah",
    "email": "muntasir.billah@workforce360.com",
    "phone": "+880 1714279440",
    "team": "Human Resources & Talent Operations",
    "teamId": "hr",
    "designation": "HR Generalist",
    "role": "employee",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "17 Jan, 2021",
    "emergencyContact": {
      "name": "Muntasir Guardian",
      "relation": "Spouse",
      "phone": "+880 1825528580"
    },
    "loginDetails": {
      "username": "muntasir.billah@workforce360.com",
      "defaultPassword": "WF360@Pass1060",
      "pin": "1060",
      "lastLogin": "7 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop",
    "status": "On Leave",
    "attendanceRate": 90
  },
  {
    "id": "61",
    "employeeId": "WF-1061",
    "name": "Jesmin Ara",
    "email": "jesmin.ara@workforce360.com",
    "phone": "+880 1714350764",
    "team": "Human Resources & Talent Operations",
    "teamId": "hr",
    "designation": "Time & Attendance Officer",
    "role": "employee",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A-",
    "joiningDate": "28 Aug, 2024",
    "emergencyContact": {
      "name": "Jesmin Guardian",
      "relation": "Parent",
      "phone": "+880 1825620723"
    },
    "loginDetails": {
      "username": "jesmin.ara@workforce360.com",
      "defaultPassword": "WF360@Pass1061",
      "pin": "1061",
      "lastLogin": "7 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 91
  },
  {
    "id": "62",
    "employeeId": "WF-1062",
    "name": "Anwar Hossain",
    "email": "anwar.hossain@workforce360.com",
    "phone": "+880 1714422088",
    "team": "Human Resources & Talent Operations",
    "teamId": "hr",
    "designation": "Administrative Executive",
    "role": "employee",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B-",
    "joiningDate": "11 Mar, 2022",
    "emergencyContact": {
      "name": "Anwar Guardian",
      "relation": "Spouse",
      "phone": "+880 1825712866"
    },
    "loginDetails": {
      "username": "anwar.hossain@workforce360.com",
      "defaultPassword": "WF360@Pass1062",
      "pin": "1062",
      "lastLogin": "7 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 92
  },
  {
    "id": "63",
    "employeeId": "WF-1063",
    "name": "Nilufar Yasmin",
    "email": "nilufar.yasmin@workforce360.com",
    "phone": "+880 1714493412",
    "team": "Human Resources & Talent Operations",
    "teamId": "hr",
    "designation": "Engagement Manager",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O-",
    "joiningDate": "22 Oct, 2025",
    "emergencyContact": {
      "name": "Nilufar Guardian",
      "relation": "Parent",
      "phone": "+880 1825805009"
    },
    "loginDetails": {
      "username": "nilufar.yasmin@workforce360.com",
      "defaultPassword": "WF360@Pass1063",
      "pin": "1063",
      "lastLogin": "7 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 93
  },
  {
    "id": "64",
    "employeeId": "WF-1064",
    "name": "Kamrul Ahsan",
    "email": "kamrul.ahsan@workforce360.com",
    "phone": "+880 1714564736",
    "team": "Finance, Payroll & Accounts",
    "teamId": "finance",
    "designation": "CFO / Finance Director",
    "role": "company_admin",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "5 May, 2023",
    "emergencyContact": {
      "name": "Kamrul Guardian",
      "relation": "Spouse",
      "phone": "+880 1825897152"
    },
    "loginDetails": {
      "username": "kamrul.ahsan@workforce360.com",
      "defaultPassword": "WF360@Pass1064",
      "pin": "1064",
      "lastLogin": "7 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 94
  },
  {
    "id": "65",
    "employeeId": "WF-1065",
    "name": "Md. Zahidul Islam",
    "email": "md.zahidul.islam@workforce360.com",
    "phone": "+880 1714636060",
    "team": "Finance, Payroll & Accounts",
    "teamId": "finance",
    "designation": "Accounts Head",
    "role": "employee",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A+",
    "joiningDate": "16 Dec, 2021",
    "emergencyContact": {
      "name": "Md. Guardian",
      "relation": "Parent",
      "phone": "+880 1825989295"
    },
    "loginDetails": {
      "username": "md.zahidul.islam@workforce360.com",
      "defaultPassword": "WF360@Pass1065",
      "pin": "1065",
      "lastLogin": "7 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 95
  },
  {
    "id": "66",
    "employeeId": "WF-1066",
    "name": "Fatema Begum",
    "email": "fatema.begum@workforce360.com",
    "phone": "+880 1714707384",
    "team": "Finance, Payroll & Accounts",
    "teamId": "finance",
    "designation": "Senior Payroll Manager",
    "role": "employee",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B+",
    "joiningDate": "27 Jul, 2024",
    "emergencyContact": {
      "name": "Fatema Guardian",
      "relation": "Spouse",
      "phone": "+880 1826081438"
    },
    "loginDetails": {
      "username": "fatema.begum@workforce360.com",
      "defaultPassword": "WF360@Pass1066",
      "pin": "1066",
      "lastLogin": "7 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 96
  },
  {
    "id": "67",
    "employeeId": "WF-1067",
    "name": "Habibur Rahman",
    "email": "habibur.rahman@workforce360.com",
    "phone": "+880 1714778708",
    "team": "Finance, Payroll & Accounts",
    "teamId": "finance",
    "designation": "Tax & Compliance Advisor",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O+",
    "joiningDate": "10 Feb, 2022",
    "emergencyContact": {
      "name": "Habibur Guardian",
      "relation": "Parent",
      "phone": "+880 1826173581"
    },
    "loginDetails": {
      "username": "habibur.rahman@workforce360.com",
      "defaultPassword": "WF360@Pass1067",
      "pin": "1067",
      "lastLogin": "7 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 97
  },
  {
    "id": "68",
    "employeeId": "WF-1068",
    "name": "Shahnaz Parvin",
    "email": "shahnaz.parvin@workforce360.com",
    "phone": "+880 1714850032",
    "team": "Finance, Payroll & Accounts",
    "teamId": "finance",
    "designation": "Treasury Specialist",
    "role": "employee",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "21 Sep, 2025",
    "emergencyContact": {
      "name": "Shahnaz Guardian",
      "relation": "Spouse",
      "phone": "+880 1826265724"
    },
    "loginDetails": {
      "username": "shahnaz.parvin@workforce360.com",
      "defaultPassword": "WF360@Pass1068",
      "pin": "1068",
      "lastLogin": "7 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 98
  },
  {
    "id": "69",
    "employeeId": "WF-1069",
    "name": "Rezaul Karim",
    "email": "rezaul.karim@workforce360.com",
    "phone": "+880 1714921356",
    "team": "Finance, Payroll & Accounts",
    "teamId": "finance",
    "designation": "Billing Lead",
    "role": "employee",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A-",
    "joiningDate": "4 Apr, 2023",
    "emergencyContact": {
      "name": "Rezaul Guardian",
      "relation": "Parent",
      "phone": "+880 1826357867"
    },
    "loginDetails": {
      "username": "rezaul.karim@workforce360.com",
      "defaultPassword": "WF360@Pass1069",
      "pin": "1069",
      "lastLogin": "7 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 99
  },
  {
    "id": "70",
    "employeeId": "WF-1070",
    "name": "Morshed Alam",
    "email": "morshed.alam@workforce360.com",
    "phone": "+880 1714992680",
    "team": "Finance, Payroll & Accounts",
    "teamId": "finance",
    "designation": "Commercial Procurement Head",
    "role": "employee",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B-",
    "joiningDate": "15 Nov, 2021",
    "emergencyContact": {
      "name": "Morshed Guardian",
      "relation": "Spouse",
      "phone": "+880 1826450010"
    },
    "loginDetails": {
      "username": "morshed.alam@workforce360.com",
      "defaultPassword": "WF360@Pass1070",
      "pin": "1070",
      "lastLogin": "8 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 90
  },
  {
    "id": "71",
    "employeeId": "WF-1071",
    "name": "Parveen Akhtar",
    "email": "parveen.akhtar@workforce360.com",
    "phone": "+880 1715064004",
    "team": "Finance, Payroll & Accounts",
    "teamId": "finance",
    "designation": "Banking Disbursement Specialist",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O-",
    "joiningDate": "26 Jun, 2024",
    "emergencyContact": {
      "name": "Parveen Guardian",
      "relation": "Parent",
      "phone": "+880 1826542153"
    },
    "loginDetails": {
      "username": "parveen.akhtar@workforce360.com",
      "defaultPassword": "WF360@Pass1071",
      "pin": "1071",
      "lastLogin": "8 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 91
  },
  {
    "id": "72",
    "employeeId": "WF-1072",
    "name": "Selim Reza",
    "email": "selim.reza@workforce360.com",
    "phone": "+880 1715135328",
    "team": "Finance, Payroll & Accounts",
    "teamId": "finance",
    "designation": "Risk & Strategy Analyst",
    "role": "employee",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "9 Jan, 2022",
    "emergencyContact": {
      "name": "Selim Guardian",
      "relation": "Spouse",
      "phone": "+880 1826634296"
    },
    "loginDetails": {
      "username": "selim.reza@workforce360.com",
      "defaultPassword": "WF360@Pass1072",
      "pin": "1072",
      "lastLogin": "8 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 92
  },
  {
    "id": "73",
    "employeeId": "WF-1073",
    "name": "Shahinur Rahman",
    "email": "shahinur.rahman@workforce360.com",
    "phone": "+880 1715206652",
    "team": "Finance, Payroll & Accounts",
    "teamId": "finance",
    "designation": "Accounts Payable Specialist",
    "role": "employee",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A+",
    "joiningDate": "20 Aug, 2025",
    "emergencyContact": {
      "name": "Shahinur Guardian",
      "relation": "Parent",
      "phone": "+880 1826726439"
    },
    "loginDetails": {
      "username": "shahinur.rahman@workforce360.com",
      "defaultPassword": "WF360@Pass1073",
      "pin": "1073",
      "lastLogin": "8 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 93
  },
  {
    "id": "74",
    "employeeId": "WF-1074",
    "name": "Nazma Begum",
    "email": "nazma.begum@workforce360.com",
    "phone": "+880 1715277976",
    "team": "Finance, Payroll & Accounts",
    "teamId": "finance",
    "designation": "Accounts Receivable Specialist",
    "role": "employee",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B+",
    "joiningDate": "3 Mar, 2023",
    "emergencyContact": {
      "name": "Nazma Guardian",
      "relation": "Spouse",
      "phone": "+880 1826818582"
    },
    "loginDetails": {
      "username": "nazma.begum@workforce360.com",
      "defaultPassword": "WF360@Pass1074",
      "pin": "1074",
      "lastLogin": "8 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 94
  },
  {
    "id": "75",
    "employeeId": "WF-1075",
    "name": "Tariqul Islam",
    "email": "tariqul.islam@workforce360.com",
    "phone": "+880 1715349300",
    "team": "Finance, Payroll & Accounts",
    "teamId": "finance",
    "designation": "Reimbursement Auditor",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O+",
    "joiningDate": "14 Oct, 2021",
    "emergencyContact": {
      "name": "Tariqul Guardian",
      "relation": "Parent",
      "phone": "+880 1826910725"
    },
    "loginDetails": {
      "username": "tariqul.islam@workforce360.com",
      "defaultPassword": "WF360@Pass1075",
      "pin": "1075",
      "lastLogin": "8 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop",
    "status": "On Leave",
    "attendanceRate": 95
  },
  {
    "id": "76",
    "employeeId": "WF-1076",
    "name": "Rina Begum",
    "email": "rina.begum@workforce360.com",
    "phone": "+880 1715420624",
    "team": "Finance, Payroll & Accounts",
    "teamId": "finance",
    "designation": "Audit Officer",
    "role": "employee",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "25 May, 2024",
    "emergencyContact": {
      "name": "Rina Guardian",
      "relation": "Spouse",
      "phone": "+880 1827002868"
    },
    "loginDetails": {
      "username": "rina.begum@workforce360.com",
      "defaultPassword": "WF360@Pass1076",
      "pin": "1076",
      "lastLogin": "8 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 96
  },
  {
    "id": "77",
    "employeeId": "WF-1077",
    "name": "Enamul Haque",
    "email": "enamul.haque@workforce360.com",
    "phone": "+880 1715491948",
    "team": "Finance, Payroll & Accounts",
    "teamId": "finance",
    "designation": "Corporate Banking Specialist",
    "role": "employee",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A-",
    "joiningDate": "8 Dec, 2022",
    "emergencyContact": {
      "name": "Enamul Guardian",
      "relation": "Parent",
      "phone": "+880 1827095011"
    },
    "loginDetails": {
      "username": "enamul.haque@workforce360.com",
      "defaultPassword": "WF360@Pass1077",
      "pin": "1077",
      "lastLogin": "8 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 97
  },
  {
    "id": "78",
    "employeeId": "WF-1078",
    "name": "Hasina Akhter",
    "email": "hasina.akhter@workforce360.com",
    "phone": "+880 1715563272",
    "team": "Finance, Payroll & Accounts",
    "teamId": "finance",
    "designation": "Financial Controller",
    "role": "employee",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B-",
    "joiningDate": "19 Jul, 2025",
    "emergencyContact": {
      "name": "Hasina Guardian",
      "relation": "Spouse",
      "phone": "+880 1827187154"
    },
    "loginDetails": {
      "username": "hasina.akhter@workforce360.com",
      "defaultPassword": "WF360@Pass1078",
      "pin": "1078",
      "lastLogin": "8 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 98
  },
  {
    "id": "79",
    "employeeId": "WF-1079",
    "name": "Liton Kumar",
    "email": "liton.kumar@workforce360.com",
    "phone": "+880 1715634596",
    "team": "Finance, Payroll & Accounts",
    "teamId": "finance",
    "designation": "Assistant Accountant",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O-",
    "joiningDate": "2 Feb, 2023",
    "emergencyContact": {
      "name": "Liton Guardian",
      "relation": "Parent",
      "phone": "+880 1827279297"
    },
    "loginDetails": {
      "username": "liton.kumar@workforce360.com",
      "defaultPassword": "WF360@Pass1079",
      "pin": "1079",
      "lastLogin": "8 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 99
  },
  {
    "id": "80",
    "employeeId": "WF-1080",
    "name": "Anwara Khatun",
    "email": "anwara.khatun@workforce360.com",
    "phone": "+880 1715705920",
    "team": "Finance, Payroll & Accounts",
    "teamId": "finance",
    "designation": "Payroll Associate",
    "role": "employee",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "13 Sep, 2021",
    "emergencyContact": {
      "name": "Anwara Guardian",
      "relation": "Spouse",
      "phone": "+880 1827371440"
    },
    "loginDetails": {
      "username": "anwara.khatun@workforce360.com",
      "defaultPassword": "WF360@Pass1080",
      "pin": "1080",
      "lastLogin": "9 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 90
  },
  {
    "id": "81",
    "employeeId": "WF-1081",
    "name": "Asif Iqbal",
    "email": "asif.iqbal@workforce360.com",
    "phone": "+880 1715777244",
    "team": "Sales, Marketing & Customer Success",
    "teamId": "sales",
    "designation": "Growth Director",
    "role": "manager",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A+",
    "joiningDate": "24 Apr, 2024",
    "emergencyContact": {
      "name": "Asif Guardian",
      "relation": "Parent",
      "phone": "+880 1827463583"
    },
    "loginDetails": {
      "username": "asif.iqbal@workforce360.com",
      "defaultPassword": "WF360@Pass1081",
      "pin": "1081",
      "lastLogin": "9 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 91
  },
  {
    "id": "82",
    "employeeId": "WF-1082",
    "name": "Farhan Kabir",
    "email": "farhan.kabir@workforce360.com",
    "phone": "+880 1715848568",
    "team": "Sales, Marketing & Customer Success",
    "teamId": "sales",
    "designation": "Enterprise Sales Head",
    "role": "employee",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B+",
    "joiningDate": "7 Nov, 2022",
    "emergencyContact": {
      "name": "Farhan Guardian",
      "relation": "Spouse",
      "phone": "+880 1827555726"
    },
    "loginDetails": {
      "username": "farhan.kabir@workforce360.com",
      "defaultPassword": "WF360@Pass1082",
      "pin": "1082",
      "lastLogin": "9 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 92
  },
  {
    "id": "83",
    "employeeId": "WF-1083",
    "name": "Shamima Nasrin",
    "email": "shamima.nasrin@workforce360.com",
    "phone": "+880 1715919892",
    "team": "Sales, Marketing & Customer Success",
    "teamId": "sales",
    "designation": "Marketing Lead",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O+",
    "joiningDate": "18 Jun, 2025",
    "emergencyContact": {
      "name": "Shamima Guardian",
      "relation": "Parent",
      "phone": "+880 1827647869"
    },
    "loginDetails": {
      "username": "shamima.nasrin@workforce360.com",
      "defaultPassword": "WF360@Pass1083",
      "pin": "1083",
      "lastLogin": "9 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 93
  },
  {
    "id": "84",
    "employeeId": "WF-1084",
    "name": "Babul Mia",
    "email": "babul.mia@workforce360.com",
    "phone": "+880 1715991216",
    "team": "Sales, Marketing & Customer Success",
    "teamId": "sales",
    "designation": "Regional Sales Manager",
    "role": "employee",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "1 Jan, 2023",
    "emergencyContact": {
      "name": "Babul Guardian",
      "relation": "Spouse",
      "phone": "+880 1827740012"
    },
    "loginDetails": {
      "username": "babul.mia@workforce360.com",
      "defaultPassword": "WF360@Pass1084",
      "pin": "1084",
      "lastLogin": "9 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 94
  },
  {
    "id": "85",
    "employeeId": "WF-1085",
    "name": "Rokeya Begum",
    "email": "rokeya.begum@workforce360.com",
    "phone": "+880 1716062540",
    "team": "Sales, Marketing & Customer Success",
    "teamId": "sales",
    "designation": "CSM Lead",
    "role": "employee",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A-",
    "joiningDate": "12 Aug, 2021",
    "emergencyContact": {
      "name": "Rokeya Guardian",
      "relation": "Parent",
      "phone": "+880 1827832155"
    },
    "loginDetails": {
      "username": "rokeya.begum@workforce360.com",
      "defaultPassword": "WF360@Pass1085",
      "pin": "1085",
      "lastLogin": "9 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 95
  },
  {
    "id": "86",
    "employeeId": "WF-1086",
    "name": "Jahangir Alam",
    "email": "jahangir.alam@workforce360.com",
    "phone": "+880 1716133864",
    "team": "Sales, Marketing & Customer Success",
    "teamId": "sales",
    "designation": "Growth Marketer",
    "role": "employee",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B-",
    "joiningDate": "23 Mar, 2024",
    "emergencyContact": {
      "name": "Jahangir Guardian",
      "relation": "Spouse",
      "phone": "+880 1827924298"
    },
    "loginDetails": {
      "username": "jahangir.alam@workforce360.com",
      "defaultPassword": "WF360@Pass1086",
      "pin": "1086",
      "lastLogin": "9 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 96
  },
  {
    "id": "87",
    "employeeId": "WF-1087",
    "name": "Rehana Akhter",
    "email": "rehana.akhter@workforce360.com",
    "phone": "+880 1716205188",
    "team": "Sales, Marketing & Customer Success",
    "teamId": "sales",
    "designation": "Strategic Account Manager",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O-",
    "joiningDate": "6 Oct, 2022",
    "emergencyContact": {
      "name": "Rehana Guardian",
      "relation": "Parent",
      "phone": "+880 1828016441"
    },
    "loginDetails": {
      "username": "rehana.akhter@workforce360.com",
      "defaultPassword": "WF360@Pass1087",
      "pin": "1087",
      "lastLogin": "9 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 97
  },
  {
    "id": "88",
    "employeeId": "WF-1088",
    "name": "Sirajul Islam",
    "email": "sirajul.islam@workforce360.com",
    "phone": "+880 1716276512",
    "team": "Sales, Marketing & Customer Success",
    "teamId": "sales",
    "designation": "SaaS Sales Executive",
    "role": "employee",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "17 May, 2025",
    "emergencyContact": {
      "name": "Sirajul Guardian",
      "relation": "Spouse",
      "phone": "+880 1828108584"
    },
    "loginDetails": {
      "username": "sirajul.islam@workforce360.com",
      "defaultPassword": "WF360@Pass1088",
      "pin": "1088",
      "lastLogin": "9 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 98
  },
  {
    "id": "89",
    "employeeId": "WF-1089",
    "name": "Maya Rani",
    "email": "maya.rani@workforce360.com",
    "phone": "+880 1716347836",
    "team": "Sales, Marketing & Customer Success",
    "teamId": "sales",
    "designation": "Brand Content Lead",
    "role": "employee",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A+",
    "joiningDate": "28 Dec, 2023",
    "emergencyContact": {
      "name": "Maya Guardian",
      "relation": "Parent",
      "phone": "+880 1828200727"
    },
    "loginDetails": {
      "username": "maya.rani@workforce360.com",
      "defaultPassword": "WF360@Pass1089",
      "pin": "1089",
      "lastLogin": "9 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 99
  },
  {
    "id": "90",
    "employeeId": "WF-1090",
    "name": "Delwar Hossain",
    "email": "delwar.hossain@workforce360.com",
    "phone": "+880 1716419160",
    "team": "Sales, Marketing & Customer Success",
    "teamId": "sales",
    "designation": "Implementation Specialist",
    "role": "employee",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B+",
    "joiningDate": "11 Jul, 2021",
    "emergencyContact": {
      "name": "Delwar Guardian",
      "relation": "Spouse",
      "phone": "+880 1828292870"
    },
    "loginDetails": {
      "username": "delwar.hossain@workforce360.com",
      "defaultPassword": "WF360@Pass1090",
      "pin": "1090",
      "lastLogin": "10 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop",
    "status": "On Leave",
    "attendanceRate": 90
  },
  {
    "id": "91",
    "employeeId": "WF-1091",
    "name": "Shima Sultana",
    "email": "shima.sultana@workforce360.com",
    "phone": "+880 1716490484",
    "team": "Sales, Marketing & Customer Success",
    "teamId": "sales",
    "designation": "Inbound Specialist",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O+",
    "joiningDate": "22 Feb, 2024",
    "emergencyContact": {
      "name": "Shima Guardian",
      "relation": "Parent",
      "phone": "+880 1828385013"
    },
    "loginDetails": {
      "username": "shima.sultana@workforce360.com",
      "defaultPassword": "WF360@Pass1091",
      "pin": "1091",
      "lastLogin": "10 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 91
  },
  {
    "id": "92",
    "employeeId": "WF-1092",
    "name": "Motaleb Hossain",
    "email": "motaleb.hossain@workforce360.com",
    "phone": "+880 1716561808",
    "team": "Sales, Marketing & Customer Success",
    "teamId": "sales",
    "designation": "Support Operations Head",
    "role": "employee",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "5 Sep, 2022",
    "emergencyContact": {
      "name": "Motaleb Guardian",
      "relation": "Spouse",
      "phone": "+880 1828477156"
    },
    "loginDetails": {
      "username": "motaleb.hossain@workforce360.com",
      "defaultPassword": "WF360@Pass1092",
      "pin": "1092",
      "lastLogin": "10 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 92
  },
  {
    "id": "93",
    "employeeId": "WF-1093",
    "name": "Parul Akter",
    "email": "parul.akter@workforce360.com",
    "phone": "+880 1716633132",
    "team": "Sales, Marketing & Customer Success",
    "teamId": "sales",
    "designation": "Tier-2 Support Engineer",
    "role": "employee",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A-",
    "joiningDate": "16 Apr, 2025",
    "emergencyContact": {
      "name": "Parul Guardian",
      "relation": "Parent",
      "phone": "+880 1828569299"
    },
    "loginDetails": {
      "username": "parul.akter@workforce360.com",
      "defaultPassword": "WF360@Pass1093",
      "pin": "1093",
      "lastLogin": "10 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 93
  },
  {
    "id": "94",
    "employeeId": "WF-1094",
    "name": "Golam Mostafa",
    "email": "golam.mostafa@workforce360.com",
    "phone": "+880 1716704456",
    "team": "Sales, Marketing & Customer Success",
    "teamId": "sales",
    "designation": "Pre-Sales Solutions Engineer",
    "role": "employee",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B-",
    "joiningDate": "27 Nov, 2023",
    "emergencyContact": {
      "name": "Golam Guardian",
      "relation": "Spouse",
      "phone": "+880 1828661442"
    },
    "loginDetails": {
      "username": "golam.mostafa@workforce360.com",
      "defaultPassword": "WF360@Pass1094",
      "pin": "1094",
      "lastLogin": "10 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 94
  },
  {
    "id": "95",
    "employeeId": "WF-1095",
    "name": "Shafiul Alam",
    "email": "shafiul.alam@workforce360.com",
    "phone": "+880 1716775780",
    "team": "Sales, Marketing & Customer Success",
    "teamId": "sales",
    "designation": "PR & Outreach Executive",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O-",
    "joiningDate": "10 Jun, 2021",
    "emergencyContact": {
      "name": "Shafiul Guardian",
      "relation": "Parent",
      "phone": "+880 1828753585"
    },
    "loginDetails": {
      "username": "shafiul.alam@workforce360.com",
      "defaultPassword": "WF360@Pass1095",
      "pin": "1095",
      "lastLogin": "10 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 95
  },
  {
    "id": "96",
    "employeeId": "WF-1096",
    "name": "Shahadat Hossain",
    "email": "shahadat.hossain@workforce360.com",
    "phone": "+880 1716847104",
    "team": "Sales, Marketing & Customer Success",
    "teamId": "sales",
    "designation": "Business Development Rep",
    "role": "employee",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "21 Jan, 2024",
    "emergencyContact": {
      "name": "Shahadat Guardian",
      "relation": "Spouse",
      "phone": "+880 1828845728"
    },
    "loginDetails": {
      "username": "shahadat.hossain@workforce360.com",
      "defaultPassword": "WF360@Pass1096",
      "pin": "1096",
      "lastLogin": "10 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 96
  },
  {
    "id": "97",
    "employeeId": "WF-1097",
    "name": "Salma Begum",
    "email": "salma.begum@workforce360.com",
    "phone": "+880 1716918428",
    "team": "Sales, Marketing & Customer Success",
    "teamId": "sales",
    "designation": "Retention Account Manager",
    "role": "employee",
    "branch": "Banani HQ, Dhaka",
    "bloodGroup": "A+",
    "joiningDate": "4 Aug, 2022",
    "emergencyContact": {
      "name": "Salma Guardian",
      "relation": "Parent",
      "phone": "+880 1828937871"
    },
    "loginDetails": {
      "username": "salma.begum@workforce360.com",
      "defaultPassword": "WF360@Pass1097",
      "pin": "1097",
      "lastLogin": "10 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 97
  },
  {
    "id": "98",
    "employeeId": "WF-1098",
    "name": "Azim Uddin",
    "email": "azim.uddin@workforce360.com",
    "phone": "+880 1716989752",
    "team": "Sales, Marketing & Customer Success",
    "teamId": "sales",
    "designation": "CRM Admin",
    "role": "employee",
    "branch": "Gulshan Tech Hub",
    "bloodGroup": "B+",
    "joiningDate": "15 Mar, 2025",
    "emergencyContact": {
      "name": "Azim Guardian",
      "relation": "Spouse",
      "phone": "+880 1829030014"
    },
    "loginDetails": {
      "username": "azim.uddin@workforce360.com",
      "defaultPassword": "WF360@Pass1098",
      "pin": "1098",
      "lastLogin": "10 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 98
  },
  {
    "id": "99",
    "employeeId": "WF-1099",
    "name": "Morium Begum",
    "email": "morium.begum@workforce360.com",
    "phone": "+880 1717061076",
    "team": "Sales, Marketing & Customer Success",
    "teamId": "sales",
    "designation": "Lifecycle Marketer",
    "role": "employee",
    "branch": "Chattogram Port Branch",
    "bloodGroup": "O+",
    "joiningDate": "26 Oct, 2023",
    "emergencyContact": {
      "name": "Morium Guardian",
      "relation": "Parent",
      "phone": "+880 1829122157"
    },
    "loginDetails": {
      "username": "morium.begum@workforce360.com",
      "defaultPassword": "WF360@Pass1099",
      "pin": "1099",
      "lastLogin": "10 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 99
  },
  {
    "id": "100",
    "employeeId": "WF-1100",
    "name": "Zakir Hossain",
    "email": "zakir.hossain@workforce360.com",
    "phone": "+880 1717132400",
    "team": "Sales, Marketing & Customer Success",
    "teamId": "sales",
    "designation": "Regional Sales Rep",
    "role": "employee",
    "branch": "Sylhet IT Park",
    "bloodGroup": "AB+",
    "joiningDate": "9 May, 2021",
    "emergencyContact": {
      "name": "Zakir Guardian",
      "relation": "Spouse",
      "phone": "+880 1829214300"
    },
    "loginDetails": {
      "username": "zakir.hossain@workforce360.com",
      "defaultPassword": "WF360@Pass1100",
      "pin": "1100",
      "lastLogin": "11 hours ago",
      "status": "Active"
    },
    "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
    "status": "Active",
    "attendanceRate": 90
  }
];
