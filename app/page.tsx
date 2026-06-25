'use client';

import React, { useState, useEffect } from 'react';
import { Sliders, Wrench, Shield, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Specialties from '../components/Specialties';
import Portfolio from '../components/Portfolio';
import Partners from '../components/Partners';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import AdminPortal from '../components/AdminPortal';
import { SiteContent } from '../lib/defaultData';
import { useSiteContent } from '../hooks/use-site-content';

export default function Home() {
  const { siteContent, setSiteContent, isMounted } = useSiteContent();
  const [isAdminModeActive, setIsAdminModeActive] = useState(false);
  const [activeInteractiveAlert, setActiveInteractiveAlert] = useState<string | null>(null);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | null>("spec-1");

  useEffect(() => {
    if (isMounted) {
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('admin') === 'true') {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setIsAdminModeActive(true);
        }
      } catch (err) {}
    }
  }, [isMounted]);

  // Update site content globally and store state
  const handleUpdateContent = (newContent: SiteContent) => {
    setSiteContent(newContent);
  };

  // Smooth scroll handler
  const handleScrollToSection = (sectionId: string) => {
    // If admin is active, close it first so they can see the section
    setIsAdminModeActive(false);

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  // Trigger modal helper for click cards
  const handleAlert = (message: string) => {
    setActiveInteractiveAlert(message);
    setTimeout(() => setActiveInteractiveAlert(null), 5000);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#fcf9f8] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 border-4 border-[#2d3f65] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-sans text-xs font-bold text-[#505f7c] tracking-widest uppercase">Carregando Conexão Estrutural...</p>
        </div>
      </div>
    );
  }

  // If Admin Mode is locked as active, load the beautiful control Center
  if (isAdminModeActive) {
    return (
      <AdminPortal 
        content={siteContent}
        onUpdateContent={handleUpdateContent}
        onClose={() => setIsAdminModeActive(false)}
      />
    );
  }

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

  // Live Landing Page rendering view
  return (
    <main className="min-h-screen flex flex-col scroll-smooth">
      
      {/* Dynamic Alert Banner for interactions feedback */}
      {activeInteractiveAlert && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4">
          <div className="bg-[#2d3f65] text-white p-4 rounded shadow-2xl flex items-start gap-3 border border-[#bbccfb]/20 animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-left">
              <span className="font-sans text-xs font-extrabold tracking-wider block uppercase">Portal Motriz</span>
              <p className="font-body text-xs text-[#becee0] leading-relaxed">
                Você clicou em <strong className="text-white">&quot;{activeInteractiveAlert}&quot;</strong>. Este card é totalmente editável no portal do administrador!
              </p>
            </div>
          </div>
        </div>
      )}



      {/* Primary Layout elements */}
      <Header 
        content={siteContent.header}
        specialties={siteContent.specialties}
        onOpenAdmin={() => setIsAdminModeActive(true)}
        isAdminActive={isAdminModeActive}
        onScrollToSection={handleScrollToSection}
        onSelectSpecialty={setSelectedSpecialtyId}
      />

      <Hero 
        content={siteContent.hero}
        onCtaClick={() => handleScrollToSection('contato')}
      />

      <About 
        content={siteContent.about}
      />

      <Specialties 
        content={siteContent.specialties}
        selectedSpecialtyId={selectedSpecialtyId}
        onSelectSpecialty={setSelectedSpecialtyId}
        onCardClick={(title) => handleAlert(title)}
      />

      <Portfolio 
        content={siteContent.portfolio}
        onProjectClick={() => {}}
      />

      <Partners 
        content={siteContent.partners}
      />

      <Contact 
        content={siteContent.contact}
      />

      <Footer 
        content={siteContent.footer}
        contact={siteContent.contact}
        onScrollToSection={handleScrollToSection}
      />

    </main>
  );
}
