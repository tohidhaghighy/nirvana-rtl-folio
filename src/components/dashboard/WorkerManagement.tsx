import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Users, Clock, Coffee, CheckCircle, XCircle, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  getCurrentJalaliDate,
  getJalaliMonthName,
  getDaysInJalaliMonth,
  formatDateForDB,
  gregorianToJalali,
  formatJalaliDate
} from '@/utils/jalali';

interface Worker {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
}

interface TimeLog {
  id: string;
  worker_id: string;
  date: string;
  hours_worked: number;
  description: string;
  worker_name: string;
}

interface DayOffRequest {
  id: string;
  worker_id: string;
  request_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  worker_name: string;
  created_at: string;
}

interface WorkerSummary {
  worker_id: string;
  worker_name: string;
  total_hours: number;
  days_worked: number;
  approved_days_off: number;
}

export const WorkerManagement: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [dayOffRequests, setDayOffRequests] = useState<DayOffRequest[]>([]);
  const [workerSummaries, setWorkerSummaries] = useState<WorkerSummary[]>([]);
  const [selectedTimeLog, setSelectedTimeLog] = useState<TimeLog | null>(null);
  const [editHours, setEditHours] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentMonth] = useState(getCurrentJalaliDate());

  useEffect(() => {
    fetchWorkers();
    fetchTimeLogs();
    fetchDayOffRequests();
  }, []);

  useEffect(() => {
    if (workers.length && timeLogs.length) {
      calculateWorkerSummaries();
    }
  }, [workers, timeLogs, dayOffRequests]);

  const fetchWorkers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, user_id, full_name, email')
      .eq('role', 'worker');

    if (error) {
      toast({
        title: 'خطا',
        description: 'خطا در دریافت لیست کارگران',
        variant: 'destructive',
      });
      return;
    }

    setWorkers(data || []);
  };

  const fetchTimeLogs = async () => {
    const startDate = formatDateForDB(currentMonth.jy, currentMonth.jm, 1);
    const endDate = formatDateForDB(currentMonth.jy, currentMonth.jm, getDaysInJalaliMonth(currentMonth.jy, currentMonth.jm));

    const { data, error } = await supabase
      .from('time_logs')
      .select(`
        id,
        worker_id,
        date,
        hours_worked,
        description,
        profiles!inner(full_name)
      `)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) {
      toast({
        title: 'خطا',
        description: 'خطا در دریافت ساعات کاری',
        variant: 'destructive',
      });
      return;
    }

    const logsWithNames = (data || []).map(log => ({
      ...log,
      worker_name: log.profiles?.full_name || 'نامشخص'
    }));

    setTimeLogs(logsWithNames);
  };

  const fetchDayOffRequests = async () => {
    const startDate = formatDateForDB(currentMonth.jy, currentMonth.jm, 1);
    const endDate = formatDateForDB(currentMonth.jy, currentMonth.jm, getDaysInJalaliMonth(currentMonth.jy, currentMonth.jm));

    const { data, error } = await supabase
      .from('day_off_requests')
      .select(`
        id,
        worker_id,
        request_date,
        reason,
        status,
        created_at,
        profiles!inner(full_name)
      `)
      .gte('request_date', startDate)
      .lte('request_date', endDate);

    if (error) {
      toast({
        title: 'خطا',
        description: 'خطا در دریافت درخواست‌های مرخصی',
        variant: 'destructive',
      });
      return;
    }

    const requestsWithNames = (data || []).map(request => ({
      ...request,
      worker_name: request.profiles?.full_name || 'نامشخص'
    }));

    setDayOffRequests(requestsWithNames);
  };

  const calculateWorkerSummaries = () => {
    const summaries = workers.map(worker => {
      const workerLogs = timeLogs.filter(log => log.worker_id === worker.user_id);
      const workerDayOffs = dayOffRequests.filter(
        req => req.worker_id === worker.user_id && req.status === 'approved'
      );

      return {
        worker_id: worker.user_id,
        worker_name: worker.full_name || 'نامشخص',
        total_hours: workerLogs.reduce((sum, log) => sum + Number(log.hours_worked), 0),
        days_worked: workerLogs.length,
        approved_days_off: workerDayOffs.length,
      };
    });

    setWorkerSummaries(summaries);
  };

  const updateTimeLog = async () => {
    if (!selectedTimeLog) return;

    const { error } = await supabase
      .from('time_logs')
      .update({
        hours_worked: parseFloat(editHours),
        description: editDescription,
      })
      .eq('id', selectedTimeLog.id);

    if (error) {
      toast({
        title: 'خطا',
        description: 'خطا در بروزرسانی ساعات کاری',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'موفقیت',
      description: 'ساعات کاری بروزرسانی شد',
    });

    setIsEditDialogOpen(false);
    fetchTimeLogs();
  };

  const handleDayOffRequest = async (requestId: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('day_off_requests')
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        admin_notes: adminNotes || null,
      })
      .eq('id', requestId);

    if (error) {
      toast({
        title: 'خطا',
        description: 'خطا در بروزرسانی درخواست مرخصی',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'موفقیت',
      description: `درخواست مرخصی ${status === 'approved' ? 'تایید' : 'رد'} شد`,
    });

    setAdminNotes('');
    fetchDayOffRequests();
  };

  const openEditDialog = (timeLog: TimeLog) => {
    setSelectedTimeLog(timeLog);
    setEditHours(timeLog.hours_worked.toString());
    setEditDescription(timeLog.description || '');
    setIsEditDialogOpen(true);
  };

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    const jalali = gregorianToJalali(date);
    return formatJalaliDate(jalali);
  };

  const pendingRequests = dayOffRequests.filter(req => req.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">مدیریت کارگران</h2>
        <Badge variant="outline">
          {getJalaliMonthName(currentMonth.jm)} {currentMonth.jy}
        </Badge>
      </div>

      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">خلاصه کارگران</TabsTrigger>
          <TabsTrigger value="time-logs">ساعات کاری</TabsTrigger>
          <TabsTrigger value="day-off-requests">درخواست‌های مرخصی</TabsTrigger>
          <TabsTrigger value="pending">
            در انتظار بررسی ({pendingRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                خلاصه عملکرد کارگران
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>نام کارگر</TableHead>
                    <TableHead>مجموع ساعات</TableHead>
                    <TableHead>روزهای کاری</TableHead>
                    <TableHead>مرخصی‌های تایید شده</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workerSummaries.map((summary) => (
                    <TableRow key={summary.worker_id}>
                      <TableCell className="font-medium">{summary.worker_name}</TableCell>
                      <TableCell>{summary.total_hours} ساعت</TableCell>
                      <TableCell>{summary.days_worked} روز</TableCell>
                      <TableCell>{summary.approved_days_off} روز</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time-logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                ساعات کاری ثبت شده
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>نام کارگر</TableHead>
                    <TableHead>تاریخ</TableHead>
                    <TableHead>ساعات کاری</TableHead>
                    <TableHead>توضیحات</TableHead>
                    <TableHead>عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.worker_name}</TableCell>
                      <TableCell>{formatDateDisplay(log.date)}</TableCell>
                      <TableCell>{log.hours_worked} ساعت</TableCell>
                      <TableCell>{log.description || '-'}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(log)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="day-off-requests">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="h-5 w-5" />
                همه درخواست‌های مرخصی
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>نام کارگر</TableHead>
                    <TableHead>تاریخ مرخصی</TableHead>
                    <TableHead>دلیل</TableHead>
                    <TableHead>وضعیت</TableHead>
                    <TableHead>تاریخ درخواست</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dayOffRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.worker_name}</TableCell>
                      <TableCell>{formatDateDisplay(request.request_date)}</TableCell>
                      <TableCell>{request.reason}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.status === 'approved' ? 'default' :
                            request.status === 'rejected' ? 'destructive' : 'outline'
                          }
                        >
                          {request.status === 'pending' ? 'در انتظار' :
                           request.status === 'approved' ? 'تایید شده' : 'رد شده'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDateDisplay(request.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="h-5 w-5" />
                درخواست‌های در انتظار بررسی
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>نام کارگر</TableHead>
                    <TableHead>تاریخ مرخصی</TableHead>
                    <TableHead>دلیل</TableHead>
                    <TableHead>تاریخ درخواست</TableHead>
                    <TableHead>عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.worker_name}</TableCell>
                      <TableCell>{formatDateDisplay(request.request_date)}</TableCell>
                      <TableCell>{request.reason}</TableCell>
                      <TableCell>{formatDateDisplay(request.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleDayOffRequest(request.id, 'approved')}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDayOffRequest(request.id, 'rejected')}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ویرایش ساعات کاری</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-hours">ساعات کاری</Label>
              <Input
                id="edit-hours"
                type="number"
                step="0.5"
                value={editHours}
                onChange={(e) => setEditHours(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">توضیحات</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
            <Button onClick={updateTimeLog} className="w-full">
              بروزرسانی
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};