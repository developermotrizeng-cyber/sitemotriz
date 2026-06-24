import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    const adminPasswordsEnv = process.env.ADMIN_PASSWORDS;
    
    if (!adminPasswordsEnv) {
      return NextResponse.json(
        { success: false, error: 'Variável ADMIN_PASSWORDS não configurada no servidor. Contate o administrador.' },
        { status: 503 }
      );
    }
    
    const allowedPasswords = adminPasswordsEnv.split(',').map(p => p.trim());
    const masterPassword = allowedPasswords[0];
    
    // Se a senha informada for a senha master, ela só pode ser usada pelo usuário principal
    if (password === masterPassword) {
      const sanitizedEmail = (email || '').toLowerCase().trim();
      if (sanitizedEmail !== 'developermotrizeng@gmail.com') {
        return NextResponse.json(
          { success: false, error: 'A senha master só pode ser utilizada pelo usuário principal.' },
          { status: 403 }
        );
      }
    }
    
    if (allowedPasswords.includes(password)) {
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false, error: 'Senha de segurança incorreta.' }, { status: 401 });
  } catch (error: any) {
    console.error('Password verification error:', error);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

