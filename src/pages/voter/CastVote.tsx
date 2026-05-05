import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { CheckCircle, Vote, ArrowRight, Lock, AlertTriangle, Scan } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import VoterSidebar from '../../components/VoterSidebar';
import FaceScanner from '../../components/FaceScanner';
import CaptchaWidget from '../../components/CaptchaWidget';

type VoteStep = 'face-verify' | 'captcha' | 'select' | 'confirm' | 'success';

const CastVote: React.FC = () => {
  const [step, setStep] = useState<VoteStep>('face-verify');
  const [faceVerified, setFaceVerified] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const navigate = useNavigate();
  const { currentUser, candidates, castVote, checkFaceDuplicate } = useAppStore();

  if (!currentUser) {
    return (
      <div className="flex min-h-screen bg-background">
        <VoterSidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Please <Link to="/login" className="text-primary hover:underline">sign in</Link>.</p>
        </main>
      </div>
    );
  }

  if (currentUser.hasVoted) {
    const voted = candidates.find(c => c.id === currentUser.votedFor);
    return (
      <div className="flex min-h-screen bg-background">
        <VoterSidebar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-3">Vote Already Cast</h1>
            <p className="text-muted-foreground mb-2">You have already voted in this election.</p>
            {voted && (
              <p className="text-sm font-medium text-primary mb-6">Your vote: {voted.name}</p>
            )}
            <Link to="/voter/dashboard" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-lg gradient-primary hover:opacity-90 transition-all duration-200">
              Back to Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handleFaceVerify = (descriptor: number[]) => {
    if (currentUser.faceDescriptor) {
      const distance = Math.sqrt(
        currentUser.faceDescriptor.reduce((sum, val, i) => sum + Math.pow(val - descriptor[i], 2), 0)
      );
      if (distance > 1.5) {
        toast.error('Face does not match registered profile. Access denied.');
        return;
      }
    }
    setFaceVerified(true);
    toast.success('Identity verified! Proceeding to security check.');
    setStep('captcha');
  };

  const handleFaceFailed = (reason: string) => {
    toast.error(reason);
  };

  const handleCaptchaVerified = (verified: boolean) => {
    setCaptchaVerified(verified);
    if (verified) {
      setTimeout(() => setStep('select'), 500);
    }
  };

  const handleConfirmVote = () => {
    if (!selectedCandidate) return;
    const result = castVote(currentUser.id, selectedCandidate);
    if (result.success) {
      setStep('success');
    } else {
      toast.error(result.message);
    }
  };

  const selectedCandidateData = candidates.find(c => c.id === selectedCandidate);

  const stepLabels: VoteStep[] = ['face-verify', 'captcha', 'select', 'confirm', 'success'];
  const currentStepIndex = stepLabels.indexOf(step);

  return (
    <div className="flex min-h-screen bg-background">
      <VoterSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-1">Cast Your Vote</h1>
            <p className="text-muted-foreground text-sm">Complete all security steps to submit your ballot</p>
          </motion.div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {['Face ID', 'CAPTCHA', 'Select', 'Confirm', 'Done'].map((label, i) => (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    i < currentStepIndex ? 'bg-green-500 text-white' :
                    i === currentStepIndex ? 'gradient-primary text-white' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {i < currentStepIndex ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 hidden sm:block">{label}</span>
                </div>
                {i < 4 && <div className={`flex-1 h-px transition-all duration-300 ${i < currentStepIndex ? 'bg-green-500' : 'bg-border'}`} />}
              </React.Fragment>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 'face-verify' && (
              <motion.div
                key="face"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl border border-border p-8 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <Scan className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="font-heading text-xl font-semibold text-foreground mb-2">Identity Verification</h2>
                <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
                  Scan your face to confirm your identity before voting. This prevents unauthorized access.
                </p>
                <FaceScanner mode="verify" onScanComplete={handleFaceVerify} onScanFailed={handleFaceFailed} />
              </motion.div>
            )}

            {step === 'captcha' && (
              <motion.div
                key="captcha"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl border border-border p-8"
              >
                <h2 className="font-heading text-xl font-semibold text-foreground mb-2">Security Check</h2>
                <p className="text-sm text-muted-foreground mb-6">Complete the CAPTCHA to confirm you're a real voter.</p>
                <CaptchaWidget onVerified={handleCaptchaVerified} />
              </motion.div>
            )}

            {step === 'select' && (
              <motion.div
                key="select"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    <strong>Important:</strong> Your vote is final and cannot be changed once submitted. Choose carefully.
                  </p>
                </div>

                <h2 className="font-heading text-xl font-semibold text-foreground mb-6">Select Your Candidate</h2>
                <div className="space-y-4">
                  {candidates.map((candidate) => (
                    <motion.button
                      key={candidate.id}
                      onClick={() => setSelectedCandidate(candidate.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 vote-card-hover ${
                        selectedCandidate === candidate.id
                          ? 'selected-candidate bg-primary/5'
                          : 'border-border bg-white hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={candidate.imageUrl}
                          alt={candidate.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-heading font-semibold text-foreground">{candidate.name}</h3>
                            {selectedCandidate === candidate.id && (
                              <CheckCircle className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-primary font-medium mb-2">{candidate.party}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{candidate.description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all duration-200 ${
                          selectedCandidate === candidate.id
                            ? 'border-primary bg-primary'
                            : 'border-border'
                        }`}>
                          {selectedCandidate === candidate.id && (
                            <div className="w-full h-full rounded-full bg-white scale-50" />
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <button
                  onClick={() => selectedCandidate && setStep('confirm')}
                  disabled={!selectedCandidate}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-white rounded-xl gradient-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-200"
                >
                  Review My Vote
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 'confirm' && selectedCandidateData && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl border border-border p-8"
              >
                <div className="text-center mb-8">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-2">Confirm Your Vote</h2>
                  <p className="text-sm text-muted-foreground">Review your selection before final submission</p>
                </div>

                <div className="p-6 rounded-2xl bg-secondary/30 border border-border mb-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Your Selection</p>
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedCandidateData.imageUrl}
                      alt={selectedCandidateData.name}
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="font-heading font-bold text-foreground text-lg">{selectedCandidateData.name}</h3>
                      <p className="text-sm text-primary">{selectedCandidateData.party}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  {[
                    { label: 'Voter', value: currentUser.name },
                    { label: 'National ID', value: currentUser.nationalId },
                    { label: 'Face Verified', value: 'Yes' },
                    { label: 'CAPTCHA Passed', value: 'Yes' },
                    { label: 'Encryption', value: 'AES-256 Active' }
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('select')}
                    className="flex-1 py-3 text-sm font-medium text-foreground border border-border rounded-xl hover:bg-secondary transition-all duration-200"
                  >
                    Change Selection
                  </button>
                  <button
                    onClick={handleConfirmVote}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white rounded-xl gradient-primary hover:opacity-90 hover:scale-105 transition-all duration-200"
                  >
                    <Vote className="w-4 h-4" />
                    Submit Vote
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl border border-border p-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </motion.div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Vote Submitted!</h2>
                <p className="text-muted-foreground mb-2">Your vote has been securely encrypted and recorded.</p>
                <p className="text-sm text-muted-foreground mb-8">
                  Receipt ID: <span className="font-mono text-primary">VT-{Date.now().toString(36).toUpperCase()}</span>
                </p>
                <button
                  onClick={() => navigate('/voter/dashboard')}
                  className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold text-white rounded-xl gradient-primary hover:opacity-90 hover:scale-105 transition-all duration-200"
                >
                  Back to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default CastVote;