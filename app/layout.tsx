import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LeaveManagementProvider } from "@/hooks/useLeaveManagement";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HR Leave Management System",
  description: "Employee leave management and tracking system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LeaveManagementProvider>
          <div className="min-h-screen bg-background">
            <nav className="border-b bg-card">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <Link href="/">
                    <h1 className="text-xl font-bold cursor-pointer hover:opacity-80">HR Leave Management</h1>
                  </Link>
                  <div className="flex gap-2">
                    <Link href="/">
                      <Button variant="ghost" size="sm">
                        Home
                      </Button>
                    </Link>
                    <Link href="/employee">
                      <Button variant="ghost" size="sm">
                        Employee Portal
                      </Button>
                    </Link>
                    <Link href="/admin">
                      <Button variant="ghost" size="sm">
                        Admin Portal
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
        </LeaveManagementProvider>
      </body>
    </html>
  );
}
