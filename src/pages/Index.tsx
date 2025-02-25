import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Github, Instagram, Linkedin, Facebook } from "lucide-react";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const galleries = [
    {
      id: 1,
      title: "Nature",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      description: "Landscapes and wildlife"
    },
    {
      id: 2,
      title: "Urban",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
      description: "City life and architecture"
    },
    {
      id: 3,
      title: "Abstract",
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9",
      description: "Experimental photography"
    },
    {
      id: 4,
      title: "Waterfall",
      image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
      description: "Water in motion"
    },
    {
      id: 5,
      title: "Mountains",
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb",
      description: "Majestic peaks and valleys"
    }
  ];

  return (
    <Layout>
      <section className="py-12" id="gallery">
        <div className="grid md:grid-cols-3 gap-8">
          {galleries.map((gallery) => (
            <Card 
              key={gallery.id} 
              className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/gallery/${gallery.id}`)}
            >
              <div className="image-container h-64">
                <img
                  src={gallery.image}
                  alt={gallery.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{gallery.title}</h3>
                <p className="text-muted-foreground text-sm">{gallery.description}</p>
              </div>
            </Card>
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
