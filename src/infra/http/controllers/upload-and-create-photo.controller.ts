import { Role } from '@/core/permissions';
import { InvalidFileTypeError } from '@/domain/deliveries/use-cases/errors/invalid-file-type';
import { UploadAndCreatePhotoUseCase } from '@/domain/deliveries/use-cases/upload-and-create-photo';
import { Roles } from '@/infra/auth/roles.decorator';
import {
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotoPresenter } from '../presenter/photo-presenter';

@Controller('/photos')
export class UploadAndCreatePhotoController {
  constructor(private uploadControllerUseCase: UploadAndCreatePhotoUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.Shipper)
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2MB
          }),
          new FileTypeValidator({
            fileType: 'image/jpeg',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const { photo } = await this.uploadControllerUseCase.execute({
        body: file.buffer,
        fileName: file.originalname,
        fileType: file.mimetype,
      });

      return PhotoPresenter.toHTTP(photo);
    } catch (err) {
      console.log(err);
      if (err instanceof InvalidFileTypeError) {
        throw new UnprocessableEntityException('File not acceptable');
      }
    }
  }
}
