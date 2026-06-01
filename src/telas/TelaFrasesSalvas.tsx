/* TelaFrasesSalvas — lista de traduções salvas + busca rápida */
import { useState, useEffect, useRef } from 'react';
import { useApp } from '../contextos/ContextoApp';
import { idiomaCurto } from '../utils/constantes';

export function TelaFrasesSalvas() {
  const { frases, removerFrase, limparFrases } = useApp();
  const [busca, setBusca] = useState('');
  const refBusca = useRef<HTMLInputElement>(null);
  const lista = frases?.frases || [];

  // Foca o input de busca quando o atalho Ctrl+Alt+T é acionado
  useEffect(() => {
    const off = window.nyai.ouvir('nyai:abrir-busca-rapida', () => {
      refBusca.current?.focus();
      refBusca.current?.select();
    });
    return off;
  }, []);

  const filtradas = busca.trim()
    ? lista.filter((f) =>
        f.original.toLowerCase().includes(busca.toLowerCase()) ||
        f.traduzido.toLowerCase().includes(busca.toLowerCase())
      )
    : lista;

  async function limparTudo() {
    if (!confirm('Limpar todas as frases salvas? Não pode ser desfeito.')) return;
    await limparFrases();
  }

  function copiarTraducao(texto: string) {
    navigator.clipboard.writeText(texto);
  }

  return (
    <section className="tela">
      <h1 className="titulo-tela">📌 Frases salvas</h1>
      <p style={{ fontSize: 12.5, color: 'var(--texto-2)', margin: '-10px 0 14px', lineHeight: 1.5 }}>
        Traduções que você marcou pra reusar. Quando você digitar um texto idêntico
        a um salvo, a NYAI sugere a tradução automaticamente — economizando tokens.
        Atalho <strong>Ctrl+Alt+T</strong> abre a busca aqui.
      </p>

      <div className="linha-pills" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="rotulo-secao" style={{ margin: 0 }}>
          {lista.length} {lista.length === 1 ? 'frase salva' : 'frases salvas'}
        </span>
        <button className="btn-secundario perigo" onClick={limparTudo} disabled={lista.length === 0}>
          Limpar tudo
        </button>
      </div>

      <input
        ref={refBusca}
        type="text"
        className="input-config"
        placeholder="Buscar nas frases salvas..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        style={{ marginBottom: 12 }}
      />

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
        {filtradas.length === 0 ? (
          <div className="estado-vazio">
            <h3>{lista.length === 0 ? 'Nenhuma frase salva ainda' : 'Nada encontrado'}</h3>
            <p>
              {lista.length === 0
                ? 'Use a tela Traduzir, faça uma tradução e clique em "💾 Salvar esta tradução".'
                : 'Tente outras palavras na busca.'}
            </p>
          </div>
        ) : (
          filtradas.map((f) => {
            const indiceReal = lista.indexOf(f);
            return (
              <div key={indiceReal} className="item-estilo">
                <div className="item-estilo-grade">
                  <div className="item-estilo-coluna">
                    <h4>Original ({idiomaCurto(f.origem)})</h4>
                    <p>{f.original}</p>
                  </div>
                  <div className="item-estilo-coluna">
                    <h4>Tradução ({idiomaCurto(f.destino)})</h4>
                    <p>{f.traduzido}</p>
                  </div>
                </div>
                {f.corrigido && (
                  <div style={{ marginTop: 4, fontSize: 11.5, color: 'var(--texto-mudo)' }}>
                    <strong>Corrigido:</strong> {f.corrigido}
                  </div>
                )}
                <div className="item-estilo-meta">
                  <span>
                    {f.tom && <span className="tag-tom">{f.tom}</span>}
                    {new Date(f.data).toLocaleString('pt-BR')}
                  </span>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => copiarTraducao(f.traduzido)} style={{ color: 'var(--verde)' }}>
                      Copiar tradução
                    </button>
                    <button onClick={() => void removerFrase(indiceReal)}>Remover</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
