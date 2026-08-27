/**
 * Formats a date string or timestamp according to the specified locale.
 */
export function formatDate(
  date: string | number | Date | null | undefined,
  locale?: string,
): string {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';

  if (locale === 'zh-Hans') {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(parsed);
  }

  return parsed.toLocaleDateString(locale || 'en-US');
}
