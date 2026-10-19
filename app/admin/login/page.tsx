import type { Metadata } from "next";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "admin login", robots: { index: false } };

export default function LoginPage() {
  const configured = isSupabaseConfigured() && !!process.env.ADMIN_EMAIL;
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 font-display text-4xl font-semibold">
          admin<span className="text-accent">.</span>
        </h1>
        {configured ? (
          <LoginForm />
        ) : (
          <div className="space-y-3 border border-line p-5 text-sm text-muted">
            <p className="text-fg">Supabase isn&apos;t connected yet.</p>
            <p>
              Add <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and <code>ADMIN_EMAIL</code> in
              Vercel → Settings → Environment Variables, then redeploy. Full steps are in <code>docs/SETUP.md</code>.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
