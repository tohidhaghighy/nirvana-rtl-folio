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
import { Calendar, Clock, Coffee, Save, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/hooks/useAuthStore";
import {
  getJalaliMonthName,
  getDaysInJalaliMonth,
  jalaliToGregorian,
  formatDateForDB,
} from "@/utils/jalali";
import { convertToPersianDigits, formatDecimalHoursToTime } from "@/lib/utils";
import { useWindowSize } from "../windowWidth/useWindowSize";
import { RotateCcw } from "lucide-react";

const MOBILE_WIDTH_THRESHOLD = 600;

interface TimeLog {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  hours_worked: string;
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
  const [currentLogId, setCurrentLogId] = useState<string | null>(null);
  const [currentDayOffId, setCurrentDayOffId] = useState<string | null>(null);

  const { width } = useWindowSize();
  const isTooNarrow = width !== undefined && width < MOBILE_WIDTH_THRESHOLD;

  const calculateHoursTime = (start: string, end: string): string => {
    if (!start || !end) return "00:00";

    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    const diffMinutes = Math.max(0, endMinutes - startMinutes);
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const saveTimeLog = async () => {
    if (!user || !selectedDate || !startTime || !endTime) return;

    const hoursWorked = calculateHoursTime(startTime, endTime);

    if (hoursWorked === "00:00") {
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
      start_time: startTime + ":00",
      end_time: endTime + ":00",
      hours_worked: hoursWorked + ":00",
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

    // Workers can edit current month + 5 days into next month
    if (jy === currentDate.jy && jm === currentDate.jm) {
      return true; // Current month
    }

    const isNextMonthGracePeriod =
      (currentDate.jy === jy &&
        currentDate.jm === jm + 1 &&
        currentDate.jd <= 5) ||
      (jy === currentDate.jy - 1 &&
        jm === 12 &&
        currentDate.jm === 1 &&
        currentDate.jd <= 5);

    return isNextMonthGracePeriod;
  };

  const deleteTimeLog = async () => {
    if (!currentLogId) return;

    try {
      await apiClient.deleteTimeLog(currentLogId);
      toast({
        title: "موفقیت",
        description: "ساعات کاری حذف شد",
      });
      setIsLogDialogOpen(false);
      setCurrentLogId(null);
      setStartTime("");
      setEndTime("");
      setDescription("");
      onDataChange();
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در حذف ساعات کاری",
        variant: "destructive",
      });
    }
  };

  const deleteDayOff = async () => {
    if (!currentDayOffId) return;

    try {
      await apiClient.deleteDayOffRequest(currentDayOffId);
      toast({
        title: "موفقیت",
        description: "درخواست مرخصی حذف شد",
      });
      setIsDayOffDialogOpen(false);
      setCurrentDayOffId(null);
      setDayOffReason("");
      onDataChange();
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در حذف درخواست مرخصی",
        variant: "destructive",
      });
    }
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
    const existingLog = timeLogs.find(
      (log) => log.date.substring(0, 10) === dateStr
    );

    if (existingLog) {
      setCurrentLogId(existingLog.id);
      setStartTime(
        existingLog.start_time ? existingLog.start_time.substring(0, 5) : ""
      );
      setEndTime(
        existingLog.end_time ? existingLog.end_time.substring(0, 5) : ""
      );
      setDescription(existingLog.description || "");
    } else {
      setCurrentLogId(null);
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
    const dateStr = formatDateForDB(jy, jm, jd);
    const existingRequest = dayOffRequests.find(
      (req) => req.request_date.substring(0, 10) === dateStr
    );

    if (existingRequest) {
      setCurrentDayOffId(existingRequest.id);
      setDayOffReason(existingRequest.reason || "");
    } else {
      setCurrentDayOffId(null);
      setDayOffReason("");
    }

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
          <span className="text-sm font-medium">
            {day.toLocaleString("fa-IR")}
          </span>
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
            {timeLog.hours_worked
              ? convertToPersianDigits(timeLog.hours_worked.substring(0, 5))
              : "۰۰:۰۰"}
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

  if (isTooNarrow) {
    return (
      <div className="space-y-6">
        <Card className="flex items-center justify-center p-4">
          {/* The inner div must control the height. We use min-h-[400px] 
          or min-h-full to ensure it's tall enough to center the message, 
          without using h-screen which would overflow the Card.
        */}
          <div
            className="
            flex flex-col items-center justify-center 
            w-full 
            min-h-[400px] /* Ensure sufficient height for the message */ 
            text-center 
            bg-background/50 /* Optional: slightly different background for contrast */
            p-4 
            rounded-lg
          "
          >
            <RotateCcw className="w-12 h-12 text-blue-500 mb-4" />
            <h2 className="text-xl font-bold mb-2 persian-body">
              لطفاً دستگاه خود را بچرخانید
            </h2>
            <p className="text-gray-600 persian-body">
              برای نمایش صحیح تقویم و جدول زمانی، لطفاً گوشی خود را به حالت افقی
              بچرخانید.
            </p>

            {/* Optional: Show current width for debugging */}
            {/* <p className="mt-4 text-xs text-gray-400">عرض فعلی: {width}px</p> */}
          </div>
        </Card>
      </div>
    );
  }

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
            {getJalaliMonthName(selectedMonth.jm)}{" "}
            {selectedMonth.jy.toLocaleString("fa-IR", { useGrouping: false })}
          </CardTitle>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>
              مجموع ساعات کاری:{" "}
              {convertToPersianDigits(formatDecimalHoursToTime(totalHours))}{" "}
              ساعت
            </span>
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
                مجموع:{" "}
                {convertToPersianDigits(calculateHoursTime(startTime, endTime))}
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
            <div className="flex gap-2">
              <Button onClick={saveTimeLog} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                ذخیره
              </Button>
              {currentLogId && (
                <Button
                  onClick={deleteTimeLog}
                  variant="destructive"
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  حذف
                </Button>
              )}
            </div>
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
            <div className="flex gap-2">
              <Button onClick={requestDayOff} className="flex-1">
                <Coffee className="h-4 w-4 mr-2" />
                ثبت درخواست
              </Button>
              {currentDayOffId && (
                <Button
                  onClick={deleteDayOff}
                  variant="destructive"
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  حذف
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
