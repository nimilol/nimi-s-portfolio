"use client";
import { useActionState } from "react";
import { login } from "../actions";
import { inputClass } from "@/components/admin/ItemForm";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);
  return (
    <form action={formAction} className="space-y-4">
      <label className="block space-y-2 text-sm">
        <span className="block">Email</span>
        <input name="email" type="email" autoComplete="email" required className={inputClass} />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="block">Password</span>
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </label>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button type="submit" disabled={pending} className="w-full bg-accent py-3 text-sm font-medium text-bg disabled:opacity-50">
        {pending ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
