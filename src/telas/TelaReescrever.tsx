import { useState, useEffect } from 'react';
import { useApp } from '../contextos/ContextoApp';
import { useEstadoTelas } from '../contextos/ContextoEstadoTelas';
import { TONS } from '../utils/constantes';

export function TelaReescrever() {
  const { adicionarExemplo, mostrarToast } = useApp();
  const { estadoReescrever, setEstadoReescrever } = useEstadoTelas();
  const [carregando, setCarregando] = useState(false);

  const { tom, instrucaoExtra, entrada, saida } = estadoReescrever;

  // atalho global manda texto pra cá
  useEffect(() => {
    const off1 = window.nyai.ouvir<string>('nyai:atalho-capturar-reescrever', (texto) => {
      setEstadoReescrever({ entrada: texto, saida: '' });
      mostrarToast('Texto capturado — pronto pra reescrever', 'ok');
    });
    const off2 = window.nyai.ouvir('nyai:atalho-salvar-resposta', () => {
      void salvarEstilo();
    });
    return () => { off1(); off2(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function executar() {
    if (!entrada.trim()) return mostrarToast('Digite ou cole um texto.', 'erro');
    setCarregando(true);
    setEstadoReescrever({ saida: '...' });
    try {
      const r = await window.nyai.requisicaoIA({
        modo: 'reescrever',
        texto: entrada,
        tom,
        instrucaoExtra: instrucaoExtra.trim(),
      });
      if (r.erro) {
        mostrarToast(r.erro, 'erro');
        setEstadoReescrever({ saida: '' });
      } else {
        setEstadoReescrever({ saida: r.texto });
      }
    } finally {
      setCarregando(false);
    }
  }

  async function colar() {
    try {
      const texto = await navigator.clipboard.readText();
      setEstadoReescrever({ entrada: texto });
    } catch {
      mostrarToast('Não consegui ler o clipboard. Cole com Ctrl+V.', 'erro');
    }
  }

  async function copiar() {
    if (!saida) return;
    await window.nyai.copiarTexto(saida);
    mostrarToast('Copiado', 'ok');
  }

  async function salvarEstilo() {
    if (!entrada.trim() || !saida.trim()) return mostrarToast('Faça uma reescrita primeiro.', 'erro');
    await adicionarExemplo({ original: entrada, preferido: saida, tom });
  }

  return (
    <section className="tela">
      <h1 className="titulo-tela">✍️ Reescrever mensagem com tom</h1>

      <div className="rotulo-secao">Tom</div>
      <div className="linha-pills">
        {TONS.map((t) => (
          <button
            key={t.valor}
            className={`pill verde ${tom === t.valor ? 'ativa' : ''}`}
            onClick={() => setEstadoReescrever({ tom: t.valor })}
          >
            {t.emoji} {t.rotulo}
          </button>
        ))}
      </div>

      <div className="linha-pills">
        <input
          type="text"
          className="input-config"
          style={{ flex: 1, minWidth: 220 }}
          placeholder="Instrução adicional (opcional). Ex: 'manter o nome do cliente', 'sem emojis'…"
          value={instrucaoExtra}
          onChange={(e) => setEstadoReescrever({ instrucaoExtra: e.target.value })}
        />
      </div>

      <div className="colunas duas">
        <div className="coluna">
          <div className="coluna-cabecalho">
            <span className="coluna-rotulo">ORIGINAL</span>
            <button className="btn-pequeno" onClick={colar}>Colar</button>
          </div>
          <textarea
            className="coluna-textarea"
            placeholder="Cole a mensagem que você quer reescrever…"
            value={entrada}
            onChange={(e) => setEstadoReescrever({ entrada: e.target.value })}
          />
        </div>
        <div className="coluna">
          <div className="coluna-cabecalho">
            <span className="coluna-rotulo">REESCRITA</span>
            <button className="btn-pequeno" onClick={copiar}>Copiar</button>
          </div>
          <textarea
            className="coluna-textarea"
            placeholder="A versão reescrita aparece aqui…"
            value={saida}
            onChange={(e) => setEstadoReescrever({ saida: e.target.value })}
          />
        </div>
      </div>

      <div className="barra-acoes">
        <button className="btn-primario" onClick={executar} disabled={carregando}>
          ⚡ {carregando ? 'Reescrevendo…' : 'Reescrever'}
        </button>
        <button className="btn-secundario" onClick={salvarEstilo}>💾 Salvar como meu estilo</button>
        <button className="btn-secundario" onClick={() => setEstadoReescrever({ entrada: '', saida: '' })}>
          Limpar
        </button>
      </div>
    </section>
  );
}
