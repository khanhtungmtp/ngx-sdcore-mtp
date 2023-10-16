/* eslint-disable @angular-eslint/no-output-native */
/* eslint-disable @angular-eslint/component-selector */
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  IMAGE_TYPES_CONST,
  MEDIA_TYPE_CONST,
  VIDEO_TYPES_CONST,
} from '../../constants/media-type.constant';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { OperationResult } from '../../utilities/operation-result';
import { MediaItem } from '../../models/media-item';
import { FunctionUtility } from '../../utilities/function-utility';
import {
  ImageCroppedEvent,
  ImageCropperModule,
  ImageTransform,
} from 'ngx-image-cropper';
import { NgSnotifyService } from '../../services/ng-snotify.service';
import { MSG_CONST, TITLE_CONST } from '../../constants/notification.constant';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  standalone: true,
  selector: 'ngx-media-upload',
  templateUrl: './ngx-media-upload.component.html',
  styleUrls: ['./ngx-media-upload.component.scss'],
  imports: [CommonModule, FormsModule, ImageCropperModule, NgSelectModule],
})
export class NgxMediaUploadComponent {
  protected types: Map<string, string> = new Map();
  protected mediaItem: MediaItem = <MediaItem>{};
  protected acceptedExtensions = '';
  protected previewSrcSafe: SafeResourceUrl = '';
  protected previewType = '';
  protected id = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected tooltips: any[] = [];
  protected mediaType: typeof MEDIA_TYPE_CONST = MEDIA_TYPE_CONST;
  protected imagePlusUrl = 'assets/image-plus.svg';
  protected imageErrorUrl = 'assets/image-error.svg';
  protected imagePreviewUrl = 'assets/view.svg';
  protected imageCopyUrl = 'assets/copy.svg';
  protected imageDeleteUrl = 'assets/delete.svg';
  protected imageCropUrl = 'assets/crop.svg';
  protected cropEditImage = 'assets/edit.svg';
  protected cropFlipHorizontalImage = 'assets/flip-horizontal.svg';
  protected cropFlipVerticalImage = 'assets/flip-vertical.svg';
  protected cropResetChangesImage = 'assets/reset-changes.svg';
  protected cropRotateLeftImage = 'assets/rotate-left.svg';
  protected cropRotateRightImage = 'assets/rotate-right.svg';
  protected cropZoomInImage = 'assets/zoom-in.svg';
  protected cropZoomOutImage = 'assets/zoom-out.svg';
  protected cropRotateImage = 'assets/rotate.svg';
  protected cropRatioImage = 'assets/ratio.svg';
  protected selectionCropImage = 'assets/selection.svg';
  protected cropImage: MediaItem = <MediaItem>{};
  protected canvasRotation = 0;
  protected transform: ImageTransform = <ImageTransform>{};
  protected rotation = 0;
  protected scale = 1;
  protected containWithinAspectRatio = false;
  protected fileName = '';
  protected maintainAspectRatio = false;
  protected aspectRatio = 0;
  protected isRoundCropper = false;
  protected textToCompare = false;

  protected modal: BsModalRef | undefined;
  protected cropModal: BsModalRef | undefined;

  @ViewChild('videoSrcModal') protected modalMediaVideo: ElementRef | undefined;
  @Input() public src = '';
  @Input() public accept = 'image/*, video/*';
  @Input() public maxSize = 999999999999999;
  @Input() public height = 150;
  @Input() public file: File = new File([], '');
  @Input() public copy = false;
  @Input() public crop = false;
  @Input() public remove = false;
  @Input() public preview = false;
  @Input() public disabled = false;
  @Input() public confirmRemove = false;
  @Output() protected fileChange: EventEmitter<File> = new EventEmitter();
  @Output() protected result: EventEmitter<OperationResult> =
    new EventEmitter();

  constructor(
    private snotify: NgSnotifyService,
    private modalService: BsModalService,
    protected sanitizer: DomSanitizer
  ) {
    this.id = FunctionUtility.nextID();
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  public ngOnInit(): void {
    IMAGE_TYPES_CONST.forEach((type) =>
      this.types.set(type, MEDIA_TYPE_CONST.IMG)
    );
    VIDEO_TYPES_CONST.forEach((type) =>
      this.types.set(type, MEDIA_TYPE_CONST.VIDEO)
    );
    this.initialMediaItem();
    this.calculateAcceptedExtensions();
  }

  public reset(): void {
    this.mediaItem = <MediaItem>{
      id: this.id,
      srcSafe: this.sanitizer.bypassSecurityTrustUrl(this.src),
      src: this.src,
      type: this.checkMediaType(this.src),
    };
    this.resetImage();
    this.fileChange.emit(undefined);
    this.result.emit({ isSuccess: true, data: 'RESET' } as OperationResult);
  }

  protected async initialMediaItem(): Promise<void> {
    let file: File = new File([], '');

    if (this.src) {
      const extension: string | undefined = this.src.split('.').pop();
      const mineType: string = this.getMineType(extension as string);
      const url = this.src;
      const fileName = url.substring(url.lastIndexOf('/') + 1);
      file = await this.urltoFile(this.src, fileName, mineType);
    }

    this.mediaItem = <MediaItem>{
      id: this.id,
      srcSafe: this.sanitizer.bypassSecurityTrustUrl(this.src),
      src: this.src,
      type: this.checkMediaType(this.src),
      file: file,
    };
  }

  protected checkMediaType(src: string | undefined): string {
    if (
      !src ||
      typeof src === 'object' ||
      typeof src === 'number' ||
      !src.trim()
    )
      return MEDIA_TYPE_CONST.IMG;

    const url: URL = new URL(src);
    const extension: string = url.pathname.split('.')[1];
    const type: string | undefined = this.types.get(extension);
    return type ? type : MEDIA_TYPE_CONST.IMG;
  }

  protected onRemoveMediaClicked(): void {
    this.confirmRemove
      ? this.snotify.confirm(TITLE_CONST.DELETE, MSG_CONST.DELETE, () =>
        this.removeMedia()
      )
      : this.removeMedia();
  }

  protected removeMedia(): void {
    this.mediaItem = <MediaItem>{ id: this.id };
    this.resetImage();
    this.fileChange.emit(this.mediaItem.file);
    this.result.emit({ isSuccess: true, data: 'REMOVE' } as OperationResult);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected onSelectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      const size: number = file.size;
      const extension: string | undefined = file.name.split('.').pop();
      this.fileName = file.name;
      if (
        !extension ||
        !this.types.get(extension) ||
        !this.acceptedExtensions.includes(extension?.toLowerCase())
      ) {
        event.target.value = '';
        return this.result.emit({
          isSuccess: false,
          data: 'BROWSE',
          error: 'INVALID_FILE_TYPE',
        });
      }

      if (size > this.maxSize) {
        event.target.value = '';
        return this.result.emit({
          isSuccess: false,
          data: 'BROWSE',
          error: 'INVALID_FILE_SIZE',
        });
      }
      this.crop = IMAGE_TYPES_CONST.includes(extension);
      const mediaItem: MediaItem = <MediaItem>{
        id: this.id,
        file,
        type: this.types.get(extension?.toLowerCase()),
      };
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        mediaItem.srcSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
          e.target?.result?.toString() ?? ''
        );
        mediaItem.src = e.target?.result?.toString() ?? '';
        this.mediaItem = mediaItem;
        this.fileChange.emit(mediaItem.file);
        this.result.emit({
          isSuccess: true,
          data: 'BROWSE',
        } as OperationResult);
      };
    }

    event.target.value = '';
  }

  protected calculateAcceptedExtensions(): void {
    let result: string = this.accept;

    if (!this.accept || !this.accept.trim())
      result +=
        IMAGE_TYPES_CONST.map((type) => `.${type}`).join(', ') +
        ', ' +
        VIDEO_TYPES_CONST.map((type) => `.${type}`).join(', ');

    if (this.accept.includes('image/*'))
      result = result.replace(
        'image/*',
        IMAGE_TYPES_CONST.map((type) => `.${type}`).join(', ')
      );

    if (this.accept.includes('video/*'))
      result = result.replace(
        'video/*',
        VIDEO_TYPES_CONST.map((type) => `.${type}`).join(', ')
      );

    this.acceptedExtensions = result;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected openModal(template: TemplateRef<any>) {
    if (
      this.preview &&
      this.mediaItem &&
      this.mediaItem.srcSafe &&
      this.mediaItem.type
    ) {
      this.previewSrcSafe = this.mediaItem.srcSafe;
      this.previewType = this.mediaItem.type;
      this.modal = this.modalService.show(template, { class: 'modal-lg' });
    }
  }

  protected copySrc() {
    navigator.clipboard.writeText(this.src);
    this.result.emit({ isSuccess: true, data: 'COPY' } as OperationResult);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected openCropModal(template: TemplateRef<any>) {
    if (
      this.crop &&
      this.mediaItem &&
      this.mediaItem.file &&
      this.mediaItem.type
    ) {
      this.cropImage = { ...this.mediaItem };
      this.cropModal = this.modalService.show(template, {
        class: 'modal-lg imageCropper',
        backdrop: 'static',
      });
    }
  }

  protected imageCropped(event: ImageCroppedEvent) {
    this.cropImage.src = event.base64 ?? event.objectUrl ?? '';
    this.cropImage.srcSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.cropImage.src
    );
  }

  protected rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  protected rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH,
    };
  }

  protected flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH,
    };
  }

  protected flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV,
    };
  }

  protected resetImage() {
    this.canvasRotation = 0;
    this.transform = {};
    this.rotation = 0;
    this.scale = 1;
    this.containWithinAspectRatio = false;
    this.fileName = '';
    this.maintainAspectRatio = false;
    this.aspectRatio = 0;
    this.textToCompare = false;
    this.updateCropper();
  }

  protected zoomOut() {
    this.scale -= 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  protected zoomIn() {
    this.scale += 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  protected toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  protected updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation,
    };
  }

  protected updateRatio() {
    this.maintainAspectRatio = this.aspectRatio > 0;
  }

  protected updateCropper() {
    this.maintainAspectRatio = this.textToCompare;
    this.aspectRatio = this.textToCompare ? 1 : 0;
    this.isRoundCropper = this.textToCompare;
  }

  protected async saveImage() {
    this.mediaItem.file = await this.urltoFile(
      this.cropImage.src as string,
      this.mediaItem.file.name,
      this.mediaItem.file.type
    );
    this.mediaItem.srcSafe = this.cropImage.srcSafe;
    this.fileChange.emit(this.mediaItem.file);
    this.result.emit({ isSuccess: true, data: 'CROP' } as OperationResult);
    this.cropModal?.hide();
  }

  protected async urltoFile(
    url: string,
    fileName: string,
    mimeType: string
  ): Promise<File> {
    mimeType = mimeType || (url.match(/^data:([^;]+);/) || '')[1];
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    return new File([buf], fileName, { type: mimeType });
  }

  protected async urlToFile(url: string): Promise<File> {
    const res = await fetch(url);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const buf = await res.arrayBuffer();
    return new File([], 'fileName');
  }

  protected getMineType(extension: string): string {
    const isImage = IMAGE_TYPES_CONST.includes(extension?.toLowerCase());
    return `${isImage ? 'image' : 'video'}/${extension}`;
  }
}
