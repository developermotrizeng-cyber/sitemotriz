'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SiteContent } from '../lib/defaultData';
import ProjectDetailModal, { getProjectImages } from './ProjectDetailModal';

interface PortfolioProps {
  content: SiteContent['portfolio'];
  onProjectClick: (projectName: string) => void;
}

export default function Portfolio({ content, onProjectClick }: PortfolioProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>('TODOS');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Card Image navigation state
  const [cardImageIndices, setCardImageIndices] = useState<Record<string, number>>({});
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<any | null>(null);
  const [modalImageIdx, setModalImageIdx] = useState(0);

  // Esc key handler to close modal
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

  // Dynamically extract unique categories for filtering
  const categories = ['TODOS', ...Array.from(new Set(content.items?.map((item) => item.category.toUpperCase()) || []))];

  const filteredItems = filter === 'TODOS'
    ? content.items
    : content.items?.filter((item) => item.category.toUpperCase() === filter);

  const scrollLeftValue = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRightValue = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <section id="portfolio" className="py-12 bg-white text-[#1b1c1c]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header containing text and view buttons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-4">
            <span className="font-sans text-xs font-bold tracking-[0.2em] text-[#505f7c] uppercase block">
              {content.tag}
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2d3f65]" id="portfolio-title">
              {content.title}
            </h2>
          </div>

          {/* Quick Category filter tabs */}
          <div className="flex flex-wrap gap-2" id="portfolio-filter-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 font-sans text-xs font-bold tracking-wider rounded transition-all duration-200 ${
                  filter === cat
                    ? 'bg-[#2d3f65] text-white shadow-sm'
                    : 'bg-[#f0eded] text-[#505f7c] hover:bg-[#eae7e7] hover:text-[#2d3f65]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio grid carousel wrapper */}
        <div className="relative" id="portfolio-project-carousel">
          {filteredItems && filteredItems.length > 0 && (
            <>
              {/* Navigation Arrows */}
              <button 
                onClick={scrollLeftValue}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center h-11 w-11 rounded-full bg-white text-[#2d3f65] border border-[#E2E8F0] shadow-md hover:bg-[#2d3f65] hover:text-white transition-all focus:outline-none cursor-pointer"
                aria-label="Projetos anteriores"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button 
                onClick={scrollRightValue}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center h-11 w-11 rounded-full bg-white text-[#2d3f65] border border-[#E2E8F0] shadow-md hover:bg-[#2d3f65] hover:text-white transition-all focus:outline-none cursor-pointer"
                aria-label="Próximos projetos"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Scrolling card row */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 scrollbar-none"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {filteredItems && filteredItems.map((project) => {
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
                    onProjectClick(project.title);
                  }}
                  className="snap-start shrink-0 w-[290px] sm:w-[330px] group cursor-pointer bg-white border border-[#E2E8F0] overflow-hidden rounded hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  id={`project-card-${project.id}`}
                >
                  <div>
                    {/* Outer image wrap */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e5e2e1] group/image">
                      <img 
                        src={currentImg || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80"} 
                        alt={project.title}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
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

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 justify-between text-white animate-fade-in">
                        <span className="font-sans text-xs font-bold tracking-wide uppercase">Visualizar Detalhes Completos</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>

                  {/* Text content area */}
                  <div className="p-5 space-y-2">
                    <span className="font-sans text-[10px] font-extrabold tracking-widest text-[#505f7c] uppercase pb-1 border-b border-zinc-100 block w-max">
                      {project.category}
                    </span>
                    <h3 className="font-sans text-sm sm:text-base font-bold text-[#2d3f65] tracking-tight group-hover:text-[#45567e] line-clamp-2 pt-1 uppercase">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Card Action footer button */}
                <div className="px-5 pb-5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveProject(project);
                      setModalImageIdx(activeIdx);
                      setIsModalOpen(true);
                      onProjectClick(project.title);
                    }}
                    className="w-full border border-zinc-200 hover:border-[#2d3f65] bg-[#fcf9f8] hover:bg-[#2d3f65] hover:text-white px-3 py-2 text-center text-[11px] font-bold font-sans tracking-widest text-[#2d3f65] transition-all rounded uppercase flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Ver Detalhes Completos</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}`

            {(!filteredItems || filteredItems.length === 0) && (
              <div className="w-full text-center py-16 text-[#505f7c]">
                Nenhum projeto cadastrado nesta categoria.
              </div>
            )}
          </div>
        </div>

        {filteredItems && filteredItems.length > 0 && (
          <p className="text-center font-sans text-[10px] tracking-wide text-[#7a889f] uppercase mt-3">
            ← Arraste para o lado ou utilize as setas laterais para visualizar todas as obras →
          </p>
        )}

        {/* Global summary button */}
        <div className="mt-8 text-center" id="portfolio-bottom-cta">
          <button
            type="button"
            onClick={() => {
              router.push('/portfolio');
            }}
            className="inline-flex items-center gap-2 border-2 border-[#2d3f65] hover:bg-[#2d3f65] hover:text-white text-[#2d3f65] bg-white font-sans text-xs font-bold tracking-widest px-8 py-3.5 rounded transition-all duration-300 cursor-pointer uppercase"
          >
            <span>{content.ctaText.toUpperCase()}</span>
          </button>
        </div>

      </div>

      {/* Reutilizando componente modal compartilhado */}
      {isModalOpen && activeProject && (
        <ProjectDetailModal
          project={activeProject}
          modalImageIdx={modalImageIdx}
          onChangeImage={setModalImageIdx}
          onClose={() => setIsModalOpen(false)}
          ctaHref="#contato"
          onCtaClick={() => {
            setIsModalOpen(false);
            setTimeout(() => {
              const el = document.getElementById('contato');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);
          }}
        />
      )}

    </section>
  );
}
