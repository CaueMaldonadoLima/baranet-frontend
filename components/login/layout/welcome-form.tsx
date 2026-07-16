"use client";

import { useRouter } from "next/navigation";
import { LogInSelect } from "@/components/login/components/login-select";
import { Button } from "@/components/ui/button";

const WellcomeForm = ({ user = "Fulano" }: { user: string }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 h-full items-start w-[69.4%] justify-center">
      <h1 className="w-full text-left text-login-title font-normal text-[2.6rem]">
        Bem vindo {user}!
      </h1>
      <LogInSelect />
      <Button variant="login" size="welcome" className="mt-2" onClick={() => router.push("/")}>
        Entrar
      </Button>
    </div>
  );
};

export default WellcomeForm;
