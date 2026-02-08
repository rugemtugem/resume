# 🚀 Portfolio v3 — Fábio Soares (Ferrugem)

> **Tech Lead em Front-end & Produtos Digitais | Especialista em Tecnologia & IA Aplicada**

Portfolio profissional SPA construído com **Next.js 16**, **React 19**, **TypeScript 5** e **Tailwind CSS**. Design premium com glassmorphism, micro-animações, tema claro/escuro e internacionalização (PT/EN).

🔗 **Live:** [rugemtugem.dev](https://rugemtugem.dev)

---

## ✨ Features

| Feature | Tecnologia |
|---------|-----------|
| ⚡ SPA com Turbopack | Next.js 16 |
| 🎨 Design Premium (glassmorphism, gradients) | Tailwind CSS 3.4 |
| 🌗 Tema Claro / Escuro | CSS Custom Properties |
| 🌍 Internacionalização PT / EN | Context API |
| 🎬 Animações fluidas | Framer Motion 12 |
| 📝 Formulário com validação real-time | React Hook Form + Zod |
| 🎊 Efeito confetti no envio | Canvas API |
| 📱 Mobile First | Breakpoints responsivos |
| ♿ Acessibilidade WCAG AA | Semântica + ARIA |

---

## 🏗️ Seções

1. **Hero** — Apresentação com efeito glitch e bubbles animadas
2. **About** — Bio, foto, highlights e status badge
3. **Experience** — Timeline vertical com scroll progress e tech pills
4. **Skills** — Grid de habilidades com barras animadas e filtros
5. **Projects** — Cards interativos com hover 3D
6. **Education** — Filtros dinâmicos, stats bar, cards coloridos
7. **Contact** — Glassmorphism + validação onChange + gradient cards
8. **Footer** — 4 colunas (Brand, Nav, Tech, Social/CTA) + easter egg

---

## 🛠️ Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16.1.6 |
| Runtime | React 19.2.3 |
| Linguagem | TypeScript 5 |
| Styling | Tailwind CSS 3.4 |
| Animações | Framer Motion 12.29 |
| Ícones | Lucide React |
| Forms | React Hook Form + Zod |
| Fontes | Inter (Google Fonts) |

---

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/rugemtugem/resume.git
cd resume/v3

# Instalar dependências
npm install

# Dev server
npm run dev
```

Acesse `http://localhost:3000`

### Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Dev server com Turbopack |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção |
| `npm run lint` | ESLint |

---

## 📁 Estrutura

```
v3/
├── app/              # Pages e layout (App Router)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/contact/  # API route (Nodemailer)
├── components/
│   ├── sections/     # Hero, About, Experience, Skills, Projects, Education, Contact
│   ├── ui/           # Design system (Buttons, Cards, Toast, Input, etc.)
│   ├── effects/      # Confetti, Bubble Background
│   ├── navbar.tsx
│   └── footer.tsx
├── data/
│   ├── resume-data.ts    # Dados pessoais
│   └── translations.ts  # i18n (PT/EN)
├── hooks/            # Custom hooks
└── lib/              # Utilitários
```

---

## 📱 Responsividade

| Breakpoint | Largura |
|-----------|---------|
| Mobile | < 768px |
| Tablet | 768px – 1024px |
| Desktop | > 1024px |

---

## 📬 Contato

- 🌐 [rugemtugem.dev](https://rugemtugem.dev)
- 💻 [github.com/rugemtugem](https://github.com/rugemtugem)
- 💼 [linkedin.com/in/rugemtugem](https://linkedin.com/in/rugemtugem)
- 📧 contato@rugemtugem.dev

---

<p align="center">
  Desenvolvido com ❤️ e muito ☕ por <strong>Ferrugem</strong>
</p>
