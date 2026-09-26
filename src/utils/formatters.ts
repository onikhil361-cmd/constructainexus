export function formatDate(dateStr: string): string {
  if (!dateStr || dateStr === 'N/A') return 'N/A';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatTimestamp(dateStr: string): string {
  if (!dateStr || dateStr === 'N/A') return 'N/A';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return dateStr;
  }
}

export function formatQuantity(val: string | number): string {
  if (val === 'N/A' || val === null || val === undefined) return 'N/A';
  const num = typeof val === 'number' ? val : parseFloat(String(val));
  if (isNaN(num)) return String(val);
  return num.toLocaleString('en-IN');
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function truncate(str: string, max = 80): string {
  if (!str || str === 'N/A') return str;
  return str.length > max ? str.slice(0, max) + '…' : str;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
