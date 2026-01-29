import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

/**
 * v5.1: Dynamic upload directory with environment variable support
 * 
 * UPLOAD_DIR environment variable allows configuring persistent storage
 * for Docker/Easypanel deployments where /public/uploads gets reset on rebuild.
 * 
 * Usage:
 * - Development: Uses default ./public/uploads (relative to project root)
 * - Production: Set UPLOAD_DIR=/data/uploads (or any persistent volume path)
 */

// Get upload directory from environment or use default
function getUploadDir(): string {
  const envUploadDir = process.env.UPLOAD_DIR;
  
  if (envUploadDir) {
    // Use absolute path from environment variable
    console.log(`[Storage] Using UPLOAD_DIR from environment: ${envUploadDir}`);
    return path.resolve(envUploadDir);
  }
  
  // Default: relative to project root (development mode)
  return path.resolve(process.cwd(), "public", "uploads");
}

// Cache the upload directory path
let UPLOAD_DIR: string | null = null;

function getUploadDirCached(): string {
  if (!UPLOAD_DIR) {
    UPLOAD_DIR = getUploadDir();
  }
  return UPLOAD_DIR;
}

/**
 * Get the public URL path for uploaded files
 * When using external UPLOAD_DIR, files are served from /uploads/
 */
function getPublicUrlPath(): string {
  return "/uploads";
}

/**
 * Ensure the uploads directory exists
 * Called on server startup
 */
export function ensureUploadDir(): void {
  const uploadDir = getUploadDirCached();
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`[Storage] Created upload directory: ${uploadDir}`);
  } else {
    console.log(`[Storage] Upload directory exists: ${uploadDir}`);
  }
}

/**
 * Get the absolute path to the uploads directory
 * Useful for configuring static file serving
 */
export function getUploadDirPath(): string {
  return getUploadDirCached();
}

/**
 * Save a file to local storage
 * @param buffer - File buffer
 * @param mimeType - MIME type of the file
 * @param prefix - Optional prefix for the filename (e.g., "products")
 * @returns Object containing the file key and URL
 */
export async function localStoragePut(
  buffer: Buffer,
  mimeType: string,
  prefix: string = "uploads"
): Promise<{ key: string; url: string }> {
  // Ensure upload directory exists
  ensureUploadDir();

  const uploadDir = getUploadDirCached();

  // Get file extension from mime type
  const ext = getExtensionFromMimeType(mimeType);
  
  // Generate unique filename
  const filename = `${prefix}-${nanoid()}.${ext}`;
  const filePath = path.join(uploadDir, filename);
  
  // Write file to disk
  await fs.promises.writeFile(filePath, buffer);
  
  // Return relative URL (served from /uploads/)
  const url = `${getPublicUrlPath()}/${filename}`;
  
  console.log(`[Storage] File saved: ${filePath} -> ${url}`);
  
  return {
    key: filename,
    url,
  };
}

/**
 * Delete a file from local storage
 * @param key - File key (filename)
 * @returns true if deleted, false if not found
 */
export async function localStorageDelete(key: string): Promise<boolean> {
  const uploadDir = getUploadDirCached();
  const filePath = path.join(uploadDir, key);
  
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      console.log(`[Storage] File deleted: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`[Storage] Failed to delete file: ${filePath}`, error);
    return false;
  }
}

/**
 * Check if a file exists in local storage
 * @param key - File key (filename)
 * @returns true if exists
 */
export function localStorageExists(key: string): boolean {
  const uploadDir = getUploadDirCached();
  const filePath = path.join(uploadDir, key);
  return fs.existsSync(filePath);
}

/**
 * Get file extension from MIME type
 * @param mimeType - MIME type string
 * @returns File extension without dot
 */
function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/bmp': 'bmp',
    'image/tiff': 'tiff',
  };
  
  return mimeToExt[mimeType] || mimeType.split("/")[1] || "jpg";
}

/**
 * Copy a file within local storage
 * @param sourceKey - Source file key
 * @param destPrefix - Destination prefix
 * @returns New file key and URL, or null if source doesn't exist
 */
export async function localStorageCopy(
  sourceKey: string,
  destPrefix: string = "copy"
): Promise<{ key: string; url: string } | null> {
  const uploadDir = getUploadDirCached();
  const sourcePath = path.join(uploadDir, sourceKey);
  
  if (!fs.existsSync(sourcePath)) {
    console.warn(`[Storage] Source file not found: ${sourcePath}`);
    return null;
  }
  
  // Get extension from source file
  const ext = path.extname(sourceKey).slice(1) || 'jpg';
  
  // Generate new filename
  const newFilename = `${destPrefix}-${nanoid()}.${ext}`;
  const destPath = path.join(uploadDir, newFilename);
  
  // Copy file
  await fs.promises.copyFile(sourcePath, destPath);
  
  const url = `${getPublicUrlPath()}/${newFilename}`;
  
  console.log(`[Storage] File copied: ${sourcePath} -> ${destPath}`);
  
  return {
    key: newFilename,
    url,
  };
}
