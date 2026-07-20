import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Calendar, MapPin, Phone, Printer, Plus, ChevronLeft, 
  CheckCircle, AlertCircle, Clock, ArrowRight, Shield
} from 'lucide-react';
import { patientService } from '../../services/patientService';
import { vaccinationService } from '../../services/vaccinationService';
import PageTransition from '../../components/animations/PageTransition';
import GlassCard from '../../components/animations/GlassCard';
import StatusBadge from '../../components/animations/StatusBadge';
import RippleButton from '../../components/animations/RippleButton';
import Skeleton from '../../components/animations/Skeleton';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, vRes] = await Promise.all([
          patientService.getPatient(id),
          vaccinationService.getVaccinsPatient(id)
        ]);
        setPatient(pRes.data || pRes);
        setVaccinations(vRes.data || vRes);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-12"><Skeleton variant="card" /></div>;
  if (!patient) return <div className="p-12 text-center">Patient non trouvé</div>;

  return (
    <PageTransition>
      <div className="min-h-screen p-6 lg:p-12 max-w-7xl mx-auto space-y-8">
        
        {/* Navigation & Actions */}
        <div className="flex justify-between items-center">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 font-bold hover:text-evaccin-primary transition-colors">
            <ChevronLeft size={20} /> Retour à la liste
          </button>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-2 border-2 border-gray-200 rounded-full font-bold hover:bg-gray-50 transition-all text-sm print:hidden">
              <Printer size={18} /> Imprimer le carnet
            </button>
            <RippleButton onClick={() => navigate('/vaccinations/new')} className="!py-2 !px-6 !text-sm print:hidden">
              <Plus size={18} /> Nouvelle Vaccination
            </RippleButton>
          </div>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <GlassCard className="lg:col-span-2 flex flex-col md:flex-row items-center md:items-start gap-8 p-10 bg-gradient-to-br from-white to-evaccin-surface">
            <div className="w-32 h-32 bg-gradient-to-tr from-evaccin-primary to-evaccin-accent rounded-3xl flex items-center justify-center text-white text-5xl font-heading font-bold shadow-lg">
              {patient.prenom[0]}{patient.nom[0]}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                <h1 className="text-4xl font-heading font-bold text-evaccin-primary">{patient.prenom} {patient.nom}</h1>
                <div className="flex gap-2 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-evaccin-success/10 text-evaccin-success rounded-full text-[10px] font-bold uppercase tracking-wider">Dossier Actif</span>
                  <span className="px-3 py-1 bg-evaccin-accent/10 text-evaccin-accent rounded-full text-[10px] font-bold uppercase tracking-wider">{patient.codePatient}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Âge / Sexe</p>
                  <p className="font-bold text-evaccin-primary">{patient.sexe === 'M' ? 'Masculin' : 'Féminin'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date Naissance</p>
                  <p className="font-bold text-evaccin-primary">{new Date(patient.dateNaissance).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Localisation</p>
                  <p className="font-bold text-evaccin-primary truncate">{patient.adresse}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact Parent</p>
                  <p className="font-bold text-evaccin-primary">+221 {patient.telephoneParent}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="bg-evaccin-primary text-white flex flex-col justify-between p-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Clock size={20} className="text-evaccin-accent" />
              </div>
              <h3 className="font-bold uppercase text-xs tracking-widest text-white/60">Prochain Rappel</h3>
            </div>
            <div className="my-6">
              <p className="text-3xl font-heading font-bold">Penta-2</p>
              <p className="text-white/60 mt-1">Prévu pour le 07/04/2026</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold bg-white/5 p-3 rounded-xl border border-white/10">
              <AlertCircle size={16} className="text-evaccin-warning" />
              Dans 44 jours (J-44)
            </div>
          </GlassCard>
        </div>

        {/* Timeline & Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Timeline */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-2xl font-heading font-bold text-evaccin-primary flex items-center gap-3">
              <Shield className="text-evaccin-accent" size={24} />
              Chronologie du Carnet Vaccinal
            </h2>

            <GlassCard className="p-10 relative overflow-x-auto min-h-[300px] flex items-center">
              <div className="relative w-full h-1 bg-gray-100 rounded-full min-w-[800px]">
                {/* SVG Progress Line */}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '60%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute top-0 left-0 h-full bg-evaccin-accent rounded-full"
                ></motion.div>

                {/* Nodes */}
                {[
                  { label: 'Naissance', date: '12/01', status: 'fait', pos: '0%' },
                  { label: 'BCG', date: '12/01', status: 'fait', pos: '15%' },
                  { label: 'VPO-0', date: '12/01', status: 'fait', pos: '30%' },
                  { label: 'Penta-1', date: '24/02', status: 'fait', pos: '45%' },
                  { label: 'VPO-1', date: '24/02', status: 'retard', pos: '60%' },
                  { label: 'Penta-2', date: '07/04', status: 'a_faire', pos: '75%' },
                  { label: 'VAR', date: '12/09', status: 'planifie', pos: '90%' },
                ].map((node, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ left: node.pos }}
                    className="absolute -top-3 flex flex-col items-center -translate-x-1/2 group"
                  >
                    <div className={`w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center transition-all group-hover:scale-125 z-10 ${
                      node.status === 'fait' ? 'bg-evaccin-success' : 
                      node.status === 'retard' ? 'bg-evaccin-danger animate-pulse' : 
                      node.status === 'a_faire' ? 'bg-evaccin-accent' : 'bg-gray-300'
                    }`}>
                      {node.status === 'fait' && <CheckCircle size={14} className="text-white" />}
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-[10px] font-bold text-gray-500 uppercase">{node.label}</p>
                      <p className="text-xs font-mono font-bold text-evaccin-primary">{node.date}</p>
                    </div>

                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-6 hidden group-hover:block bg-evaccin-primary text-white p-3 rounded-xl text-[10px] w-32 shadow-xl z-20">
                      <p className="font-bold mb-1">{node.label}</p>
                      <p className="opacity-60">Status: {node.status.toUpperCase()}</p>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-evaccin-primary"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* List Table */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-evaccin-primary">Historique des administrations</h3>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-evaccin-surface border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vaccin</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dose</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lot</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {vaccinations.length > 0 ? vaccinations.map((v, idx) => (
                      <motion.tr 
                        key={v.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-evaccin-accent/10 rounded-lg flex items-center justify-center text-evaccin-accent font-bold text-[10px]">
                              {v.vaccinAbreviation}
                            </div>
                            <span className="font-bold text-evaccin-primary">{v.vaccinNom}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-500">Dose {v.numDose}</td>
                        <td className="px-6 py-4 text-sm font-medium">{new Date(v.dateAdmin).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-400">{v.lot}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex">
                            <StatusBadge status="fait" />
                          </div>
                        </td>
                      </motion.tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                          Aucune vaccination enregistrée pour le moment.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Side Info */}
          <div className="space-y-8">
            <GlassCard className="p-6">
              <h3 className="font-bold text-evaccin-primary mb-4 flex items-center gap-2">
                <Users size={18} className="text-evaccin-accent" />
                Détails Parentaux
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Mère</p>
                  <p className="text-sm font-bold text-evaccin-primary">{patient.nomMere || 'Non renseigné'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Père</p>
                  <p className="text-sm font-bold text-evaccin-primary">{patient.nomPere || 'Non renseigné'}</p>
                </div>
              </div>
            </GlassCard>

            <div className="p-6 bg-evaccin-warning/5 rounded-3xl border border-dashed border-evaccin-warning/30 flex flex-col items-center text-center">
              <AlertCircle size={32} className="text-evaccin-warning mb-3" />
              <p className="text-[11px] font-bold text-evaccin-warning uppercase tracking-wider mb-2">Attention Retard</p>
              <p className="text-xs text-evaccin-primary/60 leading-relaxed">
                Le vaccin <strong>VPO-1</strong> est en retard de 6 jours. Veuillez contacter les parents.
              </p>
              <RippleButton variant="outline" className="w-full mt-4 !text-xs !py-2">
                Alerter via SMS
              </RippleButton>
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default Detail;
