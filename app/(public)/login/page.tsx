import { cn } from "@/lib/utils";

export default function LogIn() {
  return (
    <div className={cn(
      "w-full h-screen bg-background flex items-center justify-center",
    )}>
      <div className="max-w-270 max-h-150 w-full h-full flex shadow-2xl rounded-xl">
        {/* Logo Card */}
        <div className="rounded-l-xl h-full w-[45%] bg-primary"></div>
        {/* LogIn Form */}
        <div className={cn(
          "rounded-r-xl h-full w-[55%] bg-white flex flex-col",
          "gap-6 p-6",
        )}>
          <h1 className="text-text font-bold text-4xl">Bem vindo Fulano!</h1>
          <button>Selecionar sua loja</button>
          <button>Entrar</button>
        </div>
      </div>
    </div>
  )
}
