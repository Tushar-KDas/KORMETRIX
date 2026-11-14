import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../core/constants/colors.dart';
import '../../core/state/app_state.dart';

class LeaveScreen extends ConsumerStatefulWidget {
  const LeaveScreen({super.key});

  @override
  ConsumerState<LeaveScreen> createState() => _LeaveScreenState();
}

class _LeaveScreenState extends ConsumerState<LeaveScreen> {
  String _selectedLeaveType = 'Annual Leave';
  DateTime _startDate = DateTime(2025, 4, 30);
  DateTime _endDate = DateTime(2025, 5, 2);
  final _reasonController = TextEditingController();
  bool _isSubmitting = false;

  @override
  void dispose() {
    _reasonController.dispose();
    super.dispose();
  }

  int get _requestedDays {
    final diff = _endDate.difference(_startDate).inDays;
    return diff >= 0 ? diff + 1 : 1;
  }

  Future<void> _pickStartDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _startDate,
      firstDate: DateTime(2025, 1, 1),
      lastDate: DateTime(2026, 12, 31),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: AppColors.primaryBlue,
              onPrimary: Colors.white,
              onSurface: AppColors.primaryNavy,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() {
        _startDate = picked;
        if (_endDate.isBefore(_startDate)) {
          _endDate = _startDate;
        }
      });
    }
  }

  Future<void> _pickEndDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _endDate.isBefore(_startDate) ? _startDate : _endDate,
      firstDate: _startDate,
      lastDate: DateTime(2026, 12, 31),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: AppColors.primaryBlue,
              onPrimary: Colors.white,
              onSurface: AppColors.primaryNavy,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() {
        _endDate = picked;
      });
    }
  }

  void _handleSubmit() {
    final reason = _reasonController.text.trim();
    if (reason.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please write a reason for your leave request.'),
          backgroundColor: AppColors.absentRed,
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);
    Future.delayed(const Duration(milliseconds: 600), () {
      if (mounted) {
        setState(() => _isSubmitting = false);
        final startStr = DateFormat('MMM dd, yyyy').format(_startDate);
        final endStr = DateFormat('MMM dd, yyyy').format(_endDate);

        final success = ref.read(appStateProvider.notifier).applyLeave(
              type: _selectedLeaveType,
              startDate: startStr,
              endDate: endStr,
              days: _requestedDays,
              reason: reason,
            );

        if (success) {
          _reasonController.clear();
          showDialog(
            context: context,
            builder: (ctx) => AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
              icon: Container(
                padding: const EdgeInsets.all(12),
                decoration: const BoxDecoration(
                  color: AppColors.actionGreenBg,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check_circle_rounded, color: AppColors.presentGreen, size: 36),
              ),
              title: const Text('Leave Request Submitted', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18)),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text('Your request for $_requestedDays day(s) of $_selectedLeaveType ($startStr to $endStr) has been submitted to your Manager and HR.'),
                  const SizedBox(height: 12),
                  const Text('Approval notifications will be sent to your device.', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                ],
              ),
              actions: [
                ElevatedButton(
                  onPressed: () {
                    Navigator.pop(ctx);
                    context.pop();
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryBlue,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Done'),
                ),
              ],
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Insufficient balance for $_selectedLeaveType!'),
              backgroundColor: AppColors.absentRed,
            ),
          );
        }
      }
    });
  }

  void _showLeavePolicySheet() {
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
              const Text('Company Leave Policy (Bangladesh)', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.primaryNavy)),
              const SizedBox(height: 12),
              const Text('• Annual Leave: 18 days per calendar year (encashable).'),
              const SizedBox(height: 6),
              const Text('• Sick Leave: 14 days with medical prescription.'),
              const SizedBox(height: 6),
              const Text('• Casual Leave: 10 days for personal or urgent affairs.'),
              const SizedBox(height: 6),
              const Text('• Emergency Leave: Up to 5 days on special approval.'),
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
                  child: const Text('Understood'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final appState = ref.watch(appStateProvider);
    final balances = appState.leaveBalances;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20, color: AppColors.primaryNavy),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Apply Leave',
          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17, color: AppColors.primaryNavy),
        ),
        actions: [
          PopupMenuButton<String>(
            icon: const Icon(Icons.more_vert, color: AppColors.primaryNavy),
            onSelected: (val) {
              if (val == 'policy') _showLeavePolicySheet();
            },
            itemBuilder: (context) => [
              const PopupMenuItem(value: 'policy', child: Text('Leave Policy')),
            ],
          ),
        ],
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Hero Info Card with Vector Illustration (Matches Mockup Image 5)
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.actionBlueBg,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppColors.borderLight),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: AppColors.primaryBlue.withOpacity(0.2)),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primaryBlue.withOpacity(0.08),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: const Stack(
                        alignment: Alignment.bottomRight,
                        children: [
                          Icon(Icons.calendar_month_rounded, color: AppColors.primaryBlue, size: 36),
                          Positioned(
                            right: 0,
                            bottom: 0,
                            child: CircleAvatar(
                              radius: 8,
                              backgroundColor: AppColors.primaryBlue,
                              child: Icon(Icons.access_time_rounded, color: Colors.white, size: 10),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Request Your Leave',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.primaryNavy),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Plan your leave easily with just a few taps.',
                            style: TextStyle(fontSize: 12, color: AppColors.textSecondary, fontWeight: FontWeight.w500),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Leave Type Selector
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Leave Type', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.primaryNavy)),
                  Text(
                    'Balance: ${balances[_selectedLeaveType] ?? 0} days',
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.primaryBlue),
                  ),
                ],
              ),
              const SizedBox(height: 8),

              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.backgroundLight,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.borderLight),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _selectedLeaveType,
                    isExpanded: true,
                    icon: const Icon(Icons.keyboard_arrow_down_rounded, color: AppColors.textSecondary),
                    items: balances.keys.map((type) {
                      final bal = balances[type] ?? 0;
                      return DropdownMenuItem(
                        value: type,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(type, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.primaryNavy)),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppColors.actionBlueBg,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text('$bal left', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) setState(() => _selectedLeaveType = val);
                    },
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Start Date Picker Field
              const Text('Start Date', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.primaryNavy)),
              const SizedBox(height: 8),
              GestureDetector(
                onTap: _pickStartDate,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: AppColors.backgroundLight,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.borderLight),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        DateFormat('MMM dd, yyyy').format(_startDate),
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.primaryNavy),
                      ),
                      const Icon(Icons.calendar_today_rounded, size: 18, color: AppColors.primaryBlue),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // End Date Picker Field
              const Text('End Date', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.primaryNavy)),
              const SizedBox(height: 8),
              GestureDetector(
                onTap: _pickEndDate,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: AppColors.backgroundLight,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.borderLight),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        DateFormat('MMM dd, yyyy').format(_endDate),
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.primaryNavy),
                      ),
                      const Icon(Icons.calendar_today_rounded, size: 18, color: AppColors.primaryBlue),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Reason
              const Text('Reason', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.primaryNavy)),
              const SizedBox(height: 8),
              TextField(
                controller: _reasonController,
                maxLines: 4,
                decoration: InputDecoration(
                  hintText: 'Write reason here...',
                  hintStyle: const TextStyle(fontSize: 13, color: AppColors.textMuted),
                  filled: true,
                  fillColor: AppColors.backgroundLight,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: AppColors.borderLight),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: AppColors.borderLight),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: AppColors.primaryBlue, width: 2),
                  ),
                ),
              ),
              const SizedBox(height: 28),

              // Submit Button (Matches Mockup Image 5: "Submit Request")
              SizedBox(
                height: 54,
                child: ElevatedButton(
                  onPressed: _isSubmitting ? null : _handleSubmit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryBlue,
                    foregroundColor: Colors.white,
                    elevation: 3,
                    shadowColor: AppColors.primaryBlue.withOpacity(0.4),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                  ),
                  child: _isSubmitting
                      ? const SizedBox(height: 22, width: 22, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
                      : Text(
                          'Submit Request ($_requestedDays Days)',
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, letterSpacing: 0.3),
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
}
