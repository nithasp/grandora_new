import { Module } from '@nestjs/common';
import { PackagesRepository } from './packages.repository';
import { PackagesResolver } from './packages.resolver';

@Module({
  providers: [PackagesRepository, PackagesResolver],
  exports: [PackagesRepository],
})
export class PackagesModule {}
