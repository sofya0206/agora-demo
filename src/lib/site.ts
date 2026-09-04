// Домена для витрины пока нет, API тоже живёт на IP.
// Заменить на реальный адрес, когда он появится.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://agora.ru"
).replace(/\/$/, "");

// Контакты поддержки из макета — реальных пока нет.
export const SUPPORT_PHONE = "8 800 123-45-67";
export const SUPPORT_PHONE_NOTE = "Пн-Пт, 9:00-18:00 по МСК";
export const SUPPORT_EMAIL = "support@agora.ru";
export const SUPPORT_EMAIL_NOTE = "Ответим в течение дня";

// Экранов входа и регистрации ещё нет, поэтому оба входа ведут в заглушку.
export const AUTH_STUB_MESSAGE = "Вход и регистрация появятся позже";
