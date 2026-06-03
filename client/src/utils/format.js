// Shared formatting utilities — replace duplicated definitions across pages

export function formatPrice(price) {
  if (price === 0) return 'Miễn phí';
  return price.toLocaleString('vi-VN') + '₫';
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0][0].toUpperCase();
}

export const STATUS_MAP = {
  pending: { label: 'Chờ xử lý', color: '#f59e0b' },
  processing: { label: 'Đang xử lý', color: '#3b82f6' },
  shipped: { label: 'Đang giao', color: '#8b5cf6' },
  delivered: { label: 'Đã giao', color: '#22c55e' },
  cancelled: { label: 'Đã hủy', color: '#ef4444' },
};
