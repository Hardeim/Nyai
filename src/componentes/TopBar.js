import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* TopBar — barra do topo com logo real */
import { useState, useEffect } from 'react';
import { useApp } from '../contextos/ContextoApp';
export function TopBar() {
    const { statusOllama, tokens, zerarTokens, configuracao } = useApp();
    const [maximizada, setMaximizada] = useState(false);
    const [logoSrc, setLogoSrc] = useState('');
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
        if (!confirm('Zerar contador de tokens da sessão?'))
            return;
        await zerarTokens();
    }
    return (_jsxs("header", { className: "topbar", children: [_jsx("div", { className: "logo-mark", children: logoSrc ? (_jsx("img", { src: logoSrc, alt: "NYAI", style: { width: 30, height: 30, objectFit: 'cover' } })) : (_jsx("span", { children: "N" })) }), _jsx("span", { className: "app-name", children: "NYAI" }), _jsxs("div", { className: `pill-status ${statusOllama.online ? 'on' : ''}`, children: [_jsx("span", { className: "dot" }), _jsx("span", { children: "Ollama" })] }), _jsx("div", { className: "badge", children: nomeProvedor }), _jsxs("div", { className: "badge tokens", title: `Tokens: ${tokens.entrada} entrada + ${tokens.saida} saída = ${totalTokens} total. Clique para zerar.`, onClick: aoZerar, children: ["\uD83E\uDE99 ", tokensTexto] }), _jsx("div", { className: "topbar-spacer" }), _jsx("span", { className: "kbd-hint", children: "Ctrl+Shift+Espa\u00E7o" }), _jsxs("div", { className: "botoes-janela", children: [_jsx("button", { className: "btn-janela", onClick: () => window.nyai.janelaMinimizar(), title: "Minimizar", children: "\u2500" }), _jsx("button", { className: "btn-janela", onClick: alternarMaximizar, title: maximizada ? 'Restaurar' : 'Maximizar', children: maximizada ? '🗗' : '🗖' }), _jsx("button", { className: "btn-janela fechar", onClick: () => window.nyai.janelaOcultar(), title: "Ocultar", children: "\u2715" })] })] }));
}
