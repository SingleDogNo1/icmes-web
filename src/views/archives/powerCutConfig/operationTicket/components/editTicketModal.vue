<template>
  <BasicModal
    :loading="loading"
    v-bind="$attrs"
    :title="`操作票${editType === 'create' ? '新建' : '编辑'}`"
    :min-height="50"
    @register="register"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { editTicketSchemas as schemas } from '../data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { createHvOperationApi, updateHvOperationApi } from '/@/api/power/hvOperation';
  import {
    HvOperateTemplateAdvanceModel,
    UpdateHvOperationParams,
  } from '/@/api/power/model/hvOperationModel';
  import { error } from '/@/utils/log';

  const { createMessage } = useMessage();

  const emit = defineEmits(['done']);

  const loading = ref<boolean>(false);
  const editType = ref<'create' | 'edit' | ''>('');
  const editId = ref<number>();

  const [registerForm, { getFieldsValue, setFieldsValue, validate, resetFields, updateSchema }] =
    useForm({
      schemas,
      labelWidth: 100,
      showActionButtonGroup: false,
    });

  const [register, { closeModal }] = useModalInner(async (data: HvOperateTemplateAdvanceModel) => {
    resetFields();
    editType.value = data.id ? 'edit' : 'create';

    if (data.id) {
      editId.value = data.id;
      setFieldsValue({ name: data.name, number: data.number });
      updateSchema([{ field: 'number', componentProps: { disabled: data.id } }]);
    }
  });

  async function handleSubmit() {
    loading.value = true;
    await validate();
    const params = getFieldsValue() as UpdateHvOperationParams;
    try {
      if (editType.value === 'create') {
        await createHvOperationApi(params);
      } else if (editType.value === 'edit') {
        await updateHvOperationApi(editId.value!, params);
      }

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
