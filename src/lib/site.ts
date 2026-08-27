// Домена для витрины пока нет, API тоже живёт на IP.
// Заменить на реальный адрес, когда он появится.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://agora.ru"
).replace(/\/$/, "");
