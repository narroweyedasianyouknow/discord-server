import { ImageAnnotatorClient } from '@google-cloud/vision';
import { createParamDecorator } from '@nestjs/common';

export const GoogleVision = createParamDecorator(() => {
      const GoogleCloudClient = new ImageAnnotatorClient({
            keyFile: 'keyFile.json',
      });
      return GoogleCloudClient;
});
