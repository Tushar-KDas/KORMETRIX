import 'package:flutter/material.dart';
import '../constants/colors.dart';

class BrandLogo extends StatelessWidget {
  final double size;
  final bool showText;
  final bool showTagline;
  final Color textColor;

  const BrandLogo({
    super.key,
    this.size = 54,
    this.showText = true,
    this.showTagline = true,
    this.textColor = AppColors.primaryNavy,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Real KORMETRIX Emblem from Assets with Vector Fallback
        ClipRRect(
          borderRadius: BorderRadius.circular(size * 0.2),
          child: Image.asset(
            'assets/images/logo.png',
            width: size * 1.4,
            height: size,
            fit: BoxFit.contain,
            errorBuilder: (context, error, stackTrace) => _buildVectorEmblem(),
          ),
        ),
        if (showText) ...[
          const SizedBox(height: 8),
          Text(
            'KORMETRIX',
            style: TextStyle(
              fontSize: size * 0.40,
              fontWeight: FontWeight.w900,
              color: textColor,
              letterSpacing: 0.5,
            ),
          ),
        ],
        if (showTagline) ...[
          const SizedBox(height: 3),
          const Text(
            'People. Work. Performance.',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: AppColors.textSecondary,
              letterSpacing: 0.2,
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildVectorEmblem() {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF14243F), Color(0xFF3158D8)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(size * 0.25),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF3158D8).withOpacity(0.3),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Center(
        child: Text(
          'K',
          style: TextStyle(
            color: Colors.white,
            fontSize: size * 0.56,
            fontWeight: FontWeight.w900,
            letterSpacing: -1,
            height: 1,
          ),
        ),
      ),
    );
  }
}
