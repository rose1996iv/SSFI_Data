import Link from "next/link";

import { SignInForm } from "@/components/auth/sign-in-form";
import { LogoMark } from "@/components/shared/logo-mark";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const errorParam = params.error;

  const errorMessages: Record<string, string> = {
    pending_approval: "Your account is awaiting admin approval. Please contact your administrator.",
  };

  const errorMessage = errorParam ? errorMessages[errorParam] : null;

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <LogoMark />
            <div>
              <p className="font-semibold">SSFI Data Center</p>
              <p className="text-xs text-muted-foreground">Secure access portal</p>
            </div>
          </Link>
          <ThemeToggle />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-border/70 bg-card/75 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-3xl">Protect SSFI institutional memory.</CardTitle>
              <CardDescription className="text-base leading-7">
                Sign in to manage members, review leadership continuity, update graduate records, and safeguard
                organizational documents.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
              <p>Role-based access separates executive workflows, member visibility, alumni directories, and admin operations.</p>
              <p>Supabase Auth, protected routes, RLS policies, and secure storage are baked into the platform foundation.</p>
              <p>When Supabase is not configured, the app opens in demo mode so development can continue safely.</p>
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-card/75 backdrop-blur">
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>Use your SSFI credentials to access the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {errorMessage ? (
                <Alert variant="destructive">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              ) : null}
              <SignInForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
