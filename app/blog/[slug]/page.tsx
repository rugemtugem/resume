import Link from "next/link";
import { notFound } from "next/navigation";
import { PaginaInterna, TopoInterno, Faixa, CartaoVidro, ChamadaDiagnostico } from "@/components/layout/pagina-interna";
import { CATEGORIAS, dataPorExtenso, postPorSlug, postsPublicados } from "@/lib/blog";

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
    openGraph: { type: "article", title: post.tituloSeo, description: post.descricao, url: `/blog/${post.slug}`, publishedTime: post.publicadoEm },
  };
}

const SITE = "https://rugemtugem.dev";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = postPorSlug(slug);
  if (!post) notFound();

  const migalhas = [{ nome: "Início", href: "/" }, { nome: "Blog", href: "/blog" }, { nome: post.titulo }];
  const outros = postsPublicados().filter((p) => p.slug !== post.slug).slice(0, 3);

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.titulo,
      description: post.descricao,
      datePublished: post.publicadoEm,
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
      <TopoInterno
        migalhas={migalhas}
        selo={`${CATEGORIAS[post.categoria].nome}, ${dataPorExtenso(post.publicadoEm)}, ${post.minutos} min de leitura`}
        titulo={post.titulo}
        texto={post.descricao}
      />

      <Faixa fundo="secundario" largura="max-w-3xl">
        {post.rascunho && (
          <p className="mb-8 rounded-xl border border-dashed border-[var(--primary-color)] p-4 text-sm text-[var(--text-primary)]">
            Rascunho: este post aparece só em localhost.
          </p>
        )}
        {post.resumo && <p className="post-resumo" dangerouslySetInnerHTML={{ __html: post.resumoHtml }} />}

        {post.indice.length > 1 && (
          <div role="navigation" aria-label="Neste post" className="my-10 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/60 p-6">
            <p className="text-sm font-semibold text-[var(--primary-color)] uppercase tracking-wider mb-3">Neste post</p>
            <ol className="space-y-2 list-decimal pl-5 text-[var(--text-secondary)]">
              {post.indice.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="hover:text-[var(--primary-color)] transition-colors">
                    {item.texto}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="post-conteudo" dangerouslySetInnerHTML={{ __html: post.html }} />

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
      </Faixa>

      {outros.length > 0 && (
        <Faixa>
          <CartaoVidro>
            <p className="text-sm font-semibold text-[var(--primary-color)] uppercase tracking-wider mb-4">Leia também</p>
            <ul className="divide-y divide-[var(--border-color)]/60">
              {outros.map((outro) => (
                <li key={outro.slug}>
                  <Link href={`/blog/${outro.slug}`} className="block py-4 font-semibold hover:text-[var(--primary-color)] transition-colors">
                    {outro.titulo}
                  </Link>
                </li>
              ))}
            </ul>
          </CartaoVidro>
        </Faixa>
      )}

      <ChamadaDiagnostico local="post" />
      {jsonLd.map((bloco, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bloco) }} />
      ))}
    </PaginaInterna>
  );
}
