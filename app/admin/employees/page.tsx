import { EmployeeList } from "@/components/admin/EmployeeList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AdminEmployeesPage() {
  return (
    <div className="space-y-4">
      <Link href="/admin">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin Dashboard
        </Button>
      </Link>
      <EmployeeList />
    </div>
  );
}
