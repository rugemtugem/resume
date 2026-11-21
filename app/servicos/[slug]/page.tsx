import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowRight, Calendar, CheckCircle2, Code, FileText, Rocket, TrendingUp } from "lucide-react";
import {
  PaginaInterna,
  TopoInterno,
  Faixa,
  TituloDeSecao,
  CartaoVidro,
  IconeGradiente,
  ChamadaDiagnostico,
  BotoesDoTopo,
} from "@/components/layout/pagina-interna";
import { PROCESSO, SERVICOS, servicoPorSlug } from "@/data/servicos";
import { casoPorSlug, detalhesDoCaso } from "@/data/casos";

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

const ICONES_DO_PROCESSO = [Calendar, FileText, Code, Rocket, TrendingUp];

export default async function ServicoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const servico = servicoPorSlug(slug);
  if (!servico) notFound();
  const caso = casoPorSlug(servico.caso);
  const detalhes = caso ? detalhesDoCaso(caso.client) : undefined;
  const migalhas = [{ nome: "Início", href: "/" }, { nome: "Serviços", href: "/servicos" }, { nome: servico.nome }];

  return (
    <PaginaInterna migalhas={migalhas}>
      <TopoInterno migalhas={migalhas} selo="Serviço da Rugemtugem" titulo={servico.nome} texto={servico.resumo}>
        <BotoesDoTopo local="servico_topo" secundario={{ href: "/servicos", texto: "Ver todos os serviços" }} />
      </TopoInterno>

      <Faixa fundo="secundario">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-stretch">
          <div className="lg:col-span-2">
            <CartaoVidro>
              <IconeGradiente icone={AlertTriangle} indice={0} />
              <h2 className="text-2xl md:text-3xl font-bold mt-6 mb-3">O problema</h2>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed">{servico.problema}</p>
            </CartaoVidro>
          </div>
          <div className="lg:col-span-3">
            <CartaoVidro>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                O que entra <span className="text-gradient-neon">no serviço</span>
              </h2>
              <ul className="space-y-4">
                {servico.entregas.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-lg">
                    <CheckCircle2 className="w-6 h-6 mt-0.5 text-[var(--primary-color)] shrink-0" aria-hidden="true" />
                    <span className="text-[var(--text-primary)] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </CartaoVidro>
          </div>
        </div>
      </Faixa>

      {caso && detalhes && (
        <Faixa largura="max-w-7xl">
          <TituloDeSecao rotulo="Onde isso já funciona" titulo="Um caso" destaque="com nome" />
          <Link
            href={`/casos/${caso.slug}`}
            className="group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center rounded-3xl p-4 md:p-6 border border-transparent hover:border-[var(--primary-color)]/40 hover:bg-[var(--bg-secondary)]/60 transition-all duration-300"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-[var(--border-color)] shadow-2xl bg-white p-8 transition-transform duration-300 group-hover:scale-[1.02]">
              {detalhes.logo && (
                <div className="relative w-full h-full">
                  <Image src={detalhes.logo} alt={`Logo ${caso.client}`} fill className="object-contain" sizes="(min-width: 1024px) 560px, 100vw" />
                </div>
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h3 className="text-3xl font-bold">{caso.client}</h3>
                <span className="px-3 py-1 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-sm font-semibold">
                  {detalhes.industry}
                </span>
              </div>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">{caso.resumo}</p>
              <span className="inline-flex items-center gap-2 font-semibold text-[var(--primary-color)]">
                Ver o caso completo
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </div>
          </Link>
        </Faixa>
      )}

      <Faixa fundo="secundario">
        <TituloDeSecao rotulo="Processo transparente" titulo="Como" destaque="funciona" texto="Do primeiro contato ao sistema no ar, você sabe o que esperar." />
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {PROCESSO.map((passo, indice) => (
            <li key={passo}>
              <CartaoVidro className="!p-6">
                <IconeGradiente icone={ICONES_DO_PROCESSO[indice]} indice={indice} numero={`0${indice + 1}`} />
                <p className="mt-5 font-semibold text-[var(--text-primary)] leading-snug">{passo}</p>
              </CartaoVidro>
            </li>
          ))}
        </ol>
      </Faixa>

      <ChamadaDiagnostico local="servico" />
    </PaginaInterna>
  );
}
