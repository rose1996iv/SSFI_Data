import Link from "next/link";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { LogoMark } from "@/components/shared/logo-mark";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <LogoMark />
            <div>
              <p className="font-semibold">SSFI Data Center</p>
              <p className="text-xs text-muted-foreground">Account recovery</p>
            </div>
          </Link>
          <ThemeToggle />
        </div>
        <Card className="border-border/70 bg-card/75 backdrop-blur">
          <CardHeader>
            <CardTitle>Reset password</CardTitle>
            <CardDescription>We’ll send password reset instructions to your registered email.</CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
