"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LeaveBalance } from "@/lib/types";
import { Info } from "lucide-react";

interface BalanceCardProps {
  title: string;
  balance: LeaveBalance;
  isAnnual?: boolean;
}

export function BalanceCard({ title, balance, isAnnual = true }: BalanceCardProps) {
  const used = isAnnual ? balance.annualUsed : balance.nonAnnualUsed;
  const total = isAnnual ? balance.annualEntitlement : undefined;
  const remaining = isAnnual ? balance.annualRemaining : undefined;
  const percentage = total ? (used / total) * 100 : 0;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          {title}
          {!isAnnual && (
            <div className="group relative">
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              <div className="absolute left-1/2 top-6 -translate-x-1/2 w-64 p-2 bg-popover border rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <p className="text-sm text-popover-foreground">
                  Includes Sick Leave, Personal Leave, Bereavement Leave, and other non-annual leave types that don&apos;t count towards your annual entitlement.
                </p>
              </div>
            </div>
          )}
        </CardTitle>
        <CardDescription>
          {isAnnual
            ? `Entitlement: ${total} days`
            : "No balance limit"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Used</span>
            <span className="font-medium">{used.toFixed(1)} days</span>
          </div>
          {isAnnual && (
            <>
              <div className="relative">
                <Progress value={percentage} className="h-2" />
                <div className="absolute -top-1 right-0 text-xs font-medium bg-background px-1 rounded">
                  {used.toFixed(1)}
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-semibold text-primary">
                  {remaining?.toFixed(1)} days
                </span>
              </div>
            </>
          )}
        </div>
        {isAnnual && (
          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              {percentage.toFixed(1)}% of entitlement used
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
