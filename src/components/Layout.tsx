
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  
  const categories = [
    { id: 1, title: "Nature" },
    { id: 2, title: "Urban" },
    { id: 3, title: "Abstract" },
    { id: 4, title: "Waterfall" },
    { id: 5, title: "Mountains" }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <h1 className="text-4xl font-bold tracking-tight">Eli Segal Photography</h1>
              <br/>
            </Link>
          </div>
          <div className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => navigate(`/gallery/${category.id}`)}
                    className="text-sm font-medium hover:text-primary whitespace-nowrap"
                  >
                    {category.title}
                  </button>
                ))}
              </div>
              <Link 
                to="/about"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary whitespace-nowrap ml-6"
              >
                <User className="h-4 w-4" />
                About
              </Link>
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
};

export default Layout;
