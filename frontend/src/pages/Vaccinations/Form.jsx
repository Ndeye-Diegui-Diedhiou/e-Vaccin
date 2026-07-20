import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Database, Check, AlertCircle, Calendar, Hash, FileText, ChevronRight, Loader2, Info } from 'lucide-react';
import { patientService } from '../../services/patientService';
import { vaccinationService } from '../../services/vaccinationService';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/animations/PageTransition';
import GlassCard from '../../components/animations/GlassCard';
import RippleButton from '../../components/animations/RippleButton';
import Toast from '../../components/animations/Toast';
import Skeleton from '../../components/animations/Skeleton';

const VaccinationForm = () => {
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  const [vaccins, setVaccins] = useState([]);
  const [selectedVaccin, setSelectedVaccin] = useState(null);
  const [formData, setFormData] = useState({
    numDose: 1,
    dateAdmin: new Date().toISOString().split('T')[0],
    lot: '',
    remarques: ''
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  // Simulation search patients
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setSearching(true);
        try {
          const res = await patientService.searchPatients(searchQuery);
          setSearchResults(res.data || []);
        } catch (e) {
          setSearchResults([]);
        } finally {
          setSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Load vaccins
  useEffect(() => {
    const load = async () => {
      try {
        const res = await vaccinationService.getVaccins();
        setVaccins(res.data || []);
      } catch (e) {}
    };
    load();
  }, []);

  const handleSelectPatient = (p) => {
    setSelectedPatient(p);
    setStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await vaccinationService.enregistrerVaccination({
        patientId: selectedPatient.id,
        vaccinId: selectedVaccin.id,
        ...formData
      });
      setToast({ message: 'Vaccination enregistrée avec succès !', type: 'success' });
      setTimeout(() => navigate(`/patients/${selectedPatient.id}`), 2000);
    } catch (err) {
      setToast({ message: err.message || "Erreur lors de l'enregistrement", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen p-6 lg:p-12 max-w-5xl mx-auto">
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        
        <div className="mb-10">
          <h1 className="text-3xl font-heading font-bold text-evaccin-primary">Nouvelle Vaccination</h1>
          <p className="text-gray-500">Enregistrement d'une administration de dose PEV</p>
        </div>

        {/* Selected Patient Floating Badge */}
        <AnimatePresence>
          {selectedPatient && (
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-8 flex items-center justify-between bg-evaccin-primary text-white p-4 rounded-2xl shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  {selectedPatient.prenom[0]}{selectedPatient.nom[0]}
                </div>
                <div>
                  <h3 className="font-bold">{selectedPatient.prenom} {selectedPatient.nom}</h3>
                  <p className="text-xs text-white/60 font-mono">{selectedPatient.codePatient}</p>
                </div>
              </div>
              <button 
                onClick={() => { setSelectedPatient(null); setStep(1); }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-colors"
              >Changer</button>
            </motion.div>
          )}
        </AnimatePresence>

        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GlassCard className="max-w-2xl mx-auto overflow-hidden">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  className="form-input-medical pl-12 py-4" 
                  placeholder="Rechercher un enfant (Nom, Prénom ou Code PEV)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {searching ? (
                  <Skeleton variant="row" />
                ) : searchResults.length > 0 ? (
                  searchResults.map((p, idx) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleSelectPatient(p)}
                      className="flex items-center justify-between p-4 bg-gray-50 hover:bg-evaccin-accent/5 rounded-xl cursor-pointer border border-transparent hover:border-evaccin-accent/20 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-evaccin-primary/10 text-evaccin-primary rounded-full flex items-center justify-center font-bold group-hover:bg-evaccin-accent group-hover:text-white transition-colors">
                          {p.prenom[0]}{p.nom[0]}
                        </div>
                        <div>
                          <p className="font-bold text-evaccin-primary">{p.prenom} {p.nom}</p>
                          <p className="text-xs text-gray-400 font-mono">{p.codePatient}</p>
                        </div>
                      </div>
                      <ChevronRight className="text-gray-300 group-hover:text-evaccin-accent" size={20} />
                    </motion.div>
                  ))
                ) : searchQuery.length > 2 ? (
                  <div className="text-center py-10 text-gray-400">
                    <AlertCircle className="mx-auto mb-2 opacity-20" size={48} />
                    <p>Aucun patient trouvé pour "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    <User className="mx-auto mb-2 opacity-10" size={48} />
                    <p className="text-sm">Veuillez saisir au moins 3 caractères</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Vaccin Selection */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Database size={24} className="text-evaccin-accent" />
                Sélection du Vaccin
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {vaccins.map((v) => (
                  <motion.div
                    key={v.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedVaccin(v)}
                    className={`p-4 rounded-2xl cursor-pointer border-2 transition-all relative ${
                      selectedVaccin?.id === v.id 
                        ? 'bg-evaccin-accent/10 border-evaccin-accent shadow-accent-glow' 
                        : 'bg-white border-transparent shadow-sm'
                    } ${v.stock === 0 ? 'opacity-50 grayscale pointer-events-none' : ''}`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${selectedVaccin?.id === v.id ? 'bg-evaccin-accent text-white' : 'bg-evaccin-accent/10 text-evaccin-accent'}`}>
                        <span className="font-bold text-xs">{v.abreviation}</span>
                      </div>
                      <p className="font-bold text-sm text-evaccin-primary truncate w-full">{v.nom}</p>
                      <div className="mt-2 flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${v.stock > 10 ? 'bg-evaccin-success' : v.stock > 0 ? 'bg-evaccin-warning' : 'bg-evaccin-danger'}`}></div>
                        <span className="text-[10px] font-bold text-gray-400">Stock: {v.stock}</span>
                      </div>
                    </div>
                    {selectedVaccin?.id === v.id && (
                      <motion.div layoutId="check" className="absolute -top-2 -right-2 bg-evaccin-accent text-white rounded-full p-1 border-2 border-white shadow-lg">
                        <Check size={14} />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Administration Details */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText size={24} className="text-evaccin-accent" />
                Détails
              </h2>

              <GlassCard className="space-y-5">
                <div className="space-y-1.5">
                  <label className="label-medical">Dose N°</label>
                  <select 
                    className="form-input-medical"
                    value={formData.numDose}
                    onChange={(e) => setFormData({...formData, numDose: parseInt(e.target.value)})}
                  >
                    <option value={1}>Dose 1 (Initiale)</option>
                    <option value={2}>Dose 2 (Rappel)</option>
                    <option value={3}>Dose 3 (Rappel)</option>
                    <option value={4}>Rappel Unique</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="label-medical">Date d'administration</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="date"
                      className="form-input-medical pl-12" 
                      value={formData.dateAdmin}
                      onChange={(e) => setFormData({...formData, dateAdmin: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="label-medical">Numéro de Lot</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      className="form-input-medical pl-12" 
                      placeholder="Ex: BN4502"
                      value={formData.lot}
                      onChange={(e) => setFormData({...formData, lot: e.target.value})}
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
                  <Info className="text-blue-500 shrink-0" size={20} />
                  <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                    En validant, le carnet de l'enfant sera mis à jour et le prochain rappel sera planifié automatiquement.
                  </p>
                </div>

                <RippleButton 
                  className="w-full mt-4" 
                  disabled={!selectedVaccin || !formData.lot || loading}
                  onClick={handleSubmit}
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Enregistrer l'acte"}
                </RippleButton>
              </GlassCard>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default VaccinationForm;
