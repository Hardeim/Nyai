import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useApp } from '../contextos/ContextoApp';
import { PROVEDORES, URLS_CHAVES, TONS, TONS_TRADUCAO, MODELOS_POR_PROVEDOR } from '../utils/constantes';
export function TelaConfiguracoes() {
    const { configuracao, salvarConfiguracao, mostrarToast } = useApp();
    const [local, setLocal] = useState(null);
    const [modelosOllamaReais, setModelosOllamaReais] = useState([]);
    useEffect(() => {
        if (configuracao)
            setLocal(JSON.parse(JSON.stringify(configuracao)));
    }, [configuracao]);
    useEffect(() => {
        window.nyai.listarModelosOllama().then((r) => {
            if (r.online && r.modelos.length)
                setModelosOllamaReais(r.modelos);
        });
    }, []);
    if (!local) {
        return _jsxs("section", { className: "tela", children: [_jsx("h1", { className: "titulo-tela", children: "\u2699\uFE0F Configura\u00E7\u00F5es" }), _jsx("p", { children: "Carregando\u2026" })] });
    }
    function atualizar(chave, valor) {
        setLocal((atual) => atual ? { ...atual, [chave]: valor } : atual);
    }
    function atualizarChave(provedor, valor) {
        setLocal((a) => a ? { ...a, chaves: { ...a.chaves, [provedor]: valor } } : a);
    }
    function atualizarModelo(provedor, valor) {
        setLocal((a) => a ? { ...a, modelos: { ...a.modelos, [provedor]: valor } } : a);
    }
    function atualizarPromptTom(tom, valor) {
        setLocal((a) => a ? { ...a, promptsTons: { ...a.promptsTons, [tom]: valor } } : a);
    }
    function atualizarPromptTomTraducao(tom, valor) {
        setLocal((a) => a ? { ...a, promptsTonsTraducao: { ...a.promptsTonsTraducao, [tom]: valor } } : a);
    }
    function atualizarAtalho(chave, valor) {
        setLocal((a) => a ? { ...a, atalhos: { ...a.atalhos, [chave]: valor } } : a);
    }
    async function salvar() {
        if (!local)
            return;
        const paraSalvar = { ...local };
        if (paraSalvar.chaves) {
            const chavesLimpas = {};
            for (const [k, v] of Object.entries(paraSalvar.chaves)) {
                if (typeof v === 'string' && !v.includes('•'))
                    chavesLimpas[k] = v;
            }
            paraSalvar.chaves = chavesLimpas;
        }
        await salvarConfiguracao(paraSalvar);
    }
    async function trocarProvedor(p) {
        atualizar('provedor', p);
        await salvarConfiguracao({ provedor: p });
    }
    async function alternarTema() {
        if (!local)
            return;
        const novo = local.tema === 'claro' ? 'escuro' : 'claro';
        atualizar('tema', novo);
        await salvarConfiguracao({ tema: novo });
    }
    function restaurarTons() {
        if (!confirm('Restaurar os tons aos padrões? Apaga suas edições.'))
            return;
        setLocal((a) => a ? { ...a, promptsTons: {
                formal: '', casual: '', empatico: '', assertivo: '', breve: '', detalhado: '', corrigir: ''
            } } : a);
        mostrarToast('Padrões prontos. Clique em Salvar.', 'ok');
    }
    function restaurarTonsTraducao() {
        if (!confirm('Restaurar os tons da Tradução aos padrões? Apaga suas edições.'))
            return;
        setLocal((a) => a ? { ...a, promptsTonsTraducao: {
                profissional: '', formal: '', educado: '', informal: '', casual: '', amigavel: ''
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
    return (_jsxs("section", { className: "tela", style: { padding: '20px 22px 0' }, children: [_jsx("h1", { className: "titulo-tela", children: "\u2699\uFE0F Configura\u00E7\u00F5es" }), _jsxs("div", { className: "shell-config", children: [_jsxs("div", { className: "card-config", children: [_jsx("div", { className: "card-config-titulo", children: "\uD83C\uDFA8 Apar\u00EAncia" }), _jsxs("div", { className: "linha-config", children: [_jsx("span", { className: "rotulo-config", children: "Tema" }), _jsxs("button", { className: "btn-secundario", onClick: alternarTema, children: [local.tema === 'claro' ? '☀️ Tema claro' : '🌙 Tema escuro', " (clique pra alternar)"] })] })] }), _jsxs("div", { className: "card-config", children: [_jsx("div", { className: "card-config-titulo", children: "\uD83E\uDD16 Provedor de IA" }), _jsx("div", { className: "card-config-desc", children: "Escolha o servi\u00E7o. A chave fica salva localmente no seu PC." }), _jsx("div", { className: "grade-provedores", children: PROVEDORES.map((p) => (_jsxs("button", { className: `card-provedor ${local.provedor === p.valor ? 'ativo' : ''}`, onClick: () => void trocarProvedor(p.valor), children: [_jsx("span", { className: "logo", children: p.logo }), _jsx("span", { className: "nome", children: p.nome }), _jsx("span", { className: `tag ${p.pago ? 'paid' : 'free'}`, children: p.pago ? '$' : 'grátis' }), _jsx("span", { className: "sub", children: p.descricao })] }, p.valor))) }), local.provedor !== 'ollama' && (_jsxs("div", { className: "config-provedor visivel", children: [_jsxs("div", { className: "linha-config", children: [_jsx("span", { className: "rotulo-config", children: "API Key" }), _jsx("input", { type: "password", className: "input-config", placeholder: "sk-\u2026", value: local.chaves[local.provedor], onChange: (e) => atualizarChave(local.provedor, e.target.value) })] }), _jsxs("div", { className: "linha-config", children: [_jsx("span", { className: "rotulo-config", children: "Modelo" }), _jsx("select", { className: "select-config", value: modeloAtual, onChange: (e) => atualizarModelo(local.provedor, e.target.value), children: listaFinal.map((m) => _jsx("option", { value: m, children: m }, m)) })] }), _jsxs("div", { className: "linha-config", children: [_jsx("span", { className: "rotulo-config" }), _jsx("a", { style: { fontSize: 11, color: 'var(--verde)', cursor: 'pointer' }, onClick: () => window.nyai.abrirExterno(URLS_CHAVES[local.provedor]), children: "Obter chave \u2192" })] })] })), local.provedor === 'ollama' && (_jsxs("div", { className: "config-provedor visivel", children: [_jsxs("div", { className: "linha-config", children: [_jsx("span", { className: "rotulo-config", children: "Modelo Ollama" }), _jsx("select", { className: "select-config", value: modeloAtual, onChange: (e) => atualizarModelo('ollama', e.target.value), children: listaFinal.map((m) => _jsx("option", { value: m, children: m }, m)) })] }), modelosOllamaReais.length > 0 && (_jsxs("div", { className: "linha-config", children: [_jsx("span", { className: "rotulo-config" }), _jsxs("span", { style: { fontSize: 11, color: 'var(--texto-mudo)' }, children: ["\u2713 ", modelosOllamaReais.length, " modelo(s) detectados no Ollama"] })] })), _jsxs("div", { className: "linha-config", children: [_jsx("span", { className: "rotulo-config" }), _jsx("a", { style: { fontSize: 11, color: 'var(--verde)', cursor: 'pointer' }, onClick: () => window.nyai.abrirExterno('https://ollama.com/download'), children: "Instalar Ollama \u2192" })] })] })), _jsxs("div", { className: "aviso", children: [_jsx("strong", { children: "\u26A0\uFE0F Seguran\u00E7a:" }), " a chave fica em ", _jsx("code", { children: "%APPDATA%\\nyai\\nyai-config.json" }), ' ', "(s\u00F3 no seu PC). Em PCs compartilhados, prefira Ollama."] })] }), _jsxs("div", { className: "card-config", children: [_jsx("div", { className: "card-config-titulo", children: "\uD83D\uDCAC Instru\u00E7\u00F5es personalizadas da IA" }), _jsx("div", { className: "card-config-desc", children: "A instru\u00E7\u00E3o GERAL vai pra toda requisi\u00E7\u00E3o. As espec\u00EDficas se somam s\u00F3 na tela correspondente. Em branco = sem instru\u00E7\u00E3o." }), _jsxs("div", { className: "linha-config", children: [_jsx("span", { className: "rotulo-config", children: "Geral (todas as telas)" }), _jsx("textarea", { className: "textarea-config", placeholder: "Contexto sobre voc\u00EA, regras que valem pra tudo...", value: local.instrucaoPersonalizada, onChange: (e) => atualizar('instrucaoPersonalizada', e.target.value) })] }), _jsxs("div", { className: "linha-config", children: [_jsx("span", { className: "rotulo-config", children: "\uD83C\uDF10 S\u00F3 Traduzir" }), _jsx("textarea", { className: "textarea-config", placeholder: "Regras que s\u00F3 valem ao traduzir...", value: local.instrucaoTraduzir || '', onChange: (e) => atualizar('instrucaoTraduzir', e.target.value) })] }), _jsxs("div", { className: "linha-config", children: [_jsx("span", { className: "rotulo-config", children: "\u270F\uFE0F S\u00F3 Corrigir" }), _jsx("textarea", { className: "textarea-config", placeholder: "Regras que s\u00F3 valem ao corrigir...", value: local.instrucaoCorrigir || '', onChange: (e) => atualizar('instrucaoCorrigir', e.target.value) })] }), _jsxs("div", { className: "linha-config", children: [_jsx("span", { className: "rotulo-config", children: "\u270D\uFE0F S\u00F3 Reescrever" }), _jsx("textarea", { className: "textarea-config", placeholder: "Regras que s\u00F3 valem ao reescrever...", value: local.instrucaoReescrever || '', onChange: (e) => atualizar('instrucaoReescrever', e.target.value) })] })] }), _jsxs("div", { className: "card-config", children: [_jsx("div", { className: "card-config-titulo", children: "\uD83C\uDF10 Personalidades dos tons (Traduzir)" }), _jsx("div", { className: "card-config-desc", children: "Cada tom aplicado no modo Traduzir. Em branco = volta ao padr\u00E3o." }), TONS_TRADUCAO.map((t) => (_jsxs("div", { className: "linha-config", children: [_jsxs("span", { className: "rotulo-config", children: [t.emoji, " ", t.rotulo] }), _jsx("textarea", { className: "textarea-config", placeholder: "(padr\u00E3o)", value: local.promptsTonsTraducao?.[t.valor] || '', onChange: (e) => atualizarPromptTomTraducao(t.valor, e.target.value) })] }, t.valor))), _jsx("div", { className: "linha-config", style: { justifyContent: 'flex-end' }, children: _jsx("button", { className: "btn-secundario", onClick: restaurarTonsTraducao, children: "Restaurar padr\u00F5es" }) })] }), _jsxs("div", { className: "card-config", children: [_jsx("div", { className: "card-config-titulo", children: "\u270D\uFE0F Personalidades dos tons (Reescrever)" }), _jsx("div", { className: "card-config-desc", children: "Cada tom aplicado no modo Reescrever. Em branco = volta ao padr\u00E3o." }), TONS.map((t) => (_jsxs("div", { className: "linha-config", children: [_jsxs("span", { className: "rotulo-config", children: [t.emoji, " ", t.rotulo] }), _jsx("textarea", { className: "textarea-config", placeholder: "(padr\u00E3o)", value: local.promptsTons[t.valor] || '', onChange: (e) => atualizarPromptTom(t.valor, e.target.value) })] }, t.valor))), _jsx("div", { className: "linha-config", style: { justifyContent: 'flex-end' }, children: _jsx("button", { className: "btn-secundario", onClick: restaurarTons, children: "Restaurar padr\u00F5es" }) })] }), _jsxs("div", { className: "card-config", children: [_jsx("div", { className: "card-config-titulo", children: "\u2328\uFE0F Atalhos globais" }), _jsxs("div", { className: "card-config-desc", children: ["Funcionam mesmo com a NYAI minimizada. Sempre use ", _jsx("code", { children: "Ctrl" }), " ou ", _jsx("code", { children: "Ctrl+Shift" }), " na frente, sen\u00E3o dispara enquanto voc\u00EA digita."] }), _jsxs("div", { className: "linha-config", children: [_jsx("span", { className: "rotulo-config", children: "Mostrar/Ocultar janela" }), _jsx("input", { className: "input-config", value: local.atalhos.mostrarOcultar, onChange: (e) => atualizarAtalho('mostrarOcultar', e.target.value) })] }), _jsxs("div", { className: "linha-config", children: [_jsx("span", { className: "rotulo-config", children: "Capturar e traduzir" }), _jsx("input", { className: "input-config", value: local.atalhos.capturarTraduzir, onChange: (e) => atualizarAtalho('capturarTraduzir', e.target.value) })] }), _jsxs("div", { className: "linha-config", children: [_jsx("span", { className: "rotulo-config", children: "Capturar (sem traduzir)" }), _jsx("input", { className: "input-config", value: local.atalhos.capturarSemTraduzir, onChange: (e) => atualizarAtalho('capturarSemTraduzir', e.target.value) })] }), _jsxs("div", { className: "linha-config", children: [_jsx("span", { className: "rotulo-config", children: "Colar \u00FAltima tradu\u00E7\u00E3o" }), _jsx("input", { className: "input-config", value: local.atalhos.colarUltimaTraducao, onChange: (e) => atualizarAtalho('colarUltimaTraducao', e.target.value) })] }), _jsxs("div", { className: "linha-config", children: [_jsx("span", { className: "rotulo-config", children: "Salvar resposta" }), _jsx("input", { className: "input-config", value: local.atalhos.salvarResposta, onChange: (e) => atualizarAtalho('salvarResposta', e.target.value) })] }), _jsxs("div", { className: "linha-config", children: [_jsx("span", { className: "rotulo-config", children: "Busca r\u00E1pida (Frases)" }), _jsx("input", { className: "input-config", value: local.atalhos.buscaRapidaFrases || '', onChange: (e) => atualizarAtalho('buscaRapidaFrases', e.target.value) })] })] }), _jsx("div", { className: "barra-salvar", children: _jsx("button", { className: "btn-primario verde", onClick: salvar, children: "Salvar configura\u00E7\u00F5es" }) })] })] }));
}
