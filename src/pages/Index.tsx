
import { useState, useEffect } from "react";
import { Camera, User, Mail, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

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
    <div className={`min-h-screen p-6 ${isLoaded ? 'fade-in' : 'opacity-0'}`}>
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Main Gallery Section */}
        <section className="py-12" id="gallery">
          <h1 className="text-4xl font-bold tracking-tight mb-2">John Doe Photography</h1>
          <p className="text-xl text-muted-foreground mb-12">Capturing moments, preserving memories</p>
          <div className="grid md:grid-cols-3 gap-8">
            {galleries.map((gallery) => (
              <Card key={gallery.id} className="overflow-hidden group">
                <div className="image-container h-64">
                  <img
                    src={gallery.image}
                    alt={gallery.title}
                    className="w-full h-full object-cover"
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

        {/* About Tab */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="about" className="w-full">About Me</TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="mt-6">
            <Card>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">About Me</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      I'm a passionate photographer based in New York, specializing in landscape and urban photography. 
                      With over 5 years of experience, I strive to capture the beauty in both natural and man-made environments.
                    </p>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <MapPin className="h-5 w-5" />
                      <span>New York, USA</span>
                    </div>
                  </div>
                  <div className="image-container rounded-lg overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
                      alt="Profile"
                      className="w-full h-[400px] object-cover"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
