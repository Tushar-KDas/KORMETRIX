-- ==============================================================================
-- WORKFORCE 360 - SEED DATA: MULTI-TENANT ENTERPRISE FIXTURES (BANGLADESH)
-- ==============================================================================

-- 1. SUBSCRIPTION PLANS
INSERT INTO subscription_plans (id, name, code, monthly_price_bdt, annual_price_bdt, max_employees, max_branches, max_storage_gb, custom_branding, advanced_reports, audit_logs, api_access, support_tier)
VALUES
('a0000000-0000-0000-0000-000000000001', 'Free Tier', 'FREE', 0, 0, 10, 1, 2, FALSE, FALSE, FALSE, FALSE, 'STANDARD'),
('a0000000-0000-0000-0000-000000000002', 'Starter Plan', 'STARTER', 4999, 49990, 50, 2, 10, FALSE, TRUE, FALSE, FALSE, 'STANDARD'),
('a0000000-0000-0000-0000-000000000003', 'Professional Plan', 'PROFESSIONAL', 14999, 149990, 200, 5, 50, TRUE, TRUE, TRUE, FALSE, 'PRIORITY'),
('a0000000-0000-0000-0000-000000000004', 'Business Plan', 'BUSINESS', 29999, 299990, 500, 10, 100, TRUE, TRUE, TRUE, TRUE, 'PRIORITY'),
('a0000000-0000-0000-0000-000000000005', 'Enterprise Plan', 'ENTERPRISE', 69999, 699990, 5000, 50, 500, TRUE, TRUE, TRUE, TRUE, 'DEDICATED')
ON CONFLICT (code) DO NOTHING;

-- 2. ORGANIZATIONS
INSERT INTO organizations (id, name, name_bn, slug, code, status, subscription_plan_id, currency, currency_symbol, timezone, address, phone, email, website)
VALUES
('b0000000-0000-0000-0000-000000000001', 'Innovate BD Ltd', 'ইনোভেট বিডি লিমিটেড', 'innovate-bd', 'IBD', 'ACTIVE', 'a0000000-0000-0000-0000-000000000005', 'BDT', '৳', 'Asia/Dhaka', 'Road 11, Block D, Banani, Dhaka-1213', '+8801711000001', 'info@innovatebd.com', 'https://innovatebd.com'),
('b0000000-0000-0000-0000-000000000002', 'TechCorp Ltd', 'টেককর্প লিমিটেড', 'techcorp', 'TCL', 'ACTIVE', 'a0000000-0000-0000-0000-000000000004', 'BDT', '৳', 'Asia/Dhaka', 'Gulshan Avenue, Dhaka-1212', '+8801711000002', 'contact@techcorp.com', 'https://techcorp.com'),
('b0000000-0000-0000-0000-000000000003', 'Global Solutions', 'গ্লোবাল সলিউশনস', 'globalsol', 'GSL', 'ACTIVE', 'a0000000-0000-0000-0000-000000000003', 'BDT', '৳', 'Asia/Dhaka', 'Agrabad C/A, Chittagong', '+8801711000003', 'support@globalsol.com', 'https://globalsol.com')
ON CONFLICT (slug) DO NOTHING;

-- 3. PROFILES
INSERT INTO profiles (id, email, full_name, full_name_bn, phone, is_platform_admin, preferred_language, preferred_theme)
VALUES
('c0000000-0000-0000-0000-000000000001', 'superadmin@workforce360.com', 'Md. Rahim Ahmed', 'মো. রহিম আহমেদ', '+8801700000001', TRUE, 'bn', 'light'),
('c0000000-0000-0000-0000-000000000002', 'admin@innovatebd.com', 'Tanvir Hasan', 'তানভীর হাসান', '+8801700000002', FALSE, 'bn', 'light'),
('c0000000-0000-0000-0000-000000000003', 'ahmed@workforce360.com', 'Ahmed Rahman', 'আহমেদ রহমান', '+8801712345678', FALSE, 'en', 'light'),
('c0000000-0000-0000-0000-000000000004', 'sarah@innovatebd.com', 'Sarah Khan', 'সারাহ খান', '+8801700000004', FALSE, 'en', 'light'),
('c0000000-0000-0000-0000-000000000005', 'rafiq@innovatebd.com', 'Rafiq Ahmed', 'রফিক আহমেদ', '+8801700000005', FALSE, 'bn', 'light')
ON CONFLICT (email) DO NOTHING;

-- 4. PLATFORM ADMIN RECORD
INSERT INTO platform_admins (user_id, role)
VALUES ('c0000000-0000-0000-0000-000000000001', 'SUPER_ADMIN')
ON CONFLICT (user_id) DO NOTHING;

-- 5. BRANCHES (GEOFENCES)
INSERT INTO organization_branches (id, organization_id, name, name_bn, code, is_headquarters, address, city, latitude, longitude, radius_meters, contact_phone)
VALUES
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Head Office, Banani', 'হেড অফিস, বনানী', 'HQ-BAN', TRUE, 'Road 11, Banani, Dhaka', 'Dhaka', 23.7937, 90.4048, 200, '+8801711000001'),
('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Dhanmondi Branch', 'ধানমন্ডি শাখা', 'BR-DHN', FALSE, 'Dhanmondi 27, Dhaka', 'Dhaka', 23.7461, 90.3742, 150, '+8801711000002')
ON CONFLICT DO NOTHING;

-- 6. DEPARTMENTS
INSERT INTO departments (id, organization_id, branch_id, name, name_bn, code, budget_bdt)
VALUES
('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Engineering', 'ইঞ্জিনিয়ারিং', 'ENG', 2500000),
('e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Human Resources', 'হিউম্যান রিসোর্সেস', 'HR', 800000),
('e0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Marketing & Sales', 'মার্কেটিং ও সেলস', 'MKT', 1200000)
ON CONFLICT DO NOTHING;

-- 7. DESIGNATIONS
INSERT INTO designations (id, organization_id, department_id, title, title_bn, level, min_salary_bdt, max_salary_bdt)
VALUES
('f0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Software Engineer', 'সফটওয়্যার ইঞ্জিনিয়ার', 2, 45000, 95000),
('f0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'HR Executive', 'এইচআর এক্সিকিউটিভ', 2, 35000, 65000),
('f0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Engineering Team Lead', 'ইঞ্জিনিয়ারিং টিম লিড', 4, 90000, 160000)
ON CONFLICT DO NOTHING;

-- 8. SHIFTS
INSERT INTO shifts (id, organization_id, name, name_bn, code, start_time, end_time, grace_period_minutes, weekly_off_days)
VALUES
('10000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Standard Corporate Shift', 'স্ট্যান্ডার্ড কর্পোরেট শিফট', 'STD-9TO6', '09:00:00', '18:00:00', 15, '{5, 6}')
ON CONFLICT DO NOTHING;

-- 9. LEAVE TYPES
INSERT INTO leave_types (id, organization_id, name, name_bn, code, annual_allocation_days, carry_forward_max_days, is_paid)
VALUES
('20000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Annual Leave', 'বার্ষিক ছুটি', 'ANNUAL', 18, 5, TRUE),
('20000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Sick Leave', 'অসুস্থতাজনিত ছুটি', 'SICK', 14, 0, TRUE),
('20000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Casual Leave', 'নৈমিত্তিক ছুটি', 'CASUAL', 10, 0, TRUE),
('20000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'Emergency Leave', 'জরুরী ছুটি', 'SPECIAL', 5, 0, TRUE)
ON CONFLICT DO NOTHING;

-- 10. EMPLOYEES
INSERT INTO employees (id, organization_id, user_id, employee_code, first_name, last_name, first_name_bn, last_name_bn, email, phone, gender, joining_date, employment_type, status, branch_id, department_id, designation_id, shift_id, basic_salary_bdt, gross_salary_bdt, bank_name, bank_account_number)
VALUES
('30000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'EMP-001', 'Tanvir', 'Hasan', 'তানভীর', 'হাসান', 'admin@innovatebd.com', '+8801700000002', 'MALE', '2023-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 75000, 150000, 'City Bank Ltd', '1102938475001'),
('30000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'EMP-002', 'Ahmed', 'Rahman', 'আহমেদ', 'রহমান', 'ahmed@workforce360.com', '+8801712345678', 'MALE', '2023-06-15', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 37500, 75000, 'BRAC Bank Ltd', '2203948576002'),
('30000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004', 'EMP-003', 'Sarah', 'Khan', 'সারাহ', 'খান', 'sarah@innovatebd.com', '+8801700000004', 'FEMALE', '2023-08-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 30000, 60000, 'Eastern Bank Ltd', '3304958671003')
ON CONFLICT DO NOTHING;

-- 11. ORGANIZATION MEMBERSHIPS
INSERT INTO organization_memberships (user_id, organization_id, role, is_active)
VALUES
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'COMPANY_ADMIN', TRUE),
('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'EMPLOYEE', TRUE),
('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'HR_ADMIN', TRUE)
ON CONFLICT DO NOTHING;

-- 12. LEAVE BALANCES FOR AHMED RAHMAN (Matches Screenshot: Annual 18, Sick 12, Casual 8, Emergency 5)
INSERT INTO leave_balances (organization_id, employee_id, leave_type_id, fiscal_year, allocated_days, used_days, pending_days, carried_over_days)
VALUES
('b0000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 2025, 18, 0, 0, 0),
('b0000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 2025, 14, 2, 0, 0),
('b0000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', 2025, 10, 2, 0, 0),
('b0000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004', 2025, 5, 0, 0, 0)
ON CONFLICT DO NOTHING;

-- 13. TASKS (Matches Screenshot: Complete UI Design, Fix Login Bug, Prepare Report, Update Documentation)
INSERT INTO tasks (id, organization_id, title, description, assigned_to_employee_id, created_by_id, priority, status, deadline, progress_percentage)
VALUES
('40000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Complete UI Design', 'Redesign employee dashboard and leave request flows with modern components', '30000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'HIGH', 'IN_PROGRESS', NOW() + INTERVAL '1 day', 75),
('40000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Fix Login Bug', 'Investigate offline authentication token caching issue on Android', '30000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'HIGH', 'TODO', NOW() + INTERVAL '2 days', 20),
('40000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Prepare Report', 'Generate monthly department utilization and payroll summary for Q1', '30000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'LOW', 'TODO', NOW() + INTERVAL '3 days', 0)
ON CONFLICT DO NOTHING;

-- 14. FEATURE FLAGS (REMOTE CONTROLS)
INSERT INTO feature_definitions (key, name, description, category, default_enabled)
VALUES
('attendance.gps_geofence', 'GPS Geofencing Attendance', 'Validates location coordinates within office perimeter', 'ATTENDANCE', TRUE),
('attendance.qr_code', 'QR Attendance', 'Allows dynamic QR code scanning at office kiosk', 'ATTENDANCE', TRUE),
('leave.management', 'Leave Engine', 'Leave application, approval and balance ledger', 'LEAVE', TRUE),
('payroll.engine', 'Payroll & BDT Payslips', 'Automated tax and salary calculations', 'PAYROLL', TRUE),
('tasks.projects', 'Task & Project Collaboration', 'Task boards, checklists and progress tracking', 'GENERAL', TRUE),
('mobile.remote_lock', 'Remote Device App Lock', 'Ability to remotely lock mobile app access', 'SECURITY', TRUE)
ON CONFLICT (key) DO NOTHING;

INSERT INTO feature_flags (feature_key, organization_id, is_enabled, rollout_percentage)
VALUES
('attendance.gps_geofence', 'b0000000-0000-0000-0000-000000000001', TRUE, 100),
('attendance.qr_code', 'b0000000-0000-0000-0000-000000000001', TRUE, 100),
('leave.management', 'b0000000-0000-0000-0000-000000000001', TRUE, 100),
('payroll.engine', 'b0000000-0000-0000-0000-000000000001', TRUE, 100),
('tasks.projects', 'b0000000-0000-0000-0000-000000000001', TRUE, 100),
('mobile.remote_lock', 'b0000000-0000-0000-0000-000000000001', TRUE, 100)
ON CONFLICT (feature_key, organization_id) DO NOTHING;
