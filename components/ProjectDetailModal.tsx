'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, X, PhoneCall } from 'lucide-react';

interface ProjectDetailModalProps {
  project: any;
  modalImageIdx: number;
  onChangeImage: (idx: number) => void;
  onClose: () => void;
  /** Label para o botão de CTA. Padrão: "CONSULTAR ENGENHEIRO" */
  ctaLabel?: string;
  /** href para o CTA (ex: "#contato" ou "/#contato") */
  ctaHref?: string;
  /** Callback extra ao clicar no CTA */
  onCtaClick?: () => void;
}

function getProjectImages(proj: any): string[] {
  if (!proj) return [];
  if (Array.isArray(proj.images) && proj.images.length > 0) return proj.images;
  return [
    proj.image ||
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80',
  ];
}

function getProjectDetails(proj: any): string {
  if (!proj) return '';
  return (
    proj.details ||
    'Desenvolvimento e execução de obra de alto padrão técnico pela Motriz Engenharia. O projeto aplicou soluções de infraestrutura inteligente, planejamento estrutural e conformidade rigorosa com normas de segurança. Focado em qualidade construtiva de alto padrão.'
  );
}

export default function ProjectDetailModal({
  project,
  modalImageIdx,
  onChangeImage,
  onClose,
  ctaLabel = 'CONSULTAR ENGENHEIRO',
  ctaHref = '#contato',
  onCtaClick,
}: ProjectDetailModalProps) {
  if (!project) return null;

  const images = getProjectImages(project);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChangeImage(modalImageIdx === 0 ? images.length - 1 : modalImageIdx - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChangeImage(modalImageIdx === images.length - 1 ? 0 : modalImageIdx + 1);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes do projeto: ${project.title}`}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col relative border border-[#E2E8F0] animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
        id={`project-detail-modal-${project.id}`}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-[#f0eded] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] sm:text-xs font-sans font-extrabold text-[#7a889f] tracking-widest uppercase block">
              DETALHAMENTO DE PROJETO ({project.category})
            </span>
            <h3 className="font-sans text-base sm:text-xl font-extrabold text-[#2d3f65] tracking-tight">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-all cursor-pointer"
            title="Fechar Detalhes"
            aria-label="Fechar modal de detalhes"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Image Carousel */}
          <div className="space-y-2">
            <span className="text-[10px] font-sans font-extrabold text-[#7a889f] tracking-widest uppercase block mb-1">
              Galeria da Obra (Use as setas para navegar)
            </span>

            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-md overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm group">
              <img
                src={images[modalImageIdx]}
                alt={`${project.title} - ${modalImageIdx + 1}`}
                className="w-full h-full object-cover transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full transition-all cursor-pointer hover:bg-[#2d3f65]"
                    title="Imagem anterior"
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full transition-all cursor-pointer hover:bg-[#2d3f65]"
                    title="Próxima imagem"
                    aria-label="Próxima imagem"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-[#2d3f65]/90 text-white text-[10px] font-sans font-bold px-2.5 py-1 rounded">
                    {modalImageIdx + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Technical Description */}
          <div className="space-y-4">
            <h5 className="font-sans text-xs sm:text-sm font-extrabold text-[#2d3f65] tracking-wider uppercase border-b border-[#f3f0ef] pb-2">
              Especificações Técnicas e Soluções Construtivas
            </h5>
            <p className="font-body text-slate-700 text-sm leading-relaxed text-justify whitespace-pre-line font-light">
              {getProjectDetails(project)}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-[#f0eded] px-6 py-4 bg-[#fcf9f8] gap-3 flex flex-col sm:flex-row sm:items-center justify-between">
          <span className="text-[10px] font-sans text-zinc-500 leading-relaxed max-w-xs text-left">
            Empresa estruturada no desenvolvimento de obras industriais,
            comerciais e habitacionais sob conformidade rígida.
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-transparent text-[#2d3f65] hover:bg-[#eae8e7] border border-[#c5c6cf] rounded text-xs font-bold leading-none cursor-pointer"
            >
              FECHAR
            </button>
            <a
              href={ctaHref}
              onClick={(e) => {
                if (onCtaClick) {
                  e.preventDefault();
                  onCtaClick();
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2d3f65] hover:bg-[#45567e] text-white rounded text-xs font-bold leading-none cursor-pointer"
            >
              <PhoneCall className="h-3 w-3" />
              <span>{ctaLabel}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export { getProjectImages, getProjectDetails };
