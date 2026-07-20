import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center, Float, Points, PointMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import RippleButton from '../../components/animations/RippleButton';
import Toast from '../../components/animations/Toast';

// --- 3D Components ---

const DNA = () => {
  const meshRef = useRef();
  
  useFrame((state) => {
    meshRef.current.rotation.y += 0.003;
    meshRef.current.rotation.z += 0.001;
  });

  // Simple DNA Double Helix representation using spheres
  const points = [];
  for (let i = 0; i < 50; i++) {
    const angle = i * 0.5;
    const y = (i - 25) * 0.2;
    points.push([Math.cos(angle), y, Math.sin(angle)]);
    points.push([Math.cos(angle + Math.PI), y, Math.sin(angle + Math.PI)]);
  }

  return (
    <group ref={meshRef}>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#00B4D8" : "#0A3D62"} emissive={i % 2 === 0 ? "#00B4D8" : "#0A3D62"} emissiveIntensity={0.5} />
        </mesh>
      ))}
      {/* Connecting bars */}
      {Array.from({ length: 50 }).map((_, i) => {
        const angle = i * 0.5;
        const y = (i - 25) * 0.2;
        return (
          <mesh key={`bar-${i}`} position={[0, y, 0]} rotation={[0, angle, Math.PI / 2]}>
            <cylinderGeometry args={[0.01, 0.01, 2]} />
            <meshStandardMaterial color="#ffffff" opacity={0.3} transparent />
          </mesh>
        );
      })}
    </group>
  );
};

const Particles = ({ count = 200 }) => {
  const points = React.useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, [count]);

  return (
    <Points positions={points}>
      <PointMaterial transparent color="#00B4D8" size={0.05} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
};

const Scene3D = () => {
  return (
    <div className="hidden lg:block w-1/2 h-full bg-black relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} alpha>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={2} color="#00B4D8" />
        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <DNA />
          </Float>
          <Particles />
          <Center top position={[0, -2, 0]}>
            {/* Note: In a real app, you'd need the typeface JSON file */}
            {/* For now, we'll omit Text3D or use a mesh-based logo if preferred */}
          </Center>
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <h2 className="text-white text-6xl font-heading font-bold opacity-20 select-none">e-Vaccin</h2>
      </div>
    </div>
  );
};

// --- Form Component ---

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(email, password);
      const role = response.data?.user?.role;
      setToast({ message: 'Connexion réussie ! Redirection...', type: 'success' });
      
      setTimeout(() => {
        if (role === 'AGENT') {
          navigate('/agent-dashboard');
        } else {
          navigate('/');
        }
      }, 1500);
    } catch (err) {
      setToast({ message: err.message || 'Identifiants invalides', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-evaccin-surface">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      {/* Form Side */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-gradient-to-br from-evaccin-primary to-[#023E7D] text-white">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="flex items-center gap-3 mb-12"
        >
          <div className="w-12 h-12 bg-evaccin-accent rounded-xl flex items-center justify-center shadow-accent-glow">
            <ShieldCheck size={28} />
          </div>
          <span className="text-2xl font-heading font-bold tracking-tight">e-Vaccin</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-heading font-bold mb-2">Bienvenue</h1>
          <p className="text-white/60 text-lg mb-10">Système de gestion vaccinale — Sénégal</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-1.5"
          >
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Email professionnel</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-evaccin-accent transition-colors" size={20} />
              <input
                type="email"
                required
                placeholder="exemple@domaine.sn"
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-evaccin-accent/50 focus:border-evaccin-accent focus:bg-white/20 transition-all duration-300 placeholder:text-white/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-1.5"
          >
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Mot de passe</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-evaccin-accent transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-evaccin-accent/50 focus:border-evaccin-accent focus:bg-white/20 transition-all duration-300 placeholder:text-white/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                <motion.div animate={{ rotate: showPassword ? 180 : 0 }}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </motion.div>
              </button>
            </div>
          </motion.div>

          <div className="flex items-center justify-between py-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/10 text-evaccin-accent focus:ring-evaccin-accent" />
              <span className="text-sm text-white/60">Se souvenir</span>
            </label>
            <button type="button" className="text-sm text-evaccin-accent font-bold hover:underline">Mot de passe oublié ?</button>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <RippleButton
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-evaccin-accent to-evaccin-primary shadow-accent-glow"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Se connecter <ArrowRight size={20} /></>}
            </RippleButton>
          </motion.div>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-white/40 text-sm"
        >
          e-Vaccin © 2026 — Système National PEV Sénégal
        </motion.p>
      </div>

      {/* 3D Side */}
      <Scene3D />
    </div>
  );
}
