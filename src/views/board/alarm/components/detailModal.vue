<template>
  <BasicModal
    v-bind="$attrs"
    title="报警处理"
    width="900px"
    :min-height="80"
    @register="register"
    destroy-on-close
    :show-ok-btn="false"
  >
    <BasicTable @register="registerTable">
      <template #startTime="{ record }">
        {{ formatDate(record.startTime, 'YYYY-MM-DD HH:mm') }}
      </template>

      <template #durationTime="{ record }">
        <span v-if="record.warningSource === '离线点检'"> -- </span>
        <span v-else> {{ calcDurationTime(record.endTime, record.startTime) }}</span>
      </template>
    </BasicTable>
    <Spin :spinning="loading">
      <Description :column="3" :data="descData" :schema="schema" class="mt-2.5" />
    </Spin>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Spin } from 'ant-design-vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Description } from '/@/components/Description';
  import { formatDate } from '/@/utils/dateUtil';
  import { calcDurationTime } from '../helper';
  import { modalTableColumns as columns, detailDesc as schema } from '../data';
  import { AlarmObjectModel } from '/@/api/info/model/alarmModel';
  import { getAlarmsDetailApi } from '/@/api/info/alarms';
  import { error } from '/@/utils/log';

  const loading = ref(false);
  const descData = ref({});

  const [registerTable, { setTableData }] = useTable({
    columns,
    maxHeight: 48,
    pagination: false,
    showIndexColumn: false,
  });

  const [register] = useModalInner(async (alarmData: AlarmObjectModel) => {
    console.log('data :>> ', alarmData);
    setTableData([alarmData]);
    loading.value = true;
    try {
      const data = await getAlarmsDetailApi(alarmData.id);
      descData.value = data;
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  });
</script>
