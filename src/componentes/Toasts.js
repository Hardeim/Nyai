import { jsx as _jsx } from "react/jsx-runtime";
import { useApp } from '../contextos/ContextoApp';
export function Toasts() {
    const { toasts } = useApp();
    return (_jsx("div", { className: "toasts", children: toasts.map((t) => (_jsx("div", { className: `toast ${t.tipo}`, children: t.mensagem }, t.id))) }));
}
