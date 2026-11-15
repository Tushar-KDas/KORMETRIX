import 'package:flutter/material.dart';

class AppColors {
  // Brand Primary & Accent (KORMETRIX Official System)
  static const Color primaryNavy = Color(0xFF14243F);
  static const Color primaryBlue = Color(0xFF3158D8);
  static const Color primaryBlueDark = Color(0xFF101827);
  static const Color royalBlue = Color(0xFF3158D8);
  static const Color accentTeal = Color(0xFF19B89A);
  static const Color accentCyan = Color(0xFF00D09C);

  // Background & Surface
  static const Color backgroundLight = Color(0xFFF5F7FB);
  static const Color backgroundDark = Color(0xFF101827);
  static const Color surfaceWhite = Color(0xFFFFFFFF);
  static const Color cardDark = Color(0xFF1E293B);
  static const Color borderLight = Color(0xFFE2E8F0);
  static const Color borderDark = Color(0xFF334155);

  // Text Colors
  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color textMuted = Color(0xFF94A3B8);

  // Status Colors
  static const Color presentGreen = Color(0xFF10B981);
  static const Color lateAmber = Color(0xFFF59E0B);
  static const Color absentRed = Color(0xFFEF4444);
  static const Color leavePurple = Color(0xFF8B5CF6);

  // Quick Action Tints
  static const Color actionBlueBg = Color(0xFFEEF2FF);
  static const Color actionOrangeBg = Color(0xFFFFF7ED);
  static const Color actionAmberBg = Color(0xFFFFFBEB);
  static const Color actionPurpleBg = Color(0xFFFAF5FF);
  static const Color actionGreenBg = Color(0xFFF0FDF4);

  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [Color(0xFF1E3A8A), Color(0xFF3758D8)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient heroCardGradient = LinearGradient(
    colors: [Color(0xFF17243B), Color(0xFF2563EB)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
