"use client";

import { useState } from "react";
import { useLeaveManagement } from "@/hooks/useLeaveManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaveRequest, LEAVE_TYPES } from "@/lib/types";
import { formatDateRange } from "@/lib/dateUtils";
import { getMonthRange } from "@/lib/dateUtils";
import { isPublicHoliday, HK_PUBLIC_HOLIDAYS } from "@/lib/publicHolidays";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Color mapping for leave types
const LEAVE_COLORS: Record<string, string> = {
  Vacation: "bg-blue-500",
  Personal: "bg-purple-500",
  "Sick Leave": "bg-red-500",
  Bereavement: "bg-gray-500",
  Medical: "bg-orange-500",
  Parental: "bg-pink-500",
};

export function LeaveCalendar() {
  const { currentEmployeeId, getEmployeeLeaves } = useLeaveManagement();
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!currentEmployeeId) {
    return <div>Please select an employee</div>;
  }

  const leaves = getEmployeeLeaves(currentEmployeeId).filter(
    (leave) => leave.status === "Approved"
  );

  const { start: monthStart, end: monthEnd } = getMonthRange(currentDate);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Get leaves for this month
  const monthLeaves = leaves.filter((leave) => {
    const leaveStart = new Date(leave.startDate);
    const leaveEnd = new Date(leave.endDate);
    return (
      (leaveStart >= monthStart && leaveStart <= monthEnd) ||
      (leaveEnd >= monthStart && leaveEnd <= monthEnd) ||
      (leaveStart <= monthStart && leaveEnd >= monthEnd)
    );
  });

  // Get leaves for a specific date
  const getLeavesForDate = (date: Date): LeaveRequest[] => {
    const dateStr = date.toISOString().split("T")[0];
    return monthLeaves.filter((leave) => {
      const startStr = leave.startDate.toISOString().split("T")[0];
      const endStr = leave.endDate.toISOString().split("T")[0];
      return dateStr >= startStr && dateStr <= endStr;
    });
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Leave Calendar</CardTitle>
              <CardDescription>
                View your approved leave on the calendar
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
              const dayLeaves = getLeavesForDate(date);
              const isToday =
                date.toDateString() === new Date().toDateString();
              const isPublicHolidayDate = isPublicHoliday(date);
              const publicHoliday = isPublicHolidayDate
                ? HK_PUBLIC_HOLIDAYS.find(
                    (h) =>
                      h.date.getFullYear() === date.getFullYear() &&
                      h.date.getMonth() === date.getMonth() &&
                      h.date.getDate() === date.getDate()
                  )
                : null;

              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-md p-1 text-sm ${
                    isToday ? "border-primary bg-primary/5" : ""
                  } ${isPublicHolidayDate ? "bg-red-50 dark:bg-red-950/20" : ""}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">{day}</div>
                    {isPublicHolidayDate && (
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" title={publicHoliday?.name || "Public Holiday"} />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    {dayLeaves.slice(0, 2).map((leave) => (
                      <div
                        key={leave.id}
                        className={`text-xs p-0.5 rounded ${
                          LEAVE_COLORS[leave.leaveType] || "bg-gray-400"
                        } text-white truncate`}
                        title={`${leave.leaveType}: ${formatDateRange(
                          leave.startDate,
                          leave.endDate
                        )}`}
                      >
                        {leave.leaveType}
                      </div>
                    ))}
                    {dayLeaves.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayLeaves.length - 2} more
                      </div>
                    )}
                    {isPublicHolidayDate && dayLeaves.length === 0 && (
                      <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                        {publicHoliday?.name || "Public Holiday"}
                      </div>
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
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Leave Types</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {LEAVE_TYPES.map((type) => (
                  <div key={type.type} className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded ${
                        LEAVE_COLORS[type.type] || "bg-gray-400"
                      }`}
                    />
                    <span className="text-sm">{type.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Public Holidays</h4>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500" />
                <span className="text-sm">Public Holiday (marked with red dot)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
