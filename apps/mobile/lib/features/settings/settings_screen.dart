import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/colors.dart';
import '../../core/state/app_state.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  void _showAppPreferencesSheet(BuildContext context, AppState appState, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(28))),
      builder: (context) {
        return Consumer(
          builder: (context, ref, _) {
            final state = ref.watch(appStateProvider);
            final notifier = ref.read(appStateProvider.notifier);

            return Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(child: Container(width: 44, height: 4, decoration: BoxDecoration(color: AppColors.borderLight, borderRadius: BorderRadius.circular(2)))),
                  const SizedBox(height: 16),
                  const Text('App Preferences', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.primaryNavy)),
                  const SizedBox(height: 16),
                  SwitchListTile(
                    title: const Text('Biometric App Unlock', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    subtitle: const Text('Require fingerprint or Face ID to unlock', style: TextStyle(fontSize: 12)),
                    value: state.biometricEnabled,
                    activeColor: AppColors.primaryBlue,
                    onChanged: (val) => notifier.toggleBiometric(val),
                  ),
                  SwitchListTile(
                    title: const Text('Push Notifications', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    subtitle: const Text('Receive alerts for tasks and approvals', style: TextStyle(fontSize: 12)),
                    value: state.pushNotificationsEnabled,
                    activeColor: AppColors.primaryBlue,
                    onChanged: (val) => notifier.togglePushNotifications(val),
                  ),
                  SwitchListTile(
                    title: const Text('Offline Auto-Sync', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    subtitle: const Text('Auto-sync queued punches upon internet reconnection', style: TextStyle(fontSize: 12)),
                    value: state.autoSyncEnabled,
                    activeColor: AppColors.primaryBlue,
                    onChanged: (val) => notifier.toggleAutoSync(val),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => Navigator.pop(context),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primaryBlue,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('Done'),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showSecuritySheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(28))),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(child: Container(width: 44, height: 4, decoration: BoxDecoration(color: AppColors.borderLight, borderRadius: BorderRadius.circular(2)))),
              const SizedBox(height: 16),
              const Text('Security & Privacy', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.primaryNavy)),
              const SizedBox(height: 12),
              const Text('• Enterprise 256-bit AES Encryption for offline storage.'),
              const SizedBox(height: 6),
              const Text('• Device Attestation: Device hardware ID is bound to your profile.'),
              const SizedBox(height: 6),
              const Text('• Geofence Privacy: GPS coordinates are only queried upon punch action.'),
              const SizedBox(height: 6),
              const Text('• Remote Lock Support: Active session can be remotely wiped by HR if lost.'),
              const SizedBox(height: 18),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryBlue,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Close'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showAboutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Text('WorkForce 360', style: TextStyle(fontWeight: FontWeight.w900)),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Version: 2.0.0 (Release Build)'),
            SizedBox(height: 4),
            Text('Tagline: One Platform. Complete Workforce Control.'),
            SizedBox(height: 4),
            Text('Enterprise Tenant: WorkForce 360 Ltd'),
            SizedBox(height: 4),
            Text('Engineered with Flutter & Supabase.'),
            SizedBox(height: 8),
            Text('© 2026 WorkForce 360 Inc. All rights reserved.', style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('OK')),
        ],
      ),
    );
  }

  void _showHelpSupportSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(28))),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(child: Container(width: 44, height: 4, decoration: BoxDecoration(color: AppColors.borderLight, borderRadius: BorderRadius.circular(2)))),
              const SizedBox(height: 16),
              const Text('Help & Support', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.primaryNavy)),
              const SizedBox(height: 12),
              const ListTile(
                leading: Icon(Icons.email_outlined, color: AppColors.primaryBlue),
                title: Text('Email Support'),
                subtitle: Text('support@workforce360.com'),
              ),
              const ListTile(
                leading: Icon(Icons.phone_in_talk_outlined, color: AppColors.presentGreen),
                title: Text('Helpline (Bangladesh)'),
                subtitle: Text('+880 9612 360360 (9 AM - 8 PM)'),
              ),
              const ListTile(
                leading: Icon(Icons.chat_bubble_outline, color: AppColors.accentCyan),
                title: Text('Live HR Desk Chat'),
                subtitle: Text('Available for active employees'),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryBlue,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Close'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _confirmLogout(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Text('Confirm Log Out', style: TextStyle(fontWeight: FontWeight.w800)),
        content: const Text('Are you sure you want to log out of your WorkForce 360 account?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel', style: TextStyle(color: AppColors.textSecondary)),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              context.go('/login');
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.absentRed,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text('Log Out'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final appState = ref.watch(appStateProvider);
    final appNotifier = ref.read(appStateProvider.notifier);
    final canPop = Navigator.of(context).canPop();

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        leading: canPop
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios_new, size: 20, color: AppColors.primaryNavy),
                onPressed: () => context.pop(),
              )
            : null,
        title: const Text(
          'Settings',
          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17, color: AppColors.primaryNavy),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
          child: Column(
            children: [
              // Mini User Profile Card (Matches Mockup Image 10)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.backgroundLight,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.borderLight),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 26,
                      backgroundImage: NetworkImage(appState.userAvatarUrl),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            appState.userName,
                            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: AppColors.primaryNavy),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            appState.userEmail,
                            style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, fontWeight: FontWeight.w500),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 22),

              // Setting Menu List (Matches Mockup Image 10)
              _buildSettingItem(
                icon: Icons.tune_rounded,
                title: 'App Preferences',
                onTap: () => _showAppPreferencesSheet(context, appState, ref),
              ),
              _buildSettingItem(
                icon: Icons.shield_outlined,
                title: 'Security & Privacy',
                onTap: () => _showSecuritySheet(context),
              ),
              _buildSettingItem(
                icon: Icons.language_rounded,
                title: 'Language',
                value: appState.language,
                onTap: () {
                  appNotifier.toggleLanguage();
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Language set to ${appState.language == "English" ? "বাংলা" : "English"}'),
                      duration: const Duration(seconds: 1),
                    ),
                  );
                },
              ),
              _buildSettingItem(
                icon: Icons.palette_outlined,
                title: 'Theme',
                value: appState.themeMode == ThemeMode.light ? 'Light' : 'Dark',
                onTap: () {
                  appNotifier.toggleTheme();
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Theme switched to ${appState.themeMode == ThemeMode.light ? "Dark" : "Light"} Mode'),
                      duration: const Duration(seconds: 1),
                    ),
                  );
                },
              ),
              _buildSettingItem(
                icon: Icons.info_outline_rounded,
                title: 'About App',
                value: 'v2.0.0',
                onTap: () => _showAboutDialog(context),
              ),
              _buildSettingItem(
                icon: Icons.help_outline_rounded,
                title: 'Help & Support',
                onTap: () => _showHelpSupportSheet(context),
              ),
              const SizedBox(height: 14),

              // Log Out Button (Matches Mockup Image 10)
              GestureDetector(
                onTap: () => _confirmLogout(context),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.red.shade50,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: Colors.red.shade100),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.logout_rounded, color: AppColors.absentRed, size: 20),
                      SizedBox(width: 12),
                      Text(
                        'Log Out',
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.absentRed),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSettingItem({
    required IconData icon,
    required String title,
    String? value,
    VoidCallback? onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
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
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (value != null) ...[
              Text(
                value,
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textSecondary),
              ),
              const SizedBox(width: 6),
            ],
            const Icon(Icons.chevron_right_rounded, color: AppColors.textMuted, size: 22),
          ],
        ),
        onTap: onTap,
      ),
    );
  }
}
