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
            <nav className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
              <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                  <Link href="/">
                    <div className="flex items-center space-x-2 cursor-pointer group">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">Leave Management</span>
                    </div>
                  </Link>
                  <div className="flex items-center gap-1">
                    <Link href="/">
                      <Button variant="ghost" size="sm" className="font-medium hover:bg-primary/5 hover:text-primary transition-all duration-200">
                        Home
                      </Button>
                    </Link>
                    <Link href="/employee">
                      <Button variant="ghost" size="sm" className="font-medium hover:bg-primary/5 hover:text-primary transition-all duration-200">
                        Employee
                      </Button>
                    </Link>
                    <Link href="/admin">
                      <Button variant="ghost" size="sm" className="font-medium hover:bg-primary/5 hover:text-primary transition-all duration-200">
                        Admin
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
            <main className="container mx-auto px-4 py-12">{children}</main>
          </div>
        </LeaveManagementProvider>
      </body>
    </html>
  );
}
