import type { Product } from "@/lib/products";

export default function NutritionTable({ nutrition }: { nutrition: Product["nutrition"] }) {
  const rows: [string, string | number][] = [
    ["Serving size", nutrition.servingSize],
    ["Servings per container", nutrition.servingsPerContainer],
    ["Calories", nutrition.calories],
    ["Protein", `${nutrition.protein}g`],
    ["Total carbohydrate", `${nutrition.carbs}g`],
    ["  of which sugar", `${nutrition.sugar}g`],
    ["Total fat", `${nutrition.fat}g`],
    ["Sodium", `${nutrition.sodium}mg`],
  ];

  return (
    <div className="rounded-2xl border border-char-700 overflow-hidden">
      <div className="bg-char-900 px-4 py-3 border-b border-char-700">
        <h3 className="font-display text-lg text-chalk">Nutrition Facts</h3>
      </div>
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="border-b border-char-700 last:border-0">
              <td className="px-4 py-2.5 text-chalk/70">{label}</td>
              <td className="px-4 py-2.5 text-right font-tabular text-chalk">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
