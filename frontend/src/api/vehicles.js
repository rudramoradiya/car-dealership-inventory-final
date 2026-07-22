import { apiRequest } from './client.js';

export function listVehicles() {
  return apiRequest('/vehicles');
}

export function searchVehicles(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
  ).toString();

  const path = query ? `/vehicles/search?${query}` : '/vehicles/search';
  return apiRequest(path);
}

export function createVehicle(vehicle, token) {
  return apiRequest('/vehicles', { method: 'POST', body: vehicle, token });
}

export function updateVehicle(id, updates, token) {
  return apiRequest(`/vehicles/${id}`, { method: 'PUT', body: updates, token });
}

export function deleteVehicle(id, token) {
  return apiRequest(`/vehicles/${id}`, { method: 'DELETE', token });
}

export function purchaseVehicle(id, token) {
  return apiRequest(`/vehicles/${id}/purchase`, { method: 'POST', token });
}

export function restockVehicle(id, amount, token) {
  return apiRequest(`/vehicles/${id}/restock`, {
    method: 'POST',
    body: { amount },
    token,
  });
}
