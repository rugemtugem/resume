"use client";

import { useActionState } from "react";
import { useEnvio } from "../envio";
import { acaoAgendarNoLinkedin, acaoConectarLinkedin } from "./acoes";
import type { Retorno } from "./acoes";

const VAZIO: Retorno = { erro: null, ok: null };
const campo = "w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border-2 border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary-color)]";
const botao = "px-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] disabled:opacity-60";

function Aviso({ estado }: { estado: Retorno }) {
    if (estado.erro) {
        return (
            <p role="alert" className="text-sm text-red-500">
                {estado.erro}
            </p>
        );
    }
    if (estado.ok) {
        return (
            <p role="status" className="text-sm text-emerald-500">
                {estado.ok}
            </p>
        );
    }
    return null;
}

export function FormularioDeTokenDoLinkedin() {
    const [estado, enviar, enviando] = useActionState(acaoConectarLinkedin, VAZIO);
    return (
        <form action={enviar} className="space-y-4">
            <div>
                <label htmlFor="li-token" className="block text-sm font-semibold mb-2">
                    Token de acesso do LinkedIn
                </label>
                <input id="li-token" name="token" type="password" autoComplete="off" required placeholder="Cole aqui o token gerado no portal de desenvolvedores do LinkedIn" className={campo} />
                <p className="text-xs text-[var(--text-secondary)] mt-2">
                    Gere com as permissões openid, profile e w_member_social. O token vale 60 dias, fica guardado no servidor e não volta para esta tela.
                </p>
            </div>
            <Aviso estado={estado} />
            <button type="submit" disabled={enviando} className={botao}>
                {enviando ? "Conferindo..." : "Conectar perfil"}
            </button>
        </form>
    );
}

export function FormularioDoLinkedin({ dataPadrao }: { dataPadrao: string }) {
    const { estado, enviando, formulario, aoEnviar } = useEnvio(acaoAgendarNoLinkedin, true);
    return (
        <form ref={formulario} onSubmit={aoEnviar} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="li-titulo" className="block text-sm font-semibold mb-2">
                        Título (só para a fila)
                    </label>
                    <input id="li-titulo" name="titulo" type="text" required maxLength={120} className={campo} />
                </div>
                <div>
                    <label htmlFor="li-quando" className="block text-sm font-semibold mb-2">
                        Data e hora (Brasília)
                    </label>
                    <input id="li-quando" name="quando" type="datetime-local" required defaultValue={dataPadrao} className={campo} />
                </div>
            </div>
            <div>
                <label htmlFor="li-texto" className="block text-sm font-semibold mb-2">
                    Texto do post
                </label>
                <textarea id="li-texto" name="texto" rows={8} required maxLength={3000} className={campo} />
            </div>
            <div>
                <label htmlFor="li-imagens" className="block text-sm font-semibold mb-2">
                    Imagens (opcional)
                </label>
                <input id="li-imagens" name="imagens" type="file" accept="image/jpeg,image/png" multiple className={campo} />
                <p className="text-xs text-[var(--text-secondary)] mt-2">Sem imagem sai só o texto. Até 20 imagens, na ordem dos nomes dos arquivos.</p>
            </div>
            <Aviso estado={estado} />
            <button type="submit" disabled={enviando} className={botao}>
                {enviando ? "Agendando..." : "Agendar post"}
            </button>
        </form>
    );
}
