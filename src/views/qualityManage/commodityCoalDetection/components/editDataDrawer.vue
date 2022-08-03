<template>
  <BasicDrawer
    v-bind="$attrs"
    :showFooter="!isView"
    @register="registerEditDataDrawer"
    :title="title"
    width="40%"
    @close="resetFields"
  >
    <template v-if="isView">
      <img v-if="qualified === 0 && stable === 0" class="stamp" src="./fail.png" alt="" />
      <img v-if="qualified === 1 && stable === 0" class="stamp" src="./unstable.png" alt="" />
      <img v-if="qualified === 1 && stable === 1" class="stamp" src="./pass.png" alt="" />
    </template>

    <BasicForm @register="registerEditDataForm" />

    <template #footer>
      <a-button v-if="isCreate" @click="saveAndContinue"> 保存并继续新建 </a-button>
      <a-button type="primary" @click="save"> 保存 </a-button>
    </template>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form';
  import {
    createCommercialCoalInspectionApi,
    editCommercialCoalInspectionApi,
  } from '/@/api/quality/commercialCoalInspection';
  import {
    CommercialCoalInspectionModel,
    EditCommercialCoalInspectionParams,
  } from '/@/api/quality/model/commercialCoalInspectionModel';
  import { editCommercialCoalInspectionSchemas } from '../data';
  import { useMessage } from '/@/hooks/web/useMessage';

  const emit = defineEmits(['submit']);

  const { createMessage } = useMessage();

  const title = ref('');
  const isCreate = ref<boolean>(false);
  const isEdit = ref<boolean>(false);
  const isView = ref<boolean>(false);
  const dataId = ref<number>(); // 当前编辑的数据id
  const qualified = ref<number>(); // 当前编辑的数据的合格率
  const stable = ref<number>(); // 当前编辑的数据的稳定率

  const [
    registerEditDataForm,
    { getFieldsValue, setFieldsValue, setProps, resetFields, validate },
  ] = useForm({
    labelWidth: 120,
    wrapperCol: { span: 12 },
    schemas: [],
    showActionButtonGroup: false,
  });

  const [registerEditDataDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(
    async (record: { data: CommercialCoalInspectionModel; edit: boolean } | null) => {
      try {
        setDrawerProps({ loading: true });
        const data = record?.data;
        const edit = record?.edit;

        isCreate.value = !data;
        isEdit.value = !!(edit && data);
        isView.value = !!(!edit && data);
        title.value = isCreate.value
          ? '新建商品煤检测'
          : isEdit.value
          ? '编辑商品煤检测'
          : '查看商品煤检测';
        setProps({ disabled: isView.value, schemas: editCommercialCoalInspectionSchemas(data) });

        if (data && !isCreate.value) {
          dataId.value = data.id;
          qualified.value = data.qualified;
          stable.value = data.stable;

          setFieldsValue({
            inspectionDate: data.inspectionDate,
            coalType: data.loadingPlanBaseModel.coalType,
            direction: data.loadingPlanBaseModel.direction,
            tonnage: data.loadingPlanBaseModel.tonnage,
            batchNumber: data.batchNumber,
            mt: data.mt,
            mad: data.mad,
            ad: data.ad,
            var: data.var,
            vdaf: data.vdaf,
            cokeType: data.cokeType,
            std: data.std,
            qgrAd: data.qgrAd,
            qgrD: data.qgrD,
            qnetArMj: data.qnetArMj,
            qnetArCal: data.qnetArCal,
            qualityRange: data.qualityRange,
            memo: data.memo,
            loadingType: data.loadingType,
            loadingPlanId: data.loadingPlanId,
            versionTag: data.versionTag,
          });
        }
      } catch (error: any) {
        throw new Error(error);
      } finally {
        setDrawerProps({ loading: false });
      }
    },
  );

  async function handleSubmit() {
    await validate();
    const values = getFieldsValue() as EditCommercialCoalInspectionParams;
    try {
      if (isCreate.value) {
        await createCommercialCoalInspectionApi(values);
      } else if (isEdit.value) {
        await editCommercialCoalInspectionApi(dataId.value as number, values);
      }

      createMessage.success('保存成功');
      return new Promise<void>((resolve) => {
        resolve();
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }

  function saveAndContinue() {
    handleSubmit().then(() => {
      resetFields();
      emit('submit');
    });
  }

  function save() {
    handleSubmit().then(() => {
      closeDrawer();
      emit('submit');
    });
  }
</script>

<style scoped lang="less">
  .stamp {
    @apply absolute right-5 top-5 w-3/24;
  }
</style>
