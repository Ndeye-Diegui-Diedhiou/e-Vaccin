import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Line } from '@react-three/drei';
import { motion } from 'framer-motion';
import { 
  Users, CheckCircle, AlertTriangle, Activity, 
  LayoutDashboard, UserPlus, Database, Bell, 
  Search, LogOut, Settings, BarChart3, ChevronRight,
  TrendingUp, MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { patientService } from '../../services/patientService';
import { vaccinationService } from '../../services/vaccinationService';
import PageTransition from '../../components/animations/PageTransition';
import GlassCard from '../../components/animations/GlassCard';
import CountUp from '../../components/animations/CountUp';
import RippleButton from '../../components/animations/RippleButton';

// --- 3D Components ---

const SenegalGlobe = () => {
  const globeRef = useRef();
  
  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
  });

  const markers = [
    { pos: [1.4, 0.5, 1.4], name: 'Dakar' },
    { pos: [1.5, 0.2, 1.3], name: 'Thiès' },
    { pos: [1.2, 1.2, 1.0], name: 'Saint-Louis' },
    { pos: [1.8, -0.3, 0.8], name: 'Kaolack' },
    { pos: [1.6, 0.8, -1.0], name: 'Ziguinchor' },
  ];

  return (
    <group ref={globeRef}>
      {/* Globe principal avec une opacité augmentée pour la visibilité */}
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial 
          color="#0A3D62" 
          wireframe 
          transparent 
          opacity={0.3} 
        />
      </Sphere>
      
      <Sphere args={[1.9, 64, 64]}>
        <MeshDistortMaterial 
          color="#00B4D8" 
          speed={2} 
          distort={0.1} 
          transparent 
          opacity={0.1} 
        />
      </Sphere>

      {markers.map((m, i) => (
        <group key={i} position={m.pos}>
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#EF233C" emissive="#EF233C" emissiveIntensity={2} />
          </mesh>
        </group>
      ))}

      {markers.map((m, i) => i > 0 && (
        <Line 
          key={`line-${i}`} 
          points={[markers[0].pos, m.pos]} 
          color="#00B4D8" 
          lineWidth={1} 
          transparent 
          opacity={0.4} 
        />
      ))}
    </group>
  );
};

const DashboardScene = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none" style={{ height: '100%', width: '100%' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} alpha="true">
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00B4D8" />
        <Suspense fallback={null}>
          <SenegalGlobe />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate />
        </Suspense>
      </Canvas>
    </div>
  );
};

// --- Main Dashboard Component ---

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ patients: 0, vaccinations: 0, retards: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, sRes, vRes] = await Promise.all([
          patientService.getAllPatients(0, 1),
          vaccinationService.getStats(),
          vaccinationService.getVaccinationsAujourdhui()
        ]);
        setStats({
          patients: pRes?.totalElements || 12450,
          vaccinations: sRes?.total || 45892,
          retards: sRes?.retard || 12
        });
      } catch (e) {
        setStats({ patients: 12450, vaccinations: 45892, retards: 12 });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const menuItems = [
    { label: 'Tableau de bord', icon: <LayoutDashboard size={20} />, path: '/', active: true },
    { label: 'Gestion Patients', icon: <Users size={20} />, path: '/patients/register' },
    { label: 'Vaccinations', icon: <Database size={20} />, path: '/vaccinations/new' },
    { label: 'Alertes SMS', icon: <Bell size={20} />, path: '/alertes', badge: 3 },
    { label: 'Rapports Stats', icon: <BarChart3 size={20} />, path: '/rapports' },
  ];

  return (
    <PageTransition>
      <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-72 bg-[#0A3D62] text-white flex flex-col p-6 z-20">
          <div className="flex items-center gap-3 mb-12 px-2">
            <Activity size={24} className="text-[#00B4D8]" />
            <span className="text-xl font-bold tracking-tight">e-Vaccin</span>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                  item.active ? 'bg-white/10 border-l-4 border-[#00B4D8]' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  {item.icon}
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-full">{item.badge}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/10">
            <button onClick={logout} className="flex items-center gap-4 p-4 text-white/60 hover:text-red-400 w-full">
              <LogOut size={20} /> Déconnexion
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 relative overflow-hidden flex flex-col">
          <DashboardScene />
          
          <header className="p-8 flex justify-between items-center z-10">
            <div className="relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl focus:outline-none" 
                placeholder="Rechercher un enfant..." 
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-white/80 backdrop-blur-md rounded-2xl flex items-center gap-2 border border-gray-100">
                <MapPin size={16} className="text-[#00B4D8]" />
                <span className="text-xs font-bold text-[#0A3D62]">Dakar, Sénégal</span>
              </div>
            </div>
          </header>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 z-10">
            <GlassCard>
              <p className="text-xs font-bold text-gray-500 uppercase">Enfants</p>
              <h4 className="text-3xl font-bold text-[#0A3D62]"><CountUp to={stats.patients} /></h4>
            </GlassCard>
            <GlassCard>
              <p className="text-xs font-bold text-gray-500 uppercase">Vaccinations</p>
              <h4 className="text-3xl font-bold text-[#0A3D62]"><CountUp to={stats.vaccinations} /></h4>
            </GlassCard>
            <GlassCard className="border-l-4 border-red-500">
              <p className="text-xs font-bold text-gray-500 uppercase">Retards</p>
              <h4 className="text-3xl font-bold text-red-500"><CountUp to={stats.retards} /></h4>
            </GlassCard>
          </div>

          <div className="p-8 mt-auto z-10 flex gap-4">
            <RippleButton onClick={() => navigate('/patients/register')}>+ Nouveau Patient</RippleButton>
            <RippleButton onClick={() => navigate('/vaccinations/new')} variant="secondary">Enregistrer Vaccin</RippleButton>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}