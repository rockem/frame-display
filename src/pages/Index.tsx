
import { useState, useEffect } from "react";
import { Github, Instagram, Linkedin, Facebook } from "lucide-react";
import Layout from "@/components/Layout";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const images = [
    "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
    "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9",
    "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
    "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb"
  ];

  return (
    <Layout>
      <section className="py-12">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {images.map((image, index) => (
            <div 
              key={index} 
              className="break-inside-avoid mb-8 overflow-hidden rounded-lg"
            >
              <div className="image-container">
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-6 border-t">
        <div className="flex justify-center gap-6">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Instagram className="h-6 w-6" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Facebook className="h-6 w-6" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Linkedin className="h-6 w-6" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Github className="h-6 w-6" />
          </a>
        </div>
      </footer>
    </Layout>
  );
};

export default Index;
