/* TelaEstilo — gerenciar exemplos da memória de estilo */
import { useState } from 'react';
import { useApp } from '../contextos/ContextoApp';
import { TONS } from '../utils/constantes';

export function TelaEstilo() {
  const { memoria, adicionarExemplo, removerExemplo, limparMemoria, mostrarToast } = useApp();
  const exemplos = memoria?.exemplosEstilo || [];

  // Modal de adicionar exemplo (substitui prompt() — bloqueado no Electron)
  const [modalAberto, setModalAberto] = useState(false);
  const [textoOriginal, setTextoOriginal] = useState('');
  const [textoPreferido, setTextoPreferido] = useState('');

  const rotuloTom = (t: string) => TONS.find((x) => x.valor === t)?.rotulo || t;

  function abrirModal() {
    setTextoOriginal('');
    setTextoPreferido('');
    setModalAberto(true);
  }

  async function confirmarAdicao() {
    if (!textoOriginal.trim() || !textoPreferido.trim()) {
      mostrarToast('Preencha os dois campos.', 'erro');
      return;
    }
    await adicionarExemplo({ original: textoOriginal, preferido: textoPreferido, tom: '' });
    setModalAberto(false);
  }

  async function limparTudo() {
    if (!confirm('Limpar todos os exemplos? Não pode ser desfeito.')) return;
    await limparMemoria();
  }

  return (
    <section className="tela">
      <h1 className="titulo-tela">🧠 Memória de estilo</h1>
      <p style={{ fontSize: 12.5, color: 'var(--texto-2)', margin: '-10px 0 14px', lineHeight: 1.5 }}>
        A NYAI usa estes exemplos como referência ao reescrever no seu jeito de falar.
        Quanto mais exemplos, mais "com sua cara".
      </p>

      <div className="linha-pills" style={{ justifyContent: 'space-between' }}>
        <span className="rotulo-secao" style={{ margin: 0 }}>
          {exemplos.length} {exemplos.length === 1 ? 'exemplo salvo' : 'exemplos salvos'}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-secundario" onClick={abrirModal}>+ Adicionar exemplo</button>
          <button className="btn-secundario perigo" onClick={limparTudo}>Limpar tudo</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
        {exemplos.length === 0 ? (
          <div className="estado-vazio">
            <h3>Nenhum exemplo salvo ainda</h3>
            <p>
              Use a tela <strong>Reescrever</strong> e clique em <em>"Salvar como meu estilo"</em>,
              ou adicione exemplos manualmente aqui.
            </p>
          </div>
        ) : (
          exemplos.map((ex, i) => (
            <div key={i} className="item-estilo">
              <div className="item-estilo-grade">
                <div className="item-estilo-coluna">
                  <h4>Original</h4>
                  <p>{ex.original}</p>
                </div>
                <div className="item-estilo-coluna">
                  <h4>Versão preferida</h4>
                  <p>{ex.preferido}</p>
                </div>
              </div>
              <div className="item-estilo-meta">
                <span>
                  {ex.tom && <span className="tag-tom">{rotuloTom(ex.tom)}</span>}
                  {new Date(ex.data).toLocaleString('pt-BR')}
                </span>
                <button onClick={() => void removerExemplo(i)}>Remover</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal — overlay escuro + caixa centralizada */}
      {modalAberto && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setModalAberto(false)}
        >
          <div
            style={{
              background: 'var(--fundo)',
              borderRadius: 12,
              padding: 24,
              width: '90%', maxWidth: 600,
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: 'var(--texto)' }}>
              Adicionar exemplo de estilo
            </h2>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--texto-2)', display: 'block', marginBottom: 4 }}>
                Texto original
              </label>
              <textarea
                className="textarea-config"
                placeholder="Como o texto chegou..."
                value={textoOriginal}
                onChange={(e) => setTextoOriginal(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--texto-2)', display: 'block', marginBottom: 4 }}>
                Versão preferida (como você gostaria que ficasse)
              </label>
              <textarea
                className="textarea-config"
                placeholder="Como você escreveria..."
                value={textoPreferido}
                onChange={(e) => setTextoPreferido(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn-secundario" onClick={() => setModalAberto(false)}>Cancelar</button>
              <button className="btn-primario verde" onClick={confirmarAdicao}>Salvar exemplo</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
