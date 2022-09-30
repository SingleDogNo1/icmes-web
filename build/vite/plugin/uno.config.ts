// https://github.com/unocss/unocss
// TODO 怎么完美的配合 unocss vscode 插件使用？
import Unocss from 'unocss/vite';
import { presetAttributify, presetUno, presetIcons } from 'unocss';
import transformerDirective from '@unocss/transformer-directives';
import {
  successColor,
  primaryColor,
  disabledColor,
  errorColor,
} from '../../../src/settings/designSetting';

export function configIUnocssPlugin() {
  return Unocss({
    presets: [presetUno(), presetAttributify(), presetIcons()],
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
    rules: [
      [
        'overflow-ellipsis',
        {
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          'white-space': 'nowrap',
        },
      ],
    ],
  });
}
