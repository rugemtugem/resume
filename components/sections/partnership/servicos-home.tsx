import Link from "next/link";
import { ArrowRight, Bot, LayoutTemplate, MessageCircle, Workflow } from "lucide-react";
import { CartaoVidro, IconeGradiente, TituloDeSecao } from "@/components/layout/pagina-interna";
import { SERVICOS } from "@/data/servicos";
import { casoPorSlug } from "@/data/casos";

const ICONES = [MessageCircle, Workflow, LayoutTemplate, Bot];

/** Os quatro serviços, com link para a página de cada um. */
export function ServicosHome() {
  return (
    <section id="servicos" className="py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <TituloDeSecao rotulo="O que a Rugemtugem faz" titulo="Quatro" destaque="serviços" texto="Cada um já funciona em um cliente, com nome." />
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {SERVICOS.map((servico, indice) => {
            const caso = casoPorSlug(servico.caso);
            return (
              <li key={servico.slug}>
                <Link href={`/servicos/${servico.slug}`} className="block h-full">
                  <CartaoVidro className="!bg-[var(--bg-secondary)]/60">
                    <div className="flex items-start gap-4 mb-5">
                      <IconeGradiente icone={ICONES[indice % ICONES.length]} indice={indice} />
                      <h3 className="text-xl md:text-2xl font-bold leading-snug pt-1">{servico.nome}</h3>
                    </div>
                    <p className="text-[var(--text-secondary)] leading-relaxed mb-5">{servico.resumo}</p>
                    {caso && (
                      <p className="text-sm text-[var(--text-secondary)] mb-5">
                        Já funciona em: <span className="font-semibold text-[var(--text-primary)]">{caso.client}</span>
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 font-semibold text-[var(--primary-color)]">
                      Ver o serviço
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </CartaoVidro>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
