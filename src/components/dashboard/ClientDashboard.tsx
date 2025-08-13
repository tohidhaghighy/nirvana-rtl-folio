import { useState, useEffect } from "react";
import { 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  LogOut,
  Plus,
  FileText
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/hooks/useAuthStore";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  user_id: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface ClientDashboardProps {
  profile: Profile;
}

const ClientDashboard = ({ profile }: ClientDashboardProps) => {
  const { signOut, user } = useAuthStore();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error: any) {
      toast({
        title: "خطا",
        description: "خطا در بارگذاری درخواست‌ها",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();

    // Set up real-time subscription for user's own submissions
    const channel = supabase
      .channel('user_contact_submissions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_submissions',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          fetchSubmissions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleLogout = async () => {
    await signOut();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="persian-body">در انتظار</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="persian-body">در حال بررسی</Badge>;
      case 'resolved':
        return <Badge variant="default" className="persian-body">حل شده</Badge>;
      default:
        return <Badge variant="secondary" className="persian-body">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'in_progress':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    inProgress: submissions.filter(s => s.status === 'in_progress').length,
    resolved: submissions.filter(s => s.status === 'resolved').length,
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="persian-body text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="persian-heading text-3xl font-bold text-foreground mb-2">
            داشبورد شما
          </h1>
          <p className="persian-body text-muted-foreground">
            خوش آمدید {profile.full_name || 'کاربر عزیز'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" asChild>
            <a href="/contact">
              <Plus className="w-4 h-4 ml-1" />
              درخواست جدید
            </a>
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 ml-1" />
            خروج
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="persian-body text-sm text-muted-foreground mb-1">کل درخواست‌ها</p>
              <p className="persian-heading text-3xl font-bold text-foreground">{stats.total}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="persian-body text-sm text-muted-foreground mb-1">در انتظار</p>
              <p className="persian-heading text-3xl font-bold text-orange-500">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="persian-body text-sm text-muted-foreground mb-1">در حال بررسی</p>
              <p className="persian-heading text-3xl font-bold text-blue-500">{stats.inProgress}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="persian-body text-sm text-muted-foreground mb-1">حل شده</p>
              <p className="persian-heading text-3xl font-bold text-green-500">{stats.resolved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Submissions List */}
      <Card>
        <div className="p-6">
          <h2 className="persian-heading text-xl font-semibold text-foreground mb-6">
            درخواست‌های شما
          </h2>
          
          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="persian-body text-muted-foreground mb-4">
                شما هنوز درخواستی ارسال نکرده‌اید
              </p>
              <Button asChild>
                <a href="/contact">
                  <Plus className="w-4 h-4 ml-1" />
                  ارسال اولین درخواست
                </a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <Card key={submission.id} className="p-4 border-l-4 border-l-primary">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getStatusIcon(submission.status)}
                        <h3 className="persian-heading font-medium text-foreground">
                          {submission.subject}
                        </h3>
                        {getStatusBadge(submission.status)}
                      </div>
                      
                      <p className="persian-body text-sm text-muted-foreground line-clamp-2 mb-3">
                        {submission.message}
                      </p>
                      
                      {submission.admin_notes && (
                        <div className="bg-muted p-3 rounded-lg mb-3">
                          <p className="persian-body text-sm font-medium text-foreground mb-1">
                            پاسخ ادمین:
                          </p>
                          <p className="persian-body text-sm text-muted-foreground">
                            {submission.admin_notes}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span className="persian-body">
                          ارسال شده: {new Date(submission.created_at).toLocaleDateString('fa-IR')}
                        </span>
                        {submission.updated_at !== submission.created_at && (
                          <span className="persian-body">
                            آخرین بروزرسانی: {new Date(submission.updated_at).toLocaleDateString('fa-IR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ClientDashboard;