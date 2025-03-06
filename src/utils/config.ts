
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

// Helper function to get the correct base path for assets
function getBasePath(): string {
  // Check if we're running on GitHub Pages
  const isGitHubPages = window.location.hostname.includes('github.io');
  // Get the repository name from the pathname if on GitHub Pages
  const repoName = isGitHubPages ? window.location.pathname.split('/')[1] : '';
  
  return isGitHubPages && repoName ? `/${repoName}` : '';
}

export async function loadConfig(): Promise<GalleryConfig> {
  try {
    const basePath = getBasePath();
    // Load config from YAML with the correct base path
    const response = await fetch(`${basePath}/config/galleries.yaml`);
    let yamlGalleries: Gallery[] = [];
    let featuredImages: Image[] = [];
    
    if (response.ok) {
      const yamlText = await response.text();
      const parsedConfig = parse(yamlText) as { galleries: Gallery[], featured: Image[] };
      
      // Direct mapping from the YAML structure
      yamlGalleries = parsedConfig.galleries || [];
      featuredImages = parsedConfig.featured || [];
      
      console.log("Loaded galleries from YAML:", yamlGalleries.map(g => g.title));
      
      // Add base path to all image URLs
      if (basePath) {
        // Process gallery images
        yamlGalleries.forEach(gallery => {
          gallery.images.forEach(image => {
            if (!image.url.startsWith('http')) {
              image.url = `${basePath}${image.url}`;
            }
          });
        });
        
        // Process featured images
        featuredImages.forEach(image => {
          if (!image.url.startsWith('http')) {
            image.url = `${basePath}${image.url}`;
          }
        });
      }
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
