import { InMemoryPhotosRepository } from 'test/repositories/in-memory-photos-repository';
import { FakeUploader } from 'test/storage/fake-uploader';
import { InvalidFileTypeError } from './errors/invalid-file-type';
import { UploadAndCreatePhotoUseCase } from './upload-and-create-photo';

let sut: UploadAndCreatePhotoUseCase;
let inMemoryPhotosRepository: InMemoryPhotosRepository;
let fakeUploader: FakeUploader;

describe('Upload photo', () => {
  beforeEach(() => {
    inMemoryPhotosRepository = new InMemoryPhotosRepository();
    fakeUploader = new FakeUploader();
    sut = new UploadAndCreatePhotoUseCase(
      inMemoryPhotosRepository,
      fakeUploader,
    );
  });

  it('should upload and create a photo', async () => {
    await sut.execute({
      body: Buffer.from('my buffer'),
      fileName: 'photo.jpg',
      fileType: 'image/jpeg',
    });

    const persistedPhoto = inMemoryPhotosRepository.items[0];

    expect(persistedPhoto).toEqual(
      expect.objectContaining({
        link: expect.any(String),
        id: expect.any(String),
      }),
    );
  });

  it('should not be able to upload a photo that is of a different type than image', async () => {
    await expect(
      sut.execute({
        body: Buffer.from('my buffer'),
        fileName: 'photo.jpg',
        fileType: 'application/pdf',
      }),
    ).rejects.toThrowError(InvalidFileTypeError);
  });
});
