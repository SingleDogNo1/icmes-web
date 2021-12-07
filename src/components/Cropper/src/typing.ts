import type Cropper from 'cropperjs';

export interface CropEndResult {
  imgBase64: string;
  imgInfo: Cropper.Data;
}

export type { Cropper };
