import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { TituloDeSecao } from "@/components/layout/pagina-interna";
import { Etiqueta } from "@/components/blog/lista-de-posts";
import { CATEGORIAS, capaDoPost, dataPorExtenso, postsPublicados } from "@/lib/blog";

/** Os três posts mais recentes. Sem post publicado, a seção não aparece. */
export function BlogHome() {
  const posts = postsPublicados().slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <TituloDeSecao rotulo="Blog da Rugemtugem" titulo="Para empresas e" destaque="dicas de IA" texto="O que muda na operação das empresas e como eu uso IA no trabalho." />
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col h-full rounded-2xl overflow-hidden bg-[var(--bg-secondary)]/60 backdrop-blur-xl border border-[var(--border-color)]/50 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-[var(--primary-color)]/40 hover:-translate-y-1 transition-all duration-300"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- miniatura gerada pela rota /blog/capa */}
                <img src={capaDoPost(post.slug)} alt="" width={1200} height={630} loading="lazy" decoding="async" className="w-full aspect-[1200/630] object-cover border-b border-[var(--border-color)]/50" />
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)] mb-3">
                    <Etiqueta categoria={post.categoria} nome={CATEGORIAS[post.categoria].nome} />
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-4 h-4" aria-hidden="true" />
                      {post.minutos} min
                    </span>
                    <span>{dataPorExtenso(post.publicadoEm)}</span>
                  </div>
                  <h3 className="text-xl font-bold leading-snug mb-3">{post.titulo}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed mb-5 flex-1">{post.descricao}</p>
                  <span className="inline-flex items-center gap-2 font-semibold text-[var(--primary-color)]">
                    Ler o post
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-center mt-10">
          <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-all">
            Ver todos os posts
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
        </p>
      </div>
    </section>
  );
}
