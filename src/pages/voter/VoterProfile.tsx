import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, CheckCircle, Camera } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import VoterSidebar from '../../components/VoterSidebar';
import FaceScanner from '../../components/FaceScanner';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const VoterProfile: React.FC = () => {
  const { currentUser, storeFaceDescriptor } = useAppStore();
  const [showFaceRescan, setShowFaceRescan] = useState(false);

  if (!currentUser) return null;

  const handleFaceRescan = (descriptor: number[]) => {
    storeFaceDescriptor(currentUser.id, descriptor);
    toast.success('Face profile updated successfully.');
    setShowFaceRescan(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <VoterSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-1">My Profile</h1>
            <p className="text-muted-foreground text-sm">Manage your voter account information</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground">{currentUser.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      <CheckCircle className="w-3 h-3" />
                      {currentUser.status}
                    </span>
                    {currentUser.hasVoted && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Voted
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: User, label: 'Full Name', value: currentUser.name },
                  { icon: Mail, label: 'Email Address', value: currentUser.email },
                  { icon: Shield, label: 'National ID', value: currentUser.nationalId },
                  { icon: CheckCircle, label: 'Registered On', value: format(new Date(currentUser.registeredAt), 'MMMM d, yyyy') }
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-xl bg-secondary/30 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-heading text-lg font-semibold text-foreground">Biometric Profile</h2>
                  <p className="text-sm text-muted-foreground mt-1">Your facial recognition data</p>
                </div>
                <button
                  onClick={() => setShowFaceRescan(!showFaceRescan)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-all duration-200"
                >
                  <Camera className="w-4 h-4" />
                  {showFaceRescan ? 'Cancel' : 'Update Face'}
                </button>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentUser.faceDescriptor ? 'bg-green-100' : 'bg-orange-100'}`}>
                  <Camera className={`w-5 h-5 ${currentUser.faceDescriptor ? 'text-green-600' : 'text-orange-600'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {currentUser.faceDescriptor ? 'Face Registered' : 'No Face Data'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currentUser.faceDescriptor
                      ? '128-point biometric descriptor secured'
                      : 'Register your face for enhanced security'
                    }
                  </p>
                </div>
              </div>

              {showFaceRescan && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex justify-center pt-4">
                  <FaceScanner mode="register" onScanComplete={handleFaceRescan} onScanFailed={(r) => toast.error(r)} />
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VoterProfile;