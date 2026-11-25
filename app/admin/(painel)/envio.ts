"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import type { FormEvent } from "react";

export interface Retorno {
    erro: string | null;
    ok: string | null;
}

const VAZIO: Retorno = { erro: null, ok: null };

/**
 * Envia o formulário para uma ação do servidor sem apagar o que foi digitado quando a ação recusa.
 * O envio padrão do React limpa todos os campos ao terminar, mesmo com erro: quem escreveu um texto
 * longo perderia tudo por causa de um detalhe. Aqui os campos só são limpos quando deu certo (e se pedido).
 */
export function useEnvio(acao: (anterior: Retorno, dados: FormData) => Promise<Retorno>, limparNoSucesso: boolean) {
    const [estado, enviar, enviando] = useActionState(acao, VAZIO);
    const formulario = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (limparNoSucesso && estado.ok) formulario.current?.reset();
    }, [estado, limparNoSucesso]);

    function aoEnviar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        const dados = new FormData(evento.currentTarget);
        startTransition(() => enviar(dados));
    }

    return { estado, enviando, formulario, aoEnviar };
}
