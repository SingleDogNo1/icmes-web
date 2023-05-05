<template>
  <BasicModal
    v-bind="$attrs"
    title="信号属性"
    :min-height="100"
    :loading="loading"
    @register="register"
    @ok="handleSubmit"
    @visible-change="handleShowModal"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts">
  export default {
    name: 'UpdateSignalAttrModal',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { UpdateSignalAttrSchemas as schemas } from '../data';
  import { getPlcPointInfoApi, updatePlcPointsApi } from '/@/api/info/plcPoints';
  import { PLCPointFullModel, PLCPointBaseModel } from '/@/api/info/model/plcPointsModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { error } from '/@/utils/log';

  const { createMessage } = useMessage();

  const emit = defineEmits(['done']);
  const loading = ref(false);
  const checkedRows = ref<PLCPointFullModel[]>([]);

  const [registerForm, { getFieldsValue, setFieldsValue, validate, resetFields }] = useForm({
    schemas,
    labelWidth: 170,
    showActionButtonGroup: false,
  });

  const [register, { closeModal, setModalProps }] = useModalInner((data) => {
    data && onDataReceive(data);
  });

  function onDataReceive(data: PLCPointFullModel[]) {
    checkedRows.value = data;
    if (data.length === 1) {
      loading.value = true;
      getPlcPointInfoApi(data[0].id!)
        .then((data) => {
          setFieldsValue({
            pointContent: data.pointContent,
            businessType: data.businessType,
            needStoraged: data.needStoraged,
            deviceMonitorFlag: data.deviceMonitorFlag,
            orderNum: data.orderNum,
            pointType: data.pointType,
            digitalOneComment: data.digitalOneComment,
            digitalZeroComment: data.digitalZeroComment,
            unit: data.unit,
            ratedValue: data.ratedValue,
          });
        })
        .catch((err) => {
          error(err);
        })
        .finally(() => {
          loading.value = false;
        });
    }
  }

  async function handleSubmit() {
    await validate();
    setModalProps({ confirmLoading: true });
    const value = getFieldsValue() as PLCPointBaseModel;
    const plcPointlist = checkedRows.value.map((item) => ({ ...item, ...value }));

    try {
      await updatePlcPointsApi({ plcPointlist });
      createMessage.success('配置属性成功');
      closeModal();
      emit('done');
    } catch (err: any) {
      error(err);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  function handleShowModal(show: boolean) {
    !show && resetFields();
  }
</script>
