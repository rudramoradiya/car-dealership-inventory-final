import { useEffect } from 'react';

export function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isError = type === 'error';

  return (
    <div
      className={`fixed top-20 right-6 z-50 flex items-center space-x-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-xs font-semibold backdrop-blur-md transition-all transform animate-fade-in ${
        isError
          ? 'bg-red-950/90 border-red-500/80 text-red-100 shadow-red-950/40'
          : 'bg-emerald-950/90 border-emerald-500/80 text-emerald-100 shadow-emerald-950/40'
      }`}
    >
      <span className="text-base">{isError ? '⚠️' : '✅'}</span>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-3 text-xs opacity-70 hover:opacity-100 transition-opacity p-0.5"
      >
        ✕
      </button>
    </div>
  );
}

export default Toast;
