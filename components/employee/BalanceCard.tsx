"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LeaveBalance } from "@/lib/types";

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
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
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
              <Progress value={percentage} className="h-2" />
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
