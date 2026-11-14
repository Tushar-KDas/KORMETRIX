import 'package:go_router/go_router.dart';
import '../features/intro/intro_screen.dart';
import '../features/authentication/login_screen.dart';
import '../features/attendance/attendance_screen.dart';
import '../features/leave/leave_screen.dart';
import '../features/notifications/notifications_screen.dart';
import '../features/settings/settings_screen.dart';
import '../features/idcard/id_card_screen.dart';
import '../features/teams/teams_directory_screen.dart';
import 'main_shell.dart';

final appRouter = GoRouter(
  initialLocation: '/intro',
  routes: [
    GoRoute(
      path: '/intro',
      builder: (context, state) => const IntroScreen(),
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/home',
      builder: (context, state) => const MainNavigationShell(initialIndex: 0),
    ),
    GoRoute(
      path: '/tasks',
      builder: (context, state) => const MainNavigationShell(initialIndex: 1),
    ),
    GoRoute(
      path: '/analytics',
      builder: (context, state) => const MainNavigationShell(initialIndex: 2),
    ),
    GoRoute(
      path: '/profile',
      builder: (context, state) => const MainNavigationShell(initialIndex: 3),
    ),
    GoRoute(
      path: '/attendance',
      builder: (context, state) => const AttendanceScreen(),
    ),
    GoRoute(
      path: '/leave',
      builder: (context, state) => const LeaveScreen(),
    ),
    GoRoute(
      path: '/notifications',
      builder: (context, state) => const NotificationsScreen(),
    ),
    GoRoute(
      path: '/settings',
      builder: (context, state) => const SettingsScreen(),
    ),
    GoRoute(
      path: '/idcard',
      builder: (context, state) => const IdCardScreen(),
    ),
    GoRoute(
      path: '/teams',
      builder: (context, state) => const TeamsDirectoryScreen(),
    ),
  ],
);
