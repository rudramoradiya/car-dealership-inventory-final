import { useState } from 'react';

export function VehicleSearchFilter({ onSearch, onReset }) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ make, model, category, minPrice, maxPrice });
  };

  const handleReset = () => {
    setMake('');
    setModel('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    onReset();
  };

  const categories = [
    { label: 'All', value: '' },
    { label: 'SUV', value: 'suv' },
    { label: 'Sedan', value: 'sedan' },
    { label: 'Truck', value: 'truck' },
    { label: 'Electric', value: 'electric' },
    { label: 'Coupe', value: 'coupe' },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6 shadow-xl text-slate-100">
      
      {/* Header Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Filter Inventory
        </h2>
        <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
          Live Search
        </span>
      </div>

      <div className="space-y-4">

        {/* Make Filter Input & Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Make</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Model Filter Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Model</label>
          <input
            type="text"
            placeholder="Search model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Category Pills & Dropdown */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold text-slate-300">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-[11px] bg-transparent text-blue-400 focus:outline-none border-none cursor-pointer"
            >
              <option value="" className="bg-slate-900 text-white">All Categories</option>
              <option value="sedan" className="bg-slate-900 text-white">Sedan</option>
              <option value="suv" className="bg-slate-900 text-white">SUV</option>
              <option value="truck" className="bg-slate-900 text-white">Truck</option>
              <option value="electric" className="bg-slate-900 text-white">Electric</option>
              <option value="coupe" className="bg-slate-900 text-white">Coupe</option>
              <option value="convertible" className="bg-slate-900 text-white">Convertible</option>
              <option value="van" className="bg-slate-900 text-white">Van</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {categories.map((cat) => {
              const isActive = category.toLowerCase() === cat.value.toLowerCase();
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/80'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range Filter Inputs */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold text-slate-300">Price Range</label>
            <span className="text-[11px] font-mono text-blue-400 font-semibold">
              {minPrice ? `₹${Number(minPrice).toLocaleString('en-IN')}` : '₹0'} - {maxPrice ? `₹${Number(maxPrice).toLocaleString('en-IN')}` : 'Any'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Min (₹)</span>
              <input
                type="number"
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Max (₹)</span>
              <input
                type="number"
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Filter Actions Buttons */}
      <div className="pt-4 border-t border-slate-800 flex items-center space-x-2">
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 py-2 px-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-xl transition-all text-center"
        >
          Reset
        </button>
        <button
          type="submit"
          className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-600/20 text-center"
        >
          Search
        </button>
      </div>

    </form>
  );
}

export default VehicleSearchFilter;
