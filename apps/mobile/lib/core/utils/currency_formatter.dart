class CurrencyFormatter {
  static String formatBDT(num amount, {bool showSymbol = true}) {
    final isNegative = amount < 0;
    final absVal = amount.abs().round();
    final str = absVal.toString();

    if (str.length <= 3) {
      final formatted = '${isNegative ? '-' : ''}$str';
      return showSymbol ? '৳ $formatted' : formatted;
    }

    final lastThree = str.substring(str.length - 3);
    final remaining = str.substring(0, str.length - 3);
    final buffer = StringBuffer();

    for (int i = 0; i < remaining.length; i++) {
      if (i > 0 && (remaining.length - i) % 2 == 0) {
        buffer.write(',');
      }
      buffer.write(remaining[i]);
    }

    buffer.write(',');
    buffer.write(lastThree);

    final formatted = '${isNegative ? '-' : ''}${buffer.toString()}';
    return showSymbol ? '৳ $formatted' : formatted;
  }
}
