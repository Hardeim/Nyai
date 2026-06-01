import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Configuracao, Memoria, Frases, Frase, StatusOllama, TokensSessao } from '../tipos';

interface Toast {
  id: number;
  mensagem: string;
  tipo: 'ok' | 'erro' | 'info';
}

interface ContextoAppValor {
  configuracao: Configuracao | null;
  memoria: Memoria | null;
  frases: Frases | null;
  statusOllama: StatusOllama;
  tokens: TokensSessao;
  toasts: Toast[];

  recarregarConfiguracao: () => Promise<void>;
  salvarConfiguracao: (parcial: Partial<Configuracao>) => Promise<boolean>;

  recarregarMemoria: () => Promise<void>;
  adicionarExemplo: (ex: { original: string; preferido: string; tom: string }) => Promise<void>;
  removerExemplo: (indice: number) => Promise<void>;
  limparMemoria: () => Promise<void>;

  recarregarFrases: () => Promise<void>;
  adicionarFrase: (frase: Omit<Frase, 'data'>) => Promise<void>;
  removerFrase: (indice: number) => Promise<void>;
  limparFrases: () => Promise<void>;
  buscarFrase: (texto: string, destino?: string) => Promise<Frase | null>;

  zerarTokens: () => Promise<void>;
  mostrarToast: (mensagem: string, tipo?: Toast['tipo']) => void;
}

const ContextoApp = createContext<ContextoAppValor | null>(null);

export function ProvedorApp({ children }: { children: ReactNode }) {
  const [configuracao, setConfiguracao] = useState<Configuracao | null>(null);
  const [memoria, setMemoria] = useState<Memoria | null>(null);
  const [frases, setFrases] = useState<Frases | null>(null);
  const [statusOllama, setStatusOllama] = useState<StatusOllama>({ online: false, modelos: [] });
  const [tokens, setTokens] = useState<TokensSessao>({ entrada: 0, saida: 0 });
  const [toasts, setToasts] = useState<Toast[]>([]);

  // -------- Toast --------
  const mostrarToast = useCallback((mensagem: string, tipo: Toast['tipo'] = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((atuais) => [...atuais, { id, mensagem, tipo }]);
    setTimeout(() => setToasts((atuais) => atuais.filter((t) => t.id !== id)), 2800);
  }, []);

  // -------- Configuração --------
  const recarregarConfiguracao = useCallback(async () => {
    const c = await window.nyai.obterConfiguracao();
    setConfiguracao(c);
    aplicarTema(c.tema);
  }, []);

  const salvarConfiguracao = useCallback(async (parcial: Partial<Configuracao>) => {
    const resultado = await window.nyai.salvarConfiguracao(parcial);
    if (resultado.ok) {
      await recarregarConfiguracao();
      mostrarToast('Configurações salvas', 'ok');
      return true;
    } else {
      mostrarToast(`Falha ao salvar: ${resultado.erro || 'erro desconhecido'}`, 'erro');
      return false;
    }
  }, [recarregarConfiguracao, mostrarToast]);

  // -------- Memória --------
  const recarregarMemoria = useCallback(async () => {
    setMemoria(await window.nyai.obterMemoria());
  }, []);

  const adicionarExemplo = useCallback(async (ex: { original: string; preferido: string; tom: string }) => {
    const m = await window.nyai.adicionarExemplo(ex);
    setMemoria(m);
    mostrarToast('Exemplo salvo como referência', 'ok');
  }, [mostrarToast]);

  const removerExemplo = useCallback(async (indice: number) => {
    const m = await window.nyai.removerExemplo(indice);
    setMemoria(m);
  }, []);

  const limparMemoria = useCallback(async () => {
    const m = await window.nyai.limparMemoria();
    setMemoria(m);
    mostrarToast('Memória limpa', 'ok');
  }, [mostrarToast]);

  // -------- Frases salvas --------
  const recarregarFrases = useCallback(async () => {
    setFrases(await window.nyai.obterFrases());
  }, []);

  const adicionarFrase = useCallback(async (frase: Omit<Frase, 'data'>) => {
    const f = await window.nyai.adicionarFrase(frase);
    setFrases(f);
    mostrarToast('Frase salva — disponível pra reuso', 'ok');
  }, [mostrarToast]);

  const removerFrase = useCallback(async (indice: number) => {
    const f = await window.nyai.removerFrase(indice);
    setFrases(f);
  }, []);

  const limparFrases = useCallback(async () => {
    const f = await window.nyai.limparFrases();
    setFrases(f);
    mostrarToast('Frases salvas limpas', 'ok');
  }, [mostrarToast]);

  const buscarFrase = useCallback(async (texto: string, destino?: string) => {
    return await window.nyai.buscarFrase({ texto, destino });
  }, []);

  // -------- Tokens --------
  const zerarTokens = useCallback(async () => {
    const t = await window.nyai.zerarTokens();
    setTokens(t);
  }, []);

  // -------- Carregamento inicial + eventos --------
  useEffect(() => {
    void recarregarConfiguracao();
    void recarregarMemoria();
    void recarregarFrases();
    void window.nyai.obterTokens().then(setTokens);
    void window.nyai.verificarOllama().then(setStatusOllama);

    const offOllama = window.nyai.ouvir<StatusOllama>('nyai:status-ollama', setStatusOllama);
    const offTokens = window.nyai.ouvir<TokensSessao>('nyai:tokens-atualizados', setTokens);

    const intervalo = setInterval(() => {
      void window.nyai.verificarOllama().then(setStatusOllama);
    }, 5000);

    return () => {
      offOllama();
      offTokens();
      clearInterval(intervalo);
    };
  }, [recarregarConfiguracao, recarregarMemoria, recarregarFrases]);

  return (
    <ContextoApp.Provider
      value={{
        configuracao,
        memoria,
        frases,
        statusOllama,
        tokens,
        toasts,
        recarregarConfiguracao,
        salvarConfiguracao,
        recarregarMemoria,
        adicionarExemplo,
        removerExemplo,
        limparMemoria,
        recarregarFrases,
        adicionarFrase,
        removerFrase,
        limparFrases,
        buscarFrase,
        zerarTokens,
        mostrarToast,
      }}
    >
      {children}
    </ContextoApp.Provider>
  );
}

// Hook para consumir o contexto. Erro claro se usar fora do provider.
export function useApp() {
  const ctx = useContext(ContextoApp);
  if (!ctx) throw new Error('useApp deve ser usado dentro de <ProvedorApp>');
  return ctx;
}

// Aplica o tema no <html> via atributo data-tema (lido pelo CSS)
function aplicarTema(tema: 'claro' | 'escuro') {
  document.documentElement.setAttribute('data-tema', tema);
}
