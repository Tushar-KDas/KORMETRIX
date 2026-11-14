import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/colors.dart';
import '../../core/state/app_state.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  void _showPersonalInfoSheet(BuildContext context, AppState appState, WidgetRef ref) {
    final nameCtrl = TextEditingController(text: appState.userName);
    final phoneCtrl = TextEditingController(text: appState.userPhone);
    final locationCtrl = TextEditingController(text: appState.userLocation);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(28))),
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
              Center(child: Container(width: 44, height: 4, decoration: BoxDecoration(color: AppColors.borderLight, borderRadius: BorderRadius.circular(2)))),
              const SizedBox(height: 16),
              const Text('Personal Information', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.primaryNavy)),
              const SizedBox(height: 16),
              TextField(
                controller: nameCtrl,
                decoration: InputDecoration(
                  labelText: 'Full Name',
                  prefixIcon: const Icon(Icons.person_outline, size: 20),
                  filled: true,
                  fillColor: AppColors.backgroundLight,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: phoneCtrl,
                decoration: InputDecoration(
                  labelText: 'Phone Number',
                  prefixIcon: const Icon(Icons.phone_outlined, size: 20),
                  filled: true,
                  fillColor: AppColors.backgroundLight,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: locationCtrl,
                decoration: InputDecoration(
                  labelText: 'Location',
                  prefixIcon: const Icon(Icons.location_on_outlined, size: 20),
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
                  onPressed: () {
                    ref.read(appStateProvider.notifier).updateProfile(
                          name: nameCtrl.text.trim(),
                          phone: phoneCtrl.text.trim(),
                          location: locationCtrl.text.trim(),
                        );
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Profile information updated successfully!'),
                        backgroundColor: AppColors.presentGreen,
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryBlue,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: const Text('Save Changes', style: TextStyle(fontWeight: FontWeight.w800)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showChangePasswordSheet(BuildContext context) {
    final oldPassCtrl = TextEditingController();
    final newPassCtrl = TextEditingController();
    final confirmPassCtrl = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(28))),
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
              Center(child: Container(width: 44, height: 4, decoration: BoxDecoration(color: AppColors.borderLight, borderRadius: BorderRadius.circular(2)))),
              const SizedBox(height: 16),
              const Text('Change Password', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.primaryNavy)),
              const SizedBox(height: 16),
              TextField(
                controller: oldPassCtrl,
                obscureText: true,
                decoration: InputDecoration(
                  labelText: 'Current Password',
                  prefixIcon: const Icon(Icons.lock_outline, size: 20),
                  filled: true,
                  fillColor: AppColors.backgroundLight,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: newPassCtrl,
                obscureText: true,
                decoration: InputDecoration(
                  labelText: 'New Password',
                  prefixIcon: const Icon(Icons.lock_reset, size: 20),
                  filled: true,
                  fillColor: AppColors.backgroundLight,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: confirmPassCtrl,
                obscureText: true,
                decoration: InputDecoration(
                  labelText: 'Confirm New Password',
                  prefixIcon: const Icon(Icons.check_circle_outline, size: 20),
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
                  onPressed: () {
                    if (newPassCtrl.text != confirmPassCtrl.text) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Passwords do not match!'), backgroundColor: AppColors.absentRed),
                      );
                      return;
                    }
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Password updated successfully!'),
                        backgroundColor: AppColors.presentGreen,
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryBlue,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: const Text('Update Password', style: TextStyle(fontWeight: FontWeight.w800)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final appState = ref.watch(appStateProvider);

    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Header with Curved Royal Blue Gradient Banner (Matches Mockup Image 8)
            Stack(
              clipBehavior: Clip.none,
              alignment: Alignment.center,
              children: [
                Container(
                  height: 140,
                  width: double.infinity,
                  decoration: const BoxDecoration(
                    gradient: AppColors.heroCardGradient,
                    borderRadius: BorderRadius.vertical(bottom: Radius.circular(32)),
                  ),
                  child: SafeArea(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 20),
                            onPressed: () => context.go('/home'),
                          ),
                          const Text(
                            'Profile',
                            style: TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.w800),
                          ),
                          IconButton(
                            icon: const Icon(Icons.settings_outlined, color: Colors.white, size: 22),
                            onPressed: () => context.push('/settings'),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                // Circular Avatar resting on boundary
                Positioned(
                  bottom: -46,
                  child: Container(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 4),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.12),
                          blurRadius: 14,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: CircleAvatar(
                      radius: 46,
                      backgroundImage: NetworkImage(appState.userAvatarUrl),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 56),

            // User Name & Designation
            Text(
              appState.userName,
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w900,
                color: AppColors.primaryNavy,
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              appState.userDesignation,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 20),

            // Contact Information Card (Matches Mockup Image 8)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppColors.backgroundLight,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: AppColors.borderLight),
                ),
                child: Column(
                  children: [
                    _buildContactRow(Icons.mail_outline_rounded, appState.userEmail, AppColors.primaryBlue),
                    const Divider(height: 20, color: AppColors.borderLight),
                    _buildContactRow(Icons.phone_outlined, appState.userPhone, AppColors.presentGreen),
                    const Divider(height: 20, color: AppColors.borderLight),
                    _buildContactRow(Icons.location_on_outlined, appState.userLocation, AppColors.lateAmber),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Menu Items List (Matches Mockup Image 8: Personal Information, Change Password, Notifications, App Settings)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                children: [
                  _buildMenuItem(
                    icon: Icons.badge_outlined,
                    title: 'Digital Smart ID Card (Both Sides)',
                    onTap: () => context.push('/idcard'),
                  ),
                  _buildMenuItem(
                    icon: Icons.people_outline_rounded,
                    title: '100 Staff & 5 Teams Directory',
                    onTap: () => context.push('/teams'),
                  ),
                  _buildMenuItem(
                    icon: Icons.person_outline_rounded,
                    title: 'Personal Information',
                    onTap: () => _showPersonalInfoSheet(context, appState, ref),
                  ),
                  _buildMenuItem(
                    icon: Icons.lock_outline_rounded,
                    title: 'Change Password',
                    onTap: () => _showChangePasswordSheet(context),
                  ),
                  _buildMenuItem(
                    icon: Icons.vpn_key_outlined,
                    title: 'Admin Credentials Vault (Restricted)',
                    onTap: () => context.push('/teams'),
                  ),
                  _buildMenuItem(
                    icon: Icons.notifications_none_rounded,
                    title: 'Notifications',
                    onTap: () => context.push('/notifications'),
                  ),
                  _buildMenuItem(
                    icon: Icons.settings_outlined,
                    title: 'App Settings',
                    onTap: () => context.push('/settings'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildContactRow(IconData icon, String text, Color iconColor) {
    return Row(
      children: [
        Icon(icon, size: 18, color: iconColor),
        const SizedBox(width: 12),
        Text(
          text,
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w700,
            color: AppColors.primaryNavy,
          ),
        ),
      ],
    );
  }

  Widget _buildMenuItem({required IconData icon, required String title, required VoidCallback onTap}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppColors.backgroundLight,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: AppColors.borderLight),
          ),
          child: Icon(icon, color: AppColors.primaryBlue, size: 20),
        ),
        title: Text(
          title,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.primaryNavy),
        ),
        trailing: const Icon(Icons.chevron_right_rounded, color: AppColors.textMuted, size: 22),
        onTap: onTap,
      ),
    );
  }
}
