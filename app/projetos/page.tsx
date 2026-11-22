import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PaginaInterna, TopoInterno, Faixa, TituloDeSecao, CartaoVidro, ChamadaDiagnostico } from "@/components/layout/pagina-interna";
import { CASOS, detalhesDoCaso } from "@/data/casos";
import { PASSAGENS, PROJETOS_PROPRIOS, SITES_NO_AR } from "@/data/projetos";

export const metadata = {
  title: "Projetos: sites, integrações e produtos | Rugemtugem",
  description:
    "Os trabalhos da Rugemtugem: casos de integração e IA, sites e lojas de clientes que estão no ar e produtos próprios como o Calcula Trabalhador.",
  alternates: { canonical: "/projetos" },
};

const MIGALHAS = [{ nome: "Início", href: "/" }, { nome: "Projetos" }];
const cartao =
  "group flex flex-col h-full rounded-2xl overflow-hidden bg-[var(--bg-primary)]/60 backdrop-blur-xl border border-[var(--border-color)]/50 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-[var(--primary-color)]/40 hover:-translate-y-1 transition-all duration-300";

export default function ProjetosPage() {
  return (
    <PaginaInterna migalhas={MIGALHAS}>
      <TopoInterno
        migalhas={MIGALHAS}
        selo="Rugemtugem, desde novembro de 2000"
        titulo="O que eu já"
        destaque="coloquei no ar"
        texto="Integrações e sistemas com IA, sites e lojas de clientes, e produtos que eu mesmo criei e mantenho."
      />

      <Faixa fundo="secundario" largura="max-w-7xl">
        <TituloDeSecao rotulo="Integrações e IA" titulo="Casos com" destaque="história completa" texto="O problema que existia e o que foi construído em cada cliente." />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CASOS.map((caso) => {
            const d = detalhesDoCaso(caso.client);
            return (
              <li key={caso.slug}>
                <Link href={`/casos/${caso.slug}`} className={cartao}>
                  <div className="relative aspect-video bg-white border-b border-[var(--border-color)]/50">
                    {d.logo && <Image src={d.logo} alt={`Logo ${caso.client}`} fill className="object-contain p-6" sizes="(min-width: 1024px) 300px, 50vw" />}
                  </div>
                  <div className="flex flex-col flex-1 p-6">
                    <span className="self-start px-3 py-1 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-xs font-semibold mb-3">{d.industry}</span>
                    <h3 className="text-xl font-bold mb-2">{caso.client}</h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed mb-5 flex-1 first-letter:uppercase">{caso.titulo}</p>
                    <span className="inline-flex items-center gap-2 font-semibold text-[var(--primary-color)]">
                      Ver o caso
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Faixa>

      <Faixa largura="max-w-7xl">
        <TituloDeSecao rotulo="Sites e lojas de clientes" titulo="Sites que estão" destaque="no ar" texto="Feitos em WordPress pela Rugemtugem. Cada cartão abre o site do cliente." />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {SITES_NO_AR.map((site) => (
            <li key={site.url}>
              <a href={site.url} target="_blank" rel="noopener noreferrer" className={cartao.replace("bg-[var(--bg-primary)]/60", "bg-[var(--bg-secondary)]/60")}>
                <div className="relative aspect-[16/10] border-b border-[var(--border-color)]/50 overflow-hidden">
                  <Image src={site.imagem} alt={`Tela inicial do site ${site.nome}`} fill className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" sizes="(min-width: 1024px) 400px, 100vw" />
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <span className="self-start px-3 py-1 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-xs font-semibold mb-3">{site.segmento}</span>
                  <h3 className="text-xl font-bold mb-2">{site.nome}</h3>
                  <p className="text-[var(--text-secondary)] mb-5 flex-1">{site.tipo}</p>
                  <span className="inline-flex items-center gap-2 font-semibold text-[var(--primary-color)]">
                    Abrir o site
                    <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </Faixa>

      <Faixa fundo="secundario" largura="max-w-7xl">
        <TituloDeSecao rotulo="Produtos da Rugemtugem" titulo="Projetos" destaque="próprios" texto="O que eu criei, publiquei e mantenho por conta própria." />
        <ul className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {PROJETOS_PROPRIOS.map((projeto) => (
            <li key={projeto.url}>
              <a href={projeto.url} target="_blank" rel="noopener noreferrer" className={cartao}>
                <div className="relative aspect-[16/10] border-b border-[var(--border-color)]/50 overflow-hidden">
                  <Image src={projeto.imagem} alt={`Tela inicial do ${projeto.nome}`} fill className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" sizes="(min-width: 1024px) 400px, 100vw" />
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <span className="self-start px-3 py-1 rounded-full bg-[var(--secondary-color)]/15 text-[var(--secondary-color)] text-xs font-semibold mb-3">{projeto.area}</span>
                  <h3 className="text-xl font-bold mb-2">{projeto.nome}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed mb-4 flex-1">{projeto.texto}</p>
                  {projeto.fato && <p className="text-sm font-semibold text-[var(--text-primary)] mb-5">{projeto.fato}</p>}
                  <span className="inline-flex items-center gap-2 font-semibold text-[var(--primary-color)]">
                    Abrir o projeto
                    <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </Faixa>

      <Faixa>
        <TituloDeSecao rotulo="Dentro de empresas" titulo="Onde eu também" destaque="trabalhei" />
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PASSAGENS.map((p) => (
            <li key={p.empresa}>
              <CartaoVidro className="!bg-[var(--bg-secondary)]/60">
                <p className="text-sm text-[var(--text-secondary)] mb-2">{p.periodo}</p>
                <h3 className="text-xl font-bold mb-1">{p.empresa}</h3>
                <p className="text-sm font-semibold text-[var(--primary-color)] mb-3">{p.area}</p>
                <p className="text-[var(--text-secondary)] leading-relaxed">{p.texto}</p>
              </CartaoVidro>
            </li>
          ))}
        </ul>
      </Faixa>

      <ChamadaDiagnostico local="projetos" />
    </PaginaInterna>
  );
}
