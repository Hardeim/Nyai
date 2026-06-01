import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const rotuloTom = (t) => TONS.find((x) => x.valor === t)?.rotulo || t;
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
        if (!confirm('Limpar todos os exemplos? Não pode ser desfeito.'))
            return;
        await limparMemoria();
    }
    return (_jsxs("section", { className: "tela", children: [_jsx("h1", { className: "titulo-tela", children: "\uD83E\uDDE0 Mem\u00F3ria de estilo" }), _jsx("p", { style: { fontSize: 12.5, color: 'var(--texto-2)', margin: '-10px 0 14px', lineHeight: 1.5 }, children: "A NYAI usa estes exemplos como refer\u00EAncia ao reescrever no seu jeito de falar. Quanto mais exemplos, mais \"com sua cara\"." }), _jsxs("div", { className: "linha-pills", style: { justifyContent: 'space-between' }, children: [_jsxs("span", { className: "rotulo-secao", style: { margin: 0 }, children: [exemplos.length, " ", exemplos.length === 1 ? 'exemplo salvo' : 'exemplos salvos'] }), _jsxs("div", { style: { display: 'flex', gap: 8 }, children: [_jsx("button", { className: "btn-secundario", onClick: abrirModal, children: "+ Adicionar exemplo" }), _jsx("button", { className: "btn-secundario perigo", onClick: limparTudo, children: "Limpar tudo" })] })] }), _jsx("div", { style: { flex: 1, overflowY: 'auto', paddingRight: 4 }, children: exemplos.length === 0 ? (_jsxs("div", { className: "estado-vazio", children: [_jsx("h3", { children: "Nenhum exemplo salvo ainda" }), _jsxs("p", { children: ["Use a tela ", _jsx("strong", { children: "Reescrever" }), " e clique em ", _jsx("em", { children: "\"Salvar como meu estilo\"" }), ", ou adicione exemplos manualmente aqui."] })] })) : (exemplos.map((ex, i) => (_jsxs("div", { className: "item-estilo", children: [_jsxs("div", { className: "item-estilo-grade", children: [_jsxs("div", { className: "item-estilo-coluna", children: [_jsx("h4", { children: "Original" }), _jsx("p", { children: ex.original })] }), _jsxs("div", { className: "item-estilo-coluna", children: [_jsx("h4", { children: "Vers\u00E3o preferida" }), _jsx("p", { children: ex.preferido })] })] }), _jsxs("div", { className: "item-estilo-meta", children: [_jsxs("span", { children: [ex.tom && _jsx("span", { className: "tag-tom", children: rotuloTom(ex.tom) }), new Date(ex.data).toLocaleString('pt-BR')] }), _jsx("button", { onClick: () => void removerExemplo(i), children: "Remover" })] })] }, i)))) }), modalAberto && (_jsx("div", { style: {
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000,
                }, onClick: () => setModalAberto(false), children: _jsxs("div", { style: {
                        background: 'var(--fundo)',
                        borderRadius: 12,
                        padding: 24,
                        width: '90%', maxWidth: 600,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    }, onClick: (e) => e.stopPropagation(), children: [_jsx("h2", { style: { fontSize: 16, fontWeight: 700, marginBottom: 14, color: 'var(--texto)' }, children: "Adicionar exemplo de estilo" }), _jsxs("div", { style: { marginBottom: 12 }, children: [_jsx("label", { style: { fontSize: 12, fontWeight: 600, color: 'var(--texto-2)', display: 'block', marginBottom: 4 }, children: "Texto original" }), _jsx("textarea", { className: "textarea-config", placeholder: "Como o texto chegou...", value: textoOriginal, onChange: (e) => setTextoOriginal(e.target.value), style: { width: '100%' } })] }), _jsxs("div", { style: { marginBottom: 14 }, children: [_jsx("label", { style: { fontSize: 12, fontWeight: 600, color: 'var(--texto-2)', display: 'block', marginBottom: 4 }, children: "Vers\u00E3o preferida (como voc\u00EA gostaria que ficasse)" }), _jsx("textarea", { className: "textarea-config", placeholder: "Como voc\u00EA escreveria...", value: textoPreferido, onChange: (e) => setTextoPreferido(e.target.value), style: { width: '100%' } })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'flex-end', gap: 8 }, children: [_jsx("button", { className: "btn-secundario", onClick: () => setModalAberto(false), children: "Cancelar" }), _jsx("button", { className: "btn-primario verde", onClick: confirmarAdicao, children: "Salvar exemplo" })] })] }) }))] }));
}
