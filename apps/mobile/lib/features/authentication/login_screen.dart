import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/colors.dart';
import '../../core/state/app_state.dart';
import '../../core/supabase/supabase_config.dart';
import '../../core/widgets/brand_logo.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  String _activeRole = 'super_admin'; // 'super_admin', 'company_admin', 'hr_admin', 'manager', 'employee'
  final String _selectedOrg = 'WorkForce 360 Ltd (Banani HQ, Dhaka)';

  final _emailController = TextEditingController(text: 'superadmin@workforce360.com');
  final _passwordController = TextEditingController(text: 'WorkForce360!');
  bool _obscurePassword = true;
  bool _rememberMe = true;
  bool _isLoading = false;
  String? _loginFeedback;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _onRoleTabSelected(String role) {
    setState(() {
      _activeRole = role;
      switch (role) {
        case 'super_admin':
          _emailController.text = 'superadmin@workforce360.com';
          _passwordController.text = 'WorkForce360!';
          break;
        case 'company_admin':
          _emailController.text = 'admin@workforce360.com';
          _passwordController.text = 'WorkForce360!';
          break;
        case 'hr_admin':
          _emailController.text = 'hr@workforce360.com';
          _passwordController.text = 'WorkForce360!';
          break;
        case 'manager':
          _emailController.text = 'manager@workforce360.com';
          _passwordController.text = 'WorkForce360!';
          break;
        case 'employee':
        default:
          _emailController.text = 'ahmed@workforce360.com';
          _passwordController.text = 'WorkForce360!';
          break;
      }
    });
  }

  void _showPendingApprovalDialog(String name) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
        title: const Row(
          children: [
            Icon(Icons.pending_actions_rounded, color: Color(0xFFF59E0B), size: 26),
            SizedBox(width: 10),
            Text('অনুমোদন অপেক্ষমাণ', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18, color: AppColors.primaryNavy)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'হ্যালো $name,',
              style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14, color: AppColors.primaryNavy),
            ),
            const SizedBox(height: 8),
            const Text(
              'আপনার অ্যাকাউন্ট তৈরির আবেদনটি সফলভাবে জমা আছে, কিন্তু এখনো HR Admin বা Company Admin দ্বারা অনুমোদিত (Approve) হয়নি।\n\nঅ্যাডমিন অনুমোদন দেওয়ার পরেই আপনি অ্যাপ ও ওয়েবসাইটে প্রবেশ করতে পারবেন।',
              style: TextStyle(fontSize: 13, height: 1.45, color: AppColors.textSecondary),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('ঠিক আছে', style: TextStyle(fontWeight: FontWeight.w800)),
          ),
        ],
      ),
    );
  }

  void _showRejectedDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
        title: const Row(
          children: [
            Icon(Icons.cancel_outlined, color: Colors.red, size: 26),
            SizedBox(width: 10),
            Text('অনুরোধ বাতিল হয়েছে', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18, color: Colors.red)),
          ],
        ),
        content: const Text(
          'দুঃখিত, আপনার অ্যাকাউন্ট আবেদনটি HR অ্যাডমিন কর্তৃক বাতিল করা হয়েছে। বিস্তারিত জানতে আপনার কোম্পানির HR বিভাগের সাথে যোগাযোগ করুন।',
          style: TextStyle(fontSize: 13, height: 1.45, color: AppColors.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('বুঝেছি', style: TextStyle(fontWeight: FontWeight.w800)),
          ),
        ],
      ),
    );
  }

  void _handleLogin() async {
    final email = _emailController.text.trim().toLowerCase();
    final password = _passwordController.text;

    if (email.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter your authorized email and password'),
          backgroundColor: AppColors.absentRed,
        ),
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _loginFeedback = 'Checking cloud credentials with Supabase...';
    });

    // 1. Check live Supabase status first
    Map<String, dynamic>? sbEmployee;
    try {
      final client = SupabaseConfig.client;
      if (client != null) {
        final res = await client
            .from('employees')
            .select('first_name, last_name, email, status, designation_id, department_id')
            .eq('email', email)
            .maybeSingle();

        if (res != null) {
          sbEmployee = res;
          final status = (res['status'] ?? '').toString().toUpperCase();
          final fullName = '${res['first_name'] ?? ''} ${res['last_name'] ?? ''}'.trim();
          if (status == 'PENDING') {
            setState(() => _isLoading = false);
            _showPendingApprovalDialog(fullName.isEmpty ? email : fullName);
            return;
          } else if (status == 'REJECTED') {
            setState(() => _isLoading = false);
            _showRejectedDialog();
            return;
          }
        }
      }
    } catch (e) {
      debugPrint('Supabase login check: $e');
    }

    // 2. Check local pending access requests
    final pendingRequests = ref.read(appStateProvider).pendingAccessRequests;
    final matchedReq = pendingRequests.where((r) => r.email.toLowerCase() == email).firstOrNull;

    if (matchedReq != null) {
      if (matchedReq.status == 'PENDING') {
        setState(() => _isLoading = false);
        _showPendingApprovalDialog(matchedReq.fullName);
        return;
      } else if (matchedReq.status == 'REJECTED') {
        setState(() => _isLoading = false);
        _showRejectedDialog();
        return;
      }
    }

    setState(() {
      _loginFeedback = 'Authenticating session as ${_getRoleTitle(_activeRole)}...';
    });

    // Map email to exact employee profile from the 100 roster or live Supabase profile
    String resolvedName = '';
    String resolvedRole = _activeRole;
    String resolvedDesignation = '';
    String resolvedDepartment = 'WorkForce 360 Ltd';

    // If approved applicant
    if (matchedReq != null && (matchedReq.status == 'APPROVED' || matchedReq.status == 'ACTIVE')) {
      resolvedName = matchedReq.fullName;
      resolvedRole = matchedReq.requestedRole;
      resolvedDesignation = matchedReq.designation;
      resolvedDepartment = matchedReq.department;
    } else if (sbEmployee != null && (sbEmployee['status'] == 'ACTIVE' || sbEmployee['status'] == 'APPROVED')) {
      final fullName = '${sbEmployee['first_name'] ?? ''} ${sbEmployee['last_name'] ?? ''}'.trim();
      if (fullName.isNotEmpty) {
        resolvedName = fullName;
        resolvedRole = 'employee';
        resolvedDesignation = 'Staff Associate';
        resolvedDepartment = 'WorkForce 360 Ltd';
      }
    }

    final emailLower = email.toLowerCase();
    if (emailLower == 'sadia.islam@workforce360.com') {
      resolvedName = 'Sadia Islam';
      resolvedRole = 'manager';
      resolvedDesignation = 'Design Director';
      resolvedDepartment = 'Product, UI/UX & Design';
    } else if (emailLower == 'rayhan.kabir@workforce360.com') {
      resolvedName = 'Rayhan Kabir';
      resolvedRole = 'manager';
      resolvedDesignation = 'Staff Product Manager';
      resolvedDepartment = 'Product, UI/UX & Design';
    } else if (emailLower == 'tasnia.firoz@workforce360.com') {
      resolvedName = 'Tasnia Firoz';
      resolvedRole = 'employee';
      resolvedDesignation = 'Lead UX Researcher';
      resolvedDepartment = 'Product, UI/UX & Design';
    } else if (emailLower == 'anisur.rahman@workforce360.com') {
      resolvedName = 'Anisur Rahman';
      resolvedRole = 'employee';
      resolvedDesignation = 'Design Systems Architect';
      resolvedDepartment = 'Product, UI/UX & Design';
    } else if (emailLower == 'fariha.zaman@workforce360.com') {
      resolvedName = 'Fariha Zaman';
      resolvedRole = 'employee';
      resolvedDesignation = 'UI/UX Designer';
      resolvedDepartment = 'Product, UI/UX & Design';
    } else if (emailLower == 'sifat.ullah@workforce360.com') {
      resolvedName = 'Sifat Ullah';
      resolvedRole = 'manager';
      resolvedDesignation = 'Product Owner';
      resolvedDepartment = 'Product, UI/UX & Design';
    } else if (emailLower == 'sumaiya.akhtar@workforce360.com') {
      resolvedName = 'Sumaiya Akhtar';
      resolvedRole = 'employee';
      resolvedDesignation = 'Motion Designer';
      resolvedDepartment = 'Product, UI/UX & Design';
    } else if (emailLower == 'nazmus.sakib@workforce360.com') {
      resolvedName = 'Nazmus Sakib';
      resolvedRole = 'employee';
      resolvedDesignation = 'Brand Designer';
      resolvedDepartment = 'Product, UI/UX & Design';
    } else if (emailLower == 'munira.khatun@workforce360.com') {
      resolvedName = 'Munira Khatun';
      resolvedRole = 'employee';
      resolvedDesignation = 'Accessibility Specialist';
      resolvedDepartment = 'Product, UI/UX & Design';
    } else if (emailLower == 'ashraful.haque@workforce360.com') {
      resolvedName = 'Ashraful Haque';
      resolvedRole = 'employee';
      resolvedDesignation = 'UX Content Strategist';
      resolvedDepartment = 'Product, UI/UX & Design';
    } else if (emailLower == 'dilruba.shampa@workforce360.com') {
      resolvedName = 'Dilruba Shampa';
      resolvedRole = 'employee';
      resolvedDesignation = 'Information Architect';
      resolvedDepartment = 'Product, UI/UX & Design';
    } else if (emailLower == 'rubel.mia@workforce360.com') {
      resolvedName = 'Rubel Mia';
      resolvedRole = 'employee';
      resolvedDesignation = 'Visual Asset Designer';
      resolvedDepartment = 'Product, UI/UX & Design';
    } else if (emailLower == 'samira.tanjim@workforce360.com') {
      resolvedName = 'Samira Tanjim';
      resolvedRole = 'employee';
      resolvedDesignation = 'UI Designer';
      resolvedDepartment = 'Product, UI/UX & Design';
    } else if (emailLower == 'kazi.asif@workforce360.com') {
      resolvedName = 'Kazi Asif';
      resolvedRole = 'employee';
      resolvedDesignation = 'Product Data Analyst';
      resolvedDepartment = 'Product, UI/UX & Design';
    } else if (emailLower.contains('@workforce360.com') && emailLower.contains('.')) {
      final parts = emailLower.split('@')[0].split('.');
      if (parts.length >= 2) {
        resolvedName = '${parts[0][0].toUpperCase()}${parts[0].substring(1)} ${parts[1][0].toUpperCase()}${parts[1].substring(1)}';
        resolvedRole = _activeRole;
        resolvedDesignation = 'Staff Professional';
        resolvedDepartment = 'Engineering & Technology';
      }
    }

    if (resolvedName.isNotEmpty) {
      ref.read(appStateProvider.notifier).setUserProfile(
        role: resolvedRole,
        name: resolvedName,
        designation: resolvedDesignation,
        email: email,
        department: resolvedDepartment,
      );
    } else {
      // Fallback to chosen role
      ref.read(appStateProvider.notifier).switchRole(_activeRole);
    }

    Future.delayed(const Duration(milliseconds: 600), () {
      if (mounted) {
        setState(() => _isLoading = false);
        context.go('/home');
      }
    });
  }

  void _oneTapLogin(String role) {
    _onRoleTabSelected(role);
    _handleLogin();
  }

  String _getRoleTitle(String role) {
    switch (role) {
      case 'super_admin':
        return 'Platform Super Admin';
      case 'company_admin':
        return 'Company Admin';
      case 'hr_admin':
        return 'HR Admin';
      case 'manager':
        return 'Team Manager';
      case 'employee':
      default:
        return 'Employee';
    }
  }

  Color _getRoleColor(String role) {
    switch (role) {
      case 'super_admin':
        return const Color(0xFF3758D8);
      case 'company_admin':
        return const Color(0xFF10B981);
      case 'hr_admin':
        return const Color(0xFFEC4899);
      case 'manager':
        return const Color(0xFF8B5CF6);
      case 'employee':
      default:
        return const Color(0xFF06B6D4);
    }
  }

  IconData _getRoleIcon(String role) {
    switch (role) {
      case 'super_admin':
        return Icons.shield_outlined;
      case 'company_admin':
        return Icons.business_outlined;
      case 'hr_admin':
        return Icons.people_alt_outlined;
      case 'manager':
        return Icons.supervisor_account_outlined;
      case 'employee':
      default:
        return Icons.badge_outlined;
    }
  }

  String _getRoleDescription(String role) {
    switch (role) {
      case 'super_admin':
        return 'Manage 128 SaaS tenants, subscription plans, fleet telemetry & platform uptime.';
      case 'company_admin':
        return 'Manage 100 employees across 5 teams, geofences, ID cards & BDT payroll.';
      case 'hr_admin':
        return 'Attendance rosters, leave balance ledgers, recruitment & employee onboarding.';
      case 'manager':
        return 'Manage team shift approvals, daily attendance, sprint tasks & timesheets.';
      case 'employee':
      default:
        return 'Daily mobile GPS geofence check-in, 3D ID Card, tasks & April payslip.';
    }
  }

  String _getAuthorityTag(String role) {
    switch (role) {
      case 'super_admin':
        return 'ROOT PLATFORM';
      case 'company_admin':
        return 'ORGANIZATION ADMIN';
      case 'hr_admin':
        return 'PEOPLE OPS';
      case 'manager':
        return 'TEAM LEAD';
      case 'employee':
      default:
        return 'SELF SERVICE';
    }
  }

  void _showForgotPasswordSheet() {
    final resetEmailController = TextEditingController(text: _emailController.text);
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            left: 24,
            right: 24,
            top: 24,
            bottom: MediaQuery.of(context).viewInsets.bottom + 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 44,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.borderLight,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 18),
              const Text(
                'Reset Your Password',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: AppColors.primaryNavy,
                ),
              ),
              const SizedBox(height: 6),
              const Text(
                'Enter your corporate email address to receive a secure recovery code.',
                style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 18),
              TextField(
                controller: resetEmailController,
                decoration: InputDecoration(
                  labelText: 'Email Address',
                  prefixIcon: const Icon(Icons.mail_outline, size: 20, color: AppColors.primaryBlue),
                  filled: true,
                  fillColor: AppColors.backgroundLight,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Password reset instructions sent to ${resetEmailController.text}'),
                        backgroundColor: AppColors.presentGreen,
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryBlue,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  child: const Text('Send Reset Link', style: TextStyle(fontWeight: FontWeight.w800)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showSignUpSheet() {
    final nameCtrl = TextEditingController();
    final emailCtrl = TextEditingController();
    final phoneCtrl = TextEditingController(text: '+880 ');
    final designationCtrl = TextEditingController();
    final passCtrl = TextEditingController();
    String selectedDept = 'Engineering & Technology';

    final departments = [
      'Engineering & Technology',
      'Human Resources & Talent Operations',
      'Sales, Marketing & Growth',
      'Product, UI/UX & Design',
      'Finance, Payroll & Accounts',
    ];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 24,
                right: 24,
                top: 24,
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Container(
                        width: 44,
                        height: 4,
                        decoration: BoxDecoration(
                          color: AppColors.borderLight,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    const SizedBox(height: 18),
                    const Row(
                      children: [
                        Icon(Icons.person_add_alt_1_rounded, color: AppColors.primaryBlue, size: 24),
                        SizedBox(width: 8),
                        Text(
                          'নতুন অ্যাকাউন্ট আবেদন / Request Access',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.primaryNavy),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'আবেদন জমা দেওয়ার পর HR Admin কর্তৃক অনুমোদন (Approve) পেলেই আপনি লগইন করতে পারবেন।',
                      style: TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.3),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: nameCtrl,
                      decoration: InputDecoration(
                        labelText: 'Full Name (পুরো নাম)',
                        prefixIcon: const Icon(Icons.person_outline, size: 20),
                        filled: true,
                        fillColor: AppColors.backgroundLight,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: emailCtrl,
                      keyboardType: TextInputType.emailAddress,
                      decoration: InputDecoration(
                        labelText: 'Work Email (কর্পোরেট ইমেইল)',
                        prefixIcon: const Icon(Icons.mail_outline, size: 20),
                        filled: true,
                        fillColor: AppColors.backgroundLight,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: phoneCtrl,
                      keyboardType: TextInputType.phone,
                      decoration: InputDecoration(
                        labelText: 'Phone Number (মোবাইল নম্বর)',
                        prefixIcon: const Icon(Icons.phone_outlined, size: 20),
                        filled: true,
                        fillColor: AppColors.backgroundLight,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                      ),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: selectedDept,
                      items: departments.map((d) {
                        return DropdownMenuItem(
                          value: d,
                          child: Text(d, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                        );
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) setSheetState(() => selectedDept = val);
                      },
                      decoration: InputDecoration(
                        labelText: 'Department (বিভাগ)',
                        prefixIcon: const Icon(Icons.apartment_rounded, size: 20),
                        filled: true,
                        fillColor: AppColors.backgroundLight,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: designationCtrl,
                      decoration: InputDecoration(
                        labelText: 'Designation (পদবী, যেমন: Software Engineer)',
                        prefixIcon: const Icon(Icons.badge_outlined, size: 20),
                        filled: true,
                        fillColor: AppColors.backgroundLight,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: passCtrl,
                      obscureText: true,
                      decoration: InputDecoration(
                        labelText: 'Password (পাসওয়ার্ড)',
                        prefixIcon: const Icon(Icons.lock_outline, size: 20),
                        filled: true,
                        fillColor: AppColors.backgroundLight,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                      ),
                    ),
                    const SizedBox(height: 20),
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: () async {
                          final name = nameCtrl.text.trim();
                          final email = emailCtrl.text.trim().toLowerCase();
                          final phone = phoneCtrl.text.trim();
                          final desig = designationCtrl.text.trim();

                          if (name.isEmpty || email.isEmpty || desig.isEmpty) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('দয়া করে নাম, ইমেইল ও পদবী পূরণ করুন'),
                                backgroundColor: AppColors.absentRed,
                              ),
                            );
                            return;
                          }

                          // 1. Insert directly into Supabase Cloud employees table
                          try {
                            final client = SupabaseConfig.client;
                            if (client != null) {
                              final parts = name.split(' ');
                              final fName = parts.isNotEmpty ? parts[0] : name;
                              final lName = parts.length > 1 ? parts.sublist(1).join(' ') : 'Applicant';
                              final code = 'REQ-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';

                              await client.from('employees').insert({
                                'organization_id': 'b0000000-0000-0000-0000-000000000001',
                                'employee_code': code,
                                'first_name': fName,
                                'last_name': lName,
                                'email': email,
                                'phone': phone.isNotEmpty ? phone : '+880 1711-000000',
                                'gender': 'MALE',
                                'joining_date': DateTime.now().toIso8601String().split('T')[0],
                                'branch_id': 'd0000000-0000-0000-0000-000000000001',
                                'employment_type': 'FULL_TIME',
                                'status': 'PENDING',
                                'department_id': 'e0000000-0000-0000-0000-000000000001',
                                'designation_id': 'f0000000-0000-0000-0000-000000000001',
                                'blood_group': 'B+',
                                'gross_salary_bdt': 50000,
                              });
                            }
                          } catch (err) {
                            debugPrint('Supabase insert request error: $err');
                          }

                          final newReq = AccessRequestItem(
                            id: 'req-${DateTime.now().millisecondsSinceEpoch}',
                            fullName: name,
                            email: email,
                            phone: phone,
                            department: selectedDept,
                            designation: desig,
                            requestedRole: 'employee',
                            status: 'PENDING',
                            requestedAt: 'Just now',
                          );

                          ref.read(appStateProvider.notifier).addAccessRequest(newReq);
                          if (!context.mounted) return;
                          Navigator.pop(context);

                          showDialog(
                            context: context,
                            builder: (ctx) => AlertDialog(
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
                              title: const Row(
                                children: [
                                  Icon(Icons.check_circle_rounded, color: Color(0xFF10B981), size: 28),
                                  SizedBox(width: 8),
                                  Text('আবেদন জমা হয়েছে', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18)),
                                ],
                              ),
                              content: Text(
                                'ধন্যবাদ $name!\n\nআপনার অ্যাকাউন্ট আবেদনটি সফলভাবে HR Admin-এর অনুমোদনের তালিকায় জমা হয়েছে। HR Admin অনুমোদন (Approve) করার পর আপনি "$email" দিয়ে লগইন করতে পারবেন।',
                                style: const TextStyle(fontSize: 13, height: 1.45),
                              ),
                              actions: [
                                ElevatedButton(
                                  onPressed: () => Navigator.pop(ctx),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF10B981),
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                  ),
                                  child: const Text('ঠিক আছে', style: TextStyle(fontWeight: FontWeight.w800)),
                                ),
                              ],
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primaryBlue,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        child: const Text('Submit Request / আবেদন জমা দিন', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final roleColor = _getRoleColor(_activeRole);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 24.0),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 480),
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppColors.borderLight),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.04),
                      blurRadius: 24,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Brand Header (Single centered logo with emblem, title & tagline)
                    const Center(
                      child: BrandLogo(
                        size: 56,
                        showText: true,
                        showTagline: true,
                      ),
                    ),
                    const SizedBox(height: 20),

              // Dedicated 5 Role Tabs Switcher (Exact website match)
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: AppColors.backgroundLight,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.borderLight),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'SELECT WORKSPACE ROLE',
                            style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textSecondary, letterSpacing: 0.5),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: roleColor.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              _getAuthorityTag(_activeRole),
                              style: TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: roleColor),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 4),
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: [
                          _buildRoleTab('super_admin', 'Super Admin', Icons.shield_outlined),
                          _buildRoleTab('company_admin', 'Company Admin', Icons.business_outlined),
                          _buildRoleTab('hr_admin', 'HR Admin', Icons.people_alt_outlined),
                          _buildRoleTab('manager', 'Manager', Icons.supervisor_account_outlined),
                          _buildRoleTab('employee', 'Employee', Icons.badge_outlined),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),

              // Dynamic Role Banner Info
              AnimatedContainer(
                duration: const Duration(milliseconds: 250),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: roleColor.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: roleColor.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: roleColor,
                        borderRadius: BorderRadius.circular(14),
                        boxShadow: [
                          BoxShadow(
                            color: roleColor.withOpacity(0.35),
                            blurRadius: 8,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: Icon(_getRoleIcon(_activeRole), color: Colors.white, size: 22),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _getRoleTitle(_activeRole),
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w900,
                              color: roleColor,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            _getRoleDescription(_activeRole),
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w500,
                              color: Colors.grey.shade800,
                              height: 1.25,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Single Enterprise Organization Badge
              if (_activeRole != 'super_admin') ...[
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: AppColors.backgroundLight,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.borderLight),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981).withOpacity(0.12),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.business, color: Color(0xFF10B981), size: 18),
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'WorkForce 360 Ltd',
                              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.primaryNavy),
                            ),
                            Text(
                              'Banani Corporate HQ, Dhaka',
                              style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981).withOpacity(0.12),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Text(
                          'Primary Tenant',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: Color(0xFF10B981)),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 14),
              ],

              // Email Input
              const Text(
                'Authorized Work Email',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.primaryNavy),
              ),
              const SizedBox(height: 6),
              TextField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.primaryNavy),
                decoration: InputDecoration(
                  prefixIcon: const Icon(Icons.mail_outline, size: 20, color: AppColors.textMuted),
                  filled: true,
                  fillColor: AppColors.backgroundLight,
                  contentPadding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: AppColors.borderLight),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: AppColors.borderLight),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: BorderSide(color: roleColor, width: 2),
                  ),
                ),
              ),
              const SizedBox(height: 14),

              // Password Input
              const Text(
                'Security Password',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.primaryNavy),
              ),
              const SizedBox(height: 6),
              TextField(
                controller: _passwordController,
                obscureText: _obscurePassword,
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.primaryNavy),
                decoration: InputDecoration(
                  prefixIcon: const Icon(Icons.lock_outline, size: 20, color: AppColors.textMuted),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                      color: AppColors.textMuted,
                      size: 20,
                    ),
                    onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                  ),
                  filled: true,
                  fillColor: AppColors.backgroundLight,
                  contentPadding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: AppColors.borderLight),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: AppColors.borderLight),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: BorderSide(color: roleColor, width: 2),
                  ),
                ),
              ),
              const SizedBox(height: 10),

              // Remember Me & Forgot Password
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      SizedBox(
                        width: 22,
                        height: 22,
                        child: Checkbox(
                          value: _rememberMe,
                          activeColor: roleColor,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5)),
                          onChanged: (val) => setState(() => _rememberMe = val ?? true),
                        ),
                      ),
                      const SizedBox(width: 6),
                      const Text(
                        'Remember device',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                  GestureDetector(
                    onTap: _showForgotPasswordSheet,
                    child: Text(
                      'Forgot Password?',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: roleColor),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 18),

              // Sign In Button
              SizedBox(
                height: 50,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _handleLogin,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: roleColor,
                    foregroundColor: Colors.white,
                    elevation: 3,
                    shadowColor: roleColor.withOpacity(0.4),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  child: _isLoading
                      ? const SizedBox(
                          height: 22,
                          width: 22,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                        )
                      : Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Enter ${_getRoleTitle(_activeRole)}',
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, letterSpacing: 0.2),
                            ),
                            const SizedBox(width: 8),
                            const Icon(Icons.arrow_forward_rounded, size: 18),
                          ],
                        ),
                ),
              ),
              const SizedBox(height: 20),

              // One-Tap Demo Access Section
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.backgroundLight,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.borderLight),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.bolt_rounded, size: 16, color: Color(0xFFF59E0B)),
                        SizedBox(width: 4),
                        Text(
                          'ONE-TAP INSTANT DEMO LOGIN',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppColors.primaryNavy),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        _buildQuickDemoChip('super_admin', '⚡ Super Admin', const Color(0xFF3758D8)),
                        _buildQuickDemoChip('company_admin', '⚡ Company Admin', const Color(0xFF10B981)),
                        _buildQuickDemoChip('hr_admin', '⚡ HR Admin', const Color(0xFFEC4899)),
                        _buildQuickDemoChip('manager', '⚡ Manager', const Color(0xFF8B5CF6)),
                        _buildQuickDemoChip('employee', '⚡ Employee', const Color(0xFF06B6D4)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),

              // "or continue with"
              const Row(
                children: [
                  Expanded(child: Divider(color: AppColors.borderLight)),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 12),
                    child: Text(
                      'or corporate SSO',
                      style: TextStyle(fontSize: 11, color: AppColors.textMuted, fontWeight: FontWeight.w600),
                    ),
                  ),
                  Expanded(child: Divider(color: AppColors.borderLight)),
                ],
              ),
              const SizedBox(height: 14),

              // Google & Microsoft Buttons
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => _oneTapLogin('employee'),
                      icon: Container(
                        width: 18,
                        height: 18,
                        decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFFEA4335)),
                        child: const Center(
                          child: Text('G', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                        ),
                      ),
                      label: const Text('Google SSO', style: TextStyle(color: AppColors.primaryNavy, fontWeight: FontWeight.w700, fontSize: 12)),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        side: const BorderSide(color: AppColors.borderLight),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => _oneTapLogin('company_admin'),
                      icon: const Icon(Icons.window_sharp, size: 18, color: Color(0xFF00A4EF)),
                      label: const Text('Microsoft 365', style: TextStyle(color: AppColors.primaryNavy, fontWeight: FontWeight.w700, fontSize: 12)),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        side: const BorderSide(color: AppColors.borderLight),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Sign Up / Request Access Link (Prominent for new employees)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                decoration: BoxDecoration(
                  color: AppColors.backgroundLight,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.borderLight),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      "নতুন কর্মী? ",
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textSecondary),
                    ),
                    GestureDetector(
                      onTap: _showSignUpSheet,
                      child: Text(
                        'অ্যাকাউন্ট আবেদন করুন (Request Access)',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: roleColor),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
    ),
  ),
),
);
  }

  Widget _buildRoleTab(String role, String label, IconData icon) {
    final isSelected = _activeRole == role;
    final color = _getRoleColor(role);

    return GestureDetector(
      onTap: () => _onRoleTabSelected(role),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(right: 6),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? color : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isSelected ? color : AppColors.borderLight),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: color.withOpacity(0.35),
                    blurRadius: 8,
                    offset: const Offset(0, 3),
                  ),
                ]
              : null,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 16, color: isSelected ? Colors.white : AppColors.primaryNavy),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.w900 : FontWeight.w700,
                color: isSelected ? Colors.white : AppColors.primaryNavy,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickDemoChip(String role, String label, Color color) {
    return GestureDetector(
      onTap: () => _oneTapLogin(role),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: color.withOpacity(0.12),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Text(
          label,
          style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: color),
        ),
      ),
    );
  }
}
