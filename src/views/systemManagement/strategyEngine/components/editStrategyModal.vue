<template>
  <BasicModal
    v-bind="$attrs"
    :title="`${editType === 'create' ? '新建' : '编辑'}策略`"
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
  import { ref, Ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { PageWrapper } from '/@/components/Page';
  import { editStrategyEngineSchemas as schemas } from '../data';
  import { createStrategyApi, updateStrategyApi } from '/@/api/info/strategy';
  import { StrategyModel, EditStrategyParams } from '/@/api/info/model/strategyModel';
  import { useMessage } from '/@/hooks/web/useMessage';

  // const { createMessage } = useMessage();

  const emit = defineEmits(['done']);
  const { createMessage } = useMessage();

  const loading = ref<boolean>(false);
  // 编辑的类型，通过参数中是否存在versionTag，判断是新建还是编辑
  const editType: Ref<'create' | 'edit' | ''> = ref('');

  const [registerForm, { getFieldsValue, setFieldsValue, validate, updateSchema }] = useForm({
    labelWidth: 120,
    schemas,
    autoSubmitOnEnter: true,
  });

  const [register, { closeModal }] = useModalInner((data: StrategyModel) => {
    console.log('data :>> ', data);
    editType.value = data.versionTag ? 'edit' : 'create';
    data.versionTag &&
      setFieldsValue({
        businessType: data.businessType,
        dataType: data.dataType,
        id: data.id,
        isUse: data.isUse,
        name: data.name,
        number: data.number,
        remark: data.remark,
        versionTag: data.versionTag,
      });

    // 如果存在versionTag 字段，是编辑，否则是新建。并且编辑时, number 选项不可操作
    updateSchema({ field: 'number', componentProps: { disabled: Boolean(data.versionTag) } });
  });

  async function handleSubmit() {
    await validate();
    const value = getFieldsValue() as unknown as EditStrategyParams;
    console.log('value :>> ', value);
    loading.value = true;
    try {
      if (editType.value === 'create') {
        await createStrategyApi(value);
      } else if (editType.value === 'edit') {
        await updateStrategyApi(value);
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
