import Link from "next/link";
import { PaginaInterna, ChamadaDiagnostico } from "@/components/layout/pagina-interna";
import { SERVICOS } from "@/data/servicos";

export const metadata = {
  title: "Serviços de integração e soluções em IA | Rugemtugem",
  description:
    "Integração de WhatsApp com sistema de gestão, site com CRM e pagamento, WordPress sob medida e soluções em IA para a operação. Comece pelo diagnóstico gratuito.",
  alternates: { canonical: "/servicos" },
};

export default function ServicosPage() {
  return (
    <PaginaInterna migalhas={[{ nome: "Início", href: "/" }, { nome: "Serviços" }]}>
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">Serviços</h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl">
          A Rugemtugem conecta o site e os sistemas da sua empresa para o trabalho manual sumir e nenhum lead se
          perder.
        </p>
      </header>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SERVICOS.map((servico) => (
          <li key={servico.slug}>
            <Link
              href={`/servicos/${servico.slug}`}
              className="block h-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6 hover:border-[var(--primary-color)] transition-colors"
            >
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">{servico.nome}</h2>
              <p className="text-[var(--text-secondary)]">{servico.resumo}</p>
            </Link>
          </li>
        ))}
      </ul>

      <ChamadaDiagnostico local="servicos" />
    </PaginaInterna>
  );
}
