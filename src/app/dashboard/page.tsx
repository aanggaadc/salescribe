"use client";

import { useState } from "react";
import LZString from "lz-string";
import { useAppStore } from "@/store/appStore";
import { ProductForm } from "@/components/forms/ProductForm";
import { SalesPagePreview } from "@/components/preview/SalesPagePreview";
import { ProductInput, SalesPageOutput } from "@/types";

import { Eye } from "lucide-react";

export default function DashboardPage() {
  const {
    input,
    output,
    resetInput,
    setOutput,
    isGenerating,
    setIsGenerating,
    selectedTemplate,
    setCurrentPageId,
  } = useAppStore();
  const [pageId, setPageId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [lastInput, setLastInput] = useState<ProductInput | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleGenerate = async (data: ProductInput) => {
    setError("");
    setSaved(false);
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, template: selectedTemplate }),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Generation failed. Please try again.");
        return;
      }

      setOutput(result.output as SalesPageOutput);
      setPageId(result.pageId);
      setCurrentPageId(result.pageId);
      setLastInput(data);
      setSaved(true);
      // Scroll to preview
      setTimeout(() => {
        document
          .getElementById("preview-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } finally {
      setIsGenerating(false);
    }
  };
  const handleGenerateNew = () => {
    resetInput();
    setOutput(null);
    setCurrentPageId(null);
    setLastInput(null);
    setSaved(false);
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRegenerate = async () => {
    const sourceInput = lastInput ?? input;

    if (!sourceInput) return;

    try {
      setIsRegenerating(true);
      setIsGenerating(true);

      await handleGenerate(sourceInput as ProductInput);
    } finally {
      setIsRegenerating(false);
      setIsGenerating(false);
    }
  };

  const handlePreview = () => {
    if (!output || (!lastInput && !input)) return;

    const productName = lastInput?.productName ?? input?.productName ?? "";

    const encodedData = LZString.compressToEncodedURIComponent(
      JSON.stringify(output),
    );

    const url = `/export?data=${encodedData}&productName=${encodeURIComponent(
      productName,
    )}&template=${selectedTemplate}`;

    window.open(url, "_blank");
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="font-display font-bold text-3xl text-white mb-2">
          Generate Sales Page
        </h1>
        <p className="text-obsidian-300">
          Fill in your product details and let AI craft a high-converting sales
          page.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form panel */}
        <div className="card h-fit">
          <h2 className="font-display font-semibold text-white text-lg mb-6 flex items-center gap-2">
            Product Information
          </h2>
          <ProductForm onGenerate={handleGenerate} />
          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Preview panel */}
        <div id="preview-section">
          {output ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-white text-lg flex items-center gap-2">
                  Live Preview
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerateNew}
                    className="btn-secondary text-sm py-2"
                  >
                    + Generate New
                  </button>

                  {saved && (
                    <span className="text-xs text-volt-400 bg-volt-400/10 border border-volt-400/20 px-3 py-1.5 rounded-full font-medium">
                      ✓ Auto-saved
                    </span>
                  )}
                  <button
                    onClick={handleRegenerate}
                    disabled={isRegenerating || isGenerating}
                    className={`btn-secondary text-sm py-2 flex items-center gap-2 ${
                      isRegenerating ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    {isRegenerating ? (
                      <>
                        <span className="animate-spin">⟳</span>
                        Regenerating...
                      </>
                    ) : (
                      <>↻ Regenerate</>
                    )}
                  </button>
                  <button
                    onClick={handlePreview}
                    className="btn-primary text-sm py-2 flex items-center gap-2"
                  >
                    <Eye /> Preview Page
                  </button>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-obsidian-700/40 shadow-2xl shadow-obsidian-950">
                {/* Browser chrome */}
                <div className="bg-obsidian-800 px-4 py-3 flex items-center gap-2 border-b border-obsidian-700/40">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 bg-obsidian-900/60 rounded-md h-6 px-3 flex items-center">
                    <span className="text-obsidian-400 text-xs font-mono">
                      {lastInput?.productName
                        .toLowerCase()
                        .replace(/\s+/g, "-")}
                      .com
                    </span>
                  </div>
                </div>
                <div className="max-h-[800px] overflow-y-auto">
                  <SalesPagePreview
                    data={output}
                    productName={
                      lastInput?.productName ?? input?.productName ?? ""
                    }
                    template={selectedTemplate}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="card h-full min-h-[400px] flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-obsidian-800 flex items-center justify-center text-3xl mb-4">
                ✨
              </div>
              <h3 className="font-display font-semibold text-white mb-2">
                Your preview will appear here
              </h3>
              <p className="text-obsidian-400 text-sm max-w-xs">
                Fill in the form and click &ldquo;Generate Sales Page&rdquo; to
                see your AI-crafted sales page.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
