"use client";

import { useLeaveManagement } from "@/hooks/useLeaveManagement";
import { BalanceCard } from "@/components/employee/BalanceCard";
import { LeaveEstimator } from "@/components/employee/LeaveEstimator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDateRange } from "@/lib/dateUtils";
import { isFutureDate } from "@/lib/dateUtils";
import { Calendar, Plus } from "lucide-react";

export default function EmployeeDashboard() {
  const { currentEmployeeId, getEmployee, getEmployeeBalance, getEmployeeLeaves } =
    useLeaveManagement();

  if (!currentEmployeeId) {
    return <div>Please select an employee</div>;
  }

  const employee = getEmployee(currentEmployeeId);
  const balance = getEmployeeBalance(currentEmployeeId);
  const leaves = getEmployeeLeaves(currentEmployeeId);

  if (!employee) {
    return <div>Employee not found</div>;
  }

  // Get upcoming approved leaves (next 30 days)
  const upcomingLeaves = leaves
    .filter(
      (leave) =>
        leave.status === "Approved" &&
        isFutureDate(leave.startDate) &&
        leave.startDate.getTime() <= Date.now() + 30 * 24 * 60 * 60 * 1000
    )
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, 5);

  // Get recent activity (last 5 leaves)
  const recentActivity = leaves
    .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome, {employee.name}</h1>
        <p className="text-muted-foreground mt-1">
          {employee.grade} • {employee.email}
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BalanceCard title="Annual Leave Balance" balance={balance} isAnnual={true} />
        <BalanceCard title="Non-Annual Leave Usage" balance={balance} isAnnual={false} />
      </div>

      {/* Leave Estimator */}
      <LeaveEstimator />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link href="/employee/submit">
          <Card className="modern-card cursor-pointer h-full group">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">Submit Leave</CardTitle>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/employee/calendar">
          <Card className="modern-card cursor-pointer h-full group">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">View Calendar</CardTitle>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Upcoming Leave */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Leave</CardTitle>
          <CardDescription>Your approved leave in the next 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingLeaves.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming leave scheduled</p>
          ) : (
            <div className="space-y-3">
              {upcomingLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div>
                    <p className="font-medium">{leave.leaveType}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateRange(leave.startDate, leave.endDate)} • {leave.duration}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Approved
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest leave requests</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          ) : (
            <>
              <div className="space-y-3">
                {recentActivity.map((leave) => (
                  <div
                    key={leave.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div>
                      <p className="font-medium">{leave.leaveType}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateRange(leave.startDate, leave.endDate)} • {leave.duration}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        leave.status === "Approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : leave.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Link href="/employee/history">
                  <Button variant="outline" className="w-full">
                    More
                  </Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
