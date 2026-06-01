// tipos centrais do app. mexe aqui se mudar a forma de algum dado.

export type Provedor = 'deepseek' | 'openai' | 'gemini' | 'claude' | 'ollama';

export type Tema = 'claro' | 'escuro';

export type Tom =
  | 'formal'
  | 'casual'
  | 'empatico'
  | 'assertivo'
  | 'breve'
  | 'detalhado'
  | 'corrigir';

export type TomTraducao =
  | 'profissional'
  | 'formal'
  | 'educado'
  | 'informal'
  | 'casual'
  | 'amigavel';

export type ModoIA = 'traduzir' | 'corrigir' | 'reescrever';

export interface Configuracao {
  provedor: Provedor;
  chaves: Record<Exclude<Provedor, 'ollama'>, string>;
  modelos: Record<Provedor, string>;
  idiomaOrigem: string;
  idiomaDestino: string;
  instrucaoPersonalizada: string;
  instrucaoTraduzir: string;
  instrucaoCorrigir: string;
  instrucaoReescrever: string;
  promptsTons: Record<Tom, string>;
  promptsTonsTraducao: Record<TomTraducao, string>;
  atalhos: {
    mostrarOcultar: string;
    capturarTraduzir: string;
    capturarSemTraduzir: string;
    colarUltimaTraducao: string;
    salvarResposta: string;
    buscaRapidaFrases: string;
  };
  tema: Tema;
}

export interface ExemploEstilo {
  original: string;
  preferido: string;
  tom: string;
  data: string;
}

export interface Memoria {
  exemplosEstilo: ExemploEstilo[];
}

export interface Frase {
  original: string;
  traduzido: string;
  corrigido: string;
  origem: string;
  destino: string;
  tom: string;
  data: string;
}

export interface Frases {
  frases: Frase[];
}

export interface ParametrosIA {
  modo: ModoIA;
  texto: string;
  tom?: string;
  origem?: string;
  destino?: string;
  instrucaoExtra?: string;
}

export interface RespostaIA {
  texto: string;
  erro?: string;
  tokens?: { entrada: number; saida: number };
}

export interface StatusOllama {
  online: boolean;
  modelos: string[];
}

export interface TokensSessao {
  entrada: number;
  saida: number;
}

declare global {
  interface Window {
    nyai: {
      janelaMinimizar: () => Promise<void>;
      janelaOcultar: () => Promise<void>;
      janelaMaximizarRestaurar: () => Promise<boolean>;
      abrirExterno: (url: string) => Promise<void>;
      copiarTexto: (texto: string) => Promise<{ ok: boolean }>;

      obterConfiguracao: () => Promise<Configuracao>;
      salvarConfiguracao: (parcial: Partial<Configuracao>) =>
        Promise<{ ok: boolean; erro?: string; caminho: string }>;

      obterMemoria: () => Promise<Memoria>;
      adicionarExemplo: (ex: Omit<ExemploEstilo, 'data'>) => Promise<Memoria>;
      removerExemplo: (indice: number) => Promise<Memoria>;
      limparMemoria: () => Promise<Memoria>;

      obterFrases: () => Promise<Frases>;
      adicionarFrase: (frase: Omit<Frase, 'data'>) => Promise<Frases>;
      removerFrase: (indice: number) => Promise<Frases>;
      limparFrases: () => Promise<Frases>;
      buscarFrase: (params: { texto: string; destino?: string }) => Promise<Frase | null>;

      requisicaoIA: (params: ParametrosIA) => Promise<RespostaIA>;

      obterTokens: () => Promise<TokensSessao>;
      zerarTokens: () => Promise<TokensSessao>;

      verificarOllama: () => Promise<StatusOllama>;
      listarModelosOllama: () => Promise<StatusOllama>;

      ouvir: <T = unknown>(
        canal:
          | 'nyai:atalho-capturar-traduzir'
          | 'nyai:atalho-capturar-reescrever'
          | 'nyai:atalho-salvar-resposta'
          | 'nyai:traducao-rapida-pronta'
          | 'nyai:tokens-atualizados'
          | 'nyai:status-ollama'
          | 'nyai:abrir-busca-rapida',
        callback: (dados: T) => void
      ) => () => void;
    };
  }
}

export {};
