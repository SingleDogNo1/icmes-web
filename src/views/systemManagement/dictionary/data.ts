import type { FormSchema } from '/@/components/Form/index';
import type { BasicColumn } from '/@/components/Table/index';
// import { useI18n } from '/@/hooks/web/useI18n';

// const { t } = useI18n();

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
    field: 'globalName',
    label: '关键字搜索',
    component: 'Input',
    defaultValue: '',
    colProps: { span: 6 },
    componentProps: {
      maxlength: 20,
      placeholder: '类型编码/类型名称',
      // placeholder: t('common.chooseText'),
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
