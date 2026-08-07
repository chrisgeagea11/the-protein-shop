"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "powder", label: "Powders" },
  { value: "bar", label: "Bars" },
];

const PROTEIN_TYPES = [
  { value: "", label: "Any" },
  { value: "whey", label: "Whey" },
  { value: "plant", label: "Plant" },
];

const DIETARY_TAGS = ["vegan", "gluten-free", "dairy-free", "no-sugar-added"];

export default function Filters() {
  const router = useRouter();
  const params = useSearchParams();

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/products?${next.toString()}`);
  }

  function toggleDietary(tag: string) {
    const current = params.get("dietary")?.split(",").filter(Boolean) ?? [];
    const updated = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag];
    const next = new URLSearchParams(params.toString());
    if (updated.length) next.set("dietary", updated.join(","));
    else next.delete("dietary");
    router.push(`/products?${next.toString()}`);
  }

  const activeDietary = params.get("dietary")?.split(",").filter(Boolean) ?? [];
  const maxPrice = params.get("maxPrice") ?? "";

  return (
    <aside className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-wide text-chalk/40 mb-3">Category</p>
        <div className="flex flex-col gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => updateParam("category", c.value)}
              className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                (params.get("category") ?? "") === c.value
                  ? "bg-lime-400 text-char-950 font-semibold"
                  : "text-chalk/70 hover:bg-char-800"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-chalk/40 mb-3">Protein type</p>
        <div className="flex flex-col gap-1.5">
          {PROTEIN_TYPES.map((c) => (
            <button
              key={c.value}
              onClick={() => updateParam("proteinType", c.value)}
              className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                (params.get("proteinType") ?? "") === c.value
                  ? "bg-lime-400 text-char-950 font-semibold"
                  : "text-chalk/70 hover:bg-char-800"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-chalk/40 mb-3">Dietary</p>
        <div className="flex flex-col gap-1.5">
          {DIETARY_TAGS.map((tag) => (
            <label key={tag} className="flex items-center gap-2 text-sm text-chalk/70 px-3 py-1.5">
              <input
                type="checkbox"
                checked={activeDietary.includes(tag)}
                onChange={() => toggleDietary(tag)}
                className="accent-lime-400"
              />
              {tag}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-chalk/40 mb-3">Max price: ${maxPrice || "any"}</p>
        <input
          type="range"
          min="20"
          max="60"
          value={maxPrice || 60}
          onChange={(e) => updateParam("maxPrice", e.target.value)}
          className="w-full accent-lime-400"
        />
      </div>
    </aside>
  );
}
