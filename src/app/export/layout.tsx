export default function ExportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Tailwind CDN */}
      <script src="https://cdn.tailwindcss.com"></script>

      {/* Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap"
        rel="stylesheet"
      />

      <style>{`body { font-family: 'Inter', system-ui, sans-serif; }`}</style>

      {children}
    </>
  );
}
