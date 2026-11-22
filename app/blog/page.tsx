import Link from "next/link";
import { ArrowRight, Bot, Building2 } from "lucide-react";
import { PaginaInterna, TopoInterno, Faixa, TituloDeSecao, CartaoVidro, IconeGradiente, ChamadaDiagnostico } from "@/components/layout/pagina-interna";
import { CATEGORIAS, dataPorExtenso, postsPublicados } from "@/lib/blog";
import type { CategoriaId } from "@/lib/blog";

export const revalidate = 300;

export const metadata = {
  title: "Blog de integração de sistemas e dicas de IA | Rugemtugem",
  description:
    "Casos reais e explicações diretas sobre ligar site, WhatsApp e sistemas da empresa, e dicas de quem usa IA para construir sistemas de verdade.",
  alternates: { canonical: "/blog", types: { "application/rss+xml": "/blog/rss.xml" } },
};

const MIGALHAS = [{ nome: "Início", href: "/" }, { nome: "Blog" }];
const ICONES = { empresas: Building2, ia: Bot };

export default function BlogPage() {
  const posts = postsPublicados();
  const ordem: CategoriaId[] = ["empresas", "ia"];

  return (
    <PaginaInterna migalhas={MIGALHAS}>
      <TopoInterno
        migalhas={MIGALHAS}
        selo="Blog da Rugemtugem"
        titulo="O que eu aprendo"
        destaque="construindo sistemas"
        texto="Duas linhas de conteúdo: o que muda na operação das empresas e como eu uso IA no trabalho."
      />

      {ordem.map((id, indice) => {
        const daCategoria = posts.filter((post) => post.categoria === id);
        const [titulo, ...resto] = CATEGORIAS[id].nome.split(" ");
        return (
          <Faixa key={id} fundo={indice % 2 === 0 ? "secundario" : "primario"}>
            <TituloDeSecao rotulo={`${daCategoria.length} ${daCategoria.length === 1 ? "post" : "posts"}`} titulo={titulo} destaque={resto.join(" ")} texto={CATEGORIAS[id].texto} />
            {daCategoria.length === 0 ? (
              <p className="text-center text-[var(--text-secondary)]">Os primeiros posts desta linha estão sendo escritos.</p>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {daCategoria.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="block h-full">
                      <CartaoVidro>
                        <div className="flex items-start gap-4 mb-5">
                          <IconeGradiente icone={ICONES[id]} indice={indice} />
                          <div>
                            <p className="text-sm text-[var(--text-secondary)] mb-1">
                              {dataPorExtenso(post.publicadoEm)}, {post.minutos} min de leitura
                            </p>
                            <h3 className="text-xl md:text-2xl font-bold leading-snug">{post.titulo}</h3>
                          </div>
                        </div>
                        <p className="text-[var(--text-secondary)] leading-relaxed mb-5">{post.descricao}</p>
                        <span className="inline-flex items-center gap-2 font-semibold text-[var(--primary-color)]">
                          Ler o post
                          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </span>
                      </CartaoVidro>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Faixa>
        );
      })}

      <ChamadaDiagnostico local="blog" />
    </PaginaInterna>
  );
}
