import { Metadata } from 'next';
import PublicLayoutClient from './layout-client';

// 🚀 Metadados padronizados com o 'www' oficial do Search Console
export const metadata: Metadata = {
  metadataBase: new URL('https://www.arkeucalipto.com.br'),
  alternates: {
    canonical: '/',
  },
  title: 'Ark Eucalipto | Eucalipto In Natura, Mourões e Lenha Premium',
  description: 'Especialistas em eucalipto in natura de alta durabilidade para cercas, mourões rurais e fornecimento de lenha selecionada em Vitória da Conquista - BA.',
  keywords: [
    'Ark',
    'Eucalipto',
    'Lenha',
    'Ark Eucalipto',
    'Eucalipto tratado',
    'Mourões de eucalipto',
    'Lenha para pizzaria',
    'Lenha para lareira',
    'Madeira tratada',
    'Madeireira Vitória da Conquista',
  ],
};

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function RootPublicLayout({ children }: PublicLayoutProps) {
  return <PublicLayoutClient>{children}</PublicLayoutClient>;
}