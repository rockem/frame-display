
import { parse } from 'yaml';

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

// Helper to capitalize the first letter of each word
function capitalizeTitle(text: string): string {
  return text
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Function to get all gallery folders
async function getGalleryFolders(): Promise<string[]> {
  try {
    const response = await fetch('/images/galleries/');
    if (!response.ok) {
      console.error(`Failed to load gallery folders: ${response.status} ${response.statusText}`);
      return [];
    }
    
    // This is a simplified approach - in real environments, you'd need a server-side solution
    // to list directories. This implementation assumes a direct fetch will return directory listings.
    const html = await response.text();
    
    // Extract folder names from the HTML response
    // This is a basic implementation and might need adjustment based on the actual server response
    const folderRegex = /href="([^"]+)\/"/g;
    const matches = html.matchAll(folderRegex);
    const folders = [];
    
    for (const match of matches) {
      if (match[1] && !match[1].includes('.') && !match[1].startsWith('..')) {
        folders.push(match[1]);
      }
    }
    
    return folders;
  } catch (error) {
    console.error("Error loading gallery folders:", error);
    return [];
  }
}

// Function to load images from a gallery folder
async function loadImagesFromFolder(folderName: string): Promise<Image[]> {
  try {
    const response = await fetch(`/images/galleries/${folderName}/`);
    if (!response.ok) {
      console.error(`Failed to load images from folder ${folderName}: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const html = await response.text();
    
    // Extract image filenames from the HTML response
    const imageRegex = /href="([^"]+\.(jpg|jpeg|png|gif|webp))"/gi;
    const matches = html.matchAll(imageRegex);
    const images: Image[] = [];
    
    for (const match of matches) {
      if (match[1]) {
        const filename = match[1];
        images.push({
          url: `/images/galleries/${folderName}/${filename}`,
          alt: filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').replace(/_/g, ' '),
        });
      }
    }
    
    return images;
  } catch (error) {
    console.error(`Error loading images from folder ${folderName}:`, error);
    return [];
  }
}

export async function loadConfig(): Promise<GalleryConfig> {
  try {
    // Load featured images from YAML config
    const response = await fetch('/config/galleries.yaml');
    let featuredImages: Image[] = [];
    
    if (response.ok) {
      const yamlText = await response.text();
      const parsedConfig = parse(yamlText) as GalleryConfig;
      featuredImages = parsedConfig.featured || [];
    } else {
      console.error(`Failed to load config: ${response.status} ${response.statusText}`);
      // Use default featured images if YAML loading fails
      featuredImages = [
        { url: "https://images.unsplash.com/photo-1472396961693-142e6e269027", alt: "Two brown deer beside trees and mountain" },
        { url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07", alt: "Orange flowers in city" },
        { url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9", alt: "Abstract pine trees" },
        { url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716", alt: "Majestic waterfall" },
        { url: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb", alt: "River between mountains" }
      ];
    }
    
    // Automatically load galleries from folders
    const folderNames = await getGalleryFolders();
    const galleries: { [key: string]: Gallery } = {};
    
    for (let i = 0; i < folderNames.length; i++) {
      const folderName = folderNames[i];
      const images = await loadImagesFromFolder(folderName);
      
      if (images.length > 0) {
        galleries[folderName] = {
          id: (i + 1).toString(), // Use index + 1 as ID
          title: capitalizeTitle(folderName),
          images: images
        };
      }
    }
    
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
        { url: "https://images.unsplash.com/photo-1472396961693-142e6e269027", alt: "Two brown deer beside trees and mountain" },
        { url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07", alt: "Orange flowers in city" },
        { url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9", alt: "Abstract pine trees" },
        { url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716", alt: "Majestic waterfall" },
        { url: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb", alt: "River between mountains" }
      ]
    };
  }
}
