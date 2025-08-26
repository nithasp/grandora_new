import { Component } from '@angular/core';
import { PackageService } from 'src/app/core/services';

@Component({
  selector: 'app-official-store',
  templateUrl: './official-store.component.html',
  styleUrls: ['./official-store.component.scss'],
})
export class OfficialStoreComponent {
  isItemFancyBoxDisplay: boolean = false;

  products = [
    {
      image: '/assets/images/official-store/avatar/1.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/2.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/3.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/4.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/5.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/6.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/7.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/1.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/2.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/3.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/4.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/5.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/6.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/7.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/1.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/2.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/3.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/4.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/5.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/6.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/7.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/1.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/2.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/3.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
    {
      image: '/assets/images/official-store/avatar/4.png',
      name: 'Avatar name',
      coin: {
        danegeld: 24,
        grando: 12,
        mygg: 8,
      },
    },
  ];

  type: string = 'all';

  constructor(private packageService: PackageService) {}

  ngAfterViewInit(): void {
    this.typeActive();
  }

  typeActive() {
    const types = document.querySelectorAll('.type');
    types.forEach((type) => {
      type.addEventListener('click', () => {
        types.forEach((allType) => allType.classList.remove('active'));
        type.classList.add('active');

        const typeName = type.getAttribute('type')!;
        this.type = typeName;
      });
    });
  }

  handlePackage(item: any) {
    this.packageService.handlePackage(item);
  }

  handleAvatarType() {
    this.type = 'avatars';

    const types = document.querySelectorAll('.type');
    types.forEach((allType) => allType.classList.remove('active'));

    const avatarTypes = document.querySelector("[type='avatars']");
    avatarTypes?.classList.add('active');
    console.log(avatarTypes);
  }
}
