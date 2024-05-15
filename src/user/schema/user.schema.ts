import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserType } from 'src/common/constants';

export type UserDocument = User & Document;

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({ required: true, default: '' })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true, default: '' })
  photo: string;

  @Prop({ required: true, default: null })
  address: string;

  @Prop({ required: true, default: '' })
  zipcode: string;

  @Prop({ required: true, default: '' })
  city: string;

  @Prop({ required: true, default: '' })
  state: string;

  @Prop({ required: true, default: '' })
  country: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: UserType;
}

export const UserSchema = SchemaFactory.createForClass(User);
