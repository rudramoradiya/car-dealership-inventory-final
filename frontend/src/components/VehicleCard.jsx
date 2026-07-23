import { useAuth } from '../context/AuthContext.jsx';

export function VehicleCard({ vehicle, onPurchase, onEdit, onDelete, onRestock }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const { make, model, year, price, quantity, category, vin } = vehicle;

  const isOutOfStock = quantity === 0;

  const formatPrice = (val) => {
    if (val === undefined || val === null) return '₹0';
    return `₹${Number(val).toLocaleString('en-IN')}`;
  };

  const getVehicleImage = (categoryName, makeName) => {
    const cat = (categoryName || '').toLowerCase();
    const mk = (makeName || '').toLowerCase();

    if (mk.includes('ford') || cat.includes('truck')) {
      return 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&q=80';
    }
    if (mk.includes('tesla') || mk.includes('rivian') || cat.includes('electric')) {
      return 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=600&q=80';
    }
    if (mk.includes('toyota') || cat.includes('suv')) {
      return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('coupe') || mk.includes('chevrolet') || mk.includes('mustang')) {
      return 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80';
    }
    return 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=600&q=80';
  };

  const imageUrl = getVehicleImage(category, make);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-slate-700 transition-all flex flex-col justify-between group text-slate-100">
      
      {/* Top Media Container */}
      <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
        
        {/* Vehicle Image */}
        <img
          src={imageUrl}
          alt={`${make} ${model}`}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            isOutOfStock ? 'grayscale opacity-40' : ''
          }`}
        />

        {/* Dark subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40 pointer-events-none"></div>

        {/* Category Tag (Top Left) */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-900/90 backdrop-blur-md text-slate-200 border border-slate-700/80 shadow-md">
            {category || 'Vehicle'}
          </span>
        </div>

      </div>

      {/* Card Body Content */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">{year}</span>
            
            {/* Stock Pill Badge */}
            <span
              className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                isOutOfStock
                  ? 'bg-red-500/10 text-red-400 border-red-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}
            >
              {isOutOfStock ? 'Out of Stock' : `${quantity} in stock`}
            </span>
          </div>

          {/* Vehicle Title */}
          <h3 className="text-lg font-extrabold text-white mt-1 group-hover:text-blue-400 transition-colors">
            {make} {model}
          </h3>

          {/* Price & VIN */}
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">MSRP</span>
              <span className="text-xl font-black text-white">{formatPrice(price)}</span>
            </div>
            {vin && (
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">VIN</span>
                <span className="text-xs font-mono text-slate-400">{vin}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls Area */}
        <div className="space-y-2.5 pt-2">
          
          {/* Admin Management Toolbar */}
          {isAdmin && (
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800">
              <button
                type="button"
                onClick={() => onEdit && onEdit(vehicle)}
                className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700/80 text-amber-400 hover:text-amber-300 border border-slate-700/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all shadow-xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                type="button"
                onClick={() => onRestock && onRestock(vehicle)}
                className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700/80 text-emerald-400 hover:text-emerald-300 border border-slate-700/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all shadow-xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Restock
              </button>
              <button
                type="button"
                onClick={() => onDelete && onDelete(vehicle)}
                className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700/80 text-red-400 hover:text-red-300 border border-slate-700/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all shadow-xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}

          {/* Primary Purchase Button */}
          <button
            type="button"
            onClick={() => onPurchase && onPurchase(vehicle)}
            disabled={isOutOfStock || !isAuthenticated}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all shadow-md ${
              isOutOfStock
                ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-800 shadow-none'
                : !isAuthenticated
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700/80'
                : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-blue-600/20 hover:shadow-blue-600/30'
            }`}
          >
            {isOutOfStock
              ? 'Out of Stock'
              : !isAuthenticated
              ? 'Login to Purchase'
              : 'Purchase'}
          </button>
        </div>

      </div>

    </div>
  );
}

export default VehicleCard;
