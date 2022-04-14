<template>
  <BasicModal
    v-bind="$attrs"
    title="批量配置"
    :min-height="100"
    @register="register"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" inline />
  </BasicModal>
</template>

<script lang="ts">
  export default {
    name: 'BatchSettingModal',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BatchUpdatePowerConfigParam, DevicePowerModel } from '/@/api/info/model/devicesModel';
  import { batchUpdatePowerConfigApi } from '/@/api/info/devices';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();

  const loading = ref<boolean>(false);
  const deviceIds = ref<number[]>([]);

  const emit = defineEmits(['update:config']);
  // 带电类型下拉框
  const powerTypeOptions = [
    {
      value: 5,
      label: '远程高压设备',
    },
    {
      value: 6,
      label: '远程低压设备',
    },
    {
      value: 7,
      label: '远程非常规设备',
    },
    {
      value: 1,
      label: '停送电高压设备',
    },
    {
      value: 2,
      label: '停送电低压设备',
    },
    {
      value: 4,
      label: '非常规设备',
    },
    {
      value: 3,
      label: '不参与停送电设备',
    },
    {
      value: -1,
      label: '未知',
    },
  ];
  // PLC监测类型下拉框
  const plcDetectTypeOptions = [
    {
      value: 0,
      label: '不检测状态信号',
    },
    {
      value: 1,
      label: '只监测运行状态',
    },
    {
      value: 2,
      label: '只监测带电状态',
    },
    {
      value: 4,
      label: '只监测就地状态',
    },
    {
      value: 3,
      label: '监测运行状态+带电状态',
    },
    {
      value: 8,
      label: '监测就地状态+运行状态',
    },
    {
      value: 9,
      label: '监测就地状态+带电状态',
    },
    {
      value: 7,
      label: '监测运行状态+带电状态+就地状态',
    },
    {
      value: 5,
      label: '参与停送电流程，无电工配电操作',
    },
    {
      value: 6,
      label: '不参与停送电流程',
    },
    {
      value: -1,
      label: '未知',
    },
  ];

  const [register, { closeModal }] = useModalInner((data) => {
    data && onDataReceive(data);
    deviceIds.value = data.deviceIds;
  });

  const [registerForm, { getFieldsValue, setFieldsValue }] = useForm({
    schemas: [
      {
        field: 'powerType',
        label: '带电类型',
        component: 'Select',
        componentProps: {
          options: powerTypeOptions,
          getPopupContainer: () => document.body,
        },
      },
      {
        field: 'plcDetectType',
        label: 'PLC监测类型',
        component: 'Select',
        componentProps: {
          options: plcDetectTypeOptions,
          getPopupContainer: () => document.body,
        },
      },
    ],
    labelWidth: 120,
    showActionButtonGroup: false,
  });

  function onDataReceive(data: DevicePowerModel) {
    setFieldsValue({
      powerType: data.powerType ?? '',
      plcDetectType: data.plcDetectType ?? '',
    });
  }

  async function handleSubmit() {
    loading.value = true;
    const values = getFieldsValue() as BatchUpdatePowerConfigParam;
    values.deviceIds = deviceIds.value;
    try {
      await batchUpdatePowerConfigApi(values as BatchUpdatePowerConfigParam);
      createMessage.success('批量配置成功');
      closeModal();
      emit('update:config');
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }
</script>

<style lang="less" scoped>
  .batch-setting-modal {
    color: red;
  }
</style>
