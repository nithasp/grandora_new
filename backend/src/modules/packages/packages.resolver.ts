import { Args, Query, Resolver } from '@nestjs/graphql';
import { AppError } from '../../common/errors';
import { PackageItemModel, PackageItemsResponseModel } from './package.models';
import { Package, PackagesRepository } from './packages.repository';

export function toPackageItem(pkg: Package): PackageItemModel {
  return {
    id: pkg.id,
    code: pkg.code,
    name: pkg.name,
    description: pkg.description,
    price: pkg.priceSatang / 100,
    priceSatang: pkg.priceSatang,
    priceCoins: pkg.priceCoins,
    currency: 'THB',
    kind: pkg.grantCurrency === 'MYGG' ? 'coins' : 'grando',
    grantCurrency: pkg.grantCurrency,
    grantAmount: pkg.grantAmount,
    bonusTickets: pkg.bonusTickets,
    image: pkg.image,
    badge: pkg.badge,
    savePercent: pkg.savePercent,
    theme: pkg.theme,
    game: pkg.game,
    featured: pkg.featured,
  };
}

const KINDS: Record<string, 'MYGG' | 'GRANDO'> = { coins: 'MYGG', grando: 'GRANDO' };

@Resolver()
export class PackagesResolver {
  constructor(private readonly packages: PackagesRepository) {}

  @Query(() => PackageItemsResponseModel, { name: 'items', description: 'Packages on sale' })
  async items(
    @Args('kind', { type: () => String, nullable: true, description: 'coins or grando' })
    kind?: string | null,
  ): Promise<PackageItemsResponseModel> {
    if (kind && !KINDS[kind]) throw new AppError('kind must be coins or grando', 400, 'invalid_request');
    const packages = await this.packages.listActive(kind ? KINDS[kind]! : null);
    return { ok: true, message: 'Packages fetched successfully.', data: packages.map(toPackageItem) };
  }
}
