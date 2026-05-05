import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Download, Vote } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import AdminSidebar from '../../components/AdminSidebar';
import { format } from 'date-fns';

const AdminRecords: React.FC = () => {
  const [search, setSearch] = useState('');
  const { voteRecords, candidates } = useAppStore();

  const filtered = voteRecords.filter(r =>
    r.voterName.toLowerCase().includes(search.toLowerCase()) ||
    r.voterEmail.toLowerCase().includes(search.toLowerCase()) ||
    r.candidateName.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const candidateColors: Record<string, string> = {};
  const colors = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-green-100 text-green-700', 'bg-orange-100 text-orange-700', 'bg-red-100 text-red-700'];
  candidates.forEach((c, i) => { candidateColors[c.id] = colors[i % colors.length]; });

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl font-bold text-foreground mb-1">Vote Records</h1>
              <p className="text-muted-foreground text-sm">{voteRecords.length} total votes recorded</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground border border-border rounded-xl hover:bg-secondary transition-all duration-200">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </motion.div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by voter name, email, or candidate..."
              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white transition-all duration-200"
            />
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-border overflow-hidden">
            {sorted.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-medium">No vote records found</p>
                <p className="text-sm mt-1">Records will appear here once voters cast their ballots.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Record ID</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Voter</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Voted For</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sorted.map((record) => (
                      <tr key={record.id} className="hover:bg-secondary/20 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <span className="text-xs font-mono text-muted-foreground">{record.id.slice(0, 12)}...</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">{record.voterName.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{record.voterName}</p>
                              <p className="text-xs text-muted-foreground">{record.voterEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${candidateColors[record.candidateId] || 'bg-secondary text-foreground'}`}>
                            <Vote className="w-3 h-3" />
                            {record.candidateName}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">{format(new Date(record.timestamp), 'MMM d, yyyy HH:mm:ss')}</span>
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

export default AdminRecords;