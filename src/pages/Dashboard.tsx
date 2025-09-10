import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Activity, Camera, TrendingUp, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardStats {
  totalImages: number;
  malariaImages: number;
  leptospirosisImages: number;
  recentUploads: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalImages: 0,
    malariaImages: 0,
    leptospirosisImages: 0,
    recentUploads: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      // Get total images
      const { count: totalImages } = await supabase
        .from('images')
        .select('*', { count: 'exact', head: true });

      // Get malaria images
      const { count: malariaImages } = await supabase
        .from('images')
        .select('*', { count: 'exact', head: true })
        .eq('disease', 'malaria');

      // Get leptospirosis images
      const { count: leptospirosisImages } = await supabase
        .from('images')
        .select('*', { count: 'exact', head: true })
        .eq('disease', 'leptospirosis');

      // Get recent uploads (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: recentUploads } = await supabase
        .from('images')
        .select('*', { count: 'exact', head: true })
        .gte('uploaded_at', sevenDaysAgo.toISOString());

      setStats({
        totalImages: totalImages || 0,
        malariaImages: malariaImages || 0,
        leptospirosisImages: leptospirosisImages || 0,
        recentUploads: recentUploads || 0,
      });
    };

    fetchStats();
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Surveillance Dashboard</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Monitor and track malaria and leptospirosis surveillance data. Upload images, 
          calculate indices, and manage disease monitoring activities.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Images</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalImages}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Malaria Images</CardTitle>
            <Activity className="h-4 w-4 text-malaria" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-malaria">{stats.malariaImages}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leptospirosis Images</CardTitle>
            <Users className="h-4 w-4 text-leptospirosis" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-leptospirosis">{stats.leptospirosisImages}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentUploads}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-malaria/20 hover:border-malaria/40 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-malaria" />
              <span>Malaria Surveillance</span>
            </CardTitle>
            <CardDescription>
              Monitor mosquito populations and calculate malaria vector indices including 
              House Index, Container Index, and Breteau Index.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/malaria">
              <Button className="w-full bg-malaria hover:bg-malaria/90 text-malaria-foreground">
                Access Malaria Section
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-leptospirosis/20 hover:border-leptospirosis/40 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-leptospirosis" />
              <span>Leptospirosis Surveillance</span>
            </CardTitle>
            <CardDescription>
              Track rodent populations and environmental factors. Upload images and 
              calculate rodent indices for leptospirosis risk assessment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/leptospirosis">
              <Button className="w-full bg-leptospirosis hover:bg-leptospirosis/90 text-leptospirosis-foreground">
                Access Leptospirosis Section
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;