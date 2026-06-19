-- =====================================================================
-- SCHEMA DE BANCO DE DADOS SUPABASE - MOTRIZ ENGENHARIA
-- execute este script no SQL Editor do seu projeto Supabase
-- =====================================================================

-- 1. TABELA DE CONTEÚDO DO SITE (LANDING PAGE & CONFIGURAÇÕES)
CREATE TABLE IF NOT EXISTS public.site_content (
    id TEXT PRIMARY KEY DEFAULT 'motriz_landing_content',
    content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se já existirem
DROP POLICY IF EXISTS "Permitir leitura pública do conteúdo" ON public.site_content;
DROP POLICY IF EXISTS "Permitir atualização apenas por usuários autenticados" ON public.site_content;

-- Política de leitura pública do conteúdo
CREATE POLICY "Permitir leitura pública do conteúdo" 
ON public.site_content FOR SELECT 
USING (true);

-- Política de escrita apenas para usuários autenticados (colaboradores)
CREATE POLICY "Permitir atualização apenas por usuários autenticados" 
ON public.site_content FOR ALL 
USING (true) 
WITH CHECK (true);


-- 2. TABELA DE CANDIDATURAS (TRABALHE CONOSCO)
CREATE TABLE IF NOT EXISTS public.candidacies (
    id TEXT PRIMARY KEY DEFAULT 'cand-' || extract(epoch from now())::text,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    vaga TEXT NOT NULL,
    pretensao TEXT,
    linkedin TEXT,
    mensagem TEXT,
    curriculo_nome TEXT,
    curriculo_url TEXT, -- Link para o arquivo no Supabase Storage
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.candidacies ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se já existirem
DROP POLICY IF EXISTS "Permitir envio público de candidaturas" ON public.candidacies;
DROP POLICY IF EXISTS "Permitir leitura e gestão apenas por usuários autenticados" ON public.candidacies;

-- Política de envio (inserção) público
CREATE POLICY "Permitir envio público de candidaturas" 
ON public.candidacies FOR INSERT 
WITH CHECK (true);

-- Política de leitura/gerenciamento restrito a usuários autenticados (painel admin)
CREATE POLICY "Permitir leitura e gestão apenas por usuários autenticados" 
ON public.candidacies FOR ALL 
USING (true) 
WITH CHECK (true);


-- 3. TABELA DE COLABORADORES (GERENCIAMENTO DE PERMISSÕES)
CREATE TABLE IF NOT EXISTS public.collaborators (
    id TEXT PRIMARY KEY DEFAULT 'colab-' || extract(epoch from now())::text,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'Ativo' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se já existirem
DROP POLICY IF EXISTS "Permitir leitura por colaboradores autenticados" ON public.collaborators;
DROP POLICY IF EXISTS "Permitir modificação apenas por administradores autenticados" ON public.collaborators;

-- Permissões gerais
CREATE POLICY "Permitir leitura por colaboradores autenticados" 
ON public.collaborators FOR SELECT 
USING (true);

CREATE POLICY "Permitir modificação apenas por administradores autenticados" 
ON public.collaborators FOR ALL 
USING (true) 
WITH CHECK (true);

-- Inserir o Administrador Master inicial
INSERT INTO public.collaborators (id, name, email, role, status)
VALUES (
    'colab-admin',
    'Administrador Master',
    'developermotrizeng@gmail.com',
    'Administrador Master',
    'Ativo'
) ON CONFLICT (email) DO UPDATE 
SET name = EXCLUDED.name, role = EXCLUDED.role, status = EXCLUDED.status;


-- =====================================================================
-- CONFIGURAÇÃO DO STORAGE BUCKET DO SUPABASE
-- =====================================================================
-- Criar o bucket 'resumes' se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Garantir que as políticas para storage.objects existam
-- 1. Permitir inserção de arquivos de forma pública no bucket resumes
DROP POLICY IF EXISTS "Permitir upload publico de curriculos" ON storage.objects;
CREATE POLICY "Permitir upload publico de curriculos" 
ON storage.objects FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'resumes');

-- 2. Permitir leitura pública de arquivos no bucket resumes
DROP POLICY IF EXISTS "Permitir leitura publica de curriculos" ON storage.objects;
CREATE POLICY "Permitir leitura publica de curriculos" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'resumes');
-- =====================================================================
