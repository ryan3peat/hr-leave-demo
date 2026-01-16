"use client";

import { useLeaveManagement } from "@/hooks/useLeaveManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle2, BarChart3, FileText, Calendar } from "lucide-react";
import { calculateYearsOfService } from "@/lib/dateUtils";

export default function AdminDashboard() {
  const { employees, leaveRequests, getPendingLeaves } = useLeaveManagement();

  const pendingLeaves = getPendingLeaves();
  const approvedLeaves = leaveRequests.filter((l) => l.status === "Approved");
  const totalEmployees = employees.length;
  const totalLeaves = leaveRequests.length;

  // Calculate average years of service
  const avgYearsOfService =
    employees.reduce((sum, emp) => sum + calculateYearsOfService(emp.firstDayOfWork), 0) /
    employees.length;

  // Calculate approval rate
  const approvalRate =
    leaveRequests.length > 0
      ? (approvedLeaves.length / leaveRequests.length) * 100
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of leave management system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/employees">
          <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                Avg. {avgYearsOfService.toFixed(1)} years service
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/approvals">
          <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingLeaves.length}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting approval
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/analytics">
          <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leave Requests</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLeaves}</div>
              <p className="text-xs text-muted-foreground">
                {approvalRate.toFixed(1)}% approval rate
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/analytics">
          <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Leaves</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedLeaves.length}</div>
              <p className="text-xs text-muted-foreground">
                All time approved
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link href="/admin/employees">
          <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-base">Employee Management</CardTitle>
              <CardDescription>
                View and manage employee leave balances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Users className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/approvals">
          <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-base">Approval Queue</CardTitle>
              <CardDescription>
                Review and approve pending leave requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/calendar">
          <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-base">Leave Calendar</CardTitle>
              <CardDescription>
                View all employees&apos; leave on calendar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/analytics">
          <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-base">Analytics Dashboard</CardTitle>
              <CardDescription>
                View leave utilization and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
