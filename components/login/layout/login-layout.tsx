"use client";
import { cn } from "@/lib/utils";
import LogInForm from "./login-form";

const LogInLayout = () => {
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
          "w-[83vw]",
          "h-148.75", // 595px
          "max-w-266.75", // 1067px
          "flex",
          "rounded-xl",
          "shadow-2xl",
          "bg-background",
        )}
      >
        {/* Logo / Imagem */}
        <div className={cn("h-full w-[43.4%]", "bg-[#FF7F51] rounded-l-xl")}>
          .{/* logo / imagem / ilustração */}
        </div>

        <LogInForm />
      </div>
    </div>
  );
};

export default LogInLayout;
