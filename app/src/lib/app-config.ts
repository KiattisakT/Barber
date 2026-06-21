export const appConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '/api',
  shopSlug: import.meta.env.VITE_SHOP_SLUG ?? 'dream-catcher',
  defaultStaffId: import.meta.env.VITE_DEFAULT_STAFF_ID ?? 'staff_arm',
  queueDate: import.meta.env.VITE_QUEUE_DATE ?? '2026-06-17',
}

export const toBangkokDateTimeIso = (dateValue: string, timeValue: string) => {
  return new Date(`${dateValue}T${timeValue}:00+07:00`).toISOString()
}
