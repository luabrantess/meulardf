
Objetivo

Transformar o portal em uma aplicação funcional, em português e com visão mobile, com:
- botão “Anunciar” funcionando com formulário completo
- likes em todos os imóveis
- página “Destaques” ordenada pelos imóveis com mais likes
- agendamento de visita salvo de verdade
- página admin para acompanhar interações e visitas
- ocultação do corretor na vitrine principal e exibição apenas onde fizer sentido no admin/detalhe
- navegação real em todos os botões principais

Pré-requisito para atender ao que você pediu

Como você pediu persistência real e login realmente seguro para admin, isso não deve ser feito só no frontend.
Como alternativa ao Lovable Cloud, a implementação deve usar uma integração com Supabase externo para salvar:
- imóveis anunciados
- likes
- agendamentos de visita
- interações administrativas
- usuários e papéis de acesso

O que será construído

1. Estrutura de dados real
- Tabela de imóveis com os campos:
  - título
  - valor
  - quartos
  - banheiros
  - área total
  - descrição
  - localização
  - comodidades
  - nome do corretor responsável
  - telefone
  - imagens
  - status/publicado
  - total de likes
  - data de criação
- Tabela de visitas agendadas ligada ao imóvel
- Tabela de likes por usuário/imóvel para evitar contagem duplicada por conta
- Tabela separada de papéis de usuário (`user_roles`) para admin, seguindo a regra de segurança
- Views/consultas para ranking de destaques e listagem do painel admin

2. Fluxo “Anunciar”
- Criar rota dedicada `/anunciar`
- Fazer o botão “Anunciar” do desktop e mobile abrir essa página
- Criar formulário com validação para:
  - Título
  - Valor
  - Quartos
  - Banheiros
  - Área total
  - Descrição
  - Localização
  - Comodidades selecionáveis
  - Nome do corretor responsável
  - Telefone
- Salvar o anúncio no banco
- Exibir feedback visual de sucesso/erro
- Garantir que o nome do corretor não apareça nos cards da página principal

3. Listagem principal funcionando
- Substituir a lista fixa por dados reais
- Fazer o botão “Ver Todos os Imóveis” navegar para uma rota de catálogo, por exemplo `/imoveis`
- Manter botão de like em todos os cards
- Garantir clique no card levando ao detalhe do imóvel
- Ajustar busca/filtros do hero para realmente filtrar a listagem

4. Página de detalhes do imóvel
- Tornar a página dinâmica a partir do imóvel selecionado
- Manter:
  - galeria
  - descrição completa
  - mapa
  - botão de agendar visita
  - botão de like
- Salvar agendamento de visita no banco
- Exibir dados do corretor aqui, mas não na home
- Fazer botão “Ligar Agora” funcionar com link de telefone
- Melhorar compartilhamento e navegação de volta

5. Página de destaques
- Criar rota `/destaques`
- Listar imóveis ordenados pelos mais curtidos
- Exibir cards com contagem de likes
- Destacar os imóveis líderes e permitir abrir o detalhe

6. Página admin
- Criar rota protegida `/admin`
- Login real para administrador
- Tela para visualizar:
  - anúncios cadastrados
  - visitas marcadas
  - resumo de curtidas/interesse
  - corretor responsável e telefone
- Objetivo operacional:
  - o admin vê as interações
  - o admin consulta as visitas marcadas
  - o admin entra em contato com o corretor responsável
- Opcional dentro do mesmo painel:
  - filtros por imóvel, data e corretor
  - status da visita (novo, contato pendente, contatado, concluído)

7. Visão mobile
- Revisar layout das páginas:
  - navbar
  - hero
  - cards
  - detalhe
  - formulário de anúncio
  - painel admin
- Melhorar usabilidade em celular:
  - botões com área de toque maior
  - grids virando coluna
  - formulários em uma coluna
  - CTA fixo ou mais visível no detalhe
  - navegação mobile com links reais para Início, Imóveis, Destaques, Anunciar e Admin

Ajustes de navegação e botões que passarão a funcionar
- “Anunciar” → `/anunciar`
- “Ver Todos os Imóveis” → `/imoveis`
- links do menu → rotas reais
- cards → detalhe real do imóvel
- “Agendar Visita” → salvar visita no banco
- “Ligar Agora” → `tel:`
- botão de like → persistir curtida
- botão de compartilhar → copiar URL do imóvel
- link/entrada “Destaques” → `/destaques`
- acesso “Admin” → `/admin`

Detalhes técnicos
- Centralizar os dados dos imóveis em uma camada compartilhada em vez de manter arrays duplicados na home e no detalhe
- Usar React Query para leitura, cache e invalidação após likes, anúncios e agendamentos
- Usar React Hook Form + Zod para validação dos formulários
- Proteger a rota admin com autenticação e checagem de papel via tabela `user_roles`
- Não armazenar papel de admin em `profiles`, `users`, localStorage ou credenciais fixas
- Aplicar RLS para que:
  - usuários comuns consigam ler imóveis publicados
  - likes/agendamentos sejam controlados por usuário
  - apenas admins visualizem o painel e dados operacionais
- Mapear comodidades como lista selecionável e reutilizar esse campo no card, detalhe e admin

Arquivos que devem ser ajustados ou criados
- Ajustar:
  - `src/App.tsx`
  - `src/components/Navbar.tsx`
  - `src/components/HeroSection.tsx`
  - `src/components/PropertyCard.tsx`
  - `src/pages/Index.tsx`
  - `src/pages/PropertyDetail.tsx`
- Criar:
  - página de catálogo `/imoveis`
  - página `/anunciar`
  - página `/destaques`
  - página `/admin`
  - camada de dados/tipos dos imóveis
  - componentes de formulário e filtros reutilizáveis
  - integração de autenticação e acesso ao banco
  - migrations/políticas do banco no projeto integrado

Ordem de implementação
1. Modelar banco, autenticação e papéis de admin
2. Centralizar dados reais dos imóveis
3. Fazer botão “Anunciar” e formulário completo
4. Persistir likes e criar página “Destaques”
5. Persistir agendamentos de visita
6. Construir painel admin protegido
7. Revisar responsividade mobile e acabamento final
