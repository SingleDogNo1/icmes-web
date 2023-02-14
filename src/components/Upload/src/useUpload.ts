import { Ref, unref, computed } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export function useUploadType({
  acceptRef,
  helpTextRef,
  maxNumberRef,
  maxSizeRef,
  imageSizeRef,
}: {
  acceptRef: Ref<string[]>;
  helpTextRef: Ref<string>;
  maxNumberRef: Ref<number>;
  maxSizeRef: Ref<number>;
  imageSizeRef: Ref<{
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
  }>;
}) {
  // 文件类型限制
  const getAccept = computed(() => {
    const accept = unref(acceptRef);
    if (accept && accept.length > 0) {
      return accept;
    }
    return [];
  });
  const getStringAccept = computed(() => {
    return unref(getAccept)
      .map((item) => {
        if (item.indexOf('/') > 0 || item.startsWith('.')) {
          return item;
        } else {
          return `.${item}`;
        }
      })
      .join(',');
  });

  // 支持jpg、jpeg、png格式，不超过2M，最多可选择10张图片，。
  const getHelpText = computed(() => {
    const helpText = unref(helpTextRef);
    if (helpText) {
      return helpText;
    }
    const helpTexts: string[] = [];

    const accept = unref(acceptRef);
    if (accept.length > 0) {
      helpTexts.push(t('component.upload.accept', [accept.join(',')]));
    }

    const maxSize = unref(maxSizeRef);
    if (maxSize) {
      helpTexts.push(t('component.upload.maxSize', [maxSize]));
    }

    const maxNumber = unref(maxNumberRef);
    if (maxNumber && maxNumber !== Infinity) {
      helpTexts.push(t('component.upload.maxNumber', [maxNumber]));
    }
    const imageSize = unref(imageSizeRef);
    if (imageSize.maxWidth) {
      helpTexts.push(t('component.upload.maxWidth', [imageSize.maxWidth]));
    }
    if (imageSize.minWidth) {
      helpTexts.push(t('component.upload.minWidth', [imageSize.minWidth]));
    }
    if (imageSize.maxHeight) {
      helpTexts.push(t('component.upload.maxHeight', [imageSize.maxHeight]));
    }
    if (imageSize.minHeight) {
      helpTexts.push(t('component.upload.minHeight', [imageSize.minHeight]));
    }
    return helpTexts.join('，');
  });
  return { getAccept, getStringAccept, getHelpText };
}
