/* SideBar — navegação lateral com ícones */
import type { Tela } from '../App';

interface Props {
  telaAtiva: Tela;
  onMudarTela: (tela: Tela) => void;
}

const ITENS: Array<{ tela: Tela; rotulo: string; icone: string }> = [
  { tela: 'traduzir',     rotulo: 'Traduzir',      icone: '🌐' },
  { tela: 'reescrever',   rotulo: 'Reescrever',    icone: '✍️' },
  { tela: 'estilo',       rotulo: 'Meu estilo',    icone: '🧠' },
  { tela: 'frases',       rotulo: 'Frases salvas', icone: '📌' },
];

export function SideBar({ telaAtiva, onMudarTela }: Props) {
  return (
    <nav className="sidebar">
      {ITENS.map((item) => (
        <button
          key={item.tela}
          className={`nav-btn ${telaAtiva === item.tela ? 'ativa' : ''}`}
          onClick={() => onMudarTela(item.tela)}
          title={item.rotulo}
        >
          <span style={{ fontSize: 18 }}>{item.icone}</span>
          <span className="tip">{item.rotulo}</span>
        </button>
      ))}
      <div className="nav-spacer"></div>
      <button
        className={`nav-btn ${telaAtiva === 'configuracoes' ? 'ativa' : ''}`}
        onClick={() => onMudarTela('configuracoes')}
        title="Configurações"
      >
        <span style={{ fontSize: 18 }}>⚙️</span>
        <span className="tip">Configurações</span>
      </button>
    </nav>
  );
}
