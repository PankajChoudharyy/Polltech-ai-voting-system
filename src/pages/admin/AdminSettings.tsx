import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { Settings, Save, Calendar } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import AdminSidebar from '../../components/AdminSidebar';

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description required'),
  startDate: z.string().min(1, 'Start date required'),
  endDate: z.string().min(1, 'End date required'),
  status: z.enum(['upcoming', 'active', 'closed'])
});

type FormData = z.infer<typeof schema>;

const AdminSettings: React.FC = () => {
  const { election, updateElection } = useAppStore();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: election.title,
      description: election.description,
      startDate: election.startDate,
      endDate: election.endDate,
      status: election.status
    }
  });

  const onSubmit = (data: FormData) => {
    updateElection(data);
    toast.success('Election settings updated successfully.');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-1">Election Settings</h1>
            <p className="text-muted-foreground text-sm">Configure the active election parameters</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-border p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-heading font-semibold text-foreground">Election Configuration</h2>
                <p className="text-xs text-muted-foreground">Changes take effect immediately</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Election Title</label>
                <input
                  {...register('title')}
                  type="text"
                  className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                />
                {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200 resize-none"
                />
                {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    <Calendar className="w-3.5 h-3.5 inline mr-1" />
                    Start Date
                  </label>
                  <input
                    {...register('startDate')}
                    type="date"
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                  />
                  {errors.startDate && <p className="text-xs text-destructive mt-1">{errors.startDate.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    <Calendar className="w-3.5 h-3.5 inline mr-1" />
                    End Date
                  </label>
                  <input
                    {...register('endDate')}
                    type="date"
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                  />
                  {errors.endDate && <p className="text-xs text-destructive mt-1">{errors.endDate.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Election Status</label>
                <select
                  {...register('status')}
                  className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200 bg-white"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
                {errors.status && <p className="text-xs text-destructive mt-1">{errors.status.message}</p>}
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl gradient-primary hover:opacity-90 hover:scale-105 transition-all duration-200"
              >
                <Save className="w-4 h-4" />
                Save Settings
              </button>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;