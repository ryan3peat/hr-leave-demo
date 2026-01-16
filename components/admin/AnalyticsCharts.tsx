"use client";

import { useMemo } from "react";
import { useLeaveManagement } from "@/hooks/useLeaveManagement";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateLeaveCSV, downloadCSV } from "@/lib/csvExport";
import { Download } from "lucide-react";
import { calculateLeaveDays } from "@/lib/dateUtils";
import { isAnnualLeave } from "@/lib/types";

export function AnalyticsCharts() {
  const { employees, getAllLeaves, getEmployeeBalance } = useLeaveManagement();

  const allLeaves = getAllLeaves();
  const approvedLeaves = allLeaves.filter((l) => l.status === "Approved");

  // Utilization Rate Chart Data
  const utilizationData = useMemo(() => {
    return employees
      .map((emp) => {
        const balance = getEmployeeBalance(emp.id);
        const utilizationRate =
          balance.annualEntitlement > 0
            ? (balance.annualUsed / balance.annualEntitlement) * 100
            : 0;
        return {
          name: emp.name.split(" ")[0], // First name only for readability
          utilization: parseFloat(utilizationRate.toFixed(1)),
        };
      })
      .sort((a, b) => b.utilization - a.utilization)
      .slice(0, 10); // Top 10 for readability
  }, [employees, getEmployeeBalance]);

  // Leave Type Breakdown
  const leaveTypeData = useMemo(() => {
    const typeCounts: Record<string, number> = {};
    approvedLeaves.forEach((leave) => {
      const days = calculateLeaveDays(
        leave.startDate,
        leave.endDate,
        leave.duration
      );
      typeCounts[leave.leaveType] = (typeCounts[leave.leaveType] || 0) + days;
    });

    return Object.entries(typeCounts).map(([type, days]) => ({
      name: type,
      value: parseFloat(days.toFixed(1)),
    }));
  }, [approvedLeaves]);

  // Monthly Trends
  const monthlyData = useMemo(() => {
    const monthlyCounts: Record<string, number> = {};
    approvedLeaves.forEach((leave) => {
      const monthKey = `${leave.startDate.getFullYear()}-${String(
        leave.startDate.getMonth() + 1
      ).padStart(2, "0")}`;
      const days = calculateLeaveDays(
        leave.startDate,
        leave.endDate,
        leave.duration
      );
      monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + days;
    });

    return Object.entries(monthlyCounts)
      .map(([month, days]) => ({
        month: month.split("-")[1] + "/" + month.split("-")[0].slice(2),
        days: parseFloat(days.toFixed(1)),
      }))
      .sort((a, b) => {
        const [monthA, yearA] = a.month.split("/").map(Number);
        const [monthB, yearB] = b.month.split("/").map(Number);
        if (yearA !== yearB) return yearA - yearB;
        return monthA - monthB;
      })
      .slice(-12); // Last 12 months
  }, [approvedLeaves]);

  // Grade Comparison
  const gradeData = useMemo(() => {
    const gradeStats: Record<
      string,
      { used: number; entitlement: number; count: number }
    > = {};

    employees.forEach((emp) => {
      const balance = getEmployeeBalance(emp.id);
      if (!gradeStats[emp.grade]) {
        gradeStats[emp.grade] = { used: 0, entitlement: 0, count: 0 };
      }
      gradeStats[emp.grade].used += balance.annualUsed;
      gradeStats[emp.grade].entitlement += balance.annualEntitlement;
      gradeStats[emp.grade].count += 1;
    });

    return Object.entries(gradeStats).map(([grade, stats]) => ({
      grade,
      avgUsed: parseFloat((stats.used / stats.count).toFixed(1)),
      avgEntitlement: parseFloat((stats.entitlement / stats.count).toFixed(1)),
    }));
  }, [employees, getEmployeeBalance]);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  const handleCSVExport = () => {
    const csvContent = generateLeaveCSV(allLeaves, employees);
    downloadCSV(csvContent, `leave-data-${new Date().toISOString().split("T")[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Leave utilization and trends analysis
          </p>
        </div>
        <Button onClick={handleCSVExport}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Utilization Rate Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Utilization Rates</CardTitle>
          <CardDescription>
            Percentage of annual entitlement used per employee
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={utilizationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="utilization" fill="#8884d8" name="Utilization %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Leave Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Type Breakdown</CardTitle>
          <CardDescription>Total days by leave type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leaveTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {leaveTypeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Leave Trends</CardTitle>
          <CardDescription>Total leave days per month (last 12 months)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="days"
                stroke="#8884d8"
                name="Days"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Grade Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Comparison</CardTitle>
          <CardDescription>
            Average annual leave used vs entitlement by grade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gradeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgUsed" fill="#8884d8" name="Avg Used" />
              <Bar dataKey="avgEntitlement" fill="#82ca9d" name="Avg Entitlement" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
