"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

export interface Retorno {
    erro: string | null;
    ok: string | null;
}

const VAZIO: Retorno = { erro: null, ok: null };
const MAXIMO_POR_IMAGEM = 8 * 1024 * 1024;

/**
 * Envia o formulário para uma ação do servidor sem apagar o que foi digitado quando a ação recusa.
 * O envio padrão do React limpa todos os campos ao terminar, mesmo com erro: quem escreveu um texto
 * longo perderia tudo por causa de um detalhe. Aqui os campos só são limpos quando deu certo (e se pedido).
 *
 * Imagens não vão dentro da ação: cada uma é enviada antes para /admin/midia, que confere a sessão e o
 * tamanho antes de ler o arquivo, e a ação recebe só os nomes (campo "midias"). O formulário diz a
 * proporção aceita com data-proporcao="livre" (LinkedIn); sem isso vale a do feed do Instagram.
 */
export function useEnvio(acao: (anterior: Retorno, dados: FormData) => Promise<Retorno>, limparNoSucesso: boolean) {
    const [estado, enviar, enviando] = useActionState(acao, VAZIO);
    const [subindo, setSubindo] = useState(false);
    const [erroDoEnvio, setErroDoEnvio] = useState<string | null>(null);
    const formulario = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (limparNoSucesso && estado.ok) formulario.current?.reset();
    }, [estado, limparNoSucesso]);

    async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        const form = evento.currentTarget;
        const dados = new FormData(form);
        setErroDoEnvio(null);

        const campos = new Set<string>();
        const arquivos: File[] = [];
        for (const [campo, valor] of dados.entries()) {
            if (valor instanceof File) {
                campos.add(campo);
                if (valor.size > 0) arquivos.push(valor);
            }
        }
        for (const campo of campos) dados.delete(campo);

        if (arquivos.length > 0) {
            // Mesma ordem que a tela promete: a dos nomes dos arquivos.
            arquivos.sort((a, b) => a.name.localeCompare(b.name, "pt-BR", { numeric: true }));
            setSubindo(true);
            try {
                const nome = encodeURIComponent(String(dados.get("titulo") || "midia"));
                const proporcao = form.dataset.proporcao === "livre" ? "livre" : "feed";
                for (const arquivo of arquivos) {
                    if (arquivo.size > MAXIMO_POR_IMAGEM) throw new Error(`"${arquivo.name}" tem mais de 8 MB.`);
                    const resposta = await fetch(`/admin/midia?proporcao=${proporcao}&nome=${nome}`, { method: "POST", body: arquivo, headers: { "Content-Type": arquivo.type || "application/octet-stream" } });
                    const corpo = (await resposta.json().catch(() => ({}))) as { nome?: string; erro?: string };
                    if (!resposta.ok || !corpo.nome) throw new Error(`"${arquivo.name}": ${corpo.erro || "não foi possível enviar a imagem."}`);
                    dados.append("midias", corpo.nome);
                }
            } catch (e) {
                setErroDoEnvio(e instanceof Error ? e.message : "Não foi possível enviar as imagens.");
                setSubindo(false);
                return;
            }
            setSubindo(false);
        }
        startTransition(() => enviar(dados));
    }

    return { estado: erroDoEnvio ? { erro: erroDoEnvio, ok: null } : estado, enviando: enviando || subindo, formulario, aoEnviar };
}
