'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  FolderOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProjectDetailModal, { getProjectDetails, getProjectImages } from '../../components/ProjectDetailModal';
import { useSiteContent } from '../../hooks/use-site-content';

export default function PortfolioPage() {
  const router = useRouter();
  const { siteContent, isMounted } = useSiteContent();
  const [filter, setFilter] = useState<string>('TODOS');

  // Card Image navigation state
  const [cardImageIndices, setCardImageIndices] = useState<Record<string, number>>({});

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<any | null>(null);
  const [modalImageIdx, setModalImageIdx] = useState(0);

  // Esc key closure for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#fcf9f8] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 border-4 border-[#2d3f65] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-sans text-xs font-bold text-[#505f7c] tracking-widest uppercase">Carregando Acervo Construtivo...</p>
        </div>
      </div>
    );
  }

  // Handle header smooth scroll routing back to home page hash
  const handleScrollToSection = (sectionId: string) => {
    router.push(`/#${sectionId}`);
  };

  const items = siteContent.portfolio.items || [];
  
  // Extract unique categories
  const categories = ['TODOS', ...Array.from(new Set(items.map((item) => item.category.toUpperCase())))];

  const filteredItems = filter === 'TODOS'
    ? items
    : items.filter((item) => item.category.toUpperCase() === filter);

  return (
    <main className="min-h-screen flex flex-col bg-[#fcf9f8] text-[#1b1c1c] scroll-smooth">
      
      {/* Header Block */}
      <Header 
        content={siteContent.header}
        specialties={siteContent.specialties}
        onOpenAdmin={() => { router.push('/?admin=true'); }}
        isAdminActive={false}
        onScrollToSection={handleScrollToSection}
        onSelectSpecialty={() => {}}
      />

      {/* Hero Banner Banner Section */}
      <section className="bg-[#2d323e] text-white pt-20 pb-8 relative overflow-hidden" id="portfolio-hero">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl space-y-4">
            <Link 
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[#bbccfb] hover:text-white transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar para Início</span>
            </Link>
            <h1 className="font-sans text-3xl sm:text-5xl font-extrabold tracking-tight text-white pt-2">
              Nosso Legado em Obras
            </h1>

          </div>
        </div>
      </section>

      {/* Grid List View Section */}
      <section className="py-12 bg-[#fcf9f8]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Quick Filter Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0eded] pb-6 mb-8">
            <div className="flex items-center gap-2 text-[#2d3f65]">
              <FolderOpen className="h-5 w-5 text-[#bbccfb]" />
              <span className="font-sans text-xs font-bold uppercase tracking-wider">
                Exibindo {filteredItems.length} {filteredItems.length === 1 ? 'Projeto' : 'Projetos'} Encontrados
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 font-sans text-xs font-bold tracking-wider rounded transition-all duration-200 cursor-pointer ${
                    filter === cat
                      ? 'bg-[#2d3f65] text-white shadow-sm'
                      : 'bg-white text-[#505f7c] border border-zinc-200 hover:bg-[#f3f0ef] hover:text-[#2d3f65]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout of Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((project) => {
              const images = getProjectImages(project);
              const activeIdx = cardImageIndices[project.id] || 0;
              const currentImg = images[activeIdx] || project.image;

              return (
                <div 
                  key={project.id}
                  onClick={() => {
                    setActiveProject(project);
                    setModalImageIdx(activeIdx);
                    setIsModalOpen(true);
                  }}
                  className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                  id={`grid-project-card-${project.id}`}
                >
                  <div>
                    {/* Aspect ratio frame preview image */}
                    <div className="relative aspect-[16/11] w-full overflow-hidden bg-zinc-100 group/image">
                      <img 
                        src={currentImg || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80"} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Card Image Navigation Arrows */}
                      {images.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextIdx = activeIdx === 0 ? images.length - 1 : activeIdx - 1;
                              setCardImageIndices(prev => ({ ...prev, [project.id]: nextIdx }));
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#2d3f65] text-white p-1.5 rounded-full transition-all cursor-pointer z-10 opacity-0 group-hover/image:opacity-100 flex items-center justify-center"
                            title="Imagem anterior"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextIdx = activeIdx === images.length - 1 ? 0 : activeIdx + 1;
                              setCardImageIndices(prev => ({ ...prev, [project.id]: nextIdx }));
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#2d3f65] text-white p-1.5 rounded-full transition-all cursor-pointer z-10 opacity-0 group-hover/image:opacity-100 flex items-center justify-center"
                            title="Próxima imagem"
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                          {/* Floating indicator */}
                          <div className="absolute bottom-2 right-2 bg-[#2d3f65]/90 text-white text-[9px] font-sans font-bold px-2 py-0.5 rounded z-10 shadow-sm">
                            {activeIdx + 1} / {images.length}
                          </div>
                        </>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 justify-between text-white">
                        <span className="font-body text-xs font-semibold tracking-wide">Inspecionar Projeto</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Body text details */}
                    <div className="p-6 space-y-2">
                      <span className="text-[9px] font-sans font-extrabold tracking-widest text-[#505f7c] uppercase bg-zinc-100 px-2 py-1 rounded">
                        {project.category}
                      </span>
                      <h3 className="font-sans text-base font-extrabold text-[#2d3f65] tracking-tight group-hover:text-[#45567e] transition-colors pt-2 h-auto line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="font-body text-xs text-zinc-500 leading-relaxed line-clamp-3 text-justify">
                        {getProjectDetails(project).substring(0, 140)}...
                      </p>
                    </div>
                  </div>

                  {/* Footer details button trigger link */}
                  <div className="px-6 pb-6 pt-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-sans font-extrabold tracking-wider text-[#2d3f65] border-b-2 border-transparent group-hover:border-[#bbccfb] transition-all uppercase">
                      <span>Ver detalhes completos</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="col-span-full text-center py-24 bg-white rounded-lg border border-dashed border-zinc-200">
                <p className="font-sans text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Nenhum Empreendimento Disponível</p>
                <p className="font-body text-xs text-zinc-400">Nenhum projeto cadastrado corresponde ao segmento selecionado no momento.</p>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Footer Block */}
      <Footer 
        content={siteContent.footer}
        onScrollToSection={handleScrollToSection}
      />

      {/* Reutilizando componente modal compartilhado */}
      {isModalOpen && activeProject && (
        <ProjectDetailModal
          project={activeProject}
          modalImageIdx={modalImageIdx}
          onChangeImage={setModalImageIdx}
          onClose={() => setIsModalOpen(false)}
          ctaHref="/#contato"
        />
      )}

    </main>
  );
}
