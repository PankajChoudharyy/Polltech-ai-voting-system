import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { Shield, Eye, EyeOff, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../lib/store';
import CaptchaWidget from '../components/CaptchaWidget';

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

type FormData = z.infer<typeof schema>;

const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };

const AdminLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const navigate = useNavigate();
  const { setAdminLoggedIn } = useAppStore();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = (data: FormData) => {
    if (!captchaVerified) {
      toast.error('Please complete the CAPTCHA verification.');
      return;
    }
    if (data.username === ADMIN_CREDENTIALS.username && data.password === ADMIN_CREDENTIALS.password) {
      setAdminLoggedIn(true);
      toast.success('Admin access granted. Welcome to the control panel.');
      setTimeout(() => navigate('/admin/dashboard'), 800);
    } else {
      toast.error('Invalid admin credentials. Access denied.');
    }
  };

  return (
    <div className="min-h-screen bg-foreground flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-white">PollTech Admin</span>
          </Link>
          <h1 className="font-heading text-3xl font-bold text-white mb-2">Administrator Access</h1>
          <p className="text-white/50 text-sm">Restricted area — authorized personnel only</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8"
        >
          <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20 mb-6">
            <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
            <p className="text-xs text-white/70">Demo credentials: <span className="font-mono text-white">admin / admin123</span></p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Username</label>
              <input
                {...register('username')}
                type="text"
                placeholder="admin"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
              />
              {errors.username && <p className="text-xs text-red-400 mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-10 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
            </div>

            <div className="bg-white rounded-xl p-4">
              <CaptchaWidget onVerified={setCaptchaVerified} />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white rounded-lg gradient-primary hover:opacity-90 hover:scale-105 transition-all duration-200"
            >
              Access Admin Panel
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center text-sm text-white/40">
              <Link to="/login" className="hover:text-white/70 transition-colors duration-200">← Back to voter login</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;