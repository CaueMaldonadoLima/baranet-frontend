"use client";
import { Button } from "@/components/ui/button";
import LoginCheckbox from "../components/login-checkbox";
import LoginHelpText from "../components/login-help-text";
import LoginInput from "../components/login-input";
import { useState } from "react";

const LogInForm = () => {
  const [keepConnected, setKeepConnected] = useState(true);

  return (
    <div className="flex flex-col gap-4 items-center w-[69.4%]">
      <h1 className="w-full text-left text-login-title font-normal text-[2.6rem]">
        Login
      </h1>

      <LoginInput id="id" placeholder="Identificador" />
      <LoginInput id="user-number" placeholder="Usuário" />
      <LoginInput id="password" placeholder="Senha" type="password" />
      <div className="w-full justify-between flex flex-row items-center">
        <LoginCheckbox
          checked={keepConnected}
          setChecked={setKeepConnected}
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
  );
};

export default LogInForm;
