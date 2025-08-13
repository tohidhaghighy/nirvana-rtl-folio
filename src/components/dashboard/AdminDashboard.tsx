import { useState, useEffect } from "react";
import { 
  Users, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Settings,
  LogOut,
  Eye,
  Edit
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/hooks/useAuthStore";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ContactRequestModal from "./ContactRequestModal";

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

interface AdminDashboardProps {
  profile: Profile;
}

const AdminDashboard = ({ profile }: AdminDashboardProps) => {
  const { signOut } = useAuthStore();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
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

    // Set up real-time subscription
    const channel = supabase
      .channel('contact_submissions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_submissions'
        },
        () => {
          fetchSubmissions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    inProgress: submissions.filter(s => s.status === 'in_progress').length,
    resolved: submissions.filter(s => s.status === 'resolved').length,
  };

  const openSubmissionModal = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setModalOpen(true);
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
    <>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="persian-heading text-3xl font-bold text-foreground mb-2">
              پنل مدیریت
            </h1>
            <p className="persian-body text-muted-foreground">
              خوش آمدید {profile.full_name || 'ادمین'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 ml-1" />
              تنظیمات
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

        {/* Main Content */}
        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="submissions" className="persian-body">درخواست‌ها</TabsTrigger>
            <TabsTrigger value="users" className="persian-body">کاربران</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions">
            <Card>
              <div className="p-6">
                <h2 className="persian-heading text-xl font-semibold text-foreground mb-6">
                  درخواست‌های تماس
                </h2>
                
                {submissions.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="persian-body text-muted-foreground">
                      هنوز درخواستی ارسال نشده است
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <Card key={submission.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="persian-heading font-medium text-foreground">
                                {submission.name}
                              </h3>
                              {getStatusBadge(submission.status)}
                            </div>
                            <p className="persian-body text-sm text-muted-foreground mb-1">
                              {submission.email} • {submission.phone}
                            </p>
                            <p className="persian-body font-medium text-sm mb-2">
                              {submission.subject}
                            </p>
                            <p className="persian-body text-sm text-muted-foreground line-clamp-2">
                              {submission.message}
                            </p>
                            <p className="persian-body text-xs text-muted-foreground mt-2">
                              {new Date(submission.created_at).toLocaleDateString('fa-IR')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openSubmissionModal(submission)}
                            >
                              <Eye className="w-4 h-4 ml-1" />
                              مشاهده
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="p-6">
              <h2 className="persian-heading text-xl font-semibold text-foreground mb-6">
                مدیریت کاربران
              </h2>
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="persian-body text-muted-foreground">
                  بخش مدیریت کاربران به زودی اضافه خواهد شد
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Contact Request Modal */}
      <ContactRequestModal
        submission={selectedSubmission}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onUpdate={fetchSubmissions}
      />
    </>
  );
};

export default AdminDashboard;