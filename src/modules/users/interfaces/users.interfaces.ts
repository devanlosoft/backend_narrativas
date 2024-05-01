import { Document } from 'mongoose';

export interface User extends Document {
  readonly name: string;
  readonly rol: string;
  readonly email: string;
  readonly username: string;
  readonly password: string;
  readonly id: number;
  readonly createAt: Date;
}
