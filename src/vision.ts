import vision from '@google-cloud/vision';

const GoogleCloudClient = new vision.ImageAnnotatorClient({
  keyFile: 'keyFile.json',
});
export default GoogleCloudClient;
