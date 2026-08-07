import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function WhatsAppFloatingButton({ phoneNumber, siteName }: { phoneNumber: string; siteName: string }) {
  if (!phoneNumber) return null;
  const href = buildWhatsAppLink(phoneNumber, `Bonjour ${siteName}, je souhaite avoir plus d'informations.`);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter sur WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg hover:scale-105 transition"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="white">
        <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.7 4.607 1.902 6.47L4 29l7.72-1.87A11.94 11.94 0 0 0 16.001 27C22.63 27 28 21.627 28 15S22.63 3 16.001 3zm0 21.8a9.76 9.76 0 0 1-4.98-1.36l-.357-.212-4.583 1.11 1.128-4.47-.233-.367A9.76 9.76 0 0 1 6.2 15c0-5.404 4.397-9.8 9.801-9.8 5.403 0 9.799 4.396 9.799 9.8 0 5.403-4.396 9.8-9.8 9.8zm5.36-7.34c-.294-.147-1.74-.858-2.01-.956-.27-.098-.467-.147-.663.147-.196.294-.76.956-.932 1.152-.171.196-.343.221-.637.074-.294-.147-1.242-.457-2.366-1.458-.874-.78-1.464-1.744-1.636-2.038-.171-.294-.018-.453.129-.6.132-.132.294-.343.44-.514.148-.172.196-.294.294-.49.098-.196.049-.368-.024-.515-.074-.147-.663-1.597-.909-2.187-.24-.575-.484-.497-.663-.506l-.564-.01c-.196 0-.515.074-.784.368-.27.294-1.03 1.006-1.03 2.455 0 1.448 1.055 2.848 1.202 3.044.147.196 2.077 3.172 5.033 4.448.703.303 1.252.484 1.68.62.706.224 1.348.192 1.856.117.566-.084 1.74-.712 1.986-1.4.245-.688.245-1.278.171-1.4-.073-.123-.269-.196-.563-.343z" />
      </svg>
    </a>
  );
}
