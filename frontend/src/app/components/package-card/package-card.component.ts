import { Component, Input } from '@angular/core';
import { PackageItem } from 'src/app/core/models';

const THEMES: Record<string, string> = {
  gold: '#FABB2C',
  blue: '#2993FF',
  green: '#55CCA2',
  pink: '#E8456D',
  indigo: '#5460CB',
};

const BADGES: Record<string, { fill: string; text: string }> = {
  'MOST POPULAR': { fill: '#FFCC00', text: '#212121' },
  'TIME LIMITED': { fill: '#FF3D00', text: '#FFFFFF' },
  RECOMMENDED: { fill: '#A129FF', text: '#FFFFFF' },
};

let nextId = 0;

@Component({
  selector: 'app-package-card',
  templateUrl: './package-card.component.html',
  styleUrls: ['./package-card.component.scss'],
})
export class PackageCardComponent {
  @Input() item!: PackageItem;

  readonly uid = `pc${++nextId}`;

  get color(): string {
    return THEMES[this.item.theme] ?? THEMES['gold'];
  }

  get badge(): { label: string; fill: string; text: string } | null {
    const label = this.item.badge;
    if (!label) return null;
    return { label, ...(BADGES[label] ?? { fill: '#2B2B2B', text: '#FFFFFF' }) };
  }

  get isCoins(): boolean {
    return this.item.grantCurrency === 'MYGG';
  }

  get art(): string {
    return this.item.image || '/assets/images/package/Polygon 3.png';
  }

  get amountLabel(): string {
    return `+ ${this.item.grantAmount.toLocaleString('en-US')}`;
  }

  get unitLabel(): string {
    return this.isCoins ? 'MYGG Coins' : 'Grando';
  }

  get priceLabel(): string {
    const baht = this.item.priceSatang / 100;
    return `฿${baht.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  }

  get bonusLabel(): string {
    if (this.item.bonusTickets) return `+ ${this.item.bonusTickets} Ticket`;
    return this.isCoins ? '1 MYGG = ฿1' : '';
  }

  get tileImage(): string {
    return this.item.bonusTickets ? '/assets/images/package/image 2199.png' : '/assets/images/package/Polygon 3.png';
  }

  priceSize(max: number, boxWidth: number): number {
    return Math.min(max, Math.floor(boxWidth / (this.priceLabel.length * 0.6)));
  }
}
