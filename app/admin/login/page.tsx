import { redirect } from "next/navigation";
import { adminConfigurado, adminLogado } from "@/lib/admin/sessao";
import { FormularioDeLogin } from "./formulario";

export const metadata = { title: "Painel | Rugemtugem", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
    if (await adminLogado()) redirect("/admin");

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-8">
                <h1 className="text-2xl font-bold mb-1">Painel da Rugemtugem</h1>
                <p className="text-sm text-[var(--text-secondary)] mb-6">Agenda de publicações do blog.</p>
                {adminConfigurado() ? (
                    <FormularioDeLogin />
                ) : (
                    <p className="text-sm text-[var(--text-secondary)]">
                        O painel não está configurado neste servidor. Faltam as variáveis ADMIN_SENHA_HASH e ADMIN_SESSAO_SEGREDO.
                    </p>
                )}
            </div>
        </main>
    );
}
