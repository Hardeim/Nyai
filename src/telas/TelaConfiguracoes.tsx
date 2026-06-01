import { useState, useEffect } from 'react';
import { useApp } from '../contextos/ContextoApp';
import { PROVEDORES, URLS_CHAVES, TONS, TONS_TRADUCAO, MODELOS_POR_PROVEDOR } from '../utils/constantes';
import type { Provedor, Tom, TomTraducao, Configuracao } from '../tipos';

export function TelaConfiguracoes() {
  const { configuracao, salvarConfiguracao, mostrarToast } = useApp();
  const [local, setLocal] = useState<Configuracao | null>(null);
  const [modelosOllamaReais, setModelosOllamaReais] = useState<string[]>([]);

  useEffect(() => {
    if (configuracao) setLocal(JSON.parse(JSON.stringify(configuracao)));
  }, [configuracao]);

  useEffect(() => {
    window.nyai.listarModelosOllama().then((r) => {
      if (r.online && r.modelos.length) setModelosOllamaReais(r.modelos);
    });
  }, []);

  if (!local) {
    return <section className="tela"><h1 className="titulo-tela">⚙️ Configurações</h1><p>Carregando…</p></section>;
  }

  function atualizar<K extends keyof Configuracao>(chave: K, valor: Configuracao[K]) {
    setLocal((atual) => atual ? { ...atual, [chave]: valor } : atual);
  }

  function atualizarChave(provedor: Exclude<Provedor, 'ollama'>, valor: string) {
    setLocal((a) => a ? { ...a, chaves: { ...a.chaves, [provedor]: valor } } : a);
  }
  function atualizarModelo(provedor: Provedor, valor: string) {
    setLocal((a) => a ? { ...a, modelos: { ...a.modelos, [provedor]: valor } } : a);
  }
  function atualizarPromptTom(tom: Tom, valor: string) {
    setLocal((a) => a ? { ...a, promptsTons: { ...a.promptsTons, [tom]: valor } } : a);
  }
  function atualizarPromptTomTraducao(tom: TomTraducao, valor: string) {
    setLocal((a) => a ? { ...a, promptsTonsTraducao: { ...a.promptsTonsTraducao, [tom]: valor } } : a);
  }
  function atualizarAtalho(chave: keyof Configuracao['atalhos'], valor: string) {
    setLocal((a) => a ? { ...a, atalhos: { ...a.atalhos, [chave]: valor } } : a);
  }

  async function salvar() {
    if (!local) return;
    const paraSalvar: Partial<Configuracao> = { ...local };
    if (paraSalvar.chaves) {
      const chavesLimpas: Record<string, string> = {};
      for (const [k, v] of Object.entries(paraSalvar.chaves)) {
        if (typeof v === 'string' && !v.includes('•')) chavesLimpas[k] = v;
      }
      paraSalvar.chaves = chavesLimpas as Configuracao['chaves'];
    }
    await salvarConfiguracao(paraSalvar);
  }

  async function trocarProvedor(p: Provedor) {
    atualizar('provedor', p);
    await salvarConfiguracao({ provedor: p });
  }

  async function alternarTema() {
    if (!local) return;
    const novo = local.tema === 'claro' ? 'escuro' : 'claro';
    atualizar('tema', novo);
    await salvarConfiguracao({ tema: novo });
  }

  function restaurarTons() {
    if (!confirm('Restaurar os tons aos padrões? Apaga suas edições.')) return;
    setLocal((a) => a ? { ...a, promptsTons: {
      formal:'', casual:'', empatico:'', assertivo:'', breve:'', detalhado:'', corrigir:''
    } } : a);
    mostrarToast('Padrões prontos. Clique em Salvar.', 'ok');
  }

  function restaurarTonsTraducao() {
    if (!confirm('Restaurar os tons da Tradução aos padrões? Apaga suas edições.')) return;
    setLocal((a) => a ? { ...a, promptsTonsTraducao: {
      profissional:'', formal:'', educado:'', informal:'', casual:'', amigavel:''
    } } : a);
    mostrarToast('Padrões prontos. Clique em Salvar.', 'ok');
  }

  // lista de modelos pro dropdown do provedor atual
  const listaModelos = local.provedor === 'ollama' && modelosOllamaReais.length
    ? modelosOllamaReais
    : MODELOS_POR_PROVEDOR[local.provedor];

  // se o modelo atual não está na lista, adiciona ele pra não sumir
  const modeloAtual = local.modelos[local.provedor] || '';
  const listaFinal = listaModelos.includes(modeloAtual) || !modeloAtual
    ? listaModelos
    : [modeloAtual, ...listaModelos];

  return (
    <section className="tela" style={{ padding: '20px 22px 0' }}>
      <h1 className="titulo-tela">⚙️ Configurações</h1>

      <div className="shell-config">

        <div className="card-config">
          <div className="card-config-titulo">🎨 Aparência</div>
          <div className="linha-config">
            <span className="rotulo-config">Tema</span>
            <button className="btn-secundario" onClick={alternarTema}>
              {local.tema === 'claro' ? '☀️ Tema claro' : '🌙 Tema escuro'} (clique pra alternar)
            </button>
          </div>
        </div>

        <div className="card-config">
          <div className="card-config-titulo">🤖 Provedor de IA</div>
          <div className="card-config-desc">
            Escolha o serviço. A chave fica salva localmente no seu PC.
          </div>
          <div className="grade-provedores">
            {PROVEDORES.map((p) => (
              <button
                key={p.valor}
                className={`card-provedor ${local.provedor === p.valor ? 'ativo' : ''}`}
                onClick={() => void trocarProvedor(p.valor)}
              >
                <span className="logo">{p.logo}</span>
                <span className="nome">{p.nome}</span>
                <span className={`tag ${p.pago ? 'paid' : 'free'}`}>{p.pago ? '$' : 'grátis'}</span>
                <span className="sub">{p.descricao}</span>
              </button>
            ))}
          </div>

          {local.provedor !== 'ollama' && (
            <div className="config-provedor visivel">
              <div className="linha-config">
                <span className="rotulo-config">API Key</span>
                <input
                  type="password"
                  className="input-config"
                  placeholder="sk-…"
                  value={local.chaves[local.provedor as Exclude<Provedor, 'ollama'>]}
                  onChange={(e) => atualizarChave(local.provedor as Exclude<Provedor, 'ollama'>, e.target.value)}
                />
              </div>
              <div className="linha-config">
                <span className="rotulo-config">Modelo</span>
                <select
                  className="select-config"
                  value={modeloAtual}
                  onChange={(e) => atualizarModelo(local.provedor, e.target.value)}
                >
                  {listaFinal.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="linha-config">
                <span className="rotulo-config"></span>
                <a
                  style={{ fontSize: 11, color: 'var(--verde)', cursor: 'pointer' }}
                  onClick={() => window.nyai.abrirExterno(URLS_CHAVES[local.provedor as Exclude<Provedor, 'ollama'>])}
                >
                  Obter chave →
                </a>
              </div>
            </div>
          )}
          {local.provedor === 'ollama' && (
            <div className="config-provedor visivel">
              <div className="linha-config">
                <span className="rotulo-config">Modelo Ollama</span>
                <select
                  className="select-config"
                  value={modeloAtual}
                  onChange={(e) => atualizarModelo('ollama', e.target.value)}
                >
                  {listaFinal.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              {modelosOllamaReais.length > 0 && (
                <div className="linha-config">
                  <span className="rotulo-config"></span>
                  <span style={{ fontSize: 11, color: 'var(--texto-mudo)' }}>
                    ✓ {modelosOllamaReais.length} modelo(s) detectados no Ollama
                  </span>
                </div>
              )}
              <div className="linha-config">
                <span className="rotulo-config"></span>
                <a
                  style={{ fontSize: 11, color: 'var(--verde)', cursor: 'pointer' }}
                  onClick={() => window.nyai.abrirExterno('https://ollama.com/download')}
                >
                  Instalar Ollama →
                </a>
              </div>
            </div>
          )}

          <div className="aviso">
            <strong>⚠️ Segurança:</strong> a chave fica em <code>%APPDATA%\nyai\nyai-config.json</code>{' '}
            (só no seu PC). Em PCs compartilhados, prefira Ollama.
          </div>
        </div>

        <div className="card-config">
          <div className="card-config-titulo">💬 Instruções personalizadas da IA</div>
          <div className="card-config-desc">
            A instrução GERAL vai pra toda requisição. As específicas se somam só na tela correspondente.
            Em branco = sem instrução.
          </div>
          <div className="linha-config">
            <span className="rotulo-config">Geral (todas as telas)</span>
            <textarea
              className="textarea-config"
              placeholder="Contexto sobre você, regras que valem pra tudo..."
              value={local.instrucaoPersonalizada}
              onChange={(e) => atualizar('instrucaoPersonalizada', e.target.value)}
            />
          </div>
          <div className="linha-config">
            <span className="rotulo-config">🌐 Só Traduzir</span>
            <textarea
              className="textarea-config"
              placeholder="Regras que só valem ao traduzir..."
              value={local.instrucaoTraduzir || ''}
              onChange={(e) => atualizar('instrucaoTraduzir', e.target.value)}
            />
          </div>
          <div className="linha-config">
            <span className="rotulo-config">✏️ Só Corrigir</span>
            <textarea
              className="textarea-config"
              placeholder="Regras que só valem ao corrigir..."
              value={local.instrucaoCorrigir || ''}
              onChange={(e) => atualizar('instrucaoCorrigir', e.target.value)}
            />
          </div>
          <div className="linha-config">
            <span className="rotulo-config">✍️ Só Reescrever</span>
            <textarea
              className="textarea-config"
              placeholder="Regras que só valem ao reescrever..."
              value={local.instrucaoReescrever || ''}
              onChange={(e) => atualizar('instrucaoReescrever', e.target.value)}
            />
          </div>
        </div>

        <div className="card-config">
          <div className="card-config-titulo">🌐 Personalidades dos tons (Traduzir)</div>
          <div className="card-config-desc">
            Cada tom aplicado no modo Traduzir. Em branco = volta ao padrão.
          </div>
          {TONS_TRADUCAO.map((t) => (
            <div className="linha-config" key={t.valor}>
              <span className="rotulo-config">{t.emoji} {t.rotulo}</span>
              <textarea
                className="textarea-config"
                placeholder="(padrão)"
                value={local.promptsTonsTraducao?.[t.valor] || ''}
                onChange={(e) => atualizarPromptTomTraducao(t.valor, e.target.value)}
              />
            </div>
          ))}
          <div className="linha-config" style={{ justifyContent: 'flex-end' }}>
            <button className="btn-secundario" onClick={restaurarTonsTraducao}>Restaurar padrões</button>
          </div>
        </div>

        <div className="card-config">
          <div className="card-config-titulo">✍️ Personalidades dos tons (Reescrever)</div>
          <div className="card-config-desc">
            Cada tom aplicado no modo Reescrever. Em branco = volta ao padrão.
          </div>
          {TONS.map((t) => (
            <div className="linha-config" key={t.valor}>
              <span className="rotulo-config">{t.emoji} {t.rotulo}</span>
              <textarea
                className="textarea-config"
                placeholder="(padrão)"
                value={local.promptsTons[t.valor] || ''}
                onChange={(e) => atualizarPromptTom(t.valor, e.target.value)}
              />
            </div>
          ))}
          <div className="linha-config" style={{ justifyContent: 'flex-end' }}>
            <button className="btn-secundario" onClick={restaurarTons}>Restaurar padrões</button>
          </div>
        </div>

        <div className="card-config">
          <div className="card-config-titulo">⌨️ Atalhos globais</div>
          <div className="card-config-desc">
            Funcionam mesmo com a NYAI minimizada. Sempre use <code>Ctrl</code> ou <code>Ctrl+Shift</code> na frente,
            senão dispara enquanto você digita.
          </div>
          <div className="linha-config">
            <span className="rotulo-config">Mostrar/Ocultar janela</span>
            <input className="input-config" value={local.atalhos.mostrarOcultar} onChange={(e) => atualizarAtalho('mostrarOcultar', e.target.value)} />
          </div>
          <div className="linha-config">
            <span className="rotulo-config">Capturar e traduzir</span>
            <input className="input-config" value={local.atalhos.capturarTraduzir} onChange={(e) => atualizarAtalho('capturarTraduzir', e.target.value)} />
          </div>
          <div className="linha-config">
            <span className="rotulo-config">Capturar (sem traduzir)</span>
            <input className="input-config" value={local.atalhos.capturarSemTraduzir} onChange={(e) => atualizarAtalho('capturarSemTraduzir', e.target.value)} />
          </div>
          <div className="linha-config">
            <span className="rotulo-config">Colar última tradução</span>
            <input className="input-config" value={local.atalhos.colarUltimaTraducao} onChange={(e) => atualizarAtalho('colarUltimaTraducao', e.target.value)} />
          </div>
          <div className="linha-config">
            <span className="rotulo-config">Salvar resposta</span>
            <input className="input-config" value={local.atalhos.salvarResposta} onChange={(e) => atualizarAtalho('salvarResposta', e.target.value)} />
          </div>
          <div className="linha-config">
            <span className="rotulo-config">Busca rápida (Frases)</span>
            <input className="input-config" value={local.atalhos.buscaRapidaFrases || ''} onChange={(e) => atualizarAtalho('buscaRapidaFrases', e.target.value)} />
          </div>
        </div>

        <div className="barra-salvar">
          <button className="btn-primario verde" onClick={salvar}>Salvar configurações</button>
        </div>
      </div>
    </section>
  );
}
