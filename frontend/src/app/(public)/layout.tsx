import { Metadata } from 'next';
import PublicLayoutClient from './layout-client';

// 🚀 Metadados idênticos para o Google indexar
export const metadata: Metadata = {
  title: 'Ark Eucalipto | Madeira Tratada, Mourões e Lenha Premium',
  description: 'Especialistas em eucalipto tratado de alta durabilidade para cercas, mourões rurais e fornecimento de lenha selecionada em Vitória da Conquista - BA.',
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
    'Madeireira Vitória da Conquista'
  ],
};

// 🟢 CORREÇÃO DOS TIPOS: Next.js exige a tipagem exata dos "children" no Layout do App Router
interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function RootPublicLayout({ children }: PublicLayoutProps) {
  return <PublicLayoutClient>{children}</PublicLayoutClient>;
}