export function buildWhatsAppLink(phoneNumber: string, message: string) {
  const digits = phoneNumber.replace(/[^0-9]/g, "");
  const text = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${text}`;
}
