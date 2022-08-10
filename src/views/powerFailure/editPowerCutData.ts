import { dateUtil } from '/@/utils/dateUtil';
import type { FormSchema } from '/@/components/Form/index';

const range = (start: number, end: number) => {
  const result: number[] = [];

  for (let i = start; i <= end; i++) {
    result.push(i);
  }

  return result;
};

export const editPowerCutSchemas: FormSchema[] = [
  {
    field: 'type',
    component: 'ApiSelect',
    label: '停送电类型',
    itemProps: { validateTrigger: 'blur' },
    required: true,
    slot: 'type',
  },
  {
    field: 'contactUserId',
    component: 'Select',
    required: true,
    label: '停送电联系人',
    slot: 'contactUser',
  },
  {
    field: 'scheduledTimeRange',
    component: 'RangePicker',
    label: '计划停送电时间',
    componentProps: ({ formModel }) => {
      return {
        placeholder: ['请选择开始时间', '请选择结束时间'],
        format: 'YYYY-MM-DD HH:mm',
        showTime: {
          format: 'HH:mm',
          defaultValue: [dateUtil().startOf('minute'), dateUtil().startOf('minute')],
        },
        disabledDate: (current) => current && current < dateUtil().startOf('day'),
        disabledTime: (_, type: 'start' | 'end') => {
          const [currentHour, currentMinute] = [dateUtil().hour(), dateUtil().minute()];
          if (type === 'start') {
            return {
              disabledHours: () => range(0, currentHour - 1),
              disabledMinutes: () => range(0, currentMinute - 1),
            };
          } else {
            return {
              // disabledHours: () => range(0, currentHour - 1),
              // disabledMinutes: () => range(0, currentMinute),
            };
          }
        },
        onOk: (value: any) => {
          const duration = value[1].valueOf() - value[0].valueOf();

          if (duration === 0) return;

          const hours = ~~(duration / 1000 / 60 / 60);

          const minutes = ~~((duration - hours * 60 * 60 * 1000) / 1000 / 60);

          formModel['scheduledDuration'] =
            hours > 0 ? `${hours} 小时 ${minutes} 分钟` : `${minutes} 分钟`;
        },
      };
    },
    rules: [
      {
        required: true,
        validator: (_rule, value) => {
          if (!value) {
            return Promise.reject('请输入计划停送电时间');
          } else {
            const duration = value[1].valueOf() - value[0].valueOf();
            if (duration === 0) {
              return Promise.reject('停送电时长不能为 0');
            } else {
              return Promise.resolve();
            }
          }
        },
      },
    ],
  },
  {
    field: 'scheduledDuration',
    component: 'Input',
    label: '计划送电时长',
    componentProps: {
      placeholder: '',
      disabled: true,
    },
  },
  {
    field: 'mainDeviceIds',
    component: 'PowerCutDevice',
    label: '停送电设备',
    required: true,
    itemProps: { validateTrigger: 'blur' },
    show: ({ values }) => {
      if (!values.type) return true;
      return !values.type.includes('ELEC_SP');
    },
    slot: 'mainDeviceIds',
  },
  {
    field: 'assDeviceIds',
    component: 'PowerCutDevice',
    label: '停送电关联设备',
    itemProps: { validateTrigger: 'blur' },
    show: ({ values }) => {
      if (!values.type) return true;
      return !values.type.includes('ELEC_SP');
    },
    slot: 'assDeviceIds',
  },
  {
    field: 'irregularDeviceIds',
    component: 'PowerCutDevice',
    label: '非常规设备',
    itemProps: { validateTrigger: 'blur' },
    show: ({ values }) => {
      if (!values.type) return true;
      return !values.type.includes('ELEC_SP');
    },
    slot: 'irrDeviceIds',
  },
  {
    field: 'content',
    component: 'InputTextArea',
    label: '停送电内容',
    componentProps: {
      autoSize: {
        minRows: 4,
      },
      maxlength: 100,
      showCount: true,
    },
    show: ({ values }) => {
      if (!values.type) return false;
      return values.type.includes('ELEC_SP');
    },
  },
  {
    field: 'hvFlag',
    component: 'Switch',
    label: '填写操作票',
    componentProps: {
      checkedChildren: '是',
      unCheckedChildren: '否',
    },
    show: ({ values }) => {
      if (!values.type) return false;
      return values.type.includes('ELEC_SP');
    },
  },
  {
    field: 'remark',
    component: 'InputTextArea',
    label: '备注内容',
    componentProps: {
      rows: 4,
      placeholder: '请输入备注内容',
      maxlength: 100,
      showCount: true,
    },
  },
];
