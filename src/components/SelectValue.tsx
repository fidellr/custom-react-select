import { X } from "lucide-react";
import { clsx } from "clsx";

interface SelectValueProps<T> {
  value: T | T[] | null | undefined;
  multiple: boolean;
  getOptionLabel: (opt: T) => string;
  getOptionValue: (opt: T) => string | number;
  onRemove: (e: React.MouseEvent, opt: T) => void;
  disabled?: boolean;
  placeholder: string;
}

export const SelectValue = <T,>({
  value,
  multiple,
  getOptionLabel,
  getOptionValue,
  onRemove,
  disabled = false,
  placeholder,
}: SelectValueProps<T>) => {
  const isEmpty =
    !value || (multiple && Array.isArray(value) && value.length === 0);
  if (isEmpty) {
    return <span className="text-gray-400 select-none">{placeholder}</span>;
  }

  if (!multiple && !Array.isArray(value)) {
    return <span className="truncate">{getOptionLabel(value as T)}</span>;
  }

  const selectedValues = Array.isArray(value) ? value : [];

  const chipClassName = clsx(
    "flex items-center gap-1 text-sm px-2 py-0.5 rounded-full truncate max-w-full border",
    disabled
      ? "opacity-70 bg-gray-200 border-gray-300"
      : "bg-gray-100 border-gray-200",
  );

  return (
    <div className="flex flex-wrap gap-1">
      {selectedValues.map((val) => (
        <span key={getOptionValue(val)} className={chipClassName}>
          <span className="truncate">{getOptionLabel(val)}</span>

          {!disabled && (
            <button
              type="button"
              onClick={(e) => onRemove(e, val)}
              className="hover:bg-gray-200 rounded-full p-0.5 transition-colors focus:outline-none focus:ring-1 focus:ring-teal-500"
              aria-label={`Remove ${getOptionLabel(val)}`}
            >
              <X size={12} />
            </button>
          )}
        </span>
      ))}
    </div>
  );
};
