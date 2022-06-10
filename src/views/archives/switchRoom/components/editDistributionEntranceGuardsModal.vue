<template>
  <BasicModal
    :loading="loading"
    v-bind="$attrs"
    :title="`${editType === 'create' ? '新建' : '编辑'}配电柜`"
    @register="registerModal"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm"
  /></BasicModal>
</template>

<script lang="ts">
  export default {
    name: 'EditDistributionEntranceGuardsModal',
  };
</script>

<script lang="ts" setup>
  import { ref, Ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { accessControlSchemas as schemas } from '../data';
  import { EditDistributionEntranceGuardsParam } from '/@/api/info/model/distributionroomModel';
  import {
    createDistributionEntranceGuardsApi,
    editDistributionEntranceGuardsApi,
  } from '/@/api/info/distributionroom';
  import { useMessage } from '/@/hooks/web/useMessage';

  const loading = ref(false);
  const editType: Ref<'create' | 'edit' | ''> = ref('');

  const emit = defineEmits(['done']);

  const { createMessage } = useMessage();

  const [registerModal, { closeModal }] = useModalInner(
    (data: EditDistributionEntranceGuardsParam & { type: string }) => {
      editType.value = data.type === 'edit' ? 'edit' : 'create';

      setFieldsValue({
        id: data.id,
        description: data.description,
        entranceGardSystemId: data.entranceGardSystemId,
        roomId: data.roomId,
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
        await createDistributionEntranceGuardsApi(values);
      } else {
        await editDistributionEntranceGuardsApi(values);
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
