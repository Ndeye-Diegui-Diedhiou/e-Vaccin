import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Phone, User, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export default function PortailParent() {
  const [codePatient, setCodePatient] = useState('');
  const [telephone, setTelephone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null); // { patient, vaccinations }

  const handleRecherche = async (e) => {
    e.preventDefault();
    if (!codePatient || !telephone) return;

    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/vaccinations/carnet', {
        params: { codePatient, telephoneParent: telephone }
      });
      if (res.data.success) {
        setData({
          patient: res.data.patient,
          vaccinations: res.data.data
        });
      }
    } catch (err) {
      setError("Carnet introuvable. Veuillez vérifier le code et le numéro de téléphone.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (statut) => {
    switch (statut) {
      case 'FAIT': return <CheckCircle2 className="w-6 h-6 text-evaccin-success" />;
      case 'EN_ATTENTE': return <Clock className="w-6 h-6 text-evaccin-warning" />;
      case 'EN_RETARD': return <AlertCircle className="w-6 h-6 text-evaccin-danger" />;
      default: return <Clock className="w-6 h-6 text-slate-400" />;
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'FAIT': return 'border-evaccin-success bg-evaccin-success/10';
      case 'EN_ATTENTE': return 'border-evaccin-warning bg-evaccin-warning/10';
      case 'EN_RETARD': return 'border-evaccin-danger bg-evaccin-danger/10';
      default: return 'border-slate-200 bg-slate-50';
    }
  };

  return (
    <div className="min-h-screen bg-evaccin-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-title text-evaccin-primary font-bold mb-4">
            Carnet Numérique
          </h1>
          <p className="text-slate-600 font-body">
            Consultez le calendrier vaccinal de votre enfant en toute simplicité
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!data ? (
            <motion.div 
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-8 max-w-md mx-auto"
            >
              <form onSubmit={handleRecherche} className="space-y-6">
                <div>
                  <label className="label-medical">Code Patient</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      className="form-input-medical pl-10"
                      placeholder="Ex: PAT-2026-001"
                      value={codePatient}
                      onChange={(e) => setCodePatient(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label-medical">Téléphone du Parent</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="tel"
                      className="form-input-medical pl-10"
                      placeholder="77 123 45 67"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-evaccin-danger/10 border border-evaccin-danger/20 text-evaccin-danger text-sm font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-premium btn-primary w-full"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Rechercher le carnet
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="carnet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-l-4 border-l-evaccin-accent">
                <div>
                  <h2 className="text-2xl font-bold font-title text-evaccin-primary">
                    {data.patient.prenom} {data.patient.nom}
                  </h2>
                  <p className="text-slate-500 font-medium">
                    Né(e) le : {new Date(data.patient.dateNaissance).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <button 
                  onClick={() => setData(null)}
                  className="text-sm font-bold text-evaccin-accent hover:text-evaccin-primary transition-colors"
                >
                  ← Changer d'enfant
                </button>
              </div>

              <div className="relative">
                {/* Ligne de temps visuelle */}
                <div className="absolute left-[39px] top-4 bottom-4 w-0.5 bg-slate-200 rounded-full hidden sm:block" />

                <div className="space-y-4">
                  {data.vaccinations.map((vac, index) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={vac.id}
                      className={`glass-card p-4 sm:p-6 flex items-start gap-4 sm:gap-6 border-l-4 ${getStatusColor(vac.statut)} relative z-10 bg-white/95`}
                    >
                      <div className="hidden sm:flex w-12 h-12 shrink-0 bg-white rounded-full items-center justify-center shadow-sm border border-slate-100">
                        {getStatusIcon(vac.statut)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h3 className="text-lg font-bold text-slate-800">
                            {vac.vaccin.nom} <span className="text-sm font-medium text-slate-500 ml-2">Dose {vac.numeroDose}</span>
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            vac.statut === 'FAIT' ? 'bg-evaccin-success/20 text-emerald-700' :
                            vac.statut === 'EN_ATTENTE' ? 'bg-evaccin-warning/20 text-amber-700' :
                            'bg-evaccin-danger/20 text-red-700'
                          }`}>
                            {vac.statut.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar className="w-4 h-4" />
                            Prévu le : <span className="font-semibold">{new Date(vac.datePrevue).toLocaleDateString('fr-FR')}</span>
                          </div>
                          {vac.dateAdministration && (
                            <div className="flex items-center gap-2 text-slate-600">
                              <CheckCircle2 className="w-4 h-4 text-evaccin-success" />
                              Fait le : <span className="font-semibold">{new Date(vac.dateAdministration).toLocaleDateString('fr-FR')}</span>
                            </div>
                          )}
                        </div>
                        
                        {vac.vaccin.maladiesCibles && (
                          <p className="mt-3 text-xs text-slate-500">
                            Protège contre : {vac.vaccin.maladiesCibles}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
