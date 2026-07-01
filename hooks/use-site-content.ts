'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { SiteContent, defaultSiteContent } from '../lib/defaultData';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

/**
 * Auxiliar para efetuar o merge seguro de dados do siteContent,
 * garantindo compatibilidade com propriedades padrão do schema.
 */
function mergeContent(parsed: any): SiteContent {
  if (!parsed || typeof parsed !== 'object') return defaultSiteContent;

  if (parsed.hero && Array.isArray(parsed.hero.bottomTags)) {
    parsed.hero.bottomTags = parsed.hero.bottomTags.map(
      (t: string) => (t === 'TECNOLOGIA' ? 'CONSTRUÇÃO' : t)
    );
  }

  return {
    ...defaultSiteContent,
    ...parsed,
    about: {
      ...defaultSiteContent.about,
      ...(parsed.about || {}),
      mvv: parsed.about?.mvv ?? defaultSiteContent.about.mvv ?? [],
    },
    specialties: {
      ...defaultSiteContent.specialties,
      ...(parsed.specialties || {}),
      items:
        parsed.specialties?.items && parsed.specialties.items.length > 0
          ? parsed.specialties.items.map((it: any, idx: number) => {
              const def = defaultSiteContent.specialties.items[idx] || {};
              const item = { ...def, ...it };
              if (item.title === 'PAVIMENTAÇÃO' && (item.icon === 'Wrench' || item.icon === 'Milestone')) {
                item.icon = 'Roller';
              }
              return item;
            })
          : defaultSiteContent.specialties.items.map((item) => {
              if (item.title === 'PAVIMENTAÇÃO' && (item.icon === 'Wrench' || item.icon === 'Milestone')) {
                return { ...item, icon: 'Roller' };
              }
              return item;
            }),
    },
    portfolio: {
      ...defaultSiteContent.portfolio,
      ...(parsed.portfolio || {}),
      items: parsed.portfolio?.items ?? defaultSiteContent.portfolio.items,
    },
    partners: {
      tag:
        parsed.partners?.tag ??
        defaultSiteContent.partners?.tag ??
        'NOSSOS PARCEIROS',
      title:
        parsed.partners?.title ??
        defaultSiteContent.partners?.title ??
        'Empresas e órgãos que confiam na nossa engenharia',
      items:
        parsed.partners?.items ??
        defaultSiteContent.partners?.items ??
        [],
    },
    uploadedFiles:
      parsed.uploadedFiles ?? defaultSiteContent.uploadedFiles ?? [],
    careersEmail:
      parsed.careersEmail ??
      defaultSiteContent.careersEmail ??
      'rh@motrizengenharia.com.br',
    candidacies:
      parsed.candidacies ?? defaultSiteContent.candidacies ?? [],
    careersPage:
      parsed.careersPage ?? defaultSiteContent.careersPage,
  };
}

// Variáveis globais para cache em memória na mesma sessão
let globalSiteContentCache: SiteContent | null = null;
let globalFetchPromise: Promise<void> | null = null;

/**
 * Hook reutilizável para carregar e sincronizar o conteúdo do site
 * a partir do Supabase ou localStorage (fallback).
 */
export function useSiteContent() {
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    if (globalSiteContentCache) return globalSiteContentCache;
    // Tenta carregar do localStorage de forma síncrona/imediata antes de montar
    if (typeof window !== 'undefined') {
      try {
        const persisted = localStorage.getItem('motriz_landing_content');
        if (persisted) {
          const parsed = JSON.parse(persisted);
          return mergeContent(parsed);
        }
      } catch (e) {}
    }
    return defaultSiteContent;
  });

  // Se tivermos cache de memória ou localStorage e não for modo admin, monta direto para evitar spinners
  const [isMounted, setIsMounted] = useState(() => {
    if (globalSiteContentCache) return true;
    if (typeof window !== 'undefined') {
      try {
        const isAdmin = window.location.search.includes('admin=true');
        if (!isAdmin && localStorage.getItem('motriz_landing_content')) {
          return true;
        }
      } catch (e) {}
    }
    return false;
  });

  const hasUpdatedRef = useRef(false);

  // Wrap setSiteContent to detect when the state is modified by the admin
  const setSiteContentExternal = useCallback((newContent: SiteContent | ((prev: SiteContent) => SiteContent)) => {
    hasUpdatedRef.current = true;
    
    // Atualiza o cache global também
    if (typeof newContent === 'function') {
      setSiteContent((prev) => {
        const nextContent = newContent(prev);
        globalSiteContentCache = nextContent;
        return nextContent;
      });
    } else {
      globalSiteContentCache = newContent;
      setSiteContent(newContent);
    }
  }, []);

  // Garante o montagem imediata no lado do cliente para evitar spinners travados
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadContentRemote() {
      let fetchedFromRemote = false;

      if (isSupabaseConfigured()) {
        try {
          const fetchPromise = supabase
            .from('site_content')
            .select('content')
            .eq('id', 'motriz_landing_content')
            .maybeSingle();
            
          // Fallback timeout de 8 segundos para evitar travamento em background caso o Supabase caia totalmente
          const timeoutPromise = new Promise((resolve) => 
            setTimeout(() => resolve({ error: new Error('Timeout') }), 8000)
          );

          const { data, error } = (await Promise.race([fetchPromise, timeoutPromise])) as any;

          if (error) {
            console.warn('Erro ao carregar do Supabase:', error);
          } else if (data && data.content && active) {
            fetchedFromRemote = true;
            const newContent = mergeContent(data.content);
            globalSiteContentCache = newContent;

            // Só atualiza o estado se o usuário não tiver feito edições locais na sessão atual
            if (!hasUpdatedRef.current) {
              setSiteContent(newContent);
            }
            
            // Atualiza sempre o localStorage para cache no próximo carregamento
            try {
              const secureContent = { ...data.content };
              delete secureContent.smtp;
              delete secureContent.candidacies;
              const filesToSave = secureContent.uploadedFiles || [];
              delete secureContent.uploadedFiles;
              localStorage.setItem('motriz_landing_content', JSON.stringify(secureContent));
              localStorage.setItem('motriz_uploaded_files', JSON.stringify(filesToSave));
            } catch (lsErr) {
              console.warn('Erro ao salvar no LocalStorage após fetch remoto:', lsErr);
            }
            return;
          }
        } catch (supErr) {
          console.warn('Falha na requisição em segundo plano do Supabase:', supErr);
        }
      }

      // Se falhar o Supabase e não tivermos cache local na inicialização, tenta ler do localStorage
      if (!fetchedFromRemote && active) {
        try {
          const persisted = localStorage.getItem('motriz_landing_content');
          const persistedFiles = localStorage.getItem('motriz_uploaded_files');
          if (persisted) {
            const parsed = JSON.parse(persisted);
            if (persistedFiles) {
              try {
                parsed.uploadedFiles = JSON.parse(persistedFiles);
              } catch (e) {}
            }
            const fallbackContent = mergeContent(parsed);
            globalSiteContentCache = fallbackContent;

            if (!hasUpdatedRef.current) {
              setSiteContent(fallbackContent);
            }
          }
        } catch (e) {}
      }
    }

    if (!globalFetchPromise) {
      globalFetchPromise = loadContentRemote();
    } else {
      // Aguarda a promessa global terminar se já estiver carregando em outro componente
      globalFetchPromise.then(() => {
        if (active && globalSiteContentCache && !hasUpdatedRef.current) {
          setSiteContent(globalSiteContentCache);
        }
      });
    }

    return () => {
      active = false;
    };
  }, []);

  return { siteContent, setSiteContent: setSiteContentExternal, isMounted };
}