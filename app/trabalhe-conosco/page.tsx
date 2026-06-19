'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  User, 
  Mail, 
  Phone, 
  UploadCloud, 
  CheckCircle, 
  ArrowLeft, 
  Clock, 
  FileText, 
  DollarSign, 
  Globe 
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { SiteContent } from '../../lib/defaultData';
import { useSiteContent } from '../../hooks/use-site-content';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

function dataURLtoBlob(dataurl: string) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export default function TrabalheConoscoPage() {
  const { siteContent, setSiteContent, isMounted } = useSiteContent();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    vaga: 'ENGENHEIRO_CIVIL',
    pretensao: '',
    linkedin: '',
    mensagem: '',
    curriculoNome: '',
    curriculoData: '',
    curriculoTipo: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Sync default vacancy selection based on customizable vacancies list
  useEffect(() => {
    if (siteContent.careersPage?.vacancies && siteContent.careersPage.vacancies.length > 0) {
      const exists = siteContent.careersPage.vacancies.find(v => v.value === formData.vaga);
      if (!exists) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData(prev => ({ ...prev, vaga: siteContent.careersPage!.vacancies[0].value }));
      }
    }
  }, [siteContent, formData.vaga]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string || '';
      setFormData(prev => ({
        ...prev,
        curriculoNome: file.name,
        curriculoData: base64Data,
        curriculoTipo: file.type
      }));
    };
    reader.onerror = () => {
      console.error("Erro ao ler o arquivo.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim() || !formData.email.trim() || !formData.telefone.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios (Nome, E-mail e Telefone).");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const candidacyId = 'cand-' + Date.now();
      const submittedAtString = new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      let publicUrl = '';
      
      if (isSupabaseConfigured()) {
        try {
          if (formData.curriculoData) {
            const blob = dataURLtoBlob(formData.curriculoData);
            const fileExt = (formData.curriculoNome || 'pdf').split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
            const filePath = `${fileName}`;
            
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('resumes')
              .upload(filePath, blob, {
                contentType: formData.curriculoTipo || 'application/pdf',
                upsert: true
              });
              
            if (uploadError) {
              console.error('Erro no upload do currículo:', uploadError);
            } else {
              const { data: urlData } = supabase.storage
                .from('resumes')
                .getPublicUrl(filePath);
              publicUrl = urlData.publicUrl;
            }
          }
          
          const { error: insertError } = await supabase
            .from('candidacies')
            .insert({
              id: candidacyId,
              nome: formData.nome.trim(),
              email: formData.email.trim(),
              telefone: formData.telefone.trim(),
              vaga: formData.vaga,
              pretensao: formData.pretensao.trim() || null,
              linkedin: formData.linkedin.trim() || null,
              mensagem: formData.mensagem.trim() || null,
              curriculo_nome: formData.curriculoNome || null,
              curriculo_url: publicUrl || null
            });
          
          if (insertError) {
            console.error('Erro ao salvar candidatura no banco de dados:', insertError);
          }
        } catch (supErr) {
          console.error('Falha de conexão com o Supabase durante o envio:', supErr);
        }
      }

      const newCandidacy = {
        id: candidacyId,
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        telefone: formData.telefone.trim(),
        vaga: formData.vaga,
        pretensao: formData.pretensao.trim(),
        linkedin: formData.linkedin.trim(),
        mensagem: formData.mensagem.trim(),
        curriculoNome: formData.curriculoNome || "curriculo.pdf",
        curriculoData: formData.curriculoData || "",
        curriculoTipo: formData.curriculoTipo || "",
        curriculoUrl: publicUrl,
        submittedAt: submittedAtString
      };

      const currentCandidacies = siteContent.candidacies || [];
      const updatedContent = {
        ...siteContent,
        candidacies: [...currentCandidacies, newCandidacy]
      };

      // Persist content back directly under local storage key
      const localStorageContent = { ...updatedContent };
      delete localStorageContent.uploadedFiles;
      try {
        localStorage.setItem('motriz_landing_content', JSON.stringify(localStorageContent));
      } catch (lsErr) {
        console.warn('Erro ao salvar no LocalStorage após candidatura:', lsErr);
      }
      
      // Update local state smoothly
      setSiteContent(updatedContent);

      // Now, try sending SMTP email in background
      fetch('/api/send-candidacy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newCandidacy,
          careersEmail: siteContent.careersEmail
        })
      })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          console.warn('SMTP sending error or omitted config:', errData?.error);
        } else {
          console.log('Candidature SMTP notification dispatched successfully.');
        }
      })
      .catch((err) => {
        console.warn('Background candidacy dispatch fail details:', err);
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      });
    } catch (err) {
      console.error("Erro ao registrar candidatura local:", err);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    window.location.href = `/#${sectionId}`;
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

  return (
    <main className="min-h-screen flex flex-col bg-[#fcf9f8] text-[#1b1c1c] scroll-smooth">
      
      {/* Header block synchronized */}
      <Header 
        content={siteContent.header}
        specialties={siteContent.specialties}
        onOpenAdmin={() => { window.location.href = '/?admin=true'; }}
        isAdminActive={false}
        onScrollToSection={handleScrollToSection}
        onSelectSpecialty={() => {}}
      />

      {/* Hero Banner Section matching Portfolio style */}
      <section className="bg-[#2d323e] text-white pt-24 pb-10 relative overflow-hidden" id="careers-hero">
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
              Trabalhe Conosco
            </h1>
            <p className="font-body text-[#becee0] text-sm sm:text-base leading-relaxed font-light">
              Construa sua história na empresa de engenharia civil que mais cresce em Rondônia. Cadastre seu currículo diretamente em nosso banco de talentos virtual e faça parte da nossa equipe.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container Section */}
      <section className="max-w-4xl mx-auto px-4 py-12 flex-grow w-full">
        
        {isSubmitted ? (
          <div className="bg-white rounded-lg p-8 sm:p-12 shadow-xl text-center border border-zinc-200 space-y-6 animate-in zoom-in-95 duration-300 my-8" id="success-message">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-50 text-green-600 mb-2">
              <CheckCircle className="h-10 w-10" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-sans text-2xl font-extrabold text-[#2d3f65]">
                Candidatura Enviada!
              </h2>
              <p className="font-body text-sm text-[#505f7c] leading-relaxed max-w-md mx-auto">
                Olá, <strong className="text-[#2d3f65]">{formData.nome}</strong>. Agradecemos o interesse em fazer parte da Motriz Engenharia. Seus dados e arquivo de currículo foram salvos com sucesso em nosso banco de talentos técnicos.
              </p>
            </div>

            <div className="bg-[#fcf9f8] p-5 rounded text-left border border-zinc-100 max-w-md mx-auto space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-[#2d3f65] font-bold">
                <Briefcase className="h-4 w-4 shrink-0 text-[#2d3f65]" />
                <span className="uppercase tracking-wider">Cargo de Interesse: {formData.vaga.replace(/_/g, ' ')}</span>
              </div>
              {formData.curriculoNome && (
                <div className="flex items-center gap-2 text-zinc-600">
                  <FileText className="h-4 w-4 shrink-0 text-[#2d3f65]" />
                  <span>Arquivo: {formData.curriculoNome}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-zinc-500 font-sans mt-2 pt-2 border-t border-zinc-200">
                <Clock className="h-3.5 w-3.5" />
                <span>Nossa equipe do RH avaliará o seu perfil.</span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded text-emerald-800 text-xs max-w-md mx-auto font-sans">
              <strong>Envio para:</strong> {siteContent.careersEmail || 'rh@motrizengenharia.com.br'}
            </div>

            <div className="pt-4">
              <button 
                onClick={() => {
                  setFormData({
                    nome: '',
                    email: '',
                    telefone: '',
                    vaga: 'ENGENHEIRO_CIVIL',
                    pretensao: '',
                    linkedin: '',
                    mensagem: '',
                    curriculoNome: '',
                    curriculoData: '',
                    curriculoTipo: ''
                  });
                  setIsSubmitted(false);
                }}
                className="px-6 py-3 bg-[#2d3f65] hover:bg-[#45567e] text-white font-sans text-xs font-bold tracking-widest rounded transition-all uppercase cursor-pointer"
              >
                Enviar Outro Currículo
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Title / Info card */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
              <div className="p-4 bg-zinc-50 rounded text-4xl">💼</div>
              <div className="space-y-1 text-center sm:text-left">
                <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-[#505f7c]">
                  {siteContent.careersPage?.titlePrefix || "Processo de Seleção Contínuo"}
                </span>
                <h2 className="font-sans text-lg font-bold text-[#2d3f65]">
                  {siteContent.careersPage?.mainTitle || "Oportunidades em Tecnologia, Engenharia de Obras e Gestão"}
                </h2>
                <p className="font-body text-[#505f7c] text-xs leading-relaxed max-w-xl">
                  {siteContent.careersPage?.description || "Buscamos engenheiros civis, técnicos de edificações, mestres de obras e estagiários comprometidos com rigor metodológico, inovação e entrega pontual."}
                </p>
              </div>
            </div>

            {/* Application form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-[#E2E8F0] p-6 sm:p-10 space-y-6" id="career-form">
              <span className="font-sans text-[11px] font-extrabold text-[#7a889f] tracking-widest uppercase block border-b border-[#f3f0ef] pb-3 mb-6">
                {siteContent.careersPage?.formTitle || "FORMULÁRIO DE CADASTRO DE CURRÍCULO"}
              </span>

              {/* Grid 1: Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Nome completo */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#505f7c] flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-[#2d3f65]" />
                    <span>Nome Completo *</span>
                  </label>
                  <input 
                    type="text" 
                    name="nome"
                    required
                    placeholder="Ex: João da Silva Santos"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#2d3f65]"
                  />
                </div>

                {/* E-mail */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#505f7c] flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-[#2d3f65]" />
                    <span>E-mail Corporativo ou Pessoal *</span>
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    placeholder="Ex: joao.santos@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#2d3f65]"
                  />
                </div>

              </div>

              {/* Grid 2: Telephone and vacancys */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Telefone */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#505f7c] flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-[#2d3f65]" />
                    <span>Telefone com DDD *</span>
                  </label>
                  <input 
                    type="tel" 
                    name="telefone"
                    required
                    placeholder="Ex: (69) 99999-1234"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#2d3f65]"
                  />
                </div>

                {/* Pretensão de Vaga / Cargo */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#505f7c] flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5 text-[#2d3f65]" />
                    <span>Cargo de Interesse</span>
                  </label>
                  <select
                    name="vaga"
                    value={formData.vaga}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#2d3f65] cursor-pointer"
                  >
                    {(siteContent.careersPage?.vacancies || []).map((vac: any) => (
                      <option key={vac.value} value={vac.value}>
                        {vac.label}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Grid 3: Salary Expectation and LinkedIn */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Pretensão salarial */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#505f7c] flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 text-[#2d3f65]" />
                    <span>Pretensão Salarial Mensal (R$)</span>
                  </label>
                  <input 
                    type="text" 
                    name="pretensao"
                    placeholder="Ex: R$ 6.500,00"
                    value={formData.pretensao}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#2d3f65]"
                  />
                </div>

                {/* LinkedIn or Portfolio */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#505f7c] flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5 text-[#2d3f65]" />
                    <span>LinkedIn ou URL de Portfólio</span>
                  </label>
                  <input 
                    type="url" 
                    name="linkedin"
                    placeholder="Ex: https://linkedin.com/in/perfil"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#2d3f65] font-mono"
                  />
                </div>

              </div>

              {/* Resume Dragger (Curriculo) */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-[#505f7c] flex items-center gap-1">
                  <UploadCloud className="h-3.5 w-3.5 text-[#2d3f65]" />
                  <span>Anexar Currículo (PDF, Word ou Imagem)</span>
                </label>
                
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                    dragActive 
                      ? 'border-[#2d3f65] bg-[#becee0]/10 scale-[0.99]' 
                      : formData.curriculoNome 
                        ? 'border-green-500 bg-green-50/20' 
                        : 'border-[#c5c6cf] hover:border-[#2d3f65] bg-zinc-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <input 
                    type="file" 
                    id="curriculo-file"
                    className="hidden" 
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                  
                  <label htmlFor="curriculo-file" className="cursor-pointer space-y-2 block">
                    <UploadCloud className={`mx-auto h-10 w-10 ${formData.curriculoNome ? 'text-green-500' : 'text-[#7a889f]'}`} />
                    
                    {formData.curriculoNome ? (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-green-700 font-sans">
                          {formData.curriculoNome}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-body">
                          Arquivo anexado com sucesso. Clique para substituir.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-[#2d3f65] font-sans">
                          Arraste seu currículo aqui ou procure em seus arquivos
                        </p>
                        <p className="text-[10px] text-zinc-500 font-body">
                          PDF, DOC, DOCX ou Imagens de até 10MB
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Mensagem / Resumo profissional */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-[#505f7c]">Breve Apresentação & Mensagem</label>
                <textarea 
                  name="mensagem"
                  rows={4}
                  placeholder="Fale brevemente sobre suas principais qualificações, certificados construtivos (CREA, cursos de SST) e por que deseja trabalhar conosco..."
                  value={formData.mensagem}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#2d3f65] font-light leading-relaxed"
                />
              </div>

              {/* Form trigger submission and instructions banner */}
              <div className="pt-4 border-t border-[#f3f0ef] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[9px] text-zinc-500 leading-normal max-w-sm text-center sm:text-left">
                  Conforme a Lei Geral de Proteção de Dados (LGPD), seus dados serão armazenados de forma segura e exclusiva para recrutamento de pessoal na Motriz.
                </span>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-[#2d3f65] hover:bg-[#45567e] disabled:bg-zinc-400 text-white font-sans text-xs font-bold tracking-widest rounded transition-all uppercase cursor-pointer whitespace-nowrap"
                >
                  {isSubmitting ? 'Enviando Candidatura...' : 'Enviar Candidatura'}
                </button>
              </div>

            </form>

          </div>
        )}

      </section>

      {/* Synchronized professional layout footer */}
      <Footer 
        content={siteContent.footer} 
        onScrollToSection={handleScrollToSection}
      />

    </main>
  );
}
