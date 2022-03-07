<template>
  <BasicModal
    v-bind="$attrs"
    title="报警处理"
    width="900px"
    :min-height="80"
    @register="register"
    :loading="loading"
    destroy-on-close
    ok-text="保存"
    @ok="handleSubmit"
  >
    <BasicTable @register="registerTable" :loading="loading">
      <template #startTime="{ record }">
        {{ formatDate(record.startTime, 'YYYY-MM-DD HH:mm') }}
      </template>

      <template #durationTime="{ record }">
        <span v-if="record.warningSource === '离线点检'"> -- </span>
        <span v-else> {{ calcDurationTime(record.endTime, record.startTime) }}</span>
      </template>
    </BasicTable>
    <BasicForm @register="registerForm" :show-action-button-group="false" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTable, useTable } from '/@/components/Table';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { formatDate } from '/@/utils/dateUtil';
  import { calcDurationTime } from '../helper';
  import { repairForm as schemas, modalTableColumns as columns } from '../data';
  import { AlarmObjectModel } from '/@/api/info/model/alarmModel';
  import { createRepairOrderApi } from '/@/api/maintenance/repair';
  import { CreateRepairOrderParam } from '/@/api/maintenance/model/repairModel';
  import { useMessage } from '/@/hooks/web/useMessage';

  const loading = ref(false);
  const { createMessage } = useMessage();

  const emit = defineEmits(['done']);

  const [registerForm, { getFieldsValue, setFieldsValue, validate }] = useForm({
    schemas,
    autoSubmitOnEnter: true,
  });

  const [registerTable, { setTableData }] = useTable({
    columns,
    maxHeight: 48,
    pagination: false,
    showIndexColumn: false,
  });

  const [register, { closeModal }] = useModalInner((data: AlarmObjectModel) => {
    console.log('data :>> ', data);
    setTableData([data]);
    setFieldsValue({
      alarmContent: data.alarmContent,
      alarmId: data.id,
      alarmObject: data.relativeObjectName,
      endTime: data.endTime,
      kind: data.kind,
      level: data.level,
      relativeObjectId: data.relativeObjectId,
      relativeObjectType: data.relativeObjectType,
      startTime: data.startTime,
      updateUserId: data.updateUserId,
      versionTag: data.versionTag,
    });
  });

  async function handleSubmit() {
    await validate();
    const value = getFieldsValue() as CreateRepairOrderParam;
    console.log('value :>> ', value);
    loading.value = true;

    try {
      const { data } = await createRepairOrderApi(value);
      createMessage.success(`故障已报修，问题单号: ${data}`);
      emit('done');
      closeModal();
    } catch (error: any) {
      // TODO 这段异常会不会自动捕捉？待运行的时候确认
      // if (error.errorCode === 2042) {
      //   createMessage.error('报警已被其他人处理，保存失败!');
      // }
      // if (error.errorCode === 2043) {
      //   createMessage.error('报警对象来自配点对象，不允许生成报修单!');
      // }
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }
</script>
