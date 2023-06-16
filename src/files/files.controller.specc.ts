import { Test } from '@nestjs/testing';
import { FilesController } from './files.controller';
import type { TestingModule } from '@nestjs/testing';

describe('AvatarController', () => {
  let controller: FilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
    }).compile();

    controller = module.get<FilesController>(FilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
