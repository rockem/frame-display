
import { parse } from 'yaml';

export interface Image {
  url: string;
  alt: string;
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
  const response = await fetch('/src/config/galleries.yaml');
  const yamlText = await response.text();
  return parse(yamlText) as GalleryConfig;
}
