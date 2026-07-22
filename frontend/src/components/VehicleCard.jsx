import { useAuth } from '../context/AuthContext.jsx';

export function VehicleCard({ vehicle, onPurchase, onEdit, onDelete, onRestock }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const { make, model, year, price, quantity, category, vin } = vehicle;

  const isOutOfStock = quantity === 0;

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden flex flex-col justify-between hover:border-slate-600 transition-all hover:shadow-2xl">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              {category || 'Vehicle'} • {year}
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              {make} {model}
            </h3>
          </div>
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
              isOutOfStock
                ? 'bg-red-500/20 text-red-300 border-red-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : `${quantity} in stock`}
          </span>
        </div>

        <div className="mt-6 flex items-baseline justify-between">
          <div>
            <span className="text-xs text-slate-400">Price</span>
            <p className="text-2xl font-extrabold text-white">{formatPrice(price)}</p>
          </div>
          {vin && (
            <div className="text-right">
              <span className="text-xs text-slate-400">VIN</span>
              <p className="text-xs font-mono text-slate-300">{vin}</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 bg-slate-800/50 border-t border-slate-700/50 space-y-3">
        <button
          onClick={() => onPurchase && onPurchase(vehicle)}
          disabled={isOutOfStock || !isAuthenticated}
          className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all shadow-sm ${
            isOutOfStock
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed border border-slate-600'
              : !isAuthenticated
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
          }`}
        >
          {isOutOfStock
            ? 'Out of Stock'
            : !isAuthenticated
            ? 'Login to Purchase'
            : 'Purchase'}
        </button>

        {isAdmin && (
          <div className="flex items-center justify-between space-x-2 pt-2 border-t border-slate-700/60">
            <button
              onClick={() => onEdit && onEdit(vehicle)}
              className="flex-1 py-1.5 px-3 text-xs font-medium text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-md transition-colors text-center"
            >
              Edit
            </button>
            <button
              onClick={() => onRestock && onRestock(vehicle)}
              className="flex-1 py-1.5 px-3 text-xs font-medium text-emerald-300 hover:text-emerald-200 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-md transition-colors text-center"
            >
              Restock
            </button>
            <button
              onClick={() => onDelete && onDelete(vehicle)}
              className="flex-1 py-1.5 px-3 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-md transition-colors text-center"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VehicleCard;
