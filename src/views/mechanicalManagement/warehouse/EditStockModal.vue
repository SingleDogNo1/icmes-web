<template>
  <BasicModal
    :loading="loading"
    v-bind="$attrs"
    :title="`${editType === 'create' ? '新建' : '编辑'}${
      occurrenceType === 'out' ? '出库单' : '入库单'
    }`"
    @register="register"
    @ok="handleSubmit"
  >
    <BasicForm
      @register="registerForm"
      class="stock-form"
      :class="occurrenceType === 'out' ? 'outbound' : 'inbound'"
    />
  </BasicModal>
</template>

<script lang="ts" setup name="EditStockModal">
  import { ref, Ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { editStockSchemas as genSchemas } from './data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    SparePartStockHistoryFullModel,
    OccurrenceTypeEnum,
    CreateInStockParams,
    CreateOutStockParams,
    UpdateInStockParams,
    UpdateOutStockParams,
  } from '/@/api/info/model/sparePartStocksModel';
  import {
    createInStockSparePartsApi,
    updateInStockSparePartsApi,
    createOutStockSparePartsApi,
    updateOutStockSparePartsApi,
  } from '/@/api/info/sparePartStocks';

  interface Data {
    occurrenceType: SparePartStockHistoryFullModel['type'];
    data: Nullable<SparePartStockHistoryFullModel>;
  }

  const { createMessage } = useMessage();

  const emit = defineEmits(['success']);

  const loading = ref<boolean>(false);
  const occurrenceType = ref<'out' | 'in'>();
  const editType: Ref<'create' | 'edit' | ''> = ref('');
  const editId = ref<Number | undefined>(undefined);

  const [registerForm, { getFieldsValue, updateSchema, resetFields, validate }] = useForm({
    schemas: genSchemas(occurrenceType.value!),
    labelWidth: 120,
    showActionButtonGroup: false,
  });

  const [register, { closeModal }] = useModalInner((record: Data) => {
    resetFields();
    console.log('data :>> ', record);
    occurrenceType.value = record.occurrenceType === OccurrenceTypeEnum['OUT'] ? 'out' : 'in';
    // 如果存在data字段，是编辑，否则是新建
    editType.value = record.data ? 'edit' : 'create';

    if (editType.value === 'edit') editId.value = record.data?.id;
    // 根据弹窗类型，直接更新所有字段
    const schemas = genSchemas(occurrenceType.value);
    updateSchema(schemas);
  });

  async function handleSubmit() {
    await validate();
    loading.value = true;
    const formData = getFieldsValue();
    try {
      if (editType.value === 'create') {
        if (occurrenceType.value === 'out') {
          await createOutStockSparePartsApi(formData as CreateOutStockParams);
        } else if (occurrenceType.value === 'in') {
          await createInStockSparePartsApi(formData as CreateInStockParams);
        }
      } else if (editType.value === 'edit') {
        if (occurrenceType.value === 'out') {
          await updateOutStockSparePartsApi(
            editId.value as number,
            formData as UpdateOutStockParams,
          );
        } else if (occurrenceType.value === 'in') {
          await updateInStockSparePartsApi(editId.value as number, formData as UpdateInStockParams);
        }
      }

      createMessage.success('保存成功');
      closeModal();
      emit('success');
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }
</script>

<style lang="less" scoped>
  .stock-form {
    background-position: top left;
    background-repeat: no-repeat;
    background-size: 50px auto;
    &.outbound {
      background-image: url('./images/outbound.png');
    }
    &.inbound {
      background-image: url('./images/inbound.png');
    }
  }
</style>
