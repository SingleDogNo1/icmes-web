import type { FormSchema } from '/@/components/Form/index';
import type { BasicColumn } from '/@/components/Table';
import { formatToDateTime } from '/@/utils/dateUtil';
import { getOrganizationsListApi } from '/@/api/info/organizations';
import { useUserState } from '/@/hooks/web/useUserState';
const { getDictOptions, getDictMap } = useUserState();

export const schemas: FormSchema[] = [
  {
    field: 'globalName',
    label: '检修对象或项目名称',
    labelWidth: 140,
    component: 'Input',
    defaultValue: '',
    colProps: {
      span: 7,
    },
    componentProps: {
      placeholder: '设备名称/设备编号/项目名称',
      maxlength: 20,
    },
  },
  {
    field: 'orgIdList',
    label: '责任班组',
    component: 'ApiTreeSelect',
    colProps: {
      span: 6,
    },
    componentProps: {
      api: getOrganizationsListApi,
      showSearch: true,
      treeNodeFilterProp: 'name',
      resultField: 'items',
      fieldNames: {
        label: 'name',
        value: 'id',
      },
      params: {
        ascending: true,
        orderBy: 'Code',
        parentId: 0,
      },
    },
  },
  {
    field: 'timeRange',
    component: 'RangePicker',
    label: '日期',
    labelWidth: 60,
    colProps: {
      span: 6,
    },
    componentProps: {
      format: 'YYYY-MM-DD',
    },
  },
  {
    field: 'status',
    component: 'Select',
    label: '状态',
    labelWidth: 60,
    colProps: {
      span: 5,
    },
    defaultValue: '',
    componentProps: {
      options: [...[{ value: '', label: '全部' }], ...getDictOptions('BT_MAINT_ORDER_STATUS')],
    },
  },
  // --------------------- hidden fields ---------------------
  {
    field: 'globalType',
    label: 'globalType',
    component: 'Checkbox',
    show: false,
    defaultValue: ['deviceName', 'processNo', 'projectName'],
  },
  {
    field: 'orderBy',
    label: 'orderBy',
    component: 'Input',
    show: false,
    defaultValue: 'Code',
  },
  {
    field: 'ascending',
    label: 'ascending',
    component: 'Checkbox',
    show: false,
    defaultValue: false,
  },
  {
    field: 'pageSize',
    label: 'pageSize',
    component: 'InputNumber',
    show: false,
    defaultValue: 10,
  },
  {
    field: 'pageNo',
    label: 'pageNo',
    component: 'InputNumber',
    show: false,
    defaultValue: 1,
  },
];

export const columns: BasicColumn[] = [
  {
    title: '检修单编号',
    dataIndex: 'powerCutType',
    slots: { customRender: 'powerCutType' },
  },
  {
    title: '检修对象',
    dataIndex: 'devices',
    slots: { customRender: 'devices' },
  },
  {
    title: '项目名称',
    dataIndex: 'projectName',
  },
  {
    title: '责任班组',
    dataIndex: 'orgFullName',
  },
  {
    title: '施工负责人',
    dataIndex: 'constructionEmployeeName',
  },
  {
    title: '计划开工时间',
    width: 160,
    dataIndex: 'planStartTime',
    customRender: ({ record }) => {
      return record.planStartTime ? formatToDateTime(record.planStartTime) : '';
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: ({ record }) => {
      const statusMap = getDictMap('BT_MAINT_ORDER_STATUS');
      return statusMap[record.status];
    },
  },
];
