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
              return { ...def, ...it };
            })
          : defaultSiteContent.specialties.items,
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
  const [siteContent, setSiteContent] = useState<SiteContent>(
    globalSiteContentCache || defaultSiteContent
  );
  // Se já tivermos no cache de memória, não precisamos mostrar loading
  const [isMounted, setIsMounted] = useState(!!globalSiteContentCache);
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

  useEffect(() => {
    let active = true;

    // Se já carregou nesta sessão, termina imediatamente
    if (globalSiteContentCache) {
      if (!isMounted) setIsMounted(true);
      return;
    }

    // Criamos um timeout para carregar o LocalStorage se o Supabase demorar mais de 1.5 segundos
    const fallbackTimeout = setTimeout(() => {
      if (!active) return;
      console.log('Supabase demorou mais de 1.5s. Usando LocalStorage/dados locais como fallback...');
      try {
        const persisted = localStorage.getItem('motriz_landing_content');
        const persistedFiles = localStorage.getItem('motriz_uploaded_files');
        if (persisted) {
          const parsed = JSON.parse(persisted);
          if (persistedFiles) {
            try {
              parsed.uploadedFiles = JSON.parse(persistedFiles);
            } catch (e) {
              console.warn('Erro ao parsear arquivos do localStorage', e);
            }
          }
          const fallbackContent = mergeContent(parsed);
          globalSiteContentCache = fallbackContent;

          if (!hasUpdatedRef.current) {
            setSiteContent(fallbackContent);
          }
        }
      } catch (e) {
        console.warn('Erro ao carregar do localStorage no fallback.', e);
      }

      // Libera a UI com dados locais
      setIsMounted(true);
    }, 1500);

    async function loadContentRemote() {
      let fetchedFromRemote = false;

      if (isSupabaseConfigured()) {
        try {
          const fetchPromise = supabase
            .from('site_content')
            .select('content')
            .eq('id', 'motriz_landing_content')
            .maybeSingle();
            
          // Fallback timeout de 8 segundos para evitar spinner infinito caso o Supabase caia totalmente
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

            // Cancela o timeout do fallback para usar diretamente os dados frescos do Supabase
            clearTimeout(fallbackTimeout);

            // Only update active state if the user hasn't made edits in the current session
            if (!hasUpdatedRef.current) {
              setSiteContent(newContent);
            }
            
            // Libera a tela com os dados atualizados
            setIsMounted(true);
            
            // Always update localStorage cache for the next reload
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

      // Se falhar a conexão com o Supabase antes do timeout de 1.5s, força o fallback imediato
      if (!fetchedFromRemote && active) {
        clearTimeout(fallbackTimeout);
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
        setIsMounted(true);
      }
    }

    if (!globalFetchPromise) {
      globalFetchPromise = loadContentRemote();
    } else {
      // Aguarda a promessa global terminar se já estiver carregando em outra aba/componente
      globalFetchPromise.then(() => {
        if (active) {
          clearTimeout(fallbackTimeout);
          if (globalSiteContentCache && !hasUpdatedRef.current) {
            setSiteContent(globalSiteContentCache);
          }
          setIsMounted(true);
        }
      });
    }

    return () => {
      active = false;
      clearTimeout(fallbackTimeout);
    };
  }, [isMounted]);

  return { siteContent, setSiteContent: setSiteContentExternal, isMounted };
}