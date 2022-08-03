<template>
  <BasicModal
    :loading="loading"
    v-bind="$attrs"
    title="数据导入"
    :min-height="30"
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
  import { dateUtil } from '/@/utils/dateUtil';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { importCommercialCoalInspectionApi } from '/@/api/quality/commercialCoalInspection';

  const { createSuccessModal } = useMessage();

  const loading = ref(false);
  const emit = defineEmits(['done']);

  const [registerForm, { getFieldsValue, validate }] = useForm({
    schemas: [
      {
        field: 'timeRange',
        label: '日期',
        component: 'RangePicker',
        componentProps: {
          format: 'YYYY-MM-DD',
          showTime: {
            defaultValue: [dateUtil().startOf('day'), dateUtil().endOf('day')],
          },
        },
      },
    ],
    fieldMapToTime: [['timeRange', ['startTime', 'endTime']]],
    showActionButtonGroup: false,
  });

  const [register, { closeModal }] = useModalInner();

  async function handleSubmit() {
    await validate();
    loading.value = true;
    const value = getFieldsValue() as { startTime: string; endTime: string };

    try {
      const { data } = await importCommercialCoalInspectionApi(value);

      createSuccessModal({
        content: `本次新增${data}条数据`,
        onOk: () => {
          emit('done');
          closeModal();
        },
      });
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }
</script>
