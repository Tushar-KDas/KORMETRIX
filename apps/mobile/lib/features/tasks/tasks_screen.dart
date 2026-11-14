import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/colors.dart';
import '../../core/state/app_state.dart';

class TasksScreen extends ConsumerStatefulWidget {
  const TasksScreen({super.key});

  @override
  ConsumerState<TasksScreen> createState() => _TasksScreenState();
}

class _TasksScreenState extends ConsumerState<TasksScreen> {
  int _selectedTabIndex = 0; // 0: All, 1: Pending, 2: Completed

  void _showAddTaskSheet() {
    final titleController = TextEditingController();
    String priority = 'High Priority';
    final deadlineController = TextEditingController(text: 'Today, 6:00 PM');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(28))),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 24,
                right: 24,
                top: 24,
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(child: Container(width: 44, height: 4, decoration: BoxDecoration(color: AppColors.borderLight, borderRadius: BorderRadius.circular(2)))),
                  const SizedBox(height: 18),
                  const Text('Create New Task', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.primaryNavy)),
                  const SizedBox(height: 16),
                  TextField(
                    controller: titleController,
                    decoration: InputDecoration(
                      labelText: 'Task Title',
                      prefixIcon: const Icon(Icons.task_alt, size: 20, color: AppColors.primaryBlue),
                      filled: true,
                      fillColor: AppColors.backgroundLight,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                    ),
                  ),
                  const SizedBox(height: 14),
                  const Text('Priority', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
                  const SizedBox(height: 6),
                  Row(
                    children: ['High Priority', 'Medium', 'Low'].map((p) {
                      final isSel = priority == p;
                      Color pColor = p == 'High Priority' ? AppColors.absentRed : (p == 'Medium' ? AppColors.lateAmber : AppColors.presentGreen);
                      return Expanded(
                        child: GestureDetector(
                          onTap: () => setSheetState(() => priority = p),
                          child: Container(
                            margin: const EdgeInsets.symmetric(horizontal: 4),
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            decoration: BoxDecoration(
                              color: isSel ? pColor.withOpacity(0.15) : AppColors.backgroundLight,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: isSel ? pColor : AppColors.borderLight),
                            ),
                            child: Text(
                              p,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: isSel ? pColor : AppColors.textSecondary,
                              ),
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 14),
                  TextField(
                    controller: deadlineController,
                    decoration: InputDecoration(
                      labelText: 'Deadline',
                      prefixIcon: const Icon(Icons.access_time_rounded, size: 20, color: AppColors.primaryBlue),
                      filled: true,
                      fillColor: AppColors.backgroundLight,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                    ),
                  ),
                  const SizedBox(height: 22),
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: () {
                        final title = titleController.text.trim();
                        if (title.isEmpty) return;
                        ref.read(appStateProvider.notifier).addTask(
                              title: title,
                              priority: priority,
                              deadline: deadlineController.text.trim(),
                            );
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Task "$title" added successfully!'),
                            backgroundColor: AppColors.presentGreen,
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primaryBlue,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      child: const Text('Add Task', style: TextStyle(fontWeight: FontWeight.w800)),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final appState = ref.watch(appStateProvider);
    final allTasks = appState.tasks;

    final pendingTasks = allTasks.where((t) => !t.isCompleted).toList();
    final completedTasks = allTasks.where((t) => t.isCompleted).toList();

    List<TaskItem> displayedTasks;
    switch (_selectedTabIndex) {
      case 1:
        displayedTasks = pendingTasks;
        break;
      case 2:
        displayedTasks = completedTasks;
        break;
      case 0:
      default:
        displayedTasks = allTasks;
        break;
    }

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
          'My Tasks',
          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17, color: AppColors.primaryNavy),
        ),
        centerTitle: true,
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddTaskSheet,
        backgroundColor: AppColors.primaryBlue,
        elevation: 4,
        child: const Icon(Icons.add, color: Colors.white, size: 28),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Segment Filter Tabs (Matches Mockup Image 6: All, Pending, Completed)
              Row(
                children: [
                  _buildTab('All (${allTasks.length})', 0),
                  const SizedBox(width: 8),
                  _buildTab('Pending (${pendingTasks.length})', 1),
                  const SizedBox(width: 8),
                  _buildTab('Completed (${completedTasks.length})', 2),
                ],
              ),
              const SizedBox(height: 18),

              // Task List View
              Expanded(
                child: displayedTasks.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.task_alt, size: 48, color: Colors.grey.shade300),
                            const SizedBox(height: 10),
                            const Text('No tasks in this view', style: TextStyle(color: AppColors.textMuted, fontWeight: FontWeight.w600)),
                          ],
                        ),
                      )
                    : ListView.separated(
                        itemCount: displayedTasks.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          final task = displayedTasks[index];
                          return Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: AppColors.backgroundLight,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: AppColors.borderLight),
                            ),
                            child: Row(
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        task.title,
                                        style: TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w800,
                                          color: task.isCompleted ? AppColors.textMuted : AppColors.primaryNavy,
                                          decoration: task.isCompleted ? TextDecoration.lineThrough : null,
                                        ),
                                      ),
                                      const SizedBox(height: 6),
                                      Row(
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: task.priorityColor.withOpacity(0.12),
                                              borderRadius: BorderRadius.circular(6),
                                            ),
                                            child: Text(
                                              task.priority,
                                              style: TextStyle(
                                                fontSize: 10,
                                                fontWeight: FontWeight.bold,
                                                color: task.priorityColor,
                                              ),
                                            ),
                                          ),
                                          const SizedBox(width: 8),
                                          const Icon(Icons.schedule, size: 12, color: AppColors.textMuted),
                                          const SizedBox(width: 4),
                                          Text(
                                            task.deadline,
                                            style: const TextStyle(fontSize: 11, color: AppColors.textSecondary, fontWeight: FontWeight.w500),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                                // Circular Checkbox (Matches Mockup Image 6)
                                GestureDetector(
                                  onTap: () {
                                    ref.read(appStateProvider.notifier).toggleTask(task.id);
                                  },
                                  child: Container(
                                    width: 24,
                                    height: 24,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: task.isCompleted ? AppColors.primaryBlue : Colors.white,
                                      border: Border.all(
                                        color: task.isCompleted ? AppColors.primaryBlue : AppColors.textMuted,
                                        width: 2,
                                      ),
                                    ),
                                    child: task.isCompleted
                                        ? const Icon(Icons.check, size: 14, color: Colors.white)
                                        : null,
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTab(String title, int index) {
    final isSelected = _selectedTabIndex == index;
    return GestureDetector(
      onTap: () => setState(() => _selectedTabIndex = index),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primaryBlue : AppColors.backgroundLight,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isSelected ? AppColors.primaryBlue : AppColors.borderLight),
        ),
        child: Text(
          title,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w800,
            color: isSelected ? Colors.white : AppColors.textSecondary,
          ),
        ),
      ),
    );
  }
}
