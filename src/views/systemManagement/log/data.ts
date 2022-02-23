import { FormSchema } from '/@/components/Form';
import { useI18n } from '/@/hooks/web/useI18n';
import { dateUtil } from '/@/utils/dateUtil';
import { useUserState } from '/@/hooks/web/useUserState';
import { useUserStoreWithOut } from '/@/store/modules/user';
import type { BasicColumn } from '/@/components/Table';

const userStore = useUserStoreWithOut();
const { getDictOptions } = useUserState();
const { t } = useI18n();

const allAccountTree = userStore.getAllAccountTree;
// 功能模块
const moduleNamesOption = getDictOptions('DT_FUNCTION');
// 操作类型
const operationsOption = getDictOptions('DT_ACTION');
// 终端类型
const terminalsOption = getDictOptions('DT_TERMINAL_TYPE');

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
    defaultValue: '',
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
    field: 'module',
    label: '功能模块',
    component: 'Select',
    defaultValue: '',
    colProps: { span: 6 },
    componentProps: {
      placeholder: t('common.chooseText'),
      options: moduleNamesOption,
    },
  },
  {
    field: 'operate',
    label: '操作类型',
    component: 'Select',
    defaultValue: '',
    colProps: { span: 6 },
    componentProps: {
      placeholder: t('common.chooseText'),
      options: operationsOption,
    },
  },
  {
    field: 'terminalType',
    label: '终端类型',
    component: 'Select',
    defaultValue: '',
    colProps: { span: 6 },
    componentProps: {
      placeholder: t('common.chooseText'),
      options: terminalsOption,
    },
  },
  {
    field: 'globalName',
    label: '关键字搜索',
    component: 'Input',
    defaultValue: '',
    colProps: { span: 6 },
    componentProps: {
      maxlength: 15,
      // placeholder: 'IP地址/日志内容',
      placeholder: t('common.chooseText'),
    },
  },
  {
    field: 'operator',
    label: '操作用户',
    component: 'TreeSelect',
    defaultValue: '',
    colProps: { span: 8 },
    componentProps: {
      showSearch: true,
      maxlength: 15,
      treeData: allAccountTree,
      dropdownStyle: { maxHeight: '400px', overflow: 'auto' },
      placeholder: t('common.chooseText'),
      fieldNames: {
        label: 'name',
        key: 'id',
        value: 'name',
      },
    },
  },
  {
    field: 'timeRange',
    label: '操作时间',
    component: 'RangePicker',
    colProps: { span: 8 },
    componentProps: {
      defaultPickerValue: [],
      format: 'YYYY-MM-DD',
      showTime: {
        defaultValue: [dateUtil().startOf('day'), dateUtil().endOf('day')],
      },
    },
  },
];

export const columns: BasicColumn[] = [
  {
    title: '功能模块',
    dataIndex: 'module',
    slots: { customRender: 'module' },
    fixed: 'left',
    width: 200,
  },
  {
    title: '操作类型',
    dataIndex: 'operate',
    slots: { customRender: 'operate' },
    width: 125,
  },
  {
    title: '日志内容',
    dataIndex: 'content',
    slots: { customRender: 'content' },
  },
  {
    title: '操作用户',
    dataIndex: 'operator',
    width: 120,
  },
  {
    title: '操作时间',
    dataIndex: 'time',
    slots: { customRender: 'time' },
    width: 150,
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    width: 130,
  },
  {
    title: '终端信息',
    dataIndex: 'terminalInfo',
    width: 130,
  },
  {
    title: '终端类型',
    dataIndex: 'terminalType',
    slots: { customRender: 'terminalType' },
    width: 120,
  },
];
