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
  
  // Estados para controle de edição
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editUrl, setEditUrl] = useState('');

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
    if (editandoIndex === index) cancelarEdicao();
  };

  const iniciarEdicao = (index: number) => {
    setEditandoIndex(index);
    setEditTitulo(menu[index].titulo);
    setEditUrl(menu[index].url);
  };

  const salvarEdicao = (index: number) => {
    const atualizado = [...menu];
    atualizado[index] = { titulo: editTitulo, url: editUrl };
    setMenu(atualizado);
    setDados({ ...dados, menu: atualizado });
    setEditandoIndex(null);
  };

  const cancelarEdicao = () => {
    setEditandoIndex(null);
    setEditTitulo('');
    setEditUrl('');
  };

  // Funções para mover as posições (subir e descer)
  const moverItem = (index: number, direcao: 'cima' | 'baixo') => {
    const novoIndex = direcao === 'cima' ? index - 1 : index + 1;
    if (novoIndex < 0 || novoIndex >= menu.length) return;

    const atualizado = [...menu];
    const [itemMovido] = atualizado.splice(index, 1);
    atualizado.splice(novoIndex, 0, itemMovido);

    setMenu(atualizado);
    setDados({ ...dados, menu: atualizado });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-zinc-800">Gerenciador do Navbar (Menu Superior)</h2>
        <p className="text-sm text-zinc-500">Configure, ordene e edite os links de navegação exibidos no cabeçalho do site.</p>
      </div>

      {/* Lista de itens atuais com opções de Mover, Editar e Remover */}
      <div className="space-y-3">
        {menu.map((item, index) => (
          <div key={index} className="bg-stone-50 p-4 rounded-lg border border-stone-200 space-y-3">
            {editandoIndex === index ? (
              // ✏️ Modo de Edição Ativo
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1">Editar Título</label>
                  <input
                    type="text"
                    value={editTitulo}
                    onChange={(e) => setEditTitulo(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1">Editar URL / Rota</label>
                  <input
                    type="text"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div className="sm:col-span-2 flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={cancelarEdicao}
                    className="px-4 py-2 border border-stone-300 text-zinc-700 text-xs font-bold rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => salvarEdicao(index)}
                    className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-lg hover:bg-emerald-800 transition-colors"
                  >
                    Salvar Alteração
                  </button>
                </div>
              </div>
            ) : (
              // 👁️ Visualização Normal do Item
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Botões de Mover (Subir e Descer) */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => moverItem(index, 'cima')}
                      disabled={index === 0}
                      title="Mover para cima"
                      className="p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-20 disabled:hover:text-zinc-400 transition-colors"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => moverItem(index, 'baixo')}
                      disabled={index === menu.length - 1}
                      title="Mover para baixo"
                      className="p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-20 disabled:hover:text-zinc-400 transition-colors"
                    >
                      ▼
                    </button>
                  </div>

                  <div>
                    <span className="font-semibold text-zinc-800 text-sm">{item.titulo}</span>
                    <span className="text-xs text-zinc-500 ml-2 font-mono">({item.url})</span>
                  </div>
                </div>

                {/* Ações (Editar e Remover) */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => iniciarEdicao(index)}
                    className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-3 py-1.5 bg-emerald-50 rounded-lg transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => removerItem(index)}
                    className="text-red-500 hover:text-red-700 text-xs font-bold px-3 py-1.5 bg-red-50 rounded-lg transition-colors"
                  >
                    Remover
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Adicionar novo item */}
      <div className="border-t border-stone-200 pt-6 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
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
            className="w-full bg-emerald-700 text-white font-bold py-2 rounded-lg text-sm hover:bg-emerald-800 transition-colors"
          >
            Adicionar Novo Link
          </button>
        </div>
      </div>
    </div>
  );
}