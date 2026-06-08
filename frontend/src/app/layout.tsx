// @ts-ignore
import './globals.css'; // Carrega os estilos globais do Tailwind

export const metadata = {
  title: 'Ark Eucalipto | Madeiras In Natura e Eucalipto Tratado em Vitória da Conquista',
  description: 'Soluções sustentáveis em madeira bruta, mourões para cerca, escoramentos para construção civil e biomassa. Atendimento direto do pátio em Vitória da Conquista e toda a Bahia.',
  keywords: [
    'eucalipto tratado', 
    'eucalipto in natura', 
    'mourões de madeira', 
    'madeira para cerca', 
    'escoras para laje', 
    'marcenaria',
    'Vitória da Conquista', 
    'Bahia'
  ],
  authors: [{ name: 'Ark Decor & Eucalipto' }],
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Configuração para quando linkarem seu site no WhatsApp ou Instagram
  openGraph: {
    title: 'Ark Eucalipto | Madeiras Brutas e Estruturais',
    description: 'Faturamento direto e soluções sustentáveis em eucalipto in natura e mourões em Vitória da Conquista - BA.',
    url: 'https://www.arkeucalipto.com.br', // Substitua pelo seu domínio quando publicar
    siteName: 'Ark Eucalipto',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased selection:bg-emerald-800 selection:text-white">
        {/* O Next.js injetará os sub-layouts e páginas aqui dentro */}
        {children}
      </body>
    </html>
  );
}