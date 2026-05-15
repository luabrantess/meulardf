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


## Licença

Projeto privado do MeuLarDF. Uso, distribuição e modificação dependem de autorização do responsável pelo projeto.
