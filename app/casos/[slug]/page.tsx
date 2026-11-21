import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PaginaInterna, ChamadaDiagnostico } from "@/components/layout/pagina-interna";
import { CASOS, casoPorSlug, detalhesDoCaso } from "@/data/casos";
import { servicoPorSlug } from "@/data/servicos";

export function generateStaticParams() {
  return CASOS.map((caso) => ({ slug: caso.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caso = casoPorSlug(slug);
  if (!caso) return {};
  return {
    title: `${caso.client}: ${caso.titulo} | Caso`,
    description: caso.resumo,
    alternates: { canonical: `/casos/${caso.slug}` },
  };
}

export default async function CasoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caso = casoPorSlug(slug);
  if (!caso) notFound();
  const d = detalhesDoCaso(caso.client);
  const servico = servicoPorSlug(caso.servico);

  return (
    <PaginaInterna
      migalhas={[{ nome: "Início", href: "/" }, { nome: "Casos", href: "/casos" }, { nome: caso.client }]}
    >
      <article>
        <header className="mb-12">
          {d.logo && (
            <div className="relative h-20 w-48 mb-6 rounded-xl bg-white">
              <Image src={d.logo} alt={`Logo ${caso.client}`} fill className="object-contain p-3" sizes="192px" priority />
            </div>
          )}
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary-color)] mb-3">
            {d.industry}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] leading-tight">
            {caso.client}: {caso.titulo}
          </h1>
        </header>

        <div className="space-y-10 text-lg leading-relaxed text-[var(--text-secondary)]">
          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">O problema</h2>
            <p>{d.challenge}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">O que foi construído</h2>
            <p>{d.solution}</p>
          </section>

          {d.deliverables && d.deliverables.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Entregas</h2>
              <ul className="space-y-3">
                {d.deliverables.map((item) => (
                  <li
                    key={item.title}
                    className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4"
                  >
                    <span className="font-semibold text-[var(--text-primary)]">{item.title}.</span> {item.desc}.
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Tecnologias</h2>
            <ul className="flex flex-wrap gap-2">
              {d.tags.map((tag) => (
                <li
                  key={tag}
                  className="px-3 py-1 rounded-full border border-[var(--border-color)] text-sm text-[var(--text-primary)]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </section>

          {servico && (
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">O serviço por trás deste caso</h2>
              <p>
                <Link href={`/servicos/${servico.slug}`} className="underline text-[var(--text-primary)]">
                  {servico.nome}
                </Link>
                . {servico.resumo}
              </p>
            </section>
          )}
        </div>
      </article>

      <ChamadaDiagnostico local="caso" />
    </PaginaInterna>
  );
}
