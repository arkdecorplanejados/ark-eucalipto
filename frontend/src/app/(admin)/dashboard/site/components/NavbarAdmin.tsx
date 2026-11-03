'use client';

import { useState } from 'react';

export default function NavbarAdmin({ dados, setDados }: { dados: any; setDados: (d: any) => void }) {
  // Garante que existe um array de menu
  const menuAtual = dados?.menu || [
    { titulo: 'Início', url: '/' },
    { titulo: 'Diferenciais', url: '/diferenciais' },
    { titulo: 'Rodovias', url: '/rodovias' },
    { titulo: 'Sobre', url: '/sobre' },
    { titulo: 'Contato', url: '/contato' }
  ];

  const [menu, setMenu] = useState<Array<{ titulo: string; url: string }>>(menuAtual);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaUrl, setNovaUrl] = useState('');

  const adicionarItem = () => {
    if (!novoTitulo || !novaUrl) return;
    const atualizado = [...menu, { titulo: novoTitulo, url: novaUrl }];
    setMenu(atualizado);
    setDados({ ...dados, menu: atualizado });
    setNovoTitulo('');
    setNovaUrl('');
  };

  const removerItem = (index: number) => {
    const atualizado = menu.filter((_, i) => i !== index);
    setMenu(atualizado);
    setDados({ ...dados, menu: atualizado });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-zinc-800">Gerenciador do Navbar (Menu Superior)</h2>
        <p className="text-sm text-zinc-500">Configure os links de navegação exibidos no cabeçalho do site.</p>
      </div>

      {/* Lista de itens atuais */}
      <div className="space-y-3">
        {menu.map((item, index) => (
          <div key={index} className="flex items-center justify-between bg-stone-50 p-3 rounded-lg border border-stone-200">
            <div>
              <span className="font-semibold text-zinc-800">{item.titulo}</span>
              <span className="text-xs text-zinc-500 ml-2">({item.url})</span>
            </div>
            <button
              type="button"
              onClick={() => removerItem(index)}
              className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1"
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      {/* Adicionar novo item */}
      <div className="border-t border-stone-100 pt-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1">Título do Link</label>
          <input
            type="text"
            placeholder="Ex: Produtos"
            value={novoTitulo}
            onChange={(e) => setNovoTitulo(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1">URL / Rota</label>
          <input
            type="text"
            placeholder="Ex: /produtos"
            value={novaUrl}
            onChange={(e) => setNovaUrl(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
        <div>
          <button
            type="button"
            onClick={adicionarItem}
            className="w-full bg-emerald-700 text-white font-medium py-2 rounded-lg text-sm hover:bg-emerald-800 transition-colors"
          >
            Adicionar Link
          </button>
        </div>
      </div>
    </div>
  );
}