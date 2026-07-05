import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signOut, useAuth } from "@/lib/auth";
import { NotesManager } from "@/components/admin/NotesManager";
import { CommentsManager } from "@/components/admin/CommentsManager";
import { NotificationsManager } from "@/components/admin/NotificationsManager";
import { AdminsManager } from "@/components/admin/AdminsManager";

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin dashboard — A Help Deck";
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/admin/login", { replace: true });
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-16 max-w-md">
          <div className="glass-card rounded-2xl p-6 text-center">
            <h1 className="text-xl font-bold mb-2">Not authorised</h1>
            <p className="text-sm text-muted-foreground mb-4">
              Your account ({user.email}) doesn't have admin access.
            </p>
            <Button variant="outline" onClick={async () => { await signOut(); navigate("/admin/login"); }}>
              Sign out
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-5xl">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div>
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="w-4 h-4" /> Back to site
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">Admin dashboard</h1>
            <p className="text-xs text-muted-foreground">Signed in as {user.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={async () => { await signOut(); navigate("/admin/login"); }}>
            <LogOut className="w-4 h-4" /> Sign out
          </Button>
        </div>

        <Tabs defaultValue="notes">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
          </TabsList>
          <TabsContent value="notes" className="mt-4"><NotesManager /></TabsContent>
          <TabsContent value="comments" className="mt-4"><CommentsManager /></TabsContent>
          <TabsContent value="notifications" className="mt-4"><NotificationsManager /></TabsContent>
          <TabsContent value="admins" className="mt-4"><AdminsManager /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
