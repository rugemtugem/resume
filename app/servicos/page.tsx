import Link from "next/link";
import { ArrowRight, Bot, LayoutTemplate, MessageCircle, Workflow } from "lucide-react";
import { PaginaInterna, TopoInterno, Faixa, CartaoVidro, IconeGradiente, ChamadaDiagnostico } from "@/components/layout/pagina-interna";
import { SERVICOS } from "@/data/servicos";
import { casoPorSlug } from "@/data/casos";

export const metadata = {
  title: "Serviços de integração e soluções em IA | Rugemtugem",
  description:
    "Integração de WhatsApp com sistema de gestão, site com CRM e pagamento, WordPress sob medida e soluções em IA para a operação. Comece pelo diagnóstico gratuito.",
  alternates: { canonical: "/servicos" },
};

const MIGALHAS = [{ nome: "Início", href: "/" }, { nome: "Serviços" }];
const ICONES = [MessageCircle, Workflow, LayoutTemplate, Bot];

export default function ServicosPage() {
  return (
    <PaginaInterna migalhas={MIGALHAS}>
      <TopoInterno
        migalhas={MIGALHAS}
        selo="Rugemtugem: integração de sistemas e soluções em IA"
        titulo="O trabalho manual some quando"
        destaque="os sistemas conversam"
        texto="Conecto o site e os sistemas da sua empresa para o trabalho manual sumir e nenhum lead se perder."
      />

      <Faixa fundo="secundario">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {SERVICOS.map((servico, indice) => {
            const caso = casoPorSlug(servico.caso);
            return (
              <li key={servico.slug}>
                <Link href={`/servicos/${servico.slug}`} className="block h-full">
                  <CartaoVidro>
                    <div className="flex items-start gap-4 mb-5">
                      <IconeGradiente icone={ICONES[indice % ICONES.length]} indice={indice} />
                      <h2 className="text-xl md:text-2xl font-bold leading-snug pt-1">{servico.nome}</h2>
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
      </Faixa>

      <ChamadaDiagnostico local="servicos" />
    </PaginaInterna>
  );
}
