/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Post,
  UploadedFile,
  UseInterceptors,
  Controller,
  Get,
  HttpStatus,
  Param,
  Res,
  Delete,
  BadRequestException,
  Query,
  Patch,
} from '@nestjs/common';
import { NarrativasService } from './narrativas.service';
import { CreateCategoryDTO } from './dto/categories.dto';
import { CreateContentDTO } from './dto/contenidos.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ObjectId } from 'mongoose';

@Controller('narrativas')
export class NarrativasController {
  constructor(
    private narrativasService: NarrativasService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  //CATEGORIAS

  @Post('createcategory')
  async createCategorie(
    @Res() res,
    @Body() createCategorieDTO: CreateCategoryDTO,
  ) {
    const categorieCreated =
      await this.narrativasService.createCategory(createCategorieDTO);

    return res.status(HttpStatus.OK).json({
      message: 'Categoria satisfactoriamente creada',
      categorieCreated,
    });
  }

  @Get('categories')
  async getCategories(@Res() res) {
    const category = await this.narrativasService.getCategorys();
    return res.status(HttpStatus.OK).json({
      category,
    });
  }

  //CONTENDIDOS
  @Get('contents')
  async getContents(
    @Res() res,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const contents = await this.narrativasService.getContentsWithPagination(
      page,
      limit,
    );
    return res.status(HttpStatus.OK).json({
      contents,
    });
  }

  @Patch('contents/:id')
  async updateContent(
    @Res() res,
    @Body() createContentDTO: CreateContentDTO,
    @Param('id') id: ObjectId,
  ) {
    const contentUpdated = await this.narrativasService.updateContent(
      createContentDTO, // Pass the createContentDTO instance instead of a string
      id, // Swap the order of the arguments
    );
    return res.status(HttpStatus.OK).json({
      message: 'Contenido actualizado satisfactoriamente',
      contentUpdated,
    });
  }

  //MAS PRUEBAS PARA RECIBIR DATOS
  // En el controlador NarrativasController
  @Post('formulario')
  @UseInterceptors(FileInterceptor('file'))
  async handleFormulario(
    @Res() res,
    @UploadedFile() file: Express.Multer.File,
    @Body('data') data: string, // Cambia 'createContent' a 'data' para reflejar que es una cadena JSON
  ) {
    try {
      //subir la imagen para obtener la URL
      if (!file) {
        throw new BadRequestException('No se ha subido ninguna imagen');
      }
      if (!data) {
        throw new BadRequestException('No se ha enviado ningún dato');
      }

      const cloudinaryResponse = await this.cloudinaryService.uploadFile(
        file,
        'narrativas/imagenes',
      );

      // Obtener el ID de la categoría del cuerpo de la solicitud
      const categoryId = JSON.parse(data).categoria;

      // Convierte la cadena JSON a un objeto JavaScript
      const createContent: CreateContentDTO = JSON.parse(data);
      const contentCreated = await this.narrativasService.createContent(
        createContent,
        categoryId,
        cloudinaryResponse.secure_url,
      );

      return res.status(HttpStatus.OK).json({
        contentCreated,
      });
    } catch (error) {
      console.error('Error al crear el contenido:', error);
      return { message: 'Error al crear el contenido', error };
    }
  }

  // borrar archivos por su id publico
  @Delete('delete/:publicId')
  async deleteImage(@Param('publicId') publicId: string) {
    try {
      await this.cloudinaryService.deleteFile(publicId);
      return { message: 'Archivo eliminado exitosamente' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
