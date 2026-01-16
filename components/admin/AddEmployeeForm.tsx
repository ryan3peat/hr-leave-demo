"use client";

import { useState } from "react";
import { useLeaveManagement } from "@/hooks/useLeaveManagement";
import { EmployeeGrade } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { UserPlus } from "lucide-react";

interface AddEmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddEmployeeForm({ open, onOpenChange }: AddEmployeeFormProps) {
  const { addEmployee } = useLeaveManagement();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState<EmployeeGrade>("Junior");
  const [department, setDepartment] = useState("Engineering");
  const [firstDayOfWork, setFirstDayOfWork] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const departments = [
    "Engineering",
    "Sales",
    "Marketing",
    "HR",
    "Finance",
    "Operations",
    "IT",
    "Customer Support",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (!name || !email || !firstDayOfWork) {
        setError("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        setIsSubmitting(false);
        return;
      }

      // Validate date
      const startDate = new Date(firstDayOfWork);
      if (isNaN(startDate.getTime())) {
        setError("Please enter a valid date");
        setIsSubmitting(false);
        return;
      }

      // Add employee
      addEmployee({
        name,
        email,
        grade,
        department,
        firstDayOfWork: startDate,
      });

      // Reset form
      setName("");
      setEmail("");
      setGrade("Junior");
      setDepartment("Engineering");
      setFirstDayOfWork("");
      onOpenChange(false);
    } catch (err) {
      setError("Failed to add employee. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Add a new employee to the system. Leave entitlement will be calculated automatically based on grade and start date.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@company.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Grade *</Label>
            <Select
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value as EmployeeGrade)}
              required
            >
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
              <option value="Executive">Executive</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstDayOfWork">First Day of Work *</Label>
            <Input
              id="firstDayOfWork"
              type="date"
              value={firstDayOfWork}
              onChange={(e) => setFirstDayOfWork(e.target.value)}
              required
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
