<template>
  <BasicModal
    width="800px"
    :title="t('component.upload.upload')"
    :okText="t('component.upload.save')"
    v-bind="$attrs"
    @register="register"
    @ok="handleOk"
    :closeFunc="handleCloseFunc"
    :maskClosable="false"
    :keyboard="false"
    class="upload-modal"
    :okButtonProps="getOkButtonProps"
    :cancelButtonProps="{ disabled: isUploadingRef }"
  >
    <template #centerFooter>
      <a-button
        @click="handleStartUpload"
        color="success"
        :disabled="!getIsSelectFile"
        :loading="isUploadingRef"
      >
        {{ getUploadBtnText }}
      </a-button>
    </template>

    <div class="upload-modal-toolbar">
      <Alert :message="getHelpText" type="info" banner class="upload-modal-toolbar__text" />

      <Upload
        :accept="getStringAccept"
        :multiple="multiple"
        :before-upload="beforeUpload"
        :show-upload-list="false"
        name="files"
        class="upload-modal-toolbar__btn"
      >
        <a-button type="primary">
          {{ t('component.upload.choose') }}
        </a-button>
      </Upload>
    </div>
    <FileList :dataSource="fileListRef" :columns="columns" :actionColumn="actionColumn" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, toRefs, unref, computed, PropType } from 'vue';
  import { Upload, Alert } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useUploadType } from './useUpload';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { FileItem, UploadResultStatus } from './typing';
  import { basicProps } from './props';
  import { createTableColumns, createActionColumn } from './data';
  import { checkImgType, getBase64WithFile } from './helper';
  import { buildUUID } from '/@/utils/uuid';
  import { isFunction } from '/@/utils/is';
  import { warn } from '/@/utils/log';
  import FileList from './FileList.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  export default defineComponent({
    components: { BasicModal, Upload, Alert, FileList },
    props: {
      ...basicProps,
      previewFileList: {
        type: Array as PropType<Record<string, any>[]>,
        default: () => [],
      },
    },
    emits: ['change', 'register', 'delete'],
    setup(props, { emit }) {
      const state = reactive<{ fileList: FileItem[] }>({
        fileList: [],
      });

      //   是否正在上传
      const isUploadingRef = ref(false);
      const fileListRef = ref<FileItem[]>([]);
      const { accept, helpText, maxNumber, maxSize, imageSize } = toRefs(props);

      const { t } = useI18n();
      const [register, { closeModal }] = useModalInner();

      const { getStringAccept, getHelpText } = useUploadType({
        acceptRef: accept,
        helpTextRef: helpText,
        maxNumberRef: maxNumber,
        maxSizeRef: maxSize,
        imageSizeRef: imageSize,
      });

      const { createMessage } = useMessage();

      const getIsSelectFile = computed(() => {
        return (
          fileListRef.value.length > 0 &&
          !fileListRef.value.every((item) => item.status === UploadResultStatus.SUCCESS)
        );
      });

      const getOkButtonProps = computed(() => {
        const someSuccess = fileListRef.value.some(
          (item) => item.status === UploadResultStatus.SUCCESS,
        );
        return {
          disabled: isUploadingRef.value || fileListRef.value.length === 0 || !someSuccess,
        };
      });

      const getUploadBtnText = computed(() => {
        const someError = fileListRef.value.some(
          (item) => item.status === UploadResultStatus.ERROR,
        );
        return isUploadingRef.value
          ? t('component.upload.uploading')
          : someError
          ? t('component.upload.reUploadFailed')
          : t('component.upload.startUpload');
      });

      function checkImageSize(file: File, imageSize) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function ({ target }) {
            const image = new Image();
            image.src = target?.result as string;
            image.onload = function () {
              const { width, height } = image;
              const keys = Object.keys(imageSize);
              console.log('width, height :>> ', width, height, imageSize, keys);
              if (keys.length === 1) {
                if (imageSize.minWidth && imageSize.minWidth >= width) {
                  resolve(void 0);
                } else if (imageSize.maxWidth && imageSize.maxWidth <= width) {
                  resolve(void 0);
                } else if (imageSize.minHeight && imageSize.minHeight >= height) {
                  resolve(void 0);
                } else if (imageSize.maxHeight && imageSize.maxHeight <= height) {
                  resolve(void 0);
                } else {
                  resolve(void 0);
                }
              } else if (keys.length === 2) {
                if (
                  imageSize.minWidth &&
                  imageSize.minHeight &&
                  imageSize.minWidth <= width &&
                  imageSize.minHeight <= height
                ) {
                  resolve(void 0);
                } else if (
                  imageSize.minWidth &&
                  imageSize.maxHeight &&
                  imageSize.minWidth <= width &&
                  imageSize.maxHeight >= height
                ) {
                  resolve(void 0);
                } else if (
                  imageSize.maxWidth &&
                  imageSize.minHeight &&
                  imageSize.maxWidth >= width &&
                  imageSize.minHeight <= height
                ) {
                  resolve(void 0);
                } else if (
                  imageSize.maxWidth &&
                  imageSize.maxHeight &&
                  imageSize.maxWidth >= width &&
                  imageSize.maxHeight >= height
                ) {
                  resolve(void 0);
                } else {
                  const helpTexts: string[] = [];
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
                  reject('上传图片要求' + helpTexts.join('，'));
                }
              }
            };
          };
        });
      }

      function buildImagesList(file: File, size: number, name: string) {
        const commonItem = {
          uuid: buildUUID(),
          file,
          size,
          name,
          percent: 0,
          type: name.split('.').pop(),
        };

        // 生成图片缩略图
        if (checkImgType(file)) {
          getBase64WithFile(file).then(({ result: thumbUrl }) => {
            fileListRef.value = [
              ...unref(fileListRef),
              {
                thumbUrl,
                ...commonItem,
              },
            ];
          });
        } else {
          fileListRef.value = [...unref(fileListRef), commonItem];
        }
        return false;
      }

      // 上传前校验
      function beforeUpload(file: File) {
        const { size, name } = file;
        const { maxSize, imageSize } = props;
        // 设置最大值，则判断
        if (maxSize && file.size / 1024 / 1024 >= maxSize) {
          createMessage.error(t('component.upload.maxSizeMultiple', [maxSize]));
          return false;
        }

        if (imageSize) {
          checkImageSize(file, imageSize)
            .then(() => {
              buildImagesList(file, size, name);
            })
            .catch((error) => {
              createMessage.error(error);
            });
        } else {
          buildImagesList(file, size, name);
        }
      }

      // 删除
      function handleRemove(record: FileItem) {
        const index = fileListRef.value.findIndex((item) => item.uuid === record.uuid);
        index !== -1 && fileListRef.value.splice(index, 1);
        emit('delete', record);
      }

      async function uploadApiByItem(item: FileItem) {
        const { api } = props;
        if (!api || !isFunction(api)) {
          return warn('upload api must exist and be a function');
        }
        try {
          const formData = new FormData();
          formData.append('files', item.file);
          item.status = UploadResultStatus.UPLOADING;
          const data = await props.api?.(
            formData,
            function onUploadProgress(progressEvent: ProgressEvent) {
              const complete = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
              item.percent = complete;
            },
          );
          item.status = UploadResultStatus.SUCCESS;
          item.responseData = { ...data, ...item };
          return {
            success: true,
            error: null,
          };
        } catch (e) {
          console.log(e);
          item.status = UploadResultStatus.ERROR;
          return {
            success: false,
            error: e,
          };
        }
      }

      // 点击开始上传
      async function handleStartUpload() {
        const { maxNumber } = props;
        if ((fileListRef.value.length + props.previewFileList?.length ?? 0) > maxNumber) {
          return createMessage.warning(t('component.upload.maxNumber', [maxNumber]));
        }

        console.log('fileListRef :>> ', fileListRef.value);
        try {
          isUploadingRef.value = true;
          // 只上传不是成功状态的
          const uploadFileList =
            fileListRef.value.filter((item) => item.status !== UploadResultStatus.SUCCESS) || [];
          const data = await Promise.all(
            uploadFileList.map((item) => {
              return uploadApiByItem(item);
            }),
          );

          // fileListRef.value = data.reduce((res, pre) => {
          //   res.push(pre.file);
          //   return res;
          // }, []);
          isUploadingRef.value = false;

          // 生产环境:抛出错误
          const errorList = data.filter((item: any) => !item.success);
          if (errorList.length > 0) throw errorList;
        } catch (e) {
          isUploadingRef.value = false;
          throw e;
        }
      }

      //   点击保存
      function handleOk() {
        const { maxNumber } = props;

        if (fileListRef.value.length > maxNumber) {
          return createMessage.warning(t('component.upload.maxNumber', [maxNumber]));
        }
        if (isUploadingRef.value) {
          return createMessage.warning(t('component.upload.saveWarn'));
        }
        const fileList: Record<string, any>[] = [];

        console.log('fileListRef :>> ', fileListRef.value);
        for (const item of fileListRef.value) {
          const { status, responseData } = item;
          if (status === UploadResultStatus.SUCCESS && responseData) {
            fileList.push(responseData);
          }
        }
        // 存在一个上传成功的即可保存
        if (fileList.length <= 0) {
          return createMessage.warning(t('component.upload.saveError'));
        }

        console.log('fileList :>> ', fileList);
        fileListRef.value = [];
        closeModal();
        emit('change', fileList);
      }

      // 点击关闭：则所有操作不保存，包括上传的
      async function handleCloseFunc() {
        if (!isUploadingRef.value) {
          fileListRef.value = [];
          return true;
        } else {
          createMessage.warning(t('component.upload.uploadWait'));
          return false;
        }
      }

      return {
        columns: createTableColumns() as any[],
        actionColumn: createActionColumn(handleRemove) as any,
        register,
        closeModal,
        getHelpText,
        getStringAccept,
        getOkButtonProps,
        beforeUpload,
        // registerTable,
        fileListRef,
        state,
        isUploadingRef,
        handleStartUpload,
        handleOk,
        handleCloseFunc,
        getIsSelectFile,
        getUploadBtnText,
        t,
      };
    },
  });
</script>
<style lang="less">
  .upload-modal {
    .ant-upload-list {
      display: none;
    }

    .ant-table-wrapper .ant-spin-nested-loading {
      padding: 0;
    }

    &-toolbar {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      &__btn {
        margin-left: 8px;
        text-align: right;
        flex: 1;
      }
    }
  }
</style>
