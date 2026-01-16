"use client";

import { useState } from "react";
import { useLeaveManagement } from "@/hooks/useLeaveManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDateRange } from "@/lib/dateUtils";
import { calculateLeaveDays } from "@/lib/dateUtils";
import { CheckCircle2, XCircle, Trash2 } from "lucide-react";

export function ApprovalQueue() {
  const { getPendingLeaves, getEmployee, updateLeaveStatus, withdrawLeaveRequest, leaveRequests } =
    useLeaveManagement();
  const [selectedLeave, setSelectedLeave] = useState<string | null>(null);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const pendingLeaves = getPendingLeaves();

  const handleApprove = async (leaveId: string) => {
    setIsProcessing(true);
    try {
      updateLeaveStatus(leaveId, "Approved");
      setSelectedLeave(null);
      setAction(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (leaveId: string) => {
    setIsProcessing(true);
    try {
      updateLeaveStatus(leaveId, "Rejected", rejectReason || undefined);
      setSelectedLeave(null);
      setAction(null);
      setRejectReason("");
    } finally {
      setIsProcessing(false);
    }
  };

  const openDialog = (leaveId: string, actionType: "approve" | "reject") => {
    setSelectedLeave(leaveId);
    setAction(actionType);
    if (actionType === "reject") {
      setRejectReason("");
    }
  };

  const selectedLeaveData = pendingLeaves.find((l) => l.id === selectedLeave);
  const selectedEmployee = selectedLeaveData
    ? getEmployee(selectedLeaveData.employeeId)
    : null;

  // Get overlapping approved leaves for the selected request
  const getOverlappingApprovedLeaves = (leaveData: typeof selectedLeaveData) => {
    if (!leaveData || !selectedEmployee) return [];

    const overlappingLeaves = leaveRequests.filter((leave) => {
      // Only approved leaves from other employees
      if (leave.status !== "Approved" || leave.employeeId === leaveData.employeeId) {
        return false;
      }

      // Check for date overlap
      const leaveStart = leave.startDate;
      const leaveEnd = leave.endDate;
      const requestStart = leaveData.startDate;
      const requestEnd = leaveData.endDate;

      // Check if date ranges overlap
      return leaveStart <= requestEnd && leaveEnd >= requestStart;
    });

    // Get employee details and sort by department priority
    const overlappingWithEmployees = overlappingLeaves.map((leave) => {
      const employee = getEmployee(leave.employeeId);
      return {
        leave,
        employee,
        sameDepartment: employee?.department === selectedEmployee.department,
      };
    });

    // Sort: same department first, then by employee name
    return overlappingWithEmployees.sort((a, b) => {
      if (a.sameDepartment && !b.sameDepartment) return -1;
      if (!a.sameDepartment && b.sameDepartment) return 1;
      return (a.employee?.name || "").localeCompare(b.employee?.name || "");
    });
  };

  const overlappingApprovedLeaves = selectedLeaveData
    ? getOverlappingApprovedLeaves(selectedLeaveData)
    : [];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Approval Queue</CardTitle>
          <CardDescription>
            Review and approve pending leave requests ({pendingLeaves.length} pending)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingLeaves.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending leave requests
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingLeaves.map((leave) => {
                const employee = getEmployee(leave.employeeId);
                const days = calculateLeaveDays(
                  leave.startDate,
                  leave.endDate,
                  leave.duration
                );

                // Get overlapping approved leaves for this request
                const overlappingForThisLeave = leaveRequests.filter((otherLeave) => {
                  if (otherLeave.status !== "Approved" || otherLeave.employeeId === leave.employeeId) {
                    return false;
                  }
                  const otherStart = otherLeave.startDate;
                  const otherEnd = otherLeave.endDate;
                  const thisStart = leave.startDate;
                  const thisEnd = leave.endDate;
                  return otherStart <= thisEnd && otherEnd >= thisStart;
                });

                const sameDeptOverlaps = overlappingForThisLeave.filter((otherLeave) => {
                  const otherEmployee = getEmployee(otherLeave.employeeId);
                  return otherEmployee?.department === employee?.department;
                });

                return (
                  <Card key={leave.id} className="border-2">
                    <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{employee?.name || "Unknown"}</CardTitle>
                    {overlappingForThisLeave.length > 0 && (
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${
                          sameDeptOverlaps.length > 0
                            ? "bg-red-500"
                            : "bg-amber-500"
                        }`} />
                        <span className={`text-xs font-medium ${
                          sameDeptOverlaps.length > 0
                            ? "text-red-600 dark:text-red-400"
                            : "text-amber-600 dark:text-amber-400"
                        }`}>
                          {sameDeptOverlaps.length > 0 ? sameDeptOverlaps.length : overlappingForThisLeave.length}
                        </span>
                      </div>
                    )}
                  </div>
                  <CardDescription>{leave.leaveType}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="font-medium">Date Range:</span>{" "}
                          {formatDateRange(leave.startDate, leave.endDate)}
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span> {leave.duration}
                        </div>
                        <div>
                          <span className="font-medium">Days:</span> {days.toFixed(1)}
                        </div>
                        <div>
                          <span className="font-medium">Submitted:</span>{" "}
                          {leave.submittedAt.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => withdrawLeaveRequest(leave.id)}
                          className="flex-1"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          className="flex-1"
                          onClick={() => openDialog(leave.id, "approve")}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => openDialog(leave.id, "reject")}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        open={selectedLeave !== null && action !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLeave(null);
            setAction(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === "approve" ? "Approve Leave Request" : "Reject Leave Request"}
            </DialogTitle>
            <DialogDescription>
              {action === "approve"
                ? "Are you sure you want to approve this leave request?"
                : "Please provide a reason for rejecting this leave request."}
            </DialogDescription>
          </DialogHeader>
          {selectedLeaveData && selectedEmployee && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div>
                  <strong>Employee:</strong> {selectedEmployee.name}
                </div>
                <div>
                  <strong>Date Range:</strong>{" "}
                  {formatDateRange(
                    selectedLeaveData.startDate,
                    selectedLeaveData.endDate
                  )}
                </div>
                <div>
                  <strong>Leave Type:</strong> {selectedLeaveData.leaveType}
                </div>
                <div>
                  <strong>Duration:</strong> {selectedLeaveData.duration}
                </div>
                <div>
                  <strong>Days:</strong>{" "}
                  {calculateLeaveDays(
                    selectedLeaveData.startDate,
                    selectedLeaveData.endDate,
                    selectedLeaveData.duration
                  ).toFixed(1)}
                </div>
              </div>

              {/* Overlapping Approved Leaves */}
              {overlappingApprovedLeaves.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-amber-700 dark:text-amber-400">
                    ⚠️ Other employees on leave during this period:
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {overlappingApprovedLeaves.map(({ leave, employee, sameDepartment }) => (
                      <div
                        key={leave.id}
                        className={`p-2 rounded border text-sm ${
                          sameDepartment
                            ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                            : "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{employee?.name || "Unknown"}</span>
                          {sameDepartment && (
                            <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded">
                              Same Dept
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatDateRange(leave.startDate, leave.endDate)} • {leave.leaveType}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {overlappingApprovedLeaves.filter(l => l.sameDepartment).length > 0 && (
                      <span className="text-red-600 font-medium">
                        {overlappingApprovedLeaves.filter(l => l.sameDepartment).length} from same department
                      </span>
                    )}
                    {overlappingApprovedLeaves.filter(l => l.sameDepartment).length > 0 &&
                     overlappingApprovedLeaves.filter(l => !l.sameDepartment).length > 0 && (
                      <span> • </span>
                    )}
                    {overlappingApprovedLeaves.filter(l => !l.sameDepartment).length > 0 && (
                      <span>
                        {overlappingApprovedLeaves.filter(l => !l.sameDepartment).length} from other departments
                      </span>
                    )}
                  </div>
                </div>
              )}
              {action === "reject" && (
                <div className="space-y-2">
                  <Label htmlFor="rejectReason">Reject Reason *</Label>
                  <Input
                    id="rejectReason"
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    required
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedLeave(null);
                setAction(null);
                setRejectReason("");
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant={action === "approve" ? "default" : "destructive"}
              onClick={() => {
                if (selectedLeave) {
                  if (action === "approve") {
                    handleApprove(selectedLeave);
                  } else {
                    if (rejectReason.trim()) {
                      handleReject(selectedLeave);
                    }
                  }
                }
              }}
              disabled={isProcessing || (action === "reject" && !rejectReason.trim())}
            >
              {isProcessing
                ? "Processing..."
                : action === "approve"
                ? "Approve"
                : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
