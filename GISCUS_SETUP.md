# Configuração do Giscus

O Giscus usa GitHub Discussions para comentários. Siga estes passos para configurar:

## 1. Habilitar Discussions no Repositório

1. Vá para o seu repositório no GitHub: `https://github.com/lnxsantos/lnxsantos.github.io`
2. Clique em **Settings** > **General**
3. Role até a seção **Features**
4. Marque a opção **Discussions**
5. Clique em **Save**

## 2. Instalar o App Giscus

1. Acesse: https://github.com/apps/giscus
2. Clique em **Install**
3. Selecione o repositório `lnxsantos/lnxsantos.github.io`
4. Clique em **Install**

## 3. Obter os IDs

1. Acesse: https://giscus.app
2. Preencha o formulário:
   - **Repository**: `lnxsantos/lnxsantos.github.io`
   - **Repository ID**: Será gerado automaticamente
   - **Category**: Escolha uma categoria (ex: "Announcements")
   - **Category ID**: Será gerado automaticamente
   - **Mapping**: `pathname` (recomendado)
   - **Theme**: `preferred_color_scheme`
   - **Language**: `pt`
3. Copie os valores gerados:
   - `data-repo-id` → `repoId` no `hugo.toml`
   - `data-category-id` → `categoryId` no `hugo.toml`

## 4. Atualizar hugo.toml

Edite o arquivo `hugo.toml` e preencha:

```toml
[params.comments.giscus]
  repo = "lnxsantos/lnxsantos.github.io"
  repoId = "SEU_REPO_ID_AQUI"
  category = "Announcements"
  categoryId = "SEU_CATEGORY_ID_AQUI"
```

## 5. Testar

1. Faça o build: `make build`
2. Inicie o servidor: `make server`
3. Acesse um post e verifique se os comentários aparecem

## Notas

- Os comentários só aparecerão em posts (não em páginas como About)
- Para desabilitar comentários em um post específico, adicione `comments: false` no front matter
- O Giscus suporta dark/light theme automaticamente
- Os comentários são armazenados como GitHub Discussions

## Alternativa: Usar Utterances

Se preferir usar GitHub Issues em vez de Discussions:

1. No `hugo.toml`, mude `provider = "utterances"`
2. Configure apenas o `repo` em `[params.comments.utterances]`
3. Instale o app Utterances: https://github.com/apps/utterances

