import { FormSchema } from '/@/components/Form';
import { useUserState } from '/@/hooks/web/useUserState';

const { getDictOptions } = useUserState();
const powerBusinessNodeOptions = getDictOptions('POWER_BUSINESS_NODE');

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
    field: 'powerBusinessNode',
    label: '业务节点',
    component: 'Select',
    labelWidth: '5em',
    componentProps: {
      style: { width: '120px' },
      placeholder: '请选择',
      options: powerBusinessNodeOptions,
    },
  },
];
