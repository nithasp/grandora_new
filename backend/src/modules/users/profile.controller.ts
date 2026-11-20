import { Controller, Delete, HttpCode, Param, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { notFound } from '../../common/errors';
import { ApiEnvelope, CurrentUserId, envelope } from '../../common/http';
import { API_PREFIX, config } from '../../config/config';
import { IncomingFile } from '../storage/storage.service';
import { ProfileModel } from './user.models';
import { ImageSlot } from './users.repository';
import { UsersService } from './users.service';

function imageSlot(value: string): ImageSlot {
  if (value === 'avatar' || value === 'cover') return value;
  throw notFound('Image slot');
}

@Controller(`${API_PREFIX}/profile`)
export class ProfileController {
  constructor(private readonly users: UsersService) {}

  @Put(':slot')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: config.storage.maxBytes, files: 1 } }))
  async upload(
    @CurrentUserId() userId: number,
    @Param('slot') slot: string,
    @UploadedFile() file?: IncomingFile,
  ): Promise<ApiEnvelope<ProfileModel>> {
    const profile = await this.users.replaceImage(userId, imageSlot(slot), file);
    return envelope(profile, 'Image uploaded.');
  }

  @Delete(':slot')
  @HttpCode(200)
  async remove(
    @CurrentUserId() userId: number,
    @Param('slot') slot: string,
  ): Promise<ApiEnvelope<ProfileModel>> {
    const profile = await this.users.removeImage(userId, imageSlot(slot));
    return envelope(profile, 'Image removed.');
  }
}
