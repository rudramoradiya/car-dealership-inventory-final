import { useEffect, useState } from 'react';
import {
  createVehicle,
  deleteVehicle,
  listVehicles,
  purchaseVehicle,
  restockVehicle,
  searchVehicles,
  updateVehicle,
} from '../api/vehicles.js';
import VehicleCard from '../components/VehicleCard.jsx';
import VehicleSearchFilter from '../components/VehicleSearchFilter.jsx';
import VehicleFormModal from '../components/VehicleFormModal.jsx';
import RestockModal from '../components/RestockModal.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import Toast from '../components/Toast.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function DashboardPage() {
  const { token, isAdmin } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastConfig, setToastConfig] = useState({ message: null, type: 'success' });

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [restockingVehicle, setRestockingVehicle] = useState(null);

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

  const showToast = (message, type = 'success') => {
    setToastConfig({ message, type });
  };

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

  const handlePurchase = async (vehicle) => {
    try {
      const res = await purchaseVehicle(vehicle._id, token);
      showToast(res.message || `Successfully purchased ${vehicle.make} ${vehicle.model}!`, 'success');
      fetchVehicles();
    } catch (err) {
      showToast(err.message || 'Purchase failed', 'error');
    }
  };

  // Admin Actions
  const handleOpenAddModal = () => {
    setEditingVehicle(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormModalOpen(true);
  };

  const handleOpenRestockModal = (vehicle) => {
    setRestockingVehicle(vehicle);
    setIsRestockModalOpen(true);
  };

  const handleDeleteVehicle = async (vehicle) => {
    if (!window.confirm(`Are you sure you want to delete ${vehicle.make} ${vehicle.model}?`)) {
      return;
    }

    try {
      await deleteVehicle(vehicle._id, token);
      showToast(`${vehicle.make} ${vehicle.model} deleted successfully.`, 'success');
      fetchVehicles();
    } catch (err) {
      showToast(err.message || 'Failed to delete vehicle', 'error');
    }
  };

  const handleFormSubmit = async (vehicleData) => {
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle._id, vehicleData, token);
        showToast('Vehicle updated successfully!', 'success');
      } else {
        await createVehicle(vehicleData, token);
        showToast('New vehicle created successfully!', 'success');
      }
      setIsFormModalOpen(false);
      fetchVehicles();
    } catch (err) {
      showToast(err.message || 'Failed to save vehicle', 'error');
    }
  };

  const handleRestockSubmit = async (amount) => {
    try {
      await restockVehicle(restockingVehicle._id, amount, token);
      showToast(`Restocked ${amount} units for ${restockingVehicle.make} ${restockingVehicle.model}!`, 'success');
      setIsRestockModalOpen(false);
      fetchVehicles();
    } catch (err) {
      showToast(err.message || 'Failed to restock vehicle', 'error');
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 py-6 space-y-6 text-slate-100">
      <Toast
        message={toastConfig.message}
        type={toastConfig.type}
        onClose={() => setToastConfig({ message: null, type: 'success' })}
      />

      {/* Main Content Layout (Sidebar + Inventory Grid) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Sidebar Filter Column */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0">
          <VehicleSearchFilter onSearch={handleSearch} onReset={handleReset} />
        </div>

        {/* Right Main Vehicle Section */}
        <div className="flex-1 w-full space-y-6">
          
          {/* Sub-Header Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">
                Showing {vehicles.length} Vehicles
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Explore available dealership inventory in real time
              </p>
            </div>

            {/* Admin Add Vehicle Button */}
            {isAdmin && (
              <div>
                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition-all"
                >
                  <span className="mr-1 text-sm font-bold">+</span> Add Vehicle
                </button>
              </div>
            )}
          </div>

          {/* Global Error Banner */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-2xl text-xs shadow-lg">
              {error}
            </div>
          )}

          {/* Catalog Grid State: Loading, Empty, or Vehicle Cards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" aria-label="Loading vehicles">
              <span className="sr-only">Loading vehicles...</span>
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
              <div className="text-5xl">🚗</div>
              <p className="text-lg font-extrabold text-white">No vehicles found</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                We couldn't find any vehicles matching your current search parameters.
              </p>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle._id}
                  vehicle={vehicle}
                  onPurchase={handlePurchase}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteVehicle}
                  onRestock={handleOpenRestockModal}
                />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Admin Modals */}
      <VehicleFormModal
        isOpen={isFormModalOpen}
        vehicle={editingVehicle}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <RestockModal
        isOpen={isRestockModalOpen}
        vehicleName={restockingVehicle ? `${restockingVehicle.make} ${restockingVehicle.model}` : ''}
        onClose={() => setIsRestockModalOpen(false)}
        onSubmit={handleRestockSubmit}
      />
    </div>
  );
}

export default DashboardPage;
