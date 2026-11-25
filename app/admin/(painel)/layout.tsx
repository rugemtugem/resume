import Link from "next/link";
import { exigirAdmin } from "@/lib/admin/sessao";
import { acaoSair } from "./acoes";

export const metadata = { title: "Painel | Rugemtugem", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
    await exigirAdmin();

    return (
        <div className="min-h-screen">
            <header className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
                <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <span className="font-bold">Painel da Rugemtugem</span>
                        <nav className="flex items-center gap-4 text-sm">
                            <Link href="/admin" className="font-semibold text-[var(--primary-color)]">
                                Agenda do blog
                            </Link>
                            <Link href="/admin/instagram" className="font-semibold text-[var(--primary-color)]">
                                Instagram
                            </Link>
                            <Link href="/" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                                Ver o site
                            </Link>
                        </nav>
                    </div>
                    <form action={acaoSair}>
                        <button type="submit" className="px-4 py-2 rounded-lg border-2 border-[var(--border-color)] text-sm font-semibold hover:border-[var(--primary-color)]">
                            Sair
                        </button>
                    </form>
                </div>
            </header>
            <main className="max-w-6xl mx-auto px-4 md:px-8 py-10">{children}</main>
        </div>
    );
}
