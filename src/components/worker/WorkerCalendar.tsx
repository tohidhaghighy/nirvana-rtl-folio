import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Coffee, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/hooks/useAuthStore';
import {
  getCurrentJalaliDate,
  getJalaliMonthName,
  getDaysInJalaliMonth,
  jalaliToGregorian,
  formatDateForDB,
  gregorianToJalali
} from '@/utils/jalali';

interface TimeLog {
  id: string;
  date: string;
  hours_worked: number;
  description: string;
}

interface DayOffRequest {
  id: string;
  request_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const WorkerCalendar: React.FC = () => {
  const { user } = useAuthStore();
  const [currentMonth] = useState(getCurrentJalaliDate());
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [dayOffRequests, setDayOffRequests] = useState<DayOffRequest[]>([]);
  const [selectedDate, setSelectedDate] = useState<{ jy: number; jm: number; jd: number } | null>(null);
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [dayOffReason, setDayOffReason] = useState('');
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [isDayOffDialogOpen, setIsDayOffDialogOpen] = useState(false);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    if (user) {
      fetchTimeLogs();
      fetchDayOffRequests();
    }
  }, [user]);

  const fetchTimeLogs = async () => {
    if (!user) return;

    const startDate = formatDateForDB(currentMonth.jy, currentMonth.jm, 1);
    const endDate = formatDateForDB(currentMonth.jy, currentMonth.jm, getDaysInJalaliMonth(currentMonth.jy, currentMonth.jm));

    const { data, error } = await supabase
      .from('time_logs')
      .select('*')
      .eq('worker_id', user.id)
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

    setTimeLogs(data || []);
    const total = (data || []).reduce((sum, log) => sum + Number(log.hours_worked), 0);
    setTotalHours(total);
  };

  const fetchDayOffRequests = async () => {
    if (!user) return;

    const startDate = formatDateForDB(currentMonth.jy, currentMonth.jm, 1);
    const endDate = formatDateForDB(currentMonth.jy, currentMonth.jm, getDaysInJalaliMonth(currentMonth.jy, currentMonth.jm));

    const { data, error } = await supabase
      .from('day_off_requests')
      .select('*')
      .eq('worker_id', user.id)
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

    const typedData = (data || []).map(request => ({
      ...request,
      status: request.status as 'pending' | 'approved' | 'rejected'
    }));
    setDayOffRequests(typedData);
  };

  const saveTimeLog = async () => {
    if (!user || !selectedDate || !hours) return;

    const dateStr = formatDateForDB(selectedDate.jy, selectedDate.jm, selectedDate.jd);
    const existingLog = timeLogs.find(log => log.date === dateStr);

    const logData = {
      worker_id: user.id,
      date: dateStr,
      hours_worked: parseFloat(hours),
      description: description || null,
    };

    let result;
    if (existingLog) {
      result = await supabase
        .from('time_logs')
        .update(logData)
        .eq('id', existingLog.id);
    } else {
      result = await supabase
        .from('time_logs')
        .insert(logData);
    }

    if (result.error) {
      toast({
        title: 'خطا',
        description: 'خطا در ذخیره ساعات کاری',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'موفقیت',
      description: 'ساعات کاری با موفقیت ذخیره شد',
    });

    setIsLogDialogOpen(false);
    setHours('');
    setDescription('');
    fetchTimeLogs();
  };

  const requestDayOff = async () => {
    if (!user || !selectedDate) return;

    const dateStr = formatDateForDB(selectedDate.jy, selectedDate.jm, selectedDate.jd);

    const { error } = await supabase
      .from('day_off_requests')
      .insert({
        worker_id: user.id,
        request_date: dateStr,
        reason: dayOffReason,
      });

    if (error) {
      toast({
        title: 'خطا',
        description: 'خطا در ثبت درخواست مرخصی',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'موفقیت',
      description: 'درخواست مرخصی ثبت شد',
    });

    setIsDayOffDialogOpen(false);
    setDayOffReason('');
    fetchDayOffRequests();
  };

  const openLogDialog = (jy: number, jm: number, jd: number) => {
    setSelectedDate({ jy, jm, jd });
    const dateStr = formatDateForDB(jy, jm, jd);
    const existingLog = timeLogs.find(log => log.date === dateStr);
    
    if (existingLog) {
      setHours(existingLog.hours_worked.toString());
      setDescription(existingLog.description || '');
    } else {
      setHours('');
      setDescription('');
    }
    
    setIsLogDialogOpen(true);
  };

  const openDayOffDialog = (jy: number, jm: number, jd: number) => {
    setSelectedDate({ jy, jm, jd });
    setDayOffReason('');
    setIsDayOffDialogOpen(true);
  };

  const getDayInfo = (jd: number) => {
    const dateStr = formatDateForDB(currentMonth.jy, currentMonth.jm, jd);
    const timeLog = timeLogs.find(log => log.date === dateStr);
    const dayOffRequest = dayOffRequests.find(req => req.request_date === dateStr);
    
    return { timeLog, dayOffRequest };
  };

  const renderCalendarDay = (day: number) => {
    const { timeLog, dayOffRequest } = getDayInfo(day);
    const gregorianDate = jalaliToGregorian(currentMonth.jy, currentMonth.jm, day);
    const dayOfWeek = gregorianDate.getDay();
    const isWeekend = dayOfWeek === 5; // Friday

    return (
      <div
        key={day}
        className={`min-h-24 border border-border p-2 ${isWeekend ? 'bg-muted/30' : 'bg-background'}`}
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium">{day}</span>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => openLogDialog(currentMonth.jy, currentMonth.jm, day)}
            >
              <Clock className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => openDayOffDialog(currentMonth.jy, currentMonth.jm, day)}
            >
              <Coffee className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {timeLog && (
          <Badge variant="secondary" className="text-xs mb-1">
            {timeLog.hours_worked} ساعت
          </Badge>
        )}
        
        {dayOffRequest && (
          <Badge
            variant={
              dayOffRequest.status === 'approved' ? 'default' :
              dayOffRequest.status === 'rejected' ? 'destructive' : 'outline'
            }
            className="text-xs"
          >
            {dayOffRequest.status === 'pending' ? 'در انتظار' :
             dayOffRequest.status === 'approved' ? 'تایید شده' : 'رد شده'}
          </Badge>
        )}
      </div>
    );
  };

  const daysInMonth = getDaysInJalaliMonth(currentMonth.jy, currentMonth.jm);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {getJalaliMonthName(currentMonth.jm)} {currentMonth.jy}
          </CardTitle>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>مجموع ساعات کاری: {totalHours} ساعت</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map(day => (
              <div key={day} className="text-center text-sm font-medium py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map(day => renderCalendarDay(day))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ثبت ساعات کاری</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="hours">ساعات کاری</Label>
              <Input
                id="hours"
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="مثال: 8.5"
              />
            </div>
            <div>
              <Label htmlFor="description">توضیحات (اختیاری)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحات کار انجام شده..."
              />
            </div>
            <Button onClick={saveTimeLog} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              ذخیره
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDayOffDialogOpen} onOpenChange={setIsDayOffDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>درخواست مرخصی</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">دلیل مرخصی</Label>
              <Textarea
                id="reason"
                value={dayOffReason}
                onChange={(e) => setDayOffReason(e.target.value)}
                placeholder="دلیل درخواست مرخصی..."
              />
            </div>
            <Button onClick={requestDayOff} className="w-full">
              <Coffee className="h-4 w-4 mr-2" />
              ثبت درخواست
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};