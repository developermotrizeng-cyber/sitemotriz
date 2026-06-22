import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Função utilitária para verificar se a integração com o Supabase
 * está ativada (se as credenciais foram fornecidas via variáveis de ambiente).
 */
export const isSupabaseConfigured = (): boolean => {
  return (
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    supabaseUrl !== 'MY_SUPABASE_URL' &&
    supabaseAnonKey !== 'MY_SUPABASE_ANON_KEY'
  );
};

// Criação do cliente Supabase de forma segura. Caso as chaves não estejam presentes,
// exportamos null para evitar erro de inicialização em tempo de importação.
// Timeout de 8s evita que requisições em segundo plano fiquem pendentes por muito tempo
// caso o banco esteja pausado (comum na camada gratuita do Supabase).
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: (url, options = {}) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);
          return fetch(url, {
            ...options,
            signal: controller.signal,
          }).finally(() => clearTimeout(timeoutId));
        },
      },
    })
  : (null as any);

