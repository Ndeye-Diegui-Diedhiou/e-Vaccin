import api from './api';

export const rapportService = {
  getKPIs: (periode) => api.get(`/rapports/kpi?periode=${periode}`),
  
  getCouvertureParVaccin: () => api.get('/rapports/couverture'),
  
  getEvolutionMensuelle: (mois = 6) => api.get(`/rapports/evolution?mois=${mois}`),
  
  exportPDF: (params) => api.get('/rapports/export/pdf', { params, responseType: 'blob' }),
  
  exportExcel: (params) => api.get('/rapports/export/excel', { params, responseType: 'blob' }),
};
