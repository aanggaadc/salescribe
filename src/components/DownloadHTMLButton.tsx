"use client";

export function DownloadHTMLButton({ productName }: { productName: string }) {
  const handleDownload = () => {
    const clone = document.documentElement.cloneNode(true) as HTMLElement;

    // ❌ remove Next.js & scripts
    clone.querySelectorAll("script").forEach((el) => el.remove());

    // ❌ remove button itself
    const btn = clone.querySelector("#download-btn");
    if (btn) btn.remove();

    // ❌ remove Next.js attributes (biar clean HTML)
    clone
      .querySelectorAll("[data-nextjs-react-root]")
      .forEach((el) => el.removeAttribute("data-nextjs-react-root"));
    clone
      .querySelectorAll("[data-reactroot]")
      .forEach((el) => el.removeAttribute("data-reactroot"));

    const html = "<!DOCTYPE html>\n" + clone.outerHTML;

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
