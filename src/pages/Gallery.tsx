
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, X, Camera } from "lucide-react";
import Layout from "@/components/Layout";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { loadConfig } from "@/utils/config";
import type { Gallery as GalleryType } from "@/utils/config";

const Gallery = () => {
  const { id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [gallery, setGallery] = useState<GalleryType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConfig().then(config => {
      const foundGallery = Object.values(config.galleries).find(g => g.id === id);
      setGallery(foundGallery || null);
      setIsLoading(false);
    });
  }, [id]);

  const handlePrevious = () => {
    if (selectedImageIndex !== null && gallery) {
      setSelectedImageIndex(
        selectedImageIndex === 0 ? gallery.images.length - 1 : selectedImageIndex - 1
      );
    }
  };

  const handleNext = () => {
    if (selectedImageIndex !== null && gallery) {
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

  if (isLoading) {
    return <Layout>Loading...</Layout>;
  }

  if (!gallery) {
    return <Layout>Gallery not found</Layout>;
  }

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">{gallery.title} Gallery</h1>
        <div className="grid md:grid-cols-2 gap-8">
          {gallery.images.map((image, index) => (
            <div 
              key={index} 
              className="group relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer"
              onClick={() => setSelectedImageIndex(index)}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {image.exif && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-2 text-sm">
                    <Camera className="h-4 w-4" />
                    <span>{image.exif.camera}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                    {image.exif.shutterSpeed && (
                      <div>Shutter: {image.exif.shutterSpeed}</div>
                    )}
                    {image.exif.aperture && (
                      <div>ƒ/{image.exif.aperture}</div>
                    )}
                    {image.exif.iso && (
                      <div>ISO {image.exif.iso}</div>
                    )}
                    {image.exif.focalLength && (
                      <div>{image.exif.focalLength}mm</div>
                    )}
                  </div>
                </div>
              )}
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
            {selectedImageIndex !== null && gallery && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 z-50 rounded-full bg-background/80 p-2 hover:bg-background/90"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                
                <div className="relative">
                  <img
                    src={gallery.images[selectedImageIndex].url}
                    alt={gallery.images[selectedImageIndex].alt}
                    className="max-w-full max-h-[95vh] w-auto h-auto object-contain"
                  />
                </div>
                
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
