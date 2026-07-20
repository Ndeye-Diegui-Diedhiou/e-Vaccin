import api from './api';

export const vaccinationService = {
  getVaccins: () => api.get('/vaccins'),
  
  getVaccinsPatient: (patientId) => api.get(`/patients/${patientId}/vaccinations`),
  
  enregistrerVaccination: (data) => api.post('/vaccinations', data),
  
  getVaccinationsAujourdhui: () => api.get('/vaccinations/today'),
  
  annulerVaccination: (id, motif) => api.put(`/vaccinations/${id}/annuler`, { motif }),
  
  getStats: () => api.get('/vaccinations/stats'),
};
