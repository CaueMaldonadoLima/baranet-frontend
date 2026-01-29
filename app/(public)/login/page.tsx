'use client';

import { InputField } from "@/components/primitives/input-field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LogIn() {
  return (
    <div
      className={cn(
        "w-full h-screen",
        "bg-background",
        "flex items-center justify-center",
      )}
    >
      {/* Card Container */}
      <div
        className={cn(
          // Proporção do frame (1280x1024 → 1067x595)
          "w-[83vw] h-[58vh]",
          "max-w-266.75 max-h-148.75", // 1067px x 595px
          "min-h-120", // 480px

          // Visual
          "flex overflow-hidden",
          "rounded-xl",
          "shadow-2xl",
          "bg-background",
        )}
      >
        {/* Logo / Imagem */}
        <div
          className={cn(
            "h-full w-[43.4%]",
            "bg-[#FF7F51]",
          )}
        >
          .
          {/* logo / imagem / ilustração */}
        </div>

        {/* Login Form */}
        <div
          className={cn(
            "h-full w-[56.6%]",
            "bg-white",
            "flex flex-col justify-start",
            "gap-6 p-12",
          )}
        >
          <h1 className="text-text font-bold text-4xl">
            Log In
          </h1>
          <div className="flex flex-col gap-4">
            <InputField
              id="email"
              placeholder="Digite seu email"
              type="email"
            />
            <InputField
              id="email"
              placeholder="Digite seu email"
              type="email"
            />
            <InputField
              id="email"
              placeholder="Digite seu email"
              type="email"
            />
          </div>

          <Button className="w-full">
            Entrar
          </Button>
        </div>
      </div>
    </div>
  );
}
