<template>
  <BasicModal
    :loading="loading"
    v-bind="$attrs"
    :title="`${editType === 'create' ? '新建' : '编辑'}配电柜`"
    @register="registerModal"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" /></BasicModal
></template>

<script lang="ts">
  export default {
    name: 'EditDistributionCabinetModal',
  };
</script>

<script lang="ts" setup>
  import { ref, Ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { distributionCabinetSchemas as schemas } from '../data';
  import { EditDistributionCabinetsParam } from '/@/api/info/model/distributionroomModel';
  import {
    createDistributionCabinetsApi,
    editDistributionCabinetsApi,
  } from '/@/api/info/distributionroom';
  import { useMessage } from '/@/hooks/web/useMessage';

  const loading = ref(false);
  const editType: Ref<'create' | 'edit' | ''> = ref('');

  const emit = defineEmits(['done']);

  const { createMessage } = useMessage();

  const [registerModal, { closeModal }] = useModalInner(
    (data: EditDistributionCabinetsParam & { type: string }) => {
      editType.value = data.type === 'edit' ? 'edit' : 'create';

      setFieldsValue({
        id: data.id,
        cameraId: data.cameraId,
        code: data.code,
        roomId: data.roomId,
        versionTag: data.versionTag,
      });
    },
  );

  const [registerForm, { getFieldsValue, setFieldsValue, validate }] = useForm({
    schemas,
    labelWidth: 120,
    showActionButtonGroup: false,
  });

  async function handleSubmit() {
    await validate();
    try {
      loading.value = true;
      const values = getFieldsValue();
      if (editType.value === 'create') {
        await createDistributionCabinetsApi(values);
      } else {
        await editDistributionCabinetsApi(values);
      }
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
