import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    
    const adminPasswordsEnv = process.env.ADMIN_PASSWORDS || '#Motriz2026';
    const allowedPasswords = adminPasswordsEnv.split(',').map(p => p.trim());
    
    if (allowedPasswords.includes(password)) {
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false, error: 'Senha de segurança incorreta.' }, { status: 401 });
  } catch (error: any) {
    console.error('Password verification error:', error);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
