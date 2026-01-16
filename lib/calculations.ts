import { Employee, LeaveRequest, LeaveBalance, isAnnualLeave } from "./types";
import { calculateYearsOfService, calculateLeaveDays, isDateRangeOverlapping } from "./dateUtils";

/**
 * Base entitlement matrix for 0-2 years of service
 */
const BASE_ENTITLEMENT: Record<string, number> = {
  Junior: 15,
  Mid: 18,
  Senior: 20,
  Executive: 25,
};

/**
 * Bonus days per service bracket
 */
const SERVICE_BONUS: Record<string, number> = {
  "0-2": 0,    // Base entitlement only
  "3-5": 2,    // +2 days per grade
  "6-10": 4,   // +4 days per grade
  "11+": 6,    // +6 days per grade
};

/**
 * Calculate annual leave entitlement based on employee grade and years of service
 * 
 * Rules:
 * - 0-2 years: Base entitlement (Junior: 15, Mid: 18, Senior: 20, Executive: 25)
 * - 3-5 years: Base + 2 days
 * - 6-10 years: Base + 4 days
 * - 11+ years: Base + 6 days
 */
export function calculateAnnualEntitlement(employee: Employee): number {
  const yearsOfService = calculateYearsOfService(employee.firstDayOfWork);
  const baseDays = BASE_ENTITLEMENT[employee.grade] || 15;
  
  let bonusDays = 0;
  if (yearsOfService >= 11) {
    bonusDays = SERVICE_BONUS["11+"];
  } else if (yearsOfService >= 6) {
    bonusDays = SERVICE_BONUS["6-10"];
  } else if (yearsOfService >= 3) {
    bonusDays = SERVICE_BONUS["3-5"];
  }
  
  return baseDays + bonusDays;
}

/**
 * Calculate leave balance for an employee based on their leave history
 * 
 * Annual Leave:
 * - Deducts from balance when status is "Approved"
 * - Full Day = 1 day, Half Day = 0.5 days
 * 
 * Non-Annual Leave:
 * - Tracked separately, no balance limit
 */
export function calculateLeaveBalance(
  employee: Employee,
  leaveRequests: LeaveRequest[]
): LeaveBalance {
  const annualEntitlement = calculateAnnualEntitlement(employee);
  
  // Filter leave requests for this employee
  const employeeLeaves = leaveRequests.filter(
    (leave) => leave.employeeId === employee.id
  );
  
  // Calculate annual leave used (only approved requests)
  const approvedAnnualLeaves = employeeLeaves.filter(
    (leave) => leave.status === "Approved" && isAnnualLeave(leave.leaveType)
  );
  
  let annualUsed = 0;
  approvedAnnualLeaves.forEach((leave) => {
    const days = calculateLeaveDays(
      leave.startDate,
      leave.endDate,
      leave.duration
    );
    annualUsed += days;
  });
  
  // Calculate non-annual leave used (only approved requests)
  const approvedNonAnnualLeaves = employeeLeaves.filter(
    (leave) => leave.status === "Approved" && !isAnnualLeave(leave.leaveType)
  );
  
  let nonAnnualUsed = 0;
  approvedNonAnnualLeaves.forEach((leave) => {
    const days = calculateLeaveDays(
      leave.startDate,
      leave.endDate,
      leave.duration
    );
    nonAnnualUsed += days;
  });
  
  const annualRemaining = Math.max(0, annualEntitlement - annualUsed);
  
  return {
    annualEntitlement,
    annualUsed,
    annualRemaining,
    nonAnnualUsed,
  };
}

/**
 * Check if employee has sufficient annual balance for a leave request
 */
export function hasSufficientBalance(
  employee: Employee,
  leaveRequests: LeaveRequest[],
  startDate: Date,
  endDate: Date,
  duration: "Full Day" | "Half Day AM" | "Half Day PM"
): boolean {
  const balance = calculateLeaveBalance(employee, leaveRequests);
  const requestedDays = calculateLeaveDays(startDate, endDate, duration);
  
  return balance.annualRemaining >= requestedDays;
}

/**
 * Check if leave request overlaps with existing approved leaves
 */
export function hasOverlappingLeave(
  employeeId: string,
  leaveRequests: LeaveRequest[],
  startDate: Date,
  endDate: Date,
  excludeLeaveId?: string
): boolean {
  const employeeLeaves = leaveRequests.filter(
    (leave) =>
      leave.employeeId === employeeId &&
      leave.status === "Approved" &&
      leave.id !== excludeLeaveId
  );
  
  return employeeLeaves.some((leave) => {
    return isDateRangeOverlapping(
      startDate,
      endDate,
      leave.startDate,
      leave.endDate
    );
  });
}
