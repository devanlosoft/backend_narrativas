import { Document } from 'mongoose';

export interface Category extends Document {
  readonly title: string;
  readonly state: boolean;
  readonly createAt: Date;
}
