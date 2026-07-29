import { Search } from "lucide-react";

import { InputField } from "@/components/primitives/input-field";
import { cn } from "@/lib/utils";

const SearchInput = ({
  placeholder,
  id,
  type = "text",
}: {
  placeholder: string;
  id: string;
  type?: string;
}) => {
  return (
    <div className="relative w-full">
      {/* Ícone */}
      <Search
        size={18}
        className="
          absolute left-3 top-1/2 -translate-y-1/2
          text-search-input-border
          pointer-events-none
        "
      />

      {/* Input */}
      <InputField
        id={id}
        type={type}
        placeholder={placeholder}
        className={cn(
          "h-11.5 rounded-lg",
          "pl-10", // espaço pro ícone
          "border border-search-input-border",
          "focus-visible:border-login-input-ring",
          "focus-visible:ring-login-input-ring/50",
          "selection:bg-login-input-ring selection:text-white",
          "placeholder:text-search-input-border",
        )}
      />
    </div>
  );
};

export default SearchInput;
