import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

// v7.0: Security - Maximum file size (10MB for images)
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
// v8.0: Maximum video file size (50MB)
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

// v7.0: Security - Allowed MIME types whitelist
const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
]);

// v8.0: Allowed video MIME types
const ALLOWED_VIDEO_MIME_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);

// v7.0: Security - Magic bytes signatures for image validation
const IMAGE_MAGIC_BYTES: Array<{ mime: string; bytes: number[] }> = [
  { mime: 'image/jpeg', bytes: [0xFF, 0xD8, 0xFF] },
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4E, 0x47] },
  { mime: 'image/gif', bytes: [0x47, 0x49, 0x46] },
  { mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF header
  { mime: 'image/bmp', bytes: [0x42, 0x4D] },
];

// v8.0: Video magic bytes
const VIDEO_MAGIC_BYTES: Array<{ mime: string; bytes: number[] }> = [
  { mime: 'video/mp4', bytes: [0x00, 0x00, 0x00] }, // ftyp box (offset varies)
  { mime: 'video/webm', bytes: [0x1A, 0x45, 0xDF, 0xA3] }, // EBML header
  { mime: 'video/quicktime', bytes: [0x00, 0x00, 0x00] }, // same as mp4
];

/**
 * v7.0: Validate MIME type against whitelist
 */
export function validateImageMimeType(mimeType: string): boolean {
  return ALLOWED_IMAGE_MIME_TYPES.has(mimeType.toLowerCase());
}

/**
 * v8.0: Validate video MIME type
 */
export function validateVideoMimeType(mimeType: string): boolean {
  return ALLOWED_VIDEO_MIME_TYPES.has(mimeType.toLowerCase());
}

/**
 * v7.0: Validate file buffer magic bytes match an image format
 */
export function validateMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 4) return false;

  return IMAGE_MAGIC_BYTES.some(({ bytes }) =>
    bytes.every((byte, index) => buffer[index] === byte)
  );
}

/**
 * v8.0: Validate video magic bytes (less strict due to container format variations)
 */
export function validateVideoMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 8) return false;
  // MP4/MOV: look for 'ftyp' at byte 4
  if (buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) return true;
  // WebM: EBML header
  if (buffer[0] === 0x1A && buffer[1] === 0x45 && buffer[2] === 0xDF && buffer[3] === 0xA3) return true;
  return false;
}

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
  // v7.0: Security - Validate file size
  if (buffer.length > MAX_IMAGE_SIZE) {
    throw new Error(`File too large: ${(buffer.length / 1024 / 1024).toFixed(1)}MB exceeds ${MAX_IMAGE_SIZE / 1024 / 1024}MB limit`);
  }

  // v7.0: Security - Validate MIME type whitelist
  if (!validateImageMimeType(mimeType)) {
    throw new Error(`Invalid file type: ${mimeType}. Only image files are allowed.`);
  }

  // v7.0: Security - Validate magic bytes
  if (!validateMagicBytes(buffer)) {
    throw new Error('File content does not match a valid image format. Upload rejected.');
  }

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
 * v8.0: Save a video file to local storage
 * @param buffer - Video file buffer
 * @param mimeType - MIME type of the video
 * @param prefix - Optional prefix for the filename
 * @returns Object containing the file key and URL
 */
export async function localStoragePutVideo(
  buffer: Buffer,
  mimeType: string,
  prefix: string = "videos"
): Promise<{ key: string; url: string }> {
  // Validate video file size (50MB limit)
  if (buffer.length > MAX_VIDEO_SIZE) {
    throw new Error(`Video too large: ${(buffer.length / 1024 / 1024).toFixed(1)}MB exceeds ${MAX_VIDEO_SIZE / 1024 / 1024}MB limit`);
  }

  // Validate video MIME type
  if (!validateVideoMimeType(mimeType)) {
    throw new Error(`Invalid video type: ${mimeType}. Only mp4, webm, and mov files are allowed.`);
  }

  // Validate video magic bytes
  if (!validateVideoMagicBytes(buffer)) {
    throw new Error('File content does not match a valid video format. Upload rejected.');
  }

  ensureUploadDir();
  const uploadDir = getUploadDirCached();
  const ext = getExtensionFromMimeType(mimeType);
  const filename = `${prefix}-${nanoid()}.${ext}`;
  const filePath = path.join(uploadDir, filename);

  await fs.promises.writeFile(filePath, buffer);

  const url = `${getPublicUrlPath()}/${filename}`;
  console.log(`[Storage] Video saved: ${filePath} -> ${url}`);

  return { key: filename, url };
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
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/quicktime': 'mov',
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
