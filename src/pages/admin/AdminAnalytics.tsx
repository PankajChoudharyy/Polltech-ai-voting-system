import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Vote } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import AdminSidebar from '../../components/AdminSidebar';
import VoteChart from '../../components/VoteChart';
import StatsCard from '../../components/StatsCard';

const AdminAnalytics: React.FC = () => {
  const { voters, candidates, voteRecords } = useAppStore();

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
  const turnout = voters.length > 0 ? ((voters.filter(v => v.hasVoted).length / voters.length) * 100).toFixed(1) : '0.0';
  const faceRegistered = voters.filter(v => v.faceDescriptor).length;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-1">Analytics</h1>
            <p className="text-muted-foreground text-sm">Real-time election statistics and insights</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Total Votes" value={totalVotes} subtitle="Ballots cast" icon={Vote} color="blue" delay={0} />
            <StatsCard title="Voter Turnout" value={`${turnout}%`} subtitle="Participation rate" icon={TrendingUp} color="green" delay={0.1} />
            <StatsCard title="Registered Voters" value={voters.length} subtitle="Total accounts" icon={Users} color="purple" delay={0.2} />
            <StatsCard title="Face Registered" value={faceRegistered} subtitle="Biometric profiles" icon={BarChart3} color="orange" delay={0.3} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-heading text-lg font-semibold text-foreground mb-4">Votes by Candidate (Bar)</h2>
              <VoteChart candidates={candidates} type="bar" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-heading text-lg font-semibold text-foreground mb-4">Vote Share (Pie)</h2>
              <VoteChart candidates={candidates} type="pie" />
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-6">Candidate Performance</h2>
            <div className="space-y-4">
              {[...candidates].sort((a, b) => b.voteCount - a.voteCount).map((candidate, i) => {
                const pct = totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100) : 0;
                return (
                  <div key={candidate.id} className="flex items-center gap-4">
                    <span className="text-sm font-bold text-muted-foreground w-6">#{i + 1}</span>
                    <img src={candidate.imageUrl} alt={candidate.name} width={36} height={36} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <div>
                          <span className="text-sm font-medium text-foreground">{candidate.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">{candidate.party}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-foreground">{candidate.voteCount}</span>
                          <span className="text-xs text-muted-foreground ml-1">({pct.toFixed(1)}%)</span>
                        </div>
                      </div>
                      <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, delay: 0.7 + i * 0.1 }}
                          className="h-full gradient-primary rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;