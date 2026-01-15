import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { ApplicationList } from '@/components/applications/ApplicationList';
import { useAuth } from '@/hooks/useAuth';
import { AuthPage } from '@/components/auth/AuthPage';

export default function ApplicationsDetail() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const selectedDate = date ? parseISO(date) : new Date();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        {/* Back button and title */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Kalender
          </Button>
          <h1 className="text-2xl font-bold">
            Lamaran - {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: id })}
          </h1>
        </div>

        {/* Application list */}
        <div className="bg-card rounded-2xl shadow-lg border p-6">
          <ApplicationList 
            selectedDate={selectedDate} 
            onClose={() => navigate('/')} 
          />
        </div>
      </main>
    </div>
  );
}
