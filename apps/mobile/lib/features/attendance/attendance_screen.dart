import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/colors.dart';
import '../../core/state/app_state.dart';

class AttendanceScreen extends ConsumerStatefulWidget {
  const AttendanceScreen({super.key});

  @override
  ConsumerState<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends ConsumerState<AttendanceScreen> {
  bool _isProcessing = false;

  void _handleAttendanceToggle() {
    setState(() => _isProcessing = true);
    Future.delayed(const Duration(milliseconds: 500), () {
      if (mounted) {
        final isCheckedIn = ref.read(appStateProvider.notifier).toggleAttendance();
        setState(() => _isProcessing = false);

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              isCheckedIn
                  ? 'Checked In! GPS Geofence verified (Distance: 18m to Gulshan-1 HQ).'
                  : 'Checked Out at 06:00 PM. Have a restful evening!',
            ),
            backgroundColor: isCheckedIn ? AppColors.presentGreen : AppColors.primaryNavy,
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final appState = ref.watch(appStateProvider);
    final isPresent = appState.isPresent;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20, color: AppColors.primaryNavy),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Attendance',
          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17, color: AppColors.primaryNavy),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 10),

              // Hero Circular Presence Gauge with City Skyline Silhouette (Matches Mockup Image 4)
              Center(
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 28),
                  decoration: BoxDecoration(
                    color: AppColors.actionBlueBg,
                    borderRadius: BorderRadius.circular(32),
                    border: Border.all(color: AppColors.borderLight),
                  ),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      // City Skyline Silhouette in background
                      Positioned(
                        bottom: 0,
                        child: Opacity(
                          opacity: 0.15,
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Container(width: 30, height: 70, color: AppColors.primaryBlue),
                              const SizedBox(width: 4),
                              Container(width: 40, height: 110, color: AppColors.primaryBlue),
                              const SizedBox(width: 4),
                              Container(width: 36, height: 140, color: AppColors.primaryBlue),
                              const SizedBox(width: 4),
                              Container(width: 44, height: 95, color: AppColors.primaryBlue),
                              const SizedBox(width: 4),
                              Container(width: 28, height: 60, color: AppColors.primaryBlue),
                            ],
                          ),
                        ),
                      ),

                      // Large Circular Indicator
                      Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 140,
                            height: 140,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: Colors.white,
                              border: Border.all(
                                color: isPresent ? AppColors.presentGreen : AppColors.lateAmber,
                                width: 8,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: (isPresent ? AppColors.presentGreen : AppColors.lateAmber).withOpacity(0.2),
                                  blurRadius: 24,
                                  offset: const Offset(0, 8),
                                ),
                              ],
                            ),
                            child: Center(
                              child: Container(
                                width: 72,
                                height: 72,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: isPresent ? AppColors.presentGreen : AppColors.lateAmber,
                                ),
                                child: Icon(
                                  isPresent ? Icons.check : Icons.access_time_rounded,
                                  color: Colors.white,
                                  size: 42,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 20),

                          // "You are Present" Text
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                isPresent ? 'You are Present' : 'You are Checked Out',
                                style: const TextStyle(
                                  fontSize: 19,
                                  fontWeight: FontWeight.w900,
                                  color: AppColors.primaryNavy,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Icon(
                                isPresent ? Icons.check_circle : Icons.schedule,
                                color: isPresent ? AppColors.presentGreen : AppColors.lateAmber,
                                size: 20,
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),

                          // Check-In Time
                          const Text(
                            'Check-In Time',
                            style: TextStyle(fontSize: 12, color: AppColors.textSecondary, fontWeight: FontWeight.w600),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            isPresent ? appState.checkInTime : (appState.checkOutTime ?? '06:00 PM'),
                            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: AppColors.primaryNavy),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Action Button (Matches Mockup Image 4: "Check Out" / "Check In")
              SizedBox(
                height: 54,
                child: ElevatedButton(
                  onPressed: _isProcessing ? null : _handleAttendanceToggle,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: isPresent ? AppColors.primaryBlue : AppColors.presentGreen,
                    foregroundColor: Colors.white,
                    elevation: 3,
                    shadowColor: (isPresent ? AppColors.primaryBlue : AppColors.presentGreen).withOpacity(0.4),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                  ),
                  child: _isProcessing
                      ? const SizedBox(
                          height: 22,
                          width: 22,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                        )
                      : Text(
                          isPresent ? 'Check Out' : 'Check In',
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, letterSpacing: 0.3),
                        ),
                ),
              ),
              const SizedBox(height: 30),

              // Today's Details Section (Matches Mockup Image 4)
              const Text(
                "Today's Details",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.primaryNavy),
              ),
              const SizedBox(height: 12),

              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppColors.backgroundLight,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.borderLight),
                ),
                child: Column(
                  children: [
                    // Date Row
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.borderLight),
                          ),
                          child: const Icon(Icons.calendar_today_rounded, size: 18, color: AppColors.primaryBlue),
                        ),
                        const SizedBox(width: 14),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Date', style: TextStyle(fontSize: 11, color: AppColors.textSecondary, fontWeight: FontWeight.w600)),
                            const SizedBox(height: 2),
                            Text(
                              appState.attendanceDate,
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.primaryNavy),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const Divider(height: 24, color: AppColors.borderLight),

                    // Location Row with Verified Geofence Badge
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.borderLight),
                          ),
                          child: const Icon(Icons.location_on_rounded, size: 18, color: AppColors.presentGreen),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  const Text('Location', style: TextStyle(fontSize: 11, color: AppColors.textSecondary, fontWeight: FontWeight.w600)),
                                  const SizedBox(width: 6),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                                    decoration: BoxDecoration(
                                      color: Colors.green.shade50,
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: const Text('Geofence Verified', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: AppColors.presentGreen)),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 2),
                              Text(
                                appState.attendanceLocation,
                                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.primaryNavy),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
