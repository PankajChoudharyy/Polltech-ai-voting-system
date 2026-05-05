import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Brain, Scan, CheckCircle, ArrowRight,
  Lock, Users, BarChart3, Zap, Globe, Award
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Verification',
    description: 'Advanced machine learning algorithms verify voter identity in real-time, preventing fraud and ensuring election integrity.',
    color: 'text-blue-600 bg-blue-50'
  },
  {
    icon: Scan,
    title: 'Facial Recognition',
    description: 'Biometric face scanning ensures each voter can only cast one ballot. Our AI detects duplicate faces with 99.9% accuracy.',
    color: 'text-purple-600 bg-purple-50'
  },
  {
    icon: Shield,
    title: 'CAPTCHA Security',
    description: 'Multi-layer CAPTCHA challenges prevent automated bots from interfering with the democratic process.',
    color: 'text-green-600 bg-green-50'
  },
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'Every vote is encrypted using military-grade cryptography, ensuring complete privacy and tamper-proof records.',
    color: 'text-orange-600 bg-orange-50'
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Live vote counting and statistical analysis with transparent, auditable results accessible to all stakeholders.',
    color: 'text-red-600 bg-red-50'
  },
  {
    icon: Globe,
    title: 'Accessible Anywhere',
    description: 'Vote securely from any device, anywhere in the world. Our platform supports 40+ languages and accessibility standards.',
    color: 'text-teal-600 bg-teal-50'
  }
];

const stats = [
  { value: '2.4M+', label: 'Votes Cast', icon: CheckCircle },
  { value: '99.9%', label: 'Accuracy Rate', icon: Award },
  { value: '150+', label: 'Elections Managed', icon: Globe },
  { value: '0', label: 'Security Breaches', icon: Shield }
];

const steps = [
  { step: '01', title: 'Register & Verify', description: 'Create your account with your national ID and complete face registration.' },
  { step: '02', title: 'AI Authentication', description: 'Our AI verifies your identity through facial recognition and CAPTCHA.' },
  { step: '03', title: 'Cast Your Vote', description: 'Securely select your candidate. Your vote is encrypted immediately.' },
  { step: '04', title: 'Confirmation', description: 'Receive a cryptographic receipt confirming your vote was recorded.' }
];

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-background to-purple-50/40" />
          <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
              >
                <Zap className="w-3.5 h-3.5" />
                AI-Powered Secure Voting Platform
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6"
              >
                Democracy,{' '}
                <span className="gradient-text">Secured</span>{' '}
                by AI
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto"
              >
                PollTech combines facial recognition, AI verification, and cryptographic security to deliver the most trusted digital voting experience ever built.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-xl gradient-primary hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-lg shadow-primary/25"
                >
                  Register to Vote
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-foreground rounded-xl border border-border hover:bg-secondary hover:scale-105 transition-all duration-200"
                >
                  How It Works
                </Link>
              </motion.div>
            </div>

            {/* Hero visual */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-20 relative max-w-4xl mx-auto"
            >
              <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl bg-white">
                <div className="bg-foreground px-6 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4 bg-white/10 rounded-md px-3 py-1 text-xs text-white/60 font-mono">
                    https://polltech.io/voter/vote
                  </div>
                  <Shield className="w-4 h-4 text-green-400" />
                </div>
                <img
                  src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=900&h=400&fit=crop"
                  alt="Secure digital voting interface"
                  width={900}
                  height={400}
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent flex items-end p-8">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-lg px-3 py-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-white font-medium">Identity Verified</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg px-3 py-2">
                      <Lock className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white font-medium">Vote Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 border-y border-border bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-heading font-bold gradient-text mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                Built for Security, Designed for Trust
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Every feature is engineered to protect the integrity of your election while making the voting experience seamless.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="p-8 rounded-2xl bg-white border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                Vote in 4 Simple Steps
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Our streamlined process makes secure voting accessible to everyone.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative"
                >
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-border z-0" />
                  )}
                  <div className="relative z-10 p-6 rounded-2xl bg-white border border-border">
                    <div className="text-4xl font-heading font-bold gradient-text mb-4">{step.step}</div>
                    <h3 className="font-heading text-base font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-foreground">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
                Your Vote. Your Voice. Secured.
              </h2>
              <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
                Join millions of citizens who trust PollTech to protect their democratic rights.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-xl gradient-primary hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Register Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/admin/login"
                  className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-white/80 rounded-xl border border-white/20 hover:bg-white/10 hover:scale-105 transition-all duration-200"
                >
                  <Shield className="w-4 h-4" />
                  Admin Access
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;