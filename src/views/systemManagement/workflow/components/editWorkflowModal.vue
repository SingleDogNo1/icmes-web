<template>
  <BasicModal
    v-bind="$attrs"
    :title="`${editType === 'create' ? '新建' : '编辑'}工作流`"
    width="400"
    :min-height="80"
    @register="register"
    :loading="loading"
    destroy-on-close
    @ok="handleSubmit"
  >
    <PageWrapper dense fixedHeight>
      <BasicForm @register="registerForm" :show-action-button-group="false" />
    </PageWrapper>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, Ref, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { PageWrapper } from '/@/components/Page';
  import { editWorkflowSchemas } from '../data';
  import {
    WorkFlowModel,
    CreateWorkflowParam,
    EditWorkflowParam,
  } from '/@/api/flow/model/workflowModel';
  import { createWorkflowApi, editWorkflowApi } from '/@/api/flow/workflow';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { error } from '/@/utils/log';

  // const { createMessage } = useMessage();

  const emit = defineEmits(['done']);
  const { createMessage } = useMessage();

  const loading = ref<boolean>(false);
  // 编辑的类型，通过参数中是否存在versionTag，判断是新建还是编辑
  const editType: Ref<'create' | 'edit' | ''> = ref('');

  const editId = ref<Nullable<number>>(null);

  const [registerForm, { getFieldsValue, setFieldsValue, validate, updateSchema }] = useForm({
    labelWidth: 120,
    schemas: editWorkflowSchemas,
    autoSubmitOnEnter: true,
  });

  const [register, { closeModal }] = useModalInner(async (data: WorkFlowModel) => {
    console.log('data :>> ', data);
    setFieldsValue({
      code: data.code,
      name: data.name,
      businessType: data.businessType,
      versionTag: data.versionTag,
    });
    // 如果存在versionTag 字段，是编辑，否则是新建。并且编辑时，code & businessType 选项不可操作
    data.versionTag && (editId.value = data.id);
    editType.value = data.versionTag ? 'edit' : 'create';
    updateSchema({ field: 'code', componentProps: { disabled: Boolean(data.versionTag) } });
    updateSchema({ field: 'businessType', componentProps: { disabled: Boolean(data.versionTag) } });
  });

  async function handleSubmit() {
    await validate();
    const value = getFieldsValue() as CreateWorkflowParam | EditWorkflowParam;
    console.log('value :>> ', value);
    loading.value = true;
    try {
      if (editType.value === 'create') {
        await createWorkflowApi(value as CreateWorkflowParam);
      } else if (editType.value === 'edit') {
        await editWorkflowApi(unref(editId) as number, value as EditWorkflowParam);
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
