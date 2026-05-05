import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { Plus, Trash2, Trophy, X } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import AdminSidebar from '../../components/AdminSidebar';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  party: z.string().min(2, 'Party required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  imageUrl: z.string().url('Must be a valid URL')
});

type FormData = z.infer<typeof schema>;

const AdminCandidates: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const { candidates, addCandidate, removeCandidate } = useAppStore();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
    }
  });

  const onSubmit = (data: FormData) => {
    addCandidate(data);
    toast.success(`Candidate "${data.name}" added successfully.`);
    reset();
    setShowForm(false);
  };

  const handleRemove = (id: string, name: string) => {
    removeCandidate(id);
    toast.success(`Candidate "${name}" removed.`);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl font-bold text-foreground mb-1">Candidates</h1>
              <p className="text-muted-foreground text-sm">{candidates.length} candidates registered</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl gradient-primary hover:opacity-90 hover:scale-105 transition-all duration-200"
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? 'Cancel' : 'Add Candidate'}
            </button>
          </motion.div>

          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h2 className="font-heading text-lg font-semibold text-foreground mb-6">Add New Candidate</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                      <input
                        {...register('name')}
                        type="text"
                        placeholder="Candidate full name"
                        className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                      />
                      {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Political Party</label>
                      <input
                        {...register('party')}
                        type="text"
                        placeholder="Party name"
                        className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                      />
                      {errors.party && <p className="text-xs text-destructive mt-1">{errors.party.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                      <textarea
                        {...register('description')}
                        rows={3}
                        placeholder="Brief candidate biography and platform..."
                        className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200 resize-none"
                      />
                      {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-1.5">Photo URL</label>
                      <input
                        {...register('imageUrl')}
                        type="url"
                        placeholder="https://..."
                        className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                      />
                      {errors.imageUrl && <p className="text-xs text-destructive mt-1">{errors.imageUrl.message}</p>}
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl gradient-primary hover:opacity-90 hover:scale-105 transition-all duration-200"
                      >
                        <Plus className="w-4 h-4" />
                        Add Candidate
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate, i) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={candidate.imageUrl}
                    alt={candidate.name}
                    width={400}
                    height={200}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-foreground shadow-sm">
                      {candidate.voteCount} votes
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">{candidate.name}</h3>
                      <p className="text-xs text-primary font-medium mt-0.5">{candidate.party}</p>
                    </div>
                    <Trophy className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{candidate.description}</p>
                  <button
                    onClick={() => handleRemove(candidate.id, candidate.name)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-destructive border border-destructive/20 rounded-lg hover:bg-destructive/5 transition-all duration-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove Candidate
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {candidates.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium">No candidates yet</p>
              <p className="text-sm mt-1">Add your first candidate using the button above.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminCandidates;