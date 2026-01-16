import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-4">
      <Link href="/admin">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin Dashboard
        </Button>
      </Link>
      <AnalyticsCharts />
    </div>
  );
}
