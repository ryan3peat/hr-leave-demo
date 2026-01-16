"use client";

import { useState } from "react";
import { useLeaveManagement } from "@/hooks/useLeaveManagement";
import { LeaveType, LeaveDuration, LEAVE_TYPES, isAnnualLeave } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { hasSufficientBalance, hasOverlappingLeave } from "@/lib/calculations";
import { calculateLeaveDays } from "@/lib/dateUtils";
import { getPublicHolidaysInRange } from "@/lib/publicHolidays";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function LeaveForm() {
  const router = useRouter();
  const {
    currentEmployeeId,
    getEmployee,
    getEmployeeBalance,
    submitLeaveRequest,
    leaveRequests,
  } = useLeaveManagement();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [leaveType, setLeaveType] = useState<LeaveType>("Vacation");
  const [duration, setDuration] = useState<LeaveDuration>("Full Day");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentEmployeeId) {
    return <div>Please select an employee</div>;
  }

  const employee = getEmployee(currentEmployeeId);
  if (!employee) {
    return <div>Employee not found</div>;
  }

  const balance = getEmployeeBalance(currentEmployeeId);

  // Filter leave types based on category (for demo, show all)
  const availableLeaveTypes = LEAVE_TYPES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (!startDate || !endDate) {
        setError("Please select both start and end dates");
        return;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        setError("End date must be after start date");
        return;
      }

      // Check if annual leave and has sufficient balance
      if (isAnnualLeave(leaveType)) {
        if (
          !hasSufficientBalance(employee, leaveRequests, start, end, duration)
        ) {
          setError("Insufficient annual leave balance");
          return;
        }

        // Check for overlapping approved leaves
        if (hasOverlappingLeave(currentEmployeeId, leaveRequests, start, end)) {
          setError("You have overlapping approved leave during this period");
          return;
        }
      }

      // Submit leave request
      submitLeaveRequest({
        employeeId: currentEmployeeId,
        startDate: start,
        endDate: end,
        leaveType,
        duration,
        status: "Pending",
        notes: notes || undefined,
      });

      // Reset form
      setStartDate("");
      setEndDate("");
      setLeaveType("Vacation");
      setDuration("Full Day");
      setNotes("");

      // Redirect to dashboard
      router.push("/employee");
    } catch (err) {
      setError("Failed to submit leave request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate requested days for preview
  const requestedDays =
    startDate && endDate
      ? calculateLeaveDays(new Date(startDate), new Date(endDate), duration)
      : 0;

  // Calculate negative leave impact
  const negativeLeaveImpact = requestedDays > 0 && isAnnualLeave(leaveType)
    ? Math.max(0, requestedDays - balance.annualRemaining)
    : 0;

  // Get public holidays in the selected range
  const publicHolidaysInRange =
    startDate && endDate
      ? getPublicHolidaysInRange(new Date(startDate), new Date(endDate))
      : [];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Leave Request</CardTitle>
        <CardDescription>
          Fill in the details below to submit a new leave request
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Current Balance Display */}
        <div className="mb-6 p-4 rounded-lg border bg-card">
          <h3 className="text-lg font-semibold mb-3">Current Leave Balance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Annual Leave</p>
              <p className="text-2xl font-bold text-primary">{balance.annualRemaining.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">
                {balance.annualEntitlement} days entitlement • {balance.annualUsed.toFixed(1)} days used
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Non-Annual Leave</p>
              <p className="text-2xl font-bold text-primary">{balance.nonAnnualUsed.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">days used this year</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                min={startDate || new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {/* Leave Type */}
          <div className="space-y-2">
            <Label htmlFor="leaveType">Leave Type</Label>
            <Select
              id="leaveType"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveType)}
              required
            >
              {availableLeaveTypes.map((type) => (
                <option key={type.type} value={type.type}>
                  {type.label} ({type.category})
                </option>
              ))}
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value as LeaveDuration)}
              required
            >
              <option value="Full Day">Full Day</option>
              <option value="Half Day AM">Half Day (AM)</option>
              <option value="Half Day PM">Half Day (PM)</option>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
            />
          </div>

          {/* Balance Preview */}
          {startDate && endDate && isAnnualLeave(leaveType) && (
            <div className="p-4 rounded-lg border bg-muted">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Request Summary</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Requested: {requestedDays} working day(s)
                    {publicHolidaysInRange.length > 0 && (
                      <span className="text-xs text-blue-600 ml-2">
                        ({publicHolidaysInRange.length} public holiday(s) excluded)
                      </span>
                    )}
                  </p>
                  {publicHolidaysInRange.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Public holidays excluded: {publicHolidaysInRange.map(h => h.name).join(", ")}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Remaining Balance: {balance.annualRemaining.toFixed(1)} days
                  </p>
                  <p className="text-sm text-muted-foreground">
                    After approval: {(balance.annualRemaining - requestedDays).toFixed(1)} days
                  </p>
                  {balance.annualRemaining >= requestedDays ? (
                    <p className="text-sm text-green-600 mt-2 font-medium">
                      ✓ Sufficient balance available
                    </p>
                  ) : (
                    <div className="mt-2">
                      <p className="text-sm text-red-600 font-medium">
                        ⚠ You will have {negativeLeaveImpact.toFixed(1)} negative leave day(s)
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        This request will put you into negative leave balance
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
