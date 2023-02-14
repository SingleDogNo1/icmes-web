import { FormSchema } from '/@/components/Form';
import { useI18n } from '/@/hooks/web/useI18n';
import { useUserState } from '/@/hooks/web/useUserState';
import { getDevicesCategoryListApi } from '/@/api/info/devicesCategory';
import { getLocationListApi } from '/@/api/info/location';
import type { BasicColumn } from '/@/components/Table';

const { getDictOptions } = useUserState();
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
    defaultValue: 'processNo',
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
    label: '设备种类',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      placeholder: t('common.chooseText'),
      options: getDictOptions('DEVICE_TYPE'),
    },
  },
  {
    field: 'category',
    label: '设备类型',
    component: 'ApiSelect',
    colProps: { span: 6 },
    componentProps: {
      showSearch: true,
      api: getDevicesCategoryListApi,
      params: { isPrimary: null },
      resultField: 'items',
      labelField: 'name',
      valueField: 'id',
      immediate: true,
      optionFilterProp: 'label',
    },
  },
  {
    field: 'locationId',
    label: '设备位置',
    component: 'ApiTreeSelect',
    colProps: { span: 6 },
    componentProps: {
      mode: 'multiple',
      treeNodeFilterProp: 'name',
      treeCheckable: true,
      api: getLocationListApi,
      resultField: 'items',
      labelField: 'name',
      valueField: 'id',
      fieldNames: {
        label: 'name',
        value: 'id',
      },
      immediate: true,
    },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      placeholder: t('common.chooseText'),
      options: getDictOptions('DEVICE_STATUS'),
    },
  },
  {
    field: 'globalName',
    label: '',
    component: 'Input',
    colProps: { span: 6 },
    componentProps: {
      maxlength: 20,
      placeholder: '编号/编码/名称/型号/规格/出厂',
    },
  },
];

export const columns: BasicColumn[] = [
  {
    title: '设备名称',
    dataIndex: 'name',
    fixed: 'left',
    minWidth: 160,
    slots: { customRender: 'deviceName' },
  },
  {
    title: '设备编号',
    dataIndex: 'processNo',
  },
  {
    title: '唯一编码',
    dataIndex: 'code',
  },
  {
    title: '位置',
    dataIndex: 'location',
    slots: { customRender: 'location' },
  },
  {
    title: '状态',
    dataIndex: 'status',
    slots: { customRender: 'status' },
  },
  {
    title: '种类',
    dataIndex: 'deviceType',
    slots: { customRender: 'deviceType' },
  },
  {
    title: '附属设备数',
    dataIndex: 'appurtenanceCount',
  },
  {
    title: '型号',
    dataIndex: 'model',
  },
  {
    title: '设备类型',
    dataIndex: 'categoryName',
  },
  {
    title: '规格',
    dataIndex: 'specDataFullName',
    minWidth: 190,
    slots: { customRender: 'specDataFullName' },
  },
];
