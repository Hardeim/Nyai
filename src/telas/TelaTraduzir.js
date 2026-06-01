import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../contextos/ContextoApp';
import { useEstadoTelas } from '../contextos/ContextoEstadoTelas';
import { IDIOMAS, idiomaCurto, TONS_TRADUCAO } from '../utils/constantes';
export function TelaTraduzir() {
    const { configuracao, salvarConfiguracao, mostrarToast, adicionarFrase, buscarFrase } = useApp();
    const { estadoTraduzir, setEstadoTraduzir } = useEstadoTelas();
    const [carregando, setCarregando] = useState(false);
    const [fraseSugerida, setFraseSugerida] = useState(null);
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
        const off1 = window.nyai.ouvir('nyai:atalho-capturar-traduzir', (texto) => {
            setEstadoTraduzir({ entrada: texto });
            mostrarToast('Texto capturado — pronto pra traduzir', 'ok');
        });
        const off2 = window.nyai.ouvir('nyai:traducao-rapida-pronta', ({ original, traduzido }) => {
            setEstadoTraduzir({ entrada: original, traducao: traduzido, corrigido: '' });
            mostrarToast('Traduzido — já está no clipboard', 'ok');
        });
        const off3 = window.nyai.ouvir('nyai:atalho-salvar-resposta', () => {
            void salvarFrase();
        });
        return () => { off1(); off2(); off3(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // procura match de frase salva (debounced)
    useEffect(() => {
        if (!entrada.trim() || entrada.length < 3) {
            setFraseSugerida(null);
            return;
        }
        const timer = setTimeout(async () => {
            const f = await buscarFrase(entrada, destino);
            setFraseSugerida(f);
        }, 350);
        return () => clearTimeout(timer);
    }, [entrada, destino, buscarFrase]);
    const persistirIdiomas = useCallback(async (novoOrigem, novoDestino) => {
        await salvarConfiguracao({ idiomaOrigem: novoOrigem, idiomaDestino: novoDestino });
    }, [salvarConfiguracao]);
    function inverter() {
        if (origem === 'auto')
            return mostrarToast('Origem em "Detectar" — escolha um idioma.', 'erro');
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
        if (!fraseSugerida)
            return;
        setEstadoTraduzir({
            corrigido: fraseSugerida.corrigido || '',
            traducao: fraseSugerida.traduzido || '',
        });
        mostrarToast('Tradução reutilizada (0 tokens)', 'ok');
        setFraseSugerida(null);
    }
    async function executar() {
        if (!entrada.trim())
            return mostrarToast('Digite ou cole um texto.', 'erro');
        if (origem !== 'auto' && origem === destino)
            return mostrarToast('Origem e destino são iguais.', 'erro');
        setCarregando(true);
        setEstadoTraduzir({
            corrigido: modo !== 'traduzir' ? '...' : '',
            traducao: modo !== 'corrigir' ? '...' : '',
        });
        try {
            if (modo === 'traduzir') {
                const r = await window.nyai.requisicaoIA({ modo: 'traduzir', texto: entrada, origem, destino, tom });
                if (r.erro) {
                    mostrarToast(r.erro, 'erro');
                    setEstadoTraduzir({ traducao: '' });
                }
                else
                    setEstadoTraduzir({ traducao: r.texto });
            }
            else if (modo === 'corrigir') {
                const r = await window.nyai.requisicaoIA({ modo: 'corrigir', texto: entrada, origem, tom });
                if (r.erro) {
                    mostrarToast(r.erro, 'erro');
                    setEstadoTraduzir({ corrigido: '' });
                }
                else
                    setEstadoTraduzir({ corrigido: r.texto });
            }
            else {
                const r1 = await window.nyai.requisicaoIA({ modo: 'corrigir', texto: entrada, origem, tom });
                if (r1.erro) {
                    mostrarToast(r1.erro, 'erro');
                    setEstadoTraduzir({ corrigido: '', traducao: '' });
                    return;
                }
                setEstadoTraduzir({ corrigido: r1.texto });
                const baseTraducao = r1.texto || entrada;
                const r2 = await window.nyai.requisicaoIA({ modo: 'traduzir', texto: baseTraducao, origem, destino, tom });
                if (r2.erro) {
                    mostrarToast(r2.erro, 'erro');
                    setEstadoTraduzir({ traducao: '' });
                }
                else
                    setEstadoTraduzir({ traducao: r2.texto });
            }
        }
        finally {
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
        if (traducao === '...' || corrigido === '...')
            return mostrarToast('Aguarde terminar.', 'erro');
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
    return (_jsxs("section", { className: "tela", children: [_jsx("h1", { className: "titulo-tela", children: "\uD83C\uDF10 Traduzir com NYAI" }), _jsx("div", { className: "rotulo-secao", children: "Opera\u00E7\u00E3o" }), _jsxs("div", { className: "cards-modo", children: [_jsxs("button", { className: `card-modo ${modo === 'traduzir' ? 'ativa' : ''}`, onClick: () => setEstadoTraduzir({ modo: 'traduzir' }), children: [_jsx("span", { className: "icone", children: "\uD83C\uDF10" }), _jsx("span", { className: "nome", children: "Traduzir" }), _jsx("span", { className: "sub", children: "S\u00F3 traduz" })] }), _jsxs("button", { className: `card-modo ${modo === 'corrigir' ? 'ativa' : ''}`, onClick: () => setEstadoTraduzir({ modo: 'corrigir' }), children: [_jsx("span", { className: "icone", children: "\u270F\uFE0F" }), _jsx("span", { className: "nome", children: "Corrigir" }), _jsx("span", { className: "sub", children: "S\u00F3 corrige" })] }), _jsxs("button", { className: `card-modo ${modo === 'ambos' ? 'ativa' : ''}`, onClick: () => setEstadoTraduzir({ modo: 'ambos' }), children: [_jsx("span", { className: "icone", children: "\u2728" }), _jsx("span", { className: "nome", children: "Corrigir + Traduzir" }), _jsx("span", { className: "sub", children: "Ambos" })] })] }), _jsx("div", { className: "rotulo-secao", children: "Idiomas" }), _jsxs("div", { className: "barra-idiomas", children: [_jsx("select", { className: "seletor-idioma", value: origem, onChange: (e) => { setEstadoTraduzir({ origem: e.target.value }); void persistirIdiomas(e.target.value, destino); }, children: IDIOMAS.map((i) => _jsx("option", { value: i.codigo, children: i.nome }, i.codigo)) }), _jsx("button", { className: "btn-inverter", onClick: inverter, title: "Inverter origem/destino", children: "\u21C4" }), _jsx("select", { className: "seletor-idioma", value: destino, onChange: (e) => { setEstadoTraduzir({ destino: e.target.value }); void persistirIdiomas(origem, e.target.value); }, children: IDIOMAS.filter((i) => i.codigo !== 'auto').map((i) => (_jsx("option", { value: i.codigo, children: i.nome }, i.codigo))) })] }), _jsx("div", { className: "rotulo-secao", children: "Tom" }), _jsx("div", { className: "linha-pills", children: TONS_TRADUCAO.map((t) => (_jsxs("button", { className: `pill verde ${tom === t.valor ? 'ativa' : ''}`, onClick: () => setEstadoTraduzir({ tom: t.valor }), children: [t.emoji, " ", t.rotulo] }, t.valor))) }), fraseSugerida && (_jsxs("div", { style: {
                    padding: '8px 12px', marginBottom: 10,
                    background: 'var(--verde-suave)', border: '1px solid var(--verde-medio)',
                    borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontSize: 12, color: 'var(--verde)',
                }, children: [_jsx("span", { children: "\uD83D\uDCCC Voc\u00EA j\u00E1 traduziu isso antes. Reusar para economizar tokens?" }), _jsx("button", { className: "btn-pequeno", onClick: usarFraseSalva, style: { color: 'var(--verde)' }, children: "Usar tradu\u00E7\u00E3o salva" })] })), _jsxs("div", { className: classeColunas, children: [_jsxs("div", { className: "coluna", children: [_jsxs("div", { className: "coluna-cabecalho", children: [_jsx("span", { className: "coluna-rotulo", children: "ORIGINAL" }), _jsx("span", { className: "badge-idioma", children: idiomaCurto(origem) })] }), _jsx("textarea", { className: "coluna-textarea", placeholder: "Digite ou cole o texto\u2026", value: entrada, onChange: (e) => setEstadoTraduzir({ entrada: e.target.value }) })] }), mostraCorrigido && (_jsxs("div", { className: "coluna", children: [_jsx("div", { className: "coluna-cabecalho", children: _jsx("span", { className: "coluna-rotulo", children: "CORRIGIDO" }) }), _jsx("div", { className: `coluna-saida ${corrigido ? '' : 'vazia'}`, children: corrigido || 'Texto corrigido aparece aqui…' })] })), mostraTraducao && (_jsxs("div", { className: "coluna", children: [_jsxs("div", { className: "coluna-cabecalho", children: [_jsx("span", { className: "coluna-rotulo", children: "TRADU\u00C7\u00C3O" }), _jsx("span", { className: "badge-idioma verde", children: idiomaCurto(destino) })] }), _jsx("div", { className: `coluna-saida ${traducao ? '' : 'vazia'}`, children: traducao || 'A tradução aparece aqui…' })] }))] }), _jsxs("div", { className: "barra-acoes", children: [_jsxs("button", { className: "btn-primario", onClick: executar, disabled: carregando, children: ["\u26A1 ", carregando ? 'Processando…' : rotuloBotao] }), _jsx("button", { className: "btn-secundario", onClick: salvarFrase, children: "\uD83D\uDCBE Salvar esta tradu\u00E7\u00E3o" }), _jsx("button", { className: "btn-secundario", onClick: copiar, children: "Copiar resultado" }), _jsx("button", { className: "btn-secundario", onClick: limpar, children: "Limpar" })] })] }));
}
