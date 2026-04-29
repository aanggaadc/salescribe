"use client";

export function DownloadHTMLButton({ productName }: { productName: string }) {
  const handleDownload = () => {
    const content = document.querySelector("#export")?.innerHTML || "";

    const html = `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            
            <title>${productName}</title>

            <!-- Tailwind CDN (optional, see improvement below) -->
            <script src="https://cdn.tailwindcss.com"></script>

            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />

            <style>
              body { font-family: 'Inter', system-ui, sans-serif; }
            </style>
          </head>
          <body>
            ${content}
          </body>
        </html>
     `;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = productName.replace(/\s+/g, "-").toLowerCase() + ".html";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  return (
    <button
      id="download-btn"
      onClick={handleDownload}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        background: "#111827",
        color: "white",
        padding: "12px 18px",
        borderRadius: "999px",
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
        zIndex: 9999,
      }}
    >
      ⬇ Download HTML
    </button>
  );
}
