/**
 * 将透明度转化为 16 进制代码
 * @param {number} opacity 透明度
 * @returns {string} 16进制表示的透明度代码
 */
function getHexOpacity(opacity: number) {
  opacity = Math.max(opacity, 0);
  opacity = Math.min(opacity, 1);
  let num = Math.round(255 * opacity);
  let str = '';
  const arrHex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
  while (num > 0) {
    const mod = num % 16;
    num = (num - mod) / 16;
    str = arrHex[mod] + str;
  }
  if (str.length == 1) str = '0' + str;
  if (str.length == 0) str = '00';
  return str;
}

/**
 * Sums the passed percentage to the R, G or B of a HEX color
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed part of the color
 */
function addLight(color: string, amount: number) {
  const cc = parseInt(color, 16) + amount;
  const c = cc > 255 ? 255 : cc;
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`;
}

/**
 * Subtracts the indicated percentage to the R, G or B of a HEX color
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed part of the color
 */
function subtractLight(color: string, amount: number) {
  const cc = parseInt(color, 16) - amount;
  const c = cc < 0 ? 0 : cc;
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`;
}

/**
 * 判断是否 十六进制颜色值.
 * 输入形式可为 #fff000 #f00 #ffffffff #ff0f
 *
 * @param {string} color 十六进制颜色值
 * @return {boolean}
 */
export function isHexColor(color: string) {
  const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-f]{4}|[0-9a-fA-f]{6}|[0-9a-f-A-F]{8})$/;
  return reg.test(color);
}

/**
 * RGBA 颜色值转换为 十六进制颜色值. r, g, 和 b 需要在 [0, 255] 范围内, a 为 [0, 1]范围的小数, 计算时取两位有效数字
 * @param {number} r red
 * @param {number} g green
 * @param {number} b blue
 * @param {number} a alpha
 * @returns {string} 十六进制表示的颜色
 */
export function rgbToHex({ r, g, b, a }: { r: number; g: number; b: number; a: number }) {
  const hex = ((r << 16) | (g << 8) | b).toString(16);

  if (!a || a === 1) {
    return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex;
  } else {
    console.log('r,g,b,a :>> ', a, a * 100, getHexOpacity(a));
    return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex + getHexOpacity(a);
  }
}

/**
 * Transform a HEX color to its RGB representation
 * @param {string} hex The color to transform
 * @returns The RGB representation of the passed color
 */

export function hexToRGB(hex: string) {
  if (!isHexColor(hex)) return;

  hex = hex.replace(/^#/, '');
  let alphaFromHex = 1;

  if (hex.length === 8) {
    // #aacceea6
    alphaFromHex = Number.parseInt(hex.slice(6, 8), 16) / 255;
    hex = hex.slice(0, 6);
  } else if (hex.length === 4) {
    // #ace0
    alphaFromHex = Number.parseInt(hex.slice(3, 4).repeat(2), 16) / 255;
    hex = hex.slice(0, 3);
  } else if (hex.length === 3) {
    // #ace
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  const number = Number.parseInt(hex, 16);
  const r = number >> 16;
  const g = (number >> 8) & 255;
  const b = number & 255;
  const a = alphaFromHex;

  return a === 1 ? { r, g, b } : { r, g, b, a };
}

export function rgbToHsv({ r, g, b }: { r: number; g: number; b: number }) {
  r = r / 255;
  g = g / 255;
  b = b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  if (max === min) {
    h = 0;
  } else if (max === r) {
    if (g >= b) {
      h = (60 * (g - b)) / delta;
    } else {
      h = (60 * (g - b)) / delta + 360;
    }
  } else if (max === g) {
    h = (60 * (b - r)) / delta + 120;
  } else if (max === b) {
    h = (60 * (r - g)) / delta + 240;
  }
  h = Math.floor(h);
  const s = parseFloat((max === 0 ? 0 : 1 - min / max).toFixed(2));
  const v = parseFloat(max.toFixed(2));
  return { h, s, v };
}

export function colorIsDark(color: string) {
  if (!isHexColor(color)) return;
  const { r, g, b } = hexToRGB(color)!;
  return r * 0.299 + g * 0.578 + b * 0.114 < 192;
}

/**
 * Darkens a HEX color given the passed percentage
 * @param {string} color The color to process
 * @param {number} amount The amount to change the color by
 * @returns {string} The HEX representation of the processed color
 */
export function darken(color: string, amount: number) {
  color = color.includes('#') ? color.substring(1, color.length) : color;
  amount = Math.trunc((255 * amount) / 100);
  return `#${subtractLight(color.substring(0, 2), amount)}${subtractLight(
    color.substring(2, 4),
    amount,
  )}${subtractLight(color.substring(4, 6), amount)}`;
}

/**
 * Lightens a 6 char HEX color according to the passed percentage
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed color represented as HEX
 */
export function lighten(color: string, amount: number) {
  color = color.includes('#') ? color.substring(1, color.length) : color;
  amount = Math.trunc((255 * amount) / 100);
  return `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount,
  )}${addLight(color.substring(4, 6), amount)}`;
}
