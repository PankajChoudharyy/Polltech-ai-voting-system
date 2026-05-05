import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Scan, ShieldCheck, Vote, Lock, BarChart3, CheckCircle, AlertTriangle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const phases = [
  {
    phase: 'Phase 1',
    title: 'Registration & Identity Verification',
    icon: UserPlus,
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    steps: [
      'Voter submits personal information and national ID',
      'AI cross-references data against electoral roll',
      'Face scan captures biometric descriptor (128-point map)',
      'CAPTCHA challenge confirms human interaction',
      'Account approved and cryptographic key pair generated'
    ]
  },
  {
    phase: 'Phase 2',
    title: 'Authentication at Voting Time',
    icon: Scan,
    color: 'bg-purple-50 text-purple-600 border-purple-100',
    steps: [
      'Voter logs in with email and password',
      'Live face scan compared against registered descriptor',
      'AI checks for duplicate face across all registered voters',
      'Liveness detection prevents photo/video spoofing',
      'CAPTCHA re-verification confirms active human session'
    ]
  },
  {
    phase: 'Phase 3',
    title: 'Secure Vote Casting',
    icon: Vote,
    color: 'bg-green-50 text-green-600 border-green-100',
    steps: [
      'Voter selects their preferred candidate',
      'Vote is encrypted with voter\'s private key',
      'Encrypted ballot submitted to secure ledger',
      'One-time vote flag set — prevents double voting',
      'Cryptographic receipt generated for voter'
    ]
  },
  {
    phase: 'Phase 4',
    title: 'Counting & Verification',
    icon: BarChart3,
    color: 'bg-orange-50 text-orange-600 border-orange-100',
    steps: [
      'Encrypted votes tallied by zero-knowledge proof system',
      'Results verifiable without revealing individual votes',
      'Real-time dashboard updated for administrators',
      'Audit trail available for independent verification',
      'Final results certified and published transparently'
    ]
  }
];

const securityFeatures = [
  { icon: Lock, title: 'AES-256 Encryption', desc: 'Military-grade encryption for all vote data in transit and at rest.' },
  { icon: ShieldCheck, title: 'Zero-Knowledge Proofs', desc: 'Votes are counted without ever revealing individual choices.' },
  { icon: AlertTriangle, title: 'Anomaly Detection', desc: 'AI monitors for unusual patterns and flags suspicious activity instantly.' },
  { icon: CheckCircle, title: 'Immutable Audit Log', desc: 'Every action is logged in a tamper-proof, time-stamped audit trail.' }
];

const HowItWorks: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-background to-purple-50/30">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground mb-6">
                How <span className="gradient-text">PollTech</span> Works
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                A transparent, step-by-step breakdown of our AI-powered voting process — from registration to certified results.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="space-y-12">
              {phases.map((phase, i) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 rounded-2xl border border-border bg-white hover:shadow-md transition-all duration-300"
                >
                  <div className="lg:col-span-1">
                    <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl border mb-4 ${phase.color}`}>
                      <phase.icon className="w-5 h-5" />
                      <span className="text-sm font-semibold">{phase.phase}</span>
                    </div>
                    <h2 className="font-heading text-xl font-bold text-foreground">{phase.title}</h2>
                  </div>
                  <div className="lg:col-span-2">
                    <ul className="space-y-3">
                      {phase.steps.map((step, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-primary">{j + 1}</span>
                          </div>
                          <span className="text-sm text-muted-foreground leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Security Architecture</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Multiple layers of protection ensure no single point of failure.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {securityFeatures.map((feat, i) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white border border-border hover:shadow-md transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2 text-sm">{feat.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;