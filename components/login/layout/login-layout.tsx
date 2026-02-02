"use client";
import { cn } from "@/lib/utils";
import LogInForm from "./login-form";
import WellcomeForm from "./welcome-form";
import LoginHelpText from "../components/login-help-text";
import Image from "next/image";

const LogInLayout = ({ isLogIn = false, user = "Fulano" }) => {
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

        {/* Formulário de Login / Welcome */}
        <div
          className={cn(
            "h-full w-[56.6%]",
            "bg-white rounded-r-xl",
            "flex flex-col justify-between items-center",
            "gap-4 p-12",
          )}
        >
          {isLogIn ? <LogInForm /> : <WellcomeForm user={user} />}
          <div className="h-9.5 border-t-2 border-black w-full justify-center flex">
            <div className="mt-6.5 flex flex-row items-center w-[69.4%] justify-between">
              <div className="flex flex-row gap-0.5 ">
                <p className="text-[12.5px] text-black text-center">
                  Precisa de ajuda?
                </p>
                <LoginHelpText>Abrir diálogo em nosso Whatsapp.</LoginHelpText>
              </div>
              <Image
                src="/whatsapp-icon.png"
                alt="Whatsapp Icon"
                width={29}
                height={29}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogInLayout;
