import { useApp } from '../contextos/ContextoApp';

export function Toasts() {
  const { toasts } = useApp();
  return (
    <div className="toasts">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.tipo}`}>{t.mensagem}</div>
      ))}
    </div>
  );
}
