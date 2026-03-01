import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search } from "lucide-react";
import { clsx } from "clsx";

const highlightMatch = (text: string, highlight: string) => {
  if (!highlight.trim()) return <span>{text}</span>;

  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={i} className="bg-teal-400/30 text-teal-900 rounded-sm">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
};

const getOptionClassName = (isActive: boolean, isSelected: boolean) => {
  return clsx(
    "px-4 py-2 text-sm cursor-pointer transition-colors",
    isSelected && "text-teal-900 font-medium",
    isActive && isSelected
      ? "bg-teal-100"
      : isSelected
        ? "bg-teal-50"
        : isActive
          ? "bg-gray-100"
          : "hover:bg-gray-50",
  );
};

interface SelectDropdownProps<T> {
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  coords: { top: number; left: number; width: number };
  filteredOptions: T[];
  searchValue: string;
  setSearchValue: (val: string) => void;
  withSearch: boolean;
  usePortal: boolean;
  getOptionLabel: (opt: T) => string;
  getOptionValue: (opt: T) => string | number;
  isSelected: (opt: T) => boolean;
  onSelect: (opt: T) => void;
  renderOption?: (option: T, isSelected: boolean) => React.ReactNode;
  listboxId: string;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  searchPlaceholder: string;
}

export const SelectDropdown = <T,>({
  dropdownRef,
  coords,
  filteredOptions,
  searchValue,
  setSearchValue,
  withSearch,
  usePortal,
  getOptionLabel,
  getOptionValue,
  isSelected,
  onSelect,
  renderOption,
  listboxId,
  highlightedIndex,
  setHighlightedIndex,
  searchPlaceholder,
}: SelectDropdownProps<T>) => {
  const listboxRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (highlightedIndex >= 0 && listboxRef.current) {
      const item = listboxRef.current.children[highlightedIndex] as HTMLElement;
      if (item) item.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  const dropdownStyles: React.CSSProperties = usePortal
    ? { top: coords.top, left: coords.left, width: coords.width }
    : { top: "100%", left: 0, right: 0, marginTop: "4px" };

  const content = (
    <div
      ref={dropdownRef}
      style={{ position: "absolute", ...dropdownStyles }}
      className="z-[9999] bg-white border border-gray-200 rounded-md shadow-lg flex flex-col overflow-hidden"
    >
      {withSearch && (
        <div className="p-2 border-b border-gray-100 flex items-center gap-2 bg-white">
          <Search size={14} className="text-gray-400" />
          <input
            autoFocus
            className="w-full text-sm outline-none placeholder-gray-400"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      )}

      <ul
        ref={listboxRef}
        id={listboxId}
        role="listbox"
        className="max-h-60 overflow-y-auto py-1"
      >
        {filteredOptions.length === 0 ? (
          <li className="px-4 py-2 text-sm text-gray-500 text-center select-none">
            No results
          </li>
        ) : (
          filteredOptions.map((opt, idx) => {
            const selected = isSelected(opt);
            const active = idx === highlightedIndex;

            return (
              <li
                key={getOptionValue(opt)}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setHighlightedIndex(idx)}
                onClick={() => onSelect(opt)}
                className={getOptionClassName(active, selected)}
              >
                {renderOption
                  ? renderOption(opt, selected)
                  : highlightMatch(getOptionLabel(opt), searchValue)}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );

  return usePortal ? createPortal(content, document.body) : content;
};
