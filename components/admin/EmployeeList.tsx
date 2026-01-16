"use client";

import { useState, useMemo } from "react";
import { useLeaveManagement } from "@/hooks/useLeaveManagement";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { calculateYearsOfService } from "@/lib/dateUtils";
import { EmployeeGrade } from "@/lib/types";
import { AddEmployeeForm } from "./AddEmployeeForm";
import { UserPlus } from "lucide-react";

export function EmployeeList() {
  const { employees, getEmployeeBalance } = useLeaveManagement();
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState<EmployeeGrade | "All">("All");
  const [sortBy, setSortBy] = useState<"name" | "grade" | "balance">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showAddForm, setShowAddForm] = useState(false);

  // Filter and sort employees
  const filteredEmployees = useMemo(() => {
    let filtered = [...employees];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Grade filter
    if (gradeFilter !== "All") {
      filtered = filtered.filter((emp) => emp.grade === gradeFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "grade":
          comparison = a.grade.localeCompare(b.grade);
          break;
        case "balance":
          const balanceA = getEmployeeBalance(a.id).annualRemaining;
          const balanceB = getEmployeeBalance(b.id).annualRemaining;
          comparison = balanceA - balanceB;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [employees, searchTerm, gradeFilter, sortBy, sortOrder, getEmployeeBalance]);

  const handleSort = (column: "name" | "grade" | "balance") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Employee List</CardTitle>
              <CardDescription>View employee leave balances and details</CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <select
              id="grade"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value as EmployeeGrade | "All")}
            >
              <option value="All">All Grades</option>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
              <option value="Executive">Executive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("name")}
                >
                  Name{" "}
                  {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("grade")}
                >
                  Grade{" "}
                  {sortBy === "grade" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>Years of Service</TableHead>
                <TableHead>Annual Entitlement</TableHead>
                <TableHead>Annual Used</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("balance")}
                >
                  Remaining{" "}
                  {sortBy === "balance" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>Non-Annual Used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    No employees found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => {
                  const balance = getEmployeeBalance(employee.id);
                  const yearsOfService = calculateYearsOfService(employee.firstDayOfWork);

                  return (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.grade}</TableCell>
                      <TableCell>{yearsOfService.toFixed(1)}</TableCell>
                      <TableCell>{balance.annualEntitlement}</TableCell>
                      <TableCell>{balance.annualUsed.toFixed(1)}</TableCell>
                      <TableCell className="font-semibold">
                        {balance.annualRemaining.toFixed(1)}
                      </TableCell>
                      <TableCell>{balance.nonAnnualUsed.toFixed(1)}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
    <AddEmployeeForm open={showAddForm} onOpenChange={setShowAddForm} />
    </>
  );
}
