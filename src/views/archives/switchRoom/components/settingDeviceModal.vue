<template>
  <BasicModal
    :loading="loading"
    v-bind="$attrs"
    title="配置设备"
    @register="registerModal"
    @ok="handleSubmit"
  >
    <p class="info p-4">
      <span class="mr-6">配电柜编号</span>
      <span>{{ deviceCode }}</span>
    </p>
    <BasicForm @register="registerForm"
  /></BasicModal>
</template>

<script lang="ts">
  export default {
    name: 'SettingDeviceModal',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { settingDeviceSchemas as schemas } from '../data';
  import { EditDistributionCabinetsDevicesParam } from '/@/api/info/model/distributionroomModel';
  import { editDistributionCabinetsDevicesApi } from '/@/api/info/distributionroom';
  import { useMessage } from '/@/hooks/web/useMessage';

  const loading = ref(false);
  const deviceCode = ref<string>('');

  const emit = defineEmits(['done']);

  const { createMessage } = useMessage();

  const [registerModal, { closeModal }] = useModalInner(
    (data: EditDistributionCabinetsDevicesParam & { deviceCode: string }) => {
      deviceCode.value = data.deviceCode;
      setFieldsValue({
        id: data.id,
        deviceIds: data.deviceIds,
      });
    },
  );

  const [registerForm, { getFieldsValue, setFieldsValue, validate }] = useForm({
    schemas,
    labelWidth: 60,
    showActionButtonGroup: false,
  });

  async function handleSubmit() {
    await validate();
    try {
      loading.value = true;
      const values = getFieldsValue();
      await editDistributionCabinetsDevicesApi(values);
      loading.value = false;
      createMessage.success('保存成功');
      closeModal();
      emit('done');
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }
</script>

<style lang="less" scoped>
  .info {
    background: #f7f8fa;
  }
</style>
