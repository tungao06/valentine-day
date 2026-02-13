/**
 * Utility functions for Vercel Blob Storage
 * 
 * This file provides helper functions to get media URLs from Vercel Blob Storage
 * while maintaining the same folder structure as the public/images/ folder
 * 
 * Structure: images/story1/, images/story2/, etc.
 */

/**
 * Get the Vercel Blob URL for a media file
 * 
 * @param path - The relative path from public folder (e.g., "/images/story1/image1.jpg")
 * @returns The full URL to the media file in Vercel Blob Storage
 * 
 * In development/local: returns the path as-is (served from public folder)
 * In production: returns the Vercel Blob URL if NEXT_PUBLIC_BLOB_STORE_URL is set
 */
export function getBlobUrl(path: string): string {
  // Remove leading slash if present for blob storage path
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Check if we have a BLOB_STORE_URL environment variable
  // Use process.env for server-side, window for client-side
  const blobStoreUrl = typeof window !== 'undefined' 
    ? (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_BLOB_STORE_URL || process.env.NEXT_PUBLIC_BLOB_STORE_URL
    : process.env.NEXT_PUBLIC_BLOB_STORE_URL;
  
  if (blobStoreUrl) {
    // Use Vercel Blob URL
    // Ensure the blob store URL ends with a slash
    const baseUrl = blobStoreUrl.endsWith('/') ? blobStoreUrl : `${blobStoreUrl}/`;
    return `${baseUrl}${cleanPath}`;
  }
  
  // Fallback to public folder (for local development)
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Get multiple blob URLs from an array of paths
 * 
 * @param paths - Array of relative paths
 * @returns Array of full URLs
 */
export function getBlobUrls(paths: string[]): string[] {
  return paths.map(path => getBlobUrl(path));
}

/**
 * Check if we should use Vercel Blob Storage
 * 
 * @returns true if BLOB_STORE_URL is configured
 */
export function shouldUseBlob(): boolean {
  return !!process.env.NEXT_PUBLIC_BLOB_STORE_URL;
}

