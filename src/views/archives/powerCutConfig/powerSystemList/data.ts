import { createVNode } from 'vue';
import { cloneDeep } from 'lodash-es';
import type { FormSchema } from '/@/components/Form';
import type { BasicColumn } from '/@/components/Table';
import { uploadDevicesPhotoApi } from '/@/api/info/devices';
import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { useGlobSetting } from '/@/hooks/setting';

const { t } = useI18n();
const { getToken: token, getDevicesList } = useUserStoreWithOut();
const { apiUrl } = useGlobSetting();
const devicesOptions = cloneDeep(getDevicesList);

devicesOptions?.forEach((v) => {
  v.name = (v.processNo || '') + v.name;
});

export const schemas: FormSchema[] = [
  {
    field: 'pageNo',
    label: '当前页',
    component: 'InputNumber',
    defaultValue: 1,
    show: false,
  },
  {
    field: 'pageSize',
    label: '每页条数',
    component: 'InputNumber',
    defaultValue: 10,
    show: false,
  },
  {
    field: 'globalName',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '设备/图片名称',
    },
  },
];

export const columns: BasicColumn[] = [
  {
    title: '图片名称',
    dataIndex: 'images',
    slots: { customRender: 'images' },
  },
  {
    title: '设备',
    dataIndex: 'deviceProcessNo',
    customRender: ({ record }) => {
      return `${record.deviceProcessNo} ${record.deviceName}`;
    },
  },
];

export const editSchemas: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    label: 'ID',
    defaultValue: '',
    show: false,
  },
  {
    field: 'photoName',
    component: 'Input',
    label: '显示名称',
    required: true,
  },
  {
    field: 'deviceId',
    component: 'Select',
    label: '设备',
    required: true,
    componentProps: {
      options: devicesOptions || [],
      fieldNames: {
        label: 'name',
        value: 'id',
      },
    },
  },
  {
    field: 'photo',
    component: 'Upload',
    label: '上传图片',
    colProps: {
      span: 8,
    },
    rules: [{ required: true, message: '请选择上传文件' }],
    componentProps: {
      api: uploadDevicesPhotoApi,
      maxNumber: 1,
      maxSize: 10,
      accept: ['images/*'],
      previewTableColumns: [
        {
          dataIndex: 'url',
          title: t('component.upload.legend'),
          width: 100,
          customRender: ({ record }) => {
            return createVNode('img', {
              src: `${apiUrl}/info/files/image/${record.fileId}?access_token=${token}`,
            });
          },
        },
        {
          dataIndex: 'name',
          title: t('component.upload.fileName'),
        },
      ],
    },
  },
];
