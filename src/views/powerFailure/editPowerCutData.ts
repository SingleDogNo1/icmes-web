import { ref } from 'vue';
import { dateUtil } from '/@/utils/dateUtil';
import type { FormSchema } from '/@/components/Form/index';
import { getPowerCutConfigListApi } from '/@/api/info/powerCutConfig';
import { PowerCutConfigExtendEntity } from '/@/api/info/model/powerCutConfigModel';
import { DevicePowerTypesEnum, DevicePowerTypeCodesEnum } from '/@/enums/powerCutEnum';
import { getPowerCutDevicesListApi } from '/@/api/info/devices';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

const powerCutTypeCodeMap = ref(); // 保存 { 停送电类型: 停送电类型编码 } 映射关系

// 数组, 至多包含两个值分别为当前选中和上一次选中的 option(类似 watch 方法的 oldVal && newVal, 用于比较类型切换时的状态)
const typeWatcher = ref<Recordable[]>([]);
const highVoltageDevices = ref([]); // 主设备中的高压设备

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
    rules: [
      {
        required: true,
        validator: async (_, value) => {
          if (!value) {
            return Promise.reject('请选择停送电类型');
          } else {
            return Promise.resolve();
          }
        },
        trigger: 'change',
      },
    ],
    componentProps: ({ formModel, formActionType }) => {
      return {
        api: getPowerCutConfigListApi,
        params: {
          ascending: false,
          onlyNeedUse: false,
          orderBy: '',
          pageSize: 0,
          pageNo: 1,
        },
        resultField: 'items',
        labelField: 'name',
        valueField: 'workFlowCode',
        immediate: true,
        onOptionsChange: (list) => {
          // 将停送电类型编码处理成 map 保存下来, 切换高低压设备时作为凭据
          powerCutTypeCodeMap.value = list.reduce((res, pre) => {
            res[pre.value] = pre.powerCutType;
            return res;
          }, {});
        },
        onChange: async (data, option: PowerCutConfigExtendEntity) => {
          // 记录类型切换的数据监听
          typeWatcher.value.push(option);
          if (typeWatcher.value.length > 2) {
            typeWatcher.value.shift();
          }
          console.log('data :>> ', typeWatcher.value, option, highVoltageDevices.value);
          const { updateSchema } = formActionType;

          let powerTypes: number[] = [];

          switch (option.powerCutType) {
            case DevicePowerTypesEnum['HIGH_VOLTAGE']:
              powerTypes = [
                DevicePowerTypeCodesEnum['HIGH_VOLTAGE'],
                DevicePowerTypeCodesEnum['LOW_VOLTAGE'],
                DevicePowerTypeCodesEnum['REMOTE_HIGH_VOLTAGE'],
                DevicePowerTypeCodesEnum['REMOTE_LOW_VOLTAGE'],
              ];
              break;
            case DevicePowerTypesEnum['LOW_VOLTAGE']:
              powerTypes = [
                DevicePowerTypeCodesEnum['LOW_VOLTAGE'],
                DevicePowerTypeCodesEnum['REMOTE_LOW_VOLTAGE'],
              ];
              break;
            case DevicePowerTypesEnum['SPECIAL_VOLTAGE']:
              powerTypes = [
                DevicePowerTypeCodesEnum['UNCONVENTIONAL_DEVICE'],
                DevicePowerTypeCodesEnum['REMOTE_UNCONVENTIONAL_DEVICE'],
              ];
              break;
          }

          /*
            option.powerCutType === 2  当前选中低压
            typeWatcher.value.length === 1  表示第一次切换停送电类型
            typeWatcher.value.length === 2 至少切换过两次停送电类型, 数组第一位为前一次选中类型的 option
            ==>
            已存在选择的高压设备时, 未选中状态变低压, 或者高压变低压, 警告
          */
          if (
            highVoltageDevices.value.length &&
            ((option.powerCutType === DevicePowerTypesEnum['LOW_VOLTAGE'] &&
              typeWatcher.value.length === 1) ||
              (option.powerCutType === DevicePowerTypesEnum['LOW_VOLTAGE'] &&
                typeWatcher.value.length === 2 &&
                typeWatcher.value[0].powerCutType === DevicePowerTypesEnum['HIGH_VOLTAGE']))
          ) {
            createConfirm({
              title: '当前所选设备中含有高压设备，选择低压停电类型时会删除高压设备，确认是否更改？',
              iconType: 'warning',
              onOk() {
                // 重新获取主设备
                updateSchema({
                  field: 'mainDeviceIds',
                  componentProps: {
                    params: {
                      needTree: false,
                      orderBy: 'processNo',
                      pageSize: 0,
                      powerTypes: powerTypes,
                    },
                  },
                });
              },
              onCancel() {
                formModel.type = typeWatcher.value.length > 1 ? typeWatcher.value[0].value : null;
              },
            });
          }

          /*
            data.startsWith('ELEC_SP')  类型为特殊停送电类型
            option.powerCutType === 3  当前选中特殊停送电
            typeWatcher.value.length === 2 至少切换过两次停送电类型, 数组第一位为前一次选中类型的 option
            ==>
            已选中设备的条件下, 高压或低压变为特殊停送电; 或者特殊停送电变为高压或低压, 警告
          */
          const selectedDevices = [
            ...(formModel.mainDeviceIds ?? []),
            ...(formModel.assDeviceIds ?? []),
            ...(formModel.irregularDeviceIds ?? []),
          ];
          if (
            (selectedDevices?.length &&
              data.startsWith('ELEC_SP') &&
              option.powerCutType === 3 &&
              typeWatcher.value.length === 2 &&
              [1, 2].includes(typeWatcher.value[0].powerCutType)) ||
            (formModel.content &&
              !data.startsWith('ELEC_SP') &&
              [1, 2].includes(option.powerCutType) &&
              typeWatcher.value.length === 2 &&
              typeWatcher.value[0].powerCutType === 3)
          ) {
            createConfirm({
              title: '更换停电类型, 所选设备或输入内容会丢失,是否确认更换?',
              iconType: 'warning',
              onOk() {
                console.log('ok :>> ');
              },
              onCancel() {
                formModel.type = typeWatcher.value[0].value;
              },
            });
          }

          if ([1, 2].includes(option.powerCutType)) {
            updateSchema({
              field: 'mainDeviceIds',
              componentProps: {
                params: {
                  needTree: false,
                  orderBy: 'processNo',
                  pageSize: 0,
                  powerTypes: powerTypes,
                },
              },
            });
          }
        },
      };
    },
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
          const duration = value[1].valueOf() - value[0].valueOf();
          if (!value) {
            return Promise.reject('请输入计划停送电时间');
          } else if (duration === 0) {
            return Promise.reject('停送电时长不能为 0');
          } else {
            return Promise.resolve();
          }
        },
      },
    ],
  },
  {
    field: 'scheduledDuration',
    component: 'Input',
    label: '计划送电时长',
    rules: [
      {
        required: true,
        validator: (_, value) => {
          if (!value) {
            return Promise.reject('请选择开始结束时间');
          } else if (value === 0) {
            return Promise.reject('停送电时长不能为 0');
          } else if (value < 0) {
            return Promise.reject('送电时间不能早于停电时间');
          } else {
            return Promise.resolve();
          }
        },
      },
    ],
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
    show: ({ values }) => {
      if (!values.type) return true;
      return !values.type.includes('ELEC_SP');
    },
    componentProps: {
      mode: 'multiple',
      api: getPowerCutDevicesListApi,
      params: {
        needTree: false,
        orderBy: 'processNo',
        pageSize: 0,
        powerTypes: [
          DevicePowerTypeCodesEnum['HIGH_VOLTAGE'],
          DevicePowerTypeCodesEnum['LOW_VOLTAGE'],
          DevicePowerTypeCodesEnum['REMOTE_HIGH_VOLTAGE'],
          DevicePowerTypeCodesEnum['REMOTE_LOW_VOLTAGE'],
        ],
      },
      resultField: 'items',
      optionLabelProp: 'label',
      onOptionsReady: (list) => {
        // 接口请求完成,结果赋值给 options 列表之前的钩子
        // 重新整合数据
        list.map((item) => {
          item.label = (item.processNo || item.code) + item.name; // option 显示的主标题
          item.subtitle = !item.isPrimary ? `${item.primaryName}/` : ''; // option 显示的标题说明
          item.value = item.id; // select 绑定值

          let text = '';

          switch (item.powerType) {
            case DevicePowerTypeCodesEnum['HIGH_VOLTAGE']:
              text = '高压';
              break;

            case DevicePowerTypeCodesEnum['REMOTE_HIGH_VOLTAGE']:
              text = '高压,远程';
              break;

            case DevicePowerTypeCodesEnum['REMOTE_LOW_VOLTAGE']:
            case DevicePowerTypeCodesEnum['REMOTE_UNCONVENTIONAL_DEVICE']:
              text = '远程';
              break;
          }

          item.powerTypeText = text; // 停送电类型转换为汉字显示
        });
      },
      onChange: (_data, options) => {
        highVoltageDevices.value = options.filter((option) =>
          [
            DevicePowerTypeCodesEnum['HIGH_VOLTAGE'],
            DevicePowerTypeCodesEnum['REMOTE_HIGH_VOLTAGE'],
          ].includes(option.powerType),
        );
      },
    },
  },
  {
    field: 'assDeviceIds',
    component: 'PowerCutDevice',
    label: '停送电关联设备',
    show: ({ values }) => {
      if (!values.type) return true;
      return !values.type.includes('ELEC_SP');
    },
    componentProps: ({ formModel, formActionType }) => {
      console.log('formModel, formActionType :>> ', formModel, formActionType);
      return {
        mode: 'multiple',
        api: getPowerCutDevicesListApi,
        params: {
          needTree: false,
          orderBy: 'processNo',
          pageSize: 0,
          powerTypes: [
            DevicePowerTypeCodesEnum['HIGH_VOLTAGE'],
            DevicePowerTypeCodesEnum['LOW_VOLTAGE'],
            DevicePowerTypeCodesEnum['REMOTE_HIGH_VOLTAGE'],
            DevicePowerTypeCodesEnum['REMOTE_LOW_VOLTAGE'],
          ],
        },
        resultField: 'items',
        optionLabelProp: 'label',
        onOptionsReady: (list) => {
          // 接口请求完成,结果赋值给 options 列表之前的钩子
          // 重新整合数据
          list.map((item) => {
            item.label = (item.processNo || item.code) + item.name; // option 显示的主标题
            item.subtitle = !item.isPrimary ? `${item.primaryName}/` : ''; // option 显示的标题说明
            item.value = item.id; // select 绑定值

            let text = '';

            switch (item.powerType) {
              case DevicePowerTypeCodesEnum['HIGH_VOLTAGE']:
                text = '高压';
                break;

              case DevicePowerTypeCodesEnum['REMOTE_HIGH_VOLTAGE']:
                text = '高压,远程';
                break;

              case DevicePowerTypeCodesEnum['REMOTE_LOW_VOLTAGE']:
              case DevicePowerTypeCodesEnum['REMOTE_UNCONVENTIONAL_DEVICE']:
                text = '远程';
                break;
            }

            item.powerTypeText = text; // 停送电类型转换为汉字显示
          });
        },
      };
    },
  },
  {
    field: 'irregularDeviceIds',
    component: 'PowerCutDevice',
    label: '非常规设备',
    show: ({ values }) => {
      if (!values.type) return true;
      return !values.type.includes('ELEC_SP');
    },
    componentProps: ({ formModel, formActionType }) => {
      console.log('formModel, formActionType :>> ', formModel, formActionType);
      return {
        mode: 'multiple',
        api: getPowerCutDevicesListApi,
        params: {
          needTree: false,
          orderBy: 'processNo',
          pageSize: 0,
          powerTypes: [
            DevicePowerTypeCodesEnum['UNCONVENTIONAL_DEVICE'],
            DevicePowerTypeCodesEnum['REMOTE_UNCONVENTIONAL_DEVICE'],
          ],
        },
        resultField: 'items',
        optionLabelProp: 'label',
        onOptionsReady: (list) => {
          // 接口请求完成,结果赋值给 options 列表之前的钩子
          // 重新整合数据
          list.map((item) => {
            item.label = (item.processNo || item.code) + item.name; // option 显示的主标题
            item.subtitle = !item.isPrimary ? `${item.primaryName}/` : ''; // option 显示的标题说明
            item.value = item.id; // select 绑定值

            const text = [
              DevicePowerTypeCodesEnum['REMOTE_HIGH_VOLTAGE'],
              DevicePowerTypeCodesEnum['REMOTE_LOW_VOLTAGE'],
              DevicePowerTypeCodesEnum['REMOTE_UNCONVENTIONAL_DEVICE'],
            ].includes(item.powerType)
              ? '远程'
              : '';
            item.powerTypeText = text; // 停送电类型转换为汉字显示
          });
        },
      };
    },
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
];
