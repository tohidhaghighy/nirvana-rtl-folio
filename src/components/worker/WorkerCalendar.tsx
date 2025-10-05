import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Coffee, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/hooks/useAuthStore";
import {
  getCurrentJalaliDate,
  getJalaliMonthName,
  getDaysInJalaliMonth,
  jalaliToGregorian,
  formatDateForDB,
} from "@/utils/jalali";

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
  status: "pending" | "approved" | "rejected";
}

interface WorkerCalendarProps {
  today: string;
  currentDate: { jy: number; jm: number; jd: number };
  selectedMonth: { jy: number; jm: number; jd: number };
  totalHours: number;
  timeLogs: TimeLog[];
  dayOffRequests: DayOffRequest[];
  isAdmin: boolean;
  selectedWorkerId?: string;
  onDataChange: () => void;
}

export const WorkerCalendar: React.FC<WorkerCalendarProps> = ({
  today,
  currentDate,
  selectedMonth,
  totalHours,
  timeLogs,
  dayOffRequests,
  isAdmin,
  onDataChange,
}) => {
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState<{
    jy: number;
    jm: number;
    jd: number;
  } | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [dayOffReason, setDayOffReason] = useState("");
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [isDayOffDialogOpen, setIsDayOffDialogOpen] = useState(false);

  const calculateHours = (start: string, end: string): number => {
    if (!start || !end) return 0;
    
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    const diffMinutes = endMinutes - startMinutes;
    return Math.max(0, diffMinutes / 60);
  };

  const saveTimeLog = async () => {
    if (!user || !selectedDate || !startTime || !endTime) return;

    const hours = calculateHours(startTime, endTime);
    
    if (hours <= 0) {
      toast({
        title: "خطا",
        description: "زمان پایان باید بعد از زمان شروع باشد",
        variant: "destructive",
      });
      return;
    }

    const dateStr = formatDateForDB(
      selectedDate.jy,
      selectedDate.jm,
      selectedDate.jd
    );

    const logData = {
      worker_id: user.id,
      date: dateStr,
      hours_worked: hours,
      description: description || null,
    };

    try {
      await apiClient.saveTimeLog(logData);

      toast({
        title: "موفقیت",
        description: "ساعات کاری با موفقیت ذخیره شد",
      });

      setIsLogDialogOpen(false);
      setStartTime("");
      setEndTime("");
      setDescription("");
      onDataChange();
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در ذخیره ساعات کاری",
        variant: "destructive",
      });
    }
  };

  const requestDayOff = async () => {
    if (!user || !selectedDate) return;

    const dateStr = formatDateForDB(
      selectedDate.jy,
      selectedDate.jm,
      selectedDate.jd
    );

    try {
      await apiClient.createDayOffRequest({
        worker_id: user.id,
        request_date: dateStr,
        reason: dayOffReason,
      });

      toast({
        title: "موفقیت",
        description: "درخواست مرخصی ثبت شد",
      });

      setIsDayOffDialogOpen(false);
      setDayOffReason("");
      onDataChange();
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در ثبت درخواست مرخصی",
        variant: "destructive",
      });
    }
  };

  const canEditDate = (jy: number, jm: number, jd: number) => {
    if (isAdmin) return true;

    const targetDateStr = formatDateForDB(jy, jm, jd);
    const currentDateStr = formatDateForDB(
      currentDate.jy,
      currentDate.jm,
      currentDate.jd
    );
    const currentMonthStr = formatDateForDB(currentDate.jy, currentDate.jm, 1);

    // Workers can edit current month + 5 days into next month
    if (jy === currentDate.jy && jm === currentDate.jm) {
      return true; // Current month
    }

    // Check if it's within 5 days after current month
    // const currentMonthEnd = formatDateForDB(
    //   currentDate.jy,
    //   currentDate.jm,
    //   getDaysInJalaliMonth(currentDate.jy, currentDate.jm)
    // );

    // const nextMonth = currentDate.jm === 12 ? 1 : currentDate.jm + 1;
    // const nextYear =
    //   currentDate.jm === 12 ? currentDate.jy + 1 : currentDate.jy;

    // if (jy === nextYear && jm === nextMonth && jd <= 5) {
    //   return true; // First 5 days of next month
    // }

    const isNextMonthGracePeriod =
      (currentDate.jy === jy &&
        currentDate.jm === jm + 1 &&
        currentDate.jd <= 5) ||
      (jy === currentDate.jy - 1 &&
        jm === 12 &&
        currentDate.jm === 1 &&
        currentDate.jd <= 5);

    return isNextMonthGracePeriod;
    // return false;
  };

  const openLogDialog = (jy: number, jm: number, jd: number) => {
    if (!canEditDate(jy, jm, jd)) {
      toast({
        title: "دسترسی محدود",
        description: "شما فقط می‌توانید ماه جاری را ویرایش کنید",
        variant: "destructive",
      });
      return;
    }

    setSelectedDate({ jy, jm, jd });
    const dateStr = formatDateForDB(jy, jm, jd);
    const existingLog = timeLogs.find((log) => log.date === dateStr);

    if (existingLog) {
      // Convert hours back to default times (e.g., 8am start)
      const hours = existingLog.hours_worked;
      const startHour = 8;
      const endHour = startHour + Math.floor(hours);
      const endMinutes = Math.round((hours - Math.floor(hours)) * 60);
      
      setStartTime(`${startHour.toString().padStart(2, '0')}:00`);
      setEndTime(`${endHour.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`);
      setDescription(existingLog.description || "");
    } else {
      setStartTime("");
      setEndTime("");
      setDescription("");
    }

    setIsLogDialogOpen(true);
  };

  const openDayOffDialog = (jy: number, jm: number, jd: number) => {
    if (!canEditDate(jy, jm, jd)) {
      toast({
        title: "دسترسی محدود",
        description: "شما فقط می‌توانید ماه جاری را ویرایش کنید",
        variant: "destructive",
      });
      return;
    }

    setSelectedDate({ jy, jm, jd });
    setDayOffReason("");
    setIsDayOffDialogOpen(true);
  };

  const getDayInfo = (jd: number) => {
    const dateStr = formatDateForDB(selectedMonth.jy, selectedMonth.jm, jd);
    const timeLog = timeLogs.find(
      (log) => log.date.substring(0, 10) === dateStr
    );
    const dayOffRequest = dayOffRequests.find(
      (req) => req.request_date.substring(0, 10) === dateStr
    );

    return { timeLog, dayOffRequest };
  };

  const renderCalendarDay = (day: number) => {
    const { timeLog, dayOffRequest } = getDayInfo(day);
    const gregorianDate = jalaliToGregorian(
      selectedMonth.jy,
      selectedMonth.jm,
      day
    );
    const dayOfWeek = gregorianDate.getDay();

    let isThursday; // Thursday
    let isFriday; // Friday
    let isWeekend;

    if (
      selectedMonth.jy === currentDate.jy &&
      selectedMonth.jm === currentDate.jm
    ) {
      isThursday = dayOfWeek === 4; // Thursday
      isFriday = dayOfWeek === 5; // Friday
      isWeekend = isThursday || isFriday;
    } else {
      isWeekend = true;
    }

    const dateStr = formatDateForDB(selectedMonth.jy, selectedMonth.jm, day);
    const isToday = dateStr === today;
    const canEdit = canEditDate(selectedMonth.jy, selectedMonth.jm, day);

    return (
      <div
        key={day}
        className={`min-h-24 border border-border p-2
                  ${isWeekend ? "bg-muted" : "bg-background"}
                  ${
                    isToday
                      ? isWeekend
                        ? "border-primary ring-1 ring-primary"
                        : "bg-primary/10 border-primary ring-1 ring-primary"
                      : ""
                  }
  `}
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium">{day}</span>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() =>
                openLogDialog(selectedMonth.jy, selectedMonth.jm, day)
              }
              disabled={!canEdit}
            >
              <Clock
                className={`h-3 w-3 ${!canEdit ? "text-muted-foreground" : ""}`}
              />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() =>
                openDayOffDialog(selectedMonth.jy, selectedMonth.jm, day)
              }
              disabled={!canEdit}
            >
              <Coffee
                className={`h-3 w-3 ${!canEdit ? "text-muted-foreground" : ""}`}
              />
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
              dayOffRequest.status === "approved"
                ? "default"
                : dayOffRequest.status === "rejected"
                ? "destructive"
                : "outline"
            }
            className="text-xs"
          >
            {dayOffRequest.status === "pending"
              ? "در انتظار"
              : dayOffRequest.status === "approved"
              ? "تایید شده"
              : "رد شده"}
          </Badge>
        )}
      </div>
    );
  };

  const daysInMonth = getDaysInJalaliMonth(selectedMonth.jy, selectedMonth.jm);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const firstDayGregorian = jalaliToGregorian(
    selectedMonth.jy,
    selectedMonth.jm,
    1
  );
  const startDayOfWeek = firstDayGregorian.getDay(); // Sunday=0 ... Saturday=6
  const startIndex = startDayOfWeek === 6 ? 0 : startDayOfWeek + 1; // mapped to Persian week index

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {getJalaliMonthName(selectedMonth.jm)} {selectedMonth.jy}
          </CardTitle>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>مجموع ساعات کاری: {totalHours} ساعت</span>
            {!isAdmin && selectedMonth.jm == currentDate.jm && (
              <span className="text-amber-600">ویرایش فقط برای ماه جاری</span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((day) => (
              <div key={day} className="text-center text-sm font-medium py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startIndex }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="min-h-24 border border-border p-2 bg-background"
              />
            ))}
            {days.map((day) => renderCalendarDay(day))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ثبت ساعات کاری</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">زمان شروع</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endTime">زمان پایان</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
            {startTime && endTime && (
              <div className="text-sm text-muted-foreground text-center">
                مجموع: {calculateHours(startTime, endTime).toFixed(2)} ساعت
              </div>
            )}
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
