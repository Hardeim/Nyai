import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* App — componente raiz: gerencia qual tela está visível */
import { useState, useEffect } from 'react';
import { ProvedorApp, useApp } from './contextos/ContextoApp';
import { ProvedorEstadoTelas } from './contextos/ContextoEstadoTelas';
import { TopBar } from './componentes/TopBar';
import { SideBar } from './componentes/SideBar';
import { Toasts } from './componentes/Toasts';
import { TelaTraduzir } from './telas/TelaTraduzir';
import { TelaReescrever } from './telas/TelaReescrever';
import { TelaEstilo } from './telas/TelaEstilo';
import { TelaFrasesSalvas } from './telas/TelaFrasesSalvas';
import { TelaConfiguracoes } from './telas/TelaConfiguracoes';
function Conteudo() {
    const [tela, setTela] = useState('traduzir');
    const _app = useApp();
    useEffect(() => {
        const off1 = window.nyai.ouvir('nyai:atalho-capturar-traduzir', () => setTela('traduzir'));
        const off2 = window.nyai.ouvir('nyai:atalho-capturar-reescrever', () => setTela('reescrever'));
        const off3 = window.nyai.ouvir('nyai:traducao-rapida-pronta', () => setTela('traduzir'));
        const off4 = window.nyai.ouvir('nyai:abrir-busca-rapida', () => setTela('frases'));
        return () => { off1(); off2(); off3(); off4(); };
    }, []);
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "app", children: [_jsx(TopBar, {}), _jsx(SideBar, { telaAtiva: tela, onMudarTela: setTela }), tela === 'traduzir' && _jsx(TelaTraduzir, {}), tela === 'reescrever' && _jsx(TelaReescrever, {}), tela === 'estilo' && _jsx(TelaEstilo, {}), tela === 'frases' && _jsx(TelaFrasesSalvas, {}), tela === 'configuracoes' && _jsx(TelaConfiguracoes, {})] }), _jsx(Toasts, {})] }));
}
export default function App() {
    return (_jsx(ProvedorApp, { children: _jsx(ProvedorEstadoTelas, { children: _jsx(Conteudo, {}) }) }));
}
