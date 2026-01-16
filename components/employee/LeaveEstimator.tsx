"use client";

import { useState } from "react";
import { useLeaveManagement } from "@/hooks/useLeaveManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { calculateAnnualEntitlement } from "@/lib/calculations";
import { calculateLeaveDays } from "@/lib/dateUtils";
import { calculateYearsOfService } from "@/lib/dateUtils";
import { getPublicHolidaysInRange } from "@/lib/publicHolidays";
import { isAnnualLeave } from "@/lib/types";
import { Calculator } from "lucide-react";

export function LeaveEstimator() {
  const { currentEmployeeId, getEmployee, getEmployeeBalance, leaveRequests } =
    useLeaveManagement();
  const [targetDate, setTargetDate] = useState("");
  const [estimatedBalance, setEstimatedBalance] = useState<number | null>(null);

  if (!currentEmployeeId) {
    return <div>Please select an employee</div>;
  }

  const employee = getEmployee(currentEmployeeId);
  if (!employee) {
    return <div>Employee not found</div>;
  }

  const currentBalance = getEmployeeBalance(currentEmployeeId);

  const calculateEstimate = () => {
    if (!targetDate) {
      setEstimatedBalance(null);
      return;
    }

    const target = new Date(targetDate);
    const today = new Date();

    if (target <= today) {
      setEstimatedBalance(null);
      return;
    }

    // Calculate years of service at target date
    const yearsAtTarget = (target.getTime() - employee.firstDayOfWork.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    
    // Create a temporary employee object with target date for entitlement calculation
    // We need to calculate entitlement based on years of service at target date
    const tempEmployee = {
      ...employee,
      firstDayOfWork: new Date(employee.firstDayOfWork.getTime() - (yearsAtTarget * 365.25 * 24 * 60 * 60 * 1000))
    };
    
    // Actually, we need to calculate based on the actual years at target
    // The entitlement calculation uses differenceInYears which compares to today
    // So we need to simulate what the entitlement would be at target date
    const BASE_ENTITLEMENT: Record<string, number> = {
      Junior: 15,
      Mid: 18,
      Senior: 20,
      Executive: 25,
    };
    
    const SERVICE_BONUS: Record<string, number> = {
      "0-2": 0,
      "3-5": 2,
      "6-10": 4,
      "11+": 6,
    };
    
    const baseDays = BASE_ENTITLEMENT[employee.grade] || 15;
    let bonusDays = 0;
    if (yearsAtTarget >= 11) {
      bonusDays = SERVICE_BONUS["11+"];
    } else if (yearsAtTarget >= 6) {
      bonusDays = SERVICE_BONUS["6-10"];
    } else if (yearsAtTarget >= 3) {
      bonusDays = SERVICE_BONUS["3-5"];
    }
    
    const entitlementAtTarget = baseDays + bonusDays;

    // Get all approved annual leaves up to target date
    const approvedAnnualLeaves = leaveRequests.filter(
      (leave) =>
        leave.employeeId === currentEmployeeId &&
        leave.status === "Approved" &&
        isAnnualLeave(leave.leaveType) &&
        leave.endDate <= target
    );

    // Calculate total used days up to target date
    let totalUsed = 0;
    approvedAnnualLeaves.forEach((leave) => {
      const days = calculateLeaveDays(
        leave.startDate,
        leave.endDate,
        leave.duration
      );
      totalUsed += days;
    });

    // Calculate remaining balance
    const remaining = Math.max(0, entitlementAtTarget - totalUsed);

    setEstimatedBalance(remaining);
  };

  // Get public holidays between today and target date
  const publicHolidaysInRange =
    targetDate
      ? getPublicHolidaysInRange(new Date(), new Date(targetDate))
      : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          <CardTitle>Leave Estimator</CardTitle>
        </div>
        <CardDescription>
          Calculate how much annual leave you will have available by a future date
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="targetDate">Target Date</Label>
          <Input
            id="targetDate"
            type="date"
            value={targetDate}
            onChange={(e) => {
              setTargetDate(e.target.value);
              setEstimatedBalance(null);
            }}
            min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} // Tomorrow
          />
          <p className="text-xs text-muted-foreground">
            Select a future date to estimate your leave balance
          </p>
        </div>

        <Button onClick={calculateEstimate} className="w-full">
          Calculate Estimate
        </Button>

        {estimatedBalance !== null && (
          <div className="p-4 rounded-lg border bg-muted space-y-3">
            <div>
              <h4 className="font-semibold text-sm mb-2">Estimated Leave Balance</h4>
              <div className="text-3xl font-bold text-primary">
                {estimatedBalance.toFixed(1)} days
              </div>
              {publicHolidaysInRange.length > 0 && (
                <p className="text-xs text-blue-600 mt-1">
                  Note: {publicHolidaysInRange.length} public holiday(s) excluded from calculations
                </p>
              )}
            </div>
            <div className="space-y-1 text-sm text-muted-foreground border-t pt-3">
              <div className="flex justify-between">
                <span>Current Entitlement:</span>
                <span className="font-medium">{currentBalance.annualEntitlement} days</span>
              </div>
              <div className="flex justify-between">
                <span>Current Balance:</span>
                <span className="font-medium">{currentBalance.annualRemaining.toFixed(1)} days</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Balance on {new Date(targetDate).toLocaleDateString()}:</span>
                <span className="font-semibold text-primary">
                  {estimatedBalance.toFixed(1)} days
                </span>
              </div>
            </div>
          </div>
        )}

        {estimatedBalance === null && targetDate && (
          <div className="p-3 rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              Please select a future date and click "Calculate Estimate"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
