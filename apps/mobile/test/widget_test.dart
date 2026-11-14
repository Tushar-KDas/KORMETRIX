import 'dart:io';
import 'dart:async';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/utils/currency_formatter.dart';
import 'package:mobile/config/remote_config.dart';
import 'package:mobile/main.dart';

// 1x1 transparent PNG bytes
final List<int> _transparentImage = <int>[
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49,
  0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06,
  0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44,
  0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0D,
  0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42,
  0x60, 0x82,
];

class _MockHttpClient extends Fake implements HttpClient {
  @override
  bool autoUncompress = true;

  @override
  Future<HttpClientRequest> getUrl(Uri url) async => _MockHttpRequest();
}

class _MockHttpRequest extends Fake implements HttpClientRequest {
  @override
  final HttpHeaders headers = _MockHttpHeaders();

  @override
  Future<HttpClientResponse> close() async => _MockHttpResponse();
}

class _MockHttpResponse extends Fake implements HttpClientResponse {
  @override
  int get statusCode => 200;

  @override
  int get contentLength => _transparentImage.length;

  @override
  HttpClientResponseCompressionState get compressionState =>
      HttpClientResponseCompressionState.notCompressed;

  @override
  StreamSubscription<List<int>> listen(
    void Function(List<int> event)? onData, {
    Function? onError,
    void Function()? onDone,
    bool? cancelOnError,
  }) {
    return Stream<List<int>>.fromIterable([_transparentImage]).listen(
      onData,
      onError: onError,
      onDone: onDone,
      cancelOnError: cancelOnError,
    );
  }
}

class _MockHttpHeaders extends Fake implements HttpHeaders {
  @override
  void set(String name, Object value, {bool preserveHeaderCase = false}) {}
}

class _MockHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) => _MockHttpClient();
}

void main() {
  setUpAll(() {
    HttpOverrides.global = _MockHttpOverrides();
  });

  group('WorkForce 360 Mobile Unit & Widget Tests', () {
    test('Bangladesh Currency Formatter formats BDT correctly', () {
      expect(CurrencyFormatter.formatBDT(245000), '৳ 2,45,000');
      expect(CurrencyFormatter.formatBDT(75000), '৳ 75,000');
      expect(CurrencyFormatter.formatBDT(10000000), '৳ 1,00,00,000');
    });

    test('Mobile Remote Config parses defaults properly', () {
      const config = MobileRemoteConfig();
      expect(config.isGpsAttendanceEnabled, true);
      expect(config.isQrAttendanceEnabled, true);
      expect(config.isAppLockedRemotely, false);
      expect(config.latestVersion, '2.0.0');
    });

    testWidgets('App renders Intro Screen cleanly with Get Started button', (WidgetTester tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: WorkForce360App(),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('WorkForce 360'), findsOneWidget);
      expect(find.text('Get Started'), findsOneWidget);
      expect(find.text('Smart Workforce. Stronger Business.'), findsOneWidget);
    });
  });
}
