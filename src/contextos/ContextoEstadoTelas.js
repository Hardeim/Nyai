import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const ESTADO_TRADUZIR_INICIAL = {
    modo: 'ambos',
    origem: 'pt-BR',
    destino: 'es-LATAM',
    entrada: '',
    corrigido: '',
    traducao: '',
    tom: 'profissional',
};
const ESTADO_REESCREVER_INICIAL = {
    tom: 'formal',
    instrucaoExtra: '',
    entrada: '',
    saida: '',
};
const Contexto = createContext(null);
export function ProvedorEstadoTelas({ children }) {
    const [estadoTraduzir, setEstadoTraduzirInterno] = useState(ESTADO_TRADUZIR_INICIAL);
    const [estadoReescrever, setEstadoReescreverInterno] = useState(ESTADO_REESCREVER_INICIAL);
    // Atualização parcial (recebe só os campos que mudaram, faz merge com o estado atual)
    const setEstadoTraduzir = (parcial) => {
        setEstadoTraduzirInterno((atual) => ({ ...atual, ...parcial }));
    };
    const setEstadoReescrever = (parcial) => {
        setEstadoReescreverInterno((atual) => ({ ...atual, ...parcial }));
    };
    return (_jsx(Contexto.Provider, { value: { estadoTraduzir, setEstadoTraduzir, estadoReescrever, setEstadoReescrever }, children: children }));
}
export function useEstadoTelas() {
    const ctx = useContext(Contexto);
    if (!ctx)
        throw new Error('useEstadoTelas deve ser usado dentro de <ProvedorEstadoTelas>');
    return ctx;
}
