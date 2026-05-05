import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Scan, CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import VoterSidebar from '../../components/VoterSidebar';

const VoterSecurity: React.FC = () => {
  const { currentUser } = useAppStore();

  if (!currentUser) return null;

  const securityItems = [
    {
      icon: Lock,
      title: 'Password Protection',
      status: 'active',
      description: 'Your account is protected with a strong password.',
      color: 'green'
    },
    {
      icon: Scan,
      title: 'Facial Recognition',
      status: currentUser.faceDescriptor ? 'active' : 'inactive',
      description: currentUser.faceDescriptor
        ? 'Biometric face data registered and secured.'
        : 'Face not registered. Visit Profile to add.',
      color: currentUser.faceDescriptor ? 'green' : 'orange'
    },
    {
      icon: Shield,
      title: 'CAPTCHA Verification',
      status: 'active',
      description: 'CAPTCHA is required at login and voting.',
      color: 'green'
    },
    {
      icon: Eye,
      title: 'Vote Privacy',
      status: 'active',
      description: 'Your vote is encrypted and anonymous.',
      color: 'green'
    }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <VoterSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-1">Security Center</h1>
            <p className="text-muted-foreground text-sm">Monitor and manage your account security</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 mb-8">
            {securityItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-border p-6 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  item.color === 'green' ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  <item.icon className={`w-6 h-6 ${item.color === 'green' ? 'text-green-600' : 'text-orange-600'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading font-semibold text-foreground text-sm">{item.title}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {item.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {item.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 border border-blue-200 rounded-2xl p-6"
          >
            <h2 className="font-heading font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Tips
            </h2>
            <ul className="space-y-2">
              {[
                'Never share your login credentials with anyone.',
                'Always vote from a trusted, private device.',
                'Ensure your face is well-lit during biometric verification.',
                'Log out after completing your vote.',
                'Report any suspicious activity to election authorities.'
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default VoterSecurity;