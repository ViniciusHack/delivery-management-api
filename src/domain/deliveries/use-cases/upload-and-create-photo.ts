import { Injectable } from '@nestjs/common';
import { Photo } from '../entities/photo';
import { PhotosRepository } from '../repositories/photos-repository';
import { Uploader } from '../storage/uploader';
import { InvalidFileTypeError } from './errors/invalid-file-type';

interface UploadPhotoUseCaseProps {
  fileType: string;
  fileName: string;
  body: Buffer;
}

@Injectable()
export class UploadAndCreatePhotoUseCase {
  constructor(
    private readonly photosRepository: PhotosRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    body,
    fileName,
    fileType,
  }: UploadPhotoUseCaseProps): Promise<{ photo: Photo }> {
    if (fileType.match(/image\/*/) === null) {
      throw new InvalidFileTypeError();
    }

    const { link } = await this.uploader.upload({ body, fileName, fileType });

    const photo = new Photo({
      link,
    });

    await this.photosRepository.create(photo);

    return { photo };
  }
}
