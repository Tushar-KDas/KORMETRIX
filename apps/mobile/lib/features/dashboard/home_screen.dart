import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/colors.dart';
import '../../core/state/app_state.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(appStateProvider.notifier).fetchPendingRequestsFromSupabase();
    });
  }

  @override
  Widget build(BuildContext context) {
    final appState = ref.watch(appStateProvider);
    final appNotifier = ref.read(appStateProvider.notifier);
    final unreadNotificationCount = appState.notifications.where((n) => n.isUnread).length;

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      drawer: _buildAppDrawer(context, appState, ref),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 14.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Top Bar with Drawer, Role Switcher Pill, Notifications & Avatar
              _buildTopBar(context, appState, appNotifier, unreadNotificationCount),
              const SizedBox(height: 16),

              // 2. Greeting Header with Role Badge
              _buildGreetingHeader(appState),
              const SizedBox(height: 18),

              // 3. Dynamic Dashboard View based on userRole
              if (appState.userRole == 'super_admin')
                _buildSuperAdminDashboard(context, appState, ref)
              else if (appState.userRole == 'company_admin')
                _buildCompanyAdminDashboard(context, appState, ref)
              else if (appState.userRole == 'hr_admin')
                _buildHrAdminDashboard(context, appState, ref)
              else if (appState.userRole == 'manager')
                _buildManagerDashboard(context, appState, ref)
              else
                _buildEmployeeDashboard(context, appState, ref),

              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // TOP BAR & ROLE SWITCHER
  // ---------------------------------------------------------------------------
  Widget _buildTopBar(BuildContext context, AppState appState, AppStateNotifier appNotifier, int unreadCount) {
    final roleColor = _getRoleColor(appState.userRole);

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        // Drawer Menu Button
        Builder(
          builder: (scaffoldContext) => GestureDetector(
            onTap: () => Scaffold.of(scaffoldContext).openDrawer(),
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.borderLight),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 6, offset: const Offset(0, 2)),
                ],
              ),
              child: const Icon(Icons.menu, color: AppColors.primaryNavy, size: 22),
            ),
          ),
        ),

        // Role Badge / Quick Role Switcher Pill (Restricted to Super Admin & Company Admin)
        if (appState.userRole == 'super_admin' || appState.userRole == 'company_admin')
          GestureDetector(
            onTap: () => _showRoleSwitchSheet(context, appNotifier, appState.userRole),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: roleColor.withOpacity(0.12),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: roleColor.withOpacity(0.35)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(_getRoleIcon(appState.userRole), size: 14, color: roleColor),
                  const SizedBox(width: 5),
                  Text(
                    _getRoleShortTitle(appState.userRole),
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: roleColor),
                  ),
                  const SizedBox(width: 4),
                  Icon(Icons.keyboard_arrow_down_rounded, size: 14, color: roleColor),
                ],
              ),
            ),
          )
        else
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: roleColor.withOpacity(0.12),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: roleColor.withOpacity(0.35)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(_getRoleIcon(appState.userRole), size: 14, color: roleColor),
                const SizedBox(width: 5),
                Text(
                  _getRoleShortTitle(appState.userRole),
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: roleColor),
                ),
              ],
            ),
          ),

        // Notification & Avatar
        Row(
          children: [
            Stack(
              children: [
                GestureDetector(
                  onTap: () => context.push('/notifications'),
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.borderLight),
                    ),
                    child: const Icon(Icons.notifications_none, color: AppColors.primaryNavy, size: 22),
                  ),
                ),
                if (unreadCount > 0)
                  Positioned(
                    top: 2,
                    right: 2,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: const BoxDecoration(
                        color: AppColors.absentRed,
                        shape: BoxShape.circle,
                      ),
                      constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
                      child: Text(
                        '$unreadCount',
                        textAlign: TextAlign.center,
                        style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(width: 10),
            GestureDetector(
              onTap: () => context.push('/profile'),
              child: Container(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: roleColor, width: 2),
                ),
                child: CircleAvatar(
                  radius: 17,
                  backgroundImage: NetworkImage(appState.userAvatarUrl),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildGreetingHeader(AppState appState) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              'Hello, ${appState.userName.split(' ').first}! 👋',
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w900,
                color: AppColors.primaryNavy,
                letterSpacing: -0.4,
              ),
            ),
          ],
        ),
        const SizedBox(height: 2),
        Text(
          '${appState.userDesignation} • ${appState.organizationName}',
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: AppColors.textSecondary,
          ),
        ),
      ],
    );
  }

  // ---------------------------------------------------------------------------
  // DASHBOARD 1: PLATFORM SUPER ADMIN
  // ---------------------------------------------------------------------------
  Widget _buildSuperAdminDashboard(BuildContext context, AppState appState, WidgetRef ref) {
    const accentColor = Color(0xFF3758D8);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Hero Control Center Banner
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF17243B), Color(0xFF1E3A8A)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(22),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF17243B).withOpacity(0.35),
                blurRadius: 18,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.shield, color: Color(0xFF38BDF8), size: 14),
                        SizedBox(width: 5),
                        Text(
                          'PLATFORM ROOT CONTROL',
                          style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w900),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981).withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Row(
                      children: [
                        CircleAvatar(radius: 3, backgroundColor: Color(0xFF10B981)),
                        SizedBox(width: 4),
                        Text('UPTIME 99.98%', style: TextStyle(color: Color(0xFF10B981), fontSize: 9, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              const Text(
                'Monthly Recurring Revenue',
                style: TextStyle(fontSize: 12, color: Colors.white70, fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 4),
              const Text(
                '৳ 1,48,50,000 BDT',
                style: TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: Colors.white),
              ),
              const SizedBox(height: 12),
              const Row(
                children: [
                  Icon(Icons.cloud_done_outlined, color: Colors.white70, size: 14),
                  SizedBox(width: 5),
                  Text(
                    'Supabase Database: jklphtbxlmxbldmfiwnf (64 Tables Active)',
                    style: TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.w500),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),

        // Metrics Grid (4 cards)
        Row(
          children: [
            Expanded(child: _buildMetricCard('Total Tenants', '128 Orgs', const Color(0xFF3758D8), const Color(0xFFEFF6FF))),
            const SizedBox(width: 10),
            Expanded(child: _buildMetricCard('Active Seats', '12,450', const Color(0xFF10B981), const Color(0xFFECFDF5))),
            const SizedBox(width: 10),
            Expanded(child: _buildMetricCard('API Gateway', '4.2M/mo', const Color(0xFF8B5CF6), const Color(0xFFF5F3FF))),
          ],
        ),
        const SizedBox(height: 20),

        // Super Admin Quick Actions
        const Text(
          'Platform Governance',
          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.primaryNavy),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _buildActionItem(
              title: 'Remote Config',
              icon: Icons.tune,
              color: accentColor,
              bgColor: const Color(0xFFEFF6FF),
              onTap: () => _showSuperAdminSheet(context, 'Remote Configuration', 'Feature flags, maintenance mode & version enforcement'),
            ),
            _buildActionItem(
              title: 'Organizations',
              icon: Icons.business,
              color: const Color(0xFF10B981),
              bgColor: const Color(0xFFECFDF5),
              onTap: () => _showSuperAdminSheet(context, 'Organization Monitoring', '128 active enterprise client accounts'),
            ),
            _buildActionItem(
              title: 'Plans & Billing',
              icon: Icons.credit_card,
              color: const Color(0xFFF59E0B),
              bgColor: const Color(0xFFFFFBEB),
              onTap: () => _showSuperAdminSheet(context, 'Subscription Plans', 'Starter, Pro, Business, Enterprise pricing rules'),
            ),
            _buildActionItem(
              title: 'Audit Logs',
              icon: Icons.history,
              color: const Color(0xFF6B7280),
              bgColor: const Color(0xFFF3F4F6),
              onTap: () => _showSuperAdminSheet(context, 'Platform Security & Audit', 'Row-level audit trails and privileged session monitoring'),
            ),
          ],
        ),
        const SizedBox(height: 18),

        // Access Requests Approval Card (HR & Admin Remote Activation)
        _buildAccessRequestsCard(context, appState, ref),
        const SizedBox(height: 14),

        // Live Tenant Registry Preview
        const Text(
          'Recently Active Organizations',
          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.primaryNavy),
        ),
        const SizedBox(height: 10),
        _buildTenantItem('WorkForce 360 Ltd (Corporate HQ)', 'Enterprise Plan • 100 Employees', 'ACTIVE', const Color(0xFF10B981)),
        _buildTenantItem('WorkForce 360 Ltd (Gulshan Hub)', 'Enterprise Branch • 35 Employees', 'ACTIVE', const Color(0xFF10B981)),
        _buildTenantItem('WorkForce 360 Ltd (Dhanmondi Branch)', 'Enterprise Branch • 25 Employees', 'ACTIVE', const Color(0xFF10B981)),
      ],
    );
  }

  // ---------------------------------------------------------------------------
  // DASHBOARD 2: COMPANY ADMIN
  // ---------------------------------------------------------------------------
  Widget _buildCompanyAdminDashboard(BuildContext context, AppState appState, WidgetRef ref) {
    const accentColor = Color(0xFF10B981);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Company Admin Hero Banner
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF065F46), Color(0xFF10B981)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(22),
            boxShadow: [
              BoxShadow(
                color: accentColor.withOpacity(0.3),
                blurRadius: 18,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Text(
                      'COMPANY ADMIN PORTAL',
                      style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w900),
                    ),
                  ),
                  const Text('Banani HQ, Dhaka', style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.w600)),
                ],
              ),
              const SizedBox(height: 14),
              const Text('Total Monthly Payroll', style: TextStyle(fontSize: 12, color: Colors.white70, fontWeight: FontWeight.w600)),
              const SizedBox(height: 4),
              const Text('৳ 68,40,000 BDT', style: TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: Colors.white)),
              const SizedBox(height: 10),
              const Text('100 Staff across 5 Departments • 94% Today Attendance', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600)),
            ],
          ),
        ),
        const SizedBox(height: 18),

        // Metrics Grid (3 cards)
        Row(
          children: [
            Expanded(child: _buildMetricCard('Total Staff', '100', const Color(0xFF10B981), const Color(0xFFECFDF5))),
            const SizedBox(width: 10),
            Expanded(child: _buildMetricCard('Present Today', '94', const Color(0xFF3758D8), const Color(0xFFEFF6FF))),
            const SizedBox(width: 10),
            Expanded(child: _buildMetricCard('Teams', '5 Teams', const Color(0xFF8B5CF6), const Color(0xFFF5F3FF))),
          ],
        ),
        const SizedBox(height: 20),

        // Executive Quick Actions Grid
        const Text(
          'Company Administration',
          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.primaryNavy),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _buildActionItem(
              title: '3D ID Cards',
              icon: Icons.badge_outlined,
              color: AppColors.primaryBlue,
              bgColor: AppColors.actionBlueBg,
              onTap: () => context.push('/idcard'),
            ),
            _buildActionItem(
              title: '100 Staff',
              icon: Icons.people_outline,
              color: accentColor,
              bgColor: const Color(0xFFECFDF5),
              onTap: () => context.push('/teams'),
            ),
            _buildActionItem(
              title: 'Admin Vault',
              icon: Icons.vpn_key_outlined,
              color: Colors.deepPurple,
              bgColor: const Color(0xFFF5F3FF),
              onTap: () => context.push('/teams'),
            ),
            _buildActionItem(
              title: 'Geofences',
              icon: Icons.location_on_outlined,
              color: const Color(0xFFF59E0B),
              bgColor: const Color(0xFFFFFBEB),
              onTap: () => context.push('/attendance'),
            ),
          ],
        ),
        const SizedBox(height: 18),

        // Access Requests Card
        _buildAccessRequestsCard(context, appState, ref),
        const SizedBox(height: 14),

        // Department Breakdown
        const Text(
          '5 Department Headcount & Budgets',
          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.primaryNavy),
        ),
        const SizedBox(height: 10),
        _buildDeptCard('Engineering & Technology', '25 Employees', '৳25,00,000 Budget', const Color(0xFF3758D8)),
        _buildDeptCard('Product, UI/UX & Design', '20 Employees', '৳15,00,000 Budget', const Color(0xFFEC4899)),
        _buildDeptCard('Sales & Growth Operations', '20 Employees', '৳12,00,000 Budget', const Color(0xFFF59E0B)),
        _buildDeptCard('Human Resources & People', '18 Employees', '৳8,00,000 Budget', const Color(0xFF10B981)),
        _buildDeptCard('Finance, Payroll & Accounts', '17 Employees', '৳18,00,000 Budget', const Color(0xFF8B5CF6)),
      ],
    );
  }

  // ---------------------------------------------------------------------------
  // DASHBOARD 3: HR ADMIN
  // ---------------------------------------------------------------------------
  Widget _buildHrAdminDashboard(BuildContext context, AppState appState, WidgetRef ref) {
    const accentColor = Color(0xFFEC4899);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // HR Admin Hero Banner
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF831843), Color(0xFFEC4899)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(22),
            boxShadow: [
              BoxShadow(
                color: accentColor.withOpacity(0.3),
                blurRadius: 18,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Text('PEOPLE & TALENT OPS', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w900)),
                  ),
                  const Text('Apr 2025 Cycle', style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.w600)),
                ],
              ),
              const SizedBox(height: 14),
              const Text('Pending Approvals', style: TextStyle(fontSize: 12, color: Colors.white70, fontWeight: FontWeight.w600)),
              const SizedBox(height: 4),
              const Text('4 Leave Requests', style: TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: Colors.white)),
              const SizedBox(height: 10),
              const Text('100 Active Staff Profiles • All 5 Teams Fully Staffed', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600)),
            ],
          ),
        ),
        const SizedBox(height: 18),

        // HR Metrics
        Row(
          children: [
            Expanded(child: _buildMetricCard('Total Staff', '100', const Color(0xFFEC4899), const Color(0xFFFDF2F8))),
            const SizedBox(width: 10),
            Expanded(child: _buildMetricCard('On Leave', '6 Staff', const Color(0xFFF59E0B), const Color(0xFFFFFBEB))),
            const SizedBox(width: 10),
            Expanded(child: _buildMetricCard('Payslips', '100 Ready', const Color(0xFF10B981), const Color(0xFFECFDF5))),
          ],
        ),
        const SizedBox(height: 20),

        // HR Quick Actions
        const Text('HR Operations', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.primaryNavy)),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _buildActionItem(title: 'Approve Leaves', icon: Icons.event_available, color: accentColor, bgColor: const Color(0xFFFDF2F8), onTap: () => context.push('/leave')),
            _buildActionItem(title: 'Staff Directory', icon: Icons.people_outline, color: const Color(0xFF3758D8), bgColor: const Color(0xFFEFF6FF), onTap: () => context.push('/teams')),
            _buildActionItem(title: 'Print ID Cards', icon: Icons.badge_outlined, color: const Color(0xFF10B981), bgColor: const Color(0xFFECFDF5), onTap: () => context.push('/idcard')),
            _buildActionItem(title: 'Attendance', icon: Icons.access_time_rounded, color: const Color(0xFF8B5CF6), bgColor: const Color(0xFFF5F3FF), onTap: () => context.push('/attendance')),
          ],
        ),
        const SizedBox(height: 18),

        // Access Requests Card (1-click HR Approval)
        _buildAccessRequestsCard(context, appState, ref),
        const SizedBox(height: 18),

        // Pending Leave Approval Items
        const Text('Pending Staff Leave Requests', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.primaryNavy)),
        const SizedBox(height: 10),
        _buildLeaveApprovalItem(context, 'Sadia Islam', 'Product Design Lead', 'Annual Leave (3 Days)', 'Apr 28 - Apr 30'),
        _buildLeaveApprovalItem(context, 'Kamrul Ahsan', 'Finance Specialist', 'Sick Leave (1 Day)', 'Today, Apr 28'),
      ],
    );
  }

  // ---------------------------------------------------------------------------
  // DASHBOARD 4: TEAM MANAGER
  // ---------------------------------------------------------------------------
  Widget _buildManagerDashboard(BuildContext context, AppState appState, WidgetRef ref) {
    const accentColor = Color(0xFF8B5CF6);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Manager Hero Banner
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF4C1D95), Color(0xFF8B5CF6)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(22),
            boxShadow: [
              BoxShadow(
                color: accentColor.withOpacity(0.3),
                blurRadius: 18,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Text('DEPARTMENT MANAGER', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w900)),
                  ),
                  const Text('Engineering Dept', style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.w600)),
                ],
              ),
              const SizedBox(height: 14),
              const Text('Team Attendance Today', style: TextStyle(fontSize: 12, color: Colors.white70, fontWeight: FontWeight.w600)),
              const SizedBox(height: 4),
              const Text('23 / 25 Present (92%)', style: TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: Colors.white)),
              const SizedBox(height: 10),
              const Text('2 On Approved Leave • 18 Sprint Tasks In Progress', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600)),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // Access Requests Approval Card (HR Manager & Team Lead Approvals)
        _buildAccessRequestsCard(context, appState, ref),
        const SizedBox(height: 14),

        // Manager Metrics
        Row(
          children: [
            Expanded(child: _buildMetricCard('Team Size', '25 Staff', const Color(0xFF8B5CF6), const Color(0xFFF5F3FF))),
            const SizedBox(width: 10),
            Expanded(child: _buildMetricCard('In Office', '23 Present', const Color(0xFF10B981), const Color(0xFFECFDF5))),
            const SizedBox(width: 10),
            Expanded(child: _buildMetricCard('Tasks Done', '18 / 22', const Color(0xFF3758D8), const Color(0xFFEFF6FF))),
          ],
        ),
        const SizedBox(height: 20),

        // Manager Actions
        const Text('Team Supervision', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.primaryNavy)),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _buildActionItem(title: 'Team Roster', icon: Icons.groups_outlined, color: accentColor, bgColor: const Color(0xFFF5F3FF), onTap: () => context.push('/teams')),
            _buildActionItem(title: 'Sprint Tasks', icon: Icons.checklist_rtl, color: const Color(0xFF3758D8), bgColor: const Color(0xFFEFF6FF), onTap: () => context.push('/tasks')),
            _buildActionItem(title: 'ID Cards', icon: Icons.badge_outlined, color: const Color(0xFF10B981), bgColor: const Color(0xFFECFDF5), onTap: () => context.push('/idcard')),
            _buildActionItem(title: 'Timesheets', icon: Icons.timer_outlined, color: const Color(0xFFF59E0B), bgColor: const Color(0xFFFFFBEB), onTap: () => context.push('/analytics')),
          ],
        ),
        const SizedBox(height: 22),

        // Team Members List
        const Text("Today's Team Attendance", style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.primaryNavy)),
        const SizedBox(height: 10),
        _buildTeamMemberItem('Tanvir Hasan', 'Senior Tech Lead', '09:02 AM • Banani HQ', 'PRESENT', const Color(0xFF10B981)),
        _buildTeamMemberItem('Ahmed Rahman', 'Software Engineer', '09:15 AM • Banani HQ', 'PRESENT', const Color(0xFF10B981)),
        _buildTeamMemberItem('Sarah Khan', 'UI/UX Specialist', 'Remote Approval', 'REMOTE', const Color(0xFF3758D8)),
      ],
    );
  }

  // ---------------------------------------------------------------------------
  // DASHBOARD 5: EMPLOYEE SELF-SERVICE
  // ---------------------------------------------------------------------------
  Widget _buildEmployeeDashboard(BuildContext context, AppState appState, WidgetRef ref) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Today's Status Banner Card
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: AppColors.heroCardGradient,
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: AppColors.primaryBlue.withOpacity(0.3),
                blurRadius: 18,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("Today's Status", style: TextStyle(fontSize: 12, color: Colors.white70, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: appState.isPresent ? AppColors.presentGreen : AppColors.absentRed,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          appState.isPresent ? 'Present' : 'Not Checked In',
                          style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w800),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        appState.isPresent ? 'at ${appState.checkInTime}' : '--:--',
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(appState.attendanceLocation, style: const TextStyle(fontSize: 11, color: Colors.white70)),
                ],
              ),
              ElevatedButton(
                onPressed: () {
                  final checkedIn = ref.read(appStateProvider.notifier).toggleAttendance();
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(checkedIn ? 'GPS Geofence Verified! Checked in successfully.' : 'Checked out successfully.'),
                      backgroundColor: checkedIn ? AppColors.presentGreen : AppColors.primaryNavy,
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: appState.isPresent ? AppColors.absentRed : AppColors.primaryBlue,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  elevation: 4,
                ),
                child: Text(
                  appState.isPresent ? 'Check Out' : 'Check In',
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),

        // Employee Overview Metrics
        Row(
          children: [
            Expanded(child: _buildMetricCard('Working Days', '${appState.workingDays}d', AppColors.primaryBlue, AppColors.actionBlueBg)),
            const SizedBox(width: 10),
            Expanded(child: _buildMetricCard('Leaves Used', '${appState.leavesUsed}d', AppColors.lateAmber, AppColors.actionAmberBg)),
            const SizedBox(width: 10),
            Expanded(child: _buildMetricCard('Tasks Done', '${appState.tasksDone}', AppColors.presentGreen, AppColors.actionGreenBg)),
          ],
        ),
        const SizedBox(height: 20),

        // Quick Actions
        const Text('Quick Actions', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.primaryNavy)),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _buildActionItem(title: 'Digital ID', icon: Icons.badge_outlined, color: AppColors.primaryBlue, bgColor: AppColors.actionBlueBg, onTap: () => context.push('/idcard')),
            _buildActionItem(title: 'Apply Leave', icon: Icons.calendar_month_outlined, color: AppColors.lateAmber, bgColor: AppColors.actionAmberBg, onTap: () => context.push('/leave')),
            _buildActionItem(title: 'Attendance', icon: Icons.access_time_filled, color: AppColors.presentGreen, bgColor: AppColors.actionGreenBg, onTap: () => context.push('/attendance')),
            _buildActionItem(title: 'Directory', icon: Icons.people_outline, color: Colors.purple, bgColor: Colors.purple.shade50, onTap: () => context.push('/teams')),
          ],
        ),
        const SizedBox(height: 22),

        // Leave Balances
        const Text('Leave Balances (2025)', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.primaryNavy)),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(child: _buildLeaveCard('Annual', '18 Days', AppColors.primaryBlue)),
            const SizedBox(width: 8),
            Expanded(child: _buildLeaveCard('Sick', '12 Days', AppColors.presentGreen)),
            const SizedBox(width: 8),
            Expanded(child: _buildLeaveCard('Casual', '8 Days', AppColors.lateAmber)),
            const SizedBox(width: 8),
            Expanded(child: _buildLeaveCard('Special', '5 Days', Colors.purple)),
          ],
        ),
      ],
    );
  }

  // ---------------------------------------------------------------------------
  // ROLE SWITCHER BOTTOM SHEET
  // ---------------------------------------------------------------------------
  void _showRoleSwitchSheet(BuildContext context, AppStateNotifier appNotifier, String currentRole) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 44,
                  height: 4,
                  decoration: BoxDecoration(color: AppColors.borderLight, borderRadius: BorderRadius.circular(2)),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Switch Active Workspace Role',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: AppColors.primaryNavy),
              ),
              const SizedBox(height: 4),
              const Text(
                'Instant preview of all 5 enterprise dashboards inside the mobile app',
                style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 16),
              _buildRoleSwitchTile(context, appNotifier, currentRole, 'super_admin', 'Platform Super Admin', 'Global SaaS & Cloud Root Access', Icons.shield_outlined, const Color(0xFF3758D8)),
              _buildRoleSwitchTile(context, appNotifier, currentRole, 'company_admin', 'Company Admin', 'Manage 100 Employees, Payroll & Vault', Icons.business_outlined, const Color(0xFF10B981)),
              _buildRoleSwitchTile(context, appNotifier, currentRole, 'hr_admin', 'HR Admin', 'Leave Approvals, Rosters & People Ops', Icons.people_alt_outlined, const Color(0xFFEC4899)),
              _buildRoleSwitchTile(context, appNotifier, currentRole, 'manager', 'Team Manager', 'Engineering Department Roster & Tasks', Icons.supervisor_account_outlined, const Color(0xFF8B5CF6)),
              _buildRoleSwitchTile(context, appNotifier, currentRole, 'employee', 'Employee Self-Service', 'Personal Attendance, Tasks & 3D ID Card', Icons.badge_outlined, const Color(0xFF06B6D4)),
              const SizedBox(height: 10),
            ],
          ),
        );
      },
    );
  }

  Widget _buildRoleSwitchTile(
    BuildContext context,
    AppStateNotifier appNotifier,
    String currentRole,
    String roleKey,
    String title,
    String subtitle,
    IconData icon,
    Color color,
  ) {
    final isSelected = currentRole == roleKey;
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: color.withOpacity(0.12),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Icon(icon, color: color, size: 22),
      ),
      title: Text(title, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: isSelected ? color : AppColors.primaryNavy)),
      subtitle: Text(subtitle, style: const TextStyle(fontSize: 10, color: AppColors.textSecondary)),
      trailing: isSelected ? Icon(Icons.check_circle, color: color, size: 20) : null,
      onTap: () {
        appNotifier.switchRole(roleKey);
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Switched to $title Dashboard!'),
            backgroundColor: color,
            duration: const Duration(seconds: 1),
          ),
        );
      },
    );
  }

  void _showSuperAdminSheet(BuildContext context, String title, String subtitle) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.primaryNavy)),
              const SizedBox(height: 6),
              Text(subtitle, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(color: const Color(0xFFEFF6FF), borderRadius: BorderRadius.circular(14)),
                child: const Row(
                  children: [
                    Icon(Icons.check_circle_outline, color: Color(0xFF3758D8)),
                    SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Live Supabase Synchronized: Remote device lock, release telemetry & multi-tenant isolation enforced.',
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF1E3A8A)),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF3758D8), foregroundColor: Colors.white),
                  child: const Text('Close Preview', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // ---------------------------------------------------------------------------
  // REUSABLE DASHBOARD WIDGETS
  // ---------------------------------------------------------------------------
  Widget _buildMetricCard(String label, String value, Color color, Color bgColor) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.borderLight),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Text(
            label,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.textSecondary),
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: color),
          ),
        ],
      ),
    );
  }

  Widget _buildActionItem({
    required String title,
    required IconData icon,
    required Color color,
    required Color bgColor,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 58,
            height: 58,
            decoration: BoxDecoration(
              color: bgColor,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: color.withOpacity(0.18)),
              boxShadow: [
                BoxShadow(
                  color: color.withOpacity(0.12),
                  blurRadius: 8,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: Icon(icon, color: color, size: 26),
          ),
          const SizedBox(height: 6),
          Text(
            title,
            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.primaryNavy),
          ),
        ],
      ),
    );
  }

  Widget _buildTenantItem(String name, String sub, String status, Color statusColor) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: const Color(0xFFEFF6FF), borderRadius: BorderRadius.circular(10)),
                child: const Icon(Icons.business, color: Color(0xFF3758D8), size: 18),
              ),
              const SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.primaryNavy)),
                  Text(sub, style: const TextStyle(fontSize: 10, color: AppColors.textSecondary)),
                ],
              ),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(color: statusColor.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
            child: Text(status, style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: statusColor)),
          ),
        ],
      ),
    );
  }

  Widget _buildDeptCard(String title, String count, String budget, Color color) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                width: 10,
                height: 10,
                decoration: BoxDecoration(color: color, shape: BoxShape.circle),
              ),
              const SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.primaryNavy)),
                  Text(count, style: const TextStyle(fontSize: 10, color: AppColors.textSecondary)),
                ],
              ),
            ],
          ),
          Text(budget, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: color)),
        ],
      ),
    );
  }

  Widget _buildLeaveApprovalItem(BuildContext context, String name, String desig, String type, String dates) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.primaryNavy)),
              Text('$desig • $type', style: const TextStyle(fontSize: 10, color: AppColors.textSecondary)),
              Text(dates, style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFFEC4899))),
            ],
          ),
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.check_circle, color: Color(0xFF10B981), size: 24),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Approved leave request for $name!'), backgroundColor: const Color(0xFF10B981)),
                  );
                },
              ),
              IconButton(
                icon: const Icon(Icons.cancel, color: Color(0xFFEF4444), size: 24),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Declined leave request for $name.'), backgroundColor: const Color(0xFFEF4444)),
                  );
                },
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAccessRequestsCard(BuildContext context, AppState appState, WidgetRef ref) {
    final pending = appState.pendingAccessRequests.where((r) => r.status == 'PENDING').toList();

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFF59E0B).withOpacity(0.35)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFF59E0B).withOpacity(0.08),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF59E0B).withOpacity(0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.person_add_rounded, color: Color(0xFFF59E0B), size: 18),
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    'অ্যাকাউন্ট অ্যাক্সেস অনুমোদন',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.primaryNavy),
                  ),
                ],
              ),
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.sync_rounded, color: Color(0xFFF59E0B), size: 18),
                    tooltip: 'Sync from Supabase',
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                    onPressed: () async {
                      await ref.read(appStateProvider.notifier).fetchPendingRequestsFromSupabase();
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Supabase Cloud থেকে অ্যাক্সেস রিকোয়েস্ট সিঙ্ক করা হয়েছে'),
                            backgroundColor: Color(0xFF10B981),
                            duration: Duration(seconds: 2),
                          ),
                        );
                      }
                    },
                  ),
                  const SizedBox(width: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: pending.isNotEmpty ? const Color(0xFFF59E0B) : const Color(0xFF10B981),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      pending.isNotEmpty ? '${pending.length} টি বাকি' : 'সব অনুমোদিত',
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: Colors.white),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 6),
          const Text(
            'নতুন কর্মী মোবাইল অ্যাপ বা সাইট থেকে রেজিস্ট্রেশন করলে HR Admin অনুমোদন দেওয়ার পর লগইন করতে পারে।',
            style: TextStyle(fontSize: 11, color: AppColors.textSecondary, height: 1.3),
          ),
          const SizedBox(height: 12),
          if (pending.isEmpty)
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF0FDF4),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFBBF7D0)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.check_circle_outline, color: Color(0xFF16A34A), size: 18),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'বর্তমানে কোনো নতুন অ্যাকাউন্ট অনুমোদন অপেক্ষমাণ নেই।',
                      style: TextStyle(fontSize: 12, color: Color(0xFF166534), fontWeight: FontWeight.w600),
                    ),
                  ),
                ],
              ),
            )
          else
            ...pending.map((req) {
              return Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.borderLight),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          req.fullName,
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.primaryNavy),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFEF3C7),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Text(
                            'PENDING HR',
                            style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Color(0xFFB45309)),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${req.designation} • ${req.department}',
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.primaryBlue),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'ইমেইল: ${req.email} | ফোন: ${req.phone}',
                      style: const TextStyle(fontSize: 10, color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () {
                              ref.read(appStateProvider.notifier).approveAccessRequest(req.id);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('✅ ${req.fullName}-এর অ্যাকাউন্ট অনুমোদন ও সক্রিয় করা হয়েছে!'),
                                  backgroundColor: const Color(0xFF10B981),
                                ),
                              );
                            },
                            icon: const Icon(Icons.check, size: 16),
                            label: const Text('Approve (অনুমোদন)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF10B981),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 8),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              elevation: 0,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        OutlinedButton.icon(
                          onPressed: () {
                            ref.read(appStateProvider.notifier).rejectAccessRequest(req.id);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('❌ ${req.fullName}-এর আবেদন বাতিল করা হয়েছে।'),
                                backgroundColor: Colors.red,
                              ),
                            );
                          },
                          icon: const Icon(Icons.close, size: 14, color: Colors.red),
                          label: const Text('Decline', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Colors.red)),
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Colors.redAccent),
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            }),
        ],
      ),
    );
  }

  Widget _buildTeamMemberItem(String name, String desig, String checkIn, String status, Color statusColor) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.primaryNavy)),
              Text('$desig • $checkIn', style: const TextStyle(fontSize: 10, color: AppColors.textSecondary)),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(color: statusColor.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
            child: Text(status, style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: statusColor)),
          ),
        ],
      ),
    );
  }

  Widget _buildLeaveCard(String title, String count, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 6),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Column(
        children: [
          Text(title, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
          const SizedBox(height: 4),
          Text(count, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: color)),
        ],
      ),
    );
  }

  Widget _buildAppDrawer(BuildContext context, AppState appState, WidgetRef ref) {
    final roleColor = _getRoleColor(appState.userRole);

    return Drawer(
      backgroundColor: Colors.white,
      child: Column(
        children: [
          UserAccountsDrawerHeader(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [const Color(0xFF17243B), roleColor],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            accountName: Text(appState.userName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            accountEmail: Text('${appState.userEmail}\n${_getRoleTitle(appState.userRole)}', style: const TextStyle(color: Colors.white70, fontSize: 11)),
            currentAccountPicture: CircleAvatar(
              backgroundImage: NetworkImage(appState.userAvatarUrl),
            ),
          ),
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                if (appState.userRole == 'super_admin' || appState.userRole == 'company_admin') ...[
                  ListTile(
                    leading: const Icon(Icons.swap_horiz_rounded, color: Colors.deepPurple),
                    title: const Text('Switch Role Dashboard', style: TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text('Current: ${_getRoleTitle(appState.userRole)}', style: const TextStyle(fontSize: 11)),
                    onTap: () {
                      Navigator.pop(context);
                      _showRoleSwitchSheet(context, ref.read(appStateProvider.notifier), appState.userRole);
                    },
                  ),
                  const Divider(),
                ],
                ListTile(
                  leading: const Icon(Icons.badge_outlined, color: AppColors.primaryBlue),
                  title: const Text('3D Smart ID Card (Double-Sided)', style: TextStyle(fontWeight: FontWeight.w600)),
                  onTap: () {
                    Navigator.pop(context);
                    context.push('/idcard');
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.people_outline, color: Color(0xFF10B981)),
                  title: const Text('100 Staff & 5 Teams Directory', style: TextStyle(fontWeight: FontWeight.w600)),
                  onTap: () {
                    Navigator.pop(context);
                    context.push('/teams');
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.vpn_key_outlined, color: Colors.deepPurple),
                  title: const Text('Admin Credentials Vault', style: TextStyle(fontWeight: FontWeight.w600)),
                  onTap: () {
                    Navigator.pop(context);
                    context.push('/teams');
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.fingerprint, color: AppColors.primaryNavy),
                  title: const Text('Attendance', style: TextStyle(fontWeight: FontWeight.w600)),
                  onTap: () {
                    Navigator.pop(context);
                    context.push('/attendance');
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.calendar_month_outlined, color: AppColors.lateAmber),
                  title: const Text('Leave Management', style: TextStyle(fontWeight: FontWeight.w600)),
                  onTap: () {
                    Navigator.pop(context);
                    context.push('/leave');
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.task_alt, color: AppColors.primaryBlue),
                  title: const Text('Tasks & Projects', style: TextStyle(fontWeight: FontWeight.w600)),
                  onTap: () {
                    Navigator.pop(context);
                    context.push('/tasks');
                  },
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: SizedBox(
              width: double.infinity,
              height: 46,
              child: OutlinedButton.icon(
                onPressed: () {
                  Navigator.pop(context);
                  context.go('/login');
                },
                icon: const Icon(Icons.logout, color: AppColors.absentRed, size: 18),
                label: const Text('Log Out / লগআউট', style: TextStyle(color: AppColors.absentRed, fontWeight: FontWeight.bold)),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: AppColors.absentRed),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Helper methods
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

  String _getRoleShortTitle(String role) {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'company_admin':
        return 'Company Admin';
      case 'hr_admin':
        return 'HR Admin';
      case 'manager':
        return 'Manager';
      case 'employee':
      default:
        return 'Employee';
    }
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
}
