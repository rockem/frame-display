
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">John Doe Photography</h1>
            <p className="text-xl text-muted-foreground">Capturing moments, preserving memories</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/about" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                About Me
              </Link>
            </Button>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
};

export default Layout;
