import api from './api';

export const alerteService = {
  getAlertes: (structureId) => api.get(`/alertes?structureId=${structureId}`),
  
  getRappelsEnRetard: () => api.get('/alertes/retard'),
  
  getRappelsDuJour: () => api.get('/alertes/today'),
  
  envoyerSMS: (alerteId) => api.post(`/alertes/${alerteId}/sms`),
  
  marquerTraite: (alerteId) => api.put(`/alertes/${alerteId}/traite`),
};
