import Link from "next/link";
import { ArrowRight, DatabaseZap, ShieldCheck, Users2 } from "lucide-react";

import { FadeIn } from "@/components/shared/fade-in";
import { LogoMark } from "@/components/shared/logo-mark";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-6 py-6 lg:px-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoMark />
            <div>
              <p className="text-sm font-medium text-muted-foreground">SSFI Data Center</p>
              <p className="text-xs text-muted-foreground">Private organizational intelligence platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-8 py-18 lg:grid-cols-[1.35fr_0.95fr] lg:py-24">
          <FadeIn className="space-y-8">
            <Badge variant="secondary" className="rounded-full px-4 py-1">
              Built for governance, continuity, and institutional memory
            </Badge>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                One secure home for SSFI members, leadership history, alumni, and official records.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Manage member profiles, preserve leadership timelines, organize alumni records, and centralize
                documents with a clean enterprise-grade experience powered by Next.js and Supabase.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="gap-2 rounded-full px-6">
                <Link href="/dashboard">
                  Open platform
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                <Link href="/login">Sign in securely</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { value: "124+", label: "Member records" },
                { value: "36", label: "Graduate profiles" },
                { value: "18", label: "Archived documents" },
              ].map((item) => (
                <Card key={item.label} className="border-border/70 bg-card/70 backdrop-blur">
                  <CardContent className="p-5">
                    <p className="text-2xl font-semibold">{item.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="relative">
              <div className="absolute inset-x-10 inset-y-8 rounded-[2rem] bg-primary/12 blur-3xl" />
              <Card className="relative overflow-hidden border-border/70 bg-card/80 backdrop-blur">
                <CardHeader className="border-b border-border/60">
                  <CardTitle className="text-xl">Platform architecture highlights</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 p-6">
                  {[
                    {
                      icon: Users2,
                      title: "Member-centric data model",
                      body: "Profiles, alumni records, and leadership history stay connected through normalized relationships.",
                    },
                    {
                      icon: ShieldCheck,
                      title: "Supabase Auth + RLS",
                      body: "Role-based access, secure document storage, protected APIs, and server-side validation are built in.",
                    },
                    {
                      icon: DatabaseZap,
                      title: "Scalable operational backbone",
                      body: "Prepared for analytics, mobile clients, event modules, attendance, and future AI-assisted search.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="rounded-2xl border border-border/70 bg-background/80 p-5">
                      <div className="mb-3 flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <item.icon className="size-5" />
                      </div>
                      <h2 className="text-base font-semibold">{item.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </FadeIn>
        </section>
      </div>
    </main>
  );
}
