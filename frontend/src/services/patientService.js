import api from './api';

export const patientService = {
  searchPatients: (query) => api.get(`/patients/search?q=${query}`),
  
  registerPatient: (data) => api.post('/patients', data),
  
  getPatient: (id) => api.get(`/patients/${id}`),
  
  getCarnetVaccinal: (id) => api.get(`/patients/${id}/carnet`),
  
  getAllPatients: (page = 0, size = 10) => api.get(`/patients?page=${page}&size=${size}`),
};
