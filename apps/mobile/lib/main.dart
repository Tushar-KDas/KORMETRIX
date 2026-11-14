import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/constants/theme.dart';
import 'core/state/app_state.dart';
import 'core/supabase/supabase_config.dart';
import 'routing/app_router.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SupabaseConfig.initialize();

  runApp(
    const ProviderScope(
      child: WorkForce360App(),
    ),
  );
}

class WorkForce360App extends ConsumerWidget {
  const WorkForce360App({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final appState = ref.watch(appStateProvider);

    return MaterialApp.router(
      title: 'WorkForce 360',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: appState.themeMode,
      routerConfig: appRouter,
    );
  }
}
