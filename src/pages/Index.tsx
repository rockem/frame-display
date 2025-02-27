
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Layout from "@/components/Layout";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { loadConfig } from "@/utils/config";
import type { Image } from "@/utils/config";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    loadConfig().then(config => {
      setImages(config.featured);
      setIsLoaded(true);
    });
  }, []);

  const handlePrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1
      );
    }
  };

  const handleNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1
      );
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "Escape") setSelectedImageIndex(null);
  };

  useEffect(() => {
    if (selectedImageIndex !== null) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedImageIndex]);

  if (!isLoaded) {
    return <Layout>Loading...</Layout>;
  }

  return (
    <Layout>
      <section className="py-8">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {images.map((image, index) => (
            <div 
              key={index} 
              className="break-inside-avoid mb-4 overflow-hidden rounded-lg cursor-pointer"
              onClick={() => setSelectedImageIndex(index)}
            >
              <div className="image-container">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <Dialog 
        open={selectedImageIndex !== null} 
        onOpenChange={() => setSelectedImageIndex(null)}
      >
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-transparent border-none">
          <button
            onClick={() => setSelectedImageIndex(null)}
            className="absolute right-4 top-4 z-50 rounded-full bg-background/80 p-2 hover:bg-background/90"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="relative h-full w-full flex items-center justify-center">
            {selectedImageIndex !== null && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 z-50 rounded-full bg-background/80 p-2 hover:bg-background/90"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                
                <img
                  src={images[selectedImageIndex].url}
                  alt={images[selectedImageIndex].alt}
                  className="max-w-full max-h-[95vh] w-auto h-auto object-contain"
                />
                
                <button
                  onClick={handleNext}
                  className="absolute right-4 z-50 rounded-full bg-background/80 p-2 hover:bg-background/90"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <footer className="py-6 border-t">
        <div className="flex justify-center gap-6">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <img src="images/instagram.svg" alt="GitHub" className="h-6 w-6 gray" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <img src="images/facebook.svg" alt="GitHub" className="h-6 w-6 gray" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <img src="images/threads.svg" alt="GitHub" className="h-6 w-6 gray" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <img src="images/github.svg" alt="GitHub" className="h-6 w-6 gray" />
          </a>
        </div>
      </footer>
    </Layout>
  );
};

export default Index;
