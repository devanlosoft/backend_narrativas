/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  Post,
  Res,
  HttpStatus,
  Body,
  Get,
  Param,
  NotFoundException,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/create')
  async createPost(@Res() res, @Body() createUserDTO: CreateUserDTO) {
    try {
      const user = await this.userService.createUser(createUserDTO);
      return res.status(HttpStatus.OK).json({
        message: 'Producto satisfactoriamente creado',
        user: user,
      });
    } catch (error) {
      if (error.code === 11000 && error.keyPattern.email) {
        console.error(
          'Error: La dirección de correo electrónico ya está en uso.',
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Error: La dirección de correo electrónico ya está en uso.',
        });
      }
    }
  }

  @Get('/')
  async getUsers(@Res() res) {
    const users = await this.userService.getUsers();
    return res.status(HttpStatus.OK).json({
      message: 'Usuarios obtenidos satisfactoriamente',
      users,
    });
  }

  @Get('/:userId')
  async getUser(@Res() res, @Param('userId') userId) {
    const user = await this.userService.getUser(userId);
    if (!user) throw new NotFoundException('No existe el usuario');
    return res.status(HttpStatus.OK).json({ user });
  }

  @Delete('/delete')
  async deleteUser(@Res() res, @Query('userId') userId) {
    const userDelete = await this.userService.deleteUser(userId);
    if (!userDelete)
      throw new NotFoundException('No se puede eliminar no existe el usuario');
    return res
      .status(HttpStatus.OK)
      .json({ message: 'deleted success', userDelete });
  }

  @Put('update')
  async updateUser(
    @Res() res,
    @Query('userId') userId,
    @Body() createUserDTO: CreateUserDTO,
  ) {
    const userUpdate = await this.userService.updateUser(userId, createUserDTO);
    if (!userUpdate)
      throw new NotFoundException(
        'No se puede actualizar el usuario no existe el usuario',
      );
    return res
      .status(HttpStatus.OK)
      .json({ message: 'updated success', userUpdate });
  }
}
