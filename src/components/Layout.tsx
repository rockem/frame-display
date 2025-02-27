import {Link, useNavigate, useParams} from "react-router-dom";
import {User} from "lucide-react";
import React, {useState, useEffect} from "react";
import {loadConfig} from "@/utils/config";
import type {Gallery} from "@/utils/config";

const SocialImageLink = ({ imageName, url }: { imageName: string, url: string }) => {
  return (
    <a href={url}
       className="text-muted-foreground hover:text-foreground transition-colors">
      <img src={`/images/${imageName}.svg`} alt="Instagram"
           className="h-6 w-6 opacity-60 hover:opacity-100 transition-opacity"/>
    </a>
  );
}

const Layout = ({children}: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const params = useParams();
  const currentGalleryId = params.id;
  const [categories, setCategories] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConfig().then(config => {
      const loadedCategories = Object.values(config.galleries);
      setCategories(loadedCategories);
      setIsLoading(false);
    });
  }, []);

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
                {isLoading ? (
                  <div className="text-sm">Loading...</div>
                ) : (
                  categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => navigate(`/gallery/${category.id}`)}
                      className={`text-sm font-medium whitespace-nowrap transition-colors ${
                        currentGalleryId === category.id
                          ? "text-primary"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      {category.title}
                    </button>
                  ))
                )}
              </div>
              <Link
                to="/about"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary whitespace-nowrap ml-6"
              >
                <User className="h-4 w-4"/>
                About
              </Link>
            </div>
          </div>
        </header>
        {children}
        <footer className="py-6 border-t mt-8">
          <div className="flex justify-center gap-6">
            <SocialImageLink imageName="instagram" url=""/>
            <SocialImageLink imageName="facebook" url="https://www.facebook.com/lesegal"/>
            <SocialImageLink imageName="threads" url="https://www.threads.net/@lesegal"/>
            <SocialImageLink imageName="github" url="https://github.com/rockem"/>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
