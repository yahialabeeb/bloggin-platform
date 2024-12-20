import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

export type UploadedFileInfo = {
  fileName: string;
  fileUrl: string;
  key: string;
};

@Injectable()
export class UploadService {
  private s3: AWS.S3;
  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      endpoint: this.configService.get('S3_URL'),
      s3ForcePathStyle: true,
    });
  }

  async uploadFile(
    dataBuffer: Buffer,
    fileName: string,
    mimetype: string,
  ): Promise<UploadedFileInfo> {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.configService.get('S3_BUCKET_NAME'),
      Body: dataBuffer,
      Key: `${uuid()}-${fileName}`,
      ContentType: mimetype,
      ACL: 'public-read',
    };
    const uploadResult = await this.s3.upload(params).promise();

    const fileInfo = {
      fileName: fileName,
      fileUrl: uploadResult.Location,
      key: uploadResult.Key,
    };
    return fileInfo;
  }
}
