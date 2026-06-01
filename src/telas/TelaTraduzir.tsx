import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../contextos/ContextoApp';
import { useEstadoTelas } from '../contextos/ContextoEstadoTelas';
import { IDIOMAS, idiomaCurto, TONS_TRADUCAO } from '../utils/constantes';
import type { Frase, TomTraducao } from '../tipos';

export function TelaTraduzir() {
  const { configuracao, salvarConfiguracao, mostrarToast, adicionarFrase, buscarFrase } = useApp();
  const { estadoTraduzir, setEstadoTraduzir } = useEstadoTelas();
  const [carregando, setCarregando] = useState(false);
  const [fraseSugerida, setFraseSugerida] = useState<Frase | null>(null);

  const { modo, origem, destino, entrada, corrigido, traducao, tom } = estadoTraduzir;

  // pega idiomas salvos só na primeira vez
  useEffect(() => {
    if (configuracao && estadoTraduzir.origem === 'pt-BR' && estadoTraduzir.destino === 'es-LATAM') {
      setEstadoTraduzir({
        origem: configuracao.idiomaOrigem || 'pt-BR',
        destino: configuracao.idiomaDestino || 'es-LATAM',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuracao]);

  // ouve os atalhos globais que chegam aqui
  useEffect(() => {
    const off1 = window.nyai.ouvir<string>('nyai:atalho-capturar-traduzir', (texto) => {
      setEstadoTraduzir({ entrada: texto });
      mostrarToast('Texto capturado — pronto pra traduzir', 'ok');
    });
    const off2 = window.nyai.ouvir<{ original: string; traduzido: string }>(
      'nyai:traducao-rapida-pronta',
      ({ original, traduzido }) => {
        setEstadoTraduzir({ entrada: original, traducao: traduzido, corrigido: '' });
        mostrarToast('Traduzido — já está no clipboard', 'ok');
      }
    );
    const off3 = window.nyai.ouvir('nyai:atalho-salvar-resposta', () => {
      void salvarFrase();
    });
    return () => { off1(); off2(); off3(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // procura match de frase salva (debounced)
  useEffect(() => {
    if (!entrada.trim() || entrada.length < 3) { setFraseSugerida(null); return; }
    const timer = setTimeout(async () => {
      const f = await buscarFrase(entrada, destino);
      setFraseSugerida(f);
    }, 350);
    return () => clearTimeout(timer);
  }, [entrada, destino, buscarFrase]);

  const persistirIdiomas = useCallback(async (novoOrigem: string, novoDestino: string) => {
    await salvarConfiguracao({ idiomaOrigem: novoOrigem, idiomaDestino: novoDestino });
  }, [salvarConfiguracao]);

  function inverter() {
    if (origem === 'auto') return mostrarToast('Origem em "Detectar" — escolha um idioma.', 'erro');
    const novoOrigem = destino;
    const novoDestino = origem;
    setEstadoTraduzir({
      origem: novoOrigem,
      destino: novoDestino,
      entrada: traducao || entrada,
      traducao: '',
    });
    void persistirIdiomas(novoOrigem, novoDestino);
  }

  function usarFraseSalva() {
    if (!fraseSugerida) return;
    setEstadoTraduzir({
      corrigido: fraseSugerida.corrigido || '',
      traducao: fraseSugerida.traduzido || '',
    });
    mostrarToast('Tradução reutilizada (0 tokens)', 'ok');
    setFraseSugerida(null);
  }

  async function executar() {
    if (!entrada.trim()) return mostrarToast('Digite ou cole um texto.', 'erro');
    if (origem !== 'auto' && origem === destino) return mostrarToast('Origem e destino são iguais.', 'erro');

    setCarregando(true);
    setEstadoTraduzir({
      corrigido: modo !== 'traduzir' ? '...' : '',
      traducao: modo !== 'corrigir' ? '...' : '',
    });

    try {
      if (modo === 'traduzir') {
        const r = await window.nyai.requisicaoIA({ modo: 'traduzir', texto: entrada, origem, destino, tom });
        if (r.erro) { mostrarToast(r.erro, 'erro'); setEstadoTraduzir({ traducao: '' }); }
        else setEstadoTraduzir({ traducao: r.texto });
      } else if (modo === 'corrigir') {
        const r = await window.nyai.requisicaoIA({ modo: 'corrigir', texto: entrada, origem, tom });
        if (r.erro) { mostrarToast(r.erro, 'erro'); setEstadoTraduzir({ corrigido: '' }); }
        else setEstadoTraduzir({ corrigido: r.texto });
      } else {
        const r1 = await window.nyai.requisicaoIA({ modo: 'corrigir', texto: entrada, origem, tom });
        if (r1.erro) { mostrarToast(r1.erro, 'erro'); setEstadoTraduzir({ corrigido: '', traducao: '' }); return; }
        setEstadoTraduzir({ corrigido: r1.texto });
        const baseTraducao = r1.texto || entrada;
        const r2 = await window.nyai.requisicaoIA({ modo: 'traduzir', texto: baseTraducao, origem, destino, tom });
        if (r2.erro) { mostrarToast(r2.erro, 'erro'); setEstadoTraduzir({ traducao: '' }); }
        else setEstadoTraduzir({ traducao: r2.texto });
      }
    } finally {
      setCarregando(false);
    }
  }

  async function copiar() {
    const txt = modo === 'corrigir' ? corrigido : traducao;
    if (txt && txt !== '...') {
      await window.nyai.copiarTexto(txt);
      mostrarToast('Copiado', 'ok');
    }
  }

  function limpar() {
    setEstadoTraduzir({ entrada: '', corrigido: '', traducao: '' });
  }

  async function salvarFrase() {
    if (!entrada.trim() || (!traducao.trim() && !corrigido.trim())) {
      return mostrarToast('Faça uma tradução primeiro.', 'erro');
    }
    if (traducao === '...' || corrigido === '...') return mostrarToast('Aguarde terminar.', 'erro');
    await adicionarFrase({
      original: entrada,
      traduzido: traducao,
      corrigido,
      origem,
      destino,
      tom,
    });
  }

  const classeColunas = modo === 'ambos' ? 'colunas tres' : 'colunas duas';
  const mostraCorrigido = modo !== 'traduzir';
  const mostraTraducao = modo !== 'corrigir';
  const rotuloBotao = modo === 'traduzir' ? 'Traduzir' : modo === 'corrigir' ? 'Corrigir' : 'Corrigir e Traduzir';

  return (
    <section className="tela">
      <h1 className="titulo-tela">🌐 Traduzir com NYAI</h1>

      <div className="rotulo-secao">Operação</div>
      <div className="cards-modo">
        <button className={`card-modo ${modo === 'traduzir' ? 'ativa' : ''}`} onClick={() => setEstadoTraduzir({ modo: 'traduzir' })}>
          <span className="icone">🌐</span><span className="nome">Traduzir</span><span className="sub">Só traduz</span>
        </button>
        <button className={`card-modo ${modo === 'corrigir' ? 'ativa' : ''}`} onClick={() => setEstadoTraduzir({ modo: 'corrigir' })}>
          <span className="icone">✏️</span><span className="nome">Corrigir</span><span className="sub">Só corrige</span>
        </button>
        <button className={`card-modo ${modo === 'ambos' ? 'ativa' : ''}`} onClick={() => setEstadoTraduzir({ modo: 'ambos' })}>
          <span className="icone">✨</span><span className="nome">Corrigir + Traduzir</span><span className="sub">Ambos</span>
        </button>
      </div>

      <div className="rotulo-secao">Idiomas</div>
      <div className="barra-idiomas">
        <select
          className="seletor-idioma"
          value={origem}
          onChange={(e) => { setEstadoTraduzir({ origem: e.target.value }); void persistirIdiomas(e.target.value, destino); }}
        >
          {IDIOMAS.map((i) => <option key={i.codigo} value={i.codigo}>{i.nome}</option>)}
        </select>
        <button className="btn-inverter" onClick={inverter} title="Inverter origem/destino">⇄</button>
        <select
          className="seletor-idioma"
          value={destino}
          onChange={(e) => { setEstadoTraduzir({ destino: e.target.value }); void persistirIdiomas(origem, e.target.value); }}
        >
          {IDIOMAS.filter((i) => i.codigo !== 'auto').map((i) => (
            <option key={i.codigo} value={i.codigo}>{i.nome}</option>
          ))}
        </select>
      </div>

      <div className="rotulo-secao">Tom</div>
      <div className="linha-pills">
        {TONS_TRADUCAO.map((t) => (
          <button
            key={t.valor}
            className={`pill verde ${tom === t.valor ? 'ativa' : ''}`}
            onClick={() => setEstadoTraduzir({ tom: t.valor as TomTraducao })}
          >
            {t.emoji} {t.rotulo}
          </button>
        ))}
      </div>

      {fraseSugerida && (
        <div style={{
          padding: '8px 12px', marginBottom: 10,
          background: 'var(--verde-suave)', border: '1px solid var(--verde-medio)',
          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: 12, color: 'var(--verde)',
        }}>
          <span>📌 Você já traduziu isso antes. Reusar para economizar tokens?</span>
          <button className="btn-pequeno" onClick={usarFraseSalva} style={{ color: 'var(--verde)' }}>
            Usar tradução salva
          </button>
        </div>
      )}

      <div className={classeColunas}>
        <div className="coluna">
          <div className="coluna-cabecalho">
            <span className="coluna-rotulo">ORIGINAL</span>
            <span className="badge-idioma">{idiomaCurto(origem)}</span>
          </div>
          <textarea
            className="coluna-textarea"
            placeholder="Digite ou cole o texto…"
            value={entrada}
            onChange={(e) => setEstadoTraduzir({ entrada: e.target.value })}
          />
        </div>

        {mostraCorrigido && (
          <div className="coluna">
            <div className="coluna-cabecalho">
              <span className="coluna-rotulo">CORRIGIDO</span>
            </div>
            <div className={`coluna-saida ${corrigido ? '' : 'vazia'}`}>
              {corrigido || 'Texto corrigido aparece aqui…'}
            </div>
          </div>
        )}

        {mostraTraducao && (
          <div className="coluna">
            <div className="coluna-cabecalho">
              <span className="coluna-rotulo">TRADUÇÃO</span>
              <span className="badge-idioma verde">{idiomaCurto(destino)}</span>
            </div>
            <div className={`coluna-saida ${traducao ? '' : 'vazia'}`}>
              {traducao || 'A tradução aparece aqui…'}
            </div>
          </div>
        )}
      </div>

      <div className="barra-acoes">
        <button className="btn-primario" onClick={executar} disabled={carregando}>
          ⚡ {carregando ? 'Processando…' : rotuloBotao}
        </button>
        <button className="btn-secundario" onClick={salvarFrase}>💾 Salvar esta tradução</button>
        <button className="btn-secundario" onClick={copiar}>Copiar resultado</button>
        <button className="btn-secundario" onClick={limpar}>Limpar</button>
      </div>
    </section>
  );
}
