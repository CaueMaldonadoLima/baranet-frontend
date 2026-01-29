"use client";

import LoginCheckbox from "@/components/login/components/login-checkbox";
import LoginHelpText from "@/components/login/components/login-help-text";
import LoginInput from "@/components/login/components/login-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

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

        {/* Login Form */}
        <div
          className={cn(
            "h-full w-[56.6%]",
            "bg-white rounded-r-xl",
            "flex flex-col justify-start items-center",
            "gap-4 p-12",
          )}
        >
          <div className="flex flex-col gap-4 items-center w-[69.4%]">
            <h1 className="w-full text-left text-login-title font-normal text-[2.6rem]">
              Login
            </h1>

            <LoginInput id="id" placeholder="Identificador" />
            <LoginInput id="user-number" placeholder="Usuário" />
            <LoginInput id="password" placeholder="Senha" type="password" />
            <div className="w-full justify-between flex flex-row items-center">
              <LoginCheckbox
                checked={true}
                setChecked={() => {}}
                label="Manter conectado"
              />
              <LoginHelpText>Esqueceu a senha?</LoginHelpText>
            </div>
            <Button variant="login" size="login" className="mt-2">
              Entrar
            </Button>
            <div className="flex flex-row gap-0.5">
              <p className="text-[12.5px] text-[#720026] text-center">
                Novo usuário?
              </p>
              <LoginHelpText>Junte-se a nós.</LoginHelpText>
            </div>
          </div>
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
}
