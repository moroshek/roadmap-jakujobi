"use client";

interface ViewToggleProps {
  value: "card" | "table";
  onChange: (value: "card" | "table") => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-lg border border-gray-300 overflow-hidden" role="group" aria-label="View mode">
      <button
        type="button"
        onClick={() => onChange("card")}
        className={`px-4 py-2 text-sm font-medium ${
          value === "card"
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        Cards
      </button>
      <button
        type="button"
        onClick={() => onChange("table")}
        className={`px-4 py-2 text-sm font-medium ${
          value === "table"
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        Table
      </button>
    </div>
  );
}
