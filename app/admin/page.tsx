"use client";

import { useLeaveManagement } from "@/hooks/useLeaveManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle2, BarChart3, Calendar } from "lucide-react";
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link href="/admin/employees">
          <Card className="modern-card cursor-pointer h-full group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">Total Employees</CardTitle>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{totalEmployees}</div>
              <p className="text-sm text-muted-foreground">
                Avg. {avgYearsOfService.toFixed(1)} years service
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/approvals">
          <Card className="modern-card cursor-pointer h-full group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">Pending Requests</CardTitle>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{pendingLeaves.length}</div>
              <p className="text-sm text-muted-foreground">
                Awaiting approval
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link href="/admin/analytics">
          <Card className="modern-card cursor-pointer h-full group">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">Analytics Dashboard</CardTitle>
              <CardDescription className="text-muted-foreground">
                View leave utilization and trends
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/employees">
          <Card className="modern-card cursor-pointer h-full group">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">Employee Management</CardTitle>
              <CardDescription className="text-muted-foreground">
                View and manage employee leave balances
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/approvals">
          <Card className="modern-card cursor-pointer h-full group">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">Approval Queue</CardTitle>
              <CardDescription className="text-muted-foreground">
                Review and approve pending leave requests
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/calendar">
          <Card className="modern-card cursor-pointer h-full group">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">Leave Calendar</CardTitle>
              <CardDescription className="text-muted-foreground">
                View all employees&apos; leave on calendar
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
