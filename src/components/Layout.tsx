
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <h1 className="text-4xl font-bold tracking-tight">John Doe Photography</h1>
              <p className="text-xl text-muted-foreground">Capturing moments, preserving memories</p>
            </Link>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
};

export default Layout;
