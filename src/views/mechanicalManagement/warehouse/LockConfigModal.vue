<template>
  <BasicModal
    :loading="loading"
    v-bind="$attrs"
    title="锁定配置"
    :width="380"
    :min-height="110"
    :height="110"
    @register="register"
    @ok="handleSubmit"
  >
    <Alert
      message="超过锁定时间后不能新建、编辑相关出入库单。"
      type="warning"
      show-icon
      class="mb-3.5!"
    />
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup name="LockConfigModal">
  import { ref } from 'vue';
  import { Alert } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getSparePartPushSettingsApi } from '/@/api/info/sparePart';
  import { updateStockSparePartsSettingApi } from '/@/api/info/sparePartStocks';
  import { UpdateSettingParams } from '/@/api/info/model/sparePartStocksModel';
  import { error } from '/@/utils/log';

  const { createMessage } = useMessage();

  const emit = defineEmits(['success']);

  const loading = ref<boolean>(false);
  const stockId = ref<number>();

  const [registerForm, { getFieldsValue, setFieldsValue, resetFields, validate }] = useForm({
    schemas: [
      {
        field: 'lockDays',
        label: '锁定时间',
        component: 'InputNumber',
        renderComponentContent: () => {
          return {
            addonAfter: () => '天',
          };
        },
        componentProps: {
          controls: false,
        },
        rules: [
          {
            validator: async (_, value) => {
              if (!value) {
                return Promise.reject('请输入锁定时间');
              } else {
                if (value < 1 || value > 90) {
                  return Promise.reject('锁定期范围为1 - 90天');
                } else {
                  return Promise.resolve();
                }
              }
            },
          },
        ],
      },
    ],
    showActionButtonGroup: false,
  });

  const [register, { closeModal }] = useModalInner(async () => {
    resetFields();
    try {
      loading.value = true;
      const { lockDays, id } = await getSparePartPushSettingsApi();
      setFieldsValue({ lockDays: lockDays });
      stockId.value = id;
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  });

  async function handleSubmit() {
    await validate();
    loading.value = true;
    const formData = getFieldsValue() as UpdateSettingParams;
    try {
      await updateStockSparePartsSettingApi(stockId.value!, formData);
      createMessage.success('保存成功');
      closeModal();
      emit('success');
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }
</script>
