import { getCamerasListApi, getMoreCriterionDevicesListApi } from '/@/api/info/devices';
import type { FormSchema } from '/@/components/Form';
import type { BasicColumn } from '/@/components/Table';

/** 配电室table */
export const distributionRoomColumns: BasicColumn[] = [
  { title: '配电室编号', dataIndex: 'code' },
  { title: '配电室名称', dataIndex: 'name' },
];

/** 配电柜table */
export const distributionCabinetColumns: BasicColumn[] = [
  { title: '配电室编号', dataIndex: 'code' },
  { title: '设备', dataIndex: 'devices', slots: { customRender: 'devices' } },
];

/** 门禁table */
export const accessControlColumns: BasicColumn[] = [
  { title: '门禁系统ID', dataIndex: 'entranceGardSystemId' },
  { title: '位置描述', dataIndex: 'description' },
];

/** 配电室弹窗Form */
export const distributionRoomSchemas: FormSchema[] = [
  {
    field: 'code',
    component: 'Input',
    label: '配电室编号',
    defaultValue: '',
    rules: [{ required: true }],
    componentProps: {
      maxlength: 10,
    },
  },
  {
    field: 'name',
    component: 'Input',
    label: '配电室名称',
    defaultValue: '',
    rules: [{ required: true }],
    componentProps: {
      maxlength: 25,
    },
  },
  {
    field: 'id',
    label: 'Id',
    component: 'Input',
    show: false,
  },
  {
    field: 'versionTag',
    label: '数据版本',
    component: 'Input',
    defaultValue: null,
    show: false,
  },
];

/** 配电柜弹窗Form */
export const distributionCabinetSchemas: FormSchema[] = [
  {
    field: 'code',
    component: 'Input',
    label: '配电柜编号',
    defaultValue: '',
    rules: [{ required: true }],
    componentProps: {
      maxlength: 10,
    },
  },
  {
    field: 'cameraId',
    component: 'ApiSelect',
    label: '关联摄像头',
    componentProps: {
      api: getCamerasListApi,
      params: {
        ascending: true,
        orderBy: '',
        pageNo: 0,
        pageSize: 0,
      },
      resultField: 'items',
      labelField: 'cameraName',
      valueField: 'id',
      immediate: true,
    },
  },
  {
    field: 'id',
    label: 'Id',
    component: 'Input',
    show: false,
  },
  {
    field: 'roomId',
    label: '配电室标Id',
    component: 'Input',
    show: false,
  },
  {
    field: 'versionTag',
    label: '数据版本',
    component: 'Input',
    defaultValue: null,
    show: false,
  },
];

/** 门禁弹窗Form */
export const accessControlSchemas: FormSchema[] = [
  {
    field: 'entranceGardSystemId',
    component: 'Input',
    label: '门禁系统ID',
    defaultValue: '',
    rules: [{ required: true }],
  },
  {
    field: 'description',
    component: 'Input',
    label: '位置描述',
    defaultValue: '',
    rules: [{ required: true }],
    componentProps: {
      maxlength: 5,
    },
  },
  {
    field: 'id',
    label: 'Id',
    component: 'Input',
    show: false,
  },
  {
    field: 'roomId',
    label: '配电室标Id',
    component: 'Input',
    show: false,
  },
];

/** 配置设备弹窗Form */
export const settingDeviceSchemas: FormSchema[] = [
  {
    field: 'id',
    label: 'Id',
    component: 'Input',
    show: false,
  },
  {
    field: 'deviceIds',
    component: 'ApiSelect',
    label: '设备',
    required: true,
    componentProps: {
      mode: 'multiple',
      optionFilterProp: 'label',
      showSearch: true,
      api: getMoreCriterionDevicesListApi,
      params: {
        ascending: true,
        globalName: '',
        orderBy: 'ProcessNo',
        organizationIds: [],
        pageNo: 0,
        pageSize: 0,
      },
      resultField: 'items',
      labelField: 'name',
      valueField: 'id',
      immediate: true,
      onOptionsReady: (options) => {
        options.forEach((v) => {
          v.name = (v.processNo || v.code) + ' ' + v.name;
        });
      },
    },
  },
];
