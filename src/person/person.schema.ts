import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { PersonType } from './person';

@Schema({
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class Person extends Document implements PersonType {
  @Prop({
    type: String,
    required: true,
  })
  password?: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  username: string;

  @Prop({
    type: String,
    unique: true,
    validate: {
      validator: (e: string) =>
        String(e)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          ),
      message: 'Email validation failed',
    },
  })
  email?: string | undefined;

  @Prop({
    default: '',
    type: String,
  })
  avatar?: string | undefined;

  @Prop({
    default: false,
    type: Boolean,
  })
  bot?: boolean | undefined;

  @Prop({
    default: false,
    type: Boolean,
  })
  system?: boolean | undefined;

  @Prop({
    default: false,
    type: Boolean,
  })
  mfa_enabled?: boolean | undefined;

  @Prop({
    type: String,
  })
  banner?: string | undefined;

  @Prop({
    type: String,
  })
  accent_color?: string | undefined;

  @Prop({
    type: String,
  })
  locale?: string | undefined;

  @Prop({
    type: Boolean,
  })
  verified?: boolean | undefined;
}

export const PersonSchema = SchemaFactory.createForClass(Person);
