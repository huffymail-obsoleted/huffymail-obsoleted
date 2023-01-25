import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class S3Service {
  private s3: S3Client = new S3Client({
    region: this.configService.get<string>('AWS_SES_REGION')
  })

  constructor(private configService: ConfigService) {
  }

  public async getObjectAsString(key: string): Promise<string | undefined> {
    const { Body } = await this.s3.send(
      new GetObjectCommand({
        Bucket: this.configService.get<string>('AWS_SES_BUCKET'),
        Key: key
      })
    )

    return Body?.transformToString()
  }
}
