import Navbar from "@/components/Navbar";

const TermsOfUse = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-body uppercase tracking-[0.18em] text-muted-foreground">Termos legais</p>
        <h1 className="mt-2 text-3xl font-display font-bold text-foreground sm:text-4xl">Termos de Uso</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
          Ao anunciar, atender leads ou negociar oportunidades originadas no MeuLarDF, o anunciante declara ciência e aceite das condições abaixo.
        </p>
      </div>
    </section>

    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-8 rounded-lg border border-border bg-card p-6 shadow-sm">
        <section>
          <h2 className="text-xl font-display font-semibold text-foreground">1. Uso da plataforma</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            O MeuLarDF disponibiliza uma plataforma digital para divulgação de imóveis, captação de interessados, agendamento de visitas e aproximação entre anunciantes, corretores, proprietários e potenciais compradores ou locatários.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-semibold text-foreground">2. Responsabilidade do anunciante</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            O anunciante é responsável pela veracidade das informações publicadas, incluindo preço, localização, imagens, características do imóvel, disponibilidade, autorização de divulgação e dados de contato.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-semibold text-foreground">3. Serviço da plataforma, marketing e geração de leads</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            O MeuLarDF presta serviços digitais de divulgação de imóveis, exposição de anúncios, hospedagem de páginas, captação de contatos, geração de leads, encaminhamento de interessados e ferramentas de apoio ao relacionamento entre anunciante e potencial cliente.
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            A remuneração devida ao MeuLarDF não constitui comissão de corretagem, intermediação imobiliária ou participação direta na venda, locação ou negociação do imóvel. Trata-se de taxa pelo uso da tecnologia, publicidade, marketing, visibilidade e geração de oportunidades comerciais por meio da plataforma.
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            As condições comerciais da plataforma, incluindo eventual taxa de licença, assinatura, plano de anúncio, pacote de divulgação, cobrança por lead ou outro modelo de remuneração, poderão ser definidas em proposta comercial, contrato próprio, painel administrativo, tabela vigente ou comunicação formal entre as partes.
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Do valor pago ao MeuLarDF pelos serviços de plataforma, divulgação, marketing, geração de leads, assinatura, plano de anúncio ou pacote contratado, poderá ser destinado ao desenvolvedor e mantenedor técnico do site o percentual de 10%, a título de remuneração técnica pela criação, manutenção, suporte e evolução da plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-semibold text-foreground">4. Corretagem e negociação imobiliária</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            A negociação, atendimento, visita, proposta, intermediação imobiliária, documentação e eventual comissão de corretagem são de responsabilidade exclusiva do corretor, imobiliária, proprietário ou anunciante responsável pelo imóvel, conforme a legislação aplicável e os acordos firmados diretamente com seus clientes.
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            O MeuLarDF não substitui o corretor, não atua como imobiliária e não recebe comissão de corretagem pela conclusão de negócios, salvo se houver contrato específico e legalmente válido em sentido diverso.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-semibold text-foreground">5. Inadimplência dos serviços contratados</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            O não pagamento de valores contratados pelo uso da plataforma, planos de anúncio, marketing, geração de leads ou serviços digitais poderá resultar na suspensão do acesso do anunciante, remoção de anúncios, bloqueio de novas publicações e cobrança administrativa ou judicial dos valores devidos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-semibold text-foreground">6. Aceite</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Ao marcar o aceite no formulário de anúncio, o anunciante confirma que leu, entendeu e concorda com estes Termos de Uso, incluindo as regras sobre uso da plataforma, divulgação, marketing e geração de leads.
          </p>
        </section>
      </div>
    </main>
  </div>
);

export default TermsOfUse;
