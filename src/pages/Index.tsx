import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthPage } from "@/components/auth/AuthPage";
import { Header } from "@/components/layout/Header";
import { CalendarView } from "@/components/calendar/CalendarView";
import { ApplicationList } from "@/components/applications/ApplicationList";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ExportButton } from "@/components/export/ExportButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, LayoutDashboard, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const Index = () => {
  const { user, loading } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedDate(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-primary">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="calendar" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="calendar" className="gap-2">
                <Calendar className="h-4 w-4" />
                Kalender
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
            </TabsList>

            <ExportButton />
          </div>

          <TabsContent value="calendar" className="space-y-6">
            <CalendarView selectedDate={selectedDate} onDateSelect={handleDateSelect} />
          </TabsContent>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialog for Application List */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {selectedDate && format(selectedDate, 'EEEE, dd MMMM yyyy', { locale: id })}
            </DialogTitle>
          </DialogHeader>
          {selectedDate && (
            <ApplicationList selectedDate={selectedDate} onClose={handleCloseDialog} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
