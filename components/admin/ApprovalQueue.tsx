"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDateRange } from "@/lib/dateUtils";
import { calculateLeaveDays } from "@/lib/dateUtils";
import { CheckCircle2, XCircle } from "lucide-react";

export function ApprovalQueue() {
  const { getPendingLeaves, getEmployee, updateLeaveStatus, leaveRequests } =
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
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date Range</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingLeaves.map((leave) => {
                    const employee = getEmployee(leave.employeeId);
                    const days = calculateLeaveDays(
                      leave.startDate,
                      leave.endDate,
                      leave.duration
                    );

                    return (
                      <TableRow key={leave.id}>
                        <TableCell className="font-medium">
                          {employee?.name || "Unknown"}
                        </TableCell>
                        <TableCell>
                          {formatDateRange(leave.startDate, leave.endDate)}
                        </TableCell>
                        <TableCell>{leave.leaveType}</TableCell>
                        <TableCell>{leave.duration}</TableCell>
                        <TableCell>{days.toFixed(1)}</TableCell>
                        <TableCell>
                          {leave.submittedAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => openDialog(leave.id, "approve")}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openDialog(leave.id, "reject")}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
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
