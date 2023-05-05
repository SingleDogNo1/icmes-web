<template>
  <BasicModal
    :loading="loading"
    v-bind="$attrs"
    title="设置范围"
    :width="600"
    :min-height="50"
    @register="register"
    @ok="handleSubmit"
  >
    <Descriptions bordered class="mb-3.5">
      <Descriptions.Item label="操作票编号">{{ formData?.number }}</Descriptions.Item>
      <Descriptions.Item label="操作票名称">{{ formData?.name }}</Descriptions.Item>
    </Descriptions>

    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Descriptions } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { editRangeSchemas as schemas } from '../data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { UpdateHvOperationDevicesApi } from '/@/api/power/hvOperation';
  import { error } from '/@/utils/log';
  import {
    HvOperateTemplateAdvanceModel,
    UpdateHvOperationDevicesParams,
  } from '/@/api/power/model/hvOperationModel';

  const { createMessage } = useMessage();

  const emit = defineEmits(['done']);

  const loading = ref<boolean>(false);
  const formData = ref<Nullable<HvOperateTemplateAdvanceModel>>(null);

  const [registerForm, { getFieldsValue, setFieldsValue, validate, resetFields, updateSchema }] =
    useForm({
      schemas,
      labelWidth: 60,
      showActionButtonGroup: false,
    });

  const [register, { closeModal }] = useModalInner(
    async (data: HvOperateTemplateAdvanceModel | null) => {
      resetFields();
      if (data?.id) {
        loading.value = true;
        formData.value = data;
        // 接口获取设备列表完成后，在为表单赋值。否则在列表获取到之前会有显示上的错误
        updateSchema([
          {
            field: 'deviceIds',
            componentProps: {
              onOptionsChange: () => {
                const deviceIds = data.devices?.reduce((res, pre) => {
                  res.push(pre.deviceId);
                  return res;
                }, [] as number[]);
                setFieldsValue({ deviceIds });
                loading.value = false;
              },
            },
          },
        ]);
      }
    },
  );

  async function handleSubmit() {
    loading.value = true;
    await validate();
    const params = getFieldsValue() as UpdateHvOperationDevicesParams;
    try {
      await UpdateHvOperationDevicesApi(formData.value?.id as number, params);
      createMessage.success(JSON.stringify(params));
      emit('done');
      closeModal();
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }
</script>
