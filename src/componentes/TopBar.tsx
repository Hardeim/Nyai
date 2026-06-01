/* TopBar — barra do topo com logo real */
import { useState, useEffect } from 'react';
import { useApp } from '../contextos/ContextoApp';

export function TopBar() {
  const { statusOllama, tokens, zerarTokens, configuracao } = useApp();
  const [maximizada, setMaximizada] = useState(false);
  const [logoSrc, setLogoSrc] = useState<string>('');

  // Carrega a base64 do logo (arquivo em /public/logo.png.b64)
  useEffect(() => {
    fetch('./logo.png.b64')
      .then((r) => r.text())
      .then((b64) => setLogoSrc('data:image/png;base64,' + b64.trim()))
      .catch(() => setLogoSrc('')); // se não achar, mostra fallback
  }, []);

  const totalTokens = tokens.entrada + tokens.saida;
  const tokensTexto = totalTokens >= 1000 ? `${(totalTokens / 1000).toFixed(1)}k` : String(totalTokens);
  const nomeProvedor = configuracao?.provedor
    ? configuracao.provedor.charAt(0).toUpperCase() + configuracao.provedor.slice(1)
    : '...';

  async function alternarMaximizar() {
    const novoEstado = await window.nyai.janelaMaximizarRestaurar();
    setMaximizada(novoEstado);
  }

  async function aoZerar() {
    if (!confirm('Zerar contador de tokens da sessão?')) return;
    await zerarTokens();
  }

  return (
    <header className="topbar">
      <div className="logo-mark">
        {logoSrc ? (
          <img src={logoSrc} alt="NYAI" style={{ width: 30, height: 30, objectFit: 'cover' }} />
        ) : (
          <span>N</span>
        )}
      </div>
      <span className="app-name">NYAI</span>

      <div className={`pill-status ${statusOllama.online ? 'on' : ''}`}>
        <span className="dot"></span>
        <span>Ollama</span>
      </div>

      <div className="badge">{nomeProvedor}</div>

      <div
        className="badge tokens"
        title={`Tokens: ${tokens.entrada} entrada + ${tokens.saida} saída = ${totalTokens} total. Clique para zerar.`}
        onClick={aoZerar}
      >
        🪙 {tokensTexto}
      </div>

      <div className="topbar-spacer"></div>

      <span className="kbd-hint">Ctrl+Shift+Espaço</span>

      <div className="botoes-janela">
        <button className="btn-janela" onClick={() => window.nyai.janelaMinimizar()} title="Minimizar">─</button>
        <button className="btn-janela" onClick={alternarMaximizar} title={maximizada ? 'Restaurar' : 'Maximizar'}>
          {maximizada ? '🗗' : '🗖'}
        </button>
        <button className="btn-janela fechar" onClick={() => window.nyai.janelaOcultar()} title="Ocultar">✕</button>
      </div>
    </header>
  );
}
