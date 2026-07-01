'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useSiteContent } from '../../hooks/use-site-content';

export default function PrivacyPolicyPage() {
  const router = useRouter();
  const { siteContent, isMounted } = useSiteContent();

  const handleScrollToSection = (sectionId: string) => {
    router.push(`/#${sectionId}`);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#fcf9f8] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 border-4 border-[#2d3f65] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-sans text-xs font-bold text-[#505f7c] tracking-widest uppercase">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#fcf9f8] text-[#1b1c1c] scroll-smooth">
      <Header
        content={siteContent.header}
        specialties={siteContent.specialties}
        onOpenAdmin={() => { router.push('/?admin=true'); }}
        isAdminActive={false}
        onScrollToSection={handleScrollToSection}
        onSelectSpecialty={() => {}}
      />

      {/* Hero Banner Section */}
      <section className="bg-[#2d323e] text-white pt-24 pb-10 relative overflow-hidden" id="privacy-hero">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[#bbccfb] hover:text-white transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar para Início</span>
            </Link>
            <h1 className="font-sans text-3xl sm:text-5xl font-extrabold tracking-tight text-white pt-2">
              Política de Privacidade
            </h1>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-4 py-12 flex-grow w-full">
        <div className="bg-white rounded-lg shadow-md border border-[#E2E8F0] p-6 sm:p-10 space-y-8">
          <div className="space-y-4">
            <p className="font-body text-slate-700 text-sm leading-relaxed text-justify">
              A <strong>Motriz Engenharia</strong> valoriza a sua privacidade e segurança. Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos os seus dados pessoais ao interagir com nosso site, preencher formulários de contato ou cadastrar currículos em nosso banco de talentos virtual.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-sans text-lg font-bold text-[#2d3f65] border-b border-[#f3f0ef] pb-2">
              1. Dados Coletados
            </h2>
            <p className="font-body text-slate-700 text-sm leading-relaxed text-justify">
              Coletamos informações pessoais que você fornece diretamente ao interagir conosco, tais como:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 text-sm font-body">
              <li><strong>Formulário de Contato:</strong> Nome completo, e-mail corporativo, telefone e mensagem enviada.</li>
              <li><strong>Trabalhe Conosco (Banco de Talentos):</strong> Nome, e-mail, telefone, vaga de interesse, pretensão salarial, link do LinkedIn, arquivos de currículos (PDF ou documentos similares).</li>
              <li><strong>Newsletter:</strong> Apenas o endereço de e-mail fornecido voluntariamente para receber atualizações do setor.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="font-sans text-lg font-bold text-[#2d3f65] border-b border-[#f3f0ef] pb-2">
              2. Utilização das Informações
            </h2>
            <p className="font-body text-slate-700 text-sm leading-relaxed text-justify">
              Os dados coletados são utilizados estritamente para as finalidades declaradas:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 text-sm font-body">
              <li>Responder a solicitações de orçamento, laudos ou dúvidas enviadas pelo formulário de contato.</li>
              <li>Avaliar perfis profissionais e manter currículos no banco de talentos para futuros processos de seleção.</li>
              <li>Enviar informativos, notícias ou atualizações de obras (caso você tenha se inscrito na nossa newsletter).</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="font-sans text-lg font-bold text-[#2d3f65] border-b border-[#f3f0ef] pb-2">
              3. Compartilhamento e Proteção de Dados
            </h2>
            <p className="font-body text-slate-700 text-sm leading-relaxed text-justify">
              Não vendemos, trocamos ou transferimos para terceiros as suas informações pessoais identificáveis. O armazenamento de dados segue práticas de segurança recomendadas pelo setor. Quando o Supabase ou servidores SMTP são utilizados, a segurança das comunicações é mantida por meio de criptografia e certificados SSL válidos para proteção contra acessos não autorizados.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-sans text-lg font-bold text-[#2d3f65] border-b border-[#f3f0ef] pb-2">
              4. Direitos dos Usuários
            </h2>
            <p className="font-body text-slate-700 text-sm leading-relaxed text-justify">
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você possui o direito de confirmar a existência do tratamento de seus dados, solicitar a retificação de informações inexatas ou requerer a remoção completa de seus dados e currículos de nossas bases a qualquer momento. Para exercer esses direitos, entre em contato através do e-mail <strong>{siteContent.contact?.email || 'engenharia@motrizengenharia.com.br'}</strong>.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-sans text-lg font-bold text-[#2d3f65] border-b border-[#f3f0ef] pb-2">
              5. Alterações nesta Política
            </h2>
            <p className="font-body text-slate-700 text-sm leading-relaxed text-justify">
              Reservamo-nos o direito de modificar esta política de privacidade periodicamente. Quaisquer atualizações serão publicadas nesta página com a respectiva data de atualização.
            </p>
            <p className="text-xs text-zinc-500 font-sans pt-4 border-t border-[#f3f0ef]">
              Última atualização: 1 de Julho de 2026.
            </p>
          </div>
        </div>
      </section>

      <Footer
        content={siteContent.footer}
        contact={siteContent.contact}
        onScrollToSection={handleScrollToSection}
      />
    </main>
  );
}
