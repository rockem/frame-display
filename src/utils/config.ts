
import { parse } from 'yaml';

export interface ExifData {
  camera?: string;
  shutterSpeed?: string;
  aperture?: string;
  iso?: string;
  focalLength?: string;
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
    const response = await fetch('/config/galleries.yaml');
    if (!response.ok) {
      console.error(`Failed to load config: ${response.status} ${response.statusText}`);
      // Return default config if file can't be loaded
      return {
        galleries: {},
        featured: [
          { url: "https://images.unsplash.com/photo-1472396961693-142e6e269027", alt: "Two brown deer beside trees and mountain" },
          { url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07", alt: "Orange flowers in city" },
          { url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9", alt: "Abstract pine trees" },
          { url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716", alt: "Majestic waterfall" },
          { url: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb", alt: "River between mountains" }
        ]
      };
    }
    const yamlText = await response.text();
    return parse(yamlText) as GalleryConfig;
  } catch (error) {
    console.error("Error loading config:", error);
    // Return default config as fallback
    return {
      galleries: {},
      featured: [
        { url: "https://images.unsplash.com/photo-1472396961693-142e6e269027", alt: "Two brown deer beside trees and mountain" },
        { url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07", alt: "Orange flowers in city" },
        { url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9", alt: "Abstract pine trees" },
        { url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716", alt: "Majestic waterfall" },
        { url: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb", alt: "River between mountains" }
      ]
    };
  }
}
