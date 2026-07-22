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
      className={`fixed top-20 right-6 z-50 flex items-center space-x-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium transition-all transform animate-bounce ${
        isError
          ? 'bg-red-900/90 border-red-500/80 text-red-100 shadow-red-900/40'
          : 'bg-emerald-900/90 border-emerald-500/80 text-emerald-100 shadow-emerald-900/40'
      }`}
    >
      <span>{isError ? '⚠️' : '✅'}</span>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-3 text-xs opacity-70 hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
    </div>
  );
}

export default Toast;
