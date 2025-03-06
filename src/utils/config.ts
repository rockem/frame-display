
import { parse } from 'yaml';
import { getExifDataWithFallback } from './exifUtils';

export interface ExifData {
  camera?: string;
  shutterSpeed?: string;
  aperture?: string;
  iso?: string;
  focalLength?: string;
  captureDate?: Date;
}

export interface Image {
  url: string;
  alt: string;
  exif?: ExifData;
}

export interface Gallery {
  id: string;
  title: string;
  images: Image[];
}

export interface GalleryConfig {
  galleries: {
    [key: string]: Gallery;
  };
  featured: Image[];
}

export async function loadConfig(): Promise<GalleryConfig> {
  try {
    // Load config from YAML
    const response = await fetch('/config/galleries.yaml');
    let yamlGalleries: Gallery[] = [];
    let featuredImages: Image[] = [];
    
    if (response.ok) {
      const yamlText = await response.text();
      const parsedConfig = parse(yamlText) as { galleries: Gallery[], featured: Image[] };
      
      // Direct mapping from the YAML structure
      yamlGalleries = parsedConfig.galleries || [];
      featuredImages = parsedConfig.featured || [];
      
      console.log("Loaded galleries from YAML:", yamlGalleries.map(g => g.title));
    } else {
      console.error(`Failed to load config: ${response.status} ${response.statusText}`);
      // Use default values if YAML loading fails
      featuredImages = [
        { url: "/images/galleries/nature/_MG_8056.jpg", alt: "Forest landscape" },
        { url: "/images/galleries/nature/_MG_8078.jpg", alt: "Mountain sunset" },
        { url: "/images/galleries/street/L1001660.jpg", alt: "Urban street scene" },
        { url: "/images/galleries/travel/IMG_5897.jpg", alt: "Exotic destination" },
        { url: "/images/galleries/nature/untitled-1589.jpg", alt: "Peaceful lake" }
      ];
      
      // Default galleries if loading fails
      yamlGalleries = [
        {
          id: "1",
          title: "Nature",
          images: [
            { url: "/images/galleries/nature/_MG_8056.jpg", alt: "Nature image 1" },
            { url: "/images/galleries/nature/_MG_8078.jpg", alt: "Nature image 2" },
            { url: "/images/galleries/nature/_MG_8085.jpg", alt: "Nature image 3" },
            { url: "/images/galleries/nature/untitled-1589.jpg", alt: "Nature image 4" }
          ]
        },
        {
          id: "2",
          title: "Street",
          images: [
            { url: "/images/galleries/street/L1001660.jpg", alt: "Street photography" }
          ]
        },
        {
          id: "3",
          title: "Travel",
          images: [
            { url: "/images/galleries/travel/IMG_5897.jpg", alt: "Travel photo" }
          ]
        }
      ];
    }
    
    // Convert the galleries array to an object with gallery IDs as keys
    const galleries: { [key: string]: Gallery } = {};
    for (const gallery of yamlGalleries) {
      galleries[gallery.id] = gallery;
    }
    
    console.log("Final galleries config:", Object.keys(galleries));
    
    return {
      galleries,
      featured: featuredImages
    };
  } catch (error) {
    console.error("Error loading config:", error);
    // Return default config as fallback
    return {
      galleries: {},
      featured: [
        { url: "/images/galleries/nature/_MG_8056.jpg", alt: "Forest landscape" },
        { url: "/images/galleries/nature/_MG_8078.jpg", alt: "Mountain sunset" },
        { url: "/images/galleries/street/L1001660.jpg", alt: "Urban street scene" },
        { url: "/images/galleries/travel/IMG_5897.jpg", alt: "Exotic destination" },
        { url: "/images/galleries/nature/untitled-1589.jpg", alt: "Peaceful lake" }
      ]
    };
  }
}
