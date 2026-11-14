import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/colors.dart';
import '../../core/state/app_state.dart';

class AnalyticsScreen extends ConsumerStatefulWidget {
  const AnalyticsScreen({super.key});

  @override
  ConsumerState<AnalyticsScreen> createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends ConsumerState<AnalyticsScreen> {
  int _selectedTabIndex = 0; // 0: Overview, 1: Attendance, 2: Performance

  @override
  Widget build(BuildContext context) {
    final appState = ref.watch(appStateProvider);
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
          'Analytics',
          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17, color: AppColors.primaryNavy),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Segment Filter Tabs (Matches Mockup Image 7: Overview, Attendance, Performance)
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: AppColors.backgroundLight,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.borderLight),
                ),
                child: Row(
                  children: [
                    _buildSegmentTab('Overview', 0),
                    _buildSegmentTab('Attendance', 1),
                    _buildSegmentTab('Performance', 2),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Smooth Trend Line Chart Card (Matches Exact Mockup Image 7)
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.backgroundLight,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppColors.borderLight),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          _selectedTabIndex == 1
                              ? 'Monthly Attendance Curve'
                              : (_selectedTabIndex == 2 ? 'Sprint Efficiency' : 'Productivity Trend'),
                          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.primaryNavy),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.primaryBlue,
                            borderRadius: BorderRadius.circular(10),
                            boxShadow: [
                              BoxShadow(color: AppColors.primaryBlue.withOpacity(0.3), blurRadius: 8, offset: const Offset(0, 3)),
                            ],
                          ),
                          child: const Text(
                            '92%',
                            style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w900),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),

                    // Custom Painted Smooth Curved Line Graph with Area Fill & Tooltip
                    SizedBox(
                      width: double.infinity,
                      height: 160,
                      child: CustomPaint(
                        painter: _TrendChartPainter(
                          dataset: _selectedTabIndex == 1
                              ? [0.6, 0.75, 0.82, 0.95, 0.88, 0.96]
                              : (_selectedTabIndex == 2
                                  ? [0.55, 0.68, 0.78, 0.92, 0.85, 0.91]
                                  : [0.5, 0.65, 0.72, 0.92, 0.86, 0.90]),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Month Labels
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Jan', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
                        Text('Feb', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
                        Text('Mar', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
                        Text('Apr', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                        Text('May', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
                        Text('Jun', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              // Key Metrics Section (Matches Mockup Image 7)
              const Text(
                'Key Metrics',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.primaryNavy),
              ),
              const SizedBox(height: 14),

              Row(
                children: [
                  Expanded(
                    child: _buildMetricTile(
                      value: '95%',
                      label: 'Attendance',
                      valueColor: AppColors.presentGreen,
                      icon: Icons.check_circle_outline,
                      bgColor: AppColors.actionGreenBg,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricTile(
                      value: '${appState.tasksDone}',
                      label: 'Tasks Done',
                      valueColor: const Color(0xFFEA580C),
                      icon: Icons.task_alt,
                      bgColor: AppColors.actionOrangeBg,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: _buildMetricTile(
                      value: '4.8',
                      label: 'Rating',
                      valueColor: AppColors.lateAmber,
                      icon: Icons.star_rounded,
                      bgColor: const Color(0xFFFEF3C7),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricTile(
                      value: '100%',
                      label: 'Goals',
                      valueColor: AppColors.primaryBlue,
                      icon: Icons.flag_rounded,
                      bgColor: AppColors.actionBlueBg,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSegmentTab(String label, int index) {
    final isSelected = _selectedTabIndex == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedTabIndex = index),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isSelected ? Colors.white : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
            boxShadow: isSelected
                ? [
                    BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 6, offset: const Offset(0, 2)),
                  ]
                : null,
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 12,
              fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
              color: isSelected ? AppColors.primaryNavy : AppColors.textSecondary,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMetricTile({
    required String value,
    required String label,
    required Color valueColor,
    required IconData icon,
    required Color bgColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.backgroundLight,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                value,
                style: TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: valueColor, letterSpacing: -0.5),
              ),
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: bgColor,
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: valueColor, size: 16),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }
}

// Custom Painter for Smooth Trend Line with Area Gradient Fill & Tooltip
class _TrendChartPainter extends CustomPainter {
  final List<double> dataset;
  _TrendChartPainter({required this.dataset});

  @override
  void paint(Canvas canvas, Size size) {
    if (dataset.isEmpty) return;

    final width = size.width;
    final height = size.height;

    // Grid lines
    final gridPaint = Paint()
      ..color = AppColors.borderLight
      ..strokeWidth = 1;
    for (int i = 1; i <= 3; i++) {
      final y = height * (i / 4);
      canvas.drawLine(Offset(0, y), Offset(width, y), gridPaint);
    }

    final points = <Offset>[];
    final stepX = width / (dataset.length - 1);

    for (int i = 0; i < dataset.length; i++) {
      final x = i * stepX;
      final y = height - (dataset[i] * height * 0.85);
      points.add(Offset(x, y));
    }

    // Curve Path
    final path = Path();
    path.moveTo(points[0].dx, points[0].dy);

    for (int i = 0; i < points.length - 1; i++) {
      final p0 = points[i];
      final p1 = points[i + 1];
      final controlX = (p0.dx + p1.dx) / 2;
      path.cubicTo(controlX, p0.dy, controlX, p1.dy, p1.dx, p1.dy);
    }

    // Fill Path
    final fillPath = Path.from(path)
      ..lineTo(points.last.dx, height)
      ..lineTo(points.first.dx, height)
      ..close();

    final fillPaint = Paint()
      ..shader = LinearGradient(
        colors: [
          AppColors.primaryBlue.withOpacity(0.25),
          AppColors.primaryBlue.withOpacity(0.0),
        ],
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
      ).createShader(Rect.fromLTWH(0, 0, width, height));

    canvas.drawPath(fillPath, fillPaint);

    // Stroke Path
    final strokePaint = Paint()
      ..color = AppColors.primaryBlue
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    canvas.drawPath(path, strokePaint);

    // Draw active tooltip point at index 3 (Apr - 92%)
    if (points.length > 3) {
      final target = points[3];

      // Outer glow
      final glowPaint = Paint()..color = AppColors.primaryBlue.withOpacity(0.3);
      canvas.drawCircle(target, 8, glowPaint);

      // Inner white circle
      final pointPaint = Paint()..color = Colors.white;
      canvas.drawCircle(target, 4, pointPaint);

      // Border ring
      final borderPaint = Paint()
        ..color = AppColors.primaryBlue
        ..strokeWidth = 2
        ..style = PaintingStyle.stroke;
      canvas.drawCircle(target, 4, borderPaint);
    }
  }

  @override
  bool shouldRepaint(covariant _TrendChartPainter oldDelegate) => oldDelegate.dataset != dataset;
}
