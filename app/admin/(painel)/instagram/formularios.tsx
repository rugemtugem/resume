"use client";

import { useActionState } from "react";
import { acaoAgendar, acaoConectar } from "./acoes";
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

export function FormularioDeToken() {
    const [estado, enviar, enviando] = useActionState(acaoConectar, VAZIO);
    return (
        <form action={enviar} className="space-y-4">
            <div>
                <label htmlFor="ig-token" className="block text-sm font-semibold mb-2">
                    Token de acesso do Instagram
                </label>
                <input id="ig-token" name="token" type="password" autoComplete="off" required placeholder="Cole aqui o token gerado no painel da Meta" className={campo} />
                <p className="text-xs text-[var(--text-secondary)] mt-2">O token fica guardado no servidor e não volta para esta tela.</p>
            </div>
            <Aviso estado={estado} />
            <button type="submit" disabled={enviando} className={botao}>
                {enviando ? "Conferindo..." : "Conectar conta"}
            </button>
        </form>
    );
}

export function FormularioDeAgendamento({ dataPadrao }: { dataPadrao: string }) {
    const [estado, enviar, enviando] = useActionState(acaoAgendar, VAZIO);
    return (
        <form action={enviar} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="ig-titulo" className="block text-sm font-semibold mb-2">
                        Título (só para a fila)
                    </label>
                    <input id="ig-titulo" name="titulo" type="text" required maxLength={120} className={campo} />
                </div>
                <div>
                    <label htmlFor="ig-quando" className="block text-sm font-semibold mb-2">
                        Data e hora (Brasília)
                    </label>
                    <input id="ig-quando" name="quando" type="datetime-local" required defaultValue={dataPadrao} className={campo} />
                </div>
            </div>
            <div>
                <label htmlFor="ig-imagens" className="block text-sm font-semibold mb-2">
                    Imagens
                </label>
                <input id="ig-imagens" name="imagens" type="file" accept="image/jpeg,image/png" multiple required className={campo} />
                <p className="text-xs text-[var(--text-secondary)] mt-2">
                    Uma imagem vira post simples. De 2 a 10 viram carrossel, na ordem dos nomes dos arquivos. Proporção de 4:5 a 1,91:1; PNG é convertido para JPEG.
                </p>
            </div>
            <div>
                <label htmlFor="ig-legenda" className="block text-sm font-semibold mb-2">
                    Legenda
                </label>
                <textarea id="ig-legenda" name="legenda" rows={6} required maxLength={2200} className={campo} />
            </div>
            <Aviso estado={estado} />
            <button type="submit" disabled={enviando} className={botao}>
                {enviando ? "Agendando..." : "Agendar publicação"}
            </button>
        </form>
    );
}
