import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, Coffee, TrendingUp } from "lucide-react";
import { WorkerCalendar } from "@/components/worker/WorkerCalendar";
import { useAuthStore } from "@/hooks/useAuthStore";
import { apiClient } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import {
  formatDateForDB,
  getDaysInJalaliMonth,
  getCurrentJalaliDate,
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

export const WorkerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [currentMonth] = useState(getCurrentJalaliDate());
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [dayOffRequests, setDayOffRequests] = useState<DayOffRequest[]>([]);
  const [totalHours, setTotalHours] = useState(0);

  const fetchTimeLogs = useCallback(async () => {
    if (!user) return;

    const startDate = formatDateForDB(currentMonth.jy, currentMonth.jm, 1);
    const endDate = formatDateForDB(
      currentMonth.jy,
      currentMonth.jm,
      getDaysInJalaliMonth(currentMonth.jy, currentMonth.jm)
    );

    const { data, error } = await supabase
      .from("time_logs")
      .select("*")
      .eq("worker_id", user.id)
      .gte("date", startDate)
      .lte("date", endDate);

    if (error) {
      toast({
        title: "خطا",
        description: "خطا در دریافت ساعات کاری",
        variant: "destructive",
      });
      return;
    }

    setTimeLogs(data || []);
    const total = (data || []).reduce(
      (sum, log) => sum + Number(log.hours_worked),
      0
    );
    setTotalHours(total);
  }, [user, currentMonth]);

  const fetchDayOffRequests = useCallback(async () => {
    if (!user) return;

    const startDate = formatDateForDB(currentMonth.jy, currentMonth.jm, 1);
    const endDate = formatDateForDB(
      currentMonth.jy,
      currentMonth.jm,
      getDaysInJalaliMonth(currentMonth.jy, currentMonth.jm)
    );

    const { data, error } = await supabase
      .from("day_off_requests")
      .select("*")
      .eq("worker_id", user.id)
      .gte("request_date", startDate)
      .lte("request_date", endDate);

    if (error) return;

    const typedData = (data || []).map((request) => ({
      ...request,
      status: request.status as "pending" | "approved" | "rejected",
    }));
    setDayOffRequests(typedData);
  }, [user, currentMonth]);

  useEffect(() => {
    if (user) {
      fetchTimeLogs();
      fetchDayOffRequests();
    }
  }, [user, fetchTimeLogs, fetchDayOffRequests]);

  const todayDateStr = formatDateForDB(
    currentMonth.jy,
    currentMonth.jm,
    currentMonth.jd
  );
  const hoursToday =
    timeLogs.find((log) => log.date === todayDateStr)?.hours_worked || 0;
  const daysWorked = new Set(timeLogs.map((log) => log.date)).size;
  const pendingRequests = dayOffRequests.filter(
    (req) => req.status === "pending"
  ).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">داشبورد کارمند</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ساعات امروز</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hoursToday} ساعت</div>
            <p className="text-xs text-muted-foreground">
              {hoursToday > 0 ? "ثبت شده برای امروز" : "برای امروز ثبت نشده"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مجموع این ماه</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours} ساعت</div>
            <p className="text-xs text-muted-foreground">ساعات کاری ماه جاری</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">روزهای کاری</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysWorked} روز</div>
            <p className="text-xs text-muted-foreground">از ابتدای ماه</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">درخواست مرخصی</CardTitle>
            <Coffee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests}</div>
            <p className="text-xs text-muted-foreground">در انتظار بررسی</p>
          </CardContent>
        </Card>
      </div>

      <WorkerCalendar
        today={todayDateStr}
        totalHours={totalHours}
        timeLogs={timeLogs}
        dayOffRequests={dayOffRequests}
        onDataChange={() => {
          fetchTimeLogs();
          fetchDayOffRequests();
        }}
      />
    </div>
  );
};
