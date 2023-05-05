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
  import { processForm as schemas, modalTableColumns as columns } from '../data';
  import {
    AlarmObjectModel,
    UpdateAlarmsOperationsParam,
    AlarmStatusEnum,
  } from '/@/api/info/model/alarmModel';
  import { updateAlarmsOperationsApi } from '/@/api/info/alarms';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { error } from '/@/utils/log';

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

  const [register, { closeModal }] = useModalInner(async (data: AlarmObjectModel) => {
    setTableData([data]);
    setFieldsValue({
      id: data.id,
      versionTag: data.versionTag,
    });
  });

  async function handleSubmit() {
    await validate();
    const value = getFieldsValue() as UpdateAlarmsOperationsParam;
    console.log('value :>> ', value);
    loading.value = true;

    try {
      await updateAlarmsOperationsApi(value);
      if (value.optionStatus === AlarmStatusEnum['DONE']) {
        createMessage.success('报警已处理');
      }
      if (value.optionStatus === AlarmStatusEnum['CLOSED']) {
        createMessage.success('报警已关闭');
      }
      emit('done');
      closeModal();
    } catch (err: any) {
      // TODO 这段异常会不会自动捕捉？待运行的时候确认
      // if (error.errorCode === 2042) {
      //   createMessage.error('报警已被其他人处理，保存失败!');
      // }
      error(err);
    } finally {
      loading.value = false;
    }
  }
</script>
