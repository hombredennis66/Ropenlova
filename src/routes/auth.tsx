import { useState, useEffect, useRef } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In / Sign Up — Depthscape" },
      {
        name: "description",
        content: "Create an account or log in to access the Depthscape immersive data experience.",
      },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "signup";

const RESEND_COOLDOWN = 30;

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);

  // Email verification UI state
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isUnverified = !!user && !user.email_confirmed_at;

  useEffect(() => {
    // Only auto-redirect a fully verified, signed-in user.
    if (!loading && user && user.email_confirmed_at) navigate({ to: "/" });
  }, [user, loading, navigate]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleResend = async (targetEmail: string) => {
    if (cooldown > 0 || !targetEmail) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: targetEmail,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      toast.success(`Verification email sent to ${targetEmail}.`);
      startCooldown();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not resend email");
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: displayName },
          },
        });
        if (error) throw error;
        // If a session was returned, email auto-confirm is on — go home.
        if (data.session) {
          toast.success("Account created!");
          navigate({ to: "/" });
        } else {
          toast.success("Account created! Check your email to confirm.");
          setVerifyEmail(email);
          startCooldown();
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (/email not confirmed/i.test(error.message)) {
            setVerifyEmail(email);
            toast.error("Your email isn't verified yet. Resend the verification link below.");
            return;
          }
          throw error;
        }
        toast.success("Welcome back!");
        navigate({ to: "/" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error("Google sign-in failed. Please try again.");
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/" });
    } finally {
      setBusy(false);
    }
  };

  // Determine which email to verify (post-signup/login flow, or signed-in unverified user)
  const pendingEmail = verifyEmail ?? (isUnverified ? user!.email ?? "" : null);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-darkbadge px-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(90,225,76,0.18), transparent 70%), radial-gradient(50% 40% at 80% 100%, rgba(90,225,76,0.10), transparent 70%)",
        }}
      />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <Link
          to="/"
          className="font-schibsted font-semibold text-white"
          style={{ fontSize: 22, letterSpacing: "-1.2px" }}
        >
          Logoipsum
        </Link>

        {pendingEmail ? (
          <VerifyPanel
            email={pendingEmail}
            busy={busy}
            cooldown={cooldown}
            onResend={() => handleResend(pendingEmail)}
            onBack={() => {
              setVerifyEmail(null);
              setMode("login");
            }}
          />
        ) : (
          <>
            <h1
              className="mt-6 font-fustat font-bold text-white"
              style={{ fontSize: 30, letterSpacing: "-1.4px" }}
            >
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-1 font-inter text-white/60" style={{ fontSize: 14 }}>
              {mode === "login"
                ? "Log in to continue your journey through the data."
                : "Sign up to explore the immersive depth experience."}
            </p>

            <button
              onClick={handleGoogle}
              disabled={busy}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-white px-4 py-3 font-schibsted font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <GoogleIcon /> Continue with Google
            </button>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/15" />
              <span className="font-inter text-white/40" style={{ fontSize: 12 }}>
                or
              </span>
              <div className="h-px flex-1 bg-white/15" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === "signup" && (
                <input
                  type="text"
                  required
                  placeholder="Display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-inter text-white placeholder:text-white/40 focus:border-upgrade focus:outline-none"
                />
              )}
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-inter text-white placeholder:text-white/40 focus:border-upgrade focus:outline-none"
              />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-inter text-white placeholder:text-white/40 focus:border-upgrade focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-full bg-upgrade px-4 py-3 font-schibsted font-semibold text-darkbadge transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {busy ? "Please wait…" : mode === "login" ? "Log In" : "Sign Up"}
              </button>
            </form>

            <p className="mt-5 text-center font-inter text-white/60" style={{ fontSize: 14 }}>
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="font-medium text-upgrade hover:underline"
              >
                {mode === "login" ? "Sign up" : "Log in"}
              </button>
            </p>
          </>
        )}
      </div>
    </main>
  );
}

function VerifyPanel({
  email,
  busy,
  cooldown,
  onResend,
  onBack,
}: {
  email: string;
  busy: boolean;
  cooldown: number;
  onResend: () => void;
  onBack: () => void;
}) {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 font-inter font-medium text-amber-300"
          style={{ fontSize: 12 }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
          Email not verified
        </span>
      </div>

      <h1
        className="mt-4 font-fustat font-bold text-white"
        style={{ fontSize: 28, letterSpacing: "-1.2px" }}
      >
        Verify your email
      </h1>
      <p className="mt-2 font-inter text-white/60" style={{ fontSize: 14 }}>
        We sent a confirmation link to{" "}
        <span className="font-medium text-white">{email}</span>. Click the link in that email to
        activate your account.
      </p>

      <button
        onClick={onResend}
        disabled={busy || cooldown > 0}
        className="mt-6 w-full rounded-full bg-upgrade px-4 py-3 font-schibsted font-semibold text-darkbadge transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {cooldown > 0
          ? `Resend available in ${cooldown}s`
          : busy
            ? "Sending…"
            : "Resend verification email"}
      </button>

      <button
        onClick={onBack}
        className="mt-3 w-full rounded-full border border-white/15 px-4 py-3 font-schibsted font-medium text-white transition-colors hover:bg-white/5"
      >
        Back to log in
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
