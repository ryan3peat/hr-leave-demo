"use client";

import { useState, useMemo } from "react";
import { useLeaveManagement } from "@/hooks/useLeaveManagement";
import { LeaveRequest, LeaveStatus, LeaveType } from "@/lib/types";
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
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { formatDateRange } from "@/lib/dateUtils";
import { calculateLeaveDays } from "@/lib/dateUtils";
import { LEAVE_TYPES } from "@/lib/types";

export function LeaveHistoryTable() {
  const { currentEmployeeId, getEmployeeLeaves } = useLeaveManagement();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | "All">("All");
  const [typeFilter, setTypeFilter] = useState<LeaveType | "All">("All");
  const [sortBy, setSortBy] = useState<"date" | "type" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!currentEmployeeId) {
    return <div>Please select an employee</div>;
  }

  const allLeaves = getEmployeeLeaves(currentEmployeeId);

  // Filter and sort leaves
  const filteredLeaves = useMemo(() => {
    let filtered = [...allLeaves];

    // Search filter (by leave type)
    if (searchTerm) {
      filtered = filtered.filter((leave) =>
        leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((leave) => leave.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== "All") {
      filtered = filtered.filter((leave) => leave.leaveType === typeFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = a.startDate.getTime() - b.startDate.getTime();
          break;
        case "type":
          comparison = a.leaveType.localeCompare(b.leaveType);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [allLeaves, searchTerm, statusFilter, typeFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredLeaves.length / itemsPerPage);
  const paginatedLeaves = filteredLeaves.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (column: "date" | "type" | "status") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getStatusColor = (status: LeaveStatus) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave History</CardTitle>
        <CardDescription>View and filter your leave request history</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search by leave type..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as LeaveStatus | "All");
                setCurrentPage(1);
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Leave Type</Label>
            <Select
              id="type"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as LeaveType | "All");
                setCurrentPage(1);
              }}
            >
              <option value="All">All Types</option>
              {LEAVE_TYPES.map((type) => (
                <option key={type.type} value={type.type}>
                  {type.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("date")}
                >
                  Date{" "}
                  {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("type")}
                >
                  Leave Type{" "}
                  {sortBy === "type" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Days</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("status")}
                >
                  Status{" "}
                  {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLeaves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No leave records found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLeaves.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell className="font-medium">
                      {formatDateRange(leave.startDate, leave.endDate)}
                    </TableCell>
                    <TableCell>{leave.leaveType}</TableCell>
                    <TableCell>{leave.duration}</TableCell>
                    <TableCell>
                      {calculateLeaveDays(
                        leave.startDate,
                        leave.endDate,
                        leave.duration
                      ).toFixed(1)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          leave.status
                        )}`}
                      >
                        {leave.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredLeaves.length)} of{" "}
              {filteredLeaves.length} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
