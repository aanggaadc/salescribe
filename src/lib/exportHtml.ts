import { SalesPageOutput } from "@/types";

export function generateExportHTML(
  data: SalesPageOutput,
  productName: string,
  template: string = "modern"
): string {
  const colors = {
    modern: { primary: "#8b5cf6", bg: "#0f172a", accent: "#c084fc" },
    bold: { primary: "#facc15", bg: "#000000", accent: "#fde047" },
    minimal: { primary: "#111827", bg: "#ffffff", accent: "#6b7280" },
  }[template] || { primary: "#8b5cf6", bg: "#0f172a", accent: "#c084fc" };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${productName} — Sales Page</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; color: #111; }
    .hero { background: ${colors.bg}; color: white; padding: 6rem 2rem; text-align: center; }
    .hero h1 { font-size: clamp(2rem, 5vw, 4rem); font-weight: 800; margin-bottom: 1.5rem; }
    .hero p { font-size: 1.25rem; opacity: 0.8; max-width: 600px; margin: 0 auto 2.5rem; }
    .cta-btn { background: ${colors.primary}; color: white; padding: 1rem 2.5rem; border: none; border-radius: 9999px; font-size: 1.1rem; font-weight: 700; cursor: pointer; text-decoration: none; display: inline-block; }
    section { padding: 4rem 2rem; max-width: 800px; margin: 0 auto; }
    h2 { font-size: 2rem; font-weight: 700; margin-bottom: 2rem; }
    ul { list-style: none; }
    li { padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
    .feature-card { background: #f8fafc; padding: 1.25rem; border-radius: 0.75rem; }
    blockquote { font-size: 1.25rem; font-style: italic; color: #475569; border-left: 4px solid ${colors.primary}; padding-left: 1.5rem; }
    .pricing-box { background: ${colors.bg}; color: white; border-radius: 1.5rem; padding: 3rem; text-align: center; }
  </style>
</head>
<body>
  <div class="hero">
    <p style="color:${colors.accent}; font-size:0.875rem; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:1rem;">${productName}</p>
    <h1>${data.headline}</h1>
    <p>${data.subheadline}</p>
    <a href="#" class="cta-btn">${data.cta}</a>
  </div>

  <section>
    <p style="font-size:1.125rem;line-height:1.8;color:#475569;">${data.description}</p>
  </section>

  <section style="background:#f8fafc; max-width:100%; padding:4rem 2rem;">
    <div style="max-width:800px;margin:0 auto;">
      <h2>Benefits</h2>
      <ul>
        ${data.benefits.map((b) => `<li>✓ ${b}</li>`).join("")}
      </ul>
    </div>
  </section>

  <section>
    <h2>Features</h2>
    <div class="features-grid">
      ${data.features.map((f) => `<div class="feature-card">${f}</div>`).join("")}
    </div>
  </section>

  <section>
    <blockquote>${data.socialProof}</blockquote>
  </section>

  <section>
    <div class="pricing-box">
      <h2 style="color:white;">Pricing</h2>
      <p style="font-size:1.25rem;margin-bottom:1rem;">${data.pricing}</p>
      ${data.guarantee ? `<p style="opacity:0.7;margin-bottom:2rem;font-size:0.9rem;">🛡️ ${data.guarantee}</p>` : ""}
      <a href="#" class="cta-btn">${data.cta}</a>
    </div>
  </section>
</body>
</html>`;
}
