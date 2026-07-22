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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Toast
        message={toastConfig.message}
        type={toastConfig.type}
        onClose={() => setToastConfig({ message: null, type: 'success' })}
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Vehicle Inventory</h1>
          <p className="mt-1 text-slate-400">Explore available dealership inventory in real time</p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl shadow-lg transition-all hover:scale-105"
          >
            <span className="mr-2 text-lg">+</span> Add Vehicle
          </button>
        )}
      </div>

      <VehicleSearchFilter onSearch={handleSearch} onReset={handleReset} />

      {error && (
        <div className="bg-red-900/40 border border-red-500/50 text-red-200 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Loading vehicles">
          <span className="sr-only">Loading vehicles...</span>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/50 rounded-2xl border border-slate-700/50 space-y-4">
          <div className="text-4xl">🚗</div>
          <p className="text-lg font-semibold text-slate-200">No vehicles found</p>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            We couldn't find any vehicles matching your current search parameters.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
