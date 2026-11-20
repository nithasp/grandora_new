import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { AuthService } from 'src/app/core/services';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grandora-dropzone',
  templateUrl: './grandora-dropzone.component.html',
  styleUrls: ['./grandora-dropzone.component.scss'],
})
export class GrandoraDropzoneComponent {
  @Input() type: string = '';
  @Output() getFiles = new EventEmitter<any>();
  files: File[] = [];

  maxFileNumber = 5;
  calcNumber: number = 15;

  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: this.maxFileNumber,

    autoReset: null,
    errorReset: null,
    cancelReset: null,
    uploadMultiple: false,
    addRemoveLinks: true,
    dictRemoveFile: 'X',
    dictCancelUpload: 'X',
  };

  en_message: any = {
    dropzoneBox: {
      text: 'Upload file or drag it here JPG, JPEG, PNG, BMP, PDF, NFO, TXT, XML, MP4, MPEG, LOG, DMP, HEIC, max 5 files, 9.5 MB upload limit in total',
      button: 'Choose file',
    },
  };
  th_message = {
    dropzoneBox: {
      text: 'ลากและวางไฟล์ที่นี่หรือ คลิกเพื่ออัปโหลด (สูงสุด 5 ไฟล์)',
      button: 'เลือกไฟล์',
    },
  };
  dropzoneMessages: any;

  lang: string = 'en';
  get language(): string {
    return this.lang;
  }
  set language(value: string) {
    this.lang = value;
    if (value === 'en') {
      this.dropzoneMessages = this.en_message;
    }
    if (value === 'th') {
      this.dropzoneMessages = this.th_message;
    }

    let dzButton: HTMLElement | null =
      document.querySelector('.dz-border-button');
    if (dzButton) {
      dzButton.innerHTML = this.dropzoneMessages?.dropzoneBox.button;
    }
  }

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {}

  public onUploadError(args: any): void {
    console.log('onUploadError:', args);
  }

  public onUploadSuccess(args: any): void {
    console.log('onUploadSuccess:', args);
    console.log(this.files);
  }

  handleDrop(event: any) {
    if (this.files.length <= this.maxFileNumber) {
      this.files.push(event);
    }
  }

  handleSending() {
    console.log('handleSending');
  }

  handleRemove(event: any) {
    console.log('handleRemove');

    this.files.splice(this.files.indexOf(event), 1);
    console.log(this.files);
  }

  maxFilesExceeded(event: any) {
    console.log('maxfilesexceeded');
    let dzPreview: any = document.querySelectorAll('.dz-preview');
    dzPreview[dzPreview.length - 1].remove();
    this.files.splice(this.files.indexOf(event), 1);
    Swal.fire({
      title: '',
      iconHtml: '<img src="/assets/images/icon/error-icon.png" />',
      html: `
      <div class="content">
      <p>You can not upload any more files (Maximum ${this.maxFileNumber} files).</p>
    </div>
      `,
      confirmButtonText: `
        <span class="error">Close</span>
      `,
    });
  }
}
