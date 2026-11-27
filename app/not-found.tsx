import Link from "next/link";

export const metadata = { title: "Página não encontrada | Rugemtugem", robots: { index: false, follow: true } };

const CAMINHOS = [
    { nome: "Serviços", href: "/servicos" },
    { nome: "Casos de clientes", href: "/casos" },
    { nome: "Projetos", href: "/projetos" },
    { nome: "Blog", href: "/blog" },
];

/** Página de endereço que não existe, em português e com caminhos de volta. */
export default function NaoEncontrada() {
    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-24 bg-[var(--bg-primary)] text-[var(--text-primary)]">
            <div className="max-w-xl text-center">
                <p className="text-sm font-semibold text-[var(--primary-color)] mb-3">Erro 404</p>
                <h1 className="text-3xl md:text-5xl font-bold mb-4">Esta página não existe</h1>
                <p className="text-lg text-[var(--text-secondary)] mb-8">O endereço pode ter mudado ou ter sido digitado com um erro. Estes caminhos levam ao que o site tem.</p>
                <Link href="/" className="inline-block px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">
                    Ir para a página inicial
                </Link>
                <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3">
                    {CAMINHOS.map((c) => (
                        <li key={c.href}>
                            <Link href={c.href} className="font-semibold underline underline-offset-4 hover:text-[var(--primary-color)]">
                                {c.nome}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}
