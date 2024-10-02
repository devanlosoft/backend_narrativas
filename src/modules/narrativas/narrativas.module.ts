import { NarrativasService } from './narrativas.service';
import { NarrativasController } from './narrativas.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './schemas/categories.schema';
import { ContentSchema } from './schemas/contenidos.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([
      {
        name: 'Category',
        schema: CategorySchema,
      },
      {
        name: 'Content',
        schema: ContentSchema,
      },
    ]),
  ],
  controllers: [NarrativasController],
  providers: [NarrativasService],
})
export class CategoriesModule {}
