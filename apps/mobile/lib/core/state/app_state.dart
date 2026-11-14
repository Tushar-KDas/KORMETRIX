import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../supabase/supabase_config.dart';

// Task Model
class TaskItem {
  final String id;
  final String title;
  final String priority;
  final Color priorityColor;
  final String deadline;
  final bool isCompleted;

  const TaskItem({
    required this.id,
    required this.title,
    required this.priority,
    required this.priorityColor,
    required this.deadline,
    required this.isCompleted,
  });

  TaskItem copyWith({
    String? title,
    String? priority,
    Color? priorityColor,
    String? deadline,
    bool? isCompleted,
  }) {
    return TaskItem(
      id: id,
      title: title ?? this.title,
      priority: priority ?? this.priority,
      priorityColor: priorityColor ?? this.priorityColor,
      deadline: deadline ?? this.deadline,
      isCompleted: isCompleted ?? this.isCompleted,
    );
  }
}

// Notification Model
class NotificationItem {
  final String id;
  final String title;
  final String subtitle;
  final String timeAgo;
  final IconData icon;
  final Color iconColor;
  final bool isUnread;

  const NotificationItem({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.timeAgo,
    required this.icon,
    required this.iconColor,
    required this.isUnread,
  });

  NotificationItem copyWith({bool? isUnread}) {
    return NotificationItem(
      id: id,
      title: title,
      subtitle: subtitle,
      timeAgo: timeAgo,
      icon: icon,
      iconColor: iconColor,
      isUnread: isUnread ?? this.isUnread,
    );
  }
}

// Leave Application Model
class LeaveRecord {
  final String type;
  final String startDate;
  final String endDate;
  final int days;
  final String reason;
  final String status;

  const LeaveRecord({
    required this.type,
    required this.startDate,
    required this.endDate,
    required this.days,
    required this.reason,
    required this.status,
  });
}

// Access Request Model for HR Approvals
class AccessRequestItem {
  final String id;
  final String fullName;
  final String email;
  final String phone;
  final String department;
  final String designation;
  final String requestedRole;
  final String status; // 'PENDING', 'APPROVED', 'REJECTED'
  final String requestedAt;

  const AccessRequestItem({
    required this.id,
    required this.fullName,
    required this.email,
    required this.phone,
    required this.department,
    required this.designation,
    required this.requestedRole,
    required this.status,
    required this.requestedAt,
  });

  AccessRequestItem copyWith({String? status}) {
    return AccessRequestItem(
      id: id,
      fullName: fullName,
      email: email,
      phone: phone,
      department: department,
      designation: designation,
      requestedRole: requestedRole,
      status: status ?? this.status,
      requestedAt: requestedAt,
    );
  }
}

// App State
class AppState {
  final ThemeMode themeMode;
  final String language;
  
  // User Profile
  final String userRole; // 'super_admin' | 'company_admin' | 'hr_admin' | 'manager' | 'employee'
  final String organizationName;
  final String branchName;
  final String userName;
  final String userDesignation;
  final String userEmail;
  final String userPhone;
  final String userLocation;
  final String userDepartment;
  final String userAvatarUrl;

  // Attendance
  final bool isPresent;
  final String checkInTime;
  final String? checkOutTime;
  final String attendanceDate;
  final String attendanceLocation;

  // Overview Filter
  final String overviewFilter;
  final int workingDays;
  final int leavesUsed;
  final int tasksDone;
  final int performancePercent;

  // Tasks
  final List<TaskItem> tasks;

  // Leaves
  final Map<String, int> leaveBalances;
  final List<LeaveRecord> leaveHistory;

  // Notifications
  final List<NotificationItem> notifications;

  // Settings / Preferences
  final bool biometricEnabled;
  final bool pushNotificationsEnabled;
  final bool autoSyncEnabled;

  // Access Requests for HR Approval
  final List<AccessRequestItem> pendingAccessRequests;

  const AppState({
    required this.themeMode,
    required this.language,
    this.userRole = 'employee',
    this.organizationName = 'WorkForce 360 Ltd',
    this.branchName = 'Banani HQ, Dhaka',
    required this.userName,
    required this.userDesignation,
    required this.userEmail,
    required this.userPhone,
    required this.userLocation,
    required this.userDepartment,
    required this.userAvatarUrl,
    required this.isPresent,
    required this.checkInTime,
    this.checkOutTime,
    required this.attendanceDate,
    required this.attendanceLocation,
    required this.overviewFilter,
    required this.workingDays,
    required this.leavesUsed,
    required this.tasksDone,
    required this.performancePercent,
    required this.tasks,
    required this.leaveBalances,
    required this.leaveHistory,
    required this.notifications,
    required this.biometricEnabled,
    required this.pushNotificationsEnabled,
    required this.autoSyncEnabled,
    this.pendingAccessRequests = const [
      AccessRequestItem(
        id: 'req-001',
        fullName: 'Mahmudul Hasan',
        email: 'mahmudul@workforce360.com',
        phone: '+880 1819-445566',
        department: 'Engineering & Technology',
        designation: 'React Native Developer',
        requestedRole: 'employee',
        status: 'PENDING',
        requestedAt: '10:15 AM Today',
      ),
      AccessRequestItem(
        id: 'req-002',
        fullName: 'Farhana Akter',
        email: 'farhana@workforce360.com',
        phone: '+880 1712-334455',
        department: 'Product & Design',
        designation: 'UI/UX Visual Designer',
        requestedRole: 'employee',
        status: 'PENDING',
        requestedAt: '11:30 AM Today',
      ),
    ],
  });

  AppState copyWith({
    ThemeMode? themeMode,
    String? language,
    String? userRole,
    String? organizationName,
    String? branchName,
    String? userName,
    String? userDesignation,
    String? userEmail,
    String? userPhone,
    String? userLocation,
    String? userDepartment,
    String? userAvatarUrl,
    bool? isPresent,
    String? checkInTime,
    String? checkOutTime,
    String? attendanceDate,
    String? attendanceLocation,
    String? overviewFilter,
    int? workingDays,
    int? leavesUsed,
    int? tasksDone,
    int? performancePercent,
    List<TaskItem>? tasks,
    Map<String, int>? leaveBalances,
    List<LeaveRecord>? leaveHistory,
    List<NotificationItem>? notifications,
    bool? biometricEnabled,
    bool? pushNotificationsEnabled,
    bool? autoSyncEnabled,
    List<AccessRequestItem>? pendingAccessRequests,
  }) {
    return AppState(
      themeMode: themeMode ?? this.themeMode,
      language: language ?? this.language,
      userRole: userRole ?? this.userRole,
      organizationName: organizationName ?? this.organizationName,
      branchName: branchName ?? this.branchName,
      userName: userName ?? this.userName,
      userDesignation: userDesignation ?? this.userDesignation,
      userEmail: userEmail ?? this.userEmail,
      userPhone: userPhone ?? this.userPhone,
      userLocation: userLocation ?? this.userLocation,
      userDepartment: userDepartment ?? this.userDepartment,
      userAvatarUrl: userAvatarUrl ?? this.userAvatarUrl,
      isPresent: isPresent ?? this.isPresent,
      checkInTime: checkInTime ?? this.checkInTime,
      checkOutTime: checkOutTime ?? this.checkOutTime,
      attendanceDate: attendanceDate ?? this.attendanceDate,
      attendanceLocation: attendanceLocation ?? this.attendanceLocation,
      overviewFilter: overviewFilter ?? this.overviewFilter,
      workingDays: workingDays ?? this.workingDays,
      leavesUsed: leavesUsed ?? this.leavesUsed,
      tasksDone: tasksDone ?? this.tasksDone,
      performancePercent: performancePercent ?? this.performancePercent,
      tasks: tasks ?? this.tasks,
      leaveBalances: leaveBalances ?? this.leaveBalances,
      leaveHistory: leaveHistory ?? this.leaveHistory,
      notifications: notifications ?? this.notifications,
      biometricEnabled: biometricEnabled ?? this.biometricEnabled,
      pushNotificationsEnabled: pushNotificationsEnabled ?? this.pushNotificationsEnabled,
      autoSyncEnabled: autoSyncEnabled ?? this.autoSyncEnabled,
      pendingAccessRequests: pendingAccessRequests ?? this.pendingAccessRequests,
    );
  }
}

// Initial Mock Data matching the user's uploaded mockup images
final initialTasks = [
  const TaskItem(
    id: '1',
    title: 'Complete UI Design',
    priority: 'High Priority',
    priorityColor: Color(0xFFEF4444),
    deadline: 'Today, 5:00 PM',
    isCompleted: false,
  ),
  const TaskItem(
    id: '2',
    title: 'Fix Login Bug',
    priority: 'Medium',
    priorityColor: Color(0xFFF59E0B),
    deadline: 'Today, 3:00 PM',
    isCompleted: false,
  ),
  const TaskItem(
    id: '3',
    title: 'Prepare Report',
    priority: 'Low',
    priorityColor: Color(0xFF10B981),
    deadline: 'Tomorrow, 10:00 AM',
    isCompleted: false,
  ),
  const TaskItem(
    id: '4',
    title: 'Update Documentation',
    priority: 'Medium',
    priorityColor: Color(0xFFF59E0B),
    deadline: 'May 1, 2025',
    isCompleted: false,
  ),
  const TaskItem(
    id: '5',
    title: 'API Integration Testing',
    priority: 'High Priority',
    priorityColor: Color(0xFFEF4444),
    deadline: 'May 3, 2025',
    isCompleted: true,
  ),
  const TaskItem(
    id: '6',
    title: 'Sprint Retrospective',
    priority: 'Low',
    priorityColor: Color(0xFF10B981),
    deadline: 'May 4, 2025',
    isCompleted: true,
  ),
];

final initialNotifications = [
  const NotificationItem(
    id: '1',
    title: 'New Task Assigned',
    subtitle: 'Complete the UI design',
    timeAgo: '2m ago',
    icon: Icons.assignment_outlined,
    iconColor: Color(0xFF10B981),
    isUnread: true,
  ),
  const NotificationItem(
    id: '2',
    title: 'Leave Approved',
    subtitle: 'Your leave request is approved',
    timeAgo: '5m ago',
    icon: Icons.check_circle_outline,
    iconColor: Color(0xFF06B6D4),
    isUnread: true,
  ),
  const NotificationItem(
    id: '3',
    title: 'System Update',
    subtitle: 'New features are available',
    timeAgo: '1h ago',
    icon: Icons.system_update_alt,
    iconColor: Color(0xFF3758D8),
    isUnread: true,
  ),
  const NotificationItem(
    id: '4',
    title: 'Alert',
    subtitle: 'Attendance marked late',
    timeAgo: 'Yesterday',
    icon: Icons.warning_amber_outlined,
    iconColor: Color(0xFFEF4444),
    isUnread: false,
  ),
  const NotificationItem(
    id: '5',
    title: 'Project Update',
    subtitle: 'Project deadline extended',
    timeAgo: '2d ago',
    icon: Icons.folder_outlined,
    iconColor: Color(0xFF06B6D4),
    isUnread: false,
  ),
];

// App State Notifier
class AppStateNotifier extends StateNotifier<AppState> {
  AppStateNotifier()
      : super(
          AppState(
            themeMode: ThemeMode.light,
            language: 'English',
            userName: 'Ahmed Rahman',
            userDesignation: 'Software Engineer',
            userEmail: 'ahmed@workforce360.com',
            userPhone: '+880 1712 345678',
            userLocation: 'Dhaka, Bangladesh',
            userDepartment: 'Engineering',
            userAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
            isPresent: true,
            checkInTime: '09:15 AM',
            checkOutTime: null,
            attendanceDate: 'Mon, Apr 28, 2025',
            attendanceLocation: 'Head Office, Dhaka',
            overviewFilter: 'This Month',
            workingDays: 22,
            leavesUsed: 2,
            tasksDone: 18,
            performancePercent: 92,
            tasks: initialTasks,
            leaveBalances: {
              'Annual Leave': 18,
              'Sick Leave': 12,
              'Casual Leave': 8,
              'Emergency Leave': 5,
            },
            leaveHistory: [
              const LeaveRecord(
                type: 'Casual Leave',
                startDate: 'Apr 10, 2025',
                endDate: 'Apr 11, 2025',
                days: 2,
                reason: 'Family event',
                status: 'Approved',
              ),
            ],
            notifications: initialNotifications,
            biometricEnabled: true,
            pushNotificationsEnabled: true,
            autoSyncEnabled: true,
          ),
        );

  // Role Switcher
  void switchRole(String role) {
    switch (role) {
      case 'super_admin':
        state = state.copyWith(
          userRole: 'super_admin',
          userName: 'Rahman Chowdhury',
          userDesignation: 'Platform Chief Architect & Super Admin',
          userEmail: 'superadmin@workforce360.com',
          userDepartment: 'Platform Operations & Root SaaS Hub',
          organizationName: 'WorkForce 360 Global Cloud',
          branchName: 'Global Cloud Infrastructure',
          userAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        );
        break;
      case 'company_admin':
        state = state.copyWith(
          userRole: 'company_admin',
          userName: 'Tanvir Hasan',
          userDesignation: 'Managing Director & Company Admin',
          userEmail: 'admin@workforce360.com',
          userDepartment: 'Executive Leadership',
          organizationName: 'WorkForce 360 Ltd',
          branchName: 'Banani HQ, Dhaka',
          userAvatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        );
        break;
      case 'hr_admin':
        state = state.copyWith(
          userRole: 'hr_admin',
          userName: 'Nusrat Jahan',
          userDesignation: 'Chief People Officer & HR Director',
          userEmail: 'hr@workforce360.com',
          userDepartment: 'Human Resources & Talent',
          organizationName: 'WorkForce 360 Ltd',
          branchName: 'Banani HQ, Dhaka',
          userAvatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
        );
        break;
      case 'manager':
        state = state.copyWith(
          userRole: 'manager',
          userName: 'Sadia Islam',
          userDesignation: 'Engineering Lead & Team Manager',
          userEmail: 'manager@workforce360.com',
          userDepartment: 'Engineering & Technology',
          organizationName: 'WorkForce 360 Ltd',
          branchName: 'Banani HQ, Dhaka',
          userAvatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
        );
        break;
      case 'employee':
      default:
        state = state.copyWith(
          userRole: 'employee',
          userName: 'Ahmed Rahman',
          userDesignation: 'Senior Software Engineer',
          userEmail: 'ahmed@workforce360.com',
          userDepartment: 'Engineering',
          organizationName: 'WorkForce 360 Ltd',
          branchName: 'Banani HQ, Dhaka',
          userAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        );
        break;
    }
  }

  // Set Custom User Profile for Dynamic Login
  void setUserProfile({
    required String role,
    required String name,
    required String designation,
    required String email,
    required String department,
    String? avatarUrl,
    String? phone,
  }) {
    state = state.copyWith(
      userRole: role,
      userName: name,
      userDesignation: designation,
      userEmail: email,
      userDepartment: department,
      userPhone: phone ?? state.userPhone,
      userAvatarUrl: avatarUrl ?? state.userAvatarUrl,
      organizationName: 'WorkForce 360 Ltd',
      branchName: 'Banani HQ, Dhaka',
    );
  }

  // Theme Toggle
  void toggleTheme() {
    state = state.copyWith(
      themeMode: state.themeMode == ThemeMode.light ? ThemeMode.dark : ThemeMode.light,
    );
  }

  // Language Toggle
  void toggleLanguage() {
    state = state.copyWith(
      language: state.language == 'English' ? 'বাংলা' : 'English',
    );
  }

  // Attendance Toggle (Check-In / Check-Out)
  bool toggleAttendance() {
    if (state.isPresent) {
      state = state.copyWith(
        isPresent: false,
        checkOutTime: '06:00 PM',
      );
      return false; // Checked out
    } else {
      state = state.copyWith(
        isPresent: true,
        checkInTime: '09:15 AM',
        checkOutTime: null,
      );
      return true; // Checked in
    }
  }

  // Overview Filter Change
  void setOverviewFilter(String filter) {
    int days = 22;
    int leaves = 2;
    int tasks = 18;
    int perf = 92;

    switch (filter) {
      case 'Today':
        days = 1;
        leaves = 0;
        tasks = 2;
        perf = 95;
        break;
      case 'This Week':
        days = 5;
        leaves = 0;
        tasks = 4;
        perf = 90;
        break;
      case 'This Month':
        days = 22;
        leaves = 2;
        tasks = 18;
        perf = 92;
        break;
      case 'This Year':
        days = 248;
        leaves = 12;
        tasks = 142;
        perf = 94;
        break;
    }

    state = state.copyWith(
      overviewFilter: filter,
      workingDays: days,
      leavesUsed: leaves,
      tasksDone: tasks,
      performancePercent: perf,
    );
  }

  // Task Toggle
  void toggleTask(String id) {
    state = state.copyWith(
      tasks: state.tasks.map((task) {
        if (task.id == id) {
          return task.copyWith(isCompleted: !task.isCompleted);
        }
        return task;
      }).toList(),
    );
  }

  // Add Task
  void addTask({
    required String title,
    required String priority,
    required String deadline,
  }) {
    Color color;
    switch (priority) {
      case 'High Priority':
        color = const Color(0xFFEF4444);
        break;
      case 'Medium':
        color = const Color(0xFFF59E0B);
        break;
      case 'Low':
      default:
        color = const Color(0xFF10B981);
        break;
    }

    final newTask = TaskItem(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: title,
      priority: priority,
      priorityColor: color,
      deadline: deadline,
      isCompleted: false,
    );

    state = state.copyWith(tasks: [newTask, ...state.tasks]);
  }

  // Apply Leave
  bool applyLeave({
    required String type,
    required String startDate,
    required String endDate,
    required int days,
    required String reason,
  }) {
    final currentBal = state.leaveBalances[type] ?? 0;
    if (currentBal < days) return false;

    final updatedBalances = Map<String, int>.from(state.leaveBalances);
    updatedBalances[type] = currentBal - days;

    final record = LeaveRecord(
      type: type,
      startDate: startDate,
      endDate: endDate,
      days: days,
      reason: reason,
      status: 'Approved',
    );

    state = state.copyWith(
      leaveBalances: updatedBalances,
      leavesUsed: state.leavesUsed + days,
      leaveHistory: [record, ...state.leaveHistory],
    );
    return true;
  }

  // Notifications
  void markNotificationAsRead(String id) {
    state = state.copyWith(
      notifications: state.notifications.map((n) {
        if (n.id == id) return n.copyWith(isUnread: false);
        return n;
      }).toList(),
    );
  }

  void markAllNotificationsAsRead() {
    state = state.copyWith(
      notifications: state.notifications.map((n) => n.copyWith(isUnread: false)).toList(),
    );
  }

  void clearAllNotifications() {
    state = state.copyWith(notifications: []);
  }

  // Update Profile
  void updateProfile({
    required String name,
    required String phone,
    required String location,
  }) {
    state = state.copyWith(
      userName: name,
      userPhone: phone,
      userLocation: location,
    );
  }

  // Toggle Preferences
  void toggleBiometric(bool val) => state = state.copyWith(biometricEnabled: val);
  void togglePushNotifications(bool val) => state = state.copyWith(pushNotificationsEnabled: val);
  void toggleAutoSync(bool val) => state = state.copyWith(autoSyncEnabled: val);

  // Access Requests for HR Approval
  void addAccessRequest(AccessRequestItem item) {
    state = state.copyWith(
      pendingAccessRequests: [item, ...state.pendingAccessRequests],
    );
  }

  Future<void> fetchPendingRequestsFromSupabase() async {
    try {
      final client = SupabaseConfig.client;
      if (client == null) return;
      final res = await client
          .from('employees')
          .select('id, employee_code, first_name, last_name, email, phone, status, created_at')
          .eq('status', 'PENDING');

      if (res.isNotEmpty) {
        final List<AccessRequestItem> fetched = [];
        for (final item in res) {
          final fName = item['first_name'] ?? '';
          final lName = item['last_name'] ?? '';
          final fullName = '$fName $lName'.trim();
          fetched.add(
            AccessRequestItem(
              id: item['id']?.toString() ?? item['employee_code']?.toString() ?? 'req-sb',
              fullName: fullName.isEmpty ? 'New Applicant' : fullName,
              email: item['email']?.toString() ?? '',
              phone: item['phone']?.toString() ?? '+880 1711-000000',
              department: 'Engineering & Technology',
              designation: 'Staff Associate',
              requestedRole: 'employee',
              status: 'PENDING',
              requestedAt: 'Live via Supabase Cloud',
            ),
          );
        }

        final existing = List<AccessRequestItem>.from(state.pendingAccessRequests);
        for (final req in fetched) {
          final idx = existing.indexWhere((r) => r.email.toLowerCase() == req.email.toLowerCase());
          if (idx >= 0) {
            existing[idx] = req;
          } else {
            existing.insert(0, req);
          }
        }
        state = state.copyWith(pendingAccessRequests: existing);
      }
    } catch (e) {
      debugPrint('Error fetching pending requests from Supabase: $e');
    }
  }

  Future<void> approveAccessRequest(String id) async {
    final target = state.pendingAccessRequests.where((r) => r.id == id).firstOrNull;
    state = state.copyWith(
      pendingAccessRequests: state.pendingAccessRequests.map((req) {
        if (req.id == id) return req.copyWith(status: 'APPROVED');
        return req;
      }).toList(),
    );
    if (target != null) {
      try {
        final client = SupabaseConfig.client;
        if (client != null) {
          await client.from('employees').update({'status': 'ACTIVE'}).eq('email', target.email);
        }
      } catch (e) {
        debugPrint('Supabase approve error: $e');
      }
    }
  }

  Future<void> rejectAccessRequest(String id) async {
    final target = state.pendingAccessRequests.where((r) => r.id == id).firstOrNull;
    state = state.copyWith(
      pendingAccessRequests: state.pendingAccessRequests.map((req) {
        if (req.id == id) return req.copyWith(status: 'REJECTED');
        return req;
      }).toList(),
    );
    if (target != null) {
      try {
        final client = SupabaseConfig.client;
        if (client != null) {
          await client.from('employees').update({'status': 'REJECTED'}).eq('email', target.email);
        }
      } catch (e) {
        debugPrint('Supabase reject error: $e');
      }
    }
  }
}

final appStateProvider = StateNotifierProvider<AppStateNotifier, AppState>((ref) {
  return AppStateNotifier();
});
