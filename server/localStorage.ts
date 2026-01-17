import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

// Upload directory path - relative to project root
const UPLOAD_DIR = path.resolve(process.cwd(), "public", "uploads");

/**
 * Ensure the uploads directory exists
 * Called on server startup
 */
export function ensureUploadDir(): void {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    console.log(`[Storage] Created upload directory: ${UPLOAD_DIR}`);
  }
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

  // Get file extension from mime type
  const ext = mimeType.split("/")[1] || "jpg";
  
  // Generate unique filename
  const filename = `${prefix}-${nanoid()}.${ext}`;
  const filePath = path.join(UPLOAD_DIR, filename);
  
  // Write file to disk
  await fs.promises.writeFile(filePath, buffer);
  
  // Return relative URL (served from /uploads/)
  const url = `/uploads/${filename}`;
  
  console.log(`[Storage] File saved: ${filePath}`);
  
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
  const filePath = path.join(UPLOAD_DIR, key);
  
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
  const filePath = path.join(UPLOAD_DIR, key);
  return fs.existsSync(filePath);
}
