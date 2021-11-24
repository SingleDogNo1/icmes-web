import { FormSchema } from '/@/components/Form/index';
import { getPowerCutConfigList } from '/@/api/powerFailure/basic';

export const schemas: FormSchema[] = [
  {
    field: 'date',
    component: 'RangePicker',
    label: '日期',
    labelWidth: 60,
    colProps: {
      span: 6,
    },
  },
  {
    field: 'type',
    component: 'ApiSelect',
    label: '停电类型',
    colProps: {
      span: 4,
    },
    componentProps: {
      // more details see /src/components/Form/src/components/ApiSelect.vue
      api: getPowerCutConfigList,
      params: {
        ascending: false,
        onlyNeedUse: false,
        orderBy: '',
        pageSize: 0,
        pageNo: 1,
      },
      resultField: 'items',
      // use name as label
      labelField: 'name',
      // use id as value
      valueField: 'workFlowCode',
      // not request untill to select
      immediate: false,
      onChange: (e) => {
        console.log('selected:', e);
      },
      // atfer request callback
      onOptionsChange: (options) => {
        console.log('get options', options.length, options);
      },
    },
  },
  {
    field: 'department',
    component: 'Select',
    label: '部门',
    colProps: {
      span: 4,
    },
  },
  {
    field: 'status',
    component: 'Select',
    label: '状态',
    colProps: {
      span: 4,
    },
  },
  {
    field: 'type',
    component: 'Select',
    label: ' ',
    labelWidth: 60,
    colProps: {
      span: 4,
    },
  },
  {
    field: 'field5',
    component: 'CheckboxGroup',
    label: ' ',
    labelWidth: 60,
    // colProps: {
    //   span: 8,
    // },
    componentProps: {
      options: [
        {
          label: '高压设备',
          value: '1',
        },
      ],
    },
  },
];
