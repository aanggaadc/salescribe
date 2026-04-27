"use client";

import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { productInputSchema } from "@/lib/validations";
import { ProductInput } from "@/types";

interface ProductFormProps {
  onGenerate: (data: ProductInput) => Promise<void>;
}

export function ProductForm({ onGenerate }: ProductFormProps) {
  const { input, setInput, isGenerating, selectedTemplate, setSelectedTemplate } = useAppStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [features, setFeatures] = useState<string[]>(
    input.features?.length ? input.features : [""]
  );
  const [usps, setUsps] = useState<string[]>(
    input.uniqueSellingPoints?.length ? input.uniqueSellingPoints : [""]
  );

  const updateFeature = (i: number, val: string) => {
    const updated = [...features];
    updated[i] = val;
    setFeatures(updated);
  };

  const updateUsp = (i: number, val: string) => {
    const updated = [...usps];
    updated[i] = val;
    setUsps(updated);
  };

  const addFeature = () => features.length < 10 && setFeatures([...features, ""]);
  const removeFeature = (i: number) =>
    features.length > 1 && setFeatures(features.filter((_, idx) => idx !== i));

  const addUsp = () => usps.length < 5 && setUsps([...usps, ""]);
  const removeUsp = (i: number) =>
    usps.length > 1 && setUsps(usps.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const fd = new FormData(e.currentTarget);
    const data = {
      productName: fd.get("productName") as string,
      description: fd.get("description") as string,
      features: features.filter((f) => f.trim()),
      targetAudience: fd.get("targetAudience") as string,
      price: fd.get("price") as string,
      uniqueSellingPoints: usps.filter((u) => u.trim()),
    };

    const parsed = productInputSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.errors.forEach((e) => {
        errs[e.path[0]] = e.message;
      });
      setErrors(errs);
      return;
    }

    setInput(parsed.data);
    await onGenerate(parsed.data);
  };

  const templates = [
    { id: "modern", label: "Modern", desc: "Clean, professional" },
    { id: "bold", label: "Bold", desc: "High contrast, urgent" },
    { id: "minimal", label: "Minimal", desc: "Simple, elegant" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Product Name */}
      <div>
        <label className="label">Product / Service Name *</label>
        <input
          name="productName"
          defaultValue={input.productName}
          placeholder="e.g. TaskFlow Pro, Overnight Oats Meal Kit"
          className={`input-field ${errors.productName ? "border-red-500/60 focus:ring-red-500/30" : ""}`}
        />
        {errors.productName && (
          <p className="text-red-400 text-xs mt-1">{errors.productName}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="label">Product Description *</label>
        <textarea
          name="description"
          defaultValue={input.description}
          rows={4}
          placeholder="Describe what your product does, how it works, and what problem it solves..."
          className={`input-field resize-none ${errors.description ? "border-red-500/60" : ""}`}
        />
        {errors.description && (
          <p className="text-red-400 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      {/* Features */}
      <div>
        <label className="label">Key Features *</label>
        <div className="space-y-2">
          {features.map((f, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={f}
                onChange={(e) => updateFeature(i, e.target.value)}
                placeholder={`Feature ${i + 1}`}
                className="input-field flex-1"
              />
              {features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  className="px-3 text-obsidian-400 hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        {features.length < 10 && (
          <button
            type="button"
            onClick={addFeature}
            className="mt-2 text-volt-400 text-sm font-medium hover:text-volt-300 transition-colors"
          >
            + Add feature
          </button>
        )}
        {errors.features && (
          <p className="text-red-400 text-xs mt-1">{errors.features}</p>
        )}
      </div>

      {/* Target Audience */}
      <div>
        <label className="label">Target Audience *</label>
        <input
          name="targetAudience"
          defaultValue={input.targetAudience}
          placeholder="e.g. Busy professionals aged 25-45 who want to eat healthy but lack time"
          className={`input-field ${errors.targetAudience ? "border-red-500/60" : ""}`}
        />
        {errors.targetAudience && (
          <p className="text-red-400 text-xs mt-1">{errors.targetAudience}</p>
        )}
      </div>

      {/* Price */}
      <div>
        <label className="label">Price / Pricing Model *</label>
        <input
          name="price"
          defaultValue={input.price}
          placeholder="e.g. $29/month, $199 one-time, Free with premium at $49/year"
          className={`input-field ${errors.price ? "border-red-500/60" : ""}`}
        />
        {errors.price && (
          <p className="text-red-400 text-xs mt-1">{errors.price}</p>
        )}
      </div>

      {/* Unique Selling Points */}
      <div>
        <label className="label">Unique Selling Points *</label>
        <div className="space-y-2">
          {usps.map((u, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={u}
                onChange={(e) => updateUsp(i, e.target.value)}
                placeholder={`What makes you different #${i + 1}`}
                className="input-field flex-1"
              />
              {usps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeUsp(i)}
                  className="px-3 text-obsidian-400 hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        {usps.length < 5 && (
          <button
            type="button"
            onClick={addUsp}
            className="mt-2 text-volt-400 text-sm font-medium hover:text-volt-300 transition-colors"
          >
            + Add USP
          </button>
        )}
        {errors.uniqueSellingPoints && (
          <p className="text-red-400 text-xs mt-1">{errors.uniqueSellingPoints}</p>
        )}
      </div>

      {/* Template Selector */}
      <div>
        <label className="label">Preview Template</label>
        <div className="grid grid-cols-3 gap-3">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTemplate(t.id as any)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                selectedTemplate === t.id
                  ? "border-volt-400/60 bg-volt-400/10 text-volt-300"
                  : "border-obsidian-700/60 bg-obsidian-900/40 text-obsidian-300 hover:border-obsidian-600"
              }`}
            >
              <div className="font-display font-semibold text-sm">{t.label}</div>
              <div className="text-xs opacity-70 mt-0.5">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isGenerating}
        className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-base"
      >
        {isGenerating ? (
          <>
            <span className="w-5 h-5 border-2 border-obsidian-800/30 border-t-obsidian-900 rounded-full animate-spin" />
            Generating your sales page...
          </>
        ) : (
          <>✨ Generate Sales Page</>
        )}
      </button>
    </form>
  );
}
