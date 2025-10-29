import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Calendar,
  Coffee,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { WorkerCalendar } from "@/components/worker/WorkerCalendar";
import { useAuthStore } from "@/hooks/useAuthStore";
import { apiClient } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChangePassword } from "@/components/auth/ChangePassword";
import {
  formatDateForDB,
  getDaysInJalaliMonth,
  getCurrentJalaliDate,
  getJalaliMonthName,
} from "@/utils/jalali";
import { convertToPersianDigits, formatDecimalHoursToTime } from "@/lib/utils";
import { useWindowSize } from "../windowWidth/useWindowSize";

const MOBILE_WIDTH_THRESHOLD = 600;

interface TimeLog {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  hours_worked: string;
  description: string;
  hours_worked_str: string;
  start_time_2?: string | null;
  end_time_2?: string | null;
}
interface DayOffRequest {
  id: string;
  request_date: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

interface Worker {
  id: string;
  full_name: string;
  email: string;
}

export const WorkerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentJalaliDate());
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [dayOffRequests, setDayOffRequests] = useState<DayOffRequest[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>("");

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const currentDate = getCurrentJalaliDate();

  const { width } = useWindowSize();
  const isTooNarrow = width !== undefined && width < MOBILE_WIDTH_THRESHOLD;

  // Set default worker ID for non-admins
  useEffect(() => {
    if (user && !isAdmin && !selectedWorkerId) {
      setSelectedWorkerId(user.id);
    }
  }, [user, isAdmin, selectedWorkerId]);

  const fetchTimeLogs = useCallback(async () => {
    if (!user) return;

    const startDate = formatDateForDB(selectedMonth.jy, selectedMonth.jm, 1);
    const endDate = formatDateForDB(
      selectedMonth.jy,
      selectedMonth.jm,
      getDaysInJalaliMonth(selectedMonth.jy, selectedMonth.jm)
    );

    try {
      const params: any = { startDate, endDate };

      // For admins, use selected worker ID if available, otherwise get all workers' data
      if (isAdmin) {
        if (selectedWorkerId) {
          params.workerId = selectedWorkerId;
        }
        // If no worker selected, don't add workerId to get all workers' data
      } else {
        // For workers, always use their own ID
        params.workerId = user.id;
      }

      const data = await apiClient.getTimeLogs(params);

      setTimeLogs(data || []);
      const total = (data || []).reduce((sum, log) => {
        let d = log.hours_worked_str || "0:00";
        const [hours, minutes] = (d || "0:00").split(":").map(Number);
        return sum + hours + (minutes || 0) / 60;
      }, 0);
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
      const params: any = { startDate, endDate };

      // For admins, use selected worker ID if available, otherwise get all workers' data
      if (isAdmin) {
        if (selectedWorkerId) {
          params.workerId = selectedWorkerId;
        }
        // If no worker selected, don't add workerId to get all workers' data
      } else {
        // For workers, always use their own ID
        params.workerId = user.id;
      }

      const data = await apiClient.getDayOffRequests(params);

      const typedData = (data || []).map((request) => ({
        ...request,
        status: request.status as "pending" | "approved" | "rejected",
      }));
      setDayOffRequests(typedData);
    } catch (error) {
      // Handle error silently for now
    }
  }, [user, selectedMonth, selectedWorkerId, isAdmin]);

  const fetchWorkers = useCallback(async () => {
    if (!isAdmin) return;

    try {
      const data = await apiClient.getWorkers();
      setWorkers(data || []);
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در دریافت لیست کارمندان",
        variant: "destructive",
      });
    }
  }, [isAdmin]);

  useEffect(() => {
    if (user) {
      fetchTimeLogs();
      fetchDayOffRequests();
      if (isAdmin) {
        fetchWorkers();
      }
    }
  }, [user, fetchTimeLogs, fetchDayOffRequests, fetchWorkers, isAdmin]);

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = { ...selectedMonth };
    if (direction === "next") {
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

  const canNavigate = (direction: "prev" | "next") => {
    if (isTooNarrow) return false;
    if (isAdmin) return true;

    // Workers can navigate through the current year
    const isSameMonth = (d1, d2) => d1.jy === d2.jy && d1.jm === d2.jm;

    const isSelectedMonthBeforeCurrentYearStart = () => {
      return selectedMonth.jy < currentDate.jy;
    };

    if (direction === "prev") {
      // Workers can't go to previous years. They can go back to the first month of the current year.
      // So, disable the 'prev' button if the selected month is the first month of the current year.
      return (
        !isSelectedMonthBeforeCurrentYearStart() &&
        !(selectedMonth.jy === currentDate.jy && selectedMonth.jm === 1)
      );
    }

    if (direction === "next") {
      // Workers cannot go to the next month if they are already in the current month.
      return !isSameMonth(selectedMonth, currentDate);
    }

    return false;
  };

  const convertTimeToHours = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours + (minutes || 0) / 60;
  };

  const todayDateStr = formatDateForDB(
    currentDate.jy,
    currentDate.jm,
    currentDate.jd
  );

  const hoursToday = convertTimeToHours(
    timeLogs.find((log) => log.date.substring(0, 10) === todayDateStr)
      ?.hours_worked || "0:00"
  );
  const daysWorked = new Set(timeLogs.map((log) => log.date)).size;
  const pendingRequests = dayOffRequests.filter(
    (req) => req.status === "pending"
  ).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {isAdmin ? "مدیریت کارمندان" : "داشبورد کارمند"}
        </h1>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={selectedWorkerId}
                  onValueChange={(value) => setSelectedWorkerId(value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="انتخاب کارمند" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">همه کارمندان</SelectItem>
                    {workers.map((worker) => (
                      <SelectItem key={worker.id} value={worker.id}>
                        {worker.full_name || worker.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={selectedMonth.jy.toString()}
                  onValueChange={(value) =>
                    setSelectedMonth({ ...selectedMonth, jy: parseInt(value) })
                  }
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      { length: 10 },
                      (_, i) => currentDate.jy - 5 + i
                    ).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedMonth.jm.toString()}
                  onValueChange={(value) =>
                    setSelectedMonth({ ...selectedMonth, jm: parseInt(value) })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "فروردین",
                      "اردیبهشت",
                      "خرداد",
                      "تیر",
                      "مرداد",
                      "شهریور",
                      "مهر",
                      "آبان",
                      "آذر",
                      "دی",
                      "بهمن",
                      "اسفند",
                    ].map((month, index) => (
                      <SelectItem
                        key={index + 1}
                        value={(index + 1).toString()}
                      >
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("prev")}
              disabled={!canNavigate("prev")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium min-w-32 text-center">
              {getJalaliMonthName(selectedMonth.jm)}{" "}
              {selectedMonth.jy.toLocaleString("fa-IR", { useGrouping: false })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("next")}
              disabled={!canNavigate("next")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ساعات امروز</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {convertToPersianDigits(formatDecimalHoursToTime(hoursToday))}{" "}
              ساعت
            </div>
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
            <div className="text-2xl font-bold">
              {convertToPersianDigits(formatDecimalHoursToTime(totalHours))}{" "}
              ساعت
            </div>
            <p className="text-xs text-muted-foreground">ساعات کاری ماه جاری</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">روزهای کاری</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {daysWorked.toLocaleString("fa-IR")} روز
            </div>
            <p className="text-xs text-muted-foreground">از ابتدای ماه</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">درخواست مرخصی</CardTitle>
            <Coffee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingRequests.toLocaleString("fa-IR")}
            </div>
            <p className="text-xs text-muted-foreground">در انتظار بررسی</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4" dir="rtl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar">تقویم کاری من</TabsTrigger>
          <TabsTrigger value="settings">تغییر رمز عبور</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <WorkerCalendar
            today={todayDateStr}
            currentDate={currentDate}
            selectedMonth={selectedMonth}
            totalHours={totalHours}
            timeLogs={timeLogs}
            dayOffRequests={dayOffRequests}
            isAdmin={isAdmin}
            selectedWorkerId={selectedWorkerId}
            onDataChange={() => {
              fetchTimeLogs();
              fetchDayOffRequests();
            }}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <ChangePassword />
        </TabsContent>
      </Tabs>
    </div>
  );
};
