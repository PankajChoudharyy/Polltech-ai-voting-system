import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { Vote, Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react';
import { useAppStore } from '../lib/store';
import FaceScanner from '../components/FaceScanner';
import CaptchaWidget from '../components/CaptchaWidget';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  nationalId: z.string().min(6, 'National ID must be at least 6 characters'),
  agreeTerms: z.boolean().refine(v => v, 'You must agree to the terms')
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

type FormData = z.infer<typeof schema>;

type Step = 'info' | 'face' | 'captcha' | 'complete';

const Register: React.FC = () => {
  const [step, setStep] = useState<Step>('info');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [faceDescriptor, setFaceDescriptor] = useState<number[] | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const navigate = useNavigate();
  const { registerVoter, checkFaceDuplicate, storeFaceDescriptor } = useAppStore();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onInfoSubmit = (data: FormData) => {
    setFormData(data);
    setStep('face');
  };

  const handleFaceScan = (descriptor: number[]) => {
    const { isDuplicate, matchedVoter } = checkFaceDuplicate(descriptor);
    if (isDuplicate) {
      toast.error(`Face already registered to voter: ${matchedVoter}. Duplicate registration prevented.`);
      return;
    }
    setFaceDescriptor(descriptor);
    toast.success('Face scan successful! Proceeding to security verification.');
    setStep('captcha');
  };

  const handleFaceFailed = (reason: string) => {
    toast.error(reason);
  };

  const handleComplete = () => {
    if (!formData || !faceDescriptor || !captchaVerified) {
      toast.error('Please complete all verification steps.');
      return;
    }

    const result = registerVoter({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      nationalId: formData.nationalId,
      faceDescriptor: null
    });

    if (!result.success) {
      toast.error(result.message);
      setStep('info');
      return;
    }

    const { voters } = useAppStore.getState();
    const newVoter = voters.find(v => v.email === formData.email);
    if (newVoter) {
      storeFaceDescriptor(newVoter.id, faceDescriptor);
    }

    setStep('complete');
  };

  const steps = [
    { id: 'info', label: 'Personal Info', num: 1 },
    { id: 'face', label: 'Face Scan', num: 2 },
    { id: 'captcha', label: 'Verification', num: 3 },
    { id: 'complete', label: 'Complete', num: 4 }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50/30 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Vote className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-foreground">PollTech</span>
          </Link>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Create Voter Account</h1>
          <p className="text-muted-foreground text-sm">Register to participate in secure AI-verified elections</p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  i < currentStepIndex ? 'bg-green-500 text-white' :
                  i === currentStepIndex ? 'gradient-primary text-white' :
                  'bg-secondary text-muted-foreground'
                }`}>
                  {i < currentStepIndex ? <CheckCircle className="w-4 h-4" /> : s.num}
                </div>
                <span className="text-xs text-muted-foreground mt-1 hidden sm:block">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-2 transition-all duration-300 ${i < currentStepIndex ? 'bg-green-500' : 'bg-border'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl border border-border shadow-lg p-8"
        >
          {step === 'info' && (
            <form onSubmit={handleSubmit(onInfoSubmit)} className="space-y-5">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-6">Personal Information</h2>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="Write Full Name"
                  className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
              </div>

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
                <label className="block text-sm font-medium text-foreground mb-1.5">National ID</label>
                <input
                  {...register('nationalId')}
                  type="text"
                  placeholder="NID-123456789"
                  className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                />
                {errors.nationalId && <p className="text-xs text-destructive mt-1">{errors.nationalId.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    className="w-full px-4 py-3 pr-10 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    {...register('confirmPassword')}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat password"
                    className="w-full px-4 py-3 pr-10 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <div className="flex items-start gap-3">
                <input
                  {...register('agreeTerms')}
                  type="checkbox"
                  id="terms"
                  className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the <Link to="/" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/" className="text-primary hover:underline">Privacy Policy</Link>
                </label>
              </div>
              {errors.agreeTerms && <p className="text-xs text-destructive">{errors.agreeTerms.message}</p>}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white rounded-lg gradient-primary hover:opacity-90 hover:scale-105 transition-all duration-200"
              >
                Continue to Face Scan
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-sm text-muted-foreground">
                Already registered?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
              </p>
            </form>
          )}

          {step === 'face' && (
            <div className="text-center space-y-6">
              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground mb-2">Face Registration</h2>
                <p className="text-sm text-muted-foreground">
                  Our AI will scan your face to create a unique biometric profile. This prevents duplicate voting.
                </p>
              </div>
              <FaceScanner
                mode="register"
                onScanComplete={(descriptor) => handleFaceScan(descriptor)}
                onScanFailed={handleFaceFailed}
              />
              <button
                onClick={() => setStep('info')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                ← Back to personal info
              </button>
            </div>
          )}

          {step === 'captcha' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground mb-2">Security Verification</h2>
                <p className="text-sm text-muted-foreground">
                  Complete the CAPTCHA challenge to confirm you're a real person.
                </p>
              </div>
              <CaptchaWidget onVerified={(verified) => setCaptchaVerified(verified)} />
              <button
                onClick={handleComplete}
                disabled={!captchaVerified}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white rounded-lg gradient-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-200"
              >
                Complete Registration
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'complete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-4"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Registration Complete!</h2>
                <p className="text-sm text-muted-foreground">
                  Your voter account has been created and your biometric profile is secured. You can now sign in to cast your vote.
                </p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white rounded-lg gradient-primary hover:opacity-90 hover:scale-105 transition-all duration-200"
              >
                Sign In to Vote
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Register;