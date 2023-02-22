import { createVNode } from 'vue';
import type { FormSchema } from '/@/components/Form';
import type { BasicColumn } from '/@/components/Table';
import { DeviceCategoryModel } from '/@/api/info/model/devicesCategoryModel';
import { SpecDataResultModel, SpecDataModel } from '/@/api/info/model/specDataModel';
import { uploadDevicesPhotoApi } from '/@/api/info/devices';
import { getSpecDataListApi } from '/@/api/info/specData';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useGlobSetting } from '/@/hooks/setting';
import { Image } from '/@/components/Image';

const { apiUrl } = useGlobSetting();
const { getToken: token } = useUserStoreWithOut();
const { t } = useI18n();

export const schemas: FormSchema[] = [
  {
    field: 'ascending',
    label: '升序',
    component: 'Checkbox',
    required: true,
    defaultValue: true,
    show: false,
  },
  {
    field: 'orderBy',
    label: '排序字段',
    component: 'Input',
    defaultValue: 'code',
    show: false,
  },
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
    field: 'deviceTypeList',
    label: '设备大类',
    component: 'Select',
    componentProps: {
      style: {
        width: '200px',
      },
      options: [
        {
          label: '设备类型',
          value: true,
        },
        {
          label: '附属设备类型',
          value: false,
        },
      ],
    },
  },
  {
    field: 'globalName',
    label: '',
    component: 'Input',
    componentProps: {
      maxlength: 20,
      placeholder: '编号/名称/规格',
    },
  },
];

export const columns: BasicColumn[] = [
  {
    title: '设备名称',
    dataIndex: 'primary',
    fixed: 'left',
    customRender: ({ text }: { text: DeviceCategoryModel['primary'] }) => {
      return text ? '设备类型' : '附属设备类型';
    },
  },
  {
    title: '编号',
    dataIndex: 'code',
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: 'ICON',
    dataIndex: 'icon',
    customRender: ({ text }: { text: DeviceCategoryModel['icon'] }) => {
      return createVNode(Image, {
        src: text ? `${apiUrl}/info/files/image/${text}?access_token=${token}` : '',
        width: 40,
        height: 40,
      });
    },
  },
  {
    title: '种类',
    dataIndex: 'specDataList',
    width: 600,
    customRender: ({ text }: { text: DeviceCategoryModel['specDataList'] }) => {
      const specDataList = text || [];
      return specDataList.reduce((res, pre, index) => {
        if (index === specDataList.length - 1) {
          res += pre.name + (pre.unit || '');
        } else {
          res += pre.name + (pre.unit || '') + '、';
        }
        return res;
      }, '');
    },
  },
];

export const editDeviceSchemas: FormSchema[] = [
  {
    field: 'primary',
    label: '新建',
    component: 'RadioGroup',
    required: true,
    componentProps: {
      options: [
        {
          label: '设备类型',
          value: true,
        },
        {
          label: '附属设备类型',
          value: false,
        },
      ],
    },
  },
  {
    field: 'code',
    label: '编号',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 20,
    },
  },
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 20,
    },
  },
  {
    field: 'icon',
    label: '图标',
    component: 'Upload',
    componentProps: {
      api: uploadDevicesPhotoApi,
      maxNumber: 1,
      maxSize: 5,
      accept: ['images/*'],
      imageSize: {
        minWidth: 40,
        minHeight: 40,
      },
      previewTableColumns: [
        {
          dataIndex: 'url',
          title: t('component.upload.legend'),
          width: 100,
          customRender: ({ record }) => {
            return createVNode(Image, {
              src: `${apiUrl}/info/files/image/${record.fileId}?access_token=${token}`,
              width: 80,
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
  {
    field: 'specDataIds',
    label: '设备参数',
    component: 'ApiSelect',
    componentProps: {
      mode: 'multiple',
      optionFilterProp: 'label',
      showSearch: true,
      api: getSpecDataListApi,
      immediate: true,
      fieldNames: {
        label: 'label',
        value: 'id',
        options: 'specDataList',
      },
      onOptionsReady: (
        options: (SpecDataResultModel & { label: SpecDataResultModel['name'] })[],
      ) => {
        options.forEach((listItem) => {
          listItem.label = listItem.name;
          listItem.specDataList.forEach((specDataItem) => {
            (
              specDataItem as unknown as SpecDataModel & { label: SpecDataModel['name'] }
            ).label = `${specDataItem.name} ${specDataItem.unit || ''}`;
          });
        });
      },
    },
  },
];
