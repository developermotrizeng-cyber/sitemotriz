'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Lock, Sliders, ArrowUpRight, ChevronDown, Users, Database } from 'lucide-react';
import { SiteContent } from '../lib/defaultData';
import Logo from './Logo';

interface HeaderProps {
  content: SiteContent['header'];
  specialties?: SiteContent['specialties'];
  onOpenAdmin: () => void;
  isAdminActive: boolean;
  onScrollToSection: (sectionId: string) => void;
  onSelectSpecialty?: (id: string | null) => void;
}

export default function Header({ 
  content, 
  specialties, 
  onOpenAdmin, 
  isAdminActive, 
  onScrollToSection,
  onSelectSpecialty 
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSpecialtiesOpen, setIsMobileSpecialtiesOpen] = useState(false);
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);
  const [isMobileColabOpen, setIsMobileColabOpen] = useState(false);
  const [isMobileContactOpen, setIsMobileContactOpen] = useState(false);

  const navItems = [
    { label: content.navHome, id: 'inicio' },
    { label: content.navAbout, id: 'quem-somos' },
    { label: content.navSpecialties, id: 'atuacoes' },
    { label: content.navPortfolio, id: 'portfolio' },
    { label: content.navPartners || 'CLIENTES', id: 'parceiros' },
    { label: content.navContact, id: 'contato' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E2E8F0] shadow-sm transition-all duration-300">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand area */}
          <div 
            onClick={() => onScrollToSection('inicio')} 
            className="cursor-pointer"
            id="brand-logo"
          >
            <Logo showText={true} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 lg:space-x-2 items-center h-full">
            {navItems.map((item) => {
              const labelText = (item.label || '').toUpperCase();

              if (item.id === 'atuacoes') {
                return (
                  <div 
                    key={item.id}
                    className="relative group h-full flex items-center"
                    id="header-atuacoes-dropdown"
                  >
                    <button
                      onClick={() => onScrollToSection('atuacoes')}
                      className="px-3 py-2 rounded-md font-sans text-xs font-bold tracking-widest uppercase text-[#44464e] hover:bg-[#2d3f65] hover:text-white transition-all duration-200 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{labelText}</span>
                      <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
                    </button>

                    {/* Dropdown Menu Panel */}
                    <div className="absolute top-[68px] left-1/2 -translate-x-1/2 w-72 bg-white border border-[#E2E8F0] shadow-xl rounded py-3 transition-all duration-300 opacity-0 pointer-events-none translate-y-2 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 z-50">
                      <div className="max-h-[300px] overflow-y-auto px-1 py-1 space-y-0.5 scrollbar-thin">
                        <span className="block px-3 pb-1 md:pb-2 text-[10px] font-sans font-extrabold text-[#7a889f] tracking-widest uppercase border-b border-[#f0eded] mb-1">
                          ESPECIALIDADES DISPONÍVEIS
                        </span>
                        {specialties?.items?.map((spec) => (
                          <button
                            key={spec.id}
                            onClick={() => {
                              onScrollToSection('atuacoes');
                              if (onSelectSpecialty) {
                                onSelectSpecialty(spec.id);
                              }
                            }}
                            className="w-full text-left px-3 py-2 rounded text-xs font-body font-medium text-[#44464e] hover:bg-[#2d3f65] hover:text-white transition-colors duration-200 block truncate"
                          >
                            {spec.title}
                          </button>
                        ))}
                      </div>
                      
                      {/* VER TODOS Button */}
                      <div className="border-t border-[#f0eded] mx-3 mt-2 pt-2.5">
                        <button
                          onClick={() => onScrollToSection('atuacoes')}
                          className="w-full flex items-center justify-between text-[10px] font-sans font-extrabold tracking-widest text-white bg-[#2d3f65] hover:bg-[#45567e] px-4 py-2.5 rounded transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                        >
                          <span>VER TODOS</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              if (item.id === 'quem-somos') {
                return (
                  <div 
                    key={item.id}
                    className="relative group h-full flex items-center"
                    id="header-about-dropdown"
                  >
                    <button
                      onClick={() => onScrollToSection('quem-somos')}
                      className="px-3 py-2 rounded-md font-sans text-xs font-bold tracking-widest uppercase text-[#44464e] hover:bg-[#2d3f65] hover:text-white transition-all duration-200 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{labelText}</span>
                      <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
                    </button>

                    {/* Dropdown Menu Panel for Quem Somos */}
                    <div className="absolute top-[68px] left-1/2 -translate-x-1/2 w-56 bg-white border border-[#E2E8F0] shadow-xl rounded py-2 transition-all duration-300 opacity-0 pointer-events-none translate-y-2 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 z-50">
                      <div className="px-1 py-1 space-y-0.5">
                        <button
                          key="nav-about-history"
                          type="button"
                          onClick={() => {
                            onScrollToSection('quem-somos');
                            setTimeout(() => {
                              const el = document.getElementById('about-history');
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 100);
                          }}
                          className="w-full text-left px-3 py-2 rounded text-xs font-sans font-bold text-[#44464e] hover:bg-[#2d3f65] hover:text-white transition-colors duration-200 block cursor-pointer uppercase tracking-wider"
                        >
                          {content.navHistoryLabel || 'NOSSA HISTÓRIA'}
                        </button>
                        <button
                          key="nav-about-mvv"
                          type="button"
                          onClick={() => {
                            onScrollToSection('quem-somos');
                            setTimeout(() => {
                              const el = document.getElementById('mvv-list');
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 100);
                          }}
                          className="w-full text-left px-3 py-2 rounded text-xs font-sans font-bold text-[#44464e] hover:bg-[#2d3f65] hover:text-white transition-colors duration-200 block cursor-pointer uppercase tracking-wider"
                        >
                          {content.navMvvLabel || 'MISSÃO, VISÃO E VALORES'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              if (item.id === 'contato') {
                return (
                  <div 
                    key={item.id}
                    className="relative group h-full flex items-center"
                    id="header-contato-dropdown"
                  >
                    <button
                      onClick={() => onScrollToSection('contato')}
                      className="px-3 py-2 rounded-md font-sans text-xs font-bold tracking-widest uppercase text-[#44464e] hover:bg-[#2d3f65] hover:text-white transition-all duration-200 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{labelText}</span>
                      <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
                    </button>

                    {/* Dropdown Menu Panel for Contato */}
                    <div className="absolute top-[68px] right-0 md:left-1/2 md:-translate-x-1/2 w-56 bg-white border border-[#E2E8F0] shadow-xl rounded py-2 transition-all duration-300 opacity-0 pointer-events-none translate-y-2 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 z-50">
                      <div className="px-1 py-1 space-y-0.5">
                        <button
                          key="nav-contact-form"
                          type="button"
                          onClick={() => onScrollToSection('contato')}
                          className="w-full text-left px-3 py-2 rounded text-xs font-sans font-bold text-[#44464e] hover:bg-[#2d3f65] hover:text-white transition-colors duration-200 block cursor-pointer uppercase tracking-widest text-[10px]"
                        >
                          Fale Conosco
                        </button>
                        <a
                          key="nav-contact-careers"
                          href="/trabalhe-conosco"
                          className="w-full text-left px-3 py-2 rounded text-xs font-sans font-bold text-[#44464e] hover:bg-[#2d3f65] hover:text-white transition-colors duration-200 block cursor-pointer uppercase tracking-widest text-[10px]"
                        >
                          Trabalhe Conosco
                        </a>
                      </div>
                    </div>
                  </div>
                );
              }

              if (item.id === 'portfolio') {
                return (
                  <div key={item.id} className="relative h-full flex items-center">
                    <Link
                      href="/portfolio"
                      className="px-3 py-2 rounded-md font-sans text-xs font-bold tracking-widest uppercase text-[#44464e] hover:bg-[#2d3f65] hover:text-white transition-all duration-200 flex items-center cursor-pointer"
                    >
                      {labelText}
                    </Link>
                  </div>
                );
              }

              return (
                <div key={item.id} className="relative h-full flex items-center">
                  <button
                    onClick={() => onScrollToSection(item.id)}
                    className="px-3 py-2 rounded-md font-sans text-xs font-bold tracking-widest uppercase text-[#44464e] hover:bg-[#2d3f65] hover:text-white transition-all duration-200 flex items-center cursor-pointer"
                  >
                    {labelText}
                  </button>
                </div>
              );
            })}
          </nav>

          {/* Actions Block */}
          <div className="hidden lg:flex items-center space-x-3 h-full">
            {/* Área do Colaborador Trigger */}
            <div className="relative group h-full flex items-center" id="colaborador-trigger-desktop">
              <button
                className={`flex items-center gap-1.5 px-3 py-2 font-sans text-xs font-bold tracking-widest uppercase rounded border transition-all duration-200 cursor-pointer h-10 ${
                  isAdminActive 
                    ? 'bg-[#2d3f65] border-[#2d3f65] text-white' 
                    : 'text-[#44464e] border-[#c5c6cf] hover:bg-[#2d3f65] hover:text-white hover:border-[#2d3f65]'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span>Área do Colaborador</span>
                <ChevronDown className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180" />
              </button>

              {/* Dropdown Menu Panel for Área do Colaborador */}
              <div className="absolute right-0 top-[68px] w-64 bg-white border border-[#E2E8F0] shadow-xl rounded py-2 transition-all duration-300 opacity-0 pointer-events-none translate-y-2 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 z-50">
                <div className="px-1 py-1 space-y-0.5">
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="w-full text-left px-3 py-2.5 rounded font-sans text-[11px] font-bold text-[#44464e] hover:bg-[#2d3f65] hover:text-white transition-all cursor-pointer flex items-center justify-between uppercase"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sliders className="h-3.5 w-3.5" />
                      Portal do Administrador
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      alert("Motriz360 - Sistema de Gestão Construtiva Integrado (Em desenvolvimento técnico pela equipe de engenharia).");
                    }}
                    className="w-full text-left px-3 py-2 rounded font-sans text-[11px] font-bold text-zinc-400 hover:bg-[#2d3f65] hover:text-white transition-all cursor-pointer flex items-center justify-between uppercase group"
                  >
                    <span className="flex flex-col text-left">
                      <span className="flex items-center gap-1.5 text-[#505f7c] group-hover:text-white font-bold leading-none">
                        <Database className="h-3.5 w-3.5 text-[#a8b8cc] group-hover:text-white" />
                        Motriz360
                      </span>
                      <span className="text-[9px] font-normal text-zinc-400 group-hover:text-zinc-200 mt-0.5 lowercase">Em breve • Software de Gestão</span>
                    </span>
                    <Lock className="h-3.5 w-3.5 text-zinc-300 group-hover:text-white opacity-60" />
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Request button */}
            <button
              onClick={() => onScrollToSection('contato')}
              className="flex items-center gap-1.5 bg-[#2d3f65] text-white hover:bg-[#45567e] px-4 py-2 rounded font-sans text-xs font-bold tracking-wider transition-all duration-300 shadow-sm hover:shadow-md h-10 cursor-pointer text-center"
              id="header-cta"
            >
              <span>{content.ctaText}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Left/Middle actions for mobile */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={onOpenAdmin}
              className={`p-2 rounded border cursor-pointer ${
                isAdminActive 
                  ? 'bg-[#2d3f65] border-[#2d3f65] text-white' 
                  : 'text-[#505f7c] border-[#c0c1ca] hover:bg-[#f6f3f2]'
              }`}
              title="Portal do Administrador (Área do Colaborador)"
              id="admin-trigger-mobile"
            >
              <Users className="h-4 w-4" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded text-[#44464e] hover:text-[#2d3f65] hover:bg-[#f6f3f2] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#2d3f65]"
              id="mobile-menu-toggle"
            >
              <span className="sr-only">Abrir menu</span>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2E8F0] bg-white px-4 pt-2 pb-6 space-y-3 shadow-inner animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            {navItems.map((item) => {
              const labelText = (item.label || '').toUpperCase();

              if (item.id === 'atuacoes') {
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => setIsMobileSpecialtiesOpen(!isMobileSpecialtiesOpen)}
                      className="flex w-full items-center justify-between px-3 py-2.5 rounded font-sans text-xs font-bold tracking-widest uppercase text-[#44464e] hover:bg-[#f0eded] hover:text-[#2d3f65] transition-all"
                    >
                      <span>{labelText}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMobileSpecialtiesOpen ? 'rotate-180 text-[#2d3f65]' : ''}`} />
                    </button>
                    {isMobileSpecialtiesOpen && (
                      <div className="pl-6 pr-2 py-1 space-y-1 bg-[#fcf9f8] border-l-2 border-[#2d3f65] rounded-r animate-in fade-in slide-in-from-top-2 duration-150">
                        {specialties?.items?.map((spec) => (
                          <button
                            key={spec.id}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              onScrollToSection('atuacoes');
                              if (onSelectSpecialty) onSelectSpecialty(spec.id);
                            }}
                            className="block w-full text-left py-2 font-body text-sm font-medium text-[#505f7c] hover:text-[#2d3f65] cursor-pointer"
                          >
                            • {spec.title}
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            onScrollToSection('atuacoes');
                          }}
                          className="block w-full text-left py-2 font-sans text-xs font-bold text-[#2d3f65] tracking-widest uppercase mt-1 cursor-pointer"
                        >
                          VER TODOS
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              if (item.id === 'quem-somos') {
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setIsMobileAboutOpen(!isMobileAboutOpen)}
                      className="flex w-full items-center justify-between px-3 py-2.5 rounded font-sans text-xs font-bold tracking-widest uppercase text-[#44464e] hover:bg-[#f0eded] hover:text-[#2d3f65] transition-all"
                    >
                      <span>{labelText}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMobileAboutOpen ? 'rotate-180 text-[#2d3f65]' : ''}`} />
                    </button>
                    {isMobileAboutOpen && (
                      <div className="pl-6 pr-2 py-1 space-y-1 bg-[#fcf9f8] border-l-2 border-[#2d3f65] rounded-r animate-in fade-in slide-in-from-top-2 duration-150">
                        <button
                          type="button"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            onScrollToSection('quem-somos');
                            setTimeout(() => {
                              const el = document.getElementById('about-history');
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 100);
                          }}
                          className="block w-full text-left py-2 font-body text-sm font-medium text-[#505f7c] hover:text-[#2d3f65] cursor-pointer"
                        >
                          • {content.navHistoryLabel || 'NOSSA HISTÓRIA'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            onScrollToSection('quem-somos');
                            setTimeout(() => {
                              const el = document.getElementById('mvv-list');
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 100);
                          }}
                          className="block w-full text-left py-2 font-body text-sm font-medium text-[#505f7c] hover:text-[#2d3f65] cursor-pointer"
                        >
                          • {content.navMvvLabel || 'MISSÃO, VISÃO E VALORES'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              if (item.id === 'contato') {
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setIsMobileContactOpen(!isMobileContactOpen)}
                      className="flex w-full items-center justify-between px-3 py-2.5 rounded font-sans text-xs font-bold tracking-widest uppercase text-[#44464e] hover:bg-[#f0eded] hover:text-[#2d3f65] transition-all"
                    >
                      <span>{labelText}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMobileContactOpen ? 'rotate-180 text-[#2d3f65]' : ''}`} />
                    </button>
                    {isMobileContactOpen && (
                      <div className="pl-6 pr-2 py-1 space-y-1 bg-[#fcf9f8] border-l-2 border-[#2d3f65] rounded-r animate-in fade-in slide-in-from-top-2 duration-150">
                        <button
                          type="button"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            onScrollToSection('contato');
                          }}
                          className="block w-full text-left py-2 font-[#505f7c] text-xs font-bold tracking-wider hover:text-[#2d3f65] cursor-pointer uppercase"
                        >
                          • Fale Conosco
                        </button>
                        <a
                          href="/trabalhe-conosco"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                          }}
                          className="block w-full text-left py-2 font-[#505f7c] text-xs font-bold tracking-wider hover:text-[#2d3f65] cursor-pointer uppercase"
                        >
                          • Trabalhe Conosco
                        </a>
                      </div>
                    )}
                  </div>
                );
              }

              if (item.id === 'portfolio') {
                return (
                  <Link
                    key={item.id}
                    href="/portfolio"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2.5 rounded font-sans text-xs font-bold tracking-widest uppercase text-[#44464e] hover:bg-[#f0eded] hover:text-[#2d3f65] transition-all cursor-pointer"
                  >
                    {labelText}
                  </Link>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onScrollToSection(item.id);
                  }}
                  className="block w-full text-left px-3 py-2.5 rounded font-sans text-xs font-bold tracking-widest uppercase text-[#44464e] hover:bg-[#f0eded] hover:text-[#2d3f65] transition-all cursor-pointer"
                >
                  {labelText}
                </button>
              );
            })}

            {/* Mobile Collaborator Option */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setIsMobileColabOpen(!isMobileColabOpen)}
                className="flex w-full items-center justify-between px-3 py-2.5 rounded font-sans text-xs font-bold tracking-widest uppercase text-[#2d3f65] bg-[#becee0]/20 hover:bg-[#becee0]/40 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  ÁREA DO COLABORADOR
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMobileColabOpen ? 'rotate-180 text-[#2d3f65]' : ''}`} />
              </button>
              {isMobileColabOpen && (
                <div className="pl-6 pr-2 py-1 space-y-1 bg-[#fcf9f8] border-l-2 border-[#2d3f65] rounded-r animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="block w-full text-left py-2.5 font-sans text-xs font-bold text-[#44464e] hover:text-[#2d3f65] cursor-pointer flex items-center justify-between uppercase"
                  >
                    <span>• PORTAL DO ADMINISTRADOR</span>
                    <Sliders className="h-3.5 w-3.5 text-[#505f7c]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      alert("Motriz360 - Sistema de Gestão Construtiva Integrado (Em desenvolvimento técnico pela equipe de engenharia).");
                    }}
                    className="block w-full text-left py-2.5 font-sans text-xs font-bold text-zinc-400 hover:text-white cursor-pointer flex items-center justify-between uppercase"
                  >
                    <div className="flex flex-col">
                      <span>• MOTRIZ360</span>
                      <span className="text-[9px] font-normal text-zinc-400 leading-none mt-0.5 lowercase font-mono">em breve • software de gestão</span>
                    </div>
                    <Lock className="h-3.5 w-3.5 text-zinc-300" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4 border-t border-[#f0eded] flex flex-col gap-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onScrollToSection('contato');
              }}
              className="w-full justify-center flex items-center gap-1.5 bg-[#2d3f65] text-white hover:bg-[#45567e] py-3 rounded font-sans text-sm font-bold tracking-wider transition-all"
            >
              <span>{content.ctaText}</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
