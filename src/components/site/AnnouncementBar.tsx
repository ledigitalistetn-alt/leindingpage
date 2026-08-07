export default function AnnouncementBar({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div
      className="text-center text-xs sm:text-sm py-2 px-4 tracking-wide"
      style={{ background: "var(--color-primary)", color: "var(--color-background)" }}
    >
      {text}
    </div>
  );
}
