import Link from "next/link";
import { notFound } from "next/navigation";
import { PaginaInterna, ChamadaDiagnostico } from "@/components/layout/pagina-interna";
import { PROCESSO, SERVICOS, servicoPorSlug } from "@/data/servicos";
import { casoPorSlug } from "@/data/casos";

export function generateStaticParams() {
  return SERVICOS.map((servico) => ({ slug: servico.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const servico = servicoPorSlug(slug);
  if (!servico) return {};
  return {
    title: `${servico.nome} | Rugemtugem`,
    description: `${servico.resumo} Diagnóstico gratuito de 30 minutos.`,
    alternates: { canonical: `/servicos/${servico.slug}` },
  };
}

export default async function ServicoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const servico = servicoPorSlug(slug);
  if (!servico) notFound();
  const caso = casoPorSlug(servico.caso);

  return (
    <PaginaInterna
      migalhas={[{ nome: "Início", href: "/" }, { nome: "Serviços", href: "/servicos" }, { nome: servico.nome }]}
    >
      <article>
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] leading-tight mb-4">
            {servico.nome}
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">{servico.resumo}</p>
        </header>

        <div className="space-y-10 text-lg leading-relaxed text-[var(--text-secondary)]">
          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">O problema</h2>
            <p>{servico.problema}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">O que entra no serviço</h2>
            <ul className="space-y-3 list-disc pl-6">
              {servico.entregas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {caso && (
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Onde isso já funciona</h2>
              <p>
                <Link href={`/casos/${caso.slug}`} className="underline text-[var(--text-primary)]">
                  {caso.client}: {caso.titulo}
                </Link>
                . {caso.resumo}
              </p>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Como funciona</h2>
            <ol className="space-y-2 list-decimal pl-6">
              {PROCESSO.map((passo) => (
                <li key={passo}>{passo}</li>
              ))}
            </ol>
          </section>
        </div>
      </article>

      <ChamadaDiagnostico local="servico" />
    </PaginaInterna>
  );
}
