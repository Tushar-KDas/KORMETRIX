import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../core/constants/colors.dart';
import '../core/state/app_state.dart';
import '../features/dashboard/home_screen.dart';
import '../features/tasks/tasks_screen.dart';
import '../features/analytics/analytics_screen.dart';
import '../features/profile/profile_screen.dart';

class MainNavigationShell extends ConsumerStatefulWidget {
  final int initialIndex;
  const MainNavigationShell({super.key, this.initialIndex = 0});

  @override
  ConsumerState<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends ConsumerState<MainNavigationShell> {
  late int _currentIndex;

  final List<Widget> _pages = const [
    HomeScreen(),
    TasksScreen(),
    AnalyticsScreen(),
    ProfileScreen(),
  ];

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
  }

  void _onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final appState = ref.watch(appStateProvider);

    return Scaffold(
      drawer: _buildDrawer(context, appState),
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: const Border(top: BorderSide(color: AppColors.borderLight, width: 1)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 16,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildNavItem(0, Icons.home_filled, 'Home'),
                _buildNavItem(1, Icons.task_alt, 'Tasks'),
                _buildNavItem(2, Icons.bar_chart_rounded, 'Reports'),
                _buildNavItem(3, Icons.person_outline, 'Profile'),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDrawer(BuildContext context, AppState appState) {
    return Drawer(
      backgroundColor: Colors.white,
      child: Column(
        children: [
          // Drawer Header
          Container(
            padding: const EdgeInsets.fromLTRB(20, 50, 20, 20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(0xFF17243B),
                  _getRoleColor(appState.userRole),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 28,
                  backgroundImage: NetworkImage(appState.userAvatarUrl),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        appState.userName,
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 16),
                      ),
                      Text(
                        '${appState.userDesignation} • ${appState.organizationName}',
                        style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.w600),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: _getRoleColor(appState.userRole),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          _getRoleTitle(appState.userRole).toUpperCase(),
                          style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.w900),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Drawer Menu Items
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(vertical: 8),
              children: [
                if (appState.userRole == 'super_admin' || appState.userRole == 'company_admin') ...[
                  _buildDrawerItem(
                    icon: Icons.swap_horiz_rounded,
                    title: 'Switch Role (${_getRoleTitle(appState.userRole)})',
                    color: Colors.deepPurple,
                    onTap: () {
                      Navigator.pop(context);
                      _showRoleSwitchSheet(context, ref.read(appStateProvider.notifier), appState.userRole);
                    },
                  ),
                  const Divider(height: 16, color: AppColors.borderLight),
                ],
                _buildDrawerItem(
                  icon: Icons.badge_outlined,
                  title: 'Digital Smart ID Card (Both Sides)',
                  color: AppColors.primaryBlue,
                  onTap: () {
                    Navigator.pop(context);
                    context.push('/idcard');
                  },
                ),
                _buildDrawerItem(
                  icon: Icons.people_outline_rounded,
                  title: '100 Staff & 5 Teams Directory',
                  color: AppColors.presentGreen,
                  onTap: () {
                    Navigator.pop(context);
                    context.push('/teams');
                  },
                ),
                _buildDrawerItem(
                  icon: Icons.vpn_key_outlined,
                  title: 'Admin Credentials Vault',
                  color: Colors.deepPurple,
                  onTap: () {
                    Navigator.pop(context);
                    context.push('/teams');
                  },
                ),
                const Divider(height: 16, color: AppColors.borderLight),
                _buildDrawerItem(
                  icon: Icons.fingerprint,
                  title: 'Attendance (Check In/Out)',
                  color: AppColors.primaryNavy,
                  onTap: () {
                    Navigator.pop(context);
                    context.push('/attendance');
                  },
                ),
                _buildDrawerItem(
                  icon: Icons.calendar_month_outlined,
                  title: 'Apply Leave Portal',
                  color: AppColors.lateAmber,
                  onTap: () {
                    Navigator.pop(context);
                    context.push('/leave');
                  },
                ),
                _buildDrawerItem(
                  icon: Icons.notifications_none_rounded,
                  title: 'Notifications & Alerts',
                  color: AppColors.primaryNavy,
                  onTap: () {
                    Navigator.pop(context);
                    context.push('/notifications');
                  },
                ),
                _buildDrawerItem(
                  icon: Icons.settings_outlined,
                  title: 'App Settings & Security',
                  color: AppColors.primaryNavy,
                  onTap: () {
                    Navigator.pop(context);
                    context.push('/settings');
                  },
                ),
              ],
            ),
          ),

          // Sign out footer
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
                label: const Text('Sign Out / লগআউট', style: TextStyle(color: AppColors.absentRed, fontWeight: FontWeight.w800, fontSize: 13)),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.redAccent, width: 1.2),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDrawerItem({
    required IconData icon,
    required String title,
    required Color color,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: color, size: 20),
      ),
      title: Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.primaryNavy)),
      trailing: const Icon(Icons.arrow_forward_ios, size: 12, color: AppColors.textMuted),
      onTap: onTap,
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label) {
    final isSelected = _currentIndex == index;
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: () => _onTabTapped(index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.actionBlueBg : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 24,
              color: isSelected ? AppColors.primaryBlue : AppColors.textMuted,
            ),
            const SizedBox(height: 3),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w500,
                color: isSelected ? AppColors.primaryBlue : AppColors.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
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
              _buildRoleTile(context, appNotifier, currentRole, 'super_admin', 'Platform Super Admin', 'Global SaaS & Cloud Root Access', Icons.shield_outlined, const Color(0xFF3758D8)),
              _buildRoleTile(context, appNotifier, currentRole, 'company_admin', 'Company Admin', 'Manage 100 Employees, Payroll & Vault', Icons.business_outlined, const Color(0xFF10B981)),
              _buildRoleTile(context, appNotifier, currentRole, 'hr_admin', 'HR Admin', 'Leave Approvals, Rosters & People Ops', Icons.people_alt_outlined, const Color(0xFFEC4899)),
              _buildRoleTile(context, appNotifier, currentRole, 'manager', 'Team Manager', 'Engineering Department Roster & Tasks', Icons.supervisor_account_outlined, const Color(0xFF8B5CF6)),
              _buildRoleTile(context, appNotifier, currentRole, 'employee', 'Employee Self-Service', 'Personal Attendance, Tasks & 3D ID Card', Icons.badge_outlined, const Color(0xFF06B6D4)),
              const SizedBox(height: 10),
            ],
          ),
        );
      },
    );
  }

  Widget _buildRoleTile(
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
}
