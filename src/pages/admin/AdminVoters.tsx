import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, CheckCircle, XCircle, Clock, Vote, Shield } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import AdminSidebar from '../../components/AdminSidebar';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const AdminVoters: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'voted' | 'not-voted'>('all');
  const { voters, updateVoterStatus } = useAppStore();

  const filtered = voters.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase()) ||
      v.nationalId.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' ? true : filter === 'voted' ? v.hasVoted : !v.hasVoted;
    return matchSearch && matchFilter;
  });

  const handleStatusChange = (id: string, status: 'approved' | 'rejected', name: string) => {
    updateVoterStatus(id, status);
    toast.success(`Voter "${name}" ${status}.`);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-1">Voter Management</h1>
            <p className="text-muted-foreground text-sm">{voters.length} registered voters</p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or national ID..."
                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white transition-all duration-200"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'voted', 'not-voted'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    filter === f
                      ? 'gradient-primary text-white'
                      : 'bg-white border border-border text-foreground hover:bg-secondary'
                  }`}
                >
                  {f === 'all' ? 'All' : f === 'voted' ? 'Voted' : 'Not Voted'}
                </button>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-border overflow-hidden">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-medium">No voters found</p>
                <p className="text-sm mt-1">Try adjusting your search or filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Voter</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">National ID</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Registered</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vote</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((voter) => (
                      <tr key={voter.id} className="hover:bg-secondary/20 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">{voter.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{voter.name}</p>
                              <p className="text-xs text-muted-foreground">{voter.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono text-foreground">{voter.nationalId}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">{format(new Date(voter.registeredAt), 'MMM d, yyyy')}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            voter.status === 'approved' ? 'bg-green-100 text-green-700' :
                            voter.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {voter.status === 'approved' ? <CheckCircle className="w-3 h-3" /> :
                             voter.status === 'rejected' ? <XCircle className="w-3 h-3" /> :
                             <Clock className="w-3 h-3" />}
                            {voter.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            {voter.hasVoted ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                <Vote className="w-3 h-3" />
                                Voted
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">Not voted</span>
                            )}
                            {voter.faceDescriptor && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                <Shield className="w-3 h-3" />
                                Face
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {voter.status !== 'approved' && (
                              <button
                                onClick={() => handleStatusChange(voter.id, 'approved', voter.name)}
                                className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200"
                                title="Approve"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {voter.status !== 'rejected' && (
                              <button
                                onClick={() => handleStatusChange(voter.id, 'rejected', voter.name)}
                                className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                                title="Reject"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminVoters;