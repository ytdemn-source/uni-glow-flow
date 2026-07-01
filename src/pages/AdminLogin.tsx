import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, LogIn } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { signInWithGoogle, signInWithPassword, signUp, useAuth } from "@/lib/auth";

export default function AdminLoginPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = "Admin sign in — GS Hub";
  }, []);

  useEffect(() => {
    if (!loading && user) navigate("/admin", { replace: true });
  }, [user, loading, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        await signInWithPassword(email.trim(), password);
      } else {
        await signUp(email.trim(), password);
        toast({
          title: "Check your email",
          description: "Confirm your address to finish creating the account.",
        });
      }
    } catch (err) {
      toast({ title: "Sign-in failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      toast({ title: "Google sign-in failed", description: (err as Error).message, variant: "destructive" });
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-md">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="glass-card rounded-2xl p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-1">Admin sign in</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Restricted area. Only approved admins can access the dashboard.
          </p>

          <Button onClick={google} disabled={busy} variant="outline" className="w-full mb-4">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Continue with Google
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={busy} className="w-full gap-2">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-4 text-xs text-muted-foreground hover:text-foreground w-full text-center"
          >
            {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
          </button>
        </div>
      </main>
    </div>
  );
}
