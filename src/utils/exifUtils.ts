
import EXIF from 'exif-js';

export interface ExifData {
  camera?: string;
  shutterSpeed?: string;
  aperture?: string;
  iso?: string;
  focalLength?: string;
}

export async function getExifData(imageUrl: string): Promise<ExifData | null> {
  try {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // This may be needed for CORS issues
      
      img.onload = function() {
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
            
            resolve({
              camera,
              shutterSpeed,
              aperture,
              iso: iso ? iso.toString() : undefined,
              focalLength
            });
          } catch (error) {
            console.error("Error parsing EXIF data:", error);
            resolve(null);
          }
        });
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
    // For Unsplash images, we know we can't get EXIF data due to CORS, so use fallback
    if (imageUrl.includes('unsplash.com')) {
      console.log("Using fallback data for Unsplash image");
      return fallbackData || null;
    }
    
    const exifData = await getExifData(imageUrl);
    return exifData;
  } catch (error) {
    console.error("Error fetching EXIF data:", error);
    return fallbackData || null;
  }
}
