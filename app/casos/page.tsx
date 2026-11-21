import Link from "next/link";
import Image from "next/image";
import { PaginaInterna, ChamadaDiagnostico } from "@/components/layout/pagina-interna";
import { CASOS, detalhesDoCaso } from "@/data/casos";

export const metadata = {
  title: "Casos de integração e soluções em IA | Rugemtugem",
  description:
    "Pedido do WhatsApp no sistema de gestão, site ligado ao CRM, inscrições e certificados automáticos e diagnóstico com IA. Veja o problema e o que foi construído em cada caso.",
  alternates: { canonical: "/casos" },
};

export default function CasosPage() {
  return (
    <PaginaInterna migalhas={[{ nome: "Início", href: "/" }, { nome: "Casos" }]}>
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">Casos</h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl">
          Quatro clientes, com nome. Em cada um, o problema que existia e o que a Rugemtugem construiu.
        </p>
      </header>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CASOS.map((caso) => {
          const d = detalhesDoCaso(caso.client);
          return (
            <li key={caso.slug}>
              <Link
                href={`/casos/${caso.slug}`}
                className="block h-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6 hover:border-[var(--primary-color)] transition-colors"
              >
                {d.logo && (
                  <div className="relative h-16 w-40 mb-5 rounded-lg bg-white p-2">
                    <Image src={d.logo} alt="" fill className="object-contain p-2" sizes="160px" />
                  </div>
                )}
                <p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary-color)] mb-2">
                  {d.industry}
                </p>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                  {caso.client}: {caso.titulo}
                </h2>
                <p className="text-[var(--text-secondary)]">{caso.resumo}</p>
              </Link>
            </li>
          );
        })}
      </ul>

      <ChamadaDiagnostico local="casos" />
    </PaginaInterna>
  );
}
