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
        // Real WorkForce 360 Emblem from Assets with Vector Fallback
        ClipRRect(
          borderRadius: BorderRadius.circular(size * 0.2),
          child: Image.asset(
            'assets/images/logo.png',
            width: size * 1.1,
            height: size,
            fit: BoxFit.contain,
            errorBuilder: (context, error, stackTrace) => _buildVectorEmblem(),
          ),
        ),
        if (showText) ...[
          const SizedBox(height: 8),
          Text(
            'WorkForce 360',
            style: TextStyle(
              fontSize: size * 0.40,
              fontWeight: FontWeight.w900,
              color: textColor,
              letterSpacing: -0.5,
            ),
          ),
        ],
        if (showTagline) ...[
          const SizedBox(height: 3),
          const Text(
            'One Platform. Complete Workforce Control.',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: AppColors.textSecondary,
              letterSpacing: 0.1,
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
          colors: [Color(0xFF2563EB), Color(0xFF38BDF8)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(size * 0.3),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF2563EB).withOpacity(0.3),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          Positioned(
            top: size * 0.20,
            left: size * 0.24,
            child: Container(
              width: size * 0.14,
              height: size * 0.14,
              decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
            ),
          ),
          Positioned(
            top: size * 0.15,
            child: Container(
              width: size * 0.17,
              height: size * 0.17,
              decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
            ),
          ),
          Positioned(
            top: size * 0.20,
            right: size * 0.24,
            child: Container(
              width: size * 0.14,
              height: size * 0.14,
              decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
            ),
          ),
          Positioned(
            bottom: size * 0.16,
            child: Text(
              'W',
              style: TextStyle(
                color: Colors.white,
                fontSize: size * 0.52,
                fontWeight: FontWeight.w900,
                letterSpacing: -1,
                height: 1,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
