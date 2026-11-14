import 'package:flutter/material.dart';
import '../../core/constants/colors.dart';
import '../../core/data/employees_100.dart';
import '../idcard/id_card_screen.dart';

class TeamsDirectoryScreen extends StatefulWidget {
  const TeamsDirectoryScreen({super.key});

  @override
  State<TeamsDirectoryScreen> createState() => _TeamsDirectoryScreenState();
}

class _TeamsDirectoryScreenState extends State<TeamsDirectoryScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String _searchQuery = '';
  String _selectedTeamFilter = 'all';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final filteredList = mock100EmployeesDart.where((e) {
      final matchesQuery = e.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          e.employeeId.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          e.designation.toLowerCase().contains(_searchQuery.toLowerCase());
      final matchesTeam = _selectedTeamFilter == 'all' || e.teamId == _selectedTeamFilter;
      return matchesQuery && matchesTeam;
    }).toList();

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: AppColors.primaryNavy,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          '100 Staff & 5 Teams Directory',
          style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w800),
        ),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppColors.primaryBlue,
          indicatorWeight: 3,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white60,
          labelStyle: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13),
          tabs: const [
            Tab(text: 'Employees & ID Cards'),
            Tab(text: 'Admin Credentials Vault'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // TAB 1: EMPLOYEES & ID CARDS
          Column(
            children: [
              // Search & Team Pills
              Container(
                color: AppColors.backgroundLight,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Column(
                  children: [
                    TextField(
                      decoration: InputDecoration(
                        hintText: 'Search 100 employees by name, ID (e.g. WF-1042)...',
                        hintStyle: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                        prefixIcon: const Icon(Icons.search, size: 20, color: AppColors.primaryBlue),
                        filled: true,
                        fillColor: Colors.white,
                        contentPadding: const EdgeInsets.symmetric(vertical: 10),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      onChanged: (val) {
                        setState(() {
                          _searchQuery = val;
                        });
                      },
                    ),
                    const SizedBox(height: 10),
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: [
                          _buildFilterChip('All (100)', 'all'),
                          const SizedBox(width: 8),
                          _buildFilterChip('Engineering (25)', 'engineering'),
                          const SizedBox(width: 8),
                          _buildFilterChip('Design (20)', 'design'),
                          const SizedBox(width: 8),
                          _buildFilterChip('HR (18)', 'hr'),
                          const SizedBox(width: 8),
                          _buildFilterChip('Finance (17)', 'finance'),
                          const SizedBox(width: 8),
                          _buildFilterChip('Sales (20)', 'sales'),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              // Employees List
              Expanded(
                child: ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: filteredList.length,
                  separatorBuilder: (ctx, i) => const Divider(height: 16, color: AppColors.borderLight),
                  itemBuilder: (ctx, i) {
                    final emp = filteredList[i];
                    return ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: Stack(
                        alignment: Alignment.bottomRight,
                        children: [
                          CircleAvatar(
                            radius: 24,
                            backgroundImage: NetworkImage(emp.avatar),
                          ),
                          Container(
                            padding: const EdgeInsets.all(2),
                            decoration: const BoxDecoration(
                              color: AppColors.primaryBlue,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.badge, size: 10, color: Colors.white),
                          ),
                        ],
                      ),
                      title: Row(
                        children: [
                          Text(emp.name, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                            decoration: BoxDecoration(
                              color: Colors.red.shade50,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              emp.bloodGroup,
                              style: TextStyle(color: Colors.red.shade700, fontWeight: FontWeight.bold, fontSize: 9),
                            ),
                          ),
                        ],
                      ),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${emp.designation} • ${emp.team.split(' ')[0]}',
                            style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                          ),
                          Text(
                            '${emp.employeeId} • ${emp.branch.split(',')[0]}',
                            style: const TextStyle(fontSize: 11, color: AppColors.primaryBlue, fontWeight: FontWeight.w700),
                          ),
                        ],
                      ),
                      trailing: ElevatedButton.icon(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (ctx) => IdCardScreen(employee: emp),
                            ),
                          );
                        },
                        icon: const Icon(Icons.credit_card, size: 14),
                        label: const Text('ID Card', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primaryBlue,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),

          // TAB 2: ADMIN CREDENTIALS VAULT
          ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: mock100EmployeesDart.length,
            separatorBuilder: (ctx, i) => const SizedBox(height: 12),
            itemBuilder: (ctx, i) {
              final emp = mock100EmployeesDart[i];
              return Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.backgroundLight,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.borderLight),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '${emp.name} (${emp.employeeId})',
                          style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13, color: AppColors.primaryNavy),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.primaryBlue.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            emp.role.toUpperCase(),
                            style: const TextStyle(color: AppColors.primaryBlue, fontWeight: FontWeight.bold, fontSize: 9),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    _buildCredentialRow('Login Email:', emp.loginEmail),
                    const SizedBox(height: 4),
                    _buildCredentialRow('Temporary Password:', emp.defaultPassword, isPassword: true),
                    const SizedBox(height: 4),
                    _buildCredentialRow('Mobile PIN:', emp.loginPin),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, String teamId) {
    final isSelected = _selectedTeamFilter == teamId;
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedTeamFilter = teamId;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primaryBlue : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: isSelected ? AppColors.primaryBlue : AppColors.borderLight),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : AppColors.textPrimary,
            fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
            fontSize: 11,
          ),
        ),
      ),
    );
  }

  Widget _buildCredentialRow(String label, String value, {bool isPassword = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
        Row(
          children: [
            Text(
              value,
              style: TextStyle(
                fontSize: 11,
                fontFamily: 'monospace',
                fontWeight: FontWeight.bold,
                color: isPassword ? Colors.deepOrange : AppColors.textPrimary,
              ),
            ),
            const SizedBox(width: 6),
            InkWell(
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('$value copied to clipboard!'),
                    backgroundColor: AppColors.presentGreen,
                    duration: const Duration(seconds: 2),
                  ),
                );
              },
              child: const Icon(Icons.copy, size: 14, color: AppColors.primaryBlue),
            ),
          ],
        ),
      ],
    );
  }
}
