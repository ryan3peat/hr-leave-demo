import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4">
      {/* Hero Section */}
      <div className="text-center space-y-12 max-w-4xl mx-auto">
        {/* Logo */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto">
          <Image
            src="/crane_logo.webp"
            alt="Company Logo"
            width={128}
            height={128}
            className="object-contain drop-shadow-lg"
            priority
            unoptimized
          />
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <Card className="group border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <CardTitle className="text-2xl font-semibold text-foreground">Employee Portal</CardTitle>
              <CardDescription className="text-muted-foreground text-base leading-relaxed">
                Access your leave balance, submit requests, and manage your schedule with ease
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href="/employee">
                <Button className="w-full h-14 text-lg font-medium bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                  Access Portal
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <CardTitle className="text-2xl font-semibold text-foreground">Admin Portal</CardTitle>
              <CardDescription className="text-muted-foreground text-base leading-relaxed">
                Oversee team management, process approvals, and gain insights through analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href="/admin">
                <Button className="w-full h-14 text-lg font-medium bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                  Access Portal
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
