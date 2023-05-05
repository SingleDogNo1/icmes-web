<template>
  <BasicModal
    :loading="loading"
    v-bind="$attrs"
    :title="`${editType === 'create' ? '新建' : '编辑'}配电室`"
    @register="registerModal"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" /></BasicModal
></template>

<script lang="ts">
  export default {
    name: 'EditDistributionRoomModal',
  };
</script>

<script lang="ts" setup>
  import { ref, Ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { EditDistributionRoomParam } from '/@/api/info/model/distributionroomModel';
  import { distributionRoomSchemas as schemas } from '../data';
  import { createDistributionRoomApi, editDistributionRoomApi } from '/@/api/info/distributionroom';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { error } from '/@/utils/log';

  const loading = ref(false);
  const editType: Ref<'create' | 'edit' | ''> = ref('');
  const editId = ref<number>();

  const emit = defineEmits(['done']);

  const { createMessage } = useMessage();

  const [registerModal, { closeModal }] = useModalInner(
    (data: EditDistributionRoomParam & { type: string }) => {
      editType.value = data.type === 'edit' ? 'edit' : 'create';
      editId.value = data.id;

      updateSchema([{ field: 'code', componentProps: { disabled: data.type === 'edit' } }]);

      setFieldsValue({
        id: data.id,
        code: data.code,
        name: data.name,
        versionTag: data.versionTag,
      });
    },
  );

  const [registerForm, { getFieldsValue, setFieldsValue, updateSchema, validate }] = useForm({
    schemas,
    labelWidth: 120,
    showActionButtonGroup: false,
  });

  async function handleSubmit() {
    try {
      loading.value = true;
      await validate();
      const values = getFieldsValue() as EditDistributionRoomParam;
      if (editType.value === 'create') {
        await createDistributionRoomApi(values);
      } else {
        await editDistributionRoomApi(values);
      }
      loading.value = false;
      createMessage.success('保存成功');
      closeModal();
      emit('done');
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }
</script>
