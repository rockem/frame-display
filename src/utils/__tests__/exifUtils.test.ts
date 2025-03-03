
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
  let mockImage: HTMLImageElement;
  
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
    
    // Create a mock image element
    mockImage = new Image();
    
    // Mock global Image constructor
    global.Image = vi.fn().mockImplementation(() => {
      return mockImage;
    }) as unknown as typeof Image;
    
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
      
      // Trigger image onload handler
      setTimeout(() => {
        mockImage.onload && mockImage.onload();
      }, 0);
      
      const result = await getExifData('test.jpg');
      
      expect(result).toBeTruthy();
      expect(result?.camera).toBe('Canon EOS 5D');
    });
    
    it('should format shutter speed as a fraction when less than 1', async () => {
      // Set up EXIF.getTag mocks for the specific test case
      (EXIF.getTag as any)
        .mockImplementationOnce(() => undefined) // Make
        .mockImplementationOnce(() => undefined) // Model
        .mockImplementationOnce(() => 0.004); // ExposureTime (1/250)
      
      // Trigger image onload handler
      setTimeout(() => {
        mockImage.onload && mockImage.onload();
      }, 0);
      
      const result = await getExifData('test.jpg');
      
      expect(result).toBeTruthy();
      expect(result?.shutterSpeed).toBe('1/250');
    });
    
    it('should handle missing EXIF data gracefully', async () => {
      // Mock all relevant EXIF.getTag calls to return undefined
      (EXIF.getTag as any).mockReturnValue(undefined);
      
      // Trigger image onload handler
      setTimeout(() => {
        mockImage.onload && mockImage.onload();
      }, 0);
      
      const result = await getExifData('test.jpg');
      
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
      // Trigger image onerror handler
      setTimeout(() => {
        mockImage.onerror && mockImage.onerror();
      }, 0);
      
      const result = await getExifData('test.jpg');
      
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
      
      const result = await getExifDataWithFallback('https://images.unsplash.com/photo-12345', fallbackData);
      
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
      
      // Trigger image onload handler
      setTimeout(() => {
        mockImage.onload && mockImage.onload();
      }, 0);
      
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
