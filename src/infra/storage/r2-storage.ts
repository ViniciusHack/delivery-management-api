import { Uploader, UploaderParams } from '@/domain/deliveries/storage/uploader';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { EnvService } from '../env/env.service';

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client;

  constructor(private env: EnvService) {
    const cloudflareAccountId = env.get('CLOUDFLARE_ACCOUNT');

    this.client = new S3Client({
      credentials: {
        accessKeyId: env.get('S3_ACCESS_KEY'),
        secretAccessKey: env.get('S3_SECRET_KEY'),
      },
      endpoint: `https://${cloudflareAccountId}.r2.cloudflarestorage.com`,
      region: 'auto',
    });
  }

  async upload({ fileName, body, fileType }: UploaderParams) {
    const uploadId = randomUUID();

    const uniqueFileName = `${uploadId}-${fileName}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.env.get('S3_BUCKET_NAME'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    );

    return {
      link: uniqueFileName,
    };
  }
}
