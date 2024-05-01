import { Schema } from 'mongoose';

export class CreateContentDTO {
  title: string;
  state: boolean;
  imagen: string;
  description: string;
  content_url: string;
  content_type: string;
  createAt: Date;
  category: Schema.Types.ObjectId;
}
