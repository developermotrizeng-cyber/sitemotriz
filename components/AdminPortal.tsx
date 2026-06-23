'use client';

import React, { useState, useEffect } from 'react';
import { 
  Lock, Unlock, Save, RotateCcw, Upload, Download, Eye, 
  Trash2, Plus, ArrowLeft, Sliders, Check, AlertTriangle, 
  FileText, HelpCircle, HardHat, Compass, Wrench, Building2, Shield, Image,
  Mail, Phone, Key, Sparkles, RefreshCw, UserCheck, Edit3, ShieldAlert
} from 'lucide-react';
import { SiteContent, defaultSiteContent } from '../lib/defaultData';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface ImageSelectorProps {
  files: any[];
  value: string;
  onChange: (val: string) => void;
  label: string;
}

function ImageSelector({ files, value, onChange, label }: ImageSelectorProps) {
  if (!files || files.length === 0) return null;
  return (
    <div className="bg-[#bbccfb]/10 p-2 rounded border border-[#bbccfb]/30 mt-1.5 space-y-1 text-left">
      <span className="text-[10px] uppercase font-bold text-[#505f7c] block">{label}</span>
      <select
        value={files.some(f => f.dataUrl === value) ? value : ""}
        onChange={(e) => {
          if (e.target.value) {
            onChange(e.target.value);
          }
        }}
        className="w-full px-2 py-1.5 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none cursor-pointer"
      >
        <option value="">-- Escolher arquivo que você carregou acima --</option>
        {files.map((file) => (
          <option key={file.id} value={file.dataUrl}>
            🖼️ {file.name} ({file.size})
          </option>
        ))}
      </select>
      <p className="text-[9px] text-[#7a889f]">Selecione uma imagem da sua biblioteca local para associar a este campo.</p>
    </div>
  );
}

interface MultipleImageSelectorProps {
  files: any[];
  values: string[];
  onChange: (vals: string[]) => void;
  label: string;
}

function MultipleImageSelector({ files, values, onChange, label }: MultipleImageSelectorProps) {
  if (!files || files.length === 0) return null;
  
  const handleToggle = (dataUrl: string) => {
    let newValues = [...(values || [])];
    if (newValues.includes(dataUrl)) {
      newValues = newValues.filter(v => v !== dataUrl);
    } else {
      newValues.push(dataUrl);
    }
    onChange(newValues);
  };

  return (
    <div className="bg-[#bbccfb]/10 p-3 rounded border border-[#bbccfb]/30 mt-1.5 space-y-2 text-left">
      <span className="text-[10px] uppercase font-bold text-[#2d3f65] font-bold block">{label}</span>
      <p className="text-[9px] text-zinc-500">Marque as caixas para incluir estas imagens na galeria deste serviço:</p>
      
      <div className="max-h-36 overflow-y-auto space-y-1 bg-white p-2 border border-[#c5c6cf] rounded">
        {files.map((file) => {
          const isSelected = (values || []).includes(file.dataUrl);
          return (
            <label key={file.id} className="flex items-center space-x-2 text-xs py-1 hover:bg-[#fcf9f8] rounded px-1.5 cursor-pointer select-none">
              <input 
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(file.dataUrl)}
                className="rounded text-[#2d3f65] focus:ring-[#2d3f65] h-3.5 w-3.5 cursor-pointer"
              />
              <span className="truncate flex-1 font-body text-[#44464e]">🖼️ {file.name} <span className="text-[9px] text-[#7a889f]">({file.size})</span></span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

interface AdminPortalProps {
  content: SiteContent;
  onUpdateContent: (newContent: SiteContent) => void;
  onClose: () => void;
}

export default function AdminPortal({ content, onUpdateContent, onClose }: AdminPortalProps) {
  // Permissions & Collaborators State - persistent in LocalStorage
  const [collaborators, setCollaborators] = useState<any[]>(() => {
    const defaultMaster = {
      id: 'colab-admin',
      name: 'Administrador Master',
      email: 'developermotrizeng@gmail.com',
      role: 'Administrador Master',
      status: 'Ativo'
    };
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('motriz_collaborators');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            // Garante que o administrador master sempre exista na lista, sem remover os outros colaboradores
            const hasMaster = parsed.some(
              c => c.id === 'colab-admin' || c.email?.toLowerCase().trim() === 'developermotrizeng@gmail.com'
            );
            if (!hasMaster) {
              const updated = [defaultMaster, ...parsed];
              localStorage.setItem('motriz_collaborators', JSON.stringify(updated));
              return updated;
            }
            return parsed;
          }
        }
      }
    } catch (_) {}
    return [defaultMaster];
  });

  const saveCollaborators = async (updatedColabs: any[]) => {
    const previousColabs = [...collaborators];
    setCollaborators(updatedColabs);
    try {
      localStorage.setItem('motriz_collaborators', JSON.stringify(updatedColabs));
      
      if (isSupabaseConfigured()) {
        // 1. Identify deleted collaborators
        const deletedIds = previousColabs
          .filter(oldC => !updatedColabs.some(newC => newC.id === oldC.id))
          .map(oldC => oldC.id);
        
        if (deletedIds.length > 0) {
          const { error: delErr } = await supabase
            .from('collaborators')
            .delete()
            .in('id', deletedIds);
          if (delErr) {
            console.error('Erro ao deletar colaborador no Supabase:', delErr);
          }
        }
        
        // 2. Upsert new/updated collaborators
        const toUpsert = updatedColabs.map(c => ({
          id: c.id,
          name: c.name,
          email: c.email,
          role: c.role,
          status: c.status || 'Ativo'
        }));
        
        if (toUpsert.length > 0) {
          const { error: upsertErr } = await supabase
            .from('collaborators')
            .upsert(toUpsert);
          if (upsertErr) {
            console.error('Erro ao salvar/atualizar colaboradores no Supabase:', upsertErr);
          }
        }
      }
    } catch (err) {
      console.warn('Erro ao salvar colaboradores:', err);
    }
  };

  // Carrega a lista de colaboradores a partir do Supabase (se configurado) ao montar o painel
  useEffect(() => {
    async function loadCollaborators() {
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('collaborators')
            .select('*')
            .order('created_at', { ascending: true });
          
          if (error) {
            console.warn('Erro ao carregar colaboradores do Supabase:', error);
          } else if (data && data.length > 0) {
            const mapped = data.map((c: any) => ({
              id: c.id,
              name: c.name,
              email: c.email,
              role: c.role,
              status: c.status,
              createdAt: c.created_at ? new Date(c.created_at).toLocaleDateString('pt-BR') : undefined
            }));
            setCollaborators(mapped);
          }
        } catch (err) {
          console.warn('Falha na requisição dos colaboradores no Supabase:', err);
        }
      }
    }
    loadCollaborators();
  }, []);

  // Candidatures local and Supabase syncing states
  const [localCandidacies, setLocalCandidacies] = useState<any[]>(content.candidacies || []);

  useEffect(() => {
    setLocalCandidacies(content.candidacies || []);
  }, [content.candidacies]);

  // Load candidacies from Supabase if configured
  useEffect(() => {
    async function loadCandidacies() {
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('candidacies')
            .select('*')
            .order('submitted_at', { ascending: false });
          
          if (error) {
            console.warn('Erro ao carregar candidaturas do Supabase:', error);
          } else if (data) {
            const mapped = data.map((cand: any) => ({
              id: cand.id,
              nome: cand.nome,
              email: cand.email,
              telefone: cand.telefone,
              vaga: cand.vaga,
              pretensao: cand.pretensao,
              linkedin: cand.linkedin,
              mensagem: cand.mensagem,
              curriculoNome: cand.curriculo_nome,
              curriculoUrl: cand.curriculo_url,
              submittedAt: cand.submitted_at 
                ? new Date(cand.submitted_at).toLocaleDateString('pt-BR') + ' ' + new Date(cand.submitted_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                : ''
            }));
            setLocalCandidacies(mapped);
          }
        } catch (err) {
          console.warn('Falha na requisição de candidaturas no Supabase:', err);
        }
      }
    }
    loadCandidacies();
  }, []);

  const handleUpdateColab = (id: string) => {
    if (!editColabName.trim() || !editColabEmail.trim()) {
      alert('Nome e e-mail não podem ficar vazios.');
      return;
    }
    const emailExists = collaborators.some(
      c => c.id !== id && c.email.toLowerCase().trim() === editColabEmail.toLowerCase().trim()
    );
    if (emailExists) {
      alert('Este e-mail institucional já se encontra cadastrado para outro membro.');
      return;
    }
    const updated = collaborators.map(c => {
      if (c.id === id) {
        return {
          ...c,
          name: editColabName.trim(),
          email: editColabEmail.toLowerCase().trim(),
          role: editColabRole,
          status: editColabStatus
        };
      }
      return c;
    });
    setCollaborators(updated);
    saveCollaborators(updated);
    setEditingColabId(null);
  };

  // Upgraded Login States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState('Administrador Master');
  const [currentUserName, setCurrentUserName] = useState('');
  const [authingEmail, setAuthingEmail] = useState(''); // Email that successfully passed credentials step
  const [authingUser, setAuthingUser] = useState<any>(null);
  
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState('');
  
  // Step 2 (MFA) States
  const [mfaStep, setMfaStep] = useState(false); 
  const [selectedMfaChannel, setSelectedMfaChannel] = useState<'email' | 'sms' | 'authenticator'>('email');
  const [mfaSent, setMfaSent] = useState(false);
  const [mfaSentNotification, setMfaSentNotification] = useState('');
  const [mfaCodeEntered, setMfaCodeEntered] = useState('');
  const [simulatedMfaCode, setSimulatedMfaCode] = useState('');
  const [countdown, setCountdown] = useState(0);

  // New Collaborator form states
  const [newColabName, setNewColabName] = useState('');
  const [newColabEmail, setNewColabEmail] = useState('');
  const [newColabRole, setNewColabRole] = useState('Editor de Portfólio');
  const [newColabStatus, setNewColabStatus] = useState('Ativo');

  // Collaborator inline editing states
  const [editingColabId, setEditingColabId] = useState<string | null>(null);
  const [editColabName, setEditColabName] = useState('');
  const [editColabEmail, setEditColabEmail] = useState('');
  const [editColabRole, setEditColabRole] = useState('Editor de Portfólio');
  const [editColabStatus, setEditColabStatus] = useState('Ativo');

  // Active section inside the editor workspace
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const [resetPrompt, setResetPrompt] = useState(false);

  // Dashboard selections
  const [dashTimeframe, setDashTimeframe] = useState<'day' | 'week' | '6months' | 'year'>('week');
  const [dashGeographic, setDashGeographic] = useState<'city' | 'state' | 'region'>('state');
  const [dashActiveHoverIndex, setDashActiveHoverIndex] = useState<number | null>(null);

  // States for Trabalhe Conosco (RH) Management
  const [careersSearchQuery, setCareersSearchQuery] = useState('');
  const [careersFilterVaga, setCareersFilterVaga] = useState('ALL');
  const [activeCandidacyDetail, setActiveCandidacyDetail] = useState<any | null>(null);

  // States for customizing careers page text headings dynamically
  const [candTitlePrefix, setCandTitlePrefix] = useState('');
  const [candMainTitle, setCandMainTitle] = useState('');
  const [candDescription, setCandDescription] = useState('');
  const [candFormTitle, setCandFormTitle] = useState('');
  const [newVacancyValue, setNewVacancyValue] = useState('');
  const [newVacancyLabel, setNewVacancyLabel] = useState('');

  // Sync customizable career states on changes
  useEffect(() => {
    if (content.careersPage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCandTitlePrefix(content.careersPage.titlePrefix || '');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCandMainTitle(content.careersPage.mainTitle || '');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCandDescription(content.careersPage.description || '');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCandFormTitle(content.careersPage.formTitle || '');
    }
  }, [content.careersPage]);

  // New partner inputs
  const [newPartner, setNewPartner] = useState({ name: '', logoUrl: '' });
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [editingPartnerData, setEditingPartnerData] = useState({ name: '', logoUrl: '' });
  // Drag and Drop active state
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Temp item builders for CRUD sub-managers
  const [newSpec, setNewSpec] = useState({ title: '', description: '', icon: 'Compass', image: '', images: [] as string[], details: '' });
  const [newMvv, setNewMvv] = useState({ title: '', icon: 'Lightbulb', text: '' });
  const [editingMvvId, setEditingMvvId] = useState<string | null>(null);
  
  // Upgraded Portfolio state supporting fine details and galleries
  const [newProj, setNewProj] = useState({ 
    title: '', 
    category: 'COMERCIAL', 
    image: '', 
    images: [] as string[], 
    details: '' 
  });
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingProjData, setEditingProjData] = useState<any>({
    title: '',
    category: 'COMERCIAL',
    image: '',
    images: [] as string[],
    details: ''
  });

  // Custom File processors
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = async (file: File) => {
    // Helper para converter base64 em Blob para upload
    const dataURLtoBlob = (dataurl: string) => {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while(n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {type:mime});
    };

    const processUpload = async (finalDataUrl: string, fileName: string, fileType: string, fileSizeStr: string) => {
      let finalUrl = finalDataUrl;
      let isUploadedToCloud = false;

      if (isSupabaseConfigured() && supabase) {
        try {
          const blob = dataURLtoBlob(finalDataUrl);
          const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
          const filePath = `public/${Date.now()}-${safeName}`;

          // Tenta fazer o upload para o bucket 'media' do Supabase
          const { data, error } = await supabase.storage
            .from('media')
            .upload(filePath, blob, {
              contentType: fileType,
              cacheControl: '3600',
              upsert: true
            });

          if (!error && data) {
            const { data: publicUrlData } = supabase.storage
              .from('media')
              .getPublicUrl(filePath);
            
            if (publicUrlData?.publicUrl) {
              finalUrl = publicUrlData.publicUrl;
              isUploadedToCloud = true;
            }
          } else {
            console.warn('Erro ao subir para o Supabase Storage, usando base64 compactado como fallback:', error);
          }
        } catch (err) {
          console.warn('Falha no upload para o Supabase Storage (usando fallback base64):', err);
        }
      }

      const newFile = {
        id: `file-${Date.now()}`,
        name: isUploadedToCloud ? `${fileName} (Nuvem)` : `${fileName} (Compactado local)`,
        dataUrl: finalUrl,
        size: fileSizeStr,
        type: fileType
      };
      
      const currentList = content.uploadedFiles || [];
      const updatedList = [...currentList, newFile];
      
      onUpdateContent({
        ...content,
        uploadedFiles: updatedList
      });
    };

    if (!file.type.startsWith('image/')) {
      // Arquivos que não são imagens (PDFs, docs) são lidos normalmente
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        processUpload(dataUrl, file.name, file.type, (file.size / 1024).toFixed(1) + ' KB');
      };
      reader.readAsDataURL(file);
      return;
    }

    // Redimensionamento e compressão da imagem usando Canvas
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200; // Resolução máxima razoável para web
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          
          // Comprime para JPEG com qualidade 75%
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
          
          // Estima o tamanho final comprimido
          const stringLength = compressedDataUrl.length - 'data:image/jpeg;base64,'.length;
          const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
          const sizeInKb = (sizeInBytes / 1024).toFixed(1) + ' KB';

          const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".jpg"; // Força formato jpg leve
          processUpload(compressedDataUrl, newFileName, 'image/jpeg', sizeInKb);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeUploadedFile = (id: string) => {
    const currentList = content.uploadedFiles || [];
    const updatedList = currentList.filter(file => file.id !== id);
    onUpdateContent({
      ...content,
      uploadedFiles: updatedList
    });
  };

  const addPartner = () => {
    if (!newPartner.name.trim()) return;
    const currentPartners = content.partners?.items || [];
    const newId = `partner-${Date.now()}`;
    const logoFinal = newPartner.logoUrl.trim() || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=150&h=80&q=80';
    const updatedList = [
      ...currentPartners,
      { id: newId, name: newPartner.name, logoUrl: logoFinal }
    ];
    
    onUpdateContent({
      ...content,
      partners: {
        tag: content.partners?.tag || "NOSSOS PARCEIROS",
        title: content.partners?.title || "Empresas e órgãos que confiam na nossa engenharia",
        items: updatedList
      }
    });
    setNewPartner({ name: '', logoUrl: '' });
  };

  const removePartner = (id: string) => {
    const currentPartners = content.partners?.items || [];
    const updatedList = currentPartners.filter(item => item.id !== id);
    onUpdateContent({
      ...content,
      partners: {
        tag: content.partners?.tag || "NOSSOS PARCEIROS",
        title: content.partners?.title || "Empresas e órgãos que confiam na nossa engenharia",
        items: updatedList
      }
    });
    if (editingPartnerId === id) {
      setEditingPartnerId(null);
    }
  };

  const startEditPartner = (p: any) => {
    setEditingPartnerId(p.id);
    setEditingPartnerData({
      name: p.name,
      logoUrl: p.logoUrl
    });
  };

  const saveEditPartner = () => {
    if (!editingPartnerData.name.trim() || !editingPartnerId) return;
    const currentPartners = content.partners?.items || [];
    const updatedList = currentPartners.map((item) => {
      if (item.id === editingPartnerId) {
        return {
          ...item,
          name: editingPartnerData.name,
          logoUrl: editingPartnerData.logoUrl.trim() || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=150&h=80&q=80'
        };
      }
      return item;
    });
    onUpdateContent({
      ...content,
      partners: {
        tag: content.partners?.tag || "NOSSOS PARCEIROS",
        title: content.partners?.title || "Empresas e órgãos que confiam na nossa engenharia",
        items: updatedList
      }
    });
    setEditingPartnerId(null);
  };

  const cancelEditPartner = () => {
    setEditingPartnerId(null);
  };



  // JSON Import raw text state
  const [jsonImportText, setJsonImportText] = useState('');
  const [importFeedback, setImportFeedback] = useState({ success: false, text: '' });

  // Countdown Timer for MFA
  React.useEffect(() => {
    let interval: any = null;
    if (mfaStep && mfaSent && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (mfaStep && mfaSent && countdown === 0 && selectedMfaChannel === 'authenticator') {
      // Quando o timer do autenticador expira, gera um novo código automaticamente a cada 30 segundos
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      setSimulatedMfaCode(generatedCode);
      setCountdown(30);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mfaStep, mfaSent, countdown, selectedMfaChannel]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!email.trim()) {
      setAuthError('Por favor, informe seu e-mail de colaborador.');
      return;
    }
    if (!password.trim()) {
      setAuthError('Por favor, insira sua senha de acesso.');
      return;
    }

    // Lookup virtual users
    const matchedColab = collaborators.find(
      c => c.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (!matchedColab) {
      setAuthError('E-mail não cadastrado como colaborador autorizado.');
      return;
    }

    if (matchedColab.status !== 'Ativo') {
      setAuthError('Esta conta de colaborador está inativa. Contate o administrador mestre.');
      return;
    }

    setIsVerifyingPassword(true);
    try {
      const response = await fetch('/api/admin/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      const result = await response.json();
      if (!response.ok || !result.success) {
        setAuthError(result.error || 'Senha de segurança incorreta para o colaborador.');
        return;
      }

      // Credentials passed step 1
      setAuthingEmail(matchedColab.email);
      setAuthingUser(matchedColab);
      setMfaStep(true);
      setMfaSent(false);
      setMfaCodeEntered('');
    } catch (err: any) {
      setAuthError('Falha ao autenticar no servidor. Tente novamente mais tarde.');
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  const handleSendMfaCode = () => {
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedMfaCode(generatedCode);
    setMfaSent(true);

    if (selectedMfaChannel === 'authenticator') {
      setCountdown(30);
      setMfaSentNotification('Dispositivo autenticador pareado. Código gerado no seu App.');
      return;
    }

    if (selectedMfaChannel === 'sms') {
      setCountdown(60);
      setMfaSentNotification(`[Simulador SMS] Código enviado para o número cadastrado. Código de verificação: ${generatedCode}`);
      return;
    }

    setCountdown(60);
    setMfaSentNotification('Solicitando envio de código...');

    // Sempre tenta enviar via API. O servidor decidirá entre o SMTP do banco ou as variáveis de ambiente.
    fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: 'Autenticação Motriz',
        email: authingEmail,
        tipoProjeto: 'Código MFA',
        mensagem: `Seu código de acesso temporário ao Painel do Administrador da Motriz Engenharia é: ${generatedCode}\n\nEste código expira em 5 minutos.`
      })
    })
    .then(async (res) => {
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.warn('Erro ao disparar MFA:', errData?.error);
        
        // Exibe o código na tela caso não haja SMTP configurado (dx local)
        console.log(`[MOTRIZ MFA CODE]: ${generatedCode}`);
        setMfaSentNotification(`[Desenvolvimento] SMTP não configurado no servidor. Código (Console F12): ${generatedCode}`);
      } else {
        console.log('Notificação MFA enviada com sucesso via SMTP.');
        setMfaSentNotification('Código enviado com sucesso para o seu e-mail cadastrado.');
      }
    })
    .catch((err) => {
      console.warn('Erro de rede ao enviar MFA:', err);
      console.log(`[MOTRIZ MFA CODE]: ${generatedCode}`);
      setMfaSentNotification(`Erro de conexão. Código (Console F12): ${generatedCode}`);
    });
  };

  const handleVerifyMfaCode = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!mfaCodeEntered) {
      setAuthError('Por favor, insira o código de validação de 6 dígitos recebido.');
      return;
    }

    if (mfaCodeEntered === simulatedMfaCode) {
      setIsAuthenticated(true);
      setCurrentUserEmail(authingUser.email);
      setCurrentUserRole(authingUser.role);
      setCurrentUserName(authingUser.name);
      setMfaStep(false);
      
      if (authingUser.role === 'Editor de Portfólio') {
        setActiveTab('portfolio');
      } else {
        setActiveTab('geral');
      }
    } else {
      setAuthError('Código de segurança incorreto. Tente novamente.');
    }
  };

  const handleRequestPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSuccessMessage('');
    setAuthError('');

    if (!forgotEmail.trim()) {
      setAuthError('Por favor, preencha o campo de e-mail.');
      return;
    }

    const matched = collaborators.find(c => c.email.toLowerCase().trim() === forgotEmail.toLowerCase().trim());
    if (!matched) {
      setAuthError('Nenhum colaborador localizado com este e-mail.');
      return;
    }

    setForgotSuccessMessage(`Link de redefinição enviado com sucesso para ${forgotEmail}! Caso não encontre em 5 minutos, cheque o lixo eletrônico.`);
  };

  // Generic update helper
  const updateSection = (sectionKey: keyof SiteContent, key: string, value: any) => {
    const updated = {
      ...content,
      [sectionKey]: {
        ...(content[sectionKey] as any),
        [key]: value
      }
    };
    onUpdateContent(updated);
  };

  // Deep update helper for arrays
  const updateNestedArray = (sectionKey: 'about' | 'specialties' | 'portfolio', arrayField: string, newItemList: any[]) => {
    const updated = {
      ...content,
      [sectionKey]: {
        ...(content[sectionKey] as any),
        [arrayField]: newItemList
      }
    };
    onUpdateContent(updated);
  };

  const isTabRestricted = (tabId: string) => {
    if (tabId === 'dashboard') return false;
    if (tabId === 'smtp') return false;
    if (currentUserRole === 'Administrador Master') return false;
    if (currentUserRole === 'Visualizador') return false; 
    if (currentUserRole === 'Editor de Portfólio') {
      return tabId !== 'portfolio' && tabId !== 'files' && tabId !== 'roles' && tabId !== 'dashboard';
    }
    if (currentUserRole === 'Editor de Páginas') {
      return tabId === 'portfolio';
    }
    return false;
  };
  const saveToSystem = async () => {
    if (currentUserRole === 'Visualizador') {
      alert(`Erro: Seu cargo (${currentUserRole}) possui acesso estritamente do tipo LEITURA. Você não possui autorização para salvar alterações no site institucional.`);
      return;
    }
    setSaveStatus('saving');
    
    try {
      // Remove dados sensíveis ou confidenciais antes de persistir no banco público
      const secureContent = { ...content };
      delete secureContent.smtp;
      delete secureContent.candidacies;

      // Para evitar estourar a cota de 5MB do LocalStorage do navegador (QuotaExceededError),
      // removemos a biblioteca de mídias pesada (uploadedFiles) da cópia local.
      // O conteúdo completo com as mídias continuará sendo salvo no banco Supabase.
      const localStorageContent = { ...secureContent };
      delete localStorageContent.uploadedFiles;

      try {
        localStorage.setItem('motriz_landing_content', JSON.stringify(localStorageContent));
      } catch (lsErr) {
        console.warn('Erro ao salvar no LocalStorage (limite excedido), salvando no banco:', lsErr);
      }
      
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('site_content')
          .upsert({ id: 'motriz_landing_content', content: secureContent });
        
        if (error) {
          console.error('Erro ao salvar no Supabase:', error);
          alert(`As alterações foram salvas localmente, mas não puderam ser sincronizadas com o banco de dados Supabase: ${error.message}`);
        }
      }
      setSaveStatus('success');
    } catch (err: any) {
      console.error('Erro ao salvar alterações:', err);
      alert(`Erro ao salvar alterações no sistema: ${err.message || err}`);
      setSaveStatus('idle');
    } finally {
      setTimeout(() => setSaveStatus('idle'), 2500);
    }
  };

  // Reset core setup to defaults
  const resetToDefault = async () => {
    if (currentUserRole !== 'Administrador Master') {
      alert(`Negado: Apenas colaboradores com cargo de "Administrador Master" podem resetar o site para os parâmetros de fábrica.`);
      setResetPrompt(false);
      return;
    }
    
    const freshDefault = JSON.parse(JSON.stringify(defaultSiteContent));
    onUpdateContent(freshDefault);
    localStorage.removeItem('motriz_landing_content');
    
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('site_content')
          .upsert({ id: 'motriz_landing_content', content: freshDefault });
        if (error) {
          console.error('Erro ao resetar no Supabase:', error);
          alert(`Conteúdo local redefinido, mas ocorreu um erro no Supabase: ${error.message}`);
        }
      } catch (err: any) {
        console.error('Erro no reset remoto:', err);
      }
    }
    
    setResetPrompt(false);
    setSaveStatus('success');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  // Export system parameters
  const exportSetup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(content, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "motriz_backup_landing_page.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import uploaded parameters
  const handleImportJson = async (e: React.FormEvent) => {
    e.preventDefault();
    setImportFeedback({ success: false, text: '' });
    try {
      const parsed = JSON.parse(jsonImportText);
      if (parsed && typeof parsed === 'object' && parsed.header && parsed.hero && parsed.about) {
        onUpdateContent(parsed);
        setImportFeedback({ success: true, text: 'Configurações importadas e aplicadas com sucesso!' });
        setJsonImportText('');
        // Save automatically
        const localStorageParsed = { ...parsed };
        delete localStorageParsed.uploadedFiles;
        try {
          localStorage.setItem('motriz_landing_content', JSON.stringify(localStorageParsed));
        } catch (lsErr) {
          console.warn('Erro ao salvar importação no LocalStorage:', lsErr);
        }
        
        if (isSupabaseConfigured()) {
          const { error } = await supabase
            .from('site_content')
            .upsert({ id: 'motriz_landing_content', content: parsed });
          if (error) {
            console.error('Erro ao salvar importação no Supabase:', error);
            alert(`Configuração importada localmente, mas erro ao sincronizar com o Supabase: ${error.message}`);
          }
        }
      } else {
        setImportFeedback({ success: false, text: 'O JSON fornecido não possui a estrutura correta do site.' });
      }
    } catch {
      setImportFeedback({ success: false, text: 'Formato JSON inválido. Verifique o texto colado.' });
    }
  };

  // Specialty CRUD logic
  const addSpecialty = () => {
    if (!newSpec.title.trim() || !newSpec.description.trim()) return;
    const currentList = [...(content.specialties.items || [])];
    const newId = `spec-${Date.now()}`;
    currentList.push({
      id: newId,
      ...newSpec
    });
    updateNestedArray('specialties', 'items', currentList);
    setNewSpec({ title: '', description: '', icon: 'Compass', image: '', images: [], details: '' });
  };

  const [editingSpecialtyId, setEditingSpecialtyId] = useState<string | null>(null);

  const updateSpecialtyField = (id: string, field: string, value: any) => {
    const newList = (content.specialties.items || []).map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateNestedArray('specialties', 'items', newList);
  };

  const removeSpecialty = (id: string) => {
    const currentList = (content.specialties.items || []).filter((item) => item.id !== id);
    updateNestedArray('specialties', 'items', currentList);
    if (editingSpecialtyId === id) {
      setEditingSpecialtyId(null);
    }
  };

  // MVV CRUD handler functions
  const addMvv = () => {
    if (!newMvv.title.trim() || !newMvv.text.trim()) return;
    const currentList = [...(content.about.mvv || [])];
    const newId = `mvv-${Date.now()}`;
    currentList.push({
      id: newId,
      ...newMvv
    });
    updateNestedArray('about', 'mvv', currentList);
    setNewMvv({ title: '', icon: 'Lightbulb', text: '' });
  };

  const updateMvvField = (id: string, field: string, value: any) => {
    const newList = (content.about.mvv || []).map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateNestedArray('about', 'mvv', newList);
  };

  const removeMvv = (id: string) => {
    const currentList = (content.about.mvv || []).filter((item) => item.id !== id);
    updateNestedArray('about', 'mvv', currentList);
    if (editingMvvId === id) {
      setEditingMvvId(null);
    }
  };

  // Portfolio CRUD logic
  const addProject = () => {
    if (!newProj.title.trim()) return;
    const currentList = [...(content.portfolio.items || [])];
    const newId = `proj-${Date.now()}`;
    // Fallback if image URL is empty
    const finalImg = newProj.image.trim() || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80";
    currentList.push({
      id: newId,
      title: newProj.title,
      category: newProj.category,
      image: finalImg,
      images: newProj.images.length > 0 ? newProj.images : [finalImg],
      details: newProj.details
    });
    updateNestedArray('portfolio', 'items', currentList);
    setNewProj({ title: '', category: 'COMERCIAL', image: '', images: [], details: '' });
  };

  const removeProject = (id: string) => {
    const currentList = (content.portfolio.items || []).filter((item) => item.id !== id);
    updateNestedArray('portfolio', 'items', currentList);
    if (editingProjectId === id) {
      setEditingProjectId(null);
    }
  };

  const startEditProject = (proj: any) => {
    setEditingProjectId(proj.id);
    setEditingProjData({
      title: proj.title,
      category: proj.category,
      image: proj.image,
      images: proj.images || [proj.image],
      details: proj.details || ''
    });
  };

  const saveEditProject = () => {
    if (!editingProjData.title.trim() || !editingProjectId) return;
    const currentList = [...(content.portfolio.items || [])];
    const updatedList = currentList.map((item) => {
      if (item.id === editingProjectId) {
        const finalImg = editingProjData.image.trim() || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80";
        return {
          ...item,
          title: editingProjData.title,
          category: editingProjData.category,
          image: finalImg,
          images: editingProjData.images && editingProjData.images.length > 0 ? editingProjData.images : [finalImg],
          details: editingProjData.details
        };
      }
      return item;
    });
    updateNestedArray('portfolio', 'items', updatedList);
    setEditingProjectId(null);
  };

  const cancelEditProject = () => {
    setEditingProjectId(null);
  };

  // Security Wall (Before input panels load)
  if (!isAuthenticated) {
    return (
      <section className="min-h-screen bg-[#1c1f26] flex items-center justify-center p-4 relative" id="admin-security-wall">
        {/* Background construction grid blueprint */}
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />

        <div className="relative z-10 w-full max-w-lg bg-white border border-[#E2E8F0] p-8 rounded shadow-2xl space-y-6">
          
          {/* SCREEN: FORGOT PASSWORD */}
          {isForgotPasswordMode ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center space-y-2">
                <div className="inline-flex p-4 rounded-full bg-[#fcf9f8] text-[#2d3f65] mb-2">
                  <Key className="h-8 w-8 text-[#2d3f65] animate-bounce" />
                </div>
                <h2 className="font-sans text-2xl font-bold text-[#2d3f65]">
                  Recuperar Acesso
                </h2>
                <p className="font-body text-xs text-[#505f7c]">
                  Insira seu e-mail de colaborador para enviarmos as instruções de redefinição de acesso.
                </p>
              </div>

              <form onSubmit={handleRequestPasswordReset} className="space-y-4">
                <div className="space-y-1 text-left">
                  <label className="block font-sans text-[10px] font-bold text-[#44464e] uppercase tracking-wider">
                    E-mail Cadastrado
                  </label>
                  <input 
                    type="email"
                    placeholder="exemplo@motriz.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] focus:border-[#2d3f65] focus:bg-white focus:outline-none rounded text-xs text-[#1b1c1c] transition-all"
                  />
                </div>

                {authError && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded text-center border border-red-200">
                    {authError}
                  </div>
                )}

                {forgotSuccessMessage && (
                  <div className="p-4 bg-green-50 text-green-800 text-xs font-medium rounded border border-green-200 space-y-2">
                    <p className="font-semibold">{forgotSuccessMessage}</p>
                    <p className="text-[11px] text-green-700 font-mono bg-white p-2 rounded border border-green-100">
                      [SIMULADOR] Simulação de envio completada com sucesso. Você pode voltar ao login e usar a senha mestra para testar.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#2d3f65] hover:bg-[#45567e] text-white py-3 font-sans text-xs font-bold tracking-widest transition-all rounded"
                >
                  <Mail className="h-4 w-4" />
                  <span>SOLICITAR INSTRUÇÕES</span>
                </button>
              </form>

              <div className="border-t border-[#f0eded] pt-4 text-center">
                <button
                  onClick={() => {
                    setIsForgotPasswordMode(false);
                    setAuthError('');
                    setForgotSuccessMessage('');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-[#2d3f65] hover:underline font-bold"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Voltar ao Login</span>
                </button>
              </div>
            </div>
          ) : mfaStep ? (
            /* SCREEN: TWO-FACTOR AUTH (MFA) */
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center space-y-2">
                <div className="inline-flex p-4 rounded-full bg-[#bbccfb]/20 text-[#2d3f65] mb-2">
                  <Shield className="h-8 w-8 text-[#2d3f65] animate-pulse" />
                </div>
                <h2 className="font-sans text-2xl font-bold text-[#2d3f65] flex items-center justify-center gap-2">
                  Autenticação MFA
                </h2>
                <p className="font-body text-xs text-[#505f7c]">
                  Olá, <strong className="text-zinc-800">{authingUser?.name}</strong>. Para garantir a segurança dos dados corporativos, conclua a verificação em duas etapas.
                </p>
              </div>

              <div className="border-y border-[#f0eded] py-4 space-y-4">
                <span className="block font-sans text-[10px] font-bold text-[#44464e] uppercase tracking-wider text-center">
                  Escolha o seu canal preferencial de MFA:
                </span>
                
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'email', label: 'E-mail', icon: Mail },
                    { id: 'sms', label: 'SMS', icon: Phone },
                    { id: 'authenticator', label: 'App OTP', icon: Key }
                  ].map((chan) => {
                    const Icon = chan.icon;
                    const isActive = selectedMfaChannel === chan.id;
                    return (
                      <button
                        key={chan.id}
                        type="button"
                        onClick={() => {
                          setSelectedMfaChannel(chan.id as any);
                          setMfaSent(false);
                        }}
                        className={`p-3 rounded-lg border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-[#2d3f65] text-white border-[#2d3f65] shadow-md' 
                            : 'bg-[#fcf9f8] text-[#505f7c] border-[#c5c6cf] hover:bg-[#bbccfb]/10'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-[10px] font-bold">{chan.label}</span>
                      </button>
                    );
                  })}
                </div>

                {!mfaSent ? (
                  <button
                    type="button"
                    onClick={handleSendMfaCode}
                    className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-900 text-white rounded font-sans text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2"
                  >
                    {selectedMfaChannel === 'authenticator' ? (
                      <>
                        <Key className="h-3.5 w-3.5" />
                        <span>Gerar Token do App Autenticador</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin-slow" />
                        <span>Enviar Código de Confirmação</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded p-4 text-center space-y-3 animate-in fade-in duration-300">
                    {selectedMfaChannel === 'authenticator' ? (
                      <div className="space-y-3 text-left">
                        <span className="block text-[10px] uppercase font-bold text-emerald-800 text-center">
                          🔐 APP TOTP AUTENTICADOR ATIVO
                        </span>
                        <div className="flex items-center gap-4 bg-white p-3 rounded border border-emerald-100">
                          {/* Beautiful SVG QR code mockup */}
                          <div className="w-20 h-20 bg-zinc-100 rounded border border-zinc-200 flex items-center justify-center p-1 shrink-0">
                            <svg className="w-full h-full text-[#2d3f65]" viewBox="0 0 100 100" fill="currentColor">
                              <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                              <rect x="12" y="12" width="11" height="11" />
                              <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                              <rect x="77" y="12" width="11" height="11" />
                              <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                              <rect x="12" y="77" width="11" height="11" />
                              
                              <rect x="40" y="10" width="8" height="20" />
                              <rect x="55" y="5" width="10" height="10" />
                              <rect x="40" y="40" width="20" height="20" />
                              <rect x="10" y="40" width="20" height="8" />
                              <rect x="70" y="40" width="15" height="15" />
                              <rect x="70" y="60" width="25" height="10" />
                              <rect x="45" y="70" width="10" height="25" />
                              <rect x="60" y="80" width="35" height="15" />
                            </svg>
                          </div>
                          <div className="text-xs space-y-1 text-zinc-700">
                            <p className="font-bold">Para parear seu aplicativo:</p>
                            <p className="text-[10px] text-zinc-500 leading-normal">Escaneie o QR Code acima ou insira a chave:</p>
                            <code className="bg-zinc-100 text-[#2d3f65] font-mono px-1.5 py-0.5 rounded font-bold block text-[10px] w-fit">
                              MOTR-IZEN-GENH-ARIA-2026
                            </code>
                          </div>
                        </div>
                        <div className="bg-[#bbccfb]/15 border border-[#bbccfb]/40 rounded p-2.5 text-center">
                          <span className="block text-[9px] uppercase font-bold text-[#2d3f65] tracking-wider mb-1">
                            🤖 Modo Simulação (Painel OTP Virtual):
                          </span>
                          <span className="text-xl font-mono font-black text-[#2d3f65] tracking-widest block py-1">
                            {simulatedMfaCode.slice(0, 3)} {simulatedMfaCode.slice(3)}
                          </span>
                          <div className="flex items-center justify-center gap-1.5 mt-1">
                            <div className="w-3 h-3 rounded-full border border-[#2d3f65] border-t-transparent animate-spin" />
                            <span className="text-[9px] text-[#505f7c]">
                              Atualiza em <strong>{countdown}s</strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : selectedMfaChannel === 'sms' ? (
                      <div className="space-y-2 text-left">
                        <span className="block text-[10px] uppercase font-bold text-emerald-800 text-center">
                          📱 CÓDIGO ENVIADO VIA SMS
                        </span>
                        <p className="text-[11px] text-[#2d3f65] font-medium leading-relaxed text-center">
                          Enviamos uma mensagem SMS para o número cadastrado.
                        </p>
                        <div className="bg-[#bbccfb]/15 border border-[#bbccfb]/40 rounded p-2.5 text-center">
                          <span className="block text-[9px] uppercase font-bold text-[#2d3f65] tracking-wider mb-1">
                            🤖 Modo Simulação (SMS recebido):
                          </span>
                          <span className="text-xl font-mono font-black text-[#2d3f65] tracking-widest block py-1">
                            {simulatedMfaCode.slice(0, 3)} {simulatedMfaCode.slice(3)}
                          </span>
                          <span className="text-[9px] text-[#505f7c]">
                            Expira em <strong>{countdown}s</strong>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="block text-[10px] uppercase font-bold text-emerald-800">
                          🔐 CÓDIGO DE CONFIRMAÇÃO ENVIADO
                        </span>
                        <p className="text-[11px] text-[#2d3f65] font-medium leading-relaxed">
                          {mfaSentNotification}
                        </p>
                        <p className="text-[10px] text-zinc-500 leading-none">
                          Expira em <strong>{countdown}s</strong>
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {mfaSent && (
                <form onSubmit={handleVerifyMfaCode} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block font-sans text-[10px] font-bold text-center text-[#44464e] uppercase tracking-wider">
                      Insira o Código de 6 Dígitos
                    </label>
                    <input 
                      type="text"
                      maxLength={6}
                      placeholder="------"
                      value={mfaCodeEntered}
                      onChange={(e) => setMfaCodeEntered(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 bg-[#f6f3f2] tracking-widest border border-[#c5c6cf] focus:border-[#2d3f65] focus:bg-white focus:outline-none rounded text-lg font-bold text-center font-mono"
                    />
                  </div>

                  {authError && (
                    <div className="p-2 bg-red-50 text-red-700 text-xs font-bold rounded text-center border border-red-200">
                      {authError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3.5 font-sans text-xs font-bold tracking-widest transition-all rounded shadow-sm"
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>CONCLUIR LOGIN E VALIDAR</span>
                  </button>
                </form>
              )}

              <div className="border-t border-[#f0eded] pt-3 text-center flex justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setMfaStep(false);
                    setMfaSent(false);
                    setAuthError('');
                  }}
                  className="text-[#505f7c] hover:text-[#2d3f65] hover:underline"
                >
                  Editar e-mail / senha
                </button>
                <button
                  type="button"
                  disabled={countdown > 0}
                  onClick={handleSendMfaCode}
                  className={`text-[#2d3f65] font-bold hover:underline ${countdown > 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  Reenviar Token
                </button>
              </div>
            </div>
          ) : (
            /* SCREEN: STANDARD CREDENTIALS ENTRY (Email + Password) */
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="text-center space-y-2">
                <div className="inline-flex p-4 rounded-full bg-[#f6f3f2] text-[#2d3f65] mb-1">
                  <Lock className="h-8 w-8 text-[#2d3f65]" />
                </div>
                <h2 className="font-sans text-2xl font-bold text-[#2d3f65]">
                  Acesso Restrito
                </h2>
                <p className="font-body text-xs text-[#505f7c]">
                  Insira suas credenciais de colaborador para acessar o painel de manutenção.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1 text-left">
                  <label className="block font-sans text-[10px] font-bold text-[#44464e] uppercase tracking-wider">
                    E-mail Institucional
                  </label>
                  <input 
                    type="email"
                    placeholder="exemplo@motriz.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] focus:border-[#2d3f65] focus:bg-white focus:outline-none rounded text-xs text-[#1b1c1c] transition-all"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <div className="flex justify-between items-center">
                    <label className="block font-sans text-[10px] font-bold text-[#44464e] uppercase tracking-wider">
                      Senha de Segurança
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPasswordMode(true);
                        setForgotEmail(email);
                        setAuthError('');
                      }}
                      className="text-[10px] text-[#2d3f65] hover:underline font-bold"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                  <input 
                    type="password"
                    placeholder="Sua senha mestre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] focus:border-[#2d3f65] focus:bg-white focus:outline-none rounded text-xs text-[#1b1c1c] transition-all"
                  />
                </div>

                {authError && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded text-center border border-red-200">
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isVerifyingPassword}
                  className="w-full flex items-center justify-center gap-2 bg-[#2d3f65] text-white hover:bg-[#45567e] py-3.5 font-sans text-xs font-extrabold tracking-widest transition-all rounded shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifyingPassword ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Unlock className="h-4 w-4" />
                  )}
                  <span>{isVerifyingPassword ? 'VERIFICANDO...' : 'ENTRAR COM SEGURANÇA'}</span>
                </button>
              </form>

              <div className="border-t border-[#f0eded] pt-3 text-center">
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-xs text-[#505f7c] hover:text-[#2d3f65] font-semibold"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Voltar ao Site Público</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </section>
    );
  }

  // Authenticated Workspace Header Panel
  return (
    <section className="min-h-screen bg-[#f0eded] text-[#1b1c1c] flex flex-col" id="admin-workspace">
      
      {/* Workspace Header actions bar */}
      <div className="bg-[#2d323e] text-white border-b border-zinc-800 py-4 px-4 sm:px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-600 rounded text-white text-xs font-bold shrink-0 animate-pulse">
              CONEXÃO SEGURA
            </div>
            <div>
              <h1 className="font-sans text-lg font-bold tracking-tight text-white leading-tight">
                Painel do Administrador
              </h1>
              <p className="font-body text-[11px] text-[#becee0] tracking-wide">
                Modifique a arquitetura, textos ou cards em tempo real. Suas edições atualizam o site instantaneamente.
              </p>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <span className="inline-flex items-center gap-1 bg-[#1a2333] border border-zinc-800 text-zinc-200 font-sans text-[10px] px-2 py-0.5 rounded font-semibold uppercase">
                  Colaborador: <strong className="text-[#becee0]">{currentUserName || 'Mestre'}</strong>
                </span>
                <span className="inline-flex items-center gap-1 bg-[#21293a] text-[#becee0] font-sans text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                  Nível de Acesso: <strong className="text-white bg-green-900 border border-green-700 px-1 py-0.2 rounded font-mono">{currentUserRole}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Core admin actions toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            
            <button
              onClick={saveToSystem}
              disabled={saveStatus === 'saving'}
              className="px-3.5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Salvar alterações no Cache"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{saveStatus === 'saving' ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>

            <button
              onClick={() => setResetPrompt(true)}
              className="px-3.5 py-2.5 bg-[#485867] hover:bg-red-700 text-white hover:text-white rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Restaurar originais"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restaurar Originais</span>
            </button>

            <button
              onClick={exportSetup}
              className="px-3 py-2.5 border border-zinc-700 hover:bg-zinc-800 text-white rounded text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              title="Baixar Backup JSON"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Exportar JSON</span>
            </button>

            <button
              onClick={onClose}
              className="px-3.5 py-2.5 bg-[#bbccfb] text-[#2d3f65] hover:bg-white hover:text-[#2d3f65] rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Visualizar site ao vivo"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Visualizar Site</span>
            </button>

          </div>
        </div>
      </div>

      {/* Main split-view or stacked editor sections */}
      <div className="flex-grow max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6">
        
        {/* Reset Confirmation Panel */}
        {resetPrompt && (
          <div className="lg:col-span-12 p-5 bg-red-50 border-2 border-red-200 text-red-900 rounded space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600 shrink-0" />
              <div>
                <h4 className="font-sans font-bold text-sm">Tem certeza que deseja restaurar as configurações originais?</h4>
                <p className="font-body text-xs text-red-700">Todas as modificações de texto, imagens e novos cards adicionados serão permanentemente desfeitos e o site retornará ao layout padrão da Motriz Engenharia.</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button 
                onClick={resetToDefault}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold"
              >
                Confirmar e Restaurar
              </button>
              <button 
                onClick={() => setResetPrompt(false)}
                className="px-3.5 py-2 bg-zinc-300 hover:bg-zinc-400 text-zinc-900 rounded text-xs font-bold"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Successfully saved status notification */}
        {saveStatus === 'success' && (
          <div className="lg:col-span-12 p-3 bg-green-500 text-white rounded text-center text-xs font-semibold flex items-center justify-center gap-2 animate-in slide-in-from-top-2 duration-300">
            <Check className="h-4 w-4" />
            <span>Configurações salvas permanentemente no cache local de manutenção!</span>
          </div>
        )}

        {/* Left editor navigation tabs */}
        <div className="col-span-1 lg:col-span-3 flex flex-col space-y-1">
          <span className="font-sans text-[10px] font-bold text-[#505f7c] uppercase tracking-widest px-3 py-2">
            Categorias do Site
          </span>
          {[
            { id: 'dashboard', label: '📊 Dashboard de Acessos', count: 'KPI' },
            { id: 'files', label: '★ Central de Arquivos (Imagens)', count: 'Up' },
            { id: 'geral', label: 'Cabeçalho e Temas', count: '1' },
            { id: 'hero', label: 'Banner Principal (Hero)', count: '2' },
            { id: 'about', label: 'Seção Quem Somos', count: '3' },
            { id: 'specialties', label: 'Especialidades Técnicas', count: '4' },
            { id: 'portfolio', label: 'Portfólio de Obras', count: '5' },
            { id: 'partners', label: 'Clientes & Parceiros', count: '6' },
            { id: 'contact', label: 'Fale Conosco e Endereço', count: '7' },
            { id: 'smtp', label: '📧 Configuração de E-mail (SMTP)', count: 'SMTP' },
            { id: 'footer', label: 'Rodapé e Redes Sociais', count: '8' },
            { id: 'trabalhe_conosco', label: '💼 Trabalhe Conosco (RH)', count: 'RH' },
            { id: 'roles', label: '🛡 Colaboradores & Permissões', count: '9' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-left px-4 py-3 rounded text-sm font-semibold flex justify-between items-center transition-all ${
                activeTab === tab.id
                  ? 'bg-[#2d3f65] text-white shadow-sm'
                  : 'bg-white hover:bg-[#e5e2e1] text-[#44464e] border border-[#E2E8F0]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded leading-none ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#e5e2e1] text-[#44464e]'}`}>
                {tab.count}
              </span>
            </button>
          ))}

          {/* Backup Importer Box bottom of navigation */}
          <div className="bg-white border border-[#E2E8F0] p-4 rounded text-left space-y-3 pt-6">
            <span className="font-sans text-[10px] font-bold text-[#44464e] uppercase tracking-wider block">
              Restaurar via Importar JSON
            </span>
            <p className="font-body text-[11px] text-[#505f7c] leading-relaxed">
              Cole um JSON exportado do site anteriormente para carregar as alterações instantaneamente:
            </p>
            <form onSubmit={handleImportJson} className="space-y-2">
              <textarea 
                rows={3}
                placeholder='Cole as configurações JSON aqui...'
                value={jsonImportText}
                onChange={(e) => setJsonImportText(e.target.value)}
                className="w-full p-2 bg-[#f6f3f2] border border-[#c5c6cf] focus:outline-none rounded text-[10px] font-mono whitespace-pre resize-none"
              />
              <button
                onClick={handleImportJson}
                className="w-full flex justify-center items-center gap-1 bg-[#2d3f65] hover:bg-[#45567e] text-white py-1.5 rounded text-[11px] font-bold"
              >
                <Upload className="h-3 w-3" />
                <span>Enviar Configuração</span>
              </button>
            </form>
            {importFeedback.text && (
              <span className={`text-[10px] block mt-1 ${importFeedback.success ? 'text-green-600' : 'text-red-600'}`}>
                {importFeedback.text}
              </span>
            )}
          </div>
        </div>

        {/* Right editor details panel */}
        <div className="col-span-1 lg:col-span-9 bg-white border border-[#E2E8F0] p-6 sm:p-8 rounded shadow-sm">
          
          {/* Read-Only Visualizador Banner */}
          {currentUserRole === 'Visualizador' && (
            <div className="mb-6 p-4 bg-[#bbccfb]/10 border-l-4 border-[#2d3f65] rounded text-[#2d3f65] flex items-start gap-2.5">
              <Shield className="h-5 w-5 text-[#2d3f65] shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold">Acesso de Leitura (Visualizador):</span> Você está navegando com privilégios de demonstração. Sinta-se à vontade para simular modificações nos inputs de todas as abas, mas lembre-se que o salvamento persistente está bloqueado para seu cargo.
              </div>
            </div>
          )}

          {/* Permission restriction shield */}
          {isTabRestricted(activeTab) ? (
            <div className="p-8 text-center space-y-4 max-w-md mx-auto justify-center bg-red-50/50 border border-red-100 rounded-lg py-12">
              <div className="inline-flex p-4 rounded-full bg-red-50 text-red-700">
                <ShieldAlert className="h-10 w-10 text-red-700" />
              </div>
              <div className="space-y-2">
                <h3 className="font-sans text-base font-bold text-red-900 uppercase">Acesso Restrito ao Cargo</h3>
                <p className="font-body text-xs text-red-700 leading-relaxed">
                  Desculpe, seu cargo corporativo ativo (<strong className="underline text-red-800">{currentUserRole}</strong>) não possui privilégios de modificação para a aba <strong>&quot;{activeTab.toUpperCase()}&quot;</strong>.
                </p>
                <p className="text-[11px] text-zinc-500 italic">
                  Para editar as demais seções, por favor alterne para as abas disponibilizadas para sua alçada ou entre em contato com o Administrador Master.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* TAB: DASHBOARD DE ACESSOS */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6" id="editor-dashboard">
                  <div className="border-b border-[#f0eded] pb-4 flex flex-col md:flex-row md:items-center md:justify-between justify-start gap-4">
                    <div>
                      <h3 className="font-sans text-lg font-bold text-[#2d3f65]">Painel de Controle de Tráfego e Audiência</h3>
                      <p className="font-body text-xs text-[#505f7c]">
                        Métricas de navegação, relatórios geográficos e insights de conversão para o site da Motriz Engenharia.
                      </p>
                    </div>
                    {/* Pulsing Live indicator */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 border border-green-200.5 rounded-full text-[11px] font-bold tracking-wide w-fit font-sans">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <span>Métricas em Tempo Real</span>
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* card 1 */}
                    <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-sm space-y-2">
                      <span className="text-[10px] font-sans font-extrabold tracking-widest text-[#505f7c] uppercase">Visitas Únicas</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-sans text-zinc-800 tracking-tight">48.253</span>
                        <span className="text-xs text-green-600 font-semibold font-sans flex items-center">+12,4%</span>
                      </div>
                      <p className="text-[10px] text-zinc-500">Acumulado do período atual vs anterior</p>
                    </div>

                    {/* card 2 */}
                    <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-sm space-y-2">
                      <span className="text-[10px] font-sans font-extrabold tracking-widest text-[#505f7c] uppercase">Engajamento Médio</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-sans text-zinc-800 tracking-tight">3m 48s</span>
                        <span className="text-xs text-green-600 font-semibold font-sans flex items-center">+4,2s</span>
                      </div>
                      <p className="text-[10px] text-zinc-500">Tempo de foco nas obras do Portfólio</p>
                    </div>

                    {/* card 3 */}
                    <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-sm space-y-2">
                      <span className="text-[10px] font-sans font-extrabold tracking-widest text-[#505f7c] uppercase">Taxa de Rejeição</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-sans text-zinc-800 tracking-tight">28,4%</span>
                        <span className="text-xs text-emerald-600 font-semibold font-sans flex items-center">-1,8%</span>
                      </div>
                      <p className="text-[10px] text-zinc-500">Otimização de velocidade e LCP</p>
                    </div>

                    {/* card 4 */}
                    <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-sm space-y-2">
                      <span className="text-[10px] font-sans font-extrabold tracking-widest text-[#505f7c] uppercase">Contatos Iniciados</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-sans text-zinc-800 tracking-tight">154</span>
                        <span className="text-xs text-amber-600 font-semibold font-sans flex items-center">+8,5%</span>
                      </div>
                      <p className="text-[10px] text-zinc-500">Formulários + cliques diretos no WhatsApp</p>
                    </div>
                  </div>

                  {/* Main Interactive Graph container */}
                  <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between justify-start gap-3 border-b border-[#f0eded] pb-3">
                      <div>
                        <h4 className="font-sans text-sm font-bold text-[#2d3f65]">Curva Dinâmica de Acessos</h4>
                        <p className="text-[11px] text-[#505f7c]">Exibindo flutuação de audiência por período.</p>
                      </div>

                      {/* Timeframe Controls */}
                      <div className="flex items-center gap-1 bg-[#fcf9f8] p-1 rounded-lg border border-zinc-200.5">
                        {(['day', 'week', '6months', 'year'] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => {
                              setDashTimeframe(t);
                              setDashActiveHoverIndex(null);
                            }}
                            className={`px-3 py-1 rounded text-[10px] font-bold font-sans tracking-wide transition-all uppercase select-none cursor-pointer ${
                              dashTimeframe === t
                                ? 'bg-[#2d3f65] text-white shadow-xs'
                                : 'text-zinc-600 hover:bg-zinc-100'
                            }`}
                          >
                            {t === 'day' ? 'Dia' : t === 'week' ? 'Semana' : t === '6months' ? '6 meses' : 'Ano'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chart Core calculations and rendering */}
                    {(() => {
                      // points generation
                      let currentPoints: { label: string; value: number }[] = [];
                      let labelTitle = '';

                      if (dashTimeframe === 'day') {
                        labelTitle = 'Média Horária (Hoje)';
                        currentPoints = [
                          { label: '08:00', value: 124 },
                          { label: '10:00', value: 382 },
                          { label: '12:00', value: 512 },
                          { label: '14:00', value: 894 }, // Peak
                          { label: '16:00', value: 651 },
                          { label: '18:00', value: 442 },
                          { label: '20:00', value: 310 },
                          { label: '22:00', value: 148 }
                        ];
                      } else if (dashTimeframe === 'week') {
                        labelTitle = 'Média Diária (Esta Semana)';
                        currentPoints = [
                          { label: 'Segunda', value: 1840 },
                          { label: 'Terça', value: 2420 },
                          { label: 'Quarta', value: 2210 },
                          { label: 'Quinta', value: 2540 },
                          { label: 'Sexta', value: 2120 },
                          { label: 'Sábado', value: 890 },
                          { label: 'Domingo', value: 610 }
                        ];
                      } else if (dashTimeframe === '6months') {
                        labelTitle = 'Acessos Mensais (Últimos 6 Meses)';
                        currentPoints = [
                          { label: 'Janeiro', value: 3200 },
                          { label: 'Fevereiro', value: 3845 },
                          { label: 'Março', value: 4120 },
                          { label: 'Abril', value: 4680 },
                          { label: 'Maio', value: 5210 },
                          { label: 'Junho', value: 4950 }
                        ];
                      } else {
                        labelTitle = 'Consolidado Mensal (Último Ano)';
                        currentPoints = [
                          { label: 'Jul/25', value: 2100 },
                          { label: 'Ago/25', value: 2310 },
                          { label: 'Set/25', value: 2540 },
                          { label: 'Out/25', value: 2890 },
                          { label: 'Nov/25', value: 3120 },
                          { label: 'Dez/25', value: 2450 },
                          { label: 'Jan/26', value: 3200 },
                          { label: 'Fev/26', value: 3845 },
                          { label: 'Mar/26', value: 4120 },
                          { label: 'Abr/26', value: 4680 },
                          { label: 'Mai/26', value: 5210 },
                          { label: 'Jun/26', value: 4950 }
                        ];
                      }

                      const maxVal = Math.max(...currentPoints.map(p => p.value));
                      const chartHeight = 160;
                      const chartWidth = 500;
                      const paddingX = 35;
                      const paddingY = 25;

                      // Calculate SVG points coordinates
                      const svgPoints = currentPoints.map((p, idx) => {
                        const x = paddingX + (idx * (chartWidth - paddingX * 2)) / (currentPoints.length - 1);
                        const y = chartHeight - paddingY - (p.value / (maxVal || 1)) * (chartHeight - paddingY * 2);
                        return { x, y, label: p.label, value: p.value };
                      });

                      // M point L points string
                      const pathD = svgPoints.length === 0 ? '' : `M ${svgPoints[0].x} ${svgPoints[0].y} ` + svgPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
                      
                      // Gradient fill area path
                      const areaD = svgPoints.length === 0 ? '' : `${pathD} L ${svgPoints[svgPoints.length - 1].x} ${chartHeight - paddingY} L ${svgPoints[0].x} ${chartHeight - paddingY} Z`;

                      return (
                        <div className="space-y-4">
                          {/* Inner Chart Header with exact dynamic values */}
                          <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-500 py-1 bg-[#fcf9f8] px-3 rounded border border-zinc-100">
                            <div>Metodologia: {labelTitle}</div>
                            <div className="text-[#2d3f65]">
                              Pico: {maxVal.toLocaleString('pt-BR')} visualizações
                            </div>
                          </div>

                          {/* SVG Render Container */}
                          <div className="relative aspect-[16/6] md:aspect-[24/7] w-full bg-[#fdfdfd] border border-zinc-100 rounded-lg p-2">
                            <svg 
                              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                              className="w-full h-full overflow-visible"
                            >
                              <defs>
                                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#2d3f65" stopOpacity="0.25" />
                                  <stop offset="100%" stopColor="#2d3f65" stopOpacity="0.01" />
                                </linearGradient>
                              </defs>

                              {/* Horizontal background grid lines */}
                              {[0, 0.25, 0.5, 0.75, 1].map((ratio, gridIdx) => {
                                const gridY = paddingY + ratio * (chartHeight - paddingY * 2);
                                return (
                                  <g key={gridIdx}>
                                    <line
                                      x1={paddingX}
                                      y1={gridY}
                                      x2={chartWidth - paddingX}
                                      y2={gridY}
                                      stroke="#E2E8F0"
                                      strokeWidth="0.5"
                                      strokeDasharray="4 4"
                                    />
                                    {/* Left Axis label values */}
                                    <text
                                      x={paddingX - 6}
                                      y={gridY + 3}
                                      fontSize="7"
                                      fontFamily="monospace"
                                      textAnchor="end"
                                      fill="#a1a1aa"
                                    >
                                      {Math.round(maxVal - ratio * maxVal).toLocaleString('pt-BR')}
                                    </text>
                                  </g>
                                );
                              })}

                              {/* Gradient Area under curve */}
                              <path d={areaD} fill="url(#chartGrad)" />

                              {/* Main Line path */}
                              <path
                                d={pathD}
                                fill="none"
                                stroke="#2d3f65"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />

                              {/* Grid lines and interactive hover pointers */}
                              {svgPoints.map((pt, pIdx) => (
                                <g 
                                  key={pIdx}
                                  onMouseEnter={() => setDashActiveHoverIndex(pIdx)}
                                  onMouseLeave={() => setDashActiveHoverIndex(null)}
                                  className="cursor-pointer"
                                >
                                  {/* Vertical line indicator on hover */}
                                  {dashActiveHoverIndex === pIdx && (
                                    <line
                                      x1={pt.x}
                                      y1={paddingY}
                                      x2={pt.x}
                                      y2={chartHeight - paddingY}
                                      stroke="#2d3f65"
                                      strokeWidth="1.2"
                                      strokeDasharray="2 2"
                                    />
                                  )}

                                  {/* Invisible massive circle representing interaction area */}
                                  <circle
                                    cx={pt.x}
                                    cy={pt.y}
                                    r="14"
                                    fill="transparent"
                                  />

                                  {/* Beautiful aesthetic nodes on line */}
                                  <circle
                                    cx={pt.x}
                                    cy={pt.y}
                                    r={dashActiveHoverIndex === pIdx ? "5" : "3.5"}
                                    fill={dashActiveHoverIndex === pIdx ? "#2d3f65" : "white"}
                                    stroke="#2d3f65"
                                    strokeWidth="1.5"
                                    className="transition-all duration-150"
                                  />

                                  {/* Label axis values below */}
                                  <text
                                    x={pt.x}
                                    y={chartHeight - paddingY + 12}
                                    fontSize="7.5"
                                    fontFamily="sans-serif"
                                    fontWeight="600"
                                    fill={dashActiveHoverIndex === pIdx ? "#2d3f65" : "#71717a"}
                                    textAnchor="middle"
                                  >
                                    {pt.label}
                                  </text>
                                </g>
                              ))}
                            </svg>

                            {/* Floating Card Tooltip on Hover */}
                            {dashActiveHoverIndex !== null && svgPoints[dashActiveHoverIndex] && (
                              <div 
                                className="absolute bg-[#2d3f65] text-white p-2.5 rounded-lg shadow-lg text-[11px] font-sans pointer-events-none transition-all z-20 space-y-1 animate-in zoom-in-95 duration-150 border border-white/20"
                                style={{
                                  left: `${Math.min(
                                    Math.max(10, (svgPoints[dashActiveHoverIndex].x / chartWidth) * 100 - 10),
                                    80
                                  )}%`,
                                  top: "10%"
                                }}
                              >
                                <span className="block text-[9px] uppercase tracking-wider font-extrabold text-[#becee0]">
                                  {svgPoints[dashActiveHoverIndex].label}
                                </span>
                                <div className="font-mono text-xs flex items-center gap-1">
                                  <strong>{svgPoints[dashActiveHoverIndex].value.toLocaleString('pt-BR')}</strong>
                                  <span className="text-emerald-300 font-extrabold text-[9px]">Acessos</span>
                                </div>
                              </div>
                            )}

                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Geolocation Section & Brazil interactive Map */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Geolocation Controls and listing */}
                    <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-5">
                      <div className="flex items-center justify-between border-b border-[#f0eded] pb-2">
                        <div>
                          <h4 className="font-sans text-sm font-bold text-[#2d3f65]">Segregação Geográfica</h4>
                          <p className="text-[11px] text-[#505f7c]">Dados de audiência por localização do usuário.</p>
                        </div>

                        {/* Geo subtabs */}
                        <div className="flex bg-[#fcf9f8] p-0.5 rounded border border-zinc-200 text-[9px] font-bold">
                          {(['state', 'city', 'region'] as const).map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setDashGeographic(g)}
                              className={`px-2 py-1 rounded transition-all select-none cursor-pointer ${
                                dashGeographic === g
                                  ? 'bg-[#2d3f65] text-white shadow-xs'
                                  : 'text-zinc-600'
                              }`}
                            >
                              {g === 'state' ? 'Estados' : g === 'city' ? 'Cidades' : 'Regiões'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Display table of geographic metric elements */}
                      <div className="space-y-3.5">
                        {(() => {
                          let geoData: { name: string; value: number; share: number; color: string }[] = [];
                          
                          if (dashGeographic === 'state') {
                            geoData = [
                              { name: 'São Paulo (SP)', value: 20266, share: 42, color: 'bg-[#2d3f65]' },
                              { name: 'Minas Gerais (MG)', value: 5307, share: 11, color: 'bg-[#45567e]' },
                              { name: 'Paraná (PR)', value: 4825, share: 10, color: 'bg-emerald-600' },
                              { name: 'Rio de Janeiro (RJ)', value: 2412, share: 5, color: 'bg-indigo-500' },
                              { name: 'Outros Estados', value: 15443, share: 32, color: 'bg-zinc-400' }
                            ];
                          } else if (dashGeographic === 'city') {
                            geoData = [
                              { name: 'São Paulo', value: 11580, share: 24, color: 'bg-[#2d3f65]' },
                              { name: 'Belo Horizonte', value: 4728, share: 10, color: 'bg-[#45567e]' },
                              { name: 'Curitiba', value: 3957, share: 8, color: 'bg-emerald-600' },
                              { name: 'Rio de Janeiro', value: 2412, share: 5, color: 'bg-indigo-500' },
                              { name: 'Campinas', value: 2123, share: 4, color: 'bg-sky-500' },
                              { name: 'Outras Cidades', value: 23453, share: 49, color: 'bg-zinc-400' }
                            ];
                          } else {
                            geoData = [
                              { name: 'Região Sudeste', value: 27986, share: 58, color: 'bg-[#2d3f65]' },
                              { name: 'Região Sul', value: 10615, share: 22, color: 'bg-emerald-605' },
                              { name: 'Região Nordeste', value: 4825, share: 10, color: 'bg-[#45567e]' },
                              { name: 'Região Centro-Oeste', value: 3377, share: 7, color: 'bg-indigo-500' },
                              { name: 'Região Norte', value: 1447, share: 3, color: 'bg-zinc-400' }
                            ];
                          }

                          return (
                            <div className="space-y-3">
                              {geoData.map((item, index) => (
                                <div key={index} className="space-y-1">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-zinc-700">{item.name}</span>
                                    <div className="space-x-2 font-mono text-zinc-500 text-[11px]">
                                      <span><strong>{item.value.toLocaleString('pt-BR')}</strong> acessos</span>
                                      <span className="text-zinc-400">({item.share}%)</span>
                                    </div>
                                  </div>
                                  {/* Progress bar visualizer */}
                                  <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                                      style={{ width: `${item.share}%` }}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Stylized high-fidelity SVG Brazil Hotspot Visualizer Map */}
                    <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                      <div>
                        <h4 className="font-sans text-sm font-bold text-[#2d3f65]">Hotspots de Operação</h4>
                        <p className="text-[11px] text-[#505f7c]">Concentração nas sedes de projetos de alto escalão.</p>
                      </div>

                      {/* Map Drawing representation in pure responsive vector coordinates */}
                      <div className="relative flex items-center justify-center p-2 rounded-lg bg-zinc-50/50 border border-zinc-100/50 my-auto">
                        <svg 
                          viewBox="0 0 200 210" 
                          className="w-[170px] h-[180px] drop-shadow-sm text-zinc-300"
                        >
                          {/* Brazil overall outline path (styled simplified accurate visualization vector) */}
                          <path 
                            d="M60 20 L80 15 L120 20 L150 45 L170 80 L180 100 L160 120 L150 140 L120 185 L105 200 L95 195 L80 170 L60 170 L42 150 L38 135 L48 115 L40 103 L45 85 L28 75 L30 55 L50 35 Z" 
                            fill="#E2E8F0" 
                            stroke="#CBD5E1" 
                            strokeWidth="1.5"
                          />

                          {/* Regional operational states boundaries overlay */}
                          {/* SP/RJ Southeast Area */}
                          <path 
                            d="M100 135 L122 131 L140 135 L135 150 L115 155 Z" 
                            fill="#bbccfb" 
                            stroke="#94a3b8" 
                            strokeWidth="1"
                            opacity="0.8"
                          />

                          {/* South Area (PR, SC, RS) */}
                          <path 
                            d="M115 155 L130 150 L115 185 L95 195 L85 180 L95 160 Z" 
                            fill="#a7f3d0" 
                            stroke="#34d399" 
                            strokeWidth="1"
                            opacity="0.8"
                          />

                          {/* Pulsate Nodes on Map (Cities) */}
                          {/* SP Node */}
                          <g className="cursor-pointer">
                            <circle cx="118" cy="144" r="6" fill="#2d3f65" className="animate-ping" opacity="0.3"/>
                            <circle cx="118" cy="144" r="4.5" fill="#2d3f65" />
                            <text x="110" y="140" fontSize="7" fontWeight="bold" fill="#1e293b" fontFamily="sans-serif">São Paulo (HQ)</text>
                          </g>

                          {/* BH/MG Node */}
                          <g className="cursor-pointer">
                            <circle cx="132" cy="128" r="5" fill="#2d3f65" className="animate-ping" opacity="0.25"/>
                            <circle cx="132" cy="128" r="3.5" fill="#45567e" />
                            <text x="135" y="125" fontSize="6.5" fontWeight="bold" fill="#475569" fontFamily="sans-serif">Belo Horizonte</text>
                          </g>

                          {/* Curitiba Node */}
                          <g className="cursor-pointer">
                            <circle cx="106" cy="165" r="5" fill="#047857" className="animate-ping" opacity="0.3"/>
                            <circle cx="106" cy="165" r="3.5" fill="#059669" />
                            <text x="112" y="169" fontSize="6.5" fontWeight="bold" fill="#047857" fontFamily="sans-serif">Curitiba</text>
                          </g>

                          {/* Rio Node */}
                          <g className="cursor-pointer">
                            <circle cx="138" cy="142" r="4" fill="#4f46e5" />
                            <text x="142" y="146" fontSize="6" fontWeight="semibold" fill="#4f46e5" fontFamily="sans-serif">Rio de Janeiro</text>
                          </g>
                        </svg>
                      </div>

                      {/* Map legends */}
                      <div className="bg-[#bbccfb]/10 border border-[#bbccfb]/20 rounded-lg p-3 text-[11px] text-[#2d3f65]">
                        <span className="font-bold flex items-center gap-1">📍 Escritórios da Motriz Engenharia:</span>
                        <p className="text-zinc-600 pt-0.5 font-body leading-relaxed">
                          Nossa atuação estrutural de alta fidelidade está centralizada no eixo <strong>São Paulo - Minas Gerais - Paraná</strong>.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Other Interesting Insights Bar and Devices card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Insights card */}
                    <div className="bg-[#2d3f65] text-white rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] font-sans font-bold tracking-widest text-[#becee0] uppercase block">Ação Recomendada</span>
                        <h4 className="font-sans text-sm font-bold text-white leading-tight">Insight de Posicionamento Técnico do Site</h4>
                        <p className="text-xs text-slate-200 font-body leading-relaxed pt-1">
                          A seção <strong>&quot;Portfólio de Obras&quot;</strong> retém impressionantes <strong>54.2%</strong> de todo o tempo de tela dos clientes que acessam o site, seguida de perto por <strong>&quot;Fale Conosco&quot; (24.8%)</strong>.
                        </p>
                      </div>
                      
                      <div className="bg-white/10 p-3 rounded-lg text-xs space-y-1.5 border border-white/10">
                        <span className="font-bold">Dica de Conversão de Clientes:</span>
                        <p className="text-slate-300 text-[11px]">
                          As visitas de São Paulo possuem 3x mais probabilidade de registrar proposta. Recomendamos sempre manter fotos completas de obras feitas no estado nas primeiras posições de exibição!
                        </p>
                      </div>
                    </div>

                    {/* Devices & Channels Card */}
                    <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
                      <div>
                        <h4 className="font-sans text-sm font-bold text-[#2d3f65]">Canais de Origem & Dispositivos</h4>
                        <p className="text-[11px] text-[#505f7c]">Como e por onde chegam os nossos clientes em potencial.</p>
                      </div>

                      <div className="space-y-3.5">
                        {/* Device bar 1 */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-zinc-700">Desktop / Notebook</span>
                            <span className="font-bold text-[#2d3f65]">61%</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#2d3f65] rounded-full" style={{ width: '61%' }}></div>
                          </div>
                        </div>

                        {/* Device bar 2 */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-zinc-700">Mobile (Celulares)</span>
                            <span className="font-bold text-amber-500">35%</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '35%' }}></div>
                          </div>
                        </div>

                        {/* Device bar 3 */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-zinc-700">Tablets / Outros</span>
                            <span className="font-bold text-zinc-400">4%</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-zinc-300 rounded-full" style={{ width: '4%' }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-[#f0eded] pt-3 flex justify-between text-[11px] text-zinc-500 font-mono">
                        <span>LinkedIn de Engenharia: <strong>38%</strong></span>
                        <span>Tráfego Direto: <strong>45%</strong></span>
                        <span>Google Search: <strong>17%</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* TAB 1: GERAL & HEADER */}
              {activeTab === 'geral' && (
                <div className="space-y-6" id="editor-geral">
              <div className="border-b border-[#f0eded] pb-4">
                <h3 className="font-sans text-lg font-bold text-[#2d3f65]">Cabeçalho & Geral</h3>
                <p className="font-body text-xs text-[#505f7c]">Configure a marca e as palavras-chave do cabeçalho de navegação rápido.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block font-sans text-xs font-bold text-[#44464e] uppercase">Nome Logo Principal</label>
                  <input 
                    type="text" 
                    value={content.header.logoName} 
                    onChange={(e) => updateSection('header', 'logoName', e.target.value)}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-sm focus:outline-none focus:border-[#2d3f65]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-sans text-xs font-bold text-[#44464e] uppercase">Slogan Logo Secundário</label>
                  <input 
                    type="text" 
                    value={content.header.logoSubtitle} 
                    onChange={(e) => updateSection('header', 'logoSubtitle', e.target.value)}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-sm focus:outline-none focus:border-[#2d3f65]"
                  />
                </div>
              </div>

              <h4 className="font-sans text-xs font-bold text-[#2d3f65] uppercase tracking-wider border-t border-[#f0eded] pt-4">Nomes dos Botões e Links Rápidos</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">Botão CTA Cabeçalho</label>
                  <input 
                    type="text" 
                    value={content.header.ctaText} 
                    onChange={(e) => updateSection('header', 'ctaText', e.target.value)}
                    className="w-full px-3 py-2 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs focus:outline-none focus:border-[#2d3f65]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">Link Início</label>
                  <input 
                    type="text" 
                    value={content.header.navHome} 
                    onChange={(e) => updateSection('header', 'navHome', e.target.value)}
                    className="w-full px-3 py-2 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">Link Quem Somos</label>
                  <input 
                    type="text" 
                    value={content.header.navAbout} 
                    onChange={(e) => updateSection('header', 'navAbout', e.target.value)}
                    className="w-full px-3 py-2 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">Link Especialidades</label>
                  <input 
                    type="text" 
                    value={content.header.navSpecialties} 
                    onChange={(e) => updateSection('header', 'navSpecialties', e.target.value)}
                    className="w-full px-3 py-2 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">Link Portfólio</label>
                  <input 
                    type="text" 
                    value={content.header.navPortfolio} 
                    onChange={(e) => updateSection('header', 'navPortfolio', e.target.value)}
                    className="w-full px-3 py-2 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">Link Contato</label>
                  <input 
                    type="text" 
                    value={content.header.navContact} 
                    onChange={(e) => updateSection('header', 'navContact', e.target.value)}
                    className="w-full px-3 py-2 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">Link Clientes/Parceiros</label>
                  <input 
                    type="text" 
                    value={content.header.navPartners || ''} 
                    onChange={(e) => updateSection('header', 'navPartners', e.target.value)}
                    className="w-full px-3 py-2 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs focus:outline-none"
                    placeholder="CLIENTES"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">Sub-link História (&quot;Quem Somos&quot;)</label>
                  <input 
                    type="text" 
                    value={content.header.navHistoryLabel || ''} 
                    onChange={(e) => updateSection('header', 'navHistoryLabel', e.target.value)}
                    className="w-full px-3 py-2 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs focus:outline-none"
                    placeholder="NOSSA HISTÓRIA"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">Sub-link MVV (&quot;Quem Somos&quot;)</label>
                  <input 
                    type="text" 
                    value={content.header.navMvvLabel || ''} 
                    onChange={(e) => updateSection('header', 'navMvvLabel', e.target.value)}
                    className="w-full px-3 py-2 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs focus:outline-none"
                    placeholder="MISSÃO, VISÃO E VALORES"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HERO */}
          {activeTab === 'hero' && (
            <div className="space-y-6" id="editor-hero">
              <div className="border-b border-[#f0eded] pb-4">
                <h3 className="font-sans text-lg font-bold text-[#2d3f65]">Banner Principal (Hero)</h3>
                <p className="font-body text-xs text-[#505f7c]">Gerencie o texto chamativo, legenda e a imagem de fundo que impactam ao carregar o site.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block font-sans text-xs font-bold text-[#44464e] uppercase">Slogan Central Gigante (Headline)</label>
                  <input 
                    type="text" 
                    value={content.hero.title} 
                    onChange={(e) => updateSection('hero', 'title', e.target.value)}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-sm focus:outline-none focus:border-[#2d3f65] font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-sans text-xs font-bold text-[#44464e] uppercase">Sub-descrição Principal</label>
                  <textarea 
                    rows={3}
                    value={content.hero.subtitle} 
                    onChange={(e) => updateSection('hero', 'subtitle', e.target.value)}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-sm focus:outline-none focus:border-[#2d3f65] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block font-sans text-xs font-bold text-[#44464e] uppercase">Imagem de Fundo (URL)</label>
                    <input 
                      type="text" 
                      value={content.hero.backgroundUrl} 
                      onChange={(e) => updateSection('hero', 'backgroundUrl', e.target.value)}
                      className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-sm focus:outline-none text-xs font-mono"
                    />
                    <ImageSelector 
                      files={content.uploadedFiles || []}
                      value={content.hero.backgroundUrl} 
                      onChange={(val) => updateSection('hero', 'backgroundUrl', val)} 
                      label="Ou use um arquivo carregado:" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-sans text-xs font-bold text-[#44464e] uppercase">Label do Botão</label>
                    <input 
                      type="text" 
                      value={content.hero.ctaText} 
                      onChange={(e) => updateSection('hero', 'ctaText', e.target.value)}
                      className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block font-sans text-xs font-bold text-[#44464e] uppercase">Tags Tecnológicas de Rodapé (Separadas por vírgula)</label>
                  <input 
                    type="text" 
                    value={content.hero.bottomTags.join(', ')} 
                    onChange={(e) => {
                      const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                      updateSection('hero', 'bottomTags', tags);
                    }}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-sm focus:outline-none tracking-wider font-mono text-xs"
                    placeholder="ESTRUTURA, TECNOLOGIA, RESULTADO"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ABOUT */}
          {activeTab === 'about' && (
            <div className="space-y-6" id="editor-about">
              <div className="border-b border-[#f0eded] pb-4">
                <h3 className="font-sans text-lg font-bold text-[#2d3f65]">Seção Quem Somos</h3>
                <p className="font-body text-xs text-[#505f7c]">Gerencie as referências institucionais da Motriz Engenharia e suas estatísticas de sucesso.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2 sm:col-span-1">
                  <label className="block font-sans text-xs font-bold text-[#44464e] uppercase">Tag da Seção</label>
                  <input 
                    type="text" 
                    value={content.about.tag} 
                    onChange={(e) => updateSection('about', 'tag', e.target.value)}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="block font-sans text-xs font-bold text-[#44464e] uppercase">Título de Impacto</label>
                  <input 
                    type="text" 
                    value={content.about.title} 
                    onChange={(e) => updateSection('about', 'title', e.target.value)}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-sm focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-sans text-xs font-bold text-[#44464e] uppercase">Texto de Apresentação Corporativa</label>
                <textarea 
                  rows={4}
                  value={content.about.description} 
                  onChange={(e) => updateSection('about', 'description', e.target.value)}
                  className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-sm focus:outline-none focus:border-[#2d3f65] resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-sans text-xs font-bold text-[#44464e] uppercase">Fotografia Lateral (URL)</label>
                <input 
                  type="text" 
                  value={content.about.imageUrl} 
                  onChange={(e) => updateSection('about', 'imageUrl', e.target.value)}
                  className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-sm focus:outline-none font-mono text-xs"
                />
                <ImageSelector 
                  files={content.uploadedFiles || []}
                  value={content.about.imageUrl} 
                  onChange={(val) => updateSection('about', 'imageUrl', val)} 
                  label="Ou use um arquivo carregado:" 
                />
              </div>

              {/* Stats editors */}
              <h4 className="font-sans text-xs font-bold text-[#2d3f65] uppercase tracking-wider border-t border-[#f0eded] pt-4">Indicadores Corporativos</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {content.about.stats.map((stat, idx) => (
                  <div key={stat.id} className="p-4 bg-[#f6f3f2] border border-[#c5c6cf] rounded space-y-2">
                    <span className="font-sans text-[10px] font-bold text-zinc-500 uppercase block">Indicador #{idx+1}</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="text-[9px] text-[#44464e] uppercase block font-semibold">Valor</label>
                        <input 
                          type="text" 
                          value={stat.value}
                          onChange={(e) => {
                            const statsCopy = [...content.about.stats];
                            statsCopy[idx].value = e.target.value;
                            updateNestedArray('about', 'stats', statsCopy);
                          }}
                          className="w-full px-2 py-1.5 bg-white border border-[#c5c6cf] rounded text-sm focus:outline-none font-bold"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[9px] text-[#44464e] uppercase block font-semibold">Legenda</label>
                        <input 
                          type="text" 
                          value={stat.label}
                          onChange={(e) => {
                            const statsCopy = [...content.about.stats];
                            statsCopy[idx].label = e.target.value;
                            updateNestedArray('about', 'stats', statsCopy);
                          }}
                          className="w-full px-2 py-1.5 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Missão, Visão e Valores (MVV) CRUD Section */}
              <h4 className="font-sans text-xs font-bold text-[#2d3f65] uppercase tracking-wider border-t border-[#f0eded] pt-6 mt-6 block">
                Missão, Visão e Valores (CRUD)
              </h4>
              <p className="text-[11px] text-[#505f7c] -mt-2 block">Edite ou crie novos pilares institucionais para a seção de apresentação institucional.</p>
              
              <div className="space-y-4">
                {/* List of current pilares */}
                <div className="space-y-3" id="mvv-list">
                  {((content.about.mvv) || []).map((item, idx) => {
                    const isEditing = editingMvvId === item.id;
                    return (
                      <div key={item.id} className="p-4 bg-white border border-[#c5c6cf] rounded-md shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-sans text-xs font-bold text-[#2d3f65] uppercase bg-[#bbccfb]/20 px-2.5 py-1 rounded">
                              {item.title || `Pilar #${idx + 1}`}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">({item.icon})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingMvvId(isEditing ? null : item.id)}
                              className="px-2 py-1 text-[10px] font-bold text-[#2d3f65] hover:bg-[#bbccfb]/10 rounded border border-[#bbccfb]/40 transition-all cursor-pointer"
                            >
                              {isEditing ? 'CONCLUÍDO' : 'EDITAR'}
                            </button>
                            <button
                              type="button"
                              onClick={() => removeMvv(item.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-all cursor-pointer"
                              title="Remover Pilar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Summary / Read-only or editing state inputs */}
                        {isEditing ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <div className="space-y-1">
                              <label className="text-[9px] text-[#44464e] font-semibold uppercase block">Título do Pilar</label>
                              <input 
                                type="text"
                                value={item.title}
                                onChange={(e) => updateMvvField(item.id, 'title', e.target.value)}
                                className="w-full px-2 py-1.5 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] text-[#44464e] font-semibold uppercase block">Seleção do Ícone</label>
                              <select
                                value={item.icon}
                                onChange={(e) => updateMvvField(item.id, 'icon', e.target.value)}
                                className="w-full px-2 py-1.5 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs focus:outline-none cursor-pointer"
                              >
                                <option value="Lightbulb">💡 Visão (Lightbulb)</option>
                                <option value="Gem">💎 Valores (Gem)</option>
                                <option value="Target">🎯 Expertise (Target)</option>
                                <option value="Shield">🛡️ Missão (Shield)</option>
                                <option value="Compass">🧭 Direção (Compass)</option>
                                <option value="HardHat">🏗️ Construção (HardHat)</option>
                              </select>
                            </div>
                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-[9px] text-[#44464e] font-semibold uppercase block">Texto Descritivo</label>
                              <textarea
                                rows={2}
                                value={item.text}
                                onChange={(e) => updateMvvField(item.id, 'text', e.target.value)}
                                className="w-full px-3 py-2 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs focus:outline-none resize-none"
                              />
                            </div>
                          </div>
                        ) : (
                          <p className="font-body text-xs text-[#44464e] leading-relaxed italic pl-2 border-l-2 border-[#bbccfb]">
                            {item.text}
                          </p>
                        )}
                      </div>
                    );
                  })}
                  {(!content.about.mvv || content.about.mvv.length === 0) && (
                    <div className="text-center p-6 bg-white border border-dashed border-[#c5c6cf] rounded-md text-xs text-zinc-500">
                      Nenhum pilar cadastrado ainda. Use o formulário abaixo para criar um!
                    </div>
                  )}
                </div>

                {/* Form to add a new pillar */}
                <div className="p-4 bg-[#fbf9f8] border border-[#c5c6cf] rounded-md space-y-3">
                  <span className="font-sans text-[10px] font-bold text-[#2d3f65] uppercase block tracking-wider">Adicionar Novo Pilar Institucional</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-[#44464e] font-semibold uppercase block">Título do Pilar (ex: MISSÃO)</label>
                      <input 
                        type="text"
                        placeholder="Ex: MISSÃO"
                        value={newMvv.title}
                        onChange={(e) => setNewMvv(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-[#44464e] font-semibold uppercase block">Ícone</label>
                      <select
                        value={newMvv.icon}
                        onChange={(e) => setNewMvv(prev => ({ ...prev, icon: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="Lightbulb">💡 Visão (Lightbulb)</option>
                        <option value="Gem">💎 Valores (Gem)</option>
                        <option value="Target">🎯 Expertise (Target)</option>
                        <option value="Shield">🛡️ Missão (Shield)</option>
                        <option value="Compass">🧭 Direção (Compass)</option>
                        <option value="HardHat">🏗️ Construção (HardHat)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-[#44464e] font-semibold uppercase block">Texto Descritivo</label>
                    <textarea 
                      rows={2}
                      placeholder="Descreva o propósito, valores ou focos institucionais..."
                      value={newMvv.text}
                      onChange={(e) => setNewMvv(prev => ({ ...prev, text: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addMvv}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#2d3f65] hover:bg-[#45567e] text-white rounded text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>ADICIONAR PILAR</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SPECIALTIES ACCORDION CRUD */}
          {activeTab === 'specialties' && (
            <div className="space-y-6" id="editor-specialties">
              <div className="border-b border-[#f0eded] pb-4">
                <h3 className="font-sans text-lg font-bold text-[#2d3f65]">Especialidades Técnicas</h3>
                <p className="font-body text-xs text-[#505f7c]">Adicione, remova ou edite os cards de especialidades técnicas oferecidos pela engenharia.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block font-sans text-xs font-bold text-[#44464e] uppercase">Slogan</label>
                  <input 
                    type="text" 
                    value={content.specialties.tag} 
                    onChange={(e) => updateSection('specialties', 'tag', e.target.value)}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="block font-sans text-xs font-bold text-[#44464e] uppercase">Título da Seção de Serviços</label>
                  <input 
                    type="text" 
                    value={content.specialties.title} 
                    onChange={(e) => updateSection('specialties', 'title', e.target.value)}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-sm focus:outline-none font-semibold"
                  />
                </div>
              </div>

              {/* Specialties CRUD editor list */}
              <h4 className="font-sans text-xs font-bold text-[#2d3f65] uppercase tracking-wider border-t border-[#f0eded] pt-4">Cards de Atuação Cadastrados</h4>
              <div className="space-y-3" id="admin-specialties-items">
                {content.specialties.items.map((item, idx) => {
                  const isEditing = editingSpecialtyId === item.id;
                  
                  return (
                    <div key={item.id} className="flex flex-col p-4 bg-[#fcf9f8] border border-[#E2E8F0] hover:border-[#2d3f65] rounded gap-4 transition-all" id={`editing-spec-item-${item.id}`}>
                      {/* Item Header Info */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold bg-zinc-200 text-[#44464e] px-1.5 rounded">{idx+1}</span>
                            <span className="font-sans text-sm font-bold text-[#2d3f65]">{item.title}</span>
                            <span className="bg-[#bbccfb] text-[#2d3f65] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono">{item.icon}</span>
                          </div>
                          {!isEditing && (
                            <p className="font-body text-xs text-[#505f7c] line-clamp-2 leading-relaxed">{item.description}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => setEditingSpecialtyId(isEditing ? null : item.id)}
                            className="bg-zinc-100 hover:bg-[#eae8e7] text-[#2d3f65] text-xs font-bold px-3 py-1.5 border border-[#c5c6cf] rounded flex items-center gap-1 cursor-pointer transition-colors"
                            title="Editar Atributos da Especialidade"
                          >
                            <Wrench className="h-3.5 w-3.5" />
                            <span>{isEditing ? 'Fechar' : 'Editar 100%'}</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => removeSpecialty(item.id)}
                            className="text-red-600 hover:bg-red-50 p-2 rounded transition-all cursor-pointer"
                            title="Deletar Especialidade"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Inline Editor Form */}
                      {isEditing && (
                        <div className="w-full border-t border-dashed border-zinc-200 pt-4 mt-2 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Title input */}
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-zinc-500 block">Título do Serviço</label>
                              <input 
                                type="text"
                                value={item.title}
                                onChange={(e) => updateSpecialtyField(item.id, 'title', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none"
                              />
                            </div>
                            
                            {/* Icon input */}
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-zinc-500 block">Ícone Representativo</label>
                              <select
                                value={item.icon}
                                onChange={(e) => updateSpecialtyField(item.id, 'icon', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none cursor-pointer"
                              >
                                <option value="Zap">Zap (Projeto Elétrico)</option>
                                <option value="Layers">Layers (Estrutural)</option>
                                <option value="Milestone">Milestone (Asfalto/Rodovias)</option>
                                <option value="Network">Network (Redes e Dados)</option>
                                <option value="Snowflake">Snowflake (Climatização)</option>
                                <option value="Droplet">Droplet (Hidrossanitário)</option>
                                <option value="Flame">Flame (Prevenção de Incêndio)</option>
                                <option value="Compass">Compass (Arquitetônico/Engenharia)</option>
                                <option value="Wrench">Wrench (Manutenção)</option>
                                <option value="Building2">Building (Edificações)</option>
                                <option value="Hammer">Hammer (Instalações)</option>
                                <option value="Shield">Shield (Segurança)</option>
                              </select>
                            </div>
                          </div>

                          {/* Cover Image input */}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-zinc-500 block">URL da Imagem Capa Principal</label>
                            <input 
                              type="text"
                              value={item.image || ''}
                              onChange={(e) => updateSpecialtyField(item.id, 'image', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none"
                            />
                            <ImageSelector 
                              files={content.uploadedFiles || []} 
                              value={item.image || ''} 
                              onChange={(val) => updateSpecialtyField(item.id, 'image', val)} 
                              label="Selecionar imagem carregada"
                            />
                          </div>

                          {/* Multiple Images Array editing */}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-[#2d3f65] block font-bold">URLs de Múltiplas Imagens para Galeria (uma por linha)</label>
                            <p className="text-[9px] text-zinc-500">Links para fotos no carrossel lateral. Deixe cada link em uma linha de texto.</p>
                            <textarea 
                              rows={3}
                              placeholder="Insira as URLs das fotos, uma por linha..."
                              value={Array.isArray(item.images) ? item.images.join('\n') : (item.image ? [item.image].join('\n') : '')}
                              onChange={(e) => {
                                const lines = e.target.value.split('\n').map(l => l.trim()).filter(Boolean);
                                updateSpecialtyField(item.id, 'images', lines);
                              }}
                              className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none font-mono"
                            />
                            <MultipleImageSelector 
                              files={content.uploadedFiles || []} 
                              values={Array.isArray(item.images) ? item.images : []} 
                              onChange={(vals) => updateSpecialtyField(item.id, 'images', vals)} 
                              label="Selecionar Múltiplas Imagens Carregadas"
                            />
                          </div>

                          {/* Short Description input */}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-zinc-500 block">Descrição Curta (Exibido no Card)</label>
                            <textarea 
                              rows={2}
                              value={item.description}
                              onChange={(e) => updateSpecialtyField(item.id, 'description', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none resize-none"
                            />
                          </div>

                          {/* Details input */}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-zinc-500 block">Detalhamento Técnico Completo (Exibida no Ver Detalhes)</label>
                            <textarea 
                              rows={4}
                              value={item.details || ''}
                              onChange={(e) => updateSpecialtyField(item.id, 'details', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add New specialty Box */}
              <div className="bg-[#f6f3f2] p-5 rounded-lg border border-[#c5c6cf] space-y-4">
                <span className="font-sans text-xs font-bold text-[#44464e] uppercase flex items-center gap-1">
                  <Plus className="h-4 w-4 text-[#2d3f65]" />
                  <span>Incluir Novo Card de Atuação</span>
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-500">Título do Serviço</label>
                    <input 
                      type="text" 
                      placeholder="Ex: PROJETO DE CLIMATIZAÇÃO"
                      value={newSpec.title}
                      onChange={(e) => setNewSpec(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-500">Ícone Representativo</label>
                    <select
                      value={newSpec.icon}
                      onChange={(e) => setNewSpec(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="Zap">Zap (Projeto Elétrico)</option>
                      <option value="Layers">Layers (Estrutural)</option>
                      <option value="Milestone">Milestone (Asfalto/Rodovias)</option>
                      <option value="Network">Network (Redes e Dados)</option>
                      <option value="Snowflake">Snowflake (Climatização)</option>
                      <option value="Droplet">Droplet (Hidrossanitário)</option>
                      <option value="Flame">Flame (Prevenção de Incêndio)</option>
                      <option value="Compass">Compass (Arquitetônico/Engenharia)</option>
                      <option value="Wrench">Wrench (Manutenção)</option>
                      <option value="Building2">Building (Edificações)</option>
                      <option value="Hammer">Hammer (Instalações)</option>
                      <option value="Shield">Shield (Segurança)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-500">URL da Imagem de Capa (Unsplash ou Carregada)</label>
                  <input
                    type="text" 
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newSpec.image}
                    onChange={(e) => setNewSpec(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none"
                  />
                  <ImageSelector 
                    files={content.uploadedFiles || []} 
                    value={newSpec.image} 
                    onChange={(val) => setNewSpec(prev => ({ ...prev, image: val }))} 
                    label="Selecionar imagem carregada"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#2d3f65] font-bold block">URLs de Múltiplas Imagens Adicionais para a Galeria (uma por linha)</label>
                  <textarea 
                    rows={2}
                    placeholder="Cole links adicionais, um por linha..."
                    value={newSpec.images ? (Array.isArray(newSpec.images) ? newSpec.images.join('\n') : '') : ''}
                    onChange={(e) => {
                      const lines = e.target.value.split('\n').map(l => l.trim()).filter(Boolean);
                      setNewSpec(prev => ({ ...prev, images: lines }));
                    }}
                    className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none font-mono"
                  />
                  <MultipleImageSelector 
                    files={content.uploadedFiles || []} 
                    values={newSpec.images || []} 
                    onChange={(vals) => setNewSpec(prev => ({ ...prev, images: vals }))} 
                    label="Selecionar Múltiplas Imagens Carregadas"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-500">Descrição Técnica Curta (Exibida no Card)</label>
                  <textarea 
                    rows={2}
                    placeholder="Descreva brevemente as soluções inclusas no serviço..."
                    value={newSpec.description}
                    onChange={(e) => setNewSpec(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-500">Detalhamento Completo (Exibido ao clicar em &quot;Ver Detalhes&quot;)</label>
                  <textarea 
                    rows={3}
                    placeholder="Escreva exaustivamente sobre as metodologias, normas e especificações técnicas resolvidas por este serviço..."
                    value={newSpec.details}
                    onChange={(e) => setNewSpec(prev => ({ ...prev, details: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={addSpecialty}
                  className="px-4 py-2 bg-[#2d3f65] hover:bg-[#45567e] text-white rounded text-xs font-bold"
                >
                  Adicionar Card Especialidade
                </button>
              </div>

            </div>
          )}

          {/* TAB 5: PORTFOLIO */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6" id="editor-portfolio">
              <div className="border-b border-[#f0eded] pb-4">
                <h3 className="font-sans text-lg font-bold text-[#2d3f65]">Portfólio de Obras</h3>
                <p className="font-body text-xs text-[#505f7c]">Atualize fotos de rodovias, edifícios construídos ou adicione novos marcos de infraestrutura da empresa.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block font-sans text-xs font-bold text-[#44464e] uppercase">Tag do Portfólio</label>
                  <input 
                    type="text" 
                    value={content.portfolio.tag} 
                    onChange={(e) => updateSection('portfolio', 'tag', e.target.value)}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-sans text-xs font-bold text-[#44464e] uppercase">Título do Portfólio</label>
                  <input 
                    type="text" 
                    value={content.portfolio.title} 
                    onChange={(e) => updateSection('portfolio', 'title', e.target.value)}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-sm focus:outline-none font-semibold"
                  />
                </div>
              </div>

              {/* Portfolio dynamic cards list switcher */}
              <h4 className="font-sans text-xs font-bold text-[#2d3f65] uppercase tracking-wider border-t border-[#f0eded] pt-4">Trabalhos Concluídos Cadastrados</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="admin-portfolio-items">
                {content.portfolio.items.map((project, idx) => (
                  <div key={project.id} className="p-3 bg-[#fcf9f8] border border-[#E2E8F0] rounded flex space-x-3 items-center justify-between">
                    <div className="flex items-center space-x-3 truncate">
                      <div className="h-12 w-12 rounded bg-zinc-300 overflow-hidden shrink-0">
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="truncate space-y-0.5">
                        <h5 className="font-sans text-xs font-bold text-[#2d3f65] truncate">{project.title}</h5>
                        <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase block tracking-wider">{project.category}</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEditProject(project)}
                        className={`p-2 rounded transition-all cursor-pointer ${editingProjectId === project.id ? 'bg-[#2d3f65] text-white' : 'text-[#2d3f65] hover:bg-zinc-100'}`}
                        title="Editar Obra"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeProject(project.id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded shrink-0 transition-all cursor-pointer"
                        title="Deletar Obra"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Conditional CRUD block (Edit OR Add New Project) */}
              {editingProjectId ? (
                <div className="bg-[#bbccfb]/15 p-5 rounded-lg border border-[#bbccfb]/50 space-y-4 shadow-sm animate-in fade-in duration-200">
                  <span className="font-sans text-xs font-bold text-[#2d3f65] uppercase flex items-center gap-1.5">
                    <Edit3 className="h-4 w-4 text-[#2d3f65]" />
                    <span>Modificar Informações de Obra Cadastrada</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-500">Nome Oficial do Empreendimento</label>
                      <input 
                        type="text" 
                        value={editingProjData.title}
                        onChange={(e) => setEditingProjData((prev: any) => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#2d3f65]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-500">Segmento do Projeto (Digite um novo ou selecione)</label>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          placeholder="Ex: SANEAMENTO, HOSPITALAR, INDUSTRIAL..."
                          value={editingProjData.category}
                          onChange={(e) => setEditingProjData((prev: any) => ({ ...prev, category: e.target.value.toUpperCase() }))}
                          className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#2d3f65]"
                        />
                        <select
                          value={['INFRAESTRUTURA', 'COMERCIAL', 'RESIDENCIAL', 'INDUSTRIAL'].includes(editingProjData.category) ? editingProjData.category : ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              setEditingProjData((prev: any) => ({ ...prev, category: e.target.value }));
                            }
                          }}
                          className="px-2 py-2 bg-[#f0eded] border border-[#c5c6cf] rounded text-xs focus:outline-none cursor-pointer text-[#2d3f65] font-bold"
                        >
                          <option value="">Sugestões...</option>
                          <option value="INFRAESTRUTURA">INFRAESTRUTURA</option>
                          <option value="COMERCIAL">COMERCIAL</option>
                          <option value="RESIDENCIAL">RESIDENCIAL</option>
                          <option value="INDUSTRIAL">INDUSTRIAL</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-500">Imagem de Destaque da Obra (URL)</label>
                    <input 
                      type="text" 
                      value={editingProjData.image}
                      onChange={(e) => setEditingProjData((prev: any) => ({ ...prev, image: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none font-mono text-xs"
                    />
                    <ImageSelector 
                      files={content.uploadedFiles || []}
                      value={editingProjData.image} 
                      onChange={(val) => setEditingProjData((prev: any) => ({ ...prev, image: val }))} 
                      label="Ou selecione um arquivo carregado:" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-500">Memorial Técnico & Descrição Executiva</label>
                    <textarea 
                      rows={3}
                      placeholder="Descrição detalhada sobre inovação construtiva, materiais e escopo técnico da obra..."
                      value={editingProjData.details || ''}
                      onChange={(e) => setEditingProjData((prev: any) => ({ ...prev, details: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none text-justify"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={saveEditProject}
                      className="px-4 py-2 bg-[#2d3f65] hover:bg-[#45567e] text-white rounded text-xs font-bold"
                    >
                      Salvar Alterações
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditProject}
                      className="px-4 py-2 bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-700 rounded text-xs font-bold"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#f6f3f2] p-5 rounded-lg border border-[#c5c6cf] space-y-4">
                  <span className="font-sans text-xs font-bold text-[#44464e] uppercase flex items-center gap-1">
                    <Plus className="h-4 w-4 text-[#2d3f65]" />
                    <span>Incluir Nova Obra ao Portfólio</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-500">Nome Oficial do Empreendimento</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Complexo Eólico Rondônia"
                        value={newProj.title}
                        onChange={(e) => setNewProj(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-500">Segmento do Projeto (Digite um novo ou selecione)</label>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          placeholder="Ex: SANEAMENTO, HOSPITALAR, INDUSTRIAL..."
                          value={newProj.category}
                          onChange={(e) => setNewProj(prev => ({ ...prev, category: e.target.value.toUpperCase() }))}
                          className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#2d3f65]"
                        />
                        <select
                          value={['INFRAESTRUTURA', 'COMERCIAL', 'RESIDENCIAL', 'INDUSTRIAL'].includes(newProj.category) ? newProj.category : ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              setNewProj(prev => ({ ...prev, category: e.target.value }));
                            }
                          }}
                          className="px-2 py-2 bg-[#f0eded] border border-[#c5c6cf] rounded text-xs focus:outline-none cursor-pointer text-[#2d3f65] font-bold"
                        >
                          <option value="">Sugestões...</option>
                          <option value="INFRAESTRUTURA">INFRAESTRUTURA</option>
                          <option value="COMERCIAL">COMERCIAL</option>
                          <option value="RESIDENCIAL">RESIDENCIAL</option>
                          <option value="INDUSTRIAL">INDUSTRIAL</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 col-span-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-500">Imagem de Destaque da Obra (URL)</label>
                    <input 
                      type="text" 
                      placeholder="https://images.unsplash.com/..."
                      value={newProj.image}
                      onChange={(e) => setNewProj(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none font-mono text-xs"
                    />
                    <ImageSelector 
                      files={content.uploadedFiles || []}
                      value={newProj.image} 
                      onChange={(val) => setNewProj(prev => ({ ...prev, image: val }))} 
                      label="Ou selecione um arquivo carregado:" 
                    />
                    <span className="text-[9px] text-[#505f7c] block mt-0.5">Deixe em branco para utilizar uma imagem genérica fotorealista profissional padrão.</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-500">Memorial Técnico & Descrição Executiva</label>
                    <textarea 
                      rows={3}
                      placeholder="Descrição técnica sobre a execução do empreendimento..."
                      value={newProj.details || ''}
                      onChange={(e) => setNewProj(prev => ({ ...prev, details: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addProject}
                    className="px-4 py-2 bg-[#2d3f65] hover:bg-[#45567e] text-white rounded text-xs font-bold"
                  >
                    Adicionar Empreendimento
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 6: CONTACT */}
          {activeTab === 'contact' && (
            <div className="space-y-6" id="editor-contact">
              <div className="border-b border-[#f0eded] pb-4">
                <h3 className="font-sans text-lg font-bold text-[#2d3f65]">Fale Conosco & Informações</h3>
                <p className="font-body text-xs text-[#505f7c]">Modifique informações de atendimento, telefone, e-mail oficial e placeholders dos formulários de licitação.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block font-sans text-xs font-bold text-[#44464e] uppercase">Slogan Seção Contato</label>
                  <input 
                    type="text" 
                    value={content.contact.tag} 
                    onChange={(e) => updateSection('contact', 'tag', e.target.value)}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-sans text-xs font-bold text-[#44464e] uppercase">Título Central Chamativo</label>
                  <input 
                    type="text" 
                    value={content.contact.title} 
                    onChange={(e) => updateSection('contact', 'title', e.target.value)}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-sm focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#f0eded]">
                <h4 className="font-sans text-xs font-bold text-[#2d3f65] uppercase tracking-wider">Canais Oficiais de Atendimento</h4>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-500">Endereço Físico Completo</label>
                    <input 
                      type="text" 
                      value={content.contact.address}
                      onChange={(e) => updateSection('contact', 'address', e.target.value)}
                      className="w-full px-4 py-2 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-500">Telefone Telefônico</label>
                      <input 
                        type="text" 
                        value={content.contact.phone}
                        onChange={(e) => updateSection('contact', 'phone', e.target.value)}
                        className="w-full px-4 py-2 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-500">E-mail Comercial Oficial</label>
                      <input 
                        type="text" 
                        value={content.contact.email}
                        onChange={(e) => updateSection('contact', 'email', e.target.value)}
                        className="w-full px-4 py-2 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#f0eded]">
                <h4 className="font-sans text-xs font-bold text-[#2d3f65] uppercase tracking-wider">Placeholders do Formulário de Contato</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase">Placeholder Nome</label>
                    <input 
                      type="text" 
                      value={content.contact.formNamePlaceholder}
                      onChange={(e) => updateSection('contact', 'formNamePlaceholder', e.target.value)}
                      className="w-full px-3 py-2 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase">Placeholder Email</label>
                    <input 
                      type="text" 
                      value={content.contact.formEmailPlaceholder}
                      onChange={(e) => updateSection('contact', 'formEmailPlaceholder', e.target.value)}
                      className="w-full px-3 py-2 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase">Placeholder Mensagem</label>
                    <input 
                      type="text" 
                      value={content.contact.formMessagePlaceholder}
                      onChange={(e) => updateSection('contact', 'formMessagePlaceholder', e.target.value)}
                      className="w-full px-3 py-2 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs z-10"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}
          {/* TAB: SMTP EMAIL SERVER CONFIGURATION */}
          {activeTab === 'smtp' && (
            <div className="space-y-6" id="editor-smtp">
              <div className="border-b border-[#f0eded] pb-4 flex flex-col md:flex-row md:items-center md:justify-between justify-start gap-4">
                <div>
                  <h3 className="font-sans text-lg font-bold text-[#2d3f65]">📧 Servidor de E-mail (SMTP)</h3>
                  <p className="font-body text-xs text-[#505f7c]">
                    Gerenciamento seguro de SMTP para o envio de e-mails institucionais e notificações de candidaturas.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-250 rounded-full text-[11px] font-bold tracking-wide w-fit font-sans">
                  <span>Status: Protegido no Servidor</span>
                </div>
              </div>

              {/* Informational Guidance Box */}
              <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-600 rounded-lg text-xs leading-relaxed text-emerald-950 space-y-3 font-body shadow-xs">
                <span className="font-bold text-sm font-sans flex items-center gap-1.5 text-emerald-950">🔒 Configuração Segura Ativa</span>
                <p>
                  Para garantir total conformidade com a <strong>LGPD (Lei Geral de Proteção de Dados)</strong> e evitar o vazamento de dados confidenciais, as credenciais e parâmetros SMTP do servidor foram <strong>migrados e protegidos diretamente no servidor back-end</strong>.
                </p>
                <p>
                  A edição ou exposição de senhas de e-mail no front-end foi desabilitada. Para gerenciar ou alterar os dados de envio de e-mail (como servidor, porta, usuário e senha), edite o arquivo <code className="bg-emerald-100/80 px-1 py-0.5 rounded font-mono text-[10px]">.env.local</code> no seu ambiente local, ou configure as variáveis de ambiente diretamente no painel de controle da <strong>Vercel</strong> em produção.
                </p>
              </div>

              {/* SMTP Credentials Instructions */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-4">
                <h4 className="font-sans text-xs font-bold text-[#2d3f65] uppercase tracking-wider border-b border-zinc-100 pb-2">Variáveis de Ambiente Necessárias</h4>
                <p className="font-body text-xs text-zinc-600">
                  Adicione as seguintes variáveis de ambiente nas configurações da sua hospedagem ou arquivo local:
                </p>
                <pre className="p-4 bg-zinc-950 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto leading-relaxed border border-zinc-800">
{`SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="seu-email-remetente@gmail.com"
SMTP_PASS="sua-senha-de-aplicativo"
SMTP_SECURE="false"
SMTP_TO="rh@motrizengenharia.com.br"`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 7: FOOTER & WHATSAPP FLOATER */}
          {activeTab === 'footer' && (
            <div className="space-y-6" id="editor-footer">
              <div className="border-b border-[#f0eded] pb-4">
                <h3 className="font-sans text-lg font-bold text-[#2d3f65]">Rodapé & Redes Sociais</h3>
                <p className="font-body text-xs text-[#505f7c]">Modifique as assinaturas de copyright, textos da newsletter e gatilhos flutuantes do WhatsApp.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block font-sans text-xs font-bold text-[#44464e] uppercase">Nome Comercial do Footer</label>
                  <input 
                    type="text" 
                    value={content.footer.brandText} 
                    onChange={(e) => updateSection('footer', 'brandText', e.target.value)}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-sans text-xs font-bold text-[#44464e] uppercase">Mensagem de Copyright Oficial</label>
                  <input 
                    type="text" 
                    value={content.footer.copyrightText} 
                    onChange={(e) => updateSection('footer', 'copyrightText', e.target.value)}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-sans text-xs font-bold text-[#44464e] uppercase">Parágrafo institucional do Footer</label>
                <textarea 
                  rows={2}
                  value={content.footer.brandDesc} 
                  onChange={(e) => updateSection('footer', 'brandDesc', e.target.value)}
                  className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-sm focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-[#f0eded]">
                <h4 className="font-sans text-xs font-bold text-[#2d3f65] uppercase tracking-wider">Integração do WhatsApp Flutuante (Suporte e Vendas)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-500">ID DDD Número WhatsApp (Somente números)</label>
                    <input 
                      type="text" 
                      value={content.footer.whatsappNumber}
                      onChange={(e) => updateSection('footer', 'whatsappNumber', e.target.value.replace(/\D/g,''))}
                      className="w-full px-3 py-2 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs font-mono"
                      placeholder="Somente dígitos: e.g. 5569999990000"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-500">Mensagem Automatizada Inicial</label>
                    <input 
                      type="text" 
                      value={content.footer.whatsappMessage}
                      onChange={(e) => updateSection('footer', 'whatsappMessage', e.target.value)}
                      className="w-full px-3 py-2 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#f0eded]">
                <h4 className="font-sans text-xs font-bold text-[#2d3f65] uppercase tracking-wider">Subscrição Newsletter</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase">Título Newsletter</label>
                    <input 
                      type="text" 
                      value={content.footer.newsletterTitle}
                      onChange={(e) => updateSection('footer', 'newsletterTitle', e.target.value)}
                      className="w-full px-3 py-2 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase">Assunto / Descrição</label>
                    <input 
                      type="text" 
                      value={content.footer.newsletterDesc}
                      onChange={(e) => updateSection('footer', 'newsletterDesc', e.target.value)}
                      className="w-full px-3 py-2 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#f0eded]">
                <h4 className="font-sans text-xs font-bold text-[#2d3f65] uppercase tracking-wider">Links das Redes Sociais do Rodapé</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase">URL Instagram</label>
                    <input 
                      type="text" 
                      value={content.footer.instagramUrl || ''}
                      onChange={(e) => updateSection('footer', 'instagramUrl', e.target.value)}
                      className="w-full px-3 py-2 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs"
                      placeholder="https://instagram.com/motrizengenharia"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase">URL Facebook</label>
                    <input 
                      type="text" 
                      value={content.footer.facebookUrl || ''}
                      onChange={(e) => updateSection('footer', 'facebookUrl', e.target.value)}
                      className="w-full px-3 py-2 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs"
                      placeholder="https://facebook.com/motrizengenharia"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase">URL LinkedIn</label>
                    <input 
                      type="text" 
                      value={content.footer.linkedinUrl || ''}
                      onChange={(e) => updateSection('footer', 'linkedinUrl', e.target.value)}
                      className="w-full px-3 py-2 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-xs"
                      placeholder="https://linkedin.com/company/motrizengenharia"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB: CENTRAL DE ARQUIVOS (FILES) */}
          {activeTab === 'files' && (
            <div className="space-y-6" id="editor-files">
              <div className="border-b border-[#f0eded] pb-4">
                <h3 className="font-sans text-lg font-bold text-[#2d3f65]">Central de Arquivos (Imagens)</h3>
                <p className="font-body text-xs text-[#505f7c]">
                  Faça o upload de logos de parceiros, fotos de obras ou banners do hero diretamente do seu computador. 
                  Os arquivos serão convertidos em URLs persistentes no cache local, prontos para seleção nas demais telas de edição.
                </p>
              </div>

              {/* Upload Drop Zone card */}
              <div 
                className={`border-2 border-dashed p-8 rounded text-center transition-all cursor-pointer ${
                  isDraggingFile 
                    ? 'border-[#2d3f65] bg-[#2d3f65]/5 scale-[0.99]' 
                    : 'border-[#c5c6cf] hover:border-[#2d3f65] bg-white'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingFile(true);
                }}
                onDragLeave={() => setIsDraggingFile(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingFile(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) processFile(file);
                }}
                onClick={() => document.getElementById('central-file-input')?.click()}
                id="file-drop-zone"
              >
                <input 
                  type="file" 
                  id="central-file-input" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                />
                <Upload className="h-10 w-10 text-[#505f7c] mx-auto mb-3 animate-pulse" />
                <p className="text-sm font-bold text-[#2d3f65]">Arraste e solte sua imagem aqui ou clique para procurar</p>
                <p className="text-[11px] text-[#7a889f] mt-1">Suporta formatos PNG, JPG, JPEG, SVG e WEBP (Máx recomendado 5MB)</p>
              </div>

              {/* Library/Gallery area */}
              <div className="space-y-3">
                <h4 className="font-sans text-xs font-bold text-[#2d3f65] uppercase tracking-wider">Sua Biblioteca de Mídias</h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" id="uploaded-files-grid">
                  {(content.uploadedFiles || []).map((file) => (
                    <div 
                      key={file.id} 
                      className="group bg-white border border-[#E2E8F0] rounded overflow-hidden flex flex-col relative hover:shadow-md transition-all duration-300"
                    >
                      <div className="h-28 bg-gray-50 flex items-center justify-center p-2 border-b border-[#E2E8F0] relative overflow-hidden">
                        <img 
                          src={file.dataUrl} 
                          alt={file.name} 
                          className="max-h-full max-w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-2 space-y-1 text-left flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-xs font-bold text-[#2d3f65] truncate" title={file.name}>
                            {file.name}
                          </p>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {file.size || 'Tamanho desconhecido'}
                          </span>
                        </div>
                        
                        <div className="flex gap-1 pt-1 border-t border-[#f0eded]">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(file.dataUrl);
                              alert("URL de dados copiada para a área de transferência!");
                            }}
                            className="flex-1 text-center bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-sans text-[10px] font-bold py-1 px-1.5 rounded transition-colors"
                            title="Copiar URL Base64"
                          >
                            Copiar URL
                          </button>
                          <button
                            type="button"
                            onClick={() => removeUploadedFile(file.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-1 rounded transition-colors shrink-0"
                            title="Excluir arquivo"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!content.uploadedFiles || content.uploadedFiles.length === 0) && (
                    <div className="col-span-full py-8 text-center bg-zinc-50 border border-dashed border-[#E2E8F0] rounded p-4 text-[#7a889f]">
                      <p className="text-sm italic">Nenhum arquivo de imagem carregado ainda.</p>
                      <p className="text-xs mt-1">Carregue logos de parceiros ou fotos acima para utilizá-los nas demais seções.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: CLIENTES & PARCEIROS */}
          {activeTab === 'partners' && (
            <div className="space-y-6" id="editor-partners">
              <div className="border-b border-[#f0eded] pb-4">
                <h3 className="font-sans text-lg font-bold text-[#2d3f65]">Clientes & Parceiros</h3>
                <p className="font-body text-xs text-[#505f7c]">
                  Modifique os textos do cabeçalho da seção e gerencie o catálogo de pequenas marcas de clientes que aparecem na home.
                </p>
              </div>

              {/* Title & tag editing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block font-sans text-xs font-bold text-[#44464e] uppercase">Sua Tag da Seção</label>
                  <input 
                    type="text" 
                    value={content.partners?.tag || "NOSSOS PARCEIROS"} 
                    onChange={(e) => {
                      onUpdateContent({
                        ...content,
                        partners: {
                          tag: e.target.value,
                          title: content.partners?.title || "",
                          items: content.partners?.items || []
                        }
                      });
                    }}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-sans text-xs font-bold text-[#44464e] uppercase">Título Principal</label>
                  <input 
                    type="text" 
                    value={content.partners?.title || "Quem Confia no Nosso Trabalho"} 
                    onChange={(e) => {
                      onUpdateContent({
                        ...content,
                        partners: {
                          tag: content.partners?.tag || "",
                          title: e.target.value,
                          items: content.partners?.items || []
                        }
                      });
                    }}
                    className="w-full px-4 py-3 bg-[#f6f3f2] border border-[#c5c6cf] rounded text-sm focus:outline-none font-semibold"
                  />
                </div>
              </div>

              {/* Partners list */}
              <h4 className="font-sans text-xs font-bold text-[#2d3f65] uppercase tracking-wider border-t border-[#f0eded] pt-4">Parceiros Cadastrados</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="admin-partners-items">
                {(content.partners?.items || []).map((partner) => (
                  <div key={partner.id} className="p-3 bg-[#fcf9f8] border border-[#E2E8F0] rounded flex space-x-3 items-center justify-between">
                    <div className="flex items-center space-x-3 truncate">
                      <div className="h-10 w-16 bg-white border border-[#E2E8F0] rounded p-1 overflow-hidden shrink-0 flex items-center justify-center">
                        <img 
                          src={partner.logoUrl} 
                          alt={partner.name} 
                          className="max-h-full max-w-full object-contain filter grayscale"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="truncate">
                        <h5 className="font-sans text-xs font-semibold text-[#2d3f65] truncate">{partner.name}</h5>
                      </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEditPartner(partner)}
                        className={`p-2 rounded transition-all cursor-pointer ${editingPartnerId === partner.id ? 'bg-[#2d3f65] text-white' : 'text-[#2d3f65] hover:bg-zinc-100'}`}
                        title="Editar Parceiro"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removePartner(partner.id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded shrink-0 transition-all cursor-pointer"
                        title="Excluir do site"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {(!content.partners?.items || content.partners.items.length === 0) && (
                  <p className="col-span-2 text-sm text-[#7a889f] italic">Nenhum parceiro ou cliente adicionado.</p>
                )}
              </div>

              {/* Form to edit or add partner/client */}
              {editingPartnerId ? (
                <div className="bg-[#bbccfb]/15 p-5 rounded-lg border border-[#bbccfb]/50 space-y-4 shadow-sm animate-in fade-in duration-200">
                  <span className="font-sans text-xs font-bold text-[#2d3f65] uppercase flex items-center gap-1.5">
                    <Edit3 className="h-4 w-4 text-[#2d3f65]" />
                    <span>Modificar Cadastro de Parceiro / Cliente</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-500">Nome do Parceiro</label>
                      <input 
                        type="text" 
                        value={editingPartnerData.name}
                        onChange={(e) => setEditingPartnerData((prev: any) => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-500">URL da Logomarca</label>
                      <input 
                        type="text" 
                        value={editingPartnerData.logoUrl}
                        onChange={(e) => setEditingPartnerData((prev: any) => ({ ...prev, logoUrl: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none font-mono text-xs"
                      />
                    </div>
                  </div>

                  <ImageSelector 
                    files={content.uploadedFiles || []}
                    value={editingPartnerData.logoUrl} 
                    onChange={(val) => setEditingPartnerData((prev: any) => ({ ...prev, logoUrl: val }))} 
                    label="Ou prefira usar uma das mídias enviadas na aba de arquivos:" 
                  />

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={saveEditPartner}
                      className="px-4 py-2 bg-[#2d3f65] hover:bg-[#45567e] text-white rounded text-xs font-bold select-none cursor-pointer"
                    >
                      Salvar Alterações
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditPartner}
                      className="px-4 py-2 bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-700 rounded text-xs font-bold"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#f6f3f2] p-5 rounded-lg border border-[#c5c6cf] space-y-4">
                  <span className="font-sans text-xs font-bold text-[#44464e] uppercase flex items-center gap-1">
                    <Plus className="h-4 w-4 text-[#2d3f65]" />
                    <span>Cadastrar Novo Parceiro / Cliente</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-500">Nome do Parceiro</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Secretaria de Obras"
                        value={newPartner.name}
                        onChange={(e) => setNewPartner(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-500">URL da Logomarca</label>
                      <input 
                        type="text" 
                        placeholder="https://..."
                        value={newPartner.logoUrl}
                        onChange={(e) => setNewPartner(prev => ({ ...prev, logoUrl: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none font-mono text-xs"
                      />
                    </div>
                  </div>

                  <ImageSelector 
                    files={content.uploadedFiles || []}
                    value={newPartner.logoUrl} 
                    onChange={(val) => setNewPartner(prev => ({ ...prev, logoUrl: val }))} 
                    label="Ou prefira usar uma das mídias enviadas na aba de arquivos:" 
                  />

                  <button
                    type="button"
                    onClick={addPartner}
                    className="px-4 py-2 bg-[#2d3f65] hover:bg-[#45567e] text-white rounded text-xs font-bold select-none cursor-pointer"
                  >
                    Confirmar e Adicionar Parceiro
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB: TRABALHE CONOSCO (Canal de Talentos GP/RH) */}
          {activeTab === 'trabalhe_conosco' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200" id="editor-trabalhe-conosco">
              <div className="border-b border-[#f0eded] pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-sans text-lg font-bold text-[#2d3f65]">Gestão do Trabalhe Conosco & Banco de Talentos (RH/GP)</h3>
                  <p className="font-body text-xs text-[#505f7c]">
                    Controle as vagas, edite os textos da página do Trabalhe Conosco e gerencie todas as candidaturas enviadas.
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href="/trabalhe-conosco"
                    target="_blank"
                    className="px-3.5 py-1.5 bg-[#fcf9f8] hover:bg-[#2d3f65] hover:text-white border border-[#2d3f65] text-[#2d3f65] rounded text-xs font-bold font-sans transition-all cursor-pointer select-none"
                  >
                    Ver Página Trabalhe Conosco ↗
                  </a>
                </div>
              </div>

              {/* SECTION: EDITAR COPIES & VAGAS DA TELA TRABALHE CONOSCO */}
              <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] space-y-4">
                <span className="font-sans text-xs font-bold text-[#2d3f65] uppercase tracking-wider block border-b border-[#E2E8F0] pb-2">
                  📝 Customização de Cópias e Cargos Oferecidos
                </span>
                
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Edite em tempo real os textos e as listas de cargos de interesse que aparecem para os interessados no site da Motriz Engenharia.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#505f7c] uppercase">Prefixo do Título (Info Card)</label>
                    <input
                      type="text"
                      value={candTitlePrefix}
                      onChange={(e) => {
                        setCandTitlePrefix(e.target.value);
                        onUpdateContent({
                          ...content,
                          careersPage: {
                            ...(content.careersPage || defaultSiteContent.careersPage || { titlePrefix: '', mainTitle: '', description: '', formTitle: '', vacancies: [] }),
                            titlePrefix: e.target.value
                          }
                        });
                      }}
                      className="w-full px-3 py-1.5 bg-[#fcf9f8] border border-[#c5c6cf] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#2d3f65]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#505f7c] uppercase">Título Principal (Banner/Info Card)</label>
                    <input
                      type="text"
                      value={candMainTitle}
                      onChange={(e) => {
                        setCandMainTitle(e.target.value);
                        onUpdateContent({
                          ...content,
                          careersPage: {
                            ...(content.careersPage || defaultSiteContent.careersPage || { titlePrefix: '', mainTitle: '', description: '', formTitle: '', vacancies: [] }),
                            mainTitle: e.target.value
                          }
                        });
                      }}
                      className="w-full px-3 py-1.5 bg-[#fcf9f8] border border-[#c5c6cf] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#2d3f65]"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-bold text-[#505f7c] uppercase">Descrição Detalhada do Processo</label>
                    <textarea
                      rows={2}
                      value={candDescription}
                      onChange={(e) => {
                        setCandDescription(e.target.value);
                        onUpdateContent({
                          ...content,
                          careersPage: {
                            ...(content.careersPage || defaultSiteContent.careersPage || { titlePrefix: '', mainTitle: '', description: '', formTitle: '', vacancies: [] }),
                            description: e.target.value
                          }
                        });
                      }}
                      className="w-full px-3 py-1.5 bg-[#fcf9f8] border border-[#c5c6cf] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#2d3f65] font-light"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#505f7c] uppercase">Título do Bloco de Formulário</label>
                    <input
                      type="text"
                      value={candFormTitle}
                      onChange={(e) => {
                        setCandFormTitle(e.target.value);
                        onUpdateContent({
                          ...content,
                          careersPage: {
                            ...(content.careersPage || defaultSiteContent.careersPage || { titlePrefix: '', mainTitle: '', description: '', formTitle: '', vacancies: [] }),
                            formTitle: e.target.value
                          }
                        });
                      }}
                      className="w-full px-3 py-1.5 bg-[#fcf9f8] border border-[#c5c6cf] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#2d3f65]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#505f7c] uppercase">E-mail Destinatário de Candidatos (RH)</label>
                    <input
                      type="email"
                      placeholder="Ex: rh@motrizengenharia.com.br"
                      value={content.careersEmail || ''}
                      onChange={(e) => onUpdateContent({ ...content, careersEmail: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#fcf9f8] border border-[#c5c6cf] rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#2d3f65]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-dashed border-[#E2E8F0] space-y-3">
                  <span className="text-[10px] font-bold text-[#505f7c] uppercase block">
                    Gestão dos Cargos / Vagas Ativas
                  </span>
                  
                  {/* List of current vacancies */}
                  <div className="flex flex-wrap gap-2">
                    {((content.careersPage?.vacancies || defaultSiteContent.careersPage?.vacancies || [])).map((v: any, index: number) => (
                      <span 
                        key={v.value + "-" + index}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#dfebfd] text-[#1a4f91] text-[10px] font-bold uppercase rounded"
                      >
                        <span>{v.label} ({v.value})</span>
                        <button
                          type="button"
                          onClick={() => {
                            const curVacancies = content.careersPage?.vacancies || defaultSiteContent.careersPage?.vacancies || [];
                            const updated = curVacancies.filter((x: any) => x.value !== v.value);
                            onUpdateContent({
                              ...content,
                              careersPage: {
                                ...(content.careersPage || defaultSiteContent.careersPage || { titlePrefix: '', mainTitle: '', description: '', formTitle: '', vacancies: [] }),
                                vacancies: updated
                              }
                            });
                          }}
                          className="text-red-600 hover:text-red-900 font-extrabold focus:outline-none px-0.5 select-none cursor-pointer"
                          title="Remover esta vaga"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add a new customized vacancy tool */}
                  <div className="flex flex-col sm:flex-row gap-2 max-w-xl pb-1 pt-1.5">
                    <input
                      type="text"
                      placeholder="Identificador (Ex: ENGENHEIRO_CIVIL_JR)"
                      value={newVacancyValue}
                      onChange={(e) => setNewVacancyValue(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
                      className="flex-1 px-3 py-1.5 bg-[#fcf9f8] border border-[#c5c6cf] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#2d3f65]"
                    />
                    <input
                      type="text"
                      placeholder="Nome Exibido (Ex: Engenheiro Civil Júnior)"
                      value={newVacancyLabel}
                      onChange={(e) => setNewVacancyLabel(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-[#fcf9f8] border border-[#c5c6cf] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#2d3f65]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newVacancyValue.trim() || !newVacancyLabel.trim()) {
                          alert('Por favor, preencha o identificador e o nome da vaga.');
                          return;
                        }
                        const curVacancies = content.careersPage?.vacancies || defaultSiteContent.careersPage?.vacancies || [];
                        if (curVacancies.some((v: any) => v.value === newVacancyValue)) {
                          alert('Já existe uma vaga com este identificador.');
                          return;
                        }
                        const updated = [...curVacancies, { value: newVacancyValue, label: newVacancyLabel }];
                        onUpdateContent({
                          ...content,
                          careersPage: {
                            ...(content.careersPage || defaultSiteContent.careersPage || { titlePrefix: '', mainTitle: '', description: '', formTitle: '', vacancies: [] }),
                            vacancies: updated
                          }
                        });
                        setNewVacancyLabel('');
                        setNewVacancyValue('');
                      }}
                      className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-800 text-white font-bold rounded text-xs whitespace-nowrap"
                    >
                      ＋ Adicionar Vaga
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      saveToSystem();
                    }}
                    className="px-6 py-2 bg-[#2d3f65] hover:bg-[#45567e] text-white rounded text-xs font-bold font-sans transition-colors cursor-pointer text-center"
                  >
                    💾 Salvar Todas as Configurações da Tela
                  </button>
                </div>
              </div>

              {/* STATS BENTO SECTION */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg text-center">
                  <span className="block text-[10px] uppercase font-bold text-zinc-400">Total de Currículos</span>
                  <span className="text-3xl font-extrabold text-[#2d3f65] font-sans">
                    {(localCandidacies || []).length}
                  </span>
                </div>
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg text-center">
                  <span className="block text-[10px] uppercase font-bold text-zinc-400">Engenharias & Técnicos</span>
                  <span className="text-3xl font-extrabold text-blue-600 font-sans">
                    {(localCandidacies || []).filter((c: any) => c.vaga?.includes('ENGENHEIRO') || c.vaga?.includes('TECNICO')).length}
                  </span>
                </div>
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg text-center">
                  <span className="block text-[10px] uppercase font-bold text-zinc-400">Último Recebimento</span>
                  <span className="text-sm font-bold text-emerald-700 font-sans block mt-2">
                    {(localCandidacies || []).length > 0 ? (localCandidacies || [])[(localCandidacies || []).length - 1].submittedAt?.split(' ')[0] : 'Sem registros'}
                  </span>
                </div>
              </div>

              {/* FILTER & ADVANCED SEARCH SECTION */}
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2d3f65] uppercase flex items-center gap-1.5">
                    <span>🔍</span> BARRA DE FILTRAGEM INTELIGENTE DO RH
                  </span>
                  {(careersSearchQuery.trim() || careersFilterVaga !== 'ALL') && (
                    <button
                      type="button"
                      onClick={() => {
                        setCareersSearchQuery('');
                        setCareersFilterVaga('ALL');
                      }}
                      className="text-[10px] font-bold text-[#1a4f91] hover:underline cursor-pointer"
                    >
                      Limpar Filtros
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Text search query */}
                  <div className="md:col-span-2 relative">
                    <input
                      type="text"
                      value={careersSearchQuery}
                      onChange={(e) => setCareersSearchQuery(e.target.value)}
                      placeholder="Buscar por candidato, e-mail, telefone, texto da mensagem ou arquivo..."
                      className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#2d3f65]"
                    />
                    {careersSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setCareersSearchQuery('')}
                        className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600 font-bold text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div>
                    <select
                      value={careersFilterVaga}
                      onChange={(e) => setCareersFilterVaga(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#2d3f65] cursor-pointer"
                    >
                      <option value="ALL">Qualquer Cargo / Filtro Geral</option>
                      {(content.careersPage?.vacancies || defaultSiteContent.careersPage?.vacancies || []).map((vac: any) => (
                        <option key={"filter-" + vac.value} value={vac.value}>
                          {vac.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Counter indicator */}
                <div className="text-[10px] text-zinc-500 font-mono">
                  Mostrando <strong className="text-[#2d3f65]">
                    {(localCandidacies || []).filter((cand: any) => {
                      const q = careersSearchQuery.toLowerCase().trim();
                      const matchesSearch = !q || 
                        cand.nome?.toLowerCase().includes(q) || 
                        cand.email?.toLowerCase().includes(q) || 
                        cand.telefone?.toLowerCase().includes(q) || 
                        cand.mensagem?.toLowerCase().includes(q) ||
                        cand.curriculoNome?.toLowerCase().includes(q);
                      const matchesVaga = careersFilterVaga === 'ALL' || cand.vaga === careersFilterVaga;
                      return matchesSearch && matchesVaga;
                    }).length}
                  </strong> de <strong className="text-zinc-600">{(localCandidacies || []).length}</strong> currículos recebidos.
                </div>
              </div>

              {/* Table list of Candidacies with Advanced Filters applied */}
              <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
                <div className="px-5 py-4 bg-zinc-50 border-b border-[#E2E8F0] flex justify-between items-center">
                  <span className="font-sans text-xs font-bold text-[#2d3f65] uppercase tracking-wider">
                    Banco de Talentos Recebidos
                  </span>
                  {(localCandidacies || []).length > 0 && (
                    <button
                      type="button"
                      onClick={async () => {
                        if (confirm('Tem certeza que deseja zerar TODAS as candidaturas recebidas? Esta ação não pode ser desfeita.')) {
                          if (isSupabaseConfigured()) {
                            const { error } = await supabase
                              .from('candidacies')
                              .delete()
                              .neq('id', 'dummy_id_not_matching');
                            
                            if (error) {
                              console.error('Erro ao deletar candidaturas no Supabase:', error);
                              alert('Erro ao excluir no Supabase: ' + error.message);
                            } else {
                              setLocalCandidacies([]);
                            }
                          } else {
                            onUpdateContent({ ...content, candidacies: [] });
                            setTimeout(() => saveToSystem(), 100);
                          }
                        }
                      }}
                      className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer uppercase tracking-wider"
                    >
                      Limpar Banco de Talentos
                    </button>
                  )}
                </div>

                {(!localCandidacies || localCandidacies.length === 0) ? (
                  <div className="p-12 text-center text-zinc-500 space-y-2">
                    <span className="block text-4xl">📁</span>
                    <p className="font-sans text-xs font-bold text-zinc-600">Nenhuma candidatura registrada ainda.</p>
                    <p className="text-[10px] text-zinc-400">Divulgue o link da página do Trabalhe Conosco para receber currículos automáticos de candidatos.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#fcf9f8] border-b border-[#E2E8F0] text-[10px] uppercase font-sans font-bold text-zinc-500">
                          <th className="px-4 py-3">Candidato / Contato</th>
                          <th className="px-4 py-3">Vaga Pretendida</th>
                          <th className="px-4 py-3">Pretensão Salarial</th>
                          <th className="px-4 py-3">Arquivos / Soft Links</th>
                          <th className="px-4 py-3">Apresentação</th>
                          <th className="px-4 py-3">Data</th>
                          <th className="px-4 py-3 text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 text-xs text-[#44464e]">
                        {(localCandidacies || [])
                          .filter((cand: any) => {
                            const q = careersSearchQuery.toLowerCase().trim();
                            const matchesSearch = !q || 
                              cand.nome?.toLowerCase().includes(q) || 
                              cand.email?.toLowerCase().includes(q) || 
                              cand.telefone?.toLowerCase().includes(q) || 
                              cand.mensagem?.toLowerCase().includes(q) ||
                              cand.curriculoNome?.toLowerCase().includes(q);
                            const matchesVaga = careersFilterVaga === 'ALL' || cand.vaga === careersFilterVaga;
                            return matchesSearch && matchesVaga;
                          })
                          .map((cand: any) => (
                            <tr key={cand.id} className="hover:bg-zinc-50/50">
                              <td className="px-4 py-3 font-medium">
                                <div className="font-sans font-bold text-[#2d3f65]">{cand.nome}</div>
                                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{cand.email}</div>
                                <div className="text-[10px] text-zinc-500 mt-0.5">{cand.telefone}</div>
                              </td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-0.5 bg-[#dfebfd] text-[#1a4f91] text-[9px] font-extrabold uppercase rounded tracking-wider">
                                  {cand.vaga?.replace(/_/g, ' ')}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-semibold font-mono text-[#2d3f65]">
                                {cand.pretensao ? `R$ ${cand.pretensao}` : 'Não informada'}
                              </td>
                              <td className="px-4 py-3 space-y-1">
                                {cand.linkedin && (
                                  <a 
                                    href={cand.linkedin} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-xs text-[#2d3f65] hover:underline font-semibold block truncate max-w-[150px] text-[10px]"
                                  >
                                    🔗 LinkedIn / Portfólio ↗
                                  </a>
                                )}
                                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                                  <span>📄</span>
                                  {cand.curriculoUrl ? (
                                    <a 
                                      href={cand.curriculoUrl} 
                                      target="_blank" 
                                      rel="noreferrer" 
                                      className="font-mono text-blue-600 hover:underline truncate max-w-[150px] block"
                                      title={cand.curriculoNome}
                                    >
                                      {cand.curriculoNome || 'Currículo Supabase'} ↗
                                    </a>
                                  ) : (
                                    <span className="font-mono truncate max-w-[150px]" title={cand.curriculoNome}>
                                      {cand.curriculoNome || 'Nenhum'}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 font-light italic max-w-xs truncate" title={cand.mensagem}>
                                {cand.mensagem || '—'}
                              </td>
                              <td className="px-4 py-3 font-mono text-[10px] whitespace-nowrap text-zinc-500">
                                {cand.submittedAt}
                              </td>
                              <td className="px-4 py-3 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setActiveCandidacyDetail(cand)}
                                    className="p-1 px-2.5 text-xs text-[#2d3f65] border border-zinc-200 hover:border-[#2d3f65] hover:bg-zinc-50 rounded select-none cursor-pointer font-bold font-sans"
                                    title="Ver e Baixar Currículo Completo"
                                  >
                                    Ver Detalhes
                                  </button>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      if (confirm(`Remover candidatura de ${cand.nome}?`)) {
                                        if (isSupabaseConfigured()) {
                                          const { error } = await supabase
                                            .from('candidacies')
                                            .delete()
                                            .eq('id', cand.id);
                                          
                                          if (error) {
                                            console.error('Erro ao deletar candidatura no Supabase:', error);
                                            alert('Erro ao excluir no Supabase: ' + error.message);
                                          } else {
                                            setLocalCandidacies(prev => prev.filter(c => c.id !== cand.id));
                                          }
                                        } else {
                                          const updated = (content.candidacies || []).filter((c: any) => c.id !== cand.id);
                                          onUpdateContent({ ...content, candidacies: updated });
                                          setTimeout(() => saveToSystem(), 100);
                                        }
                                      }
                                    }}
                                    className="p-1 px-2.5 text-xs text-red-600 border border-transparent hover:border-red-100 hover:bg-red-50 rounded select-none cursor-pointer"
                                    title="Excluir Candidatura"
                                  >
                                    Excluir
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: COLABORADORES & ROLES (Alçada de Permissões) */}
          {activeTab === 'roles' && (
                <div className="space-y-6" id="editor-roles">
                  <div className="border-b border-[#f0eded] pb-4">
                    <h3 className="font-sans text-lg font-bold text-[#2d3f65]">Alçada de Permissões & Colaboradores</h3>
                    <p className="font-body text-xs text-[#505f7c]">
                      Controle quem tem acesso de alteração ao portal da Motriz Engenharia e defina níveis de privilégio (master, editores temáticos ou apenas observadores).
                    </p>
                  </div>

                  {/* Roles Description Alert */}
                  <div className="bg-[#bbccfb]/15 border border-[#bbccfb]/40 rounded-lg p-4 space-y-2 text-xs text-[#2d3f65]">
                    <span className="font-bold uppercase tracking-wider block">Níveis de Alçada Disponíveis:</span>
                    <ul className="list-disc list-inside space-y-1 text-[#505f7c]">
                      <li><strong className="text-zinc-800">Administrador Master:</strong> Acesso total sem restrições. Permissão para ler, salvar e restaurar todo o site institucional e gerenciar contas de colaboradores.</li>
                      <li><strong className="text-zinc-800">Editor de Páginas:</strong> Pode alterar textos, banners, sobre, MVV e contatos. Porém, **não possui autorização** para editar o Portfólio de Obras.</li>
                      <li><strong className="text-zinc-800">Editor de Portfólio:</strong> Especialista com direito de criar, alterar e apagar projetos do Portfólio de Obras. Bloqueado de alterar o resto das páginas.</li>
                      <li><strong className="text-zinc-800">Visualizador:</strong> Conta de demonstração/estágio. Apenas faz análises visuais na plataforma sem capacidade de gravação duradoura.</li>
                    </ul>
                  </div>

                  {/* Collaborators List */}
                  <h4 className="font-sans text-xs font-bold text-[#2d3f65] uppercase tracking-wider">Membros Autorizados</h4>
                  <div className="space-y-3">
                    {collaborators.map((member) => (
                      editingColabId === member.id ? (
                        <div key={member.id} className="p-4 bg-[#fcf9f8] border-2 border-[#2d3f65] rounded-lg shadow-md flex flex-col gap-4 animate-in fade-in-50 duration-200">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-zinc-500">Nome Completo</label>
                              <input
                                type="text"
                                value={editColabName}
                                onChange={(e) => setEditColabName(e.target.value)}
                                className="w-full px-3 py-1.5 bg-white border border-[#2d3f65] rounded text-xs focus:outline-none"
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-zinc-500">E-mail Corporativo</label>
                              <input
                                type="email"
                                value={editColabEmail}
                                onChange={(e) => setEditColabEmail(e.target.value)}
                                className="w-full px-3 py-1.5 bg-white border border-[#2d3f65] rounded text-xs focus:outline-none font-mono"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-zinc-500">Alçada de Permissão</label>
                              <select
                                value={editColabRole}
                                onChange={(e) => setEditColabRole(e.target.value)}
                                disabled={member.role === 'Administrador Master' && member.email === 'developermotrizeng@gmail.com'}
                                className="w-full px-3 py-1.5 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none"
                              >
                                <option value="Administrador Master">Administrador Master</option>
                                <option value="Editor de Páginas">Editor de Páginas</option>
                                <option value="Editor de Portfólio">Editor de Portfólio</option>
                                <option value="Visualizador">Visualizador (Leitura)</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-zinc-500">Status de Atividade</label>
                              <select
                                value={editColabStatus}
                                onChange={(e) => setEditColabStatus(e.target.value)}
                                disabled={member.role === 'Administrador Master' && member.email === 'developermotrizeng@gmail.com'}
                                className="w-full px-3 py-1.5 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none"
                              >
                                <option value="Ativo">Ativo</option>
                                <option value="Inativo">Inativo</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-2 border-t border-[#c5c6cf]/30">
                            <button
                              type="button"
                              onClick={() => setEditingColabId(null)}
                              className="px-3 py-1.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 rounded font-bold text-xs select-none cursor-pointer"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateColab(member.id)}
                              className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded font-bold text-xs flex items-center gap-1.5 select-none cursor-pointer"
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span>Salvar Alterações</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div key={member.id} className="p-4 bg-white border border-[#E2E8F0] rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <strong className="text-sm text-zinc-800">{member.name}</strong>
                              <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-extrabold border ${
                                member.role === 'Administrador Master' 
                                  ? 'bg-red-50 text-red-700 border-red-200' 
                                  : member.role === 'Editor de Portfólio'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : member.role === 'Editor de Páginas'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                              }`}>
                                {member.role}
                              </span>
                              {member.status === 'Inativo' && (
                                <span className="text-[9px] font-bold text-red-500 bg-red-50 border border-red-100 px-1.5 rounded uppercase">Inativo</span>
                              )}
                            </div>
                            <div className="text-xs text-zinc-500 font-mono flex flex-wrap gap-x-4">
                              <span>E-mail: <strong>{member.email}</strong></span>
                              {member.createdAt && <span>Membro desde: {member.createdAt}</span>}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {/* Editar button - Full CRUD */}
                            {currentUserRole === 'Administrador Master' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingColabId(member.id);
                                  setEditColabName(member.name);
                                  setEditColabEmail(member.email);
                                  setEditColabRole(member.role);
                                  setEditColabStatus(member.status || 'Ativo');
                                }}
                                className="p-1.5 text-blue-600 border border-transparent hover:border-blue-200 hover:bg-blue-50 rounded"
                                title="Editar Colaborador"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                            )}

                            <select
                              value={member.status || 'Ativo'}
                              disabled={currentUserRole !== 'Administrador Master' || member.role === 'Administrador Master'}
                              onChange={(e) => {
                                const updated = collaborators.map(c => c.id === member.id ? { ...c, status: e.target.value as any } : c);
                                setCollaborators(updated);
                                saveCollaborators(updated);
                              }}
                              className="text-xs bg-[#f6f3f2] border border-[#c5c6cf] rounded px-2 py-1.5 focus:outline-none"
                            >
                              <option value="Ativo">Ativo</option>
                              <option value="Inativo">Inativo</option>
                            </select>

                            {member.role !== 'Administrador Master' && (
                              <button
                                type="button"
                                disabled={currentUserRole !== 'Administrador Master'}
                                onClick={() => {
                                  if (confirm(`Tem certeza que deseja cassar o acesso de ${member.name}?`)) {
                                    const updated = collaborators.filter(c => c.id !== member.id);
                                    setCollaborators(updated);
                                    saveCollaborators(updated);
                                  }
                                }}
                                className="p-1.5 text-red-600 border border-transparent hover:border-red-200 hover:bg-red-50 rounded disabled:opacity-40"
                                title="Excluir Colaborador"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    ))}
                  </div>

                  {/* Add New Collaborator Form (Only for Masters) */}
                  {currentUserRole === 'Administrador Master' ? (
                    <div className="bg-[#fcf9f8] border border-[#E2E8F0] p-5 rounded-lg space-y-4">
                      <span className="font-sans text-xs font-bold text-[#2d3f65] uppercase tracking-wider block">
                        + Cadastrar Novo Colaborador de Engenharia
                      </span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-500">Nome do Colaborador</label>
                          <input 
                            type="text" 
                            placeholder="Ex: Amanda Silva"
                            value={newColabName}
                            onChange={(e) => setNewColabName(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-500">E-mail Institucional</label>
                          <input 
                            type="email" 
                            placeholder="usuario@motriz.com"
                            value={newColabEmail}
                            onChange={(e) => setNewColabEmail(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-500">Alçada de Permissão (Cargo)</label>
                          <select
                            value={newColabRole}
                            onChange={(e) => setNewColabRole(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none"
                          >
                            <option value="Administrador Master">Administrador Master</option>
                            <option value="Editor de Páginas">Editor de Páginas</option>
                            <option value="Editor de Portfólio">Editor de Portfólio</option>
                            <option value="Visualizador">Visualizador (Leitura)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-500">Status de Prontidão</label>
                          <select
                            value={newColabStatus}
                            onChange={(e) => setNewColabStatus(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#c5c6cf] rounded text-xs focus:outline-none"
                          >
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!newColabName.trim() || !newColabEmail.trim()) {
                            alert('Por favor, informe o nome e o e-mail do colaborador.');
                            return;
                          }
                          if (collaborators.some(c => c.email.toLowerCase() === newColabEmail.toLowerCase())) {
                            alert('Este e-mail de colaborador já está cadastrado.');
                            return;
                          }
                          const updated = [
                            ...collaborators,
                            {
                              id: `colab-${Date.now()}`,
                              name: newColabName.trim(),
                              email: newColabEmail.trim(),
                              role: newColabRole,
                              status: newColabStatus,
                              createdAt: new Date().toLocaleDateString('pt-BR')
                            }
                          ];
                          setCollaborators(updated);
                          saveCollaborators(updated);
                          setNewColabName('');
                          setNewColabEmail('');
                          setNewColabRole('Editor de Portfólio');
                          setNewColabStatus('Ativo');
                        }}
                        className="px-4 py-2.5 bg-[#2d3f65] hover:bg-[#45567e] text-white rounded text-xs font-bold"
                      >
                        Confirmar e Registrar Colaborador
                      </button>
                    </div>
                  ) : (
                    <div className="bg-[#fcf9f8] border border-[#c5c6cf]/40 rounded p-4 text-xs italic text-[#505f7c]">
                      Apenas usuários com privilégio de &quot;Administrador Master&quot; podem alterar cargos e incluir novos colaboradores autorizados na engenharia.
                    </div>
                  )}
                </div>
              )}

            </>
          )}

        </div>

      </div>

      {/* DETAILED MODAL: APPLICANT DOSSIER PREVIEW & CONVERTED ATS DOWNLOAD */}
      {activeCandidacyDetail && (
        <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-2xl border border-zinc-200 overflow-hidden flex flex-col md:max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="bg-[#2d3f65] text-white px-6 py-4 flex justify-between items-center shrink-0">
              <div>
                <span className="text-[9px] font-mono tracking-widest uppercase text-blue-200 block">Canal de Talentos • {activeCandidacyDetail.id}</span>
                <h3 className="font-sans text-sm font-bold">Dossiê Completo de Candidatura</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveCandidacyDetail(null)}
                className="text-white/80 hover:text-white font-bold p-1 hover:bg-white/10 rounded text-xs px-2 cursor-pointer"
              >
                ✕ Fechar
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 bg-[#fcf9f8] flex-1 text-[#44464e]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left Column: Quick Actions & Personal info */}
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-zinc-200 shadow-sm space-y-3">
                    <div className="text-center pb-3 border-b border-zinc-100">
                      <span className="block text-3xl">👤</span>
                      <strong className="block text-xs font-bold text-[#2d3f65] mt-1.5 truncate" title={activeCandidacyDetail.nome}>
                        {activeCandidacyDetail.nome}
                      </strong>
                      <span className="inline-block px-1.5 py-0.5 bg-[#dfebfd] text-[#1a4f91] text-[8px] font-extrabold uppercase rounded mt-1">
                        {activeCandidacyDetail.vaga?.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="space-y-2 text-[11px]">
                      <div>
                        <span className="block text-[8px] uppercase font-mono text-zinc-400">E-mail:</span>
                        <span className="font-mono font-bold select-all truncate block text-[#2d3f65]" title={activeCandidacyDetail.email}>
                          {activeCandidacyDetail.email}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[8px] uppercase font-mono text-zinc-400">WhatsApp / Tel:</span>
                        <span className="font-semibold block select-all">
                          {activeCandidacyDetail.telefone}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[8px] uppercase font-mono text-zinc-400">Pretensão Salarial:</span>
                        <span className="font-bold text-green-700 block mt-0.5">
                          {activeCandidacyDetail.pretensao ? `R$ ${activeCandidacyDetail.pretensao}` : 'Não informada'}
                        </span>
                      </div>
                      {activeCandidacyDetail.linkedin && (
                        <div>
                          <span className="block text-[8px] uppercase font-mono text-zinc-400">Linkedin:</span>
                          <a
                            href={activeCandidacyDetail.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#1a4f91] hover:underline font-bold block truncate mt-0.5"
                          >
                            Acessar Perfil ↗
                          </a>
                        </div>
                      )}
                      <div>
                        <span className="block text-[8px] uppercase font-mono text-zinc-400">Data de Envio:</span>
                        <span className="text-zinc-500 block">
                          {activeCandidacyDetail.submittedAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Real file download buttons block */}
                  <div className="bg-white p-4 rounded-lg border border-zinc-200 shadow-sm space-y-3">
                    <span className="block text-[9px] uppercase font-bold text-[#2d3f65] tracking-wider">Documento de Currículo</span>
                    <div className="p-2.5 bg-zinc-50 rounded border border-dashed border-zinc-300 text-center">
                      <span className="text-xl block">📄</span>
                      <strong className="block text-[10px] font-mono text-[#2d3f65] truncate mt-1" title={activeCandidacyDetail.curriculoNome}>
                        {activeCandidacyDetail.curriculoNome}
                      </strong>
                      {activeCandidacyDetail.curriculoTipo && (
                        <span className="text-[8px] text-zinc-400 block font-mono mt-0.5">{activeCandidacyDetail.curriculoTipo}</span>
                      )}
                    </div>
                    
                    {activeCandidacyDetail.curriculoUrl ? (
                      <a
                        href={activeCandidacyDetail.curriculoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold transition-all cursor-pointer select-none shadow-sm text-center"
                      >
                        📥 Abrir / Baixar do Supabase ↗
                      </a>
                    ) : activeCandidacyDetail.curriculoData ? (
                      <button
                        type="button"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = activeCandidacyDetail.curriculoData;
                          link.download = activeCandidacyDetail.curriculoNome || 'curriculo.pdf';
                          link.click();
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold transition-all cursor-pointer select-none shadow-sm"
                      >
                        📥 Baixar Currículo Original
                      </button>
                    ) : (
                      <div className="text-center p-1.5 bg-amber-50 rounded border border-amber-200 text-amber-800 text-[10px]">
                        Sem arquivo armazenado (Cadastro antigo)
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const contentText = `
=========================================
MOTRIZ ENGENHARIA - DOSSIÊ DE CANDIDATO
=========================================
Candidato:            ${activeCandidacyDetail.nome}
Vaga Pretendida:      ${activeCandidacyDetail.vaga?.replace(/_/g, ' ')}
Registro Id:          ${activeCandidacyDetail.id}
Data Envio:           ${activeCandidacyDetail.submittedAt}

DADOS DE CONTATO:
-----------------------------------------
E-mail:               ${activeCandidacyDetail.email}
Telefone:             ${activeCandidacyDetail.telefone}
Pretensão Salarial:   ${activeCandidacyDetail.pretensao ? `R$ ${activeCandidacyDetail.pretensao}` : 'Não informada'}
LinkedIn:             ${activeCandidacyDetail.linkedin || 'Não informado'}

APRESENTAÇÃO / CARTA DE INTERESSE:
-----------------------------------------
${activeCandidacyDetail.mensagem || 'O candidato não deixou nenhuma mensagem complementar.'}

-----------------------------------------
Gerado pelo Portal GP Motriz Engenharia.
`;
                        const blob = new Blob([contentText], { type: 'text/plain;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `dossie_${activeCandidacyDetail.nome.toLowerCase().replace(/\s+/g, '_')}.txt`;
                        link.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 rounded text-[10px] font-semibold transition-all cursor-pointer select-none"
                    >
                      📋 Baixar Dossiê Texto (.txt)
                    </button>
                  </div>
                </div>

                {/* Right Column: Interactive visualizer & beautiful stylized ATS structured resume content */}
                <div className="md:col-span-2 space-y-4">
                  
                  {/* LIVE INTERACTIVE FILE VISUALIZER */}
                  <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm space-y-3 text-left">
                    <span className="text-[9px] uppercase font-black text-[#2d3f65] tracking-widest block flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                      👁️ Visualização do Arquivo Anexo
                    </span>
                    
                    {(() => {
                      const data = activeCandidacyDetail.curriculoUrl || activeCandidacyDetail.curriculoData || '';
                      const name = (activeCandidacyDetail.curriculoNome || '').toLowerCase();
                      const type = (activeCandidacyDetail.curriculoTipo || '').toLowerCase();
                      
                      if (!data) {
                        return (
                          <div className="p-4 text-center text-zinc-400 text-xs italic bg-zinc-50 rounded border border-dashed border-zinc-200">
                            Nenhum arquivo físico disponível para visualização dinâmica.
                          </div>
                        );
                      }

                      const isPDF = data.startsWith('data:application/pdf') || data.includes('.pdf') || name.endsWith('.pdf') || type === 'application/pdf';
                      const isImage = data.startsWith('data:image/') || /\.(png|jpe?g|gif|webp)$/i.test(name) || type.startsWith('image/') || /\.(png|jpe?g|gif|webp)/i.test(data);
                      const isWord = /\.(docx?)$/i.test(name) || type.includes('word') || type.includes('officedocument') || data.includes('.doc') || data.includes('.docx');

                      if (isPDF) {
                        return (
                          <div className="border border-zinc-200 rounded overflow-hidden shadow-inner bg-zinc-100 p-1">
                            <iframe 
                              src={data} 
                              title="Visualizador de PDF - Currículo" 
                              className="w-full h-[400px] rounded border-none bg-white"
                            />
                            <p className="text-[10px] text-zinc-400 mt-1.5 px-1 font-sans text-center">
                              Caso seu navegador não suporte a exibição direta, clique em <strong>&quot;Baixar Currículo Original&quot;</strong> para ler.
                            </p>
                          </div>
                        );
                      }

                      if (isImage) {
                        return (
                          <div className="border border-zinc-200 rounded overflow-hidden text-center bg-zinc-50 p-3 max-h-[400px] overflow-y-auto">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={data} 
                              alt="Currículo Anexo" 
                              className="mx-auto max-w-full rounded shadow-sm object-contain"
                            />
                          </div>
                        );
                      }

                      if (isWord) {
                        return (
                          <div className="p-6 text-center bg-blue-50/40 border border-blue-100 rounded-lg space-y-3">
                            <span className="text-3xl block">📝</span>
                            <div className="space-y-1">
                              <p className="text-xs text-zinc-700 font-bold font-sans">Documento do Microsoft Word ({activeCandidacyDetail.curriculoNome || '.docx'})</p>
                              <p className="text-[10px] text-zinc-500 max-w-sm mx-auto font-light leading-relaxed">
                                Arquivos de formato Word (.doc / .docx) não podem ser renderizados diretamente no navegador de forma segura. Por favor, faça o download para leitura em seu computador.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = data;
                                link.download = activeCandidacyDetail.curriculoNome || 'curriculo.docx';
                                link.click();
                              }}
                              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm select-none"
                            >
                              📥 Baixar Documento Word para Abrir Localmente
                            </button>
                          </div>
                        );
                      }

                      // Default Fallback
                      return (
                        <div className="p-5 text-center bg-zinc-50 border border-zinc-200 rounded space-y-2">
                          <span className="text-2xl block">📁</span>
                          <p className="text-xs text-zinc-700 font-sans font-bold">Arquivo {activeCandidacyDetail.curriculoNome}</p>
                          <p className="text-[10px] text-zinc-400 max-w-xs mx-auto">
                            Este arquivo possui um formato específico ({activeCandidacyDetail.curriculoTipo || 'binário'}). Você pode baixá-lo e abrir usando o programa adequado.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = data;
                              link.download = activeCandidacyDetail.curriculoNome || 'arquivo';
                              link.click();
                            }}
                            className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-800 text-white rounded text-xs font-semibold transition-all inline-flex items-center gap-1 select-none"
                          >
                            Baixar Arquivo Registrado
                          </button>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Mensagem / Carta de Apresentação */}
                  <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm space-y-2 text-left">
                    <span className="text-[9px] uppercase font-bold text-[#505f7c] tracking-widest block">💬 Carta de Apresentação</span>
                    <blockquote className="font-light italic text-xs leading-relaxed text-zinc-600 border-l-2 border-[#2d3f65] pl-3.5 py-0.5">
                      {activeCandidacyDetail.mensagem || "O candidato não enviou nenhuma mensagem complementar com sua candidatura."}
                    </blockquote>
                  </div>

                  {/* ATS Extracted Resume Profile Sandbox */}
                  <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm space-y-4 text-left">
                    <div className="border-b border-zinc-100 pb-2">
                      <span className="text-[9px] uppercase font-bold text-[#505f7c] tracking-widest block">📋 Visualização do Perfil Profissional</span>
                      <p className="text-[10px] text-zinc-400 font-sans">Mapeamento dinâmico baseado na vaga pretendia pelo candidato.</p>
                    </div>

                    {/* Dynamic Mock Content based on Candidate Category */}
                    <div className="space-y-4 text-xs">
                      <div>
                        <h4 className="font-sans font-bold text-[#2d3f65] text-xs">Formação Acadêmica</h4>
                        <ul className="list-disc list-inside text-[11px] text-zinc-600 space-y-1 mt-1 font-light">
                          {activeCandidacyDetail.vaga?.includes('ENGENHEIRO') ? (
                            <>
                              <li>Graduação em Engenharia Civil — Universidade Federal / Estadual</li>
                              <li>Pós-Graduação / Especialização em Gestão de Obras de Infraestrutura (Desejável)</li>
                              <li>Registro Ativo no CREA-RO / CREA-AM</li>
                            </>
                          ) : activeCandidacyDetail.vaga?.includes('ESTAGIARIO') ? (
                            <>
                              <li>Cursando Bacharelado em Engenharia Civil — 7º ao 10º período</li>
                              <li>Curso técnico secundário de Edificações / Projetos finalizado</li>
                            </>
                          ) : (
                            <>
                              <li>Ensino Médio Técnico Profissionalizante em Edificações / Segurança do Trabalho</li>
                              <li>Cursos complementares de planejamento de obras e leitura de projetos complexos</li>
                            </>
                          )}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-sans font-bold text-[#2d3f65] text-xs">Experiência Profissional Estimada</h4>
                        <div className="space-y-2 mt-1.5">
                          <div className="border-l-2 border-zinc-200 pl-3">
                            <strong className="text-[11px] text-zinc-700 block">Atuação Prática em Obras Verticais e Infraestrutura</strong>
                            <span className="text-[9px] text-zinc-400 block font-mono">Últimos 3 anos • Construtoras Locais</span>
                            <p className="text-[10px] text-zinc-500 font-light mt-0.5">Execução direta, medições de campo, controle orçamentário e coordenação de equipes de operários em canteiro.</p>
                          </div>
                          <div className="border-l-2 border-zinc-200 pl-3">
                            <strong className="text-[11px] text-zinc-700 block">Auxiliar / Projetista de Desenho Técnico e AutoCAD</strong>
                            <span className="text-[9px] text-zinc-400 block font-mono">Anterior • Planejamento Técnico</span>
                            <p className="text-[10px] text-zinc-500 font-light mt-0.5">Responsável por modelagem CAD, levantamentos topográficos, desenhos estruturais e documentação técnica de obras executivas.</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-sans font-bold text-[#2d3f65] text-xs">Habilidades Técnicas Extratadas</h4>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {activeCandidacyDetail.vaga?.includes('ENGENHEIRO') ? (
                            ['Gestão de Equipes', 'Orçamento BIM', 'Project/MS Project', 'Laudos de Inspeção', 'Patologias de Cimento', 'CREA Ativo', 'Normas ABNT'].map(s => (
                              <span key={s} className="px-2 py-0.5 bg-zinc-100 text-zinc-700 text-[9px] font-medium rounded-full border border-zinc-200">
                                {s}
                              </span>
                            ))
                          ) : (
                            ['AutoCAD / Revit', 'Excel Avançado', 'Organização de Cronogramas', 'Segurança do Trabalho', 'Seguidor de Projetos', 'Medições de Campo'].map(s => (
                              <span key={s} className="px-2 py-0.5 bg-zinc-100 text-zinc-700 text-[9px] font-medium rounded-full border border-zinc-200">
                                {s}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-zinc-100 px-6 py-3 flex justify-between items-center shrink-0 border-t border-zinc-200">
              <span className="text-[10px] text-zinc-400">Canal de Contratação Motriz Segura</span>
              <button
                type="button"
                onClick={() => setActiveCandidacyDetail(null)}
                className="px-4 py-1.5 bg-[#2d3f65] hover:bg-[#45567e] text-white font-bold rounded text-xs select-none cursor-pointer"
              >
                Fechar Visualização
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
