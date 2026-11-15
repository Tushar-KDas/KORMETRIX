import 'package:flutter/material.dart';

/// KORMETRIX Centralized Brand Configuration
class KormetrixBrand {
  static const String appName = 'KORMETRIX';
  static const String appShortName = 'KORMETRIX';
  static const String tagline = 'People. Work. Performance.';
  static const String description = 'Enterprise Workforce Management Platform';
  static const String version = '2.0.0';
  static const String copyright = '© 2026 KORMETRIX. All rights reserved.';

  // Role Sub-Products
  static const String productGo = 'Kormetrix Go';
  static const String productDesk = 'Kormetrix Desk';
  static const String productTeam = 'Kormetrix Team';
  static const String productPeople = 'Kormetrix People';
  static const String productCompany = 'Kormetrix Company';
  static const String productControl = 'KORMETRIX Control';

  // Brand Colors
  static const Color primaryNavy = Color(0xFF14243F);
  static const Color secondaryBlue = Color(0xFF3158D8);
  static const Color accentTeal = Color(0xFF19B89A);
  static const Color backgroundLight = Color(0xFFF5F7FB);
  static const Color backgroundDark = Color(0xFF101827);
  static const Color surfaceWhite = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF17243B);
  static const Color textSecondary = Color(0xFF667085);

  // Asset Paths
  static const String logoPath = 'assets/images/logo.png';
  static const String appIconPath = 'assets/images/app_icon.png';
  static const String splashLogoPath = 'assets/images/splash_logo.png';

  // Gradients
  static const LinearGradient brandGradient = LinearGradient(
    colors: [primaryNavy, secondaryBlue],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient tealAccentGradient = LinearGradient(
    colors: [secondaryBlue, accentTeal],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
