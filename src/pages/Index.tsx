import { useAuth } from "@/hooks/useAuth";
import { AuthPage } from "@/components/auth/AuthPage";
import { Header } from "@/components/layout/Header";
import { CalendarView } from "@/components/calendar/CalendarView";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ExportButton } from "@/components/export/ExportButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, LayoutDashboard, Loader2 } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();

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
            <CalendarView />
          </TabsContent>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
