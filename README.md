# MeuLarDF

MeuLarDF é um portal imobiliário desenvolvido em React para anunciar imóveis, captar interessados, registrar curtidas, agendar visitas e operar um painel administrativo conectado ao Supabase.

O projeto foi pensado para corretores, imobiliárias e anunciantes que precisam publicar imóveis com fotos, localização em mapa, filtros de busca e acompanhamento de leads gerados pela plataforma.

## Funcionalidades

- Catálogo de imóveis com filtros por finalidade, localização e faixa de preço.
- Página de detalhes do imóvel com galeria de fotos, informações completas, mapa e agendamento de visita.
- Formulário para anunciar imóvel com upload de fotos, preview de mapa e aceite obrigatório dos Termos de Uso.
- Curtidas persistentes usando Supabase.
- Página de destaques baseada nos imóveis mais curtidos.
- Painel administrativo com login via Supabase Auth.
- Visualização de anúncios, curtidas e visitas marcadas no admin.
- Página de Termos de Uso para regras da plataforma, marketing e geração de leads.
- Deploy preparado para Vercel com suporte a rotas internas do React Router.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui e Radix UI
- React Router DOM
- TanStack Query
- React Hook Form
- Zod
- Supabase Auth, Database e Storage
- Vitest

## Estrutura principal

```txt
src/
  components/       Componentes reutilizáveis e UI
  hooks/            Hooks de autenticação e dados
  lib/              Cliente Supabase, serviços e utilitários
  pages/            Páginas principais do site
  types/            Tipos TypeScript
supabase/
  schema.sql        Schema, policies, funções e storage
public/             Arquivos públicos, favicon e robots
```

## Rotas

```txt
/                  Página inicial
/imoveis           Catálogo de imóveis
/destaques         Ranking de imóveis mais curtidos
/anunciar          Cadastro de novo anúncio
/imovel/:slug      Detalhe do imóvel
/admin             Painel administrativo
/termos-de-uso     Termos de Uso
```

## Pré-requisitos

- Node.js 20 ou superior recomendado
- npm
- Projeto Supabase criado

## Instalação local

```bash
npm install
npm run dev
```

O projeto roda localmente em uma URL parecida com:

```txt
http://localhost:8080
```

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-public
```

Não commite `.env.local`. Ele deve ficar apenas na máquina local ou nas variáveis da plataforma de deploy.

## Supabase

O arquivo principal do banco está em:

```txt
supabase/schema.sql
```

Ele contém:

- tipos enum
- tabelas `properties`, `scheduled_visits`, `property_likes` e `user_roles`
- função `has_role`
- função `toggle_property_like`
- Row Level Security
- policies de leitura, criação e administração
- bucket público `property-photos` para imagens dos imóveis

Para configurar, abra o Supabase e rode o conteúdo de `supabase/schema.sql` no SQL Editor.

### Storage de fotos

O projeto usa o bucket:

```txt
property-photos
```

Ele precisa estar público para as fotos aparecerem no site. O schema já inclui a criação do bucket e policies básicas.

### Criar usuário admin

1. Crie um usuário em:

```txt
Supabase > Authentication > Users
```

2. Depois rode no SQL Editor, trocando o email:

```sql
insert into public.user_roles (user_id, role)
select id, 'admin'
from auth.users
where email = 'admin@meulardf.com'
on conflict (user_id, role) do nothing;
```

3. Acesse:

```txt
/admin
```

## Termos de Uso

A página de Termos de Uso fica em:

```txt
/termos-de-uso
```

O formulário de anúncio exige aceite obrigatório antes da publicação. Os termos tratam a remuneração como serviço de plataforma, divulgação, marketing e geração de leads, sem caracterizar comissão de corretagem.

## Scripts

```bash
npm run dev       # Servidor local
npm run build     # Build de produção
npm run preview   # Preview do build
npm run lint      # Lint
npm test          # Testes com Vitest
```

## Deploy na Vercel

Configuração recomendada:

```txt
Framework: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Configure também as variáveis:

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

O projeto possui `vercel.json` com rewrite para funcionar com React Router em rotas como `/admin`, `/imoveis` e `/termos-de-uso`.

## Domínio

Para usar `meulardf.com` na Vercel:

```txt
A     @     76.76.21.21
CNAME www   cname.vercel-dns-0.com
```

Depois configure o domínio em:

```txt
Vercel > Project Settings > Domains
```

## Observações importantes

- Sempre faça redeploy depois de alterar variáveis de ambiente em produção.
- Se fotos não aparecerem, verifique o bucket `property-photos` e suas policies.
- Se visitas não aparecerem no admin, confira se o usuário tem role `admin` em `public.user_roles`.
- Se curtidas somem ao recarregar, confira a tabela `property_likes`, a função `toggle_property_like` e as grants/policies do schema.

## Licença

Projeto privado do MeuLarDF. Uso, distribuição e modificação dependem de autorização do responsável pelo projeto.
