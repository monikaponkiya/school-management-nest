import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema({ collection: 'students', timestamps: true })
export class Student {
  @Prop({ required: true })
  name: string;

  @Prop({ default: null, required: true })
  parentPhoneNumber: string;

  @Prop({ default: null })
  address: string;

  @Prop({ default: null })
  standard: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  schoolId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  photo: string;

  @Prop({ required: true })
  DOB: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
