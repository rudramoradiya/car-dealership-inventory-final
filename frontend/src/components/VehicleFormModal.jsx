import { useState, useEffect } from 'react';

export function VehicleFormModal({ isOpen, vehicle, onClose, onSubmit }) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('sedan');

  useEffect(() => {
    if (vehicle) {
      setMake(vehicle.make || '');
      setModel(vehicle.model || '');
      setYear(vehicle.year || '');
      setPrice(vehicle.price || '');
      setQuantity(vehicle.quantity !== undefined ? vehicle.quantity : '');
      setCategory(vehicle.category || 'sedan');
    } else {
      setMake('');
      setModel('');
      setYear('');
      setPrice('');
      setQuantity('');
      setCategory('sedan');
    }
  }, [vehicle, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      make,
      model,
      year: Number(year),
      price: Number(price),
      quantity: Number(quantity),
      category: category.toLowerCase(),
    });
  };

  return (
    <div className="fixed -inset-10 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4 text-slate-100 relative">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">
              {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Fill in the vehicle details below to create a new listing.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors text-base"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="make" className="block text-xs font-semibold text-slate-300 mb-1">
                Make
              </label>
              <input
                id="make"
                type="text"
                required
                placeholder="e.g. Toyota"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="model" className="block text-xs font-semibold text-slate-300 mb-1">
                Model
              </label>
              <input
                id="model"
                type="text"
                required
                placeholder="e.g. Land Cruiser"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label htmlFor="year" className="block text-xs font-semibold text-slate-300 mb-1">
                Year
              </label>
              <input
                id="year"
                type="number"
                required
                min="1900"
                max="2100"
                placeholder="2024"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-xs font-semibold text-slate-300 mb-1">
                Price (₹)
              </label>
              <input
                id="price"
                type="number"
                required
                min="0"
                placeholder="85000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-xs font-semibold text-slate-300 mb-1">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                required
                min="0"
                placeholder="4"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-xs font-semibold text-slate-300 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="truck">Truck</option>
              <option value="coupe">Coupe</option>
              <option value="convertible">Convertible</option>
              <option value="van">Van</option>
              <option value="electric">Electric</option>
            </select>
          </div>

          {/* Actions */}
          <div className="pt-3 flex justify-end space-x-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-600/20"
            >
              {vehicle ? 'Save Changes' : 'Create Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VehicleFormModal;
