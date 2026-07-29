// Usage:
// const [open, setOpen] = useState(false);
//
// <Modal open={open} onOpenChange={setOpen} title="Confirmar exclusão" size="sm">
//   <p>Deseja realmente excluir este registro?</p>
//   <ModalFooter>
//     <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
//     <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
//   </ModalFooter>
// </Modal>

"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
  /** Impede fechar ao clicar fora. Default: false */
  persistent?: boolean;
  children: React.ReactNode;
}

const SIZE_CLASSES: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  size = "md",
  persistent = false,
  children,
}: ModalProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  // Abre e fecha o <dialog> em sincronia com a prop `open`
  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [open]);

  // Sincroniza fechamento via ESC (nativo do <dialog>)
  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onOpenChange(false);
    };

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onOpenChange]);

  // Fecha ao clicar no backdrop (clique fora do painel)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (persistent) return;
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickedOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (clickedOutside) onOpenChange(false);
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className={cn(
        // reset do estilo nativo do <dialog>
        "m-auto w-full rounded-lg border border-border bg-card p-0 shadow-lg",
        "backdrop:bg-black/50 backdrop:backdrop-blur-sm",
        "open:animate-in open:fade-in-0 open:zoom-in-95",
        SIZE_CLASSES[size]
      )}
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-description" : undefined}
    >
      {/* Painel — captura cliques para não propagar ao backdrop */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col"
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
            <div>
              {title && (
                <h2
                  id="modal-title"
                  className="text-base font-semibold text-foreground"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-description"
                  className="mt-0.5 text-sm text-muted-foreground"
                >
                  {description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Fechar modal"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </dialog>
  );
}

// Rodapé do modal — slot para ações
export function ModalFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-4 flex items-center justify-end gap-3 border-t border-border pt-4",
        className
      )}
    >
      {children}
    </div>
  );
}
