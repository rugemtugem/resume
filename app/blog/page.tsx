import Link from "next/link";
import { ArrowRight, Clock, Flame, Star } from "lucide-react";
import { PaginaInterna, TopoInterno, Faixa, TituloDeSecao, ChamadaDiagnostico } from "@/components/layout/pagina-interna";
import { ListaDePosts, Etiqueta } from "@/components/blog/lista-de-posts";
import type { PostDaLista } from "@/components/blog/lista-de-posts";
import { CATEGORIAS, capaDoPost, dataPorExtenso, postsPublicados } from "@/lib/blog";
import { leituras } from "@/lib/blog-views";

export const revalidate = 300;

export const metadata = {
  title: "Blog de integração de sistemas e dicas de IA | Rugemtugem",
  description:
    "Casos reais e explicações diretas sobre ligar site, WhatsApp e sistemas da empresa, e dicas de quem usa IA para construir sistemas de verdade.",
  alternates: { canonical: "/blog", types: { "application/rss+xml": "/blog/rss.xml" } },
};

const MIGALHAS = [{ nome: "Início", href: "/" }, { nome: "Blog" }];

export default function BlogPage() {
  const contagem = leituras();
  const posts: PostDaLista[] = postsPublicados().map((post) => ({
    slug: post.slug,
    titulo: post.titulo,
    descricao: post.descricao,
    categoria: post.categoria,
    categoriaNome: CATEGORIAS[post.categoria].nome,
    minutos: post.minutos,
    publicadoEm: post.publicadoEm,
    dataTexto: dataPorExtenso(post.publicadoEm),
    leituras: contagem[post.slug] || 0,
    capa: capaDoPost(post.slug),
  }));

  // Vitrine: o post mais novo. Ao lado, os mais lidos pelo contador próprio; sem leituras ainda, os recomendados.
  const vitrine = posts[0];
  const resto = posts.slice(1);
  const temLeituras = resto.some((post) => post.leituras > 0);
  const recomendados = new Set(postsPublicados().filter((post) => post.destaque).map((post) => post.slug));
  const lateral = temLeituras
    ? [...resto].sort((a, b) => b.leituras - a.leituras).slice(0, 5)
    : [...resto].sort((a, b) => Number(recomendados.has(b.slug)) - Number(recomendados.has(a.slug))).slice(0, 5);

  return (
    <PaginaInterna migalhas={MIGALHAS}>
      <TopoInterno
        migalhas={MIGALHAS}
        selo="Blog da Rugemtugem"
        titulo="O que eu aprendo"
        destaque="construindo sistemas"
        texto="Duas linhas de conteúdo: o que muda na operação das empresas e como eu uso IA no trabalho."
      />

      {vitrine ? (
        <>
          <Faixa fundo="secundario" largura="max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
              <Link
                href={`/blog/${vitrine.slug}`}
                className="group lg:col-span-2 flex flex-col rounded-3xl overflow-hidden bg-[var(--bg-primary)]/60 backdrop-blur-xl border border-[var(--border-color)]/50 shadow-2xl hover:border-[var(--primary-color)]/40 transition-all duration-300"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- miniatura gerada pela rota /blog/capa */}
                <img src={vitrine.capa} alt="" width={1200} height={630} fetchPriority="high" decoding="async" className="w-full aspect-[1200/630] object-cover" />
                <div className="p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)] mb-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">
                      <Star className="w-3.5 h-3.5" aria-hidden="true" />
                      Mais recente
                    </span>
                    <Etiqueta categoria={vitrine.categoria} nome={vitrine.categoriaNome} />
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-4 h-4" aria-hidden="true" />
                      {vitrine.minutos} min de leitura
                    </span>
                    <span>{vitrine.dataTexto}</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-4">{vitrine.titulo}</h2>
                  <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-6">{vitrine.descricao}</p>
                  <span className="inline-flex items-center gap-2 font-semibold text-[var(--primary-color)]">
                    Ler o post
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </Link>

              <aside className="rounded-3xl p-6 md:p-8 bg-[var(--bg-primary)]/60 backdrop-blur-xl border border-[var(--border-color)]/50">
                <h2 className="flex items-center gap-2 text-xl font-bold mb-6">
                  <Flame className="w-5 h-5 text-[var(--primary-color)]" aria-hidden="true" />
                  {temLeituras ? "Mais lidos" : "Recomendados"}
                </h2>
                {lateral.length === 0 ? (
                  <p className="text-[var(--text-secondary)]">Os próximos posts aparecem aqui.</p>
                ) : (
                  <ol className="space-y-5">
                    {lateral.map((post, indice) => (
                      <li key={post.slug}>
                        <Link href={`/blog/${post.slug}`} className="group flex gap-4">
                          <span className="text-3xl font-black leading-none text-gradient-neon w-8 shrink-0">{indice + 1}</span>
                          <span>
                            <span className="block font-semibold leading-snug group-hover:text-[var(--primary-color)] transition-colors">{post.titulo}</span>
                            <span className="block text-sm text-[var(--text-secondary)] mt-1">
                              {post.categoriaNome}, {post.minutos} min de leitura
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                )}
              </aside>
            </div>
          </Faixa>

          <Faixa largura="max-w-7xl">
            <TituloDeSecao rotulo={`${posts.length} ${posts.length === 1 ? "post" : "posts"}`} titulo="Todos os" destaque="posts" texto="Busque por assunto, filtre pela linha ou ordene pelos mais lidos." />
            <ListaDePosts posts={posts} />
          </Faixa>
        </>
      ) : (
        <Faixa fundo="secundario">
          <p className="text-center text-xl text-[var(--text-secondary)]">Os primeiros posts estão sendo escritos.</p>
        </Faixa>
      )}

      <ChamadaDiagnostico local="blog" />
    </PaginaInterna>
  );
}
