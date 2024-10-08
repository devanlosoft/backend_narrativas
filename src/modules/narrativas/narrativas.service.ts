/*
https://docs.nestjs.com/providers#services
*/
import { Model, ObjectId } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCategoryDTO } from './dto/categories.dto';
import { Category } from './interfaces/categories.interface';
import { CreateContentDTO } from './dto/contenidos.dto';
import { Content } from './interfaces/contenidos.interface';

@Injectable()
export class NarrativasService {
  constructor(
    @InjectModel('Category')
    private readonly categoryModel: Model<Category>,

    @InjectModel('Content')
    private readonly contentModel: Model<Content>,
  ) {}

  async getCategorys(): Promise<Category[]> {
    const categorys = await this.categoryModel.find();
    return categorys;
  }

  async getCategory(categoryId: number): Promise<Category> {
    const category = await this.categoryModel.findById(categoryId);
    return category;
  }

  async createCategory(
    createCategoryDTO: CreateCategoryDTO,
  ): Promise<Category> {
    const category = new this.categoryModel(createCategoryDTO);
    return await category.save();
  }

  async deleteCategory(categoryId: number): Promise<Category> {
    const deleteCategory =
      await this.categoryModel.findByIdAndDelete(categoryId);
    return deleteCategory;
  }

  // const contents = await this.narrativasService.getContentsWithPagination(page, limit);
  //debo hacer la implemetacion de la paginacion en el servicio
  async getContentsWithPagination(
    page: number,
    limit: number,
  ): Promise<Content[]> {
    const contents = await this.contentModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);
    return contents;
  }

  async updateCategory(
    categoryId: number,
    createCategoryDTO: CreateCategoryDTO,
  ): Promise<Category> {
    const updateCategory = await this.categoryModel.findByIdAndUpdate(
      categoryId,
      createCategoryDTO,
      { new: true },
    );
    return updateCategory;
  }

  // Contenidos

  async createContent(
    createContentDTO: CreateContentDTO,
    categoryId: ObjectId,
    imagePublicId: string,
    videoPublicId: string,
  ): Promise<Content> {
    createContentDTO.category = categoryId;
    createContentDTO.imagen = imagePublicId;
    createContentDTO.content_url = videoPublicId;
    const content = new this.contentModel(createContentDTO);
    return await content.save();
  }

  async updateContent(CreateContentDTO: CreateContentDTO, contentId: ObjectId) {
    const updateContent = await this.contentModel.findByIdAndUpdate(
      contentId,
      CreateContentDTO,
      { new: true },
    );
    return updateContent;
  }

  async getContents(): Promise<Content[]> {
    const contents = await this.contentModel.find(); /* .populate({
      path: 'category',
      select: 'title -_id', // Especifica el campo que deseas proyectar
    }); */
    return contents;
  }

  // recibir imagen para guardar en cloudinary
}
