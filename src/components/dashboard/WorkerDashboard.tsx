import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Coffee, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { WorkerCalendar } from "@/components/worker/WorkerCalendar";
import { useAuthStore } from "@/hooks/useAuthStore";
import { apiClient } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import {
  formatDateForDB,
  getDaysInJalaliMonth,
  getCurrentJalaliDate,
  getJalaliMonthName,
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
  const [selectedMonth, setSelectedMonth] = useState(getCurrentJalaliDate());
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [dayOffRequests, setDayOffRequests] = useState<DayOffRequest[]>([]);
  const [totalHours, setTotalHours] = useState(0);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const currentDate = getCurrentJalaliDate();

  const fetchTimeLogs = useCallback(async () => {
    if (!user) return;

    const startDate = formatDateForDB(selectedMonth.jy, selectedMonth.jm, 1);
    const endDate = formatDateForDB(
      selectedMonth.jy,
      selectedMonth.jm,
      getDaysInJalaliMonth(selectedMonth.jy, selectedMonth.jm)
    );

    try {
      const data = await apiClient.getTimeLogs({
        startDate,
        endDate,
        workerId: user.id,
      });

      setTimeLogs(data || []);
      const total = (data || []).reduce(
        (sum, log) => sum + Number(log.hours_worked),
        0
      );
      setTotalHours(total);
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در دریافت ساعات کاری",
        variant: "destructive",
      });
    }
  }, [user, selectedMonth]);

  const fetchDayOffRequests = useCallback(async () => {
    if (!user) return;

    const startDate = formatDateForDB(selectedMonth.jy, selectedMonth.jm, 1);
    const endDate = formatDateForDB(
      selectedMonth.jy,
      selectedMonth.jm,
      getDaysInJalaliMonth(selectedMonth.jy, selectedMonth.jm)
    );

    try {
      const data = await apiClient.getDayOffRequests({
        startDate,
        endDate,
        workerId: user.id,
      });

      const typedData = (data || []).map((request) => ({
        ...request,
        status: request.status as "pending" | "approved" | "rejected",
      }));
      setDayOffRequests(typedData);
    } catch (error) {
      // Handle error silently for now
    }
  }, [user, selectedMonth]);

  useEffect(() => {
    if (user) {
      fetchTimeLogs();
      fetchDayOffRequests();
    }
  }, [user, fetchTimeLogs, fetchDayOffRequests]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = { ...selectedMonth };
    if (direction === 'next') {
      if (newMonth.jm === 12) {
        newMonth.jy += 1;
        newMonth.jm = 1;
      } else {
        newMonth.jm += 1;
      }
    } else {
      if (newMonth.jm === 1) {
        newMonth.jy -= 1;
        newMonth.jm = 12;
      } else {
        newMonth.jm -= 1;
      }
    }
    setSelectedMonth(newMonth);
  };

  const canNavigate = (direction: 'prev' | 'next') => {
    if (isAdmin) return true;
    
    const targetMonth = { ...selectedMonth };
    if (direction === 'next') {
      if (targetMonth.jm === 12) {
        targetMonth.jy += 1;
        targetMonth.jm = 1;
      } else {
        targetMonth.jm += 1;
      }
    } else {
      if (targetMonth.jm === 1) {
        targetMonth.jy -= 1;
        targetMonth.jm = 12;
      } else {
        targetMonth.jm -= 1;
      }
    }
    
    // Workers can only navigate to current month
    return targetMonth.jy === currentDate.jy && targetMonth.jm === currentDate.jm;
  };

  const todayDateStr = formatDateForDB(
    currentDate.jy,
    currentDate.jm,
    currentDate.jd
  );
  const hoursToday =
    timeLogs.find((log) => log.date.substring(0, 10) === todayDateStr)
      ?.hours_worked || 0;
  const daysWorked = new Set(timeLogs.map((log) => log.date)).size;
  const pendingRequests = dayOffRequests.filter(
    (req) => req.status === "pending"
  ).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">داشبورد کارمند</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            disabled={!canNavigate('prev')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium min-w-32 text-center">
            {getJalaliMonthName(selectedMonth.jm)} {selectedMonth.jy}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            disabled={!canNavigate('next')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
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
        currentDate={currentDate}
        selectedMonth={selectedMonth}
        totalHours={totalHours}
        timeLogs={timeLogs}
        dayOffRequests={dayOffRequests}
        isAdmin={isAdmin}
        onDataChange={() => {
          fetchTimeLogs();
          fetchDayOffRequests();
        }}
      />
    </div>
  );
};
