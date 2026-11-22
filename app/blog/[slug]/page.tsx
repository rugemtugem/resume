import Link from "next/link";
import { notFound } from "next/navigation";
import { PaginaInterna, TopoInterno, Faixa, ChamadaDiagnostico } from "@/components/layout/pagina-interna";
import { Clock } from "lucide-react";
import { BarraDeLeitura } from "@/components/blog/barra-de-leitura";
import { Compartilhar } from "@/components/blog/compartilhar";
import { Etiqueta } from "@/components/blog/lista-de-posts";
import { CATEGORIAS, capaDoPost, dataPorExtenso, postPorSlug, postsPublicados } from "@/lib/blog";
import { leituras } from "@/lib/blog-views";

export const revalidate = 300;

export function generateStaticParams() {
  return postsPublicados().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = postPorSlug(slug);
  if (!post) return {};
  return {
    title: post.tituloSeo.length <= 47 ? `${post.tituloSeo} | Rugemtugem` : post.tituloSeo,
    description: post.descricao,
    alternates: { canonical: `/blog/${post.slug}` },
    robots: post.rascunho ? { index: false, follow: false } : undefined,
    openGraph: { type: "article", title: post.tituloSeo, description: post.descricao, url: `/blog/${post.slug}`, publishedTime: post.publicadoEm, images: [{ url: capaDoPost(post.slug), width: 1200, height: 630, alt: post.titulo }] },
    twitter: { card: "summary_large_image", title: post.tituloSeo, description: post.descricao, images: [capaDoPost(post.slug)] },
  };
}

const SITE = "https://rugemtugem.dev";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = postPorSlug(slug);
  if (!post) notFound();

  const migalhas = [{ nome: "Início", href: "/" }, { nome: "Blog", href: "/blog" }, { nome: post.titulo }];
  // "Leia também": primeiro os da mesma linha, depois os mais lidos.
  const contagem = leituras();
  const outros = postsPublicados()
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => Number(b.categoria === post.categoria) - Number(a.categoria === post.categoria) || (contagem[b.slug] || 0) - (contagem[a.slug] || 0))
    .slice(0, 4);
  const url = `${SITE}/blog/${post.slug}`;

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.titulo,
      description: post.descricao,
      datePublished: post.publicadoEm,
      image: `${SITE}${capaDoPost(post.slug)}`,
      articleSection: CATEGORIAS[post.categoria].nome,
      inLanguage: "pt-BR",
      mainEntityOfPage: `${SITE}/blog/${post.slug}`,
      author: { "@id": `${SITE}/#fabio` },
      publisher: { "@id": `${SITE}/#rugemtugem` },
    },
  ];
  if (post.perguntas.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.perguntas.map((p) => ({ "@type": "Question", name: p.pergunta, acceptedAnswer: { "@type": "Answer", text: p.resposta } })),
    });
  }

  return (
    <PaginaInterna migalhas={migalhas}>
      <BarraDeLeitura slug={post.slug} />
      <TopoInterno comCapa migalhas={migalhas} selo={CATEGORIAS[post.categoria].nome} titulo={post.titulo} texto={post.descricao}>
        <div className="flex flex-wrap items-center justify-center gap-4 text-[var(--text-secondary)]">
          <Etiqueta categoria={post.categoria} nome={CATEGORIAS[post.categoria].nome} />
          <span className="inline-flex items-center gap-2">
            <Clock className="w-4 h-4" aria-hidden="true" />
            {post.minutos} min de leitura
          </span>
          <span>{dataPorExtenso(post.publicadoEm)}</span>
        </div>
      </TopoInterno>

      <Faixa fundo="secundario" largura="max-w-7xl">
        {/* eslint-disable-next-line @next/next/no-img-element -- miniatura gerada pela rota /blog/capa */}
        <img
          src={capaDoPost(post.slug)}
          alt=""
          width={1200}
          height={630}
          fetchPriority="high"
          decoding="async"
          className="w-full max-w-5xl mx-auto aspect-[1200/630] object-cover rounded-3xl border-2 border-[var(--border-color)] shadow-2xl -mt-28 md:-mt-32 mb-12 relative z-10"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          <article className="lg:col-span-8 min-w-0" data-post-conteudo>
            {post.rascunho && (
              <p className="mb-8 rounded-xl border border-dashed border-[var(--primary-color)] p-4 text-sm text-[var(--text-primary)]">
                Rascunho: este post aparece só em localhost.
              </p>
            )}
            {post.resumo && <p className="post-resumo" dangerouslySetInnerHTML={{ __html: post.resumoHtml }} />}

            <div className="post-conteudo mt-10" dangerouslySetInnerHTML={{ __html: post.html }} />

            <div className="mt-12 pt-8 border-t border-[var(--border-color)]/60">
              <Compartilhar titulo={post.titulo} url={url} />
            </div>

            {post.perguntas.length > 0 && (
              <div className="mt-14">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  Perguntas <span className="text-gradient-neon">frequentes</span>
                </h2>
                <div className="space-y-4">
                  {post.perguntas.map((p) => (
                    <details key={p.pergunta} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)]/60 p-5">
                      <summary className="cursor-pointer font-semibold text-[var(--text-primary)]">{p.pergunta}</summary>
                      <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">{p.resposta}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </article>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 space-y-6">
              {post.indice.length > 1 && (
                <div role="navigation" aria-label="Navegue por seção" className="rounded-2xl border border-[var(--border-color)]/50 bg-[var(--bg-primary)]/60 backdrop-blur-xl p-6">
                  <h2 className="text-sm font-semibold text-[var(--primary-color)] uppercase tracking-wider mb-4">Navegue por seção</h2>
                  <ol className="space-y-3 text-[var(--text-secondary)]">
                    {post.indice.map((item, i) => (
                      <li key={item.id} className="flex gap-3">
                        <span className="font-bold text-[var(--text-primary)]">{i + 1}.</span>
                        <a href={`#${item.id}`} className="hover:text-[var(--primary-color)] transition-colors">
                          {item.texto}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {outros.length > 0 && (
                <div className="rounded-2xl border border-[var(--border-color)]/50 bg-[var(--bg-primary)]/60 backdrop-blur-xl p-6">
                  <h2 className="text-sm font-semibold text-[var(--primary-color)] uppercase tracking-wider mb-4">Leia também</h2>
                  <ul className="divide-y divide-[var(--border-color)]/60">
                    {outros.map((outro) => (
                      <li key={outro.slug}>
                        <Link href={`/blog/${outro.slug}`} className="block py-3 group">
                          <span className="block font-semibold leading-snug group-hover:text-[var(--primary-color)] transition-colors">{outro.titulo}</span>
                          <span className="block text-sm text-[var(--text-secondary)] mt-1">{outro.minutos} min de leitura</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-2xl p-6 text-white bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] shadow-xl">
                <h2 className="text-xl font-bold mb-2">Diagnóstico gratuito de 30 minutos</h2>
                <p className="text-white/90 mb-5">Conte como o processo funciona hoje e veja o que dá para ligar.</p>
                <Link href="/#contact" data-cta="post_lateral" data-cta-destino="contato" className="inline-flex items-center justify-center w-full px-5 py-3 rounded-xl font-semibold bg-white text-[#992A2B] hover:bg-white/90 transition-colors">
                  Pedir o diagnóstico
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Faixa>

      <ChamadaDiagnostico local="post" />
      {jsonLd.map((bloco, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bloco) }} />
      ))}
    </PaginaInterna>
  );
}
