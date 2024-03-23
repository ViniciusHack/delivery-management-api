interface UploadFile {
  fileName: string;
  fileType: string;
  body: Buffer;
}

export abstract class Uploader {
  abstract upload(file: UploadFile): Promise<{ link: string }>;
}
