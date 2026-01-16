import { LeaveRequest, Employee } from "./types";

/**
 * Generate CSV content from leave requests and employees
 */
export function generateLeaveCSV(
  leaveRequests: LeaveRequest[],
  employees: Employee[]
): string {
  // Create employee lookup map
  const employeeMap = new Map(employees.map((emp) => [emp.id, emp]));

  // CSV header
  const headers = [
    "Employee Name",
    "Employee Email",
    "Start Date",
    "End Date",
    "Leave Type",
    "Duration",
    "Status",
    "Submitted At",
  ];

  // CSV rows
  const rows = leaveRequests.map((leave) => {
    const employee = employeeMap.get(leave.employeeId);
    const employeeName = employee?.name || "Unknown";
    const employeeEmail = employee?.email || "";

    return [
      employeeName,
      employeeEmail,
      leave.startDate.toISOString().split("T")[0],
      leave.endDate.toISOString().split("T")[0],
      leave.leaveType,
      leave.duration,
      leave.status,
      leave.submittedAt.toISOString().split("T")[0],
    ];
  });

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  return csvContent;
}

/**
 * Download CSV file using Blob API
 */
export function downloadCSV(csvContent: string, filename: string = "leave-data.csv") {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
