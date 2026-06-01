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

export type Tela = 'traduzir' | 'reescrever' | 'estilo' | 'frases' | 'configuracoes';

function Conteudo() {
  const [tela, setTela] = useState<Tela>('traduzir');
  const _app = useApp();

  useEffect(() => {
    const off1 = window.nyai.ouvir('nyai:atalho-capturar-traduzir', () => setTela('traduzir'));
    const off2 = window.nyai.ouvir('nyai:atalho-capturar-reescrever', () => setTela('reescrever'));
    const off3 = window.nyai.ouvir('nyai:traducao-rapida-pronta', () => setTela('traduzir'));
    const off4 = window.nyai.ouvir('nyai:abrir-busca-rapida', () => setTela('frases'));
    return () => { off1(); off2(); off3(); off4(); };
  }, []);

  return (
    <>
      <div className="app">
        <TopBar />
        <SideBar telaAtiva={tela} onMudarTela={setTela} />
        {tela === 'traduzir' && <TelaTraduzir />}
        {tela === 'reescrever' && <TelaReescrever />}
        {tela === 'estilo' && <TelaEstilo />}
        {tela === 'frases' && <TelaFrasesSalvas />}
        {tela === 'configuracoes' && <TelaConfiguracoes />}
      </div>
      <Toasts />
    </>
  );
}

export default function App() {
  return (
    <ProvedorApp>
      <ProvedorEstadoTelas>
        <Conteudo />
      </ProvedorEstadoTelas>
    </ProvedorApp>
  );
}
