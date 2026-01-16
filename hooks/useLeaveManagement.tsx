"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Employee, LeaveRequest, LeaveBalance } from "@/lib/types";
import { MOCK_EMPLOYEES, MOCK_LEAVE_REQUESTS } from "@/lib/mockData";
import { calculateLeaveBalance } from "@/lib/calculations";

interface LeaveManagementContextType {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  currentEmployeeId: string | null;
  setCurrentEmployeeId: (id: string | null) => void;
  getEmployee: (id: string) => Employee | undefined;
  getEmployeeBalance: (employeeId: string) => LeaveBalance;
  getEmployeeLeaves: (employeeId: string) => LeaveRequest[];
  submitLeaveRequest: (request: Omit<LeaveRequest, "id" | "submittedAt">) => void;
  updateLeaveStatus: (leaveId: string, status: "Approved" | "Rejected", rejectReason?: string) => void;
  withdrawLeaveRequest: (leaveId: string) => void;
  getPendingLeaves: () => LeaveRequest[];
  getAllLeaves: () => LeaveRequest[];
  addEmployee: (employee: Omit<Employee, "id">) => void;
}

const LeaveManagementContext = createContext<LeaveManagementContextType | undefined>(undefined);

export function LeaveManagementProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string | null>("emp001");

  const getEmployee = useCallback(
    (id: string) => employees.find((emp) => emp.id === id),
    [employees]
  );

  const getEmployeeBalance = useCallback(
    (employeeId: string): LeaveBalance => {
      const employee = getEmployee(employeeId);
      if (!employee) {
        return {
          annualEntitlement: 0,
          annualUsed: 0,
          annualRemaining: 0,
          nonAnnualUsed: 0,
        };
      }
      return calculateLeaveBalance(employee, leaveRequests);
    },
    [leaveRequests, getEmployee]
  );

  const getEmployeeLeaves = useCallback(
    (employeeId: string): LeaveRequest[] => {
      return leaveRequests.filter((leave) => leave.employeeId === employeeId);
    },
    [leaveRequests]
  );

  const submitLeaveRequest = useCallback(
    (request: Omit<LeaveRequest, "id" | "submittedAt">) => {
      const newRequest: LeaveRequest = {
        ...request,
        id: `leave${Date.now()}`,
        submittedAt: new Date(),
      };
      setLeaveRequests((prev) => [...prev, newRequest]);
    },
    []
  );

  const updateLeaveStatus = useCallback(
    (leaveId: string, status: "Approved" | "Rejected", rejectReason?: string) => {
      setLeaveRequests((prev) =>
        prev.map((leave) =>
          leave.id === leaveId
            ? { ...leave, status, rejectReason: status === "Rejected" ? rejectReason : undefined }
            : leave
        )
      );
    },
    []
  );

  const withdrawLeaveRequest = useCallback(
    (leaveId: string) => {
      setLeaveRequests((prev) => prev.filter((leave) => leave.id !== leaveId));
    },
    []
  );

  const getPendingLeaves = useCallback(() => {
    return leaveRequests.filter((leave) => leave.status === "Pending");
  }, [leaveRequests]);

  const getAllLeaves = useCallback(() => {
    return leaveRequests;
  }, [leaveRequests]);

  const addEmployee = useCallback(
    (employeeData: Omit<Employee, "id">) => {
      const newEmployee: Employee = {
        ...employeeData,
        id: `emp${String(employees.length + 1).padStart(3, "0")}`,
      };
      setEmployees((prev) => [...prev, newEmployee]);
    },
    [employees.length]
  );

  return (
    <LeaveManagementContext.Provider
      value={{
        employees,
        leaveRequests,
        currentEmployeeId,
        setCurrentEmployeeId,
        getEmployee,
        getEmployeeBalance,
        getEmployeeLeaves,
        submitLeaveRequest,
        updateLeaveStatus,
        withdrawLeaveRequest,
        getPendingLeaves,
        getAllLeaves,
        addEmployee,
      }}
    >
      {children}
    </LeaveManagementContext.Provider>
  );
}

export function useLeaveManagement() {
  const context = useContext(LeaveManagementContext);
  if (context === undefined) {
    throw new Error("useLeaveManagement must be used within LeaveManagementProvider");
  }
  return context;
}
