'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useSiteContent } from '../../hooks/use-site-content';

export default function TermsOfUsePage() {
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
      <section className="bg-[#2d323e] text-white pt-24 pb-10 relative overflow-hidden" id="terms-hero">
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
              Termos de Uso
            </h1>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-4 py-12 flex-grow w-full">
        <div className="bg-white rounded-lg shadow-md border border-[#E2E8F0] p-6 sm:p-10 space-y-8">
          <div className="space-y-4">
            <p className="font-body text-slate-700 text-sm leading-relaxed text-justify">
              Bem-vindo ao site da <strong>Motriz Engenharia</strong>. Ao navegar e utilizar este site, você concorda em cumprir e em se submeter aos seguintes Termos de Uso. Recomendamos a leitura atenta destas disposições antes de prosseguir com a utilização de nossos serviços e funcionalidades web.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-sans text-lg font-bold text-[#2d3f65] border-b border-[#f3f0ef] pb-2">
              1. Aceitação dos Termos
            </h2>
            <p className="font-body text-slate-700 text-sm leading-relaxed text-justify">
              O acesso a este website e a utilização de suas ferramentas (tais como formulários de contato, cadastro de currículos e inscrição em newsletters) implicam na aceitação integral dos presentes Termos de Uso. Caso não concorde com qualquer termo aqui descrito, solicitamos que não acesse ou utilize este website.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-sans text-lg font-bold text-[#2d3f65] border-b border-[#f3f0ef] pb-2">
              2. Propriedade Intelectual
            </h2>
            <p className="font-body text-slate-700 text-sm leading-relaxed text-justify">
              Todo o conteúdo disponibilizado neste site, incluindo mas não se limitando a marcas, logotipos, textos, fotografias de obras, layouts de projetos, gráficos, códigos e softwares, é de propriedade exclusiva da <strong>Motriz Engenharia</strong> ou de seus licenciadores, estando protegido pela legislação nacional e internacional de direitos autorais e propriedade intelectual. A reprodução ou distribuição não autorizada de qualquer material deste site é estritamente proibida.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-sans text-lg font-bold text-[#2d3f65] border-b border-[#f3f0ef] pb-2">
              3. Obrigações e Responsabilidade do Usuário
            </h2>
            <p className="font-body text-slate-700 text-sm leading-relaxed text-justify">
              Ao enviar informações através dos formulários do site, o usuário se compromete a fornecer dados verídicos, precisos e atualizados. É vedado o envio de qualquer material contendo vírus de computador, códigos maliciosos ou informações falsas que possam prejudicar a operação técnica deste portal ou comprometer o banco de dados. O descumprimento destas diretrizes pode resultar na suspensão do acesso às funcionalidades interativas e na adoção de medidas legais cabíveis.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-sans text-lg font-bold text-[#2d3f65] border-b border-[#f3f0ef] pb-2">
              4. Limitação de Responsabilidade
            </h2>
            <p className="font-body text-slate-700 text-sm leading-relaxed text-justify">
              O website é fornecido &quot;como está&quot; e &quot;conforme disponível&quot;. Embora nos esforcemos para manter as informações sempre corretas e atualizadas, a Motriz Engenharia não se responsabiliza por eventuais instabilidades temporárias de conexão ou erros de conteúdo decorrentes de terceiros.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-sans text-lg font-bold text-[#2d3f65] border-b border-[#f3f0ef] pb-2">
              5. Foro e Legislação Aplicável
            </h2>
            <p className="font-body text-slate-700 text-sm leading-relaxed text-justify">
              Estes termos são regidos e interpretados de acordo com as leis da República Federativa do Brasil. Para a resolução de qualquer controvérsia decorrente da utilização deste website, elegemos como foro competente a Comarca de Porto Velho, Estado de Rondônia.
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
