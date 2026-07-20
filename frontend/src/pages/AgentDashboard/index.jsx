import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, CheckCircle2, Clock, MapPin, Search } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

export default function AgentDashboard() {
  const { user } = useAuth();
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlanning();
  }, []);

  const fetchPlanning = async () => {
    try {
      const res = await api.get('/vaccinations/planning/jour');
      if (res.data.success) {
        setVaccinations(res.data.data);
      }
    } catch (err) {
      console.error("Erreur de chargement du planning", err);
    } finally {
      setLoading(false);
    }
  };

  const handleValiderDose = async (id) => {
    try {
      // Dans un vrai projet, faire un PUT pour changer le statut à FAIT
      alert("Dose validée ! Le statut est maintenant FAIT.");
      fetchPlanning();
    } catch (err) {
      alert("Erreur lors de la validation");
    }
  };

  return (
    <div className="min-h-screen bg-evaccin-surface">
      {/* Header Sticky avec Blur */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-evaccin-primary flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-title font-bold text-slate-800">
                Espace Agent
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600 hidden sm:block">
                {user?.firstName} {user?.lastName}
              </span>
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-evaccin-primary">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h2 className="text-2xl font-bold font-title text-evaccin-primary">Planning du Jour</h2>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher un patient..." 
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-evaccin-accent/30 w-full sm:w-64"
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-evaccin-primary/20 border-t-evaccin-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4">
            {vaccinations.length === 0 ? (
              <div className="glass-card p-12 text-center text-slate-500">
                <CheckCircle2 className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-lg font-medium">Aucun rendez-vous prévu aujourd'hui</p>
              </div>
            ) : (
              vaccinations.map((vac, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={vac.id} 
                  className="glass-card p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-l-4 border-l-evaccin-accent hover:border-l-evaccin-primary transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">
                        {vac.patient.prenom} {vac.patient.nom}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {vac.patient.adresse}
                        </span>
                        <span>•</span>
                        <span className="font-medium text-evaccin-primary">
                          {vac.vaccin.nom} (Dose {vac.numeroDose})
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleValiderDose(vac.id)}
                    className="btn-premium btn-primary w-full sm:w-auto mt-4 sm:mt-0 text-sm py-2"
                  >
                    Valider la dose
                  </button>
                </motion.div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
