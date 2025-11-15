import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, UserCircle, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Search className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-foreground">FindItBack</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/browse">
            <Button variant="ghost">Browse Items</Button>
          </Link>
          {user ? (
            <>
              <Link to="/report-lost">
                <Button variant="default">Report Lost</Button>
              </Link>
              <Link to="/report-found">
                <Button variant="secondary">Report Found</Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="default">
                <UserCircle className="h-5 w-5 mr-2" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
