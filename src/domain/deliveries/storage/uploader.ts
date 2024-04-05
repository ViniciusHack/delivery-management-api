export interface UploaderParams {
  fileName: string;
  fileType: string;
  body: Buffer;
}

export abstract class Uploader {
  abstract upload(file: UploaderParams): Promise<{ link: string }>;
}
