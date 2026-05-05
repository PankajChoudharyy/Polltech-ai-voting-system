import React from 'react';
import { motion } from 'framer-motion';
import { Users, Vote, Trophy, Activity, TrendingUp, Clock } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import AdminSidebar from '../../components/AdminSidebar';
import StatsCard from '../../components/StatsCard';
import VoteChart from '../../components/VoteChart';
import { format } from 'date-fns';

const AdminDashboard: React.FC = () => {
  const { voters, candidates, voteRecords, election } = useAppStore();

  const totalVoters = voters.length;
  const votedCount = voters.filter(v => v.hasVoted).length;
  const turnout = totalVoters > 0 ? ((votedCount / totalVoters) * 100).toFixed(1) : '0.0';
  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
  const leadingCandidate = [...candidates].sort((a, b) => b.voteCount - a.voteCount)[0];

  const recentRecords = [...voteRecords].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 5);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-1">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              {election.title} — Status: <span className={`font-medium ${election.status === 'active' ? 'text-green-600' : 'text-orange-600'}`}>{election.status}</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Total Voters" value={totalVoters} subtitle="Registered accounts" icon={Users} color="blue" delay={0} />
            <StatsCard title="Votes Cast" value={totalVotes} subtitle={`${turnout}% turnout`} icon={Vote} color="purple" delay={0.1} />
            <StatsCard title="Candidates" value={candidates.length} subtitle="Active candidates" icon={Trophy} color="green" delay={0.2} />
            <StatsCard title="Participation" value={`${turnout}%`} subtitle={`${votedCount} of ${totalVoters} voted`} icon={Activity} color="orange" delay={0.3} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg font-semibold text-foreground">Vote Distribution</h2>
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
              </div>
              <VoteChart candidates={candidates} type="bar" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg font-semibold text-foreground">Vote Share</h2>
                <Activity className="w-5 h-5 text-muted-foreground" />
              </div>
              <VoteChart candidates={candidates} type="pie" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-2 bg-white rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg font-semibold text-foreground">Recent Votes</h2>
                <Clock className="w-5 h-5 text-muted-foreground" />
              </div>
              {recentRecords.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Vote className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No votes cast yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border">
                      <div>
                        <p className="text-sm font-medium text-foreground">{record.voterName}</p>
                        <p className="text-xs text-muted-foreground">{record.voterEmail}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary">{record.candidateName}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(record.timestamp), 'MMM d, HH:mm')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-heading text-lg font-semibold text-foreground mb-4">Candidate Standings</h2>
              <div className="space-y-4">
                {[...candidates].sort((a, b) => b.voteCount - a.voteCount).map((candidate, i) => {
                  const pct = totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(1) : '0.0';
                  return (
                    <div key={candidate.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-muted-foreground w-4">#{i + 1}</span>
                          <span className="text-sm font-medium text-foreground truncate">{candidate.name.split(' ')[0]}</span>
                        </div>
                        <span className="text-sm font-bold text-foreground">{candidate.voteCount}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.8 + i * 0.1 }}
                          className="h-full gradient-primary rounded-full"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{pct}%</p>
                    </div>
                  );
                })}
              </div>

              {leadingCandidate && totalVotes > 0 && (
                <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">Current Leader</p>
                  <p className="font-heading font-bold text-primary">{leadingCandidate.name}</p>
                  <p className="text-xs text-muted-foreground">{leadingCandidate.voteCount} votes</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;