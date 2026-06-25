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

/**
 * Hook reutilizável para carregar e sincronizar o conteúdo do site
 * a partir do Supabase ou localStorage (fallback).
 */
export function useSiteContent() {
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [isMounted, setIsMounted] = useState(false);
  const hasUpdatedRef = useRef(false);

  // Wrap setSiteContent to detect when the state is modified by the admin
  const setSiteContentExternal = useCallback((newContent: SiteContent | ((prev: SiteContent) => SiteContent)) => {
    hasUpdatedRef.current = true;
    setSiteContent(newContent);
  }, []);

  useEffect(() => {
    let active = true;

    // 1. Load from localStorage immediately on mount
    try {
      const persisted = localStorage.getItem('motriz_landing_content');
      const persistedFiles = localStorage.getItem('motriz_uploaded_files');
      if (persisted && active) {
        const parsed = JSON.parse(persisted);
        if (persistedFiles) {
          try {
            parsed.uploadedFiles = JSON.parse(persistedFiles);
          } catch (e) {
            console.warn('Erro ao parsear arquivos do localStorage', e);
          }
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSiteContent(mergeContent(parsed));
      }
    } catch (e) {
      console.warn('Erro ao carregar do localStorage no início.', e);
    }
    
    // If we have cached content in localStorage, mount immediately to show it
    let hasCache = false;
    try {
      if (localStorage.getItem('motriz_landing_content')) {
        hasCache = true;
      }
    } catch (e) {}

    if (active && hasCache) {
      setIsMounted(true);
    }

    // Safety timeout to force mount after 1.5 seconds if Supabase query is slow
    const mountTimeout = setTimeout(() => {
      if (active) {
        setIsMounted(true);
      }
    }, 1500);

    // 2. Fetch the latest content from Supabase in the background
    async function loadContentRemote() {
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('site_content')
            .select('content')
            .eq('id', 'motriz_landing_content')
            .maybeSingle();

          if (error) {
            console.warn('Erro ao carregar do Supabase em segundo plano:', error);
          } else if (data && data.content && active) {
            // Only update active state if the user hasn't made edits in the current session
            if (!hasUpdatedRef.current) {
              setSiteContent(mergeContent(data.content));
            }
            
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
          }
        } catch (supErr) {
          console.warn('Falha na requisição em segundo plano do Supabase:', supErr);
        } finally {
          if (active) {
            setIsMounted(true);
          }
        }
      } else {
        if (active) {
          setIsMounted(true);
        }
      }
    }

    loadContentRemote();

    return () => {
      active = false;
      clearTimeout(mountTimeout);
    };
  }, []);

  return { siteContent, setSiteContent: setSiteContentExternal, isMounted };
}