import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Vote, CheckCircle, Clock, Shield, ArrowRight, User, Calendar } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import VoterSidebar from '../../components/VoterSidebar';
import { format } from 'date-fns';

const VoterDashboard: React.FC = () => {
  const { currentUser, election, candidates } = useAppStore();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Please <Link to="/login" className="text-primary hover:underline">sign in</Link> to access your dashboard.</p>
      </div>
    );
  }

  const votedCandidate = currentUser.hasVoted
    ? candidates.find(c => c.id === currentUser.votedFor)
    : null;

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

  return (
    <div className="flex min-h-screen bg-background">
      <VoterSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-1">
              Welcome back, {currentUser.name.split(' ')[0]}
            </h1>
            <p className="text-muted-foreground text-sm">
              Registered on {format(new Date(currentUser.registeredAt), 'MMMM d, yyyy')}
            </p>
          </motion.div>

          {/* Status Banner */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-6 rounded-2xl border mb-8 ${
              currentUser.hasVoted
                ? 'bg-green-50 border-green-200'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  currentUser.hasVoted ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {currentUser.hasVoted
                    ? <CheckCircle className="w-6 h-6 text-green-600" />
                    : <Vote className="w-6 h-6 text-blue-600" />
                  }
                </div>
                <div>
                  <h2 className={`font-heading font-semibold text-lg ${
                    currentUser.hasVoted ? 'text-green-800' : 'text-blue-800'
                  }`}>
                    {currentUser.hasVoted ? 'Your vote has been cast!' : 'You haven\'t voted yet'}
                  </h2>
                  <p className={`text-sm ${currentUser.hasVoted ? 'text-green-600' : 'text-blue-600'}`}>
                    {currentUser.hasVoted
                      ? `You voted for ${votedCandidate?.name || 'a candidate'}`
                      : `Election: ${election.title}`
                    }
                  </p>
                </div>
              </div>
              {!currentUser.hasVoted && (
                <Link
                  to="/voter/vote"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg gradient-primary hover:opacity-90 hover:scale-105 transition-all duration-200"
                >
                  Cast Your Vote
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              {
                icon: Calendar,
                label: 'Election Status',
                value: election.status.charAt(0).toUpperCase() + election.status.slice(1),
                sub: `Ends ${format(new Date(election.endDate), 'MMM d, yyyy')}`,
                color: 'bg-blue-50 border-blue-100 text-blue-600'
              },
              {
                icon: Vote,
                label: 'Total Votes Cast',
                value: totalVotes.toString(),
                sub: 'Across all candidates',
                color: 'bg-purple-50 border-purple-100 text-purple-600'
              },
              {
                icon: Shield,
                label: 'Security Status',
                value: 'Verified',
                sub: 'Face + CAPTCHA confirmed',
                color: 'bg-green-50 border-green-100 text-green-600'
              }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className={`p-6 rounded-2xl border ${stat.color.split(' ').slice(0, 2).join(' ')}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.color.split(' ').slice(2).join(' ')} bg-opacity-20`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-heading font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-foreground">{stat.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.sub}</div>
              </motion.div>
            ))}
          </div>

          {/* Candidates Preview */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl border border-border p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-lg font-semibold text-foreground">Candidates</h2>
              {!currentUser.hasVoted && (
                <Link to="/voter/vote" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                  Vote Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
            <div className="space-y-4">
              {candidates.map((candidate) => {
                const pct = totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(1) : '0.0';
                const isVotedFor = currentUser.votedFor === candidate.id;
                return (
                  <div key={candidate.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${isVotedFor ? 'border-primary/30 bg-primary/5' : 'border-border hover:bg-secondary/30'}`}>
                    <img
                      src={candidate.imageUrl}
                      alt={candidate.name}
                      width={44}
                      height={44}
                      className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">{candidate.name}</p>
                        {isVotedFor && <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{candidate.party}</p>
                      <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full gradient-primary rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-foreground">{candidate.voteCount}</p>
                      <p className="text-xs text-muted-foreground">{pct}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Profile Summary */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 bg-white rounded-2xl border border-border p-6"
          >
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4">Your Profile</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', value: currentUser.name, icon: User },
                { label: 'Email', value: currentUser.email, icon: User },
                { label: 'National ID', value: currentUser.nationalId, icon: Shield },
                { label: 'Face Registered', value: currentUser.faceDescriptor ? 'Yes — Biometric secured' : 'Not registered', icon: Shield }
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <item.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default VoterDashboard;