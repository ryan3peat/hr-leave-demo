/**
 * Employee grade levels
 */
export type EmployeeGrade = "Junior" | "Mid" | "Senior" | "Executive";

/**
 * Leave type categories
 */
export type LeaveCategory = "Annual" | "NonAnnual";

/**
 * Leave type definitions
 */
export type LeaveType =
  | "Vacation"      // Annual
  | "Personal"      // Annual
  | "Sick Leave"    // Non-Annual
  | "Bereavement"   // Non-Annual
  | "Medical"       // Non-Annual
  | "Parental";     // Non-Annual

/**
 * Leave duration options
 */
export type LeaveDuration = "Full Day" | "Half Day AM" | "Half Day PM";

/**
 * Leave request status
 */
export type LeaveStatus = "Pending" | "Approved" | "Rejected";

/**
 * Employee interface
 */
export interface Employee {
  id: string;
  name: string;
  email: string;
  grade: EmployeeGrade;
  department: string;
  firstDayOfWork: Date;
}

/**
 * Leave request interface
 */
export interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: Date;
  endDate: Date;
  leaveType: LeaveType;
  duration: LeaveDuration;
  status: LeaveStatus;
  submittedAt: Date;
  notes?: string;
  rejectReason?: string;
}

/**
 * Leave balance interface
 * Tracks annual leave balance and non-annual leave usage
 */
export interface LeaveBalance {
  annualEntitlement: number;
  annualUsed: number;
  annualRemaining: number;
  nonAnnualUsed: number;
}

/**
 * Leave type metadata
 */
export interface LeaveTypeInfo {
  type: LeaveType;
  category: LeaveCategory;
  label: string;
}

/**
 * Leave type configuration
 */
export const LEAVE_TYPES: LeaveTypeInfo[] = [
  { type: "Vacation", category: "Annual", label: "Vacation" },
  { type: "Personal", category: "Annual", label: "Personal" },
  { type: "Sick Leave", category: "NonAnnual", label: "Sick Leave" },
  { type: "Bereavement", category: "NonAnnual", label: "Bereavement" },
  { type: "Medical", category: "NonAnnual", label: "Medical" },
  { type: "Parental", category: "NonAnnual", label: "Parental" },
];

/**
 * Get leave type info by type
 */
export function getLeaveTypeInfo(type: LeaveType): LeaveTypeInfo {
  return LEAVE_TYPES.find((lt) => lt.type === type) || LEAVE_TYPES[0];
}

/**
 * Check if leave type is annual
 */
export function isAnnualLeave(type: LeaveType): boolean {
  return getLeaveTypeInfo(type).category === "Annual";
}
