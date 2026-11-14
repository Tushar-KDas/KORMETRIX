import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/colors.dart';
import '../../core/state/app_state.dart';

class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  int _selectedTabIndex = 0; // 0: All, 1: Unread

  @override
  Widget build(BuildContext context) {
    final appState = ref.watch(appStateProvider);
    final allNotifications = appState.notifications;
    final unreadNotifications = allNotifications.where((n) => n.isUnread).toList();

    final displayedNotifications = _selectedTabIndex == 1 ? unreadNotifications : allNotifications;
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
          'Notifications',
          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17, color: AppColors.primaryNavy),
        ),
        centerTitle: true,
        actions: [
          PopupMenuButton<String>(
            icon: const Icon(Icons.more_vert, color: AppColors.primaryNavy),
            onSelected: (val) {
              if (val == 'read_all') {
                ref.read(appStateProvider.notifier).markAllNotificationsAsRead();
              } else if (val == 'clear_all') {
                ref.read(appStateProvider.notifier).clearAllNotifications();
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(value: 'read_all', child: Text('Mark all as read')),
              const PopupMenuItem(value: 'clear_all', child: Text('Clear all')),
            ],
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
          child: Column(
            children: [
              // Filter Tabs (Matches Mockup Image 9: All (8), Unread (3))
              Row(
                children: [
                  _buildTab('All (${allNotifications.length})', 0),
                  const SizedBox(width: 8),
                  _buildTab('Unread (${unreadNotifications.length})', 1),
                ],
              ),
              const SizedBox(height: 18),

              // Notification List
              Expanded(
                child: displayedNotifications.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.notifications_off_outlined, size: 48, color: Colors.grey.shade300),
                            const SizedBox(height: 12),
                            const Text('No notifications found', style: TextStyle(color: AppColors.textMuted, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      )
                    : ListView.separated(
                        itemCount: displayedNotifications.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 10),
                        itemBuilder: (context, index) {
                          final item = displayedNotifications[index];
                          return GestureDetector(
                            onTap: () {
                              ref.read(appStateProvider.notifier).markNotificationAsRead(item.id);
                            },
                            child: Container(
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: item.isUnread ? AppColors.actionBlueBg.withOpacity(0.5) : AppColors.backgroundLight,
                                borderRadius: BorderRadius.circular(18),
                                border: Border.all(
                                  color: item.isUnread ? AppColors.primaryBlue.withOpacity(0.3) : AppColors.borderLight,
                                ),
                              ),
                              child: Row(
                                children: [
                                  // Icon Badge
                                  Container(
                                    padding: const EdgeInsets.all(10),
                                    decoration: BoxDecoration(
                                      color: item.iconColor.withOpacity(0.12),
                                      borderRadius: BorderRadius.circular(14),
                                    ),
                                    child: Icon(item.icon, color: item.iconColor, size: 20),
                                  ),
                                  const SizedBox(width: 14),

                                  // Title & Subtitle
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          item.title,
                                          style: const TextStyle(
                                            fontSize: 13,
                                            fontWeight: FontWeight.w800,
                                            color: AppColors.primaryNavy,
                                          ),
                                        ),
                                        const SizedBox(height: 3),
                                        Text(
                                          item.subtitle,
                                          style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                                        ),
                                      ],
                                    ),
                                  ),

                                  // Timestamp & Unread Purple Dot
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: [
                                      Text(
                                        item.timeAgo,
                                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.textMuted),
                                      ),
                                      if (item.isUnread) ...[
                                        const SizedBox(height: 6),
                                        Container(
                                          width: 8,
                                          height: 8,
                                          decoration: const BoxDecoration(
                                            color: Color(0xFF7C3AED), // Purple dot matching mockup
                                            shape: BoxShape.circle,
                                          ),
                                        ),
                                      ],
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTab(String title, int index) {
    final isSelected = _selectedTabIndex == index;
    return GestureDetector(
      onTap: () => setState(() => _selectedTabIndex = index),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primaryBlue : AppColors.backgroundLight,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isSelected ? AppColors.primaryBlue : AppColors.borderLight),
        ),
        child: Text(
          title,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w800,
            color: isSelected ? Colors.white : AppColors.textSecondary,
          ),
        ),
      ),
    );
  }
}
