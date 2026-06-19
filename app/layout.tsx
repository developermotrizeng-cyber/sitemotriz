import type {Metadata} from 'next';
import { Montserrat, Work_Sans } from 'next/font/google';
import './globals.css'; // Global styles

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Motriz Engenharia | Soluções em Engenharia e Construção',
  description: 'Referência em qualidade técnica, prazos e gestão de projetos complexos em Porto Velho e Rondônia. Conheça nosso portfólio de obras de infraestrutura, comerciais e residenciais.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${workSans.variable}`}>
      <body className="font-body bg-[#fcf9f8] text-[#1b1c1c] antialiased min-h-screen selection:bg-[#45567e] selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
