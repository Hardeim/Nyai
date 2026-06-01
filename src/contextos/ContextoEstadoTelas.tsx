import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Tom, TomTraducao } from '../tipos';

type ModoTraducao = 'traduzir' | 'corrigir' | 'ambos';

interface EstadoTraduzir {
  modo: ModoTraducao;
  origem: string;
  destino: string;
  entrada: string;
  corrigido: string;
  traducao: string;
  tom: TomTraducao;
}

interface EstadoReescrever {
  tom: Tom;
  instrucaoExtra: string;
  entrada: string;
  saida: string;
}

interface ValorContexto {
  // Tela Traduzir
  estadoTraduzir: EstadoTraduzir;
  setEstadoTraduzir: (atualizador: Partial<EstadoTraduzir>) => void;

  // Tela Reescrever
  estadoReescrever: EstadoReescrever;
  setEstadoReescrever: (atualizador: Partial<EstadoReescrever>) => void;
}

const ESTADO_TRADUZIR_INICIAL: EstadoTraduzir = {
  modo: 'ambos',
  origem: 'pt-BR',
  destino: 'es-LATAM',
  entrada: '',
  corrigido: '',
  traducao: '',
  tom: 'profissional',
};

const ESTADO_REESCREVER_INICIAL: EstadoReescrever = {
  tom: 'formal',
  instrucaoExtra: '',
  entrada: '',
  saida: '',
};

const Contexto = createContext<ValorContexto | null>(null);

export function ProvedorEstadoTelas({ children }: { children: ReactNode }) {
  const [estadoTraduzir, setEstadoTraduzirInterno] = useState<EstadoTraduzir>(ESTADO_TRADUZIR_INICIAL);
  const [estadoReescrever, setEstadoReescreverInterno] = useState<EstadoReescrever>(ESTADO_REESCREVER_INICIAL);

  // Atualização parcial (recebe só os campos que mudaram, faz merge com o estado atual)
  const setEstadoTraduzir = (parcial: Partial<EstadoTraduzir>) => {
    setEstadoTraduzirInterno((atual) => ({ ...atual, ...parcial }));
  };
  const setEstadoReescrever = (parcial: Partial<EstadoReescrever>) => {
    setEstadoReescreverInterno((atual) => ({ ...atual, ...parcial }));
  };

  return (
    <Contexto.Provider value={{ estadoTraduzir, setEstadoTraduzir, estadoReescrever, setEstadoReescrever }}>
      {children}
    </Contexto.Provider>
  );
}

export function useEstadoTelas() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error('useEstadoTelas deve ser usado dentro de <ProvedorEstadoTelas>');
  return ctx;
}
