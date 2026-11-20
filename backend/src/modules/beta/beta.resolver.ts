import { Injectable } from '@nestjs/common';
import { Args, Field, Int, Mutation, ObjectType, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';
import { z } from 'zod';
import { Public } from '../../common/http';
import { parse } from '../../common/validation';
import { config } from '../../config/config';
import { DatabaseService } from '../../database/database.service';

@ObjectType('BetaRegisterResult')
export class BetaRegisterResultModel {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;
}

const optionalText = (max: number) => z.string().trim().max(max).nullish();

const signupSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email('must be a valid email address').max(254)),
  event_name: z.string().trim().min(1).max(60).default('creator_cbt'),
  first_name: optionalText(60),
  last_name: optionalText(60),
  age: z.number().int().min(1).max(120).nullish(),
  region: optionalText(60),
  favorite_game: optionalText(120),
  favorite_game_genre: z.array(z.string().trim().min(1).max(40)).max(20).nullish(),
  channel_name: optionalText(120),
});

@Injectable()
export class BetaService {
  constructor(private readonly db: DatabaseService) {}

  async signup(input: unknown): Promise<BetaRegisterResultModel> {
    const data = parse(signupSchema, input);
    await this.db.query(
      `INSERT INTO beta_signups (email, event_name, first_name, last_name, age, region, favorite_game,
                                 favorite_game_genre, channel_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (LOWER(email), event_name) DO UPDATE SET
         first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, age = EXCLUDED.age,
         region = EXCLUDED.region, favorite_game = EXCLUDED.favorite_game,
         favorite_game_genre = EXCLUDED.favorite_game_genre, channel_name = EXCLUDED.channel_name,
         updated_at = NOW()`,
      [
        data.email,
        data.event_name,
        data.first_name ?? null,
        data.last_name ?? null,
        data.age ?? null,
        data.region ?? null,
        data.favorite_game ?? null,
        data.favorite_game_genre ?? [],
        data.channel_name ?? null,
      ],
    );
    return { success: true, message: 'Thank you for signing up for the closed beta.' };
  }
}

@Resolver()
export class BetaResolver {
  constructor(private readonly beta: BetaService) {}

  @Public()
  @Throttle({ default: { limit: config.rateLimit.auth, ttl: config.rateLimit.windowMs } })
  @Mutation(() => BetaRegisterResultModel, { name: 'Register' })
  register(
    @Args('email', { type: () => String, nullable: true }) email?: string | null,
    @Args('first_name', { type: () => String, nullable: true }) first_name?: string | null,
    @Args('last_name', { type: () => String, nullable: true }) last_name?: string | null,
    @Args('age', { type: () => Int, nullable: true }) age?: number | null,
    @Args('region', { type: () => String, nullable: true }) region?: string | null,
    @Args('favorite_game', { type: () => String, nullable: true }) favorite_game?: string | null,
    @Args('favorite_game_genre', { type: () => [String], nullable: 'itemsAndList' })
    favorite_game_genre?: (string | null)[] | null,
    @Args('channel_name', { type: () => String, nullable: true }) channel_name?: string | null,
    @Args('event_name', { type: () => String, nullable: true }) event_name?: string | null,
  ): Promise<BetaRegisterResultModel> {
    return this.beta.signup({
      email,
      first_name,
      last_name,
      age,
      region,
      favorite_game,
      favorite_game_genre,
      channel_name,
      ...(event_name ? { event_name } : {}),
    });
  }
}
