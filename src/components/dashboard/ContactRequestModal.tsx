import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar,
  Save
} from "lucide-react";

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

interface ContactRequestModalProps {
  submission: ContactSubmission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const ContactRequestModal = ({ submission, open, onOpenChange, onUpdate }: ContactRequestModalProps) => {
  const { toast } = useToast();
  const [status, setStatus] = useState(submission?.status || 'pending');
  const [adminNotes, setAdminNotes] = useState(submission?.admin_notes || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!submission) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({
          status,
          admin_notes: adminNotes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', submission.id);

      if (error) throw error;

      toast({
        title: "ذخیره شد",
        description: "تغییرات با موفقیت ذخیره شد.",
      });

      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "خطا",
        description: "خطا در ذخیره تغییرات",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">در انتظار</Badge>;
      case 'in_progress':
        return <Badge variant="outline">در حال بررسی</Badge>;
      case 'resolved':
        return <Badge variant="default">حل شده</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!submission) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="persian-heading text-xl">
            جزئیات درخواست
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="persian-body text-sm text-muted-foreground">نام</p>
                <p className="persian-body font-medium">{submission.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="persian-body text-sm text-muted-foreground">ایمیل</p>
                <p className="persian-body font-medium ltr-content">{submission.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="persian-body text-sm text-muted-foreground">تلفن</p>
                <p className="persian-body font-medium ltr-content">{submission.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="persian-body text-sm text-muted-foreground">تاریخ ارسال</p>
                <p className="persian-body font-medium">
                  {new Date(submission.created_at).toLocaleDateString('fa-IR')}
                </p>
              </div>
            </div>
          </div>

          {/* Subject */}
          <div>
            <p className="persian-body text-sm text-muted-foreground mb-2">موضوع</p>
            <p className="persian-body font-medium text-lg">{submission.subject}</p>
          </div>

          {/* Message */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
              <p className="persian-body text-sm text-muted-foreground">پیام</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="persian-body whitespace-pre-wrap leading-relaxed">
                {submission.message}
              </p>
            </div>
          </div>

          {/* Admin Controls */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="persian-heading text-lg font-semibold">مدیریت درخواست</h3>
            
            {/* Status */}
            <div className="space-y-2">
              <Label className="persian-body">وضعیت</Label>
              <div className="flex items-center gap-4">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">در انتظار</SelectItem>
                    <SelectItem value="in_progress">در حال بررسی</SelectItem>
                    <SelectItem value="resolved">حل شده</SelectItem>
                  </SelectContent>
                </Select>
                {getStatusBadge(status)}
              </div>
            </div>

            {/* Admin Notes */}
            <div className="space-y-2">
              <Label className="persian-body">یادداشت ادمین</Label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="یادداشت‌های خود را اینجا بنویسید..."
                className="min-h-24"
              />
              <p className="persian-body text-xs text-muted-foreground">
                این یادداشت برای کاربر نمایش داده خواهد شد
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              انصراف
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                "در حال ذخیره..."
              ) : (
                <>
                  <Save className="w-4 h-4 ml-1" />
                  ذخیره تغییرات
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactRequestModal;