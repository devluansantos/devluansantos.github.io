# Blog Técnico

Blog construído com [Hugo](https://gohugo.io/) e baseado apenas nos estilos padrão do navegador. Todo o comportamento depende de templates Hugo e Markdown limpo: não há JavaScript nem CSS customizados no repositório.

## 🚀 Características

- ✅ **Hugo Extended**: builds rápidos com `hugo --minify`.
- ✅ **Sem JavaScript**: navegação e layout dependem exclusivamente de HTML sem nenhum script.
- ✅ **Acessibilidade e performance**: tipografia legível, contraste equilibrado e carregamento leve.
- ✅ **SEO preparado**: metadados e tags centralizados nos partials.
- ✅ **Arquitetura enxuta**: conteúdo em `src/content/`, templates em `src/layouts/` e ativos (imagens) em `src/static/`, mantendo o visual fiel ao Markdown original.

## 🛠️ Pré-requisitos

- Hugo Extended 0.147.8 (ou superior).
- Git para versionamento e deploy.
- Nenhuma dependência de Node.js, npm ou bundlers de JavaScript.

## ⚙️ Comandos principais

- `make server`: inicia o servidor de desenvolvimento (Hugo Server em `http://localhost:1313`).
- `make build`: gera o site otimizado em `public/` usando `hugo --minify`.
- `make clean`: limpa `public/`, `server/` e `resources/_gen/`.
- `make new POST=nome-do-post`: cria um novo rascunho em `content/posts/`.

## 📁 Estrutura do repositório

O `hugo.toml` redefine `contentDir`, `layoutDir` e `staticDir` para apontar para os subdiretórios dentro de `src/`, então toda edição acontece nessa pasta.

```text
blog/
├── archetypes/          # Modelos padrão do Hugo
├── src/
│   ├── content/         # Posts e páginas (Markdown) — use `image: "/images/posts/{{ .Name }}.png"`
│   ├── layouts/         # Templates (baseof, partials, shortcodes)
│   └── static/          # Ativos públicos (ex: imagens/og-default.png e images/posts/*.png)
├── public/              # Artefatos gerados (não versionar)
├── .github/workflows/   # CI com Hugo puro
├── netlify.toml         # Deploy no Netlify
├── Makefile             # Comandos auxiliares
├── README.md
└── hugo.toml            # Configurações globais (diretórios apontam para `src/`)
```

## 🎨 Estilos

Este site não aplica CSS próprio: o Markdown é renderizado com os estilos padrão do navegador e os templates Hugo se mantêm neutros para preservar a aparência original do conteúdo.

## 🧱 Conteúdo e templates

- `src/content/posts/`: artigos técnicos.
- `src/content/about.md` e páginas institucionais.
- `src/layouts/_default/`: `baseof`, `single` e `list` que governam o HTML.
- `src/layouts/partials/`: header, footer, meta tags e shortcodes seguros.

## 🚢 Deploy e CI

- O build padrão executa `hugo --minify` (veja `netlify.toml` e `.github/workflows/deploy.yml`).
- O artefato necessário é a pasta `public/`.
- O workflow do GitHub Actions usa apenas `peaceiris/actions-hugo` para gerar o site e publicar em `gh-pages`.
- O Netlify executa `hugo --minify` e publica o conteúdo de `public/`.

## 🔐 Segurança

- Política CSP bloqueia scripts (`script-src 'none'`) e limita fontes e estilos.
- Hugo está com `unsafe = false` para evitar HTML arbitrário.
- Shortcodes sanitizam HTML inserido em tabelas e componentes.

## 📝 Licença

MIT
