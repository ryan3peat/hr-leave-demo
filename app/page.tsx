import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-12 px-4">
      {/* Logo and Header */}
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-32 h-32 md:w-40 md:h-40">
          <Image
            src="/crane_logo.webp"
            alt="Company Logo"
            width={160}
            height={160}
            className="object-contain"
            priority
            unoptimized
          />
        </div>
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-blue-700 bg-clip-text text-transparent">
            HR Leave Management System
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
            Streamline your workforce leave management with our comprehensive solution
          </p>
        </div>
      </div>
      
      {/* Portal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        <Card className="border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100 dark:hover:shadow-blue-900">
          <CardHeader className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950 dark:to-teal-950 rounded-t-lg">
            <CardTitle className="text-2xl text-blue-700 dark:text-blue-300">Employee Portal</CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-400">
              View your leave balance, submit requests, and track your leave history
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Link href="/employee">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                Go to Employee Portal
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-teal-200 dark:border-teal-800 hover:border-teal-400 dark:hover:border-teal-600 transition-all duration-300 hover:shadow-xl hover:shadow-teal-100 dark:hover:shadow-teal-900">
          <CardHeader className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-950 dark:to-blue-950 rounded-t-lg">
            <CardTitle className="text-2xl text-teal-700 dark:text-teal-300">Admin Portal</CardTitle>
            <CardDescription className="text-teal-600 dark:text-teal-400">
              Manage employees, approve leave requests, and view analytics
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Link href="/admin">
              <Button className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                Go to Admin Portal
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
