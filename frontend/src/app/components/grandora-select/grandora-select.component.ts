import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ViewChildren,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'app-grandora-select',
  templateUrl: './grandora-select.component.html',
  styleUrls: ['./grandora-select.component.scss'],
})
export class GrandoraSelectComponent implements OnInit {
  @ViewChild('selectElem') selectElem!: ElementRef;
  @ViewChildren('optionItem') optionItem!: any;

  @Input() optionPlaceholder!: string;
  @Input() optionItems: any = [];

  @Input() status: string = '';

  @Output() changeTopic = new EventEmitter<string>();

  isOptionsContainerActive: boolean = false;
  optionValue!: string;
  isOptionDirty: boolean = false;

  optionTimeout: any;

  constructor() {}

  ngOnInit(): void {
    this.handleCloseSearchInit();
  }
  ngAfterViewInit() {
    const selected = document.querySelectorAll(
      '#profile-edit .selected .placeholder-text'
    );
    selected.forEach((AllSelected) => {
      if (AllSelected.innerHTML !== 'Select') {
        const item = AllSelected.parentElement?.parentElement;
        item?.classList.add('dirty');
      }
    });
    this.optionValue = this.optionPlaceholder;

    this.optionItem.forEach((item: any) => {
      item.nativeElement.addEventListener('click', () => {
        clearTimeout(this.optionTimeout);
        this.optionItem.forEach((allItem: any) =>
          allItem.nativeElement.classList.remove('active')
        );
        this.optionTimeout = setTimeout(() => {
          item.nativeElement.classList.add('active');
        }, 200);
      });
    });
  }

  handleSelect(item: any) {
    if (!this.isOptionDirty) {
      this.isOptionDirty = true;
    }

    this.optionPlaceholder = item.name;
    this.isOptionsContainerActive = false;
    this.changeTopic.emit(item.value);

    setTimeout(() => {
      this.optionValue = item.name;
    }, 400);
  }

  handleCloseSearchInit() {
    document.addEventListener('mousedown', (event: any) => {
      const elem = this.selectElem.nativeElement;
      if (elem && !elem.contains(event.target)) {
        this.isOptionsContainerActive = false;
      }
    });
  }
}
