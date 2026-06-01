import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
        const off1 = window.nyai.ouvir('nyai:atalho-capturar-reescrever', (texto) => {
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
        if (!entrada.trim())
            return mostrarToast('Digite ou cole um texto.', 'erro');
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
            }
            else {
                setEstadoReescrever({ saida: r.texto });
            }
        }
        finally {
            setCarregando(false);
        }
    }
    async function colar() {
        try {
            const texto = await navigator.clipboard.readText();
            setEstadoReescrever({ entrada: texto });
        }
        catch {
            mostrarToast('Não consegui ler o clipboard. Cole com Ctrl+V.', 'erro');
        }
    }
    async function copiar() {
        if (!saida)
            return;
        await window.nyai.copiarTexto(saida);
        mostrarToast('Copiado', 'ok');
    }
    async function salvarEstilo() {
        if (!entrada.trim() || !saida.trim())
            return mostrarToast('Faça uma reescrita primeiro.', 'erro');
        await adicionarExemplo({ original: entrada, preferido: saida, tom });
    }
    return (_jsxs("section", { className: "tela", children: [_jsx("h1", { className: "titulo-tela", children: "\u270D\uFE0F Reescrever mensagem com tom" }), _jsx("div", { className: "rotulo-secao", children: "Tom" }), _jsx("div", { className: "linha-pills", children: TONS.map((t) => (_jsxs("button", { className: `pill verde ${tom === t.valor ? 'ativa' : ''}`, onClick: () => setEstadoReescrever({ tom: t.valor }), children: [t.emoji, " ", t.rotulo] }, t.valor))) }), _jsx("div", { className: "linha-pills", children: _jsx("input", { type: "text", className: "input-config", style: { flex: 1, minWidth: 220 }, placeholder: "Instru\u00E7\u00E3o adicional (opcional). Ex: 'manter o nome do cliente', 'sem emojis'\u2026", value: instrucaoExtra, onChange: (e) => setEstadoReescrever({ instrucaoExtra: e.target.value }) }) }), _jsxs("div", { className: "colunas duas", children: [_jsxs("div", { className: "coluna", children: [_jsxs("div", { className: "coluna-cabecalho", children: [_jsx("span", { className: "coluna-rotulo", children: "ORIGINAL" }), _jsx("button", { className: "btn-pequeno", onClick: colar, children: "Colar" })] }), _jsx("textarea", { className: "coluna-textarea", placeholder: "Cole a mensagem que voc\u00EA quer reescrever\u2026", value: entrada, onChange: (e) => setEstadoReescrever({ entrada: e.target.value }) })] }), _jsxs("div", { className: "coluna", children: [_jsxs("div", { className: "coluna-cabecalho", children: [_jsx("span", { className: "coluna-rotulo", children: "REESCRITA" }), _jsx("button", { className: "btn-pequeno", onClick: copiar, children: "Copiar" })] }), _jsx("textarea", { className: "coluna-textarea", placeholder: "A vers\u00E3o reescrita aparece aqui\u2026", value: saida, onChange: (e) => setEstadoReescrever({ saida: e.target.value }) })] })] }), _jsxs("div", { className: "barra-acoes", children: [_jsxs("button", { className: "btn-primario", onClick: executar, disabled: carregando, children: ["\u26A1 ", carregando ? 'Reescrevendo…' : 'Reescrever'] }), _jsx("button", { className: "btn-secundario", onClick: salvarEstilo, children: "\uD83D\uDCBE Salvar como meu estilo" }), _jsx("button", { className: "btn-secundario", onClick: () => setEstadoReescrever({ entrada: '', saida: '' }), children: "Limpar" })] })] }));
}
