import { randomUUID } from 'crypto';

interface Upload {
  link: string;
  fileName: string;
}

export class FakeUploader {
  public uploads: Upload[] = [];

  async upload({ fileName }) {
    const link = `https://www.fast-feet-unit-test.com/${fileName}/${randomUUID}`;
    this.uploads.push({
      link,
      fileName,
    });

    return { link };
  }
}
