
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getExifData, getExifDataWithFallback, ExifData } from '../exifUtils';
import EXIF from 'exif-js';

// Mock EXIF library
vi.mock('exif-js', () => {
  return {
    default: {
      getData: vi.fn(),
      getTag: vi.fn()
    }
  };
});

describe('exifUtils', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
    
    // Set up EXIF.getData to call the callback immediately
    (EXIF.getData as any).mockImplementation((img: any, callback: Function) => {
      callback.call(img);
    });
  });
  
  describe('getExifData', () => {
    it('should extract camera information correctly', async () => {
      // Set up EXIF.getTag mock for camera
      (EXIF.getTag as any)
        .mockImplementationOnce(() => 'Canon') // Make
        .mockImplementationOnce(() => 'EOS 5D'); // Model
      
      const result = await getExifData('https://images.unsplash.com/photo-1461749280684-dccba630e2f6');
      
      expect(result).toBeTruthy();
      expect(result?.camera).toBe('Canon EOS 5D');
    });
    
    it('should format shutter speed as a fraction when less than 1', async () => {
      // Set up EXIF.getTag mocks for the specific test case
      (EXIF.getTag as any)
        .mockImplementationOnce(() => undefined) // Make
        .mockImplementationOnce(() => undefined) // Model
        .mockImplementationOnce(() => 0.004); // ExposureTime (1/250)
      
      const result = await getExifData('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b');
      
      expect(result).toBeTruthy();
      expect(result?.shutterSpeed).toBe('1/250');
    });
    
    it('should handle missing EXIF data gracefully', async () => {
      // Mock all relevant EXIF.getTag calls to return undefined
      (EXIF.getTag as any).mockReturnValue(undefined);
      
      const result = await getExifData('https://images.unsplash.com/photo-1518770660439-4636190af475');
      
      expect(result).toBeTruthy();
      // Expect all EXIF fields to be undefined
      expect(result?.camera).toBeUndefined();
      expect(result?.shutterSpeed).toBeUndefined();
      expect(result?.aperture).toBeUndefined();
      expect(result?.iso).toBeUndefined();
      expect(result?.focalLength).toBeUndefined();
      expect(result?.captureDate).toBeUndefined();
    });
    
    it('should return null when image loading fails', async () => {
      // Override getData to simulate a failure
      (EXIF.getData as any).mockImplementation((img: any, callback: Function) => {
        // Don't call callback - simulate failure
      });
      
      // Make the image trigger onerror instead of onload
      vi.spyOn(global.Image.prototype, 'onload', 'set').mockImplementation(function(this: HTMLImageElement, fn: any) {
        // Instead of setting onload, we store the function and call onerror
        setTimeout(() => {
          this.onerror && this.onerror(new Event('error'));
        }, 0);
      });
      
      const result = await getExifData('invalid-image-url');
      
      expect(result).toBeNull();
    });
  });
  
  describe('getExifDataWithFallback', () => {
    it('should use fallback data for Unsplash images', async () => {
      const fallbackData: ExifData = {
        camera: 'Test Camera',
        shutterSpeed: '1/100',
        aperture: '2.8',
        iso: '400',
        focalLength: '50'
      };
      
      const result = await getExifDataWithFallback('https://images.unsplash.com/photo-1649972904349-6e44c42644a7', fallbackData);
      
      expect(result).toBe(fallbackData);
    });
    
    it('should use fallback data for local images', async () => {
      const fallbackData: ExifData = {
        camera: 'Test Camera',
        shutterSpeed: '1/100',
        aperture: '2.8',
        iso: '400',
        focalLength: '50'
      };
      
      const result = await getExifDataWithFallback('/images/local-image.jpg', fallbackData);
      
      expect(result).toBe(fallbackData);
    });
    
    it('should try to extract EXIF data for non-Unsplash remote images', async () => {
      // Mock successful EXIF extraction
      (EXIF.getTag as any)
        .mockImplementationOnce(() => 'Sony') // Make
        .mockImplementationOnce(() => 'A7'); // Model
      
      const fallbackData: ExifData = {
        camera: 'Fallback Camera',
        shutterSpeed: '1/100',
        aperture: '2.8',
        iso: '400',
        focalLength: '50'
      };
      
      const result = await getExifDataWithFallback('https://example.com/photo.jpg', fallbackData);
      
      expect(result).toBeTruthy();
      expect(result?.camera).toBe('Sony A7');
    });
    
    it('should use fallback data when EXIF extraction fails', async () => {
      // Setup EXIF.getData to throw an error
      (EXIF.getData as any).mockImplementation(() => {
        throw new Error('EXIF extraction failed');
      });
      
      const fallbackData: ExifData = {
        camera: 'Fallback Camera',
        shutterSpeed: '1/100',
        aperture: '2.8',
        iso: '400',
        focalLength: '50'
      };
      
      const result = await getExifDataWithFallback('https://example.com/photo.jpg', fallbackData);
      
      expect(result).toBe(fallbackData);
    });
  });
});
