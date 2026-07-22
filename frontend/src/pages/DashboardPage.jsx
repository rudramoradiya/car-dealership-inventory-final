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
import { useAuth } from '../context/AuthContext.jsx';

export function DashboardPage() {
  const { token, isAdmin } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

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

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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
      showToast(res.message || `Successfully purchased ${vehicle.make} ${vehicle.model}!`);
      fetchVehicles();
    } catch (err) {
      setError(err.message || 'Purchase failed');
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
      showToast(`${vehicle.make} ${vehicle.model} deleted successfully.`);
      fetchVehicles();
    } catch (err) {
      setError(err.message || 'Failed to delete vehicle');
    }
  };

  const handleFormSubmit = async (vehicleData) => {
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle._id, vehicleData, token);
        showToast('Vehicle updated successfully!');
      } else {
        await createVehicle(vehicleData, token);
        showToast('New vehicle created successfully!');
      }
      setIsFormModalOpen(false);
      fetchVehicles();
    } catch (err) {
      setError(err.message || 'Failed to save vehicle');
    }
  };

  const handleRestockSubmit = async (amount) => {
    try {
      await restockVehicle(restockingVehicle._id, amount, token);
      showToast(`Restocked ${amount} units for ${restockingVehicle.make} ${restockingVehicle.model}!`);
      setIsRestockModalOpen(false);
      fetchVehicles();
    } catch (err) {
      setError(err.message || 'Failed to restock vehicle');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl font-medium border border-emerald-400 animate-bounce">
          {toastMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Vehicle Inventory</h1>
          <p className="mt-1 text-slate-400">Explore available dealership inventory in real time</p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl shadow-lg transition-colors"
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
