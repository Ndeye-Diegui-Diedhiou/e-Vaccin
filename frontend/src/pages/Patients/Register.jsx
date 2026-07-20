import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, CheckCircle, ArrowRight, ArrowLeft, Calendar, MapPin, Phone, ShieldCheck, Loader2 } from 'lucide-react';
import { patientService } from '../../services/patientService';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/animations/PageTransition';
import GlassCard from '../../components/animations/GlassCard';
import RippleButton from '../../components/animations/RippleButton';
import Toast from '../../components/animations/Toast';
import confetti from 'canvas-confetti';

const STEPS = ["Identité", "Parents", "Confirmation"];

const Register = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    dateNaissance: '',
    sexe: 'M',
    adresse: '',
    nomPere: '',
    nomMere: '',
    telephoneParent: '',
    codePatient: ''
  });

  const [ageDisplay, setAgeDisplay] = useState("");

  useEffect(() => {
    if (formData.dateNaissance) {
      const birth = new Date(formData.dateNaissance);
      const now = new Date();
      let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
      const years = Math.floor(months / 12);
      months = months % 12;
      
      if (years > 0) {
        setAgeDisplay(`${years} an${years > 1 ? 's' : ''} et ${months} mois`);
      } else {
        setAgeDisplay(`${months} mois`);
      }
    }
  }, [formData.dateNaissance]);

  const handleNext = () => {
    if (currentStep === 1) {
      // Simulation generation code patient
      const code = `PAT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      setFormData(prev => ({ ...prev, codePatient: code }));
    }
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await patientService.registerPatient(formData);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06D6A0', '#00B4D8', '#0A3D62']
      });
      setToast({ message: 'Patient enregistré avec succès !', type: 'success' });
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setToast({ message: err.message || "Erreur lors de l'enregistrement", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    if (currentStep === 0) return formData.nom && formData.prenom && formData.dateNaissance && formData.adresse;
    if (currentStep === 1) return (formData.nomPere || formData.nomMere) && formData.telephoneParent.length >= 9;
    return true;
  };

  return (
    <PageTransition>
      <div className="min-h-screen p-6 lg:p-12 max-w-4xl mx-auto">
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-evaccin-primary mb-2">Enregistrement Enfant</h1>
            <p className="text-gray-500">Nouveau dossier dans le Système National PEV</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-evaccin-primary/5 rounded-full border border-evaccin-primary/10">
            <ShieldCheck className="text-evaccin-primary" size={20} />
            <span className="text-sm font-bold text-evaccin-primary">Session Sécurisée</span>
          </div>
        </div>

        {/* Stepper Progress */}
        <div className="mb-12 relative flex justify-between">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
          <motion.div 
            className="absolute top-1/2 left-0 h-0.5 bg-evaccin-accent -translate-y-1/2 z-0"
            animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          ></motion.div>
          
          {STEPS.map((step, idx) => (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <motion.div
                animate={{ 
                  scale: currentStep === idx ? 1.2 : 1,
                  backgroundColor: currentStep >= idx ? '#00B4D8' : '#ffffff',
                  borderColor: currentStep >= idx ? '#00B4D8' : '#e5e7eb'
                }}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${currentStep === idx ? 'shadow-accent-glow' : ''}`}
              >
                {currentStep > idx ? <CheckCircle size={20} className="text-white" /> : <span className={`font-bold ${currentStep === idx ? 'text-white' : 'text-gray-400'}`}>{idx + 1}</span>}
              </motion.div>
              <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${currentStep >= idx ? 'text-evaccin-primary' : 'text-gray-400'}`}>{step}</span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 0 && (
              <GlassCard className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="label-medical">Prénom</label>
                    <input 
                      className="form-input-medical" 
                      value={formData.prenom}
                      onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                      placeholder="Ex: Moussa" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="label-medical">Nom de famille</label>
                    <input 
                      className="form-input-medical" 
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                      placeholder="Ex: Diop" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="label-medical">Date de Naissance</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        type="date"
                        className="form-input-medical pl-12" 
                        value={formData.dateNaissance}
                        onChange={(e) => setFormData({...formData, dateNaissance: e.target.value})}
                      />
                    </div>
                    {ageDisplay && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-xs font-bold text-evaccin-accent">
                        Âge calculé : {ageDisplay}
                      </motion.div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="label-medical">Sexe</label>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                      <button 
                        onClick={() => setFormData({...formData, sexe: 'M'})}
                        className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${formData.sexe === 'M' ? 'bg-white text-evaccin-primary shadow-sm' : 'text-gray-400'}`}
                      >Masculin</button>
                      <button 
                        onClick={() => setFormData({...formData, sexe: 'F'})}
                        className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${formData.sexe === 'F' ? 'bg-white text-evaccin-primary shadow-sm' : 'text-gray-400'}`}
                      >Féminin</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="label-medical">Adresse Résidentielle</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-gray-400" size={20} />
                    <textarea 
                      className="form-input-medical pl-12 h-24 pt-3 resize-none" 
                      placeholder="Adresse complète (Quartier, Ville)..."
                      value={formData.adresse}
                      onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                    ></textarea>
                  </div>
                </div>
              </GlassCard>
            )}

            {currentStep === 1 && (
              <GlassCard className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="label-medical">Nom du Père</label>
                    <input 
                      className="form-input-medical" 
                      value={formData.nomPere}
                      onChange={(e) => setFormData({...formData, nomPere: e.target.value})}
                      placeholder="Nom complet" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="label-medical">Nom de la Mère</label>
                    <input 
                      className="form-input-medical" 
                      value={formData.nomMere}
                      onChange={(e) => setFormData({...formData, nomMere: e.target.value})}
                      placeholder="Nom complet" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="label-medical">Numéro de Téléphone (SMS Alertes)</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-500 font-bold">
                      <Phone size={18} />
                      <span>+221</span>
                    </div>
                    <input 
                      className="form-input-medical pl-20" 
                      value={formData.telephoneParent}
                      onChange={(e) => setFormData({...formData, telephoneParent: e.target.value})}
                      placeholder="77 000 00 00" 
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight px-1">Ce numéro recevra les rappels de vaccination par SMS.</p>
                </div>

                <div className="p-6 bg-evaccin-primary/5 rounded-2xl border border-dashed border-evaccin-primary/20 flex flex-col items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase mb-2">Code Patient Généré</span>
                  <span className="text-2xl font-mono font-bold text-evaccin-primary tracking-widest">
                    {formData.codePatient || "— — — — —"}
                  </span>
                </div>
              </GlassCard>
            )}

            {currentStep === 2 && (
              <GlassCard className="p-8">
                <div className="flex flex-col items-center mb-8">
                  <div className="w-20 h-20 bg-evaccin-success/10 rounded-full flex items-center justify-center text-evaccin-success mb-4">
                    <CheckCircle size={48} />
                  </div>
                  <h2 className="text-xl font-bold">Vérification des informations</h2>
                  <p className="text-gray-500 text-sm">Veuillez confirmer avant l'enregistrement final</p>
                </div>

                <div className="space-y-4 bg-gray-50 p-6 rounded-2xl">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-400 font-bold text-xs uppercase">Enfant</span>
                    <span className="font-bold text-evaccin-primary">{formData.prenom} {formData.nom}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-400 font-bold text-xs uppercase">Naissance</span>
                    <span className="font-bold text-evaccin-primary">{formData.dateNaissance} ({ageDisplay})</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-400 font-bold text-xs uppercase">Parents</span>
                    <span className="font-bold text-evaccin-primary">{formData.nomMere || formData.nomPere}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-bold text-xs uppercase">Contact</span>
                    <span className="font-bold text-evaccin-primary">+221 {formData.telephoneParent}</span>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Actions */}
            <div className="mt-8 flex justify-between">
              <button 
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 font-bold transition-opacity ${currentStep === 0 ? 'opacity-0' : 'opacity-100'}`}
              >
                <ArrowLeft size={20} /> Précédent
              </button>

              {currentStep < STEPS.length - 1 ? (
                <RippleButton 
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className={!isStepValid() ? 'opacity-40 grayscale pointer-events-none' : ''}
                >
                  Suivant <ArrowRight size={20} />
                </RippleButton>
              ) : (
                <RippleButton 
                  variant="accent"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Confirmer l'enregistrement"}
                </RippleButton>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default Register;
