import { useState, useRef, useCallback, useId, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { usePosition } from "../hooks/usePosition";
import { useClickOutside } from "../hooks/useClickOutside";
import { SelectValue } from "./SelectValue";
import { SelectDropdown } from "./SelectDropdown";

export interface SelectProps<T = any> {
  id?: string;
  name?: string;
  options: T[];
  value?: T | T[] | null;
  onChange: (value: any) => void;

  label?: React.ReactNode;
  placeholder?: string;
  searchPlaceholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string | boolean;

  className?: string;
  containerClassName?: string;
  outlined?: boolean;

  withSearch?: boolean;
  multiple?: boolean;
  usePortal?: boolean;
  renderOption?: (option: T, isSelected: boolean) => React.ReactNode;
}

export const Select = <T,>({
  id,
  name,
  options = [],
  value,
  onChange,
  label,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  required = false,
  disabled = false,
  error,
  className,
  containerClassName,
  withSearch = false,
  multiple = false,
  outlined = false,
  usePortal = true,
  renderOption,
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const internalId = useId();
  const selectId = id || `select-${internalId}`;
  const coords = usePosition(containerRef, isOpen);

  const getOptionLabel = (opt: T): string => {
    if (opt === null || opt === undefined) return "";
    if (typeof opt === "object") {
      return String((opt as any).label || (opt as any).name || "");
    }
    return String(opt);
  };

  const getOptionValue = (opt: T): string | number => {
    if (opt === null || opt === undefined) return "";
    if (typeof opt === "object") {
      return (opt as any).id ?? (opt as any).value ?? getOptionLabel(opt);
    }
    return String(opt);
  };

  const isSelected = useCallback(
    (opt: T) => {
      if (!value) return false;
      const optId = getOptionValue(opt);

      if (multiple && Array.isArray(value)) {
        return value.some((v) => getOptionValue(v) === optId);
      }
      return getOptionValue(value as T) === optId;
    },
    [value, multiple],
  );

  const filteredOptions = useMemo(() => {
    if (!searchValue.trim()) return options;
    const lowerSearch = searchValue.toLowerCase();
    return options.filter((opt) =>
      getOptionLabel(opt).toLowerCase().includes(lowerSearch),
    );
  }, [options, searchValue, getOptionLabel]);

  const closeDropdown = () => {
    setIsOpen(false);
    setSearchValue("");
    setHighlightedIndex(-1);
  };

  useClickOutside(isOpen, containerRef, dropdownRef, closeDropdown);

  const handleSelect = (option: T) => {
    if (disabled) return;

    if (multiple) {
      const current = Array.isArray(value) ? value : [];
      const optionId = getOptionValue(option);
      const isAlreadySelected = current.some(
        (v) => getOptionValue(v) === optionId,
      );

      const newValue = isAlreadySelected
        ? current.filter((v) => getOptionValue(v) !== optionId)
        : [...current, option];
      onChange(newValue);
    } else {
      onChange(option);
      closeDropdown();
      triggerRef.current?.focus();
    }
  };

  const handleRemove = (e: React.MouseEvent, option: T) => {
    e.stopPropagation();
    if (disabled || !multiple) return;
    const current = Array.isArray(value) ? value : [];
    const optionId = getOptionValue(option);
    onChange(current.filter((v) => getOptionValue(v) !== optionId));
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (!isOpen) {
      if (["Enter", " ", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => {
          if (prev === -1) return 0;
          return prev < filteredOptions.length - 1 ? prev + 1 : prev;
        });
        break;
      case "Enter":
        e.preventDefault();
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < filteredOptions.length
        ) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        closeDropdown();
        triggerRef.current?.focus();
        break;
    }
  };

  return (
    <div
      className={twMerge(
        "relative w-full max-w-md font-sans flex flex-col gap-1",
        containerClassName,
      )}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      {label && (
        <label
          id={`${selectId}-label`}
          htmlFor={selectId}
          onClick={() =>
            !disabled && (triggerRef.current?.focus(), setIsOpen(true))
          }
          className={twMerge(
            "block text-sm font-medium transition-colors select-none",
            disabled
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 cursor-pointer",
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        type="hidden"
        name={name}
        value={
          multiple
            ? JSON.stringify(value || [])
            : value
              ? getOptionLabel(value as T)
              : ""
        }
      />

      <div
        ref={triggerRef}
        id={selectId}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={twMerge(
          clsx(
            "flex items-center justify-between min-h-[40px] w-full px-3 py-1.5 transition-all outline-none bg-white",
            outlined ? "border-2 rounded-lg" : "border rounded-md shadow-sm",
            disabled
              ? "bg-gray-50 cursor-not-allowed opacity-70"
              : "cursor-pointer",
            error
              ? "border-red-500 ring-red-200 focus:ring-2"
              : isOpen
                ? "border-teal-500 ring-1 ring-teal-500"
                : "border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-teal-100",
            className,
          ),
        )}
      >
        <div className="flex-1 overflow-hidden pr-2">
          <SelectValue<T>
            value={value}
            multiple={multiple}
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
            onRemove={handleRemove}
            disabled={disabled}
            placeholder={placeholder}
          />
        </div>
        <ChevronDown
          size={16}
          className={twMerge(
            clsx(
              "flex-shrink-0 transition-transform duration-200",
              isOpen && "rotate-180",
              disabled ? "text-gray-300" : "text-gray-400",
            ),
          )}
        />
      </div>

      {typeof error === "string" && (
        <p className="text-xs text-red-500 mt-0.5" role="alert">
          {error}
        </p>
      )}

      {isOpen && !disabled && (
        <SelectDropdown<T>
          dropdownRef={dropdownRef}
          coords={coords}
          filteredOptions={filteredOptions}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          withSearch={withSearch}
          usePortal={usePortal}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          isSelected={isSelected}
          onSelect={handleSelect}
          renderOption={renderOption}
          listboxId={`${selectId}-listbox`}
          highlightedIndex={highlightedIndex}
          setHighlightedIndex={setHighlightedIndex}
          searchPlaceholder={searchPlaceholder}
        />
      )}
    </div>
  );
};
