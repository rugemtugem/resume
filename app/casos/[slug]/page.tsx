import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowRight, CheckCircle2, Wrench } from "lucide-react";
import {
  PaginaInterna,
  TopoInterno,
  Faixa,
  TituloDeSecao,
  CartaoVidro,
  IconeGradiente,
  ChamadaDiagnostico,
  BotoesDoTopo,
  FraseComFonte,
} from "@/components/layout/pagina-interna";
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
  const outros = CASOS.filter((c) => c.slug !== caso.slug);
  const migalhas = [{ nome: "Início", href: "/" }, { nome: "Casos", href: "/casos" }, { nome: caso.client }];

  return (
    <PaginaInterna migalhas={migalhas}>
      <TopoInterno migalhas={migalhas} selo={`Caso de cliente: ${d.industry}`} titulo={`${caso.client}:`} destaque={caso.titulo} texto={caso.resumo}>
        <BotoesDoTopo local="caso_topo" secundario={{ href: "/casos", texto: "Ver todos os casos" }} />
      </TopoInterno>

      <Faixa fundo="secundario">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-[var(--border-color)] shadow-2xl bg-white p-8">
            {d.logo && (
              <div className="relative w-full h-full">
                <Image src={d.logo} alt={`Logo ${caso.client}`} fill className="object-contain" sizes="(min-width: 1024px) 560px, 100vw" priority />
              </div>
            )}
          </div>

          <div className="space-y-6">
            {caso.referencia && <FraseComFonte partes={caso.referencia} className="text-lg text-[var(--text-secondary)] leading-relaxed" />}
            <CartaoVidro>
              <div className="flex items-start gap-4">
                <IconeGradiente icone={AlertTriangle} indice={0} />
                <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-2">O problema</h2>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{d.challenge}</p>
                </div>
              </div>
            </CartaoVidro>
            <CartaoVidro>
              <div className="flex items-start gap-4">
                <IconeGradiente icone={Wrench} indice={1} />
                <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-2">O que foi construído</h2>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{d.solution}</p>
                </div>
              </div>
            </CartaoVidro>
          </div>
        </div>
      </Faixa>

      <Faixa>
        <TituloDeSecao rotulo="O que foi entregue" titulo="Entregas e" destaque="tecnologias" />
        {d.deliverables && d.deliverables.length > 0 && (
          <ul className={`grid grid-cols-1 ${d.deliverables.length > 1 ? "md:grid-cols-2" : "max-w-2xl mx-auto"} gap-6 mb-10`}>
            {d.deliverables.map((item) => (
              <li key={item.title}>
                <div className="h-full flex items-start gap-3 p-5 rounded-xl bg-[var(--bg-secondary)] border border-dashed border-[var(--border-color)]">
                  <CheckCircle2 className="w-5 h-5 mt-1 text-[var(--primary-color)] shrink-0" aria-hidden="true" />
                  <p className="leading-relaxed">
                    <span className="font-bold text-[var(--text-primary)]">{item.title}.</span>{" "}
                    <span className="text-[var(--text-secondary)]">{item.desc}.</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <ul className="flex flex-wrap justify-center gap-3">
          {d.tags.map((tag) => (
            <li key={tag} className="px-4 py-2 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-sm font-semibold">
              {tag}
            </li>
          ))}
        </ul>
      </Faixa>

      <Faixa fundo="secundario">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {servico && (
            <Link href={`/servicos/${servico.slug}`} className="lg:col-span-1 block">
              <CartaoVidro>
                <p className="text-sm font-semibold text-[var(--primary-color)] uppercase tracking-wider mb-3">O serviço por trás deste caso</p>
                <h2 className="text-xl md:text-2xl font-bold mb-3">{servico.nome}</h2>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-5">{servico.resumo}</p>
                <span className="inline-flex items-center gap-2 font-semibold text-[var(--primary-color)]">
                  Ver o serviço
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </CartaoVidro>
            </Link>
          )}
          <div className="lg:col-span-2">
            <CartaoVidro>
              <p className="text-sm font-semibold text-[var(--primary-color)] uppercase tracking-wider mb-4">Outros casos</p>
              <ul className="divide-y divide-[var(--border-color)]/60">
                {outros.map((outro) => (
                  <li key={outro.slug}>
                    <Link href={`/casos/${outro.slug}`} className="flex items-center justify-between gap-4 py-4 hover:text-[var(--primary-color)] transition-colors">
                      <span>
                        <span className="font-bold">{outro.client}:</span>{" "}
                        <span className="text-[var(--text-secondary)]">{outro.titulo}</span>
                      </span>
                      <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </CartaoVidro>
          </div>
        </div>
      </Faixa>

      <ChamadaDiagnostico local="caso" />
    </PaginaInterna>
  );
}
