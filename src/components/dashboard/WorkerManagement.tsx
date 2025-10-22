import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Users,
  Clock,
  Coffee,
  CheckCircle,
  XCircle,
  Edit,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import {
  getCurrentJalaliDate,
  getJalaliMonthName,
  getDaysInJalaliMonth,
  formatDateForDB,
  gregorianToJalali,
  formatJalaliDate,
} from "@/utils/jalali";
import { convertToPersianDigits, formatDecimalHoursToTime } from "@/lib/utils";

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
  start_time: string;
  end_time: string;
  hours_worked: string;
  description: string;
  worker_name: string;
}

interface DayOffRequest {
  id: string;
  worker_id: string;
  request_date: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
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
  console.log("WorkerManagement component rendering");

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [dayOffRequests, setDayOffRequests] = useState<DayOffRequest[]>([]);
  const [workerSummaries, setWorkerSummaries] = useState<WorkerSummary[]>([]);
  const [selectedTimeLog, setSelectedTimeLog] = useState<TimeLog | null>(null);
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentJalaliDate());
  const [selectedWorkerId, setSelectedWorkerId] = useState("");

  const currentDate = getCurrentJalaliDate();

  console.log("WorkerManagement state:", {
    workers: workers.length,
    timeLogs: timeLogs.length,
  });

  useEffect(() => {
    fetchWorkers();
  }, []);

  useEffect(() => {
    if (workers.length > 0) {
      fetchTimeLogs();
      fetchDayOffRequests();
    }
  }, [selectedMonth.jy, selectedMonth.jm, selectedWorkerId, workers.length]);

  useEffect(() => {
    calculateWorkerSummaries();
  }, [workers, timeLogs, dayOffRequests, selectedWorkerId]);

  const fetchWorkers = async () => {
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
  };

  const fetchTimeLogs = async () => {
    const startDate = formatDateForDB(selectedMonth.jy, selectedMonth.jm, 1);
    const endDate = formatDateForDB(
      selectedMonth.jy,
      selectedMonth.jm,
      getDaysInJalaliMonth(selectedMonth.jy, selectedMonth.jm)
    );

    try {
      const params: any = { startDate, endDate };
      if (selectedWorkerId && selectedWorkerId !== "all") {
        params.workerId = selectedWorkerId;
      }
      const data = await apiClient.getTimeLogs(params);
      setTimeLogs(data || []);
    } catch (error) {
      console.error("Error fetching time logs:", error);
      toast({
        title: "خطا",
        description: "خطا در دریافت ساعات کاری",
        variant: "destructive",
      });
      setTimeLogs([]);
    }
  };

  const fetchDayOffRequests = async () => {
    const startDate = formatDateForDB(selectedMonth.jy, selectedMonth.jm, 1);
    const endDate = formatDateForDB(
      selectedMonth.jy,
      selectedMonth.jm,
      getDaysInJalaliMonth(selectedMonth.jy, selectedMonth.jm)
    );

    try {
      const params: any = { startDate, endDate };
      if (selectedWorkerId && selectedWorkerId !== "all") {
        params.workerId = selectedWorkerId;
      }
      const data = await apiClient.getDayOffRequests(params);
      const typedData = (data || []).map((request) => ({
        ...request,
        status: request.status as "pending" | "approved" | "rejected",
      }));
      setDayOffRequests(typedData);
    } catch (error) {
      console.error("Error fetching day off requests:", error);
      toast({
        title: "خطا",
        description: "خطا در دریافت درخواست‌های مرخصی",
        variant: "destructive",
      });
      setDayOffRequests([]);
    }
  };

  const convertTimeToHours = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours + (minutes || 0) / 60;
  };

  const calculateWorkerSummaries = () => {
    const filteredWorkers =
      selectedWorkerId && selectedWorkerId !== "all"
        ? workers.filter((worker) => worker.user_id === selectedWorkerId)
        : workers;

    const summaries = filteredWorkers.map((worker) => {
      const workerLogs = timeLogs.filter(
        (log) => log.worker_id === worker.user_id
      );
      const workerDayOffs = dayOffRequests.filter(
        (req) => req.worker_id === worker.user_id && req.status === "approved"
      );

      return {
        worker_id: worker.user_id,
        worker_name: worker.full_name || "نامشخص",
        total_hours: workerLogs.reduce(
          (sum, log) => sum + convertTimeToHours(log.hours_worked),
          0
        ),
        days_worked: workerLogs.length,
        approved_days_off: workerDayOffs.length,
      };
    });

    setWorkerSummaries(summaries);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setSelectedMonth((prev) => {
      if (direction === "prev") {
        if (prev.jm === 1) {
          return { jy: prev.jy - 1, jm: 12, jd: prev.jd };
        } else {
          return { ...prev, jm: prev.jm - 1 };
        }
      } else {
        if (prev.jm === 12) {
          return { jy: prev.jy + 1, jm: 1, jd: prev.jd };
        } else {
          return { ...prev, jm: prev.jm + 1 };
        }
      }
    });
  };

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

  const updateTimeLog = async () => {
    if (!selectedTimeLog) return;

    const hoursWorked = calculateHoursTime(editStartTime, editEndTime);

    try {
      await apiClient.updateTimeLog(selectedTimeLog.id, {
        start_time: editStartTime + ":00",
        end_time: editEndTime + ":00",
        hours_worked: hoursWorked + ":00",
        description: editDescription,
      });

      toast({
        title: "موفقیت",
        description: "ساعات کاری بروزرسانی شد",
      });

      setIsEditDialogOpen(false);
      fetchTimeLogs();
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در بروزرسانی ساعات کاری",
        variant: "destructive",
      });
    }
  };

  const handleDayOffRequest = async (
    requestId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      await apiClient.updateDayOffRequest(requestId, {
        status,
        admin_notes: adminNotes || null,
      });

      toast({
        title: "موفقیت",
        description: `درخواست مرخصی ${
          status === "approved" ? "تایید" : "رد"
        } شد`,
      });

      setAdminNotes("");
      fetchDayOffRequests();
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در بروزرسانی درخواست مرخصی",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (timeLog: TimeLog) => {
    setSelectedTimeLog(timeLog);
    setEditStartTime(
      timeLog.start_time ? timeLog.start_time.substring(0, 5) : ""
    );
    setEditEndTime(timeLog.end_time ? timeLog.end_time.substring(0, 5) : "");
    setEditDescription(timeLog.description || "");
    setIsEditDialogOpen(true);
  };

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    const jalali = gregorianToJalali(date);
    return formatJalaliDate(jalali);
  };

  const pendingRequests = dayOffRequests.filter(
    (req) => req.status === "pending"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">مدیریت کارمندان</h2>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-start">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Users className="h-4 w-4 text-muted-foreground" />
            <Select
              value={selectedWorkerId || "all"}
              onValueChange={(value) =>
                setSelectedWorkerId(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="انتخاب کارمند" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه کارمندان</SelectItem>
                {workers.map((worker) => (
                  <SelectItem key={worker.id} value={worker.user_id}>
                    {worker.full_name || worker.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
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
                    {year.toLocaleString("fa-IR", { useGrouping: false })}
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
                  <SelectItem key={index + 1} value={(index + 1).toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("prev")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="min-w-[120px] text-center">
              {getJalaliMonthName(selectedMonth.jm)}{" "}
              {selectedMonth.jy.toLocaleString("fa-IR", {
                useGrouping: false,
              })}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("next")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="summary" className="space-y-6" dir="rtl">
        <TabsList className="grid w-full grid-cols-2 h-20 sm:grid-cols-4 sm:h-auto">
          <TabsTrigger value="summary">خلاصه کارمندان</TabsTrigger>
          <TabsTrigger value="time-logs">ساعات کاری</TabsTrigger>
          <TabsTrigger value="day-off-requests">درخواست‌های مرخصی</TabsTrigger>
          <TabsTrigger value="pending">
            در انتظار بررسی ({pendingRequests.length.toLocaleString("fa-IR")})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                خلاصه عملکرد کارمندان
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>نام کارمند</TableHead>
                    <TableHead>مجموع ساعات</TableHead>
                    <TableHead>روزهای کاری</TableHead>
                    <TableHead>مرخصی‌های تایید شده</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workerSummaries.map((summary) => (
                    <TableRow key={summary.worker_id}>
                      <TableCell className="font-medium">
                        {summary.worker_name}
                      </TableCell>
                      <TableCell>
                        {convertToPersianDigits(
                          formatDecimalHoursToTime(summary.total_hours)
                        )}{" "}
                        ساعت
                      </TableCell>
                      <TableCell>
                        {summary.days_worked.toLocaleString("fa-IR")} روز
                      </TableCell>
                      <TableCell>
                        {summary.approved_days_off.toLocaleString("fa-IR")} روز
                      </TableCell>
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
                    <TableHead>نام کارمند</TableHead>
                    <TableHead>تاریخ</TableHead>
                    <TableHead>ساعات کاری</TableHead>
                    <TableHead>توضیحات</TableHead>
                    <TableHead>عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {log.worker_name}
                      </TableCell>
                      <TableCell>
                        {convertToPersianDigits(formatDateDisplay(log.date))}
                      </TableCell>
                      <TableCell>
                        {log.hours_worked
                          ? convertToPersianDigits(
                              log.hours_worked.substring(0, 5)
                            )
                          : "۰۰:۰۰"}
                      </TableCell>
                      <TableCell>{log.description || "-"}</TableCell>
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
                    <TableHead>نام کارمند</TableHead>
                    <TableHead>تاریخ مرخصی</TableHead>
                    <TableHead>دلیل</TableHead>
                    <TableHead>وضعیت</TableHead>
                    <TableHead>تاریخ درخواست</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dayOffRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.worker_name}
                      </TableCell>
                      <TableCell>
                        {convertToPersianDigits(
                          formatDateDisplay(request.request_date)
                        )}
                      </TableCell>
                      <TableCell>{request.reason}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.status === "approved"
                              ? "default"
                              : request.status === "rejected"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {request.status === "pending"
                            ? "در انتظار"
                            : request.status === "approved"
                            ? "تایید شده"
                            : "رد شده"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {convertToPersianDigits(
                          formatDateDisplay(request.created_at)
                        )}
                      </TableCell>
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
                    <TableHead>نام کارمند</TableHead>
                    <TableHead>تاریخ مرخصی</TableHead>
                    <TableHead>دلیل</TableHead>
                    <TableHead>تاریخ درخواست</TableHead>
                    <TableHead>عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.worker_name}
                      </TableCell>
                      <TableCell>
                        {convertToPersianDigits(
                          formatDateDisplay(request.request_date)
                        )}
                      </TableCell>
                      <TableCell>{request.reason}</TableCell>
                      <TableCell>
                        {convertToPersianDigits(
                          formatDateDisplay(request.created_at)
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleDayOffRequest(request.id, "approved")
                            }
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleDayOffRequest(request.id, "rejected")
                            }
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-start-time">زمان شروع</Label>
                <Input
                  id="edit-start-time"
                  type="time"
                  value={editStartTime}
                  onChange={(e) => setEditStartTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit-end-time">زمان پایان</Label>
                <Input
                  id="edit-end-time"
                  type="time"
                  value={editEndTime}
                  onChange={(e) => setEditEndTime(e.target.value)}
                />
              </div>
            </div>
            {editStartTime && editEndTime && (
              <div className="text-sm text-muted-foreground text-center">
                مجموع:{" "}
                {convertToPersianDigits(
                  calculateHoursTime(editStartTime, editEndTime)
                )}
              </div>
            )}
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
