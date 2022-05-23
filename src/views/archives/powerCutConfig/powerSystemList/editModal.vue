<template>
  <BasicModal
    :loading="loading"
    v-bind="$attrs"
    :title="`${editType === 'create' ? '新建' : '编辑'}供电系统图`"
    @register="register"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { editSchemas as schemas } from './data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import {
    createDevicePowerSupplyPhotoApi,
    editDevicePowerSupplyPhotoApi,
  } from '/@/api/info/devicePowerSupplyPhoto';
  import {
    DevicePowerSupplyPhotoExtendModel,
    DevicePowerSupplyPhotoBaseModel,
  } from '/@/api/info/model/devicePowerSupplyPhotoModel';

  const { createMessage } = useMessage();
  const { getDevicesList } = useUserStore();
  const emit = defineEmits(['done']);

  const loading = ref<boolean>(false);
  const editType = ref<'create' | 'edit' | ''>('');
  const devicesOptions = cloneDeep(getDevicesList);

  const [registerForm, { updateSchema, getFieldsValue, setFieldsValue, validate, resetFields }] =
    useForm({
      schemas,
      labelWidth: 120,
      showActionButtonGroup: false,
    });

  const [register, { closeModal, changeOkLoading }] = useModalInner(
    async (data: {
      deviceIds: Nullable<number[]>;
      record: Nullable<DevicePowerSupplyPhotoExtendModel>;
    }) => {
      resetFields();
      editType.value = data.record ? 'edit' : 'create';

      // 根据已配置过的设备 ID 过滤选项，已配置过的不可选择
      devicesOptions?.map((v) => {
        v.name = (v.processNo || '') + v.name;
        (v as unknown as Record<string, boolean>).disabled = Boolean(
          data.deviceIds?.includes(v.id),
        );
      });
      updateSchema([{ field: 'deviceId', componentProps: { options: devicesOptions || [] } }]);

      if (data.record) {
        setFieldsValue({
          id: data.record.id,
          deviceId: data.record.deviceId,
          photoName: data.record.photoName,
          photo: [{ fileId: data.record.photo, name: data.record.photoName }],
        });
      }
    },
  );

  async function handleSubmit() {
    changeOkLoading(true);
    await validate();
    const values = getFieldsValue();

    const params: DevicePowerSupplyPhotoBaseModel = {
      deviceId: values.deviceId,
      id: values.id,
      photoName: values.photoName,
      photo: values.photo[0].fileId,
    };

    console.log('params :>> ', params);

    try {
      if (editType.value === 'create') {
        await createDevicePowerSupplyPhotoApi(params);
      } else if (editType.value === 'edit') {
        await editDevicePowerSupplyPhotoApi(params);
      }

      createMessage.success('保存成功');
      emit('done');
      closeModal();
    } catch (error: any) {
      throw new Error(error);
    } finally {
      changeOkLoading(false);
    }
  }
</script>
