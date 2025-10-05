import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, Users, Award, MessageSquare } from 'lucide-react';
import StudentManagement from '@/components/coordinator/StudentManagement';
import EventCalendar from '@/components/coordinator/EventCalendar';
import CertificateManagement from '@/components/coordinator/CertificateManagement';
import ReportGeneration from '@/components/coordinator/ReportGeneration';
import OrganizationContact from '@/components/coordinator/OrganizationContact';
import { useAuth } from '@/contexts/AuthContext';

const CoordinatorDashboard = () => {
  const { user } = useAuth();
  const [coordinator, setCoordinator] = useState<any>(null);
  const [school, setSchool] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoordinatorData();
  }, [user]);

  const fetchCoordinatorData = async () => {
    if (!user?.email) return;

    try {
      const { data: coordData } = await supabase
        .from('Coordinator')
        .select('*, School(*)')
        .eq('email', user.email)
        .single();

      if (coordData) {
        setCoordinator(coordData);
        setSchool(coordData.School);
      } else {
        // Mock coordinator data for demo
        const mockCoordinator = {
          id: 'mock-coordinator-1',
          name: user.name || 'Demo Koordynator',
          email: user.email,
          schoolId: 'mock-school-1',
          School: {
            id: 'mock-school-1',
            name: 'Szkoła Demonstracyjna',
          }
        };
        setCoordinator(mockCoordinator);
        setSchool(mockCoordinator.School);
      }
    } catch (error) {
      console.error('Error fetching coordinator:', error);
      // Use mock data on error
      const mockCoordinator = {
        id: 'mock-coordinator-1',
        name: user.name || 'Demo Koordynator',
        email: user.email,
        schoolId: 'mock-school-1',
        School: {
          id: 'mock-school-1',
          name: 'Szkoła Demonstracyjna',
        }
      };
      setCoordinator(mockCoordinator);
      setSchool(mockCoordinator.School);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Panel Koordynatora">
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-muted-foreground">Ładowanie...</p>
        </div>
      </Layout>
    );
  }


  return (
    <Layout title="Panel Koordynatora">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Panel Koordynatora Wolontariatu</h1>
          <p className="text-muted-foreground">
            {coordinator.name} • {school?.name || 'Brak szkoły'}
          </p>
        </div>

        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Uczniowie</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Kalendarz</span>
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Zaświadczenia</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Kontakt</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Raporty</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4">
            <StudentManagement schoolId={coordinator.schoolId} />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <EventCalendar coordinatorId={coordinator.id} schoolId={coordinator.schoolId} />
          </TabsContent>

          <TabsContent value="certificates" className="space-y-4">
            <CertificateManagement schoolId={coordinator.schoolId} />
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <OrganizationContact coordinatorId={coordinator.id} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <ReportGeneration schoolId={coordinator.schoolId} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CoordinatorDashboard;
