
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Layout from "@/components/Layout";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Gallery = () => {
  const { id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const galleries = {
    "1": {
      title: "Nature",
      images: [
        "https://images.unsplash.com/photo-1472396961693-142e6e269027",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f"
      ]
    },
    "2": {
      title: "Urban",
      images: [
        "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
        "https://images.unsplash.com/photo-1444723121867-7a241cacace9",
        "https://images.unsplash.com/photo-1460472178825-e5240623afd5"
      ]
    },
    "3": {
      title: "Abstract",
      images: [
        "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9",
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab",
        "https://images.unsplash.com/photo-1507838153414-b4b713384a76",
        "https://images.unsplash.com/photo-1496737018672-b1a6be2e949c"
      ]
    },
    "4": {
      title: "Waterfall",
      images: [
        "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
        "https://images.unsplash.com/photo-1546182990-dffeafbe841d",
        "https://images.unsplash.com/photo-1504198322253-cfa87a0ff25f",
        "https://images.unsplash.com/photo-1498855926480-d98e83099315"
      ]
    },
    "5": {
      title: "Mountains",
      images: [
        "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
        "https://images.unsplash.com/photo-1456428199391-a3b1cb5e93ab",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba"
      ]
    }
  };

  const gallery = galleries[id as keyof typeof galleries];

  if (!gallery) {
    return <div>Gallery not found</div>;
  }

  const handlePrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        selectedImageIndex === 0 ? gallery.images.length - 1 : selectedImageIndex - 1
      );
    }
  };

  const handleNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        selectedImageIndex === gallery.images.length - 1 ? 0 : selectedImageIndex + 1
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

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">{gallery.title} Gallery</h1>
        <div className="grid md:grid-cols-2 gap-8">
          {gallery.images.map((image, index) => (
            <div 
              key={index} 
              className="aspect-[4/3] overflow-hidden rounded-lg cursor-pointer"
              onClick={() => setSelectedImageIndex(index)}
            >
              <img
                src={image}
                alt={`${gallery.title} ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>

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
                  src={gallery.images[selectedImageIndex]}
                  alt={`${gallery.title} ${selectedImageIndex + 1}`}
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
    </Layout>
  );
};

export default Gallery;
