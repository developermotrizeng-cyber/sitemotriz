'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Globe, Send, Phone, MessageSquare, MessageCircle, Linkedin, Check, MapPin, Facebook, Instagram } from 'lucide-react';
import { SiteContent } from '../lib/defaultData';
import Logo from './Logo';

interface FooterProps {
  content: SiteContent['footer'];
  contact?: SiteContent['contact'];
  onScrollToSection: (sectionId: string) => void;
}

export default function Footer({ content, contact, onScrollToSection }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);

  const quickLinks = [
    { label: 'Início', id: 'inicio' },
    { label: 'Quem Somos', id: 'quem-somos' },
    { label: 'Serviços', id: 'atuacoes' },
    { label: 'Obras', id: 'portfolio' },
    { label: 'Clientes', id: 'parceiros' },
    { label: 'Contato', id: 'contato' }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;

    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'Assinante Newsletter',
        email: newsletterEmail,
        telefone: '',
        tipoProjeto: 'Newsletter',
        mensagem: `Solicitação de cadastro de e-mail na newsletter: ${newsletterEmail}`
      })
    })
    .then((res) => {
      if (res.ok) {
        setNewsletterSubscribed(true);
        setNewsletterEmail('');
        setTimeout(() => {
          setNewsletterSubscribed(false);
        }, 4000);
      } else {
        console.error('Erro ao registrar e-mail na newsletter');
      }
    })
    .catch((err) => {
      console.error('Erro ao conectar com API de newsletter:', err);
    });
  };

  // WhatsApp helper
  const whatsAppUrl = `https://wa.me/${content.whatsappNumber}?text=${encodeURIComponent(content.whatsappMessage)}`;

  return (
    <footer className="relative bg-[#2d323e] text-white pt-16 pb-8 border-t border-[#31414f]" id="dynamic-footer">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-6">
            <div className="space-y-2">
              <Logo lightText={true} />
              <div className="h-0.5 w-12 bg-[#bbccfb]" />
            </div>
            
            <p className="font-body text-[#becee0] text-sm leading-relaxed max-w-sm font-light text-justify">
              {content.brandDesc}
            </p>

            {/* Dynamic Contact details inside footer */}
            {contact && (
              <div className="space-y-2.5 pt-2 border-t border-[#485867]/40 max-w-sm">
                <div className="flex items-start gap-2.5 text-xs text-[#becee0] font-light font-body leading-tight">
                  <MapPin className="h-4 w-4 text-[#bbccfb] shrink-0 mt-0.5" />
                  <span>{contact.address}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#becee0] font-light font-body">
                  <Phone className="h-4 w-4 text-[#bbccfb] shrink-0" />
                  <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`} className="hover:text-white transition-colors">
                    {contact.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#becee0] font-light font-body">
                  <Mail className="h-4 w-4 text-[#bbccfb] shrink-0" />
                  <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors underline decoration-dotted underline-offset-2">
                    {contact.email}
                  </a>
                </div>
              </div>
            )}

            {/* Social Icons list */}
            <div className="flex space-x-3 pt-2">
              {content.instagramUrl && (
                <a 
                  href={content.instagramUrl} 
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-[#485867] hover:bg-[#bbccfb] hover:text-[#2d3f65] rounded text-white transition-all cursor-pointer"
                  title="Instagram"
                >
                  <Instagram className="h-4.5 w-4.5" />
                </a>
              )}
              {content.facebookUrl && (
                <a 
                  href={content.facebookUrl} 
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-[#485867] hover:bg-[#bbccfb] hover:text-[#2d3f65] rounded text-white transition-all cursor-pointer"
                  title="Facebook"
                >
                  <Facebook className="h-4.5 w-4.5" />
                </a>
              )}
              <a 
                href={whatsAppUrl} 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 bg-[#485867] hover:bg-[#bbccfb] hover:text-[#2d3f65] rounded text-white transition-all cursor-pointer"
                title="WhatsApp Comercial"
              >
                <MessageCircle className="h-4.5 w-4.5" />
              </a>
              {content.linkedinUrl && (
                <a 
                  href={content.linkedinUrl} 
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-[#485867] hover:bg-[#bbccfb] hover:text-[#2d3f65] rounded text-white transition-all cursor-pointer"
                  title="LinkedIn"
                >
                  <Linkedin className="h-4.5 w-4.5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-[#becee0] border-b border-[#485867] pb-2">
              {content.quickLinksTitle}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  {link.id === 'portfolio' ? (
                    <Link
                      href="/portfolio"
                      className="font-body text-sm font-light text-[#becee0] hover:text-[#bbccfb] hover:translate-x-1 transition-all text-left inline-block"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => onScrollToSection(link.id)}
                      className="font-body text-sm font-light text-[#becee0] hover:text-[#bbccfb] hover:translate-x-1 transition-all text-left"
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter subscription form */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-[#becee0] border-b border-[#485867] pb-2">
              {content.newsletterTitle}
            </h3>
            <p className="font-body text-[#becee0] text-xs font-light leading-normal">
              {content.newsletterDesc}
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input 
                type="email" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={content.newsletterPlaceholder}
                disabled={newsletterSubscribed}
                className="flex-grow px-4 py-2.5 bg-[#485867] border border-[#a1b3c3]/20 focus:border-[#bbccfb] focus:outline-none rounded text-xs text-white placeholder-slate-400 transition-all font-body disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={newsletterSubscribed}
                className="px-4 py-2.5 bg-[#bbccfb] hover:bg-white text-[#2d3f65] rounded text-xs font-bold font-sans transition-all shrink-0 flex items-center justify-center cursor-pointer disabled:bg-green-600 disabled:text-white"
              >
                {newsletterSubscribed ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              </button>
            </form>

            {newsletterSubscribed && (
              <span className="text-green-500 font-sans text-[11px] block animate-shake">
                Inscrição concluída com sucesso!
              </span>
            )}
          </div>

        </div>

        {/* Copyright and links */}
        <div className="pt-8 border-t border-[#485867] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-[#becee0] font-body" id="copyright-box">
          
          <span>{content.copyrightText}</span>
          
          <div className="flex gap-4">
            <Link href="/politica-de-privacidade" className="hover:text-[#bbccfb] transition-colors">Política de Privacidade</Link>
            <span>|</span>
            <Link href="/termos-de-uso" className="hover:text-[#bbccfb] transition-colors">Termos de Uso</Link>
          </div>

        </div>

      </div>

      {/* Floating Direct WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50 group flex items-center gap-2" id="floating-whatsapp-widget">
        <span className="bg-[#2d323e]/90 text-white text-[11px] font-bold font-sans px-3 py-1.5 rounded shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          Falar pelo WhatsApp
        </span>
        <a 
          href={whatsAppUrl} 
          target="_blank" 
          rel="noreferrer" 
          className="flex items-center justify-center h-14 w-14 bg-[#25D366] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer outline-none whatsapp-pulse"
          title="Falar pelo WhatsApp"
          id="whatsapp-floating-trigger"
        >
          <MessageCircle className="h-7 w-7 fill-white stroke-none" />
        </a>
      </div>
    </footer>
  );
}
