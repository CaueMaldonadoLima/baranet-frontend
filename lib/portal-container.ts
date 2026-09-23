"use client";

import * as React from "react";

// Onde popovers (ex: Select) montam o portal. Um <dialog> aberto com
// showModal() fica na top layer do browser: conteúdo portado para o <body>
// renderiza por baixo dele e não recebe cliques. O Modal fornece o próprio
// <dialog> aqui; fora de um Modal o valor é null e o portal vai para o <body>.
// Todo componente com portal usado dentro de um Modal (Select hoje; Popover,
// Dropdown etc. se entrarem) precisa ler este contexto.
export const PortalContainerContext = React.createContext<HTMLElement | null>(null);
