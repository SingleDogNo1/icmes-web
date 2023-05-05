<template>
  <BasicModal
    v-bind="$attrs"
    :title="title"
    width="400"
    :min-height="80"
    @register="register"
    :loading="loading"
    destroy-on-close
    @ok="handleSubmit"
    :close-func="handleCancel"
  >
    <BasicForm @register="registerForm" :show-action-button-group="false" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import {
    WorkflowNodeModel,
    CreateWorkflowNodeParam,
    EditWorkflowNodeParam,
  } from '/@/api/flow/model/workflowModel';
  import { useUserState } from '/@/hooks/web/useUserState';
  import { editWorkflowNodeSchemas } from '../data';
  import { createWorkflowNodeApi, editWorkflowNodeApi } from '/@/api/flow/workflow';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useFormInPopup } from '/@/hooks/component/useFormInPopup';
  import { error } from '/@/utils/log';

  const { saveInitData, validCloseable } = useFormInPopup();
  const { createMessage } = useMessage();
  const emit = defineEmits(['done']);
  const { getDictOptions } = useUserState();
  const loading = ref<boolean>(false);
  // 编辑的类型是新建还是编辑
  const editType = ref<'create' | 'edit' | ''>('');
  const editWorkflowId = ref<Nullable<number>>(null);
  const editWorkflowNodeId = ref<Nullable<number>>(null);
  const title = computed(() => (editType.value === 'create' ? '新建工作流节点' : '编辑工作流节点'));

  const [registerForm, { getFieldsValue, setFieldsValue, validate, updateSchema }] = useForm({
    schemas: editWorkflowNodeSchemas(editType),
    autoSubmitOnEnter: true,
  });

  type Data = {
    // 点击当前行的工作流 ID
    workflowId: number;
    // 点击当前行的业务类型（用来查询对应的数据字典）
    businessType: string;
    // 点击创建节点时，当前工作流中已经存在的节点（异常驳回是需要从现有节点中选择一个回退节点）
    tableList: WorkflowNodeModel[];
  } & Nullable<WorkflowNodeModel>;

  const [register, { closeModal }] = useModalInner(async (data: Data) => {
    const businessOptions = getDictOptions(data.businessType + '_STATUS');
    // 如果存在versionTag 字段，是编辑，否则是新建
    // 且编辑操作时，系统自动执行、节点编码、工作类型 选项不可操作
    editType.value = data?.versionTag ? 'edit' : 'create';
    const isEdit = editType.value === 'edit';
    editWorkflowId.value = data.workflowId;
    editWorkflowNodeId.value = data?.id;

    updateSchema([
      { field: 'isSystemAutoExec', componentProps: { disabled: isEdit } },
      { field: 'code', componentProps: { disabled: isEdit } },
      { field: 'operateSuccessStatus', componentProps: { options: businessOptions } },
      { field: 'operateFailureStatus', componentProps: { options: businessOptions } },
      { field: 'redirectToNodeId', componentProps: { options: data.tableList } },
    ]);

    if (isEdit) {
      // 删除传入参数中的自定义参数，避免表单字段污染
      const formData = cloneDeep(data) as Partial<Data>;
      delete formData.tableList;
      delete formData.workflowId;
      delete formData.businessType;
      setFieldsValue(formData);
      saveInitData(data);
    }
  });

  async function handleSubmit() {
    await validate();
    const value = getFieldsValue() as CreateWorkflowNodeParam | EditWorkflowNodeParam;
    loading.value = true;
    try {
      if (editType.value === 'create') {
        await createWorkflowNodeApi(editWorkflowId.value!, value as CreateWorkflowNodeParam);
      } else if (editType.value === 'edit') {
        await editWorkflowNodeApi(
          editWorkflowId.value!,
          editWorkflowNodeId.value!,
          value as EditWorkflowNodeParam,
        );
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

  function handleCancel() {
    const values = getFieldsValue();
    return validCloseable(title.value, values, closeModal);
  }
</script>
