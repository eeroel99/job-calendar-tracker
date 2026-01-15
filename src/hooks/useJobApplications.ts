import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { JobApplication, ApplicationStatus } from '@/types/job-application';
import { useToast } from '@/hooks/use-toast';

export function useJobApplications() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: applications = [], isLoading, error } = useQuery({
    queryKey: ['job-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('apply_date', { ascending: false });

      if (error) throw error;
      return data as JobApplication[];
    },
  });

  const createApplication = useMutation({
    mutationFn: async (newApp: Omit<JobApplication, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('job_applications')
        .insert({
          ...newApp,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      toast({
        title: 'Berhasil!',
        description: 'Lamaran berhasil ditambahkan.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateApplication = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<JobApplication> & { id: string }) => {
      const { data, error } = await supabase
        .from('job_applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      toast({
        title: 'Berhasil!',
        description: 'Lamaran berhasil diupdate.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteApplication = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      toast({
        title: 'Berhasil!',
        description: 'Lamaran berhasil dihapus.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const getApplicationsByDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return applications.filter(app => app.apply_date === dateStr);
  };

  const getApplicationCountByDate = (date: Date) => {
    return getApplicationsByDate(date).length;
  };

  const searchApplications = (query: string) => {
    if (!query.trim()) return applications;
    const lowerQuery = query.toLowerCase();
    return applications.filter(app => 
      app.company_name.toLowerCase().includes(lowerQuery)
    );
  };

  const getStats = () => {
    const total = applications.length;
    const byStatus = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<ApplicationStatus, number>);

    const thisMonth = applications.filter(app => {
      const appDate = new Date(app.apply_date);
      const now = new Date();
      return appDate.getMonth() === now.getMonth() && 
             appDate.getFullYear() === now.getFullYear();
    }).length;

    const successRate = total > 0 
      ? Math.round((byStatus.accepted || 0) / total * 100) 
      : 0;

    return { total, byStatus, thisMonth, successRate };
  };

  return {
    applications,
    isLoading,
    error,
    createApplication,
    updateApplication,
    deleteApplication,
    getApplicationsByDate,
    getApplicationCountByDate,
    searchApplications,
    getStats,
  };
}
