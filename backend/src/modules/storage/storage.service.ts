import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
import path from 'path';
import { AppError } from '../../common/errors';
import { config } from '../../config/config';
import { detectImage } from './image-type';

export interface StoredObject {
  key: string;
  url: string;
}

export interface IncomingFile {
  buffer: Buffer;
  size: number;
}

function createR2Client(): S3Client | null {
  const { accountId, accessKeyId, secretAccessKey } = config.storage.r2;
  if (config.storage.driver !== 'r2' || !accountId || !accessKeyId || !secretAccessKey) return null;
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
    // R2 rejects the CRC32 checksum headers newer AWS SDKs add to every upload by default
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  });
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly r2 = createR2Client();

  get driver(): 'r2' | 'local' {
    return this.r2 ? 'r2' : 'local';
  }

  async putImage(folder: string, file: IncomingFile | undefined): Promise<StoredObject> {
    if (!config.storage.uploadsEnabled) {
      throw new AppError('Image uploads are not configured on this server', 503, 'service_unavailable');
    }
    if (!file?.buffer?.length) throw new AppError('Choose an image to upload', 400, 'invalid_request');
    if (file.size > config.storage.maxBytes) {
      throw new AppError('The image is too large', 413, 'payload_too_large');
    }

    // The browser's Content-Type is only a claim; the file's first bytes say what it really is
    const type = detectImage(file.buffer);
    if (!type) {
      throw new AppError('Only JPEG, PNG, WebP or GIF images can be uploaded', 415, 'unsupported_media_type');
    }

    const key = `${folder}/${randomUUID()}.${type.extension}`;

    if (this.r2) {
      await this.r2.send(
        new PutObjectCommand({
          Bucket: config.storage.r2.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: type.mime,
          CacheControl: 'public, max-age=31536000, immutable',
        }),
      );
      return { key, url: `${config.storage.r2.publicUrl}/${key}` };
    }

    const target = path.join(config.storage.localDir, key);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, file.buffer);
    return { key, url: `${config.publicApiUrl}/uploads/${key}` };
  }

  async remove(key: string | null | undefined): Promise<void> {
    if (!key) return;
    try {
      if (this.r2) {
        await this.r2.send(new DeleteObjectCommand({ Bucket: config.storage.r2.bucket, Key: key }));
      } else {
        await unlink(path.join(config.storage.localDir, key));
      }
    } catch (err) {
      this.logger.warn({ err, key }, 'could not delete a stored image');
    }
  }
}
