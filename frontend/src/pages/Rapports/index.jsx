import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { 
  FileText, Download, TrendingUp, Users, ShieldCheck, 
  ChevronLeft, Filter, Calendar, Map, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/animations/PageTransition';
import GlassCard from '../../components/animations/GlassCard';
import RippleButton from '../../components/animations/RippleButton';
import CountUp from '../../components/animations/CountUp';

const Rapports = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Demo Data
  const coverageData = [
    { name: 'BCG', rate: 98, color: '#06D6A0' },
    { name: 'VPO-0', rate: 95, color: '#06D6A0' },
    { name: 'Penta-1', rate: 84, color: '#FFB703' },
    { name: 'VPO-1', rate: 78, color: '#FFB703' },
    { name: 'Penta-2', rate: 45, color: '#EF233C' },
  ];

  const monthlyEvolution = [
    { month: 'Jan', admin: 4200, regist: 1100 },
    { month: 'Fev', admin: 5100, regist: 1400 },
    { month: 'Mar', admin: 4800, regist: 1200 },
    { month: 'Avr', admin: 6200, regist: 1800 },
    { month: 'Mai', admin: 7500, regist: 2100 },
    { month: 'Jun', admin: 8900, regist: 2400 },
  ];

  const regionData = [
    { name: 'Dakar', value: 45 },
    { name: 'Thiès', value: 25 },
    { name: 'Kaolack', value: 15 },
    { name: 'Autres', value: 15 },
  ];

  const COLORS = ['#0A3D62', '#00B4D8', '#06D6A0', '#FFB703'];

  return (
    <PageTransition>
      <div className="min-h-screen p-6 lg:p-12 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 font-bold hover:text-evaccin-primary transition-colors mb-2">
              <ChevronLeft size={18} /> Dashboard
            </button>
            <h1 className="text-4xl font-heading font-bold text-evaccin-primary">Rapports & Statistiques</h1>
            <p className="text-gray-500">Données consolidées du Système National PEV — Q4 2025</p>
          </div>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-full font-bold hover:bg-gray-50 transition-all text-sm">
              <Calendar size={18} /> Jan 2026 - Déc 2026
            </button>
            <RippleButton variant="accent" className="!py-3 shadow-accent-glow">
              <Download size={20} /> Exporter Rapport PDF
            </RippleButton>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Enfants', val: 12450, icon: <Users size={24} />, trend: '+12%', color: 'evaccin-primary' },
            { label: 'Administrations', val: 45892, icon: <Activity size={24} />, trend: '+8%', color: 'evaccin-accent' },
            { label: 'Couverture Globale', val: 84, suffix: '%', icon: <ShieldCheck size={24} />, trend: '+2%', color: 'evaccin-success' },
            { label: 'Structures Actives', val: 142, icon: <Map size={24} />, trend: '+4', color: 'evaccin-warning' },
          ].map((kpi, i) => (
            <GlassCard key={i} className="!p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-${kpi.color}/10 text-${kpi.color}`}>
                  {kpi.icon}
                </div>
                <span className="text-xs font-bold text-evaccin-success bg-evaccin-success/10 px-2 py-1 rounded-lg">{kpi.trend}</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{kpi.label}</p>
                <h4 className="text-2xl font-heading font-bold text-evaccin-primary mt-1">
                  <CountUp to={kpi.val} suffix={kpi.suffix || ""} />
                </h4>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Coverage Bar Chart */}
          <GlassCard className="p-8">
            <h3 className="text-lg font-bold text-evaccin-primary mb-8 flex items-center gap-2">
              <TrendingUp size={20} className="text-evaccin-success" />
              Taux de Couverture par Vaccin (%)
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={coverageData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="rate" radius={[8, 8, 0, 0]} isAnimationActive={true} animationDuration={1000}>
                    {coverageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Evolution Area Chart */}
          <GlassCard className="p-8">
            <h3 className="text-lg font-bold text-evaccin-primary mb-8 flex items-center gap-2">
              <Activity size={20} className="text-evaccin-accent" />
              Évolution Mensuelle des Activités
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyEvolution}>
                  <defs>
                    <linearGradient id="colorAdmin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00B4D8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00B4D8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="admin" 
                    stroke="#00B4D8" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorAdmin)" 
                    isAnimationActive={true}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="regist" 
                    stroke="#0A3D62" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    fill="transparent" 
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-evaccin-accent"></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase">Administrations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-evaccin-primary border-dashed"></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase">Enregistrements</span>
              </div>
            </div>
          </GlassCard>

          {/* Regional Pie Chart */}
          <GlassCard className="p-8">
            <h3 className="text-lg font-bold text-evaccin-primary mb-8">Répartition par Région Médicale</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    animationBegin={200}
                    animationDuration={1200}
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                  />
                  <Legend 
                    verticalAlign="middle" 
                    align="right" 
                    layout="vertical"
                    iconType="circle"
                    formatter={(value) => <span className="text-xs font-bold text-gray-500 uppercase">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Info Card */}
          <div className="bg-evaccin-primary rounded-3xl p-10 text-white relative overflow-hidden flex flex-col justify-center">
            <div className="relative z-10">
              <h3 className="text-2xl font-heading font-bold mb-4">Analyse Prédictive Q1 2026</h3>
              <p className="text-white/60 leading-relaxed mb-8">
                Basé sur les données actuelles, nous prévoyons une augmentation de 15% des vaccinations à Dakar suite à la campagne de sensibilisation régionale. 
                <br/><br/>
                Les stocks de vaccin Penta-2 doivent être renforcés de 2000 unités d'ici fin Février.
              </p>
              <RippleButton variant="accent" className="!bg-white !text-evaccin-primary">
                Consulter l'analyse complète
              </RippleButton>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <TrendingUp size={240} />
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default Rapports;
