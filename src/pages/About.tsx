import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Brain, Users, Award, Target, Heart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const values = [
  { icon: Shield, title: 'Integrity', description: 'Every vote is sacred. We build systems that protect the democratic process with zero compromise.' },
  { icon: Brain, title: 'Innovation', description: 'We leverage cutting-edge AI and biometric technology to solve the hardest problems in election security.' },
  { icon: Users, title: 'Accessibility', description: 'Democracy belongs to everyone. Our platform is designed to be usable by all citizens, regardless of technical ability.' },
  { icon: Heart, title: 'Trust', description: 'Transparency and auditability are core to everything we build. Voters and administrators can verify every step.' }
];

const team = [
  { name: 'Dr. Elena Vasquez', role: 'CEO & Co-Founder', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face' },
  { name: 'James Okafor', role: 'CTO & AI Lead', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face' },
  { name: 'Priya Sharma', role: 'Head of Security', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face' },
  { name: 'Lucas Brennan', role: 'Product Director', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face' }
];

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-background to-purple-50/30">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
                <Target className="w-3.5 h-3.5" />
                Our Mission
              </div>
              <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground mb-6">
                Protecting Democracy with <span className="gradient-text">Technology</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                PollTech was founded in 2021 with a singular mission: to make digital voting as secure, transparent, and accessible as possible using the latest advances in artificial intelligence and cryptography.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">The Problem We Solve</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>Traditional voting systems are vulnerable to fraud, manipulation, and human error. Paper ballots can be lost, miscounted, or tampered with. Early digital systems lacked the security infrastructure to prevent sophisticated attacks.</p>
                  <p>PollTech changes this entirely. By combining facial recognition AI, cryptographic vote sealing, and real-time anomaly detection, we've created a system where every vote is verifiable, every voter is authenticated, and every result is auditable.</p>
                  <p>Our platform has successfully managed over 150 elections across 40 countries, with zero security breaches and a 99.9% accuracy rate in voter verification.</p>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <img
                  src="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&h=450&fit=crop"
                  alt="Democratic voting process"
                  width={600}
                  height={450}
                  className="rounded-2xl object-cover w-full shadow-xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Our Core Values</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white border border-border hover:shadow-md transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Leadership Team</h2>
              <p className="text-muted-foreground">The experts behind PollTech's mission.</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center group"
                >
                  <div className="relative w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden">
                    <img src={member.image} alt={member.name} width={96} height={96} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-foreground">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Award className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">Recognized Globally</h2>
              <p className="text-white/60 leading-relaxed max-w-xl mx-auto">
                PollTech has been recognized by the International Election Standards Board, the Global Democracy Foundation, and the UN Digital Governance Initiative for our contributions to secure digital democracy.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;