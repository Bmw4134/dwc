import JSZip from 'jszip';
import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';
import archiver from 'archiver';
import sizeOf from 'image-size';
import sharp from 'sharp';
import { promisify } from 'util';

interface PhotoFile {
  name: string;
  size: number;
  type: string;
  isCorrupted: boolean;
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
    lastModified?: Date;
  };
  thumbnailPath?: string;
  recoveryStatus: 'intact' | 'recovered' | 'corrupted' | 'failed';
  originalPath?: string;
}

interface RecoverySession {
  id: string;
  filename: string;
  totalFiles: number;
  photosFound: number;
  recoveredPhotos: number;
  corruptedFiles: number;
  status: 'processing' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  extractedFiles: PhotoFile[];
  recoveryLog: string[];
}

export class PhotoRecoveryEngine {
  private sessionsDir: string;
  private extractionDir: string;
  private thumbnailsDir: string;
  private sessions: Map<string, RecoverySession> = new Map();

  constructor() {
    this.sessionsDir = path.join(process.cwd(), 'recovery_sessions');
    this.extractionDir = path.join(process.cwd(), 'extracted_photos');
    this.thumbnailsDir = path.join(process.cwd(), 'thumbnails');
    this.initializeDirectories();
  }

  private async initializeDirectories(): Promise<void> {
    try {
      await fs.mkdir(this.sessionsDir, { recursive: true });
      await fs.mkdir(this.extractionDir, { recursive: true });
      await fs.mkdir(this.thumbnailsDir, { recursive: true });
    } catch (error) {
      console.error('Failed to initialize recovery directories:', error);
    }
  }

  async startRecoverySession(filename: string, buffer: Buffer): Promise<string> {
    const sessionId = `recovery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sessionDir = path.join(this.extractionDir, sessionId);
    
    await fs.mkdir(sessionDir, { recursive: true });

    const session: RecoverySession = {
      id: sessionId,
      filename,
      totalFiles: 0,
      photosFound: 0,
      recoveredPhotos: 0,
      corruptedFiles: 0,
      status: 'processing',
      startTime: new Date(),
      extractedFiles: [],
      recoveryLog: [`Started recovery session for ${filename}`]
    };

    this.sessions.set(sessionId, session);

    // Start extraction process
    this.extractPhotosFromArchive(sessionId, buffer, sessionDir)
      .catch(error => {
        session.status = 'failed';
        session.recoveryLog.push(`Recovery failed: ${error.message}`);
        session.endTime = new Date();
      });

    return sessionId;
  }

  private async extractPhotosFromArchive(sessionId: string, buffer: Buffer, sessionDir: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    try {
      const zip = await JSZip.loadAsync(buffer);
      const files = Object.keys(zip.files);
      session.totalFiles = files.length;
      session.recoveryLog.push(`Found ${files.length} files in archive`);

      for (const [relativePath, file] of Object.entries(zip.files)) {
        if (file.dir) continue;

        try {
          const isImage = this.isImageFile(relativePath);
          if (isImage) {
            session.photosFound++;
            await this.extractAndAnalyzePhoto(sessionId, file, relativePath, sessionDir);
          } else {
            // Extract non-image files too in case they're misnamed
            const content = await file.async('nodebuffer');
            if (this.couldBeImageByContent(content)) {
              session.photosFound++;
              await this.extractAndAnalyzePhoto(sessionId, file, relativePath, sessionDir);
            }
          }
        } catch (error) {
          session.corruptedFiles++;
          session.recoveryLog.push(`Failed to process ${relativePath}: ${error.message}`);
        }
      }

      session.status = 'completed';
      session.endTime = new Date();
      session.recoveryLog.push(`Recovery completed. Found ${session.photosFound} photos, recovered ${session.recoveredPhotos}`);

    } catch (error) {
      session.status = 'failed';
      session.recoveryLog.push(`Extraction failed: ${error.message}`);
      session.endTime = new Date();
      throw error;
    }
  }

  private async extractAndAnalyzePhoto(
    sessionId: string,
    file: JSZip.JSZipObject,
    relativePath: string,
    sessionDir: string
  ): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    try {
      const content = await file.async('nodebuffer');
      const safeName = this.sanitizeFilename(relativePath);
      const extractedPath = path.join(sessionDir, safeName);
      
      // Create directory structure
      await fs.mkdir(path.dirname(extractedPath), { recursive: true });
      await fs.writeFile(extractedPath, content);

      const photoFile: PhotoFile = {
        name: safeName,
        size: content.length,
        type: this.getFileType(content),
        isCorrupted: false,
        recoveryStatus: 'intact',
        originalPath: relativePath
      };

      try {
        // Analyze image metadata
        const dimensions = sizeOf(content);
        if (dimensions.width && dimensions.height) {
          photoFile.metadata = {
            width: dimensions.width,
            height: dimensions.height,
            format: dimensions.type,
            lastModified: file.date || new Date()
          };

          // Generate thumbnail
          const thumbnailPath = await this.generateThumbnail(content, sessionId, safeName);
          photoFile.thumbnailPath = thumbnailPath;

          session.recoveredPhotos++;
          photoFile.recoveryStatus = 'recovered';
          session.recoveryLog.push(`Successfully recovered: ${safeName} (${dimensions.width}x${dimensions.height})`);
        }
      } catch (error) {
        // Try to recover corrupted image
        const recoveredImage = await this.attemptImageRecovery(content);
        if (recoveredImage) {
          await fs.writeFile(extractedPath, recoveredImage);
          photoFile.recoveryStatus = 'recovered';
          photoFile.metadata = { format: 'recovered' };
          session.recoveredPhotos++;
          session.recoveryLog.push(`Recovered corrupted image: ${safeName}`);
        } else {
          photoFile.isCorrupted = true;
          photoFile.recoveryStatus = 'corrupted';
          session.corruptedFiles++;
          session.recoveryLog.push(`Image corrupted and unrecoverable: ${safeName}`);
        }
      }

      session.extractedFiles.push(photoFile);

    } catch (error) {
      session.recoveryLog.push(`Failed to extract ${relativePath}: ${error.message}`);
      session.corruptedFiles++;
    }
  }

  private async generateThumbnail(imageBuffer: Buffer, sessionId: string, filename: string): Promise<string> {
    try {
      const thumbnailDir = path.join(this.thumbnailsDir, sessionId);
      await fs.mkdir(thumbnailDir, { recursive: true });
      
      const thumbnailPath = path.join(thumbnailDir, `thumb_${filename}.jpg`);
      
      await sharp(imageBuffer)
        .resize(200, 200, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);
      
      return thumbnailPath;
    } catch (error) {
      console.error('Thumbnail generation failed:', error);
      return '';
    }
  }

  private async attemptImageRecovery(buffer: Buffer): Promise<Buffer | null> {
    try {
      // Try different recovery strategies
      
      // Strategy 1: Remove corrupted header and try to process
      if (buffer.length > 1024) {
        for (let offset = 0; offset < 512; offset += 4) {
          try {
            const truncatedBuffer = buffer.slice(offset);
            await sharp(truncatedBuffer).metadata();
            return truncatedBuffer;
          } catch (e) {
            continue;
          }
        }
      }

      // Strategy 2: Try to extract JPEG data from raw buffer
      const jpegStart = buffer.indexOf(Buffer.from([0xFF, 0xD8, 0xFF]));
      const jpegEnd = buffer.lastIndexOf(Buffer.from([0xFF, 0xD9]));
      
      if (jpegStart !== -1 && jpegEnd !== -1 && jpegEnd > jpegStart) {
        const jpegData = buffer.slice(jpegStart, jpegEnd + 2);
        try {
          await sharp(jpegData).metadata();
          return jpegData;
        } catch (e) {
          // Continue to next strategy
        }
      }

      // Strategy 3: Try PNG recovery
      const pngStart = buffer.indexOf(Buffer.from([0x89, 0x50, 0x4E, 0x47]));
      if (pngStart !== -1) {
        const pngData = buffer.slice(pngStart);
        try {
          await sharp(pngData).metadata();
          return pngData;
        } catch (e) {
          // Continue to next strategy
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  private isImageFile(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif', '.webp', '.heic', '.heif', '.raw', '.cr2', '.nef', '.arw'];
    const ext = path.extname(filename).toLowerCase();
    return imageExtensions.includes(ext);
  }

  private couldBeImageByContent(buffer: Buffer): boolean {
    if (buffer.length < 8) return false;

    // Check for image file signatures
    const signatures = [
      [0xFF, 0xD8, 0xFF], // JPEG
      [0x89, 0x50, 0x4E, 0x47], // PNG
      [0x47, 0x49, 0x46], // GIF
      [0x42, 0x4D], // BMP
      [0x49, 0x49, 0x2A, 0x00], // TIFF
      [0x4D, 0x4D, 0x00, 0x2A], // TIFF
    ];

    for (const sig of signatures) {
      if (buffer.subarray(0, sig.length).equals(Buffer.from(sig))) {
        return true;
      }
    }

    return false;
  }

  private getFileType(buffer: Buffer): string {
    if (buffer.length < 8) return 'unknown';

    if (buffer.subarray(0, 3).equals(Buffer.from([0xFF, 0xD8, 0xFF]))) return 'jpeg';
    if (buffer.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47]))) return 'png';
    if (buffer.subarray(0, 3).equals(Buffer.from([0x47, 0x49, 0x46]))) return 'gif';
    if (buffer.subarray(0, 2).equals(Buffer.from([0x42, 0x4D]))) return 'bmp';
    if (buffer.subarray(0, 4).equals(Buffer.from([0x49, 0x49, 0x2A, 0x00]))) return 'tiff';
    if (buffer.subarray(0, 4).equals(Buffer.from([0x4D, 0x4D, 0x00, 0x2A]))) return 'tiff';

    return 'unknown';
  }

  private sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_{2,}/g, '_');
  }

  getSession(sessionId: string): RecoverySession | undefined {
    return this.sessions.get(sessionId);
  }

  getAllSessions(): RecoverySession[] {
    return Array.from(this.sessions.values());
  }

  async downloadRecoveredPhotos(sessionId: string): Promise<Buffer> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    const sessionDir = path.join(this.extractionDir, sessionId);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    const chunks: Buffer[] = [];
    archive.on('data', chunk => chunks.push(chunk));
    
    return new Promise((resolve, reject) => {
      archive.on('end', () => resolve(Buffer.concat(chunks)));
      archive.on('error', reject);
      
      archive.directory(sessionDir, false);
      archive.finalize();
    });
  }

  async getThumbnail(sessionId: string, filename: string): Promise<Buffer | null> {
    try {
      const thumbnailPath = path.join(this.thumbnailsDir, sessionId, `thumb_${filename}.jpg`);
      return await fs.readFile(thumbnailPath);
    } catch (error) {
      return null;
    }
  }

  async cleanupSession(sessionId: string): Promise<void> {
    try {
      const sessionDir = path.join(this.extractionDir, sessionId);
      const thumbnailDir = path.join(this.thumbnailsDir, sessionId);
      
      await fs.rm(sessionDir, { recursive: true, force: true });
      await fs.rm(thumbnailDir, { recursive: true, force: true });
      
      this.sessions.delete(sessionId);
    } catch (error) {
      console.error(`Failed to cleanup session ${sessionId}:`, error);
    }
  }
}

export const photoRecoveryEngine = new PhotoRecoveryEngine();