import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseConfig {
  static const String supabaseUrl = 'https://jklphtbxlmxbldmfiwnf.supabase.co';
  static const String supabaseAnonKey =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbHBodGJ4bG14YmxkbWZpd25mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDYzMDIxMiwiZXhwIjoyMTEwMjA2MjEyfQ.pIvNxvHhFVbTuWQsr_AUabVMbGdIg1FGxdzRMiNJIIo';

  static bool get isConfigured =>
      supabaseUrl.isNotEmpty &&
      !supabaseUrl.contains('your-project') &&
      supabaseAnonKey.startsWith('ey');

  static Future<void> initialize() async {
    if (!isConfigured) return;
    try {
      await Supabase.initialize(
        url: supabaseUrl,
        anonKey: supabaseAnonKey,
        authOptions: const FlutterAuthClientOptions(
          authFlowType: AuthFlowType.pkce,
        ),
      );
    } catch (e) {
      // Gracefully continue in local offline mock mode
    }
  }

  static SupabaseClient? get client => isConfigured ? Supabase.instance.client : null;
}
