// 使用 unocss 替换 windicss
// https://github.com/lost-dream/unocss
// TODO: 实现 windicss 中 createEnterPlugin方法
import Unocss from 'unocss/vite';
import { presetAttributify, presetUno } from 'unocss';
import transformerDirective from '@unocss/transformer-directives';
import { successColor, primaryColor, disabledColor, errorColor } from '/@/settings/designSetting';

export function configIUnocssPlugin() {
  return Unocss({
    presets: [presetUno(), presetAttributify()],
    theme: {
      breakpoints: {
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
        '2xl': '1600px',
      },
      colors: {
        primary: primaryColor,
        success: successColor,
        disabled: disabledColor,
        error: errorColor,
      },
    },
    transformers: [transformerDirective()],
  });
}
