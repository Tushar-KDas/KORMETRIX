import 'package:flutter_riverpod/flutter_riverpod.dart';

class MobileRemoteConfig {
  final bool maintenanceMode;
  final String? maintenanceMessage;
  final bool forceUpdate;
  final String latestVersion;
  final bool isGpsAttendanceEnabled;
  final bool isQrAttendanceEnabled;
  final bool isLeaveEnabled;
  final bool isPayrollEnabled;
  final bool isTasksEnabled;
  final bool isAppLockedRemotely;

  const MobileRemoteConfig({
    this.maintenanceMode = false,
    this.maintenanceMessage,
    this.forceUpdate = false,
    this.latestVersion = '2.0.0',
    this.isGpsAttendanceEnabled = true,
    this.isQrAttendanceEnabled = true,
    this.isLeaveEnabled = true,
    this.isPayrollEnabled = true,
    this.isTasksEnabled = true,
    this.isAppLockedRemotely = false,
  });

  factory MobileRemoteConfig.fromJson(Map<String, dynamic> json) {
    return MobileRemoteConfig(
      maintenanceMode: json['maintenance_mode'] ?? false,
      maintenanceMessage: json['maintenance_message'],
      forceUpdate: json['force_update'] ?? false,
      latestVersion: json['latest_version'] ?? '2.0.0',
      isGpsAttendanceEnabled: json['features']?['attendance.gps'] ?? true,
      isQrAttendanceEnabled: json['features']?['attendance.qr'] ?? true,
      isLeaveEnabled: json['features']?['leave'] ?? true,
      isPayrollEnabled: json['features']?['payroll'] ?? true,
      isTasksEnabled: json['features']?['tasks'] ?? true,
      isAppLockedRemotely: json['is_locked'] ?? false,
    );
  }
}

class RemoteConfigNotifier extends StateNotifier<MobileRemoteConfig> {
  RemoteConfigNotifier() : super(const MobileRemoteConfig());

  void updateConfig(Map<String, dynamic> newConfig) {
    state = MobileRemoteConfig.fromJson(newConfig);
  }

  void setRemotelyLocked(bool locked) {
    state = MobileRemoteConfig(
      maintenanceMode: state.maintenanceMode,
      maintenanceMessage: state.maintenanceMessage,
      forceUpdate: state.forceUpdate,
      latestVersion: state.latestVersion,
      isGpsAttendanceEnabled: state.isGpsAttendanceEnabled,
      isQrAttendanceEnabled: state.isQrAttendanceEnabled,
      isLeaveEnabled: state.isLeaveEnabled,
      isPayrollEnabled: state.isPayrollEnabled,
      isTasksEnabled: state.isTasksEnabled,
      isAppLockedRemotely: locked,
    );
  }
}

final remoteConfigProvider =
    StateNotifierProvider<RemoteConfigNotifier, MobileRemoteConfig>((ref) {
  return RemoteConfigNotifier();
});
