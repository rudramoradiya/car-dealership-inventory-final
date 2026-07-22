import { useState } from 'react';

export function RestockModal({ isOpen, vehicleName, onClose, onSubmit }) {
  const [amount, setAmount] = useState('1');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (numAmount > 0) {
      onSubmit(numAmount);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-6 text-slate-100">
        <div className="flex justify-between items-center border-b border-slate-700 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Restock Vehicle</h2>
            {vehicleName && <p className="text-xs text-blue-400 mt-0.5">{vehicleName}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-xs font-medium text-slate-300 mb-1">
              Amount to Add
            </label>
            <input
              id="amount"
              type="number"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
            >
              Restock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RestockModal;
