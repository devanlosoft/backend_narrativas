import { Document, Types } from 'mongoose';
import { Category } from './categories.interface';

export interface Content extends Document {
  readonly title: string;
  readonly state: boolean;
  readonly createAt: Date;
  readonly imagen: string;
  readonly description: string;
  readonly category: Types.ObjectId | Category;
}
