import { useEffect, useState } from 'react';
import { listVehicles, searchVehicles } from '../api/vehicles.js';
import VehicleCard from '../components/VehicleCard.jsx';
import VehicleSearchFilter from '../components/VehicleSearchFilter.jsx';

export function DashboardPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listVehicles();
      setVehicles(data.vehicles || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSearch = async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchVehicles(filters);
      setVehicles(data.vehicles || []);
    } catch (err) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    fetchVehicles();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Vehicle Inventory</h1>
          <p className="mt-1 text-slate-400">Explore available dealership inventory in real time</p>
        </div>
      </div>

      <VehicleSearchFilter onSearch={handleSearch} onReset={handleReset} />

      {error && (
        <div className="bg-red-900/40 border border-red-500/50 text-red-200 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center space-x-3 text-slate-400 font-medium">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading vehicles...</span>
          </div>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <p className="text-lg font-medium text-slate-300">No vehicles found</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
