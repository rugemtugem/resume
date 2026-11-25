import Link from "next/link";
import { EscolhaDeCookies } from "@/components/cookie-banner";

export const metadata = {
  title: "Política de privacidade | Rugemtugem",
  description:
    "Quais dados a Rugemtugem recebe pelo site rugemtugem.dev, para que usa, com quem compartilha e como você pede a exclusão.",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen px-4 md:px-8 py-16">
      <article className="max-w-3xl mx-auto space-y-8 text-[var(--text-secondary)] leading-relaxed">
        <p>
          <Link href="/" className="underline text-[var(--text-primary)]">
            Voltar ao início
          </Link>
        </p>

        <header className="space-y-3">
          <h1 className="text-4xl font-bold text-[var(--text-primary)]">Política de privacidade</h1>
          <p>Última atualização: 21 de novembro de 2026.</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Quem cuida dos seus dados</h2>
          <p>
            Este site é da Rugemtugem, de Fábio Rugemtugem, em São Paulo. Para qualquer assunto sobre os seus
            dados, escreva para contato@rugemtugem.dev.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">O que você envia pelo formulário</h2>
          <p>
            Quando você preenche o formulário de contato, recebemos o seu nome, o seu e-mail, o seu WhatsApp (se
            você informar), a sua mensagem e a resposta à pergunta sobre como você conheceu a Rugemtugem.
          </p>
          <p>
            Usamos esses dados para responder ao seu contato e dar continuidade ao atendimento. Eles chegam por
            e-mail à caixa da Rugemtugem. Não vendemos nem repassamos esses dados a terceiros.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">O que medimos, se você aceitar</h2>
          <p>
            Se você aceitar no aviso de cookies, o site liga o Google Analytics. Ele registra as páginas
            visitadas, de onde veio a visita, o tipo de aparelho e os cliques nos botões de contato (WhatsApp,
            e-mail, envio do formulário e botões de chamada).
          </p>
          <p>
            O seu nome, o seu e-mail, o seu telefone e o texto da sua mensagem não são enviados ao Google
            Analytics. Se você recusar, o Google Analytics não é carregado.
          </p>
          <p>A sua escolha fica guardada só no seu navegador. Você pode trocar quando quiser:</p>
          <EscolhaDeCookies />
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Outros dados guardados no navegador</h2>
          <p>O site guarda no seu navegador a preferência de tema claro ou escuro. Esse dado não sai do seu aparelho.</p>
          <p>
            O blog conta quantas vezes cada post foi aberto, para montar a lista de mais lidos. Fica guardado só o
            número por post e por dia, sem nenhum dado de quem leu.
          </p>
          <p>
            O site também conta, só em números, quantos pedidos de contato chegaram por dia (com a opção marcada em
            &quot;como nos conheceu&quot;) e quantos cliques vieram do link dos stories do Instagram. Essas contagens
            não guardam nome, e-mail, endereço de IP nem nada que identifique você.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Os seus direitos</h2>
          <p>
            Pela Lei Geral de Proteção de Dados (LGPD), você pode pedir para ver, corrigir ou excluir os dados que
            enviou, e pode retirar o seu aceite da medição a qualquer momento. Basta escrever para
            contato@rugemtugem.dev.
          </p>
        </section>
      </article>
    </main>
  );
}
