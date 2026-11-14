import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency amount into Bangladesh style (e.g. ৳ 2,45,000)
 */
export function formatBDT(amount: number, options?: { showSymbol?: boolean }): string {
  const showSymbol = options?.showSymbol ?? true;
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);

  const parts = absVal.toFixed(0).split('.');
  let integerPart = parts[0];

  if (integerPart.length > 3) {
    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);
    integerPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }

  const formatted = `${isNegative ? '-' : ''}${integerPart}`;
  return showSymbol ? `৳ ${formatted}` : formatted;
}

export function formatDateBD(dateString: string | Date): string {
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}
