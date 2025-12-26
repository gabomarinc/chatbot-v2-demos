"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagsInputProps {
  value: string; // Formato: "tag1|tag2|tag3"
  onChange: (value: string) => void; // Devuelve el string en formato "tag1|tag2|tag3"
  placeholder?: string;
  className?: string;
  maxTags?: number;
}

export function TagsInput({ value, onChange, placeholder = "Escribe y presiona Enter", className, maxTags }: TagsInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [focused, setFocused] = React.useState(false);

  // Convertir string "tag1|tag2" a array ["tag1", "tag2"]
  const tags = React.useMemo(() => {
    if (!value || value.trim() === "") return [];
    return value.split("|").filter(tag => tag.trim() !== "");
  }, [value]);

  // Convertir array a string separado por |
  const updateValue = (newTags: string[]) => {
    onChange(newTags.join("|"));
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag === "" || tags.includes(trimmedTag)) return;
    if (maxTags && tags.length >= maxTags) return;
    
    updateValue([...tags, trimmedTag]);
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    updateValue(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim() !== "") {
        addTag(inputValue);
      }
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      // Eliminar el último tag si el input está vacío y presionas backspace
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleBlur = () => {
    setFocused(false);
    // Agregar tag si hay texto al perder el foco
    if (inputValue.trim() !== "") {
      addTag(inputValue);
    }
  };

  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div
      className={cn(
        "w-full min-h-[44px] px-3 py-2 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all",
        className
      )}
      onClick={() => {
        // Enfocar el input cuando haces clic en el contenedor
        inputRef.current?.focus();
      }}
    >
      <div className="flex flex-wrap gap-2 items-center">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
              aria-label={`Eliminar ${tag}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          id="tags-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
          aria-label="Agregar palabra clave"
        />
      </div>
      {maxTags && (
        <p className="text-xs text-gray-500 mt-2">
          {tags.length} / {maxTags} palabras clave
        </p>
      )}
    </div>
  );
}

