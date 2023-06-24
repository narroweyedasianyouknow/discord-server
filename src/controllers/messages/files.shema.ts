import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AttachmentType = {
     /**
      * @description name of file attached
      */
     filename: string;
     /**
      * @description description for the file (max 1024 characters)
      */
     description?: string;
     /**
      * @description the attachment's media type
      */
     content_type?: string;
     /**
      * @description size of file in bytes
      */
     size: number;
     // /**
     //  * @description source url of file
     //  */
     // url: string;
     // /**
     //  * @description a proxied url of file
     //  */
     // proxy_url: string;
     /**
      * @description height of file (if image)
      */
     height?: number;
     /**
      * @description width of file (if image)
      */
     width?: number;
     /**
      * @description whether this attachment is ephemeral
      */
     ephemeral?: boolean;
     /**
      * @description the duration of the audio file (currently for voice messages)
      */
     duration_secs?: number;
     /**
      * @description base64 encoded bytearray representing a sampled waveform (currently for voice messages)
      */
     waveform?: string;
};

export class Attachment extends Document implements AttachmentType {
     @Prop({
          type: String,
          required: true,
     })
     filename: string;

     @Prop({
          type: String,
     })
     description?: string | undefined;

     @Prop({
          type: String,
     })
     content_type?: string | undefined;

     @Prop({
          type: Number,
     })
     size: number;

     @Prop({
          type: String,
     })
     url: string;

     @Prop({
          type: String,
     })
     proxy_url: string;

     @Prop({
          type: Number,
     })
     height?: number | undefined;

     @Prop({
          type: Number,
     })
     width?: number | undefined;

     @Prop({
          type: Boolean,
     })
     ephemeral?: boolean | undefined;

     @Prop({
          type: Number,
     })
     duration_secs?: number | undefined;

     @Prop({
          type: String,
     })
     waveform?: string | undefined;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
