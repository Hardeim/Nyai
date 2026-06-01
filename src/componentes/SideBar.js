import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ITENS = [
    { tela: 'traduzir', rotulo: 'Traduzir', icone: '🌐' },
    { tela: 'reescrever', rotulo: 'Reescrever', icone: '✍️' },
    { tela: 'estilo', rotulo: 'Meu estilo', icone: '🧠' },
    { tela: 'frases', rotulo: 'Frases salvas', icone: '📌' },
];
export function SideBar({ telaAtiva, onMudarTela }) {
    return (_jsxs("nav", { className: "sidebar", children: [ITENS.map((item) => (_jsxs("button", { className: `nav-btn ${telaAtiva === item.tela ? 'ativa' : ''}`, onClick: () => onMudarTela(item.tela), title: item.rotulo, children: [_jsx("span", { style: { fontSize: 18 }, children: item.icone }), _jsx("span", { className: "tip", children: item.rotulo })] }, item.tela))), _jsx("div", { className: "nav-spacer" }), _jsxs("button", { className: `nav-btn ${telaAtiva === 'configuracoes' ? 'ativa' : ''}`, onClick: () => onMudarTela('configuracoes'), title: "Configura\u00E7\u00F5es", children: [_jsx("span", { style: { fontSize: 18 }, children: "\u2699\uFE0F" }), _jsx("span", { className: "tip", children: "Configura\u00E7\u00F5es" })] })] }));
}
