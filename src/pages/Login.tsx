import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { Vote, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAppStore } from '../lib/store';
import CaptchaWidget from '../components/CaptchaWidget';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

type FormData = z.infer<typeof schema>;

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const navigate = useNavigate();
  const { loginVoter } = useAppStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = (data: FormData) => {
    if (!captchaVerified) {
      toast.error('Please complete the CAPTCHA verification.');
      return;
    }
    const result = loginVoter(data.email, data.password);
    if (result.success) {
      toast.success('Welcome back! Redirecting to your dashboard...');
      setTimeout(() => navigate('/voter/dashboard'), 800);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50/30 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Vote className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-foreground">PollTech</span>
          </Link>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Voter Sign In</h1>
          <p className="text-muted-foreground text-sm">Access your secure voting portal</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-border shadow-lg p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="new@example.com"
                className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  className="w-full px-4 py-3 pr-10 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>

            <CaptchaWidget onVerified={setCaptchaVerified} />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white rounded-lg gradient-primary hover:opacity-90 disabled:opacity-60 hover:scale-105 transition-all duration-200"
            >
              Sign In Securely
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Not registered?{' '}
              <Link to="/register" className="text-primary font-medium hover:underline">Create account</Link>
            </p>
          </form>
        </motion.div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Are you an administrator?{' '}
          <Link to="/admin/login" className="text-primary font-medium hover:underline">Admin login</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;