import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PaginaInterna, TopoInterno, Faixa, ChamadaDiagnostico } from "@/components/layout/pagina-interna";
import { CASOS, detalhesDoCaso } from "@/data/casos";

export const metadata = {
  title: "Casos de integração e soluções em IA | Rugemtugem",
  description:
    "Pedido do WhatsApp no sistema de gestão, site ligado ao CRM, inscrições e certificados automáticos e diagnóstico com IA. Veja o problema e o que foi construído em cada caso.",
  alternates: { canonical: "/casos" },
};

const MIGALHAS = [{ nome: "Início", href: "/" }, { nome: "Casos" }];

export default function CasosPage() {
  return (
    <PaginaInterna migalhas={MIGALHAS}>
      <TopoInterno
        migalhas={MIGALHAS}
        selo="Quatro clientes, com nome"
        titulo="O que mudou em"
        destaque="cada empresa"
        texto="Em cada caso, o problema que existia e o que a Rugemtugem construiu para resolver."
      />

      <Faixa fundo="secundario" largura="max-w-7xl">
        <ul className="space-y-10">
          {CASOS.map((caso, indice) => {
            const d = detalhesDoCaso(caso.client);
            return (
              <li key={caso.slug}>
                <Link
                  href={`/casos/${caso.slug}`}
                  className="group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center rounded-3xl p-4 md:p-6 border border-transparent hover:border-[var(--primary-color)]/40 hover:bg-[var(--bg-primary)]/40 transition-all duration-300"
                >
                  <div className={indice % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-[var(--border-color)] shadow-2xl bg-white p-8 transition-transform duration-300 group-hover:scale-[1.02]">
                      {d.logo && (
                        <div className="relative w-full h-full">
                          <Image src={d.logo} alt={`Logo ${caso.client}`} fill className="object-contain" sizes="(min-width: 1024px) 560px, 100vw" priority={indice === 0} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={indice % 2 === 1 ? "lg:order-1" : ""}>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h2 className="text-3xl font-bold">{caso.client}</h2>
                      <span className="px-3 py-1 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-sm font-semibold">
                        {d.industry}
                      </span>
                    </div>
                    <p className="text-xl font-semibold text-[var(--text-primary)] mb-3 first-letter:uppercase">{caso.titulo}</p>
                    <p className="text-[var(--text-secondary)] leading-relaxed mb-6">{caso.resumo}</p>
                    <span className="inline-flex items-center gap-2 font-semibold text-[var(--primary-color)]">
                      Ver o caso completo
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="text-center mt-12">
          <Link href="/projetos" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 border-[var(--border-color)] hover:bg-[var(--bg-primary)] transition-all">
            Ver sites de clientes e projetos próprios
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
        </p>
      </Faixa>

      <ChamadaDiagnostico local="casos" />
    </PaginaInterna>
  );
}
