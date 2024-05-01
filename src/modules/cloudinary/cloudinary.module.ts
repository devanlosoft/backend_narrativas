import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  exports: [CloudinaryProvider, CloudinaryService],
  providers: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}
