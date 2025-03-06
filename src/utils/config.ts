
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
      // Return empty config if YAML loading fails
      return {
        galleries: {},
        featured: []
      };
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
    // Return empty config as fallback
    return {
      galleries: {},
      featured: []
    };
  }
}
