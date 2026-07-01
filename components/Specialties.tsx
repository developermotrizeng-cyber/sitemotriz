'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Zap, 
  Layers, 
  Milestone, 
  Network, 
  Snowflake, 
  Droplet, 
  Flame, 
  Compass, 
  Database,
  Cpu,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  X,
  PhoneCall,
  CheckCircle2,
  Wrench,
  Building2,
  Hammer,
  HardHat,
  Shield,
  Activity,
  Award,
  Clock,
  Home,
  Anchor,
  Truck,
  Building,
  Ruler,
  Shovel,
  Cone,
  Briefcase,
  Map,
  Calendar,
  ClipboardList,
  FileText,
  TrendingUp,
  Scale,
  Gauge,
  FlaskConical,
  MapPin,
  Lightbulb,
  Calculator,
  LineChart,
  Factory,
  Fence,
  Forklift,
  Grid,
  TreePine,
  Waves,
  Settings,
  Eye,
  Folder,
  Pencil
} from 'lucide-react';
import { SiteContent } from '../lib/defaultData';

interface SpecialtiesProps {
  content: SiteContent['specialties'];
  selectedSpecialtyId: string | null;
  onSelectSpecialty: (id: string | null) => void;
  onCardClick: (specialtyTitle: string) => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Zap: Zap,
  Layers: Layers,
  Milestone: Milestone,
  Network: Network,
  Snowflake: Snowflake,
  Droplet: Droplet,
  Flame: Flame,
  Compass: Compass,
  Database: Database,
  Cpu: Cpu,
  Wrench: Wrench,
  Building2: Building2,
  Hammer: Hammer,
  HardHat: HardHat,
  Shield: Shield,
  Activity: Activity,
  Award: Award,
  Clock: Clock,
  Home: Home,
  Anchor: Anchor,
  Truck: Truck,
  Building: Building,
  Ruler: Ruler,
  Shovel: Shovel,
  Cone: Cone,
  Briefcase: Briefcase,
  Map: Map,
  Calendar: Calendar,
  ClipboardList: ClipboardList,
  FileText: FileText,
  TrendingUp: TrendingUp,
  Scale: Scale,
  Gauge: Gauge,
  FlaskConical: FlaskConical,
  MapPin: MapPin,
  Lightbulb: Lightbulb,
  Calculator: Calculator,
  LineChart: LineChart,
  Factory: Factory,
  Fence: Fence,
  Forklift: Forklift,
  Grid: Grid,
  TreePine: TreePine,
  Waves: Waves,
  Settings: Settings,
  Eye: Eye,
  Folder: Folder,
  Pencil: Pencil,
  Roller: (props: React.ComponentProps<'svg'>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <circle cx="6" cy="17" r="2.5" />
      <circle cx="6" cy="17" r="0.8" />
      <circle cx="18" cy="16" r="3.5" />
      <circle cx="18" cy="16" r="0.8" />
      <path d="M3 17h3" />
      <path d="M9 17h5" />
      <path d="M3 17a3 3 0 0 1 6 0" />
      <rect x="13" y="14" width="8" height="2.5" rx="0.5" />
      <path d="M9 12V6h4.5l1.5 6Z" />
      <path d="M9 9h6.2" />
      <path d="M14 12v3h4" />
      <path d="M8 12V8h-0.5" />
    </svg>
  )
};

// Map fallback images for specialties preview
const fallbackImages: Record<string, string> = {
  Zap: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
  Layers: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80",
  Milestone: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=800&q=80",
  Network: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
  Snowflake: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
  Droplet: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
  Flame: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80",
  Compass: "https://images.unsplash.com/photo-1503387762458-7e52d4efdec7?auto=format&fit=crop&w=800&q=80"
};

export default function Specialties({ 
  content, 
  selectedSpecialtyId, 
  onSelectSpecialty, 
  onCardClick 
}: SpecialtiesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImageIdx, setPreviewImageIdx] = useState(0);
  const [modalImageIdx, setModalImageIdx] = useState(0);

  const items = content?.items || [];

  // Auto select first item if none is selected
  useEffect(() => {
    if (items.length > 0 && !selectedSpecialtyId) {
      onSelectSpecialty(items[0].id);
    }
  }, [items.length, selectedSpecialtyId, onSelectSpecialty]);

  // Escape key handler to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  if (!content) return null;
  
  // Find which specialty is currently active
  const activeSpecialty = items.find(it => it.id === selectedSpecialtyId) || items[0] || null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Get fallback representation image
  const getImageUrl = (item: any) => {
    if (item.image && item.image.trim().startsWith('http')) {
      return item.image;
    }
    return fallbackImages[item.icon] || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80";
  };

  // Dynamically compile multiple images
  const getSpecialtyImages = (item: any): string[] => {
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      return item.images.filter((img: string) => img && img.trim().length > 0);
    }
    const directImg = getImageUrl(item);
    const relatedList: Record<string, string[]> = {
      Zap: [
        "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80", 
        "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=80", 
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
      ],
      Layers: [
        "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80", 
        "https://images.unsplash.com/photo-1503387762458-7e52d4efdec7?auto=format&fit=crop&w=800&q=80", 
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80"
      ],
      Milestone: [
        "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=800&q=80", 
        "https://images.unsplash.com/photo-1515162203112-be224a02e600?auto=format&fit=crop&w=800&q=80", 
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80"
      ],
      Network: [
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80", 
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80", 
        "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80"
      ],
      Snowflake: [
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80", 
        "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=800&q=80", 
        "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=800&q=80"
      ],
      Droplet: [
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80", 
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80", 
        "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=800&q=80"
      ],
      Flame: [
        "https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80", 
        "https://images.unsplash.com/photo-1508243771214-6e95d137426b?auto=format&fit=crop&w=800&q=80", 
        "https://images.unsplash.com/photo-1516216628859-9bccecad13ca?auto=format&fit=crop&w=800&q=80"
      ],
      Compass: [
        "https://images.unsplash.com/photo-1503387762458-7e52d4efdec7?auto=format&fit=crop&w=800&q=80", 
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80", 
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
      ]
    };
    const key = item.icon;
    const list = relatedList[key];
    if (list) {
      const copy = [...list];
      if (directImg) copy[0] = directImg;
      return copy;
    }
    return [directImg].filter(Boolean) as string[];
  };

  return (
    <section id="atuacoes" className="py-16 bg-[#f0f4fa] border-y border-[#E2E8F0] text-[#1b1c1c] scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-10">
          <span className="font-sans text-xs font-bold tracking-[0.2em] text-[#505f7c] uppercase block">
            {content.tag}
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2d3f65]" id="specialties-title">
            {content.title}
          </h2>
          <div className="h-0.5 w-16 bg-[#2d3f65] mx-auto opacity-40 mt-3" />
        </div>

        {/* Carousel Control & Title bar */}
        <div className="flex items-center justify-between text-[#7a889f] text-[10px] font-sans font-bold tracking-widest uppercase mb-4 px-1">
          <span>← Arraste ou clique abaixo para ver as especialidades →</span>
          <div className="flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="p-2 border border-[#E2E8F0] hover:border-[#2d3f65] active:bg-[#fcf9f8] rounded bg-white text-[#2d3f65] hover:bg-[#2d3f65] hover:text-white transition-all cursor-pointer shadow-sm"
              title="Voltar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-2 border border-[#E2E8F0] hover:border-[#2d3f65] active:bg-[#fcf9f8] rounded bg-white text-[#2d3f65] hover:bg-[#2d3f65] hover:text-white transition-all cursor-pointer shadow-sm"
              title="Avançar"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Containers - Smaller elegant Cards */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-thin scroll-smooth mask-horizontal"
          style={{ scrollSnapType: 'x mandatory' }}
          id="specialties-cards-container"
        >
          {items.map((item) => {
            const IconComponent = iconMap[item.icon] || HelpCircle;
            const isSelected = item.id === selectedSpecialtyId;
            
            return (
              <div 
                key={item.id}
                onClick={() => {
                  onSelectSpecialty(item.id);
                  setPreviewImageIdx(0);
                }}
                className={`group shrink-0 w-[240px] sm:w-[260px] p-6 rounded-lg border text-center cursor-pointer transition-all duration-300 snap-center shadow-sm relative overflow-hidden flex flex-col items-center justify-center min-h-[160px] ${
                  isSelected 
                    ? 'bg-[#3b4e78] border-[#bbccfb] text-white scale-[1.02] ring-2 ring-[#bbccfb]/50 md:translate-y-[-4px]' 
                    : 'bg-[#2d3f65] border-transparent hover:bg-[#344873] text-zinc-100 hover:text-white'
                }`}
                id={`specialty-card-${item.id}`}
              >
                {/* Visual indicator bar on bottom */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 ${isSelected ? 'bg-sky-400' : 'bg-transparent group-hover:bg-[#bbccfb]/40'}`} />

                <div className="space-y-4 flex flex-col items-center w-full">
                  {/* Icon Box - Centered and Larger */}
                  <div className={`inline-flex p-3 rounded-full transition-all duration-300 ${
                    isSelected ? 'bg-sky-455 text-white ring-2 ring-white/10' : 'bg-[#1e2a47] text-[#bbccfb] group-hover:bg-sky-400 group-hover:text-white'
                  }`}>
                    <IconComponent className="h-7 w-7 stroke-[1.8]" />
                  </div>

                  {/* Header Title - Centered */}
                  <h3 className="font-sans text-xs sm:text-sm font-extrabold tracking-wider uppercase leading-snug line-clamp-2 text-center text-white">
                    {item.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Preview Section - Highlight area below carousel (Anexo02 click preview requirement) */}
        {activeSpecialty && (
          <div 
            className="mt-12 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300"
            id="specialty-detail-preview"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column representing image */}
              <div className="lg:col-span-5 relative group overflow-hidden rounded-lg bg-zinc-100 border border-[#E2E8F0]">
                <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] w-full overflow-hidden">
                  <img 
                    src={getSpecialtyImages(activeSpecialty)[previewImageIdx] || getImageUrl(activeSpecialty)} 
                    alt={activeSpecialty.title}
                    className="w-full h-full object-cover object-center transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
                  
                  {/* Left & Right custom sliding arrows for active specialty main preview */}
                  {getSpecialtyImages(activeSpecialty).length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImageIdx(prev => (prev === 0 ? getSpecialtyImages(activeSpecialty).length - 1 : prev - 1));
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#2d3f65] text-white p-1.5 sm:p-2 rounded-full transition-all cursor-pointer z-10"
                        title="Imagem anterior"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImageIdx(prev => (prev === getSpecialtyImages(activeSpecialty).length - 1 ? 0 : prev + 1));
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#2d3f65] text-white p-1.5 sm:p-2 rounded-full transition-all cursor-pointer z-10"
                        title="Próxima imagem"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      {/* Floating overlay image counters */}
                      <div className="absolute bottom-3 right-3 bg-[#2d3f65]/90 text-white text-[9px] font-sans font-bold px-2 py-0.5 rounded">
                        {previewImageIdx + 1} / {getSpecialtyImages(activeSpecialty).length}
                      </div>
                    </>
                  )}

                  {/* Micro branding watermark badge inside photo */}
                  <div className="absolute bottom-3 left-3 bg-[#2d3f65] text-white text-[9px] font-sans font-extrabold tracking-wider px-2.5 py-1 rounded uppercase">
                    MOTRIZ ENGENHARIA
                  </div>
                </div>
              </div>

              {/* Right Column representation content preview */}
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                    <span className="font-sans text-[10px] font-extrabold text-[#505f7c] tracking-widest uppercase">Especialidade Selecionada</span>
                  </div>
                  <h3 className="font-sans text-xl sm:text-2xl font-extrabold text-[#2d3f65]">
                    {activeSpecialty.title}
                  </h3>
                </div>

                <p className="font-body text-[#44464e] leading-relaxed text-sm font-light text-justify">
                  {activeSpecialty.description}
                </p>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setModalImageIdx(0);
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-[#2d3f65] hover:bg-[#45567e] text-white text-xs font-sans font-extrabold tracking-widest px-6 py-3.5 rounded transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <span>VER DETALHES COMPLETOS</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* FULL DETAILS MODAL COMPONENT */}
      {isModalOpen && activeSpecialty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" id="specialty-details-modal">
          <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#E2E8F0] animate-in scale-in duration-200">
            
            {/* Modal Header representation block */}
            <div className="sticky top-0 bg-[#2d3f65] text-white px-6 py-4 flex items-center justify-between z-10">
              <div className="space-y-1">
                <span className="text-[9px] font-sans font-extrabold text-sky-300 tracking-wider uppercase block">Análise e Escopo de Engenharia</span>
                <h4 className="font-sans text-base sm:text-lg font-bold uppercase tracking-tight">{activeSpecialty.title}</h4>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-[#aebecc] hover:text-white hover:bg-white/10 transition-colors"
                title="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              
              {/* Dynamic Single-image Carrossel Slider row */}
              <div className="space-y-2">
                <span className="text-[10px] font-sans font-extrabold text-[#7a889f] tracking-widest uppercase block mb-1">
                  Galeria do Escopo de Engenharia (Use as setas para navegar)
                </span>
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-md overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm group">
                  <img 
                    src={getSpecialtyImages(activeSpecialty)[modalImageIdx] || getImageUrl(activeSpecialty)}
                    alt={`${activeSpecialty.title} - ${modalImageIdx + 1}`}
                    className="w-full h-full object-cover transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                  {/* Absolute navigation arrows inside the modal card */}
                  {getSpecialtyImages(activeSpecialty).length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalImageIdx(prev => (prev === 0 ? getSpecialtyImages(activeSpecialty).length - 1 : prev - 1));
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 sm:p-2.5 rounded-full transition-all cursor-pointer hover:bg-[#2d3f65]"
                        title="Imagem anterior"
                      >
                        <ChevronLeft className="h-4.5 w-4.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalImageIdx(prev => (prev === getSpecialtyImages(activeSpecialty).length - 1 ? 0 : prev + 1));
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 sm:p-2.5 rounded-full transition-all cursor-pointer hover:bg-[#2d3f65]"
                        title="Próxima imagem"
                      >
                        <ChevronRight className="h-4.5 w-4.5" />
                      </button>
                      {/* Floating overlay image counters */}
                      <div className="absolute bottom-3 right-3 bg-[#2d3f65]/90 backdrop-blur-xs text-white text-[10px] font-sans font-bold px-2.5 py-1 rounded">
                        {modalImageIdx + 1} / {getSpecialtyImages(activeSpecialty).length}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Technical Description Body */}
              <div className="space-y-4">
                <h5 className="font-sans text-xs sm:text-sm font-extrabold text-[#2d3f65] tracking-wider uppercase border-b border-[#f3f0ef] pb-2">Descrição do Escopo</h5>
                <p className="font-body text-slate-700 text-sm leading-relaxed whitespace-pre-line text-justify font-light">
                  {activeSpecialty.details || activeSpecialty.description}
                </p>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="border-t border-[#f0eded] px-6 py-4 bg-[#fcf9f8] gap-3 flex flex-col sm:flex-row sm:items-center justify-end">
              <div className="flex gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-transparent text-[#2d3f65] hover:bg-[#eae8e7] border border-[#c5c6cf] rounded text-xs font-bold leading-none cursor-pointer"
                >
                  FECHAR
                </button>
                <a
                  href="#contato"
                  onClick={() => {
                    setIsModalOpen(false);
                    setTimeout(() => {
                      const el = document.getElementById('contato');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2d3f65] hover:bg-[#45567e] text-white rounded text-xs font-bold leading-none cursor-pointer"
                >
                  <PhoneCall className="h-3 w-3" />
                  <span>SOLICITAR ORÇAMENTO</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
