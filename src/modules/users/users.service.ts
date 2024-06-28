/*
https://docs.nestjs.com/providers#services
*/
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/users.interfaces';
import { CreateUserDTO } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async getUsers(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }

  async getUser(name: string): Promise<User> {
    const user = await this.userModel.findOne({ username: name });
    return user;
  }

  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    const user = new this.userModel(createUserDTO);
    return await user.save();
  }

  async deleteUser(userId: number): Promise<User> {
    const deleteUser = await this.userModel.findByIdAndDelete(userId);
    return deleteUser;
  }

  async updateUser(
    userId: number,
    createUserDTO: CreateUserDTO,
  ): Promise<User> {
    const updateUser = await this.userModel.findByIdAndUpdate(
      userId,
      createUserDTO,
      { new: true },
    );
    return updateUser;
  }
}
