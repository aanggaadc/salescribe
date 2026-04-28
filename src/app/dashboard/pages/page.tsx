"use client";

import { useEffect, useState } from "react";
import LZString from "lz-string";
import { useRouter } from "next/navigation";
import { SavedPage } from "@/types";
import { useAppStore } from "@/store/appStore";

import { Eye, RefreshCw, Download, Trash2, Pencil } from "lucide-react";

export default function PagesPage() {
  const router = useRouter();
  const { setOutput, setInput, setCurrentPageId } = useAppStore();
  const [pages, setPages] = useState<SavedPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  const fetchPages = async () => {
    const res = await fetch("/api/pages");
    if (res.ok) {
      const data = await res.json();
      setPages(data.pages);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this sales page?")) return;
    setDeletingId(id);
    await fetch(`/api/pages/${id}`, { method: "DELETE" });
    setPages(pages.filter((p) => p.id !== id));
    setDeletingId(null);
  };

  const handleRegenerate = async (page: SavedPage) => {
    setRegeneratingId(page.id);
    const res = await fetch(`/api/pages/${page.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "regenerate" }),
    });
    if (res.ok) {
      const data = await res.json();
      setPages(pages.map((p) => (p.id === page.id ? data.page : p)));
    }
    setRegeneratingId(null);
  };

  const handleEdit = (page: SavedPage) => {
    setOutput(page.outputData);
    setInput(page.inputData);
    setCurrentPageId(page.id);
    router.push("/dashboard");
  };

  const handlePreview = (page: SavedPage) => {
    if (!page.outputData) return;

    const compressed = LZString.compressToEncodedURIComponent(
      JSON.stringify(page.outputData),
    );

    const url = `/export?data=${compressed}&productName=${encodeURIComponent(
      page.productName,
    )}&template=${page.template}`;

    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-obsidian-800/60 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="font-display font-bold text-3xl text-white mb-2">
          My Sales Pages
        </h1>
        <p className="text-obsidian-300">
          {pages.length} page{pages.length !== 1 ? "s" : ""} generated
        </p>
      </div>

      {pages.length === 0 ? (
        <div className="card text-center py-20">
          <div className="text-5xl mb-4">📄</div>
          <h3 className="font-display font-semibold text-white mb-2">
            No pages yet
          </h3>
          <p className="text-obsidian-400 mb-6">
            Generate your first sales page to get started.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="btn-primary mx-auto"
          >
            Generate a page →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {pages.map((page) => (
            <div
              key={page.id}
              className="card hover:border-obsidian-600/60 transition-all duration-200 px-3 lg:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-display font-semibold text-white text-lg truncate">
                      {page.productName}
                    </h3>
                    <span className="shrink-0 text-xs font-mono bg-obsidian-800 text-obsidian-300 px-2 py-0.5 rounded-md capitalize">
                      {page.template}
                    </span>
                  </div>

                  {page.outputData?.headline && (
                    <p className="text-obsidian-400 text-sm truncate mb-2">
                      &ldquo;{page.outputData.headline}&rdquo;
                    </p>
                  )}

                  <p className="text-obsidian-500 text-xs font-mono">
                    {new Date(page.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  {/* Edit */}
                  <button
                    onClick={() => handleEdit(page)}
                    className="btn-secondary flex items-center justify-center p-2 sm:px-4 sm:py-2"
                    title="View"
                  >
                    <Pencil size={16} />
                    <span className="hidden md:inline ml-2">Edit</span>
                  </button>

                  {/* Preview */}
                  <button
                    onClick={() => handlePreview(page)}
                    className="btn-secondary flex items-center justify-center p-2 sm:px-4 sm:py-2"
                    title="Export"
                  >
                    <Eye size={16} />
                    <span className="hidden md:inline ml-2">Preview</span>
                  </button>

                  {/* Regenerate */}
                  <button
                    onClick={() => handleRegenerate(page)}
                    disabled={regeneratingId === page.id}
                    className="btn-secondary flex items-center justify-center p-2 sm:px-4 sm:py-2"
                    title="Regenerate"
                  >
                    <RefreshCw
                      size={16}
                      className={
                        regeneratingId === page.id ? "animate-spin" : ""
                      }
                    />
                    <span className="hidden md:inline ml-2">
                      {regeneratingId === page.id ? "..." : "Regenerate"}
                    </span>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(page.id)}
                    disabled={deletingId === page.id}
                    className="flex items-center justify-center p-2 sm:px-4 sm:py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline ml-2">
                      {deletingId === page.id ? "..." : "Delete"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
