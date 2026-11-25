"use client";

import { useEnvio } from "../../envio";
import { acaoAprovarTudo } from "./acoes";

export function FormularioDeAprovacao({ slug, dataPadrao, rotulo, bloqueado, temLinkedin }: { slug: string; dataPadrao: string; rotulo: string; bloqueado: boolean; temLinkedin: boolean }) {
    const { estado, enviando, formulario, aoEnviar } = useEnvio(acaoAprovarTudo, false);
    return (
        <form ref={formulario} onSubmit={aoEnviar} className="flex flex-col gap-4">
            <input type="hidden" name="slug" value={slug} />
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                <div>
                    <label htmlFor="social-quando" className="block text-sm font-semibold mb-2">
                        Data e hora (Brasília)
                    </label>
                    <input
                        id="social-quando"
                        name="quando"
                        type="datetime-local"
                        required
                        defaultValue={dataPadrao}
                        className="px-4 py-3 rounded-xl bg-[var(--bg-primary)] border-2 border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--primary-color)]"
                    />
                </div>
                <button
                    type="submit"
                    disabled={enviando || bloqueado}
                    className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {enviando ? "Gerando as imagens..." : rotulo}
                </button>
            </div>
            {temLinkedin && (
                <label className="flex items-center gap-3 text-sm">
                    <input type="checkbox" name="linkedin" value="sim" defaultChecked className="w-5 h-5 accent-[var(--primary-color)]" />
                    Agendar também o post do LinkedIn, no mesmo horário
                </label>
            )}
            {estado.erro && (
                <p role="alert" className="text-sm text-red-500">
                    {estado.erro}
                </p>
            )}
            {estado.ok && (
                <p role="status" className="text-sm text-emerald-500">
                    {estado.ok}
                </p>
            )}
        </form>
    );
}
