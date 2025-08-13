import { useEffect, useState } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import ClientDashboard from "@/components/dashboard/ClientDashboard";
import { Loader2 } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        setProfile(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="persian-body text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="persian-body text-muted-foreground">خطا در بارگذاری پروفایل</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {profile.role === 'admin' ? (
        <AdminDashboard profile={profile} />
      ) : (
        <ClientDashboard profile={profile} />
      )}
    </div>
  );
};

export default Dashboard;