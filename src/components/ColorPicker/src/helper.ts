import { hexToRGB, rgbToHsv } from '/@/utils/color';

export function setColorValue(color: string) {
  let rgba: any = { r: 0, g: 0, b: 0, a: 1 };
  if (/#/.test(color)) {
    rgba = hexToRGB(color);
  } else if (/rgb/.test(color)) {
    rgba = rgb2rgba(color);
  } else if (typeof color === 'string') {
    rgba = rgb2rgba(`rgba(${color})`);
  } else if (Object.prototype.toString.call(color) === '[object Object]') {
    rgba = color;
  }
  const { r, g, b, a } = rgba;
  const { h, s, v } = rgbToHsv(rgba);
  return { r, g, b, a: a === undefined ? 1 : a, h, s, v };
}
export function createAlphaSquare(size: number) {
  const canvas = document.createElement('canvas');
  const ctx: any = canvas.getContext('2d');
  const doubleSize = size * 2;
  canvas.width = doubleSize;
  canvas.height = doubleSize;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, doubleSize, doubleSize);
  ctx.fillStyle = '#ccd5db';
  ctx.fillRect(0, 0, size, size);
  ctx.fillRect(size, size, size, size);

  return canvas;
}
export function createLinearGradient(
  direction: any,
  ctx: any,
  width: any,
  height: any,
  color1: any,
  color2: any,
) {
  const isL = direction === 'l';
  const gradient = ctx.createLinearGradient(0, 0, isL ? width : 0, isL ? 0 : height);
  gradient.addColorStop(0.01, color1);
  gradient.addColorStop(0.99, color2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

export function rgb2rgba(rgba: any) {
  if (typeof rgba === 'string') {
    rgba = (/rgba?\((.*?)\)/.exec(rgba) || ['', '0,0,0,1'])[1].split(',');
    return {
      r: Number(rgba[0]) || 0,
      g: Number(rgba[1]) || 0,
      b: Number(rgba[2]) || 0,
      a: Number(rgba[3] ? rgba[3] : 1), // Avoid the case of 0
    };
  } else {
    return rgba;
  }
}
