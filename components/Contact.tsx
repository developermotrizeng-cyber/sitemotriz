'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { SiteContent } from '../lib/defaultData';

interface ContactProps {
  content: SiteContent['contact'];
}

export default function Contact({ content }: ContactProps) {
  // Form submission status and state
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    tipoProjeto: 'Engenharia Civil / Estrutural',
    mensagem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const projectTypes = [
    'Engenharia Civil / Estrutural',
    'Construção Residencial / Comercial',
    'Obras de Infraestrutura Pública',
    'Consultoria / Viabilidade Técnica',
    'Laudos / Avaliações Técnicas'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Simple frontend validation
    if (!formData.nome.trim()) {
      setErrorMsg('Por favor, insira seu nome completo.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Por favor, insira um e-mail corporativo válido.');
      return;
    }
    if (!formData.mensagem.trim()) {
      setErrorMsg('Por favor, escreva uma breve mensagem sobre o seu projeto.');
      return;
    }

    setIsSubmitting(true);

    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: formData.nome,
        email: formData.email,
        tipoProjeto: formData.tipoProjeto,
        mensagem: formData.mensagem
      })
    })
    .then(async (res) => {
      const data = await res.json();
      if (res.ok) {
        setIsSuccess(true);
        // Reset form controls
        setFormData({
          nome: '',
          email: '',
          tipoProjeto: 'Engenharia Civil / Estrutural',
          mensagem: ''
        });
      } else {
        setErrorMsg(data.error || 'Ocorreu um erro ao enviar sua solicitação de contato por e-mail.');
      }
    })
    .catch((err) => {
      console.error('Fetch error:', err);
      setErrorMsg('Erro de conexão com o servidor. Certifique-se de que o servidor está rodando ou verifique suas credenciais.');
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <section id="contato" className="py-12 bg-[#f9f6f5] border-t border-[#E2E8F0]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-8" id="contact-info-panel">
            <div className="space-y-4">
              <span className="font-sans text-xs font-bold tracking-[0.2em] text-[#505f7c] uppercase block">
                {content.tag}
              </span>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2d3f65]" id="contact-main-heading">
                {content.title}
              </h2>
            </div>

            {/* Custom Information Cards */}
            <div className="space-y-6 pt-4" id="contact-cards">
              
              {/* Address card */}
              <div className="flex gap-4 p-5 bg-[#fcf9f8] border-l-4 border-[#2d3f65] rounded shadow-sm">
                <div className="p-3 bg-[#f0eded] rounded text-[#2d3f65] shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-sans text-xs font-bold text-[#505f7c] uppercase tracking-wider mb-1">
                    Endereço
                  </h3>
                  <p className="font-body text-sm font-light text-[#44464e] leading-snug">
                    {content.address}
                  </p>
                </div>
              </div>

              {/* Phone card */}
              <div className="flex gap-4 p-5 bg-[#fcf9f8] border-l-4 border-[#2d3f65] rounded shadow-sm">
                <div className="p-3 bg-[#f0eded] rounded text-[#2d3f65] shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-sans text-xs font-bold text-[#505f7c] uppercase tracking-wider mb-1">
                    Telefone
                  </h3>
                  <p className="font-body text-sm font-light text-[#44464e] leading-snug">
                    {content.phone}
                  </p>
                </div>
              </div>

              {/* Email card */}
              <div className="flex gap-4 p-5 bg-[#fcf9f8] border-l-4 border-[#2d3f65] rounded shadow-sm">
                <div className="p-3 bg-[#f0eded] rounded text-[#2d3f65] shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-sans text-xs font-bold text-[#505f7c] uppercase tracking-wider mb-1">
                    E-mail
                  </h3>
                  <p className="font-body text-sm font-light text-[#44464e] leading-snug">
                    {content.email}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 bg-[#fcf9f8] border border-[#E2E8F0] p-8 md:p-10 rounded shadow-md" id="contact-form-panel">
            
            {isSuccess ? (
              <div className="py-12 text-center space-y-4" id="form-success-alert">
                <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto animate-bounce" />
                <h3 className="font-sans text-2xl font-bold text-[#2d3f65]">
                  Solicitação Enviada!
                </h3>
                <p className="font-body text-[#44464e] text-sm max-w-md mx-auto leading-relaxed">
                  Agradecemos o contato. Nossa equipe técnica de engenharia analisará sua proposta e retornará em até 24 horas úteis.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-6 inline-flex text-xs font-bold tracking-wider text-[#2d3f65] underline hover:text-[#45567e]"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6" id="project-form">
                
                {errorMsg && (
                  <div className="p-4 bg-red-50 text-red-700 text-xs font-medium rounded flex items-center gap-2 border border-red-200">
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Name / Corporate Email grids */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  <div className="space-y-2">
                    <label className="block font-sans text-xs font-bold text-[#44464e] uppercase tracking-wider">
                      Nome Completo
                    </label>
                    <input 
                      type="text" 
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      placeholder={content.formNamePlaceholder}
                      className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] focus:border-[#2d3f65] focus:bg-white focus:outline-none rounded text-sm text-[#1b1c1c] transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-sans text-xs font-bold text-[#44464e] uppercase tracking-wider">
                      E-mail Corporativo
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={content.formEmailPlaceholder}
                      className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] focus:border-[#2d3f65] focus:bg-white focus:outline-none rounded text-sm text-[#1b1c1c] transition-all"
                    />
                  </div>

                </div>

                {/* Dropdown list */}
                <div className="space-y-2">
                  <label className="block font-sans text-xs font-bold text-[#44464e] uppercase tracking-wider">
                    {content.formProjectTypeLabel}
                  </label>
                  <select
                    name="tipoProjeto"
                    value={formData.tipoProjeto}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] focus:border-[#2d3f65] focus:bg-white focus:outline-none rounded text-sm text-[#1b1c1c] transition-all cursor-pointer"
                  >
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Text area */}
                <div className="space-y-2">
                  <label className="block font-sans text-xs font-bold text-[#44464e] uppercase tracking-wider">
                    Mensagem
                  </label>
                  <textarea
                    rows={4}
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleInputChange}
                    placeholder={content.formMessagePlaceholder}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] focus:border-[#2d3f65] focus:bg-white focus:outline-none rounded text-sm text-[#1b1c1c] transition-all resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#2d3f65] text-white hover:bg-[#45567e] disabled:bg-[#505f7c]/50 py-4 font-sans text-xs font-extrabold tracking-widest transition-all duration-300 rounded shadow-sm hover:shadow"
                >
                  {isSubmitting ? (
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  <span>{content.formCtaText.toUpperCase()}</span>
                </button>

              </form>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
