"use client";

import { useActionState } from "react";
import { acaoEntrar } from "./acoes";

export function FormularioDeLogin() {
    const [estado, enviar, enviando] = useActionState(acaoEntrar, { erro: null });

    return (
        <form action={enviar} className="space-y-5">
            <div>
                <label htmlFor="admin-senha" className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    Senha
                </label>
                <input
                    id="admin-senha"
                    name="senha"
                    type="password"
                    autoComplete="current-password"
                    required
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border-2 border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary-color)]"
                />
            </div>
            {estado.erro && (
                <p role="alert" className="text-sm text-red-500">
                    {estado.erro}
                </p>
            )}
            <button
                type="submit"
                disabled={enviando}
                className="w-full px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] disabled:opacity-60"
            >
                {enviando ? "Entrando..." : "Entrar"}
            </button>
        </form>
    );
}
