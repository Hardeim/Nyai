import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* TelaFrasesSalvas — lista de traduções salvas + busca rápida */
import { useState, useEffect, useRef } from 'react';
import { useApp } from '../contextos/ContextoApp';
import { idiomaCurto } from '../utils/constantes';
export function TelaFrasesSalvas() {
    const { frases, removerFrase, limparFrases } = useApp();
    const [busca, setBusca] = useState('');
    const refBusca = useRef(null);
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
        ? lista.filter((f) => f.original.toLowerCase().includes(busca.toLowerCase()) ||
            f.traduzido.toLowerCase().includes(busca.toLowerCase()))
        : lista;
    async function limparTudo() {
        if (!confirm('Limpar todas as frases salvas? Não pode ser desfeito.'))
            return;
        await limparFrases();
    }
    function copiarTraducao(texto) {
        navigator.clipboard.writeText(texto);
    }
    return (_jsxs("section", { className: "tela", children: [_jsx("h1", { className: "titulo-tela", children: "\uD83D\uDCCC Frases salvas" }), _jsxs("p", { style: { fontSize: 12.5, color: 'var(--texto-2)', margin: '-10px 0 14px', lineHeight: 1.5 }, children: ["Tradu\u00E7\u00F5es que voc\u00EA marcou pra reusar. Quando voc\u00EA digitar um texto id\u00EAntico a um salvo, a NYAI sugere a tradu\u00E7\u00E3o automaticamente \u2014 economizando tokens. Atalho ", _jsx("strong", { children: "Ctrl+Alt+T" }), " abre a busca aqui."] }), _jsxs("div", { className: "linha-pills", style: { justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("span", { className: "rotulo-secao", style: { margin: 0 }, children: [lista.length, " ", lista.length === 1 ? 'frase salva' : 'frases salvas'] }), _jsx("button", { className: "btn-secundario perigo", onClick: limparTudo, disabled: lista.length === 0, children: "Limpar tudo" })] }), _jsx("input", { ref: refBusca, type: "text", className: "input-config", placeholder: "Buscar nas frases salvas...", value: busca, onChange: (e) => setBusca(e.target.value), style: { marginBottom: 12 } }), _jsx("div", { style: { flex: 1, overflowY: 'auto', paddingRight: 4 }, children: filtradas.length === 0 ? (_jsxs("div", { className: "estado-vazio", children: [_jsx("h3", { children: lista.length === 0 ? 'Nenhuma frase salva ainda' : 'Nada encontrado' }), _jsx("p", { children: lista.length === 0
                                ? 'Use a tela Traduzir, faça uma tradução e clique em "💾 Salvar esta tradução".'
                                : 'Tente outras palavras na busca.' })] })) : (filtradas.map((f) => {
                    const indiceReal = lista.indexOf(f);
                    return (_jsxs("div", { className: "item-estilo", children: [_jsxs("div", { className: "item-estilo-grade", children: [_jsxs("div", { className: "item-estilo-coluna", children: [_jsxs("h4", { children: ["Original (", idiomaCurto(f.origem), ")"] }), _jsx("p", { children: f.original })] }), _jsxs("div", { className: "item-estilo-coluna", children: [_jsxs("h4", { children: ["Tradu\u00E7\u00E3o (", idiomaCurto(f.destino), ")"] }), _jsx("p", { children: f.traduzido })] })] }), f.corrigido && (_jsxs("div", { style: { marginTop: 4, fontSize: 11.5, color: 'var(--texto-mudo)' }, children: [_jsx("strong", { children: "Corrigido:" }), " ", f.corrigido] })), _jsxs("div", { className: "item-estilo-meta", children: [_jsxs("span", { children: [f.tom && _jsx("span", { className: "tag-tom", children: f.tom }), new Date(f.data).toLocaleString('pt-BR')] }), _jsxs("div", { style: { display: 'flex', gap: 12 }, children: [_jsx("button", { onClick: () => copiarTraducao(f.traduzido), style: { color: 'var(--verde)' }, children: "Copiar tradu\u00E7\u00E3o" }), _jsx("button", { onClick: () => void removerFrase(indiceReal), children: "Remover" })] })] })] }, indiceReal));
                })) })] }));
}
