import 'dart:math';
import 'package:flutter/material.dart';
import '../../core/constants/colors.dart';
import '../../core/data/employees_100.dart';

class IdCardScreen extends StatefulWidget {
  final EmployeeItem? employee;

  const IdCardScreen({super.key, this.employee});

  @override
  State<IdCardScreen> createState() => _IdCardScreenState();
}

class _IdCardScreenState extends State<IdCardScreen> with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _animation;
  bool _isFront = true;
  late EmployeeItem _currentEmployee;

  @override
  void initState() {
    super.initState();
    _currentEmployee = widget.employee ?? mock100EmployeesDart.first;
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _animation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  void _flipCard() {
    if (_isFront) {
      _animController.forward();
    } else {
      _animController.reverse();
    }
    setState(() {
      _isFront = !_isFront;
    });
  }

  void _printCard() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Dispatched "${_currentEmployee.name}" ID Card (Both Sides) to WiFi / Bluetooth Printer!'),
        backgroundColor: AppColors.presentGreen,
        duration: const Duration(seconds: 3),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0F1D),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Official Employee ID Card',
          style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w800),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.print_rounded, color: Colors.white),
            tooltip: 'Print Card',
            onPressed: _printCard,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        child: Column(
          children: [
            // Controls header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: AppColors.presentGreen,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      _isFront ? 'FRONT SIDE (TAP TO FLIP)' : 'BACK SIDE (TAP TO FLIP)',
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.2,
                      ),
                    ),
                  ],
                ),
                TextButton.icon(
                  onPressed: _flipCard,
                  icon: const Icon(Icons.flip_camera_android_rounded, size: 16, color: AppColors.primaryBlue),
                  label: const Text('Flip Card', style: TextStyle(color: AppColors.primaryBlue, fontWeight: FontWeight.bold, fontSize: 12)),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Flipping 3D Card Widget
            GestureDetector(
              onTap: _flipCard,
              child: AnimatedBuilder(
                animation: _animation,
                builder: (context, child) {
                  final angle = _animation.value * pi;
                  final isUnderHalf = _animation.value < 0.5;

                  return Transform(
                    transform: Matrix4.identity()
                      ..setEntry(3, 2, 0.001)
                      ..rotateY(angle),
                    alignment: Alignment.center,
                    child: isUnderHalf
                        ? _buildFrontCard(_currentEmployee)
                        : Transform(
                            transform: Matrix4.identity()..rotateY(pi),
                            alignment: Alignment.center,
                            child: _buildBackCard(_currentEmployee),
                          ),
                  );
                },
              ),
            ),

            const SizedBox(height: 24),

            // Print & Share Action Buttons
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _printCard,
                    icon: const Icon(Icons.print_outlined, size: 18),
                    label: const Text('Print Both Sides', style: TextStyle(fontWeight: FontWeight.w800)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryBlue,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                OutlinedButton.icon(
                  onPressed: _flipCard,
                  icon: const Icon(Icons.rotate_right_rounded, size: 18),
                  label: Text(_isFront ? 'Back Side' : 'Front Side'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white,
                    side: const BorderSide(color: Colors.white24),
                    padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Switch Employee Dropdown
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF131B2E),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white10),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Preview Any Employee ID Card (100 Staff)',
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                  const SizedBox(height: 10),
                  DropdownButtonFormField<String>(
                    value: _currentEmployee.employeeId,
                    dropdownColor: const Color(0xFF1E293B),
                    style: const TextStyle(color: Colors.white, fontSize: 12),
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: const Color(0xFF0F172A),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                    ),
                    items: mock100EmployeesDart.map((emp) {
                      return DropdownMenuItem<String>(
                        value: emp.employeeId,
                        child: Text('${emp.employeeId} - ${emp.name} (${emp.team.split(' ')[0]})'),
                      );
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) {
                        final found = mock100EmployeesDart.firstWhere((e) => e.employeeId == val);
                        setState(() {
                          _currentEmployee = found;
                        });
                      }
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // FRONT CARD WIDGET
  Widget _buildFrontCard(EmployeeItem emp) {
    return Container(
      width: 320,
      height: 480,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFF0F172A), Color(0xFF1E293B), Color(0xFF0A0F1D)],
        ),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: Colors.white24, width: 2),
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryBlue.withOpacity(0.25),
            blurRadius: 28,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Header Bar
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: AppColors.primaryBlue,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Center(
                      child: Text('W', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 18)),
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('WorkForce 360', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 13)),
                      Text('WorkForce 360 Ltd', style: TextStyle(color: AppColors.primaryBlue, fontSize: 9, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
              ),
              // NFC Chip
              Container(
                width: 34,
                height: 24,
                decoration: BoxDecoration(
                  color: Colors.amber.shade400,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: Colors.amber.shade200),
                ),
                child: Center(
                  child: Container(
                    width: 22,
                    height: 12,
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.amber.shade800),
                    ),
                  ),
                ),
              ),
            ],
          ),

          // Photo & Name
          Column(
            children: [
              Stack(
                alignment: Alignment.bottomRight,
                children: [
                  Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(22),
                      border: Border.all(color: AppColors.primaryBlue, width: 2.5),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(20),
                      child: Image.network(
                        emp.avatar,
                        width: 96,
                        height: 96,
                        fit: BoxFit.cover,
                        errorBuilder: (ctx, err, stack) => Container(
                          width: 96,
                          height: 96,
                          color: Colors.blueGrey,
                          child: const Icon(Icons.person, color: Colors.white, size: 40),
                        ),
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppColors.presentGreen,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      emp.bloodGroup,
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 10),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                emp.name,
                style: const TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.w900),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 2),
              Text(
                emp.designation,
                style: const TextStyle(color: AppColors.primaryBlue, fontSize: 12, fontWeight: FontWeight.w700),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
                decoration: BoxDecoration(
                  color: Colors.white10,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  emp.team,
                  style: const TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.w600),
                ),
              ),
            ],
          ),

          // Metadata Grid
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.black38,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white12),
            ),
            child: Column(
              children: [
                _buildCardInfoRow('Employee ID:', emp.employeeId, isHighlighted: true),
                const SizedBox(height: 4),
                _buildCardInfoRow('Branch:', emp.branch.split(',')[0]),
                const SizedBox(height: 4),
                _buildCardInfoRow('Issued Date:', emp.joiningDate),
                const SizedBox(height: 4),
                _buildCardInfoRow('Valid Thru:', '31 Dec, 2028', color: AppColors.presentGreen),
              ],
            ),
          ),

          // Security ribbon
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(Icons.verified_user_rounded, color: AppColors.primaryBlue, size: 14),
                  SizedBox(width: 4),
                  Text('NFC SECURE ID', style: TextStyle(color: Colors.white54, fontSize: 9, fontWeight: FontWeight.bold)),
                ],
              ),
              Text('AUTHORIZED CARD', style: TextStyle(color: Colors.amber, fontSize: 9, fontWeight: FontWeight.w900)),
            ],
          ),
        ],
      ),
    );
  }

  // BACK CARD WIDGET
  Widget _buildBackCard(EmployeeItem emp) {
    return Container(
      width: 320,
      height: 480,
      decoration: BoxDecoration(
        color: const Color(0xFF090D16),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: Colors.white24, width: 2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.5),
            blurRadius: 28,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Magnetic Stripe
          Container(
            height: 38,
            width: double.infinity,
            color: Colors.black,
            alignment: Alignment.centerLeft,
            padding: const EdgeInsets.symmetric(horizontal: 10),
            child: Text(
              'TRACK 1: %BWF360^${emp.employeeId}^${emp.name}?',
              style: const TextStyle(color: Colors.white24, fontSize: 7, fontFamily: 'monospace'),
            ),
          ),

          // Terms
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'CARDHOLDER DECLARATION & TERMS',
                style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w900),
              ),
              SizedBox(height: 6),
              Text(
                '1. This card is property of WorkForce 360 Ltd. and must be returned upon exit.',
                style: TextStyle(color: Colors.white60, fontSize: 9, height: 1.3),
              ),
              SizedBox(height: 4),
              Text(
                '2. Unauthorized use or duplication is strictly punishable under the Bangladesh ICT Act.',
                style: TextStyle(color: Colors.white60, fontSize: 9, height: 1.3),
              ),
              SizedBox(height: 4),
              Text(
                '3. If found, please return to any WorkForce 360 office or drop in any post mailbox.',
                style: TextStyle(color: Colors.white60, fontSize: 9, height: 1.3),
              ),
            ],
          ),

          // Headquarters & Emergency
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF131B2E),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white10),
            ),
            child: Column(
              children: [
                _buildBackContactRow(Icons.business_rounded, 'HQ: Banani Road 11, Dhaka-1213'),
                const SizedBox(height: 6),
                _buildBackContactRow(Icons.headset_mic_rounded, 'Hotline: +880 2 9876543 / 16247'),
                const SizedBox(height: 6),
                _buildBackContactRow(Icons.emergency_rounded, 'Emergency: ${emp.emergencyName} (${emp.emergencyPhone})'),
              ],
            ),
          ),

          // Barcode & Signature
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    height: 26,
                    width: 110,
                    color: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: List.generate(20, (i) {
                        return Container(
                          width: (i % 3 + 1).toDouble() * 1.5,
                          height: double.infinity,
                          color: Colors.black,
                        );
                      }),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(emp.employeeId, style: const TextStyle(color: Colors.white54, fontSize: 8, fontFamily: 'monospace')),
                ],
              ),
              const Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    'Nusrat Jahan',
                    style: TextStyle(color: AppColors.primaryBlue, fontFamily: 'serif', fontStyle: FontStyle.italic, fontSize: 14),
                  ),
                  Text(
                    'AUTHORIZED SIGNATORY',
                    style: TextStyle(color: Colors.white38, fontSize: 7, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCardInfoRow(String label, String value, {bool isHighlighted = false, Color? color}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: Colors.white60, fontSize: 10)),
        Text(
          value,
          style: TextStyle(
            color: color ?? (isHighlighted ? Colors.white : Colors.white70),
            fontWeight: isHighlighted ? FontWeight.w900 : FontWeight.w600,
            fontSize: isHighlighted ? 11 : 10,
          ),
        ),
      ],
    );
  }

  Widget _buildBackContactRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 12, color: AppColors.primaryBlue),
        const SizedBox(width: 6),
        Expanded(
          child: Text(text, style: const TextStyle(color: Colors.white70, fontSize: 9)),
        ),
      ],
    );
  }
}
