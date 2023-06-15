import { Test } from '@nestjs/testing';
import { AttachmentsController } from './attachments.controller';
import type { TestingModule } from '@nestjs/testing';

describe('AvatarController', () => {
  let controller: AttachmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttachmentsController],
    }).compile();

    controller = module.get<AttachmentsController>(AttachmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
