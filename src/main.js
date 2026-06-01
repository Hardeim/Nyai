import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './estilos/global.css';
import './estilos/layout.css';
import './estilos/componentes.css';
const raiz = document.getElementById('root');
if (!raiz)
    throw new Error('Elemento #root não encontrado no index.html');
createRoot(raiz).render(_jsx(StrictMode, { children: _jsx(App, {}) }));
