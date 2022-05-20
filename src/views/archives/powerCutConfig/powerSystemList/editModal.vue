<template>
  <BasicModal
    :loading="loading"
    v-bind="$attrs"
    :title="`${editType === 'create' ? '新建' : '编辑'}策略`"
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
  import { editSchemas as schemas } from './data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { createPLCJudgmentApi, editPLCJudgmentApi } from '/@/api/power/PLCJudgmentRule';
  import {
    PlcJudgmentRuleModel,
    ReqPLCJudgmentRuleParams,
  } from '/@/api/power/model/PLCJudgmentRuleModel';

  const { createMessage } = useMessage();

  const emit = defineEmits(['done']);

  const loading = ref<boolean>(false);
  const editType = ref<'create' | 'edit' | ''>('');
  const editId = ref<number>();

  const [registerForm, { getFieldsValue, setFieldsValue, validate, resetFields }] = useForm({
    schemas,
    labelWidth: 120,
    showActionButtonGroup: false,
  });

  const [register, { closeModal }] = useModalInner(async (data: PlcJudgmentRuleModel) => {
    resetFields();
    editType.value = data.id ? 'edit' : 'create';

    if (data.id) {
      editId.value = data.id;
      setFieldsValue({
        powerBusinessNode: data.powerBusinessNode,
        plcDetectType: data.plcDetectType,
        strategyId: data.strategyId,
        explain: data.explain,
        description: data.description,
      });
    }
  });

  async function handleSubmit() {
    loading.value = true;
    await validate();
    const params = getFieldsValue() as ReqPLCJudgmentRuleParams;
    try {
      if (editType.value === 'create') {
        await createPLCJudgmentApi(params);
      } else if (editType.value === 'edit') {
        await editPLCJudgmentApi(editId.value!, params);
      }

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
