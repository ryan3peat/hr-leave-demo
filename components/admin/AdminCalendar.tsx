"use client";

import { useState, useMemo } from "react";
import { useLeaveManagement } from "@/hooks/useLeaveManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaveRequest } from "@/lib/types";
import { formatDateRange } from "@/lib/dateUtils";
import { getMonthRange } from "@/lib/dateUtils";
import { isPublicHoliday } from "@/lib/publicHolidays";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { EmployeeGrade } from "@/lib/types";

// Color mapping for leave status (only Pending and Approved)
const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-500",
  Approved: "bg-green-500",
};

export function AdminCalendar() {
  const { employees, getAllLeaves, getEmployee } = useLeaveManagement();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [employeeFilter, setEmployeeFilter] = useState<string>("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [gradeFilter, setGradeFilter] = useState<EmployeeGrade | "All">("All");

  const allLeaves = getAllLeaves();
  const { start: monthStart, end: monthEnd } = getMonthRange(currentDate);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get unique departments
  const departments = useMemo(() => {
    const depts = new Set(employees.map((emp) => emp.department));
    return Array.from(depts).sort();
  }, [employees]);

  // Filter employees based on filters
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (employeeFilter !== "All" && emp.id !== employeeFilter) return false;
      if (departmentFilter !== "All" && emp.department !== departmentFilter) return false;
      if (gradeFilter !== "All" && emp.grade !== gradeFilter) return false;
      return true;
    });
  }, [employees, employeeFilter, departmentFilter, gradeFilter]);

  // Filter leaves to only show Pending and Approved, and match employee filters
  const filteredLeaves = useMemo(() => {
    const filteredEmployeeIds = new Set(filteredEmployees.map((emp) => emp.id));
    return allLeaves.filter((leave) => {
      if (leave.status === "Rejected") return false;
      if (!filteredEmployeeIds.has(leave.employeeId)) return false;
      return true;
    });
  }, [allLeaves, filteredEmployees]);

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Get leaves for this month
  const monthLeaves = filteredLeaves.filter((leave) => {
    const leaveStart = new Date(leave.startDate);
    const leaveEnd = new Date(leave.endDate);
    // Normalize dates to start of day
    const leaveStartNormalized = new Date(leaveStart.getFullYear(), leaveStart.getMonth(), leaveStart.getDate());
    const leaveEndNormalized = new Date(leaveEnd.getFullYear(), leaveEnd.getMonth(), leaveEnd.getDate());
    const monthStartNormalized = new Date(monthStart.getFullYear(), monthStart.getMonth(), monthStart.getDate());
    const monthEndNormalized = new Date(monthEnd.getFullYear(), monthEnd.getMonth(), monthEnd.getDate());
    
    return (
      (leaveStartNormalized >= monthStartNormalized && leaveStartNormalized <= monthEndNormalized) ||
      (leaveEndNormalized >= monthStartNormalized && leaveEndNormalized <= monthEndNormalized) ||
      (leaveStartNormalized <= monthStartNormalized && leaveEndNormalized >= monthEndNormalized)
    );
  });

  // Get leaves for a specific date, grouped by employee
  const getLeavesForDate = (date: Date): Record<string, LeaveRequest[]> => {
    // Normalize date to start of day for comparison
    const dateYear = date.getFullYear();
    const dateMonth = date.getMonth();
    const dateDay = date.getDate();
    const normalizedDate = new Date(dateYear, dateMonth, dateDay);
    
    const leavesOnDate = monthLeaves.filter((leave) => {
      // Normalize leave dates
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      const startNormalized = new Date(leaveStart.getFullYear(), leaveStart.getMonth(), leaveStart.getDate());
      const endNormalized = new Date(leaveEnd.getFullYear(), leaveEnd.getMonth(), leaveEnd.getDate());
      
      // Check if date falls within leave range
      return normalizedDate >= startNormalized && normalizedDate <= endNormalized;
    });

    // Group by employee
    const leavesByEmployee: Record<string, LeaveRequest[]> = {};
    leavesOnDate.forEach((leave) => {
      const employee = getEmployee(leave.employeeId);
      const employeeName = employee?.name || "Unknown";
      if (!leavesByEmployee[employeeName]) {
        leavesByEmployee[employeeName] = [];
      }
      leavesByEmployee[employeeName].push(leave);
    });

    return leavesByEmployee;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Employees Leave Calendar</CardTitle>
                <CardDescription>
                  View all employees&apos; leave requests (Pending &amp; Approved only)
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth("prev")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-lg font-semibold min-w-[200px] text-center">
                  {monthNames[month]} {year}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="employee">Employee</Label>
                <Select
                  id="employee"
                  value={employeeFilter}
                  onChange={(e) => setEmployeeFilter(e.target.value)}
                >
                  <option value="All">All Employees</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  id="department"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="All">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Seniority</Label>
                <Select
                  id="grade"
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value as EmployeeGrade | "All")}
                >
                  <option value="All">All Levels</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                  <option value="Executive">Executive</option>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {dayNames.map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Calendar Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(year, month, day);
              const leavesByEmployee = getLeavesForDate(date);
              const isToday =
                date.toDateString() === new Date().toDateString();

              // Count leaves by status for this day
              const statusCounts: Record<string, number> = {};
              Object.values(leavesByEmployee).flat().forEach((leave) => {
                statusCounts[leave.status] = (statusCounts[leave.status] || 0) + 1;
              });

              const isPublicHolidayDate = isPublicHoliday(date);

              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-md p-1 text-sm overflow-y-auto ${
                    isToday ? "border-primary bg-primary/5" : ""
                  } ${isPublicHolidayDate ? "bg-red-50 dark:bg-red-950/20" : ""}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">{day}</div>
                    {isPublicHolidayDate && (
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" title="Public Holiday" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    {Object.entries(leavesByEmployee).map(([employeeName, leaves]) => {
                      // Get the status for this employee's leave (prioritize Pending)
                      const leaveStatus = leaves.find((l) => l.status === "Pending")?.status || leaves[0].status;
                      return (
                        <div
                          key={employeeName}
                          className={`text-xs p-0.5 rounded ${
                            STATUS_COLORS[leaveStatus] || "bg-gray-400"
                          } text-white truncate cursor-pointer`}
                          title={`${employeeName}: ${leaveStatus}`}
                          onClick={() => setSelectedLeave(leaves[0])}
                        >
                          {employeeName.split(" ")[0]}
                        </div>
                      );
                    })}
                    {Object.keys(leavesByEmployee).length === 0 && !isPublicHolidayDate && (
                      <div className="text-xs text-muted-foreground">No leaves</div>
                    )}
                    {isPublicHolidayDate && Object.keys(leavesByEmployee).length === 0 && (
                      <div className="text-xs text-red-600 dark:text-red-400">Public Holiday</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-500" />
              <span className="text-sm">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500" />
              <span className="text-sm">Approved</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Calendar shows employee names. Click on an employee&apos;s name to view leave details.
          </p>
        </CardContent>
      </Card>

      {/* Leave Detail Dialog */}
      {selectedLeave && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Leave Details</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedLeave(null)}
              className="absolute right-4 top-4"
            >
              ×
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <strong>Employee:</strong> {getEmployee(selectedLeave.employeeId)?.name || "Unknown"}
              </div>
              <div>
                <strong>Department:</strong> {getEmployee(selectedLeave.employeeId)?.department || "Unknown"}
              </div>
              <div>
                <strong>Date Range:</strong>{" "}
                {formatDateRange(selectedLeave.startDate, selectedLeave.endDate)}
              </div>
              <div>
                <strong>Leave Type:</strong> {selectedLeave.leaveType}
              </div>
              <div>
                <strong>Duration:</strong> {selectedLeave.duration}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    selectedLeave.status === "Approved"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}
                >
                  {selectedLeave.status}
                </span>
              </div>
              {selectedLeave.rejectReason && (
                <div>
                  <strong>Reject Reason:</strong>{" "}
                  <span className="text-red-600 dark:text-red-400">
                    {selectedLeave.rejectReason}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
