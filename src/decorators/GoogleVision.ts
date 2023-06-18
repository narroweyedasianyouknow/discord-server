import { createParamDecorator } from '@nestjs/common';
import vision from '@google-cloud/vision';

export const GoogleVision = createParamDecorator(() => {
  const GoogleCloudClient = new vision.ImageAnnotatorClient({
    keyFile: 'keyFile.json',
  });
  return GoogleCloudClient;
});
