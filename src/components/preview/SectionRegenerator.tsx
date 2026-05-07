"use client";

import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { ProductInput, SalesPageOutput } from "@/types";

export type RegenerableSection =
  | "headline"
  | "subheadline"
  | "description"
  | "benefits"
  | "features"
  | "socialProof"
  | "pricing"
  | "cta"
  | "painPoints"
  | "guarantee";

interface SectionConfig {
  key: RegenerableSection;
  label: string;
  icon: string;
  description: string;
}

const SECTIONS: SectionConfig[] = [
  {
    key: "headline",
    label: "Headline",
    icon: "H1",
    description: "Main hero headline",
  },
  {
    key: "subheadline",
    label: "Subheadline",
    icon: "H2",
    description: "Supporting tagline",
  },
  {
    key: "description",
    label: "Description",
    icon: "¶",
    description: "Product description",
  },
  {
    key: "benefits",
    label: "Benefits",
    icon: "✓",
    description: "Outcome statements",
  },
  {
    key: "features",
    label: "Features",
    icon: "⚙",
    description: "Product capabilities",
  },
  {
    key: "socialProof",
    label: "Social Proof",
    icon: "❝",
    description: "Testimonial / quote",
  },
  {
    key: "pricing",
    label: "Pricing",
    icon: "$",
    description: "Pricing statement",
  },
  { key: "cta", label: "CTA", icon: "→", description: "Call-to-action button" },
  {
    key: "painPoints",
    label: "Pain Points",
    icon: "✗",
    description: "Audience pain points",
  },
  {
    key: "guarantee",
    label: "Guarantee",
    icon: "🛡",
    description: "Risk reversal statement",
  },
];

interface Props {
  lastInput: ProductInput | null;
  pageId: string;
  disabled?: boolean;
  onRegenerated: (updatedOutput: SalesPageOutput) => void;
}

export function SectionRegenerator({
  lastInput,
  pageId,
  disabled = false,
  onRegenerated,
}: Props) {
  const { input } = useAppStore();
  const [selected, setSelected] = useState<Set<RegenerableSection>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastRegenerated, setLastRegenerated] = useState<RegenerableSection[]>(
    [],
  );

  const toggle = (key: RegenerableSection) => {
    if (disabled || loading) return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const selectAll = () => {
    if (!disabled && !loading) setSelected(new Set(SECTIONS.map((s) => s.key)));
  };
  const clearAll = () => {
    if (!disabled && !loading) setSelected(new Set());
  };

  const handleRegenerate = async () => {
    if (selected.size === 0) return;
    setError("");
    setLoading(true);

    try {
      const inputSource = input ?? lastInput;
      const res = await fetch("/api/regenerate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId,
          inputData: inputSource,
          sections: Array.from(selected),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to regenerate. Try again.");
        return;
      }

      setLastRegenerated(Array.from(selected));
      setSelected(new Set());
      onRegenerated(data.output);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`card border-obsidian-700/60 transition-opacity duration-200 ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-white text-sm">
            Regenerate Sections
          </h3>
          <p className="text-obsidian-400 text-xs mt-0.5">
            Select one or more sections to regenerate with fresh AI content
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="text-xs text-obsidian-400 hover:text-volt-300 transition-colors font-medium"
          >
            All
          </button>
          <span className="text-obsidian-600">·</span>
          <button
            onClick={clearAll}
            className="text-xs text-obsidian-400 hover:text-obsidian-200 transition-colors font-medium"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Section grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
        {SECTIONS.map((s) => {
          const isSelected = selected.has(s.key);
          const wasRegenerated = lastRegenerated.includes(s.key);

          return (
            <button
              key={s.key}
              onClick={() => toggle(s.key)}
              className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border text-center
                transition-all duration-150 group
                ${
                  isSelected
                    ? "border-volt-400/70 bg-volt-400/10 text-volt-300"
                    : "border-obsidian-700/50 bg-obsidian-900/40 text-obsidian-400 hover:border-obsidian-600 hover:text-obsidian-200"
                }`}
            >
              {wasRegenerated && !isSelected && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-volt-400" />
              )}
              <span className="font-mono text-xs font-bold leading-none">
                {s.icon}
              </span>
              <span className="font-display font-medium text-xs leading-tight">
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected summary + action */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-obsidian-400 min-w-0">
          {selected.size === 0 ? (
            <span>No sections selected</span>
          ) : (
            <span className="text-volt-400 font-medium">
              {selected.size} section{selected.size !== 1 ? "s" : ""} selected:{" "}
              <span className="text-obsidian-300 font-normal">
                {Array.from(selected)
                  .map((k) => SECTIONS.find((s) => s.key === k)?.label)
                  .join(", ")}
              </span>
            </span>
          )}
        </div>

        <button
          onClick={handleRegenerate}
          disabled={selected.size === 0 || loading || disabled}
          className="btn-primary text-xs py-2 px-4 shrink-0 flex items-center gap-2 disabled:opacity-40"
        >
          {loading ? (
            <>
              <span className="w-3 h-3 border-2 border-obsidian-900/40 border-t-obsidian-900 rounded-full animate-spin" />
              Regenerating...
            </>
          ) : (
            <>↻ Regenerate{selected.size > 0 ? ` (${selected.size})` : ""}</>
          )}
        </button>
      </div>

      {/* Last regenerated notice */}
      {lastRegenerated.length > 0 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-volt-400 bg-volt-400/5 border border-volt-400/15 rounded-lg px-3 py-2">
          <span>✓</span>
          <span>
            Regenerated:{" "}
            {lastRegenerated
              .map((k) => SECTIONS.find((s) => s.key === k)?.label)
              .join(", ")}
          </span>
        </div>
      )}

      {error && (
        <div className="mt-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
    </div>
  );
}
