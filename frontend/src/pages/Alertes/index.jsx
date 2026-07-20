import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Send, CheckCircle, Clock, AlertTriangle, 
  Search, Smartphone, MessageSquare, ShieldAlert,
  Loader2, Trash2, ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/animations/PageTransition';
import GlassCard from '../../components/animations/GlassCard';
import RippleButton from '../../components/animations/RippleButton';
import Toast from '../../components/animations/Toast';

const SMSPreview = ({ alerte }) => {
  const [text, setText] = useState("");
  const fullText = `e-Vaccin: Rappel pour ${alerte.patientName}. Le vaccin ${alerte.vaccin} est prévu pour le ${alerte.datePrevue}. Veuillez vous présenter au CS Philippe Maguilene Senghor.`;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [alerte, fullText]);

  return (
    <div className="w-full max-w-[300px] bg-black rounded-[40px] p-4 border-[8px] border-gray-800 shadow-2xl relative">
      <div className="w-24 h-6 bg-gray-800 rounded-full mx-auto mb-4"></div>
      <div className="space-y-3 h-[400px] overflow-hidden flex flex-col justify-end pb-4">
        <div className="bg-[#34C759] text-white p-4 rounded-2xl rounded-br-none text-xs font-medium self-end max-w-[90%] shadow-sm">
          {text}
          <div className="mt-1 flex justify-end">
            <CheckCircle size={10} className="text-white/50" />
          </div>
        </div>
        <p className="text-[10px] text-gray-500 text-center uppercase font-bold tracking-widest mt-2">Aujourd'hui 14:32</p>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-700 rounded-full"></div>
    </div>
  );
};

const Alertes = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('retard');
  const [sending, setSending] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedAlerte, setSelectedAlerte] = useState(null);

  const alertes = [
    { id: 1, patientName: 'Moussa Diop', vaccin: 'VPO-1', datePrevue: '24/02/2026', type: 'retard', urgency: 'critique', phone: '77 450 12 34' },
    { id: 2, patientName: 'Awa Ndiaye', vaccin: 'Penta-2', datePrevue: '02/05/2026', type: 'today', urgency: 'normal', phone: '78 123 45 67' },
    { id: 3, patientName: 'Ousmane Sarr', vaccin: 'BCG', datePrevue: '12/01/2026', type: 'retard', urgency: 'critique', phone: '76 888 99 00' },
    { id: 4, patientName: 'Fatou Sow', vaccin: 'VAR', datePrevue: '15/05/2026', type: 'stock', urgency: 'warning', phone: '77 555 44 33' },
  ];

  const handleSendSMS = (alerte) => {
    setSending(alerte.id);
    setSelectedAlerte(alerte);
    setTimeout(() => {
      setSending(null);
      setToast({ message: `SMS envoyé avec succès à ${alerte.patientName} !`, type: 'success' });
    }, 2000);
  };

  const filteredAlertes = alertes.filter(a => a.type === activeTab || (activeTab === 'retard' && a.urgency === 'critique'));

  return (
    <PageTransition>
      <div className="min-h-screen p-6 lg:p-12 max-w-7xl mx-auto flex flex-col h-screen">
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 font-bold hover:text-evaccin-primary transition-colors mb-4">
              <ChevronLeft size={18} /> Dashboard
            </button>
            <h1 className="text-4xl font-heading font-bold text-evaccin-primary flex items-center gap-4">
              <Bell className="text-evaccin-danger animate-shake" size={36} />
              Centre d'Alertes PEV
            </h1>
          </div>
          
          <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
            {[
              { id: 'retard', label: 'En Retard', count: 3, color: 'text-evaccin-danger' },
              { id: 'today', label: 'Aujourd\'hui', count: 5, color: 'text-evaccin-accent' },
              { id: 'stock', label: 'Stocks', count: 2, color: 'text-evaccin-warning' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${
                  activeTab === tab.id ? 'bg-evaccin-primary text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                {tab.label}
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  {tab.count}
                </span>
                {activeTab === tab.id && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-12 overflow-hidden">
          {/* List Area */}
          <div className="lg:col-span-2 overflow-y-auto pr-4 custom-scrollbar space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredAlertes.map((alerte, idx) => (
                <motion.div
                  key={alerte.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <GlassCard className={`relative group border-l-4 ${
                    alerte.urgency === 'critique' ? 'border-l-evaccin-danger' : 
                    alerte.urgency === 'warning' ? 'border-l-evaccin-warning' : 'border-l-evaccin-accent'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg ${
                          alerte.urgency === 'critique' ? 'bg-evaccin-danger/10 text-evaccin-danger' : 'bg-evaccin-accent/10 text-evaccin-accent'
                        }`}>
                          {alerte.patientName[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-evaccin-primary text-lg">{alerte.patientName}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                              alerte.urgency === 'critique' ? 'bg-evaccin-danger text-white animate-pulse' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {alerte.urgency === 'critique' ? 'Urgent' : 'Planifié'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                            <span className="flex items-center gap-1"><ShieldAlert size={14} /> {alerte.vaccin}</span>
                            <span className="flex items-center gap-1"><Clock size={14} /> Prévu: {alerte.datePrevue}</span>
                            <span className="flex items-center gap-1 text-evaccin-primary"><Smartphone size={14} /> {alerte.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleSendSMS(alerte)}
                          disabled={sending === alerte.id}
                          className="w-12 h-12 bg-evaccin-success/10 text-evaccin-success rounded-xl flex items-center justify-center hover:bg-evaccin-success hover:text-white transition-all shadow-sm"
                        >
                          {sending === alerte.id ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                        </button>
                        <button className="w-12 h-12 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center hover:bg-evaccin-primary hover:text-white transition-all shadow-sm">
                          <CheckCircle size={20} />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* SMS Simulation Area */}
          <div className="hidden lg:flex flex-col items-center justify-center bg-gray-50 rounded-[48px] p-12 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-10 left-10 flex items-center gap-3 opacity-20">
              <MessageSquare size={32} />
              <span className="font-heading font-bold text-2xl uppercase tracking-tighter">SMS Engine v2.0</span>
            </div>
            
            <AnimatePresence mode="wait">
              {selectedAlerte ? (
                <motion.div
                  key={selectedAlerte.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center"
                >
                  <SMSPreview alerte={selectedAlerte} />
                  <p className="mt-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Aperçu temps réel</p>
                </motion.div>
              ) : (
                <div className="text-center text-gray-300">
                  <Smartphone size={100} className="mx-auto mb-6 opacity-10" />
                  <p className="font-bold text-sm uppercase tracking-widest">Sélectionnez une alerte <br/>pour simuler le SMS</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Alertes;
