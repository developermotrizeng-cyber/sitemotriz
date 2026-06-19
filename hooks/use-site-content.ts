'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    let active = true;

    async function loadContent() {
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('site_content')
            .select('content')
            .eq('id', 'motriz_landing_content')
            .maybeSingle();

          if (error) {
            console.warn('Erro ao carregar do Supabase. Usando localStorage...', error);
          } else if (data && data.content && active) {
            setSiteContent(mergeContent(data.content));
            setIsMounted(true);
            return;
          }
        } catch (supErr) {
          console.warn('Falha na requisição do Supabase. Usando fallback local...', supErr);
        }
      }

      // Fallback
      try {
        const persisted = localStorage.getItem('motriz_landing_content');
        if (persisted && active) {
          const parsed = JSON.parse(persisted);
          setSiteContent(mergeContent(parsed));
        }
      } catch (e) {
        console.warn('Erro ao carregar do localStorage.', e);
      }
      if (active) {
        setIsMounted(true);
      }
    }

    setTimeout(() => {
      loadContent();
    }, 0);

    return () => {
      active = false;
    };
  }, []);

  return { siteContent, setSiteContent, isMounted };
}