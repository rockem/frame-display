
import EXIF from 'exif-js';

export interface ExifData {
  camera?: string;
  shutterSpeed?: string;
  aperture?: string;
  iso?: string;
  focalLength?: string;
  captureDate?: Date;
}

export async function getExifData(imageUrl: string): Promise<ExifData | null> {
  try {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // This may be needed for CORS issues
      
      img.onload = function() {
        try {
          EXIF.getData(img as any, function() {
            try {
              // Extract make and model for camera
              const make = EXIF.getTag(this, "Make");
              const model = EXIF.getTag(this, "Model");
              const camera = make && model ? `${make} ${model}` : undefined;
              
              // Extract shutter speed
              let shutterSpeed;
              const exposureTime = EXIF.getTag(this, "ExposureTime");
              if (exposureTime) {
                // Convert decimal to fraction if needed
                if (exposureTime < 1) {
                  shutterSpeed = `1/${Math.round(1/exposureTime)}`;
                } else {
                  shutterSpeed = `${exposureTime}`;
                }
              }
              
              // Extract aperture
              let aperture;
              const fNumber = EXIF.getTag(this, "FNumber");
              if (fNumber) {
                aperture = fNumber.toFixed(1);
              }
              
              // Extract ISO
              const iso = EXIF.getTag(this, "ISOSpeedRatings");
              
              // Extract focal length
              let focalLength;
              const focalLengthValue = EXIF.getTag(this, "FocalLength");
              if (focalLengthValue) {
                focalLength = Math.round(focalLengthValue).toString();
              }
              
              // Extract capture date
              let captureDate;
              const dateTimeOriginal = EXIF.getTag(this, "DateTimeOriginal");
              if (dateTimeOriginal) {
                // EXIF date format is typically "YYYY:MM:DD HH:MM:SS"
                const parts = dateTimeOriginal.split(' ');
                if (parts.length === 2) {
                  const datePart = parts[0].replace(/:/g, '-');
                  captureDate = new Date(`${datePart}T${parts[1]}`);
                }
              }
              
              resolve({
                camera,
                shutterSpeed,
                aperture,
                iso: iso ? iso.toString() : undefined,
                focalLength,
                captureDate
              });
            } catch (error) {
              console.error("Error parsing EXIF data:", error);
              resolve(null);
            }
          });
        } catch (error) {
          console.error("Error in EXIF.getData:", error);
          resolve(null);
        }
      };
      
      img.onerror = function() {
        console.error("Failed to load image for EXIF extraction:", imageUrl);
        resolve(null);
      };
      
      img.src = imageUrl;
    });
  } catch (error) {
    console.error("Error in getExifData:", error);
    return null;
  }
}

// Function to handle CORS errors by using fallback data
export async function getExifDataWithFallback(imageUrl: string, fallbackData?: ExifData): Promise<ExifData | null> {
  try {
    // For local or Unsplash images, we'll use fallback data since EXIF extraction often fails due to CORS
    if (imageUrl.includes('unsplash.com') || imageUrl.startsWith('/')) {
      console.log("Using fallback data for image:", imageUrl);
      return fallbackData || null;
    }
    
    const exifData = await getExifData(imageUrl);
    return exifData || fallbackData || null;
  } catch (error) {
    console.error("Error fetching EXIF data:", error);
    return fallbackData || null;
  }
}
