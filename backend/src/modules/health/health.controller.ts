import { Controller, Get, Res } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Response } from 'express';
import { Public } from '../../common/http';
import { config } from '../../config/config';
import { DatabaseService } from '../../database/database.service';

@Public()
@SkipThrottle()
@Controller()
export class HealthController {
  constructor(private readonly db: DatabaseService) {}

  @Get()
  root(): { message: string; graphql: string } {
    return { message: 'Grandora API is running!', graphql: config.graphql.path };
  }

  @Get('healthz')
  async health(@Res({ passthrough: true }) res: Response): Promise<{ status: string }> {
    if (!(await this.db.isHealthy())) {
      res.status(503);
      return { status: 'unavailable' };
    }
    return { status: 'ok' };
  }
}
