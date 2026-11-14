import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/colors.dart';
import '../../core/widgets/brand_logo.dart';

class IntroScreen extends StatelessWidget {
  const IntroScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 28.0, vertical: 20.0),
              child: ConstrainedBox(
                constraints: BoxConstraints(minHeight: constraints.maxHeight - 40),
                child: IntrinsicHeight(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Top Logo & Tagline
                      const Column(
                        children: [
                          SizedBox(height: 10),
                          BrandLogo(size: 56),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Hero Illustration & Graphic
                      Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          // Modern Team & Skyscraper Vector Graphic Card
                          Container(
                            width: double.infinity,
                            height: 200,
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  AppColors.actionBlueBg,
                                  Colors.white.withOpacity(0.9),
                                ],
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                              ),
                              borderRadius: BorderRadius.circular(28),
                              border: Border.all(color: AppColors.borderLight),
                              boxShadow: [
                                BoxShadow(
                                  color: AppColors.primaryBlue.withOpacity(0.08),
                                  blurRadius: 20,
                                  offset: const Offset(0, 8),
                                ),
                              ],
                            ),
                            child: Stack(
                              alignment: Alignment.center,
                              children: [
                                // City Skyscraper Silhouette in background
                                Positioned(
                                  bottom: 6,
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: [
                                      _buildBuilding(width: 26, height: 75, color: Colors.blue.shade100),
                                      const SizedBox(width: 4),
                                      _buildBuilding(width: 32, height: 110, color: Colors.blue.shade200),
                                      const SizedBox(width: 4),
                                      _buildBuilding(width: 30, height: 135, color: Colors.blue.shade300),
                                      const SizedBox(width: 4),
                                      _buildBuilding(width: 36, height: 95, color: Colors.blue.shade200),
                                      const SizedBox(width: 4),
                                      _buildBuilding(width: 24, height: 65, color: Colors.blue.shade100),
                                    ],
                                  ),
                                ),

                                // Ascending Growth Arrow
                                Positioned(
                                  top: 14,
                                  right: 14,
                                  child: Transform.rotate(
                                    angle: -0.2,
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                      decoration: BoxDecoration(
                                        gradient: AppColors.primaryGradient,
                                        borderRadius: BorderRadius.circular(16),
                                        boxShadow: [
                                          BoxShadow(
                                            color: AppColors.primaryBlue.withOpacity(0.4),
                                            blurRadius: 8,
                                            offset: const Offset(0, 3),
                                          ),
                                        ],
                                      ),
                                      child: const Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Icon(Icons.trending_up, color: Colors.white, size: 16),
                                          SizedBox(width: 4),
                                          Text(
                                            '+360% Growth',
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 10,
                                              fontWeight: FontWeight.w900,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),

                                // Foreground Team Avatars working on laptops
                                Positioned(
                                  bottom: 16,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(20),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black.withOpacity(0.06),
                                          blurRadius: 12,
                                          offset: const Offset(0, 3),
                                        ),
                                      ],
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        _buildAvatarBadge(Icons.code, 'Dev', AppColors.primaryBlue),
                                        const SizedBox(width: 10),
                                        _buildAvatarBadge(Icons.design_services, 'UI/UX', Colors.purple),
                                        const SizedBox(width: 10),
                                        _buildAvatarBadge(Icons.analytics, 'HR', AppColors.presentGreen),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 18),

                          // Feature Tags Carousel
                          Wrap(
                            alignment: WrapAlignment.center,
                            spacing: 8,
                            runSpacing: 8,
                            children: [
                              _buildFeaturePill(Icons.fingerprint, 'GPS Attendance'),
                              _buildFeaturePill(Icons.calendar_month, 'Leave Ledger'),
                              _buildFeaturePill(Icons.attach_money, 'BDT Payroll'),
                              _buildFeaturePill(Icons.shield, 'Remote Control'),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),

                      // Bottom "Get Started ->" Button & Version
                      Column(
                        children: [
                          SizedBox(
                            width: double.infinity,
                            height: 54,
                            child: ElevatedButton(
                              onPressed: () => context.go('/login'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.primaryBlue,
                                foregroundColor: Colors.white,
                                elevation: 4,
                                shadowColor: AppColors.primaryBlue.withOpacity(0.4),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(18),
                                ),
                              ),
                              child: const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    'Get Started',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w800,
                                      letterSpacing: 0.3,
                                    ),
                                  ),
                                  SizedBox(width: 8),
                                  Icon(Icons.arrow_forward_rounded, size: 20),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 12),
                          const Text(
                            'Version 1.0.0 (Enterprise Edition)',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: AppColors.textMuted,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildBuilding({required double width, required double height, required Color color}) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: color,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(6)),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: List.generate(
          (height / 18).toInt(),
          (i) => Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              Container(width: 4, height: 5, color: Colors.white.withOpacity(0.7)),
              Container(width: 4, height: 5, color: Colors.white.withOpacity(0.7)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAvatarBadge(IconData icon, String label, Color color) {
    return Row(
      children: [
        CircleAvatar(
          radius: 11,
          backgroundColor: color.withOpacity(0.15),
          child: Icon(icon, size: 12, color: color),
        ),
        const SizedBox(width: 5),
        Text(
          label,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w700,
            color: color,
          ),
        ),
      ],
    );
  }

  Widget _buildFeaturePill(IconData icon, String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.backgroundLight,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: AppColors.primaryBlue),
          const SizedBox(width: 5),
          Text(
            text,
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: AppColors.primaryNavy,
            ),
          ),
        ],
      ),
    );
  }
}
