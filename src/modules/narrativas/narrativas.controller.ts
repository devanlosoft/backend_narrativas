/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
  Controller,
  Get,
  HttpStatus,
  Param,
  Res,
  Delete,
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
  ) { }

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

  @Post('createcontent/:categoryId')
  @UseInterceptors(FileInterceptor('imagen'))
  async createContent(
    @UploadedFile() file: Express.Multer.File,
    @Body() createContentDTO: CreateContentDTO,
    @Param('categoryId') categoryId,
  ) {
    const cloudinaryResponse = await this.cloudinaryService.uploadFile(
      file,
      'narrativas/imagenes',
    );

    const contentCreated = await this.narrativasService.createContent(
      createContentDTO,
      categoryId,
      'imagenurl',
      //cloudinaryResponse.secure_url,
    );

    return {
      contentCreated,
      cloudinaryResponse,
    };
  }

  @Get('contents')
  async getContents(@Res() res) {
    const contents = await this.narrativasService.getContents();
    return res.status(HttpStatus.OK).json({
      contents,
    });
  }

  //MAS PRUEBAS PARA RECIBIR DATOS
  // En el controlador NarrativasController
  @Post('formulario/:categoryId')
  @UseInterceptors(FileInterceptor('imagen'))
  async handleFormulario(
    @UploadedFile() file: Express.Multer.File,
    @Body('data') data: string, // Cambia 'createContent' a 'data' para reflejar que es una cadena JSON
    @Param('categoryId') categoryId: ObjectId,
  ) {
    try {
      //subir la imagen para obtener la URL
      const cloudinaryResponse = await this.cloudinaryService.uploadFile(
        file,
        'narrativas/imagenes',
      );

      console.log(cloudinaryResponse.secure_url);
      // Convierte la cadena JSON a un objeto JavaScript
      const createContent: CreateContentDTO = JSON.parse(data);
      const contentCreated = await this.narrativasService.createContent(
        createContent,
        categoryId,
        cloudinaryResponse.secure_url,
      );

      return { contentCreated };
    } catch (error) {
      console.error('Error al crear el contenido:', error);
      // Manejar el error de acuerdo a tus necesidades
    }
  }

  //CLOUDINARY PARA MANEJO DE SUBIDA DE ARCHIVOS A LA CLOUD
  @Post('uploadImage')
  @UseInterceptors(FileInterceptor('imagen'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() datosForm: { title: string; description: string; state: boolean },
  ) {
    const cloudinaryResponse = await this.cloudinaryService.uploadFile(
      file,
      'narrativas/imagenes',
    );

    // Aqui puedes usar los datos del formulario
    console.log(datosForm.title);
    console.log(datosForm.description);
    console.log(datosForm.state);
    console.log(cloudinaryResponse);

    return cloudinaryResponse;
  }

  // borrar archivos por su id publico
  @Delete('delete/:publicId')
  async deleteImage(@Param('publicId') publicId: string) {
    try {
      await this.cloudinaryService.deleteFile(publicId);
      return { message: 'Archivo eliminado exitosamente' };
    } catch (error) {
      throw error;
    }
  }
}

/* @UseInterceptors(FileInterceptor('imagen'))
  @Post('createcontent/:categoryId')
  async createContent(
    @Res() res,
    @Body() createContentDTO: CreateContentDTO,
    @Param('categoryId') categoryId,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    @UploadedFile()
    file: Express.Multer.File, // Obtiene el archivo de imagen subido
  ) {
    //verificar que la categoria exista
    const category = await this.narrativasService.getCategory(categoryId);
    if (!category) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'La categoría especificada no existe',
      });
    }

    // si la categoria existe carga la imagen al cloudinary
    const cloudinaryResponse = await this.cloudinaryService.uploadFile(
      file,
      'narrativas/imagenes',
    );

    // si la categoria existe y se guardo la imagen creo la imagen crea el contenido
    const contentCreated = await this.narrativasService.createContent(
      createContentDTO,
      categoryId,
      cloudinaryResponse.secure_url,
    );
    return res.status(HttpStatus.OK).json({
      contentCreated,
      cloudinaryResponse,
    });
  } */
