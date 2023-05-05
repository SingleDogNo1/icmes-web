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

<script lang="ts" setup name="BatchSettingModal">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BatchUpdatePowerConfigParam, DevicePowerModel } from '/@/api/info/model/devicesModel';
  import { batchUpdatePowerConfigApi } from '/@/api/info/devices';
  import { batchSettingSchemas as schemas } from './data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { error } from '/@/utils/log';

  const { createMessage } = useMessage();

  const loading = ref<boolean>(false);
  const deviceIds = ref<number[]>([]);

  const emit = defineEmits(['update:config']);

  const [register, { closeModal }] = useModalInner((data) => {
    data && onDataReceive(data);
    deviceIds.value = data.deviceIds;
  });

  const [registerForm, { getFieldsValue, setFieldsValue }] = useForm({
    schemas,
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
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }
</script>
