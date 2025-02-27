
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Camera } from "lucide-react";
import Layout from "@/components/Layout";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { loadConfig } from "@/utils/config";
import type { Image as ConfigImage } from "@/utils/config";
import { getExifDataWithFallback, ExifData } from "@/utils/exifUtils";

interface ImageWithExif extends ConfigImage {
  extractedExif?: ExifData | null;
}

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [images, setImages] = useState<ImageWithExif[]>([]);

  useEffect(() => {
    loadConfig().then(async config => {
      // Add demo EXIF data to featured images for testing
      const processed = config.featured.map(image => {
        // Use existing EXIF data or create demo data
        const exifData = image.exif || {
          camera: "Canon EOS R5",
          shutterSpeed: "1/1000",
          aperture: "2.8", 
          iso: "100",
          focalLength: "70"
        };
        
        return { ...image, extractedExif: exifData };
      });
      
      setImages(processed);
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
          {images.map((image, index) => {
            const exif = image.extractedExif;
            
            return (
              <div 
                key={index} 
                className="break-inside-avoid mb-4 overflow-hidden rounded-lg cursor-pointer group relative"
                onClick={() => setSelectedImageIndex(index)}
              >
                <div className="image-container">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 text-sm">
                      <Camera className="h-4 w-4" />
                      <span>{exif?.camera || "Unknown Camera"}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                      {exif?.shutterSpeed && (
                        <div>Shutter: {exif.shutterSpeed}</div>
                      )}
                      {exif?.aperture && (
                        <div>ƒ/{exif.aperture}</div>
                      )}
                      {exif?.iso && (
                        <div>ISO {exif.iso}</div>
                      )}
                      {exif?.focalLength && (
                        <div>{exif.focalLength}mm</div>
                      )}
                      {exif?.captureDate && (
                        <div>{exif.captureDate.toLocaleDateString()}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
    </Layout>
  );
};

export default Index;
