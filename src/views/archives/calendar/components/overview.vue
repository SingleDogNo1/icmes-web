<template>
  <PageWrapper contentFullHeight dense class="bg-white">
    <BasicTable @register="registerTable" :loading="loading" @row-click="handleClickRow">
      <template #monthTitle>
        <Select
          v-model:value="selectYear"
          :bordered="true"
          :style="{ width: '100%' }"
          @change="getCalendarsStatistics"
        >
          <Select.Option v-for="item in yearOptions" :key="item.value" :value="item.value" />
        </Select>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'ArchivesCalendarOverview',
  };
</script>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';

  import { Select } from 'ant-design-vue';
  import { getCalendarsStatisticsApi } from '/@/api/info/calendar';
  import { cloneDeep } from 'lodash-es';
  import dayjs from 'dayjs';

  const loading = ref<boolean>(false);
  const selectedRowIndex = ref<number>(-1);
  const selectedRow = ref({});
  const selectYear = ref(dayjs().year());
  const yearOptions = ref([
    {
      value: dayjs().year() - 2,
      label: dayjs().year() - 2,
    },
    {
      value: dayjs().year() - 1,
      label: dayjs().year() - 1,
    },
    {
      value: dayjs().year(),
      label: dayjs().year(),
    },
    {
      value: dayjs().year() + 1,
      label: dayjs().year() + 1,
    },
    {
      value: dayjs().year() + 1,
      label: dayjs().year() + 1,
    },
  ]);

  function handleSummary(tableData: Recordable[]) {
    const workDayTotal = tableData.reduce((res, pre) => res + pre.workDayTotal, 0);
    const repairDayTotal = tableData.reduce((res, pre) => res + pre.repairDayTotal, 0);
    const restDayTotal = tableData.reduce((res, pre) => res + pre.restDayTotal, 0);
    return [{ month: '全年总计', workDayTotal, repairDayTotal, restDayTotal }];
  }

  const [registerTable, { setTableData }] = useTable({
    pagination: false,
    showIndexColumn: false,
    canResize: false,
    columns: [
      { dataIndex: 'month', slots: { title: 'monthTitle' }, width: 200 },
      { title: '生产日(天)', dataIndex: 'workDayTotal' },
      { title: '检修日(天)', dataIndex: 'repairDayTotal' },
      { title: '休息日(天)', dataIndex: 'restDayTotal' },
    ],
    rowClassName: (_, index) => {
      return selectedRowIndex.value === index ? 'ant-table-row-hover' : '';
    },
    striped: false,
    showSummary: true,
    summaryFunc: handleSummary,
  });

  onMounted(() => {
    getCalendarsStatistics();
  });

  async function getCalendarsStatistics() {
    loading.value = true;
    try {
      const { items } = await getCalendarsStatisticsApi({ year: selectYear.value });

      const list: any[] = cloneDeep(items);

      list.map((item) => {
        item.month = item.month + '月';
      });

      setTableData(list);
      handleClickRow(list[0], 0);
    } catch (error) {
      throw new Error(JSON.stringify(error));
    } finally {
      loading.value = false;
    }
  }

  function handleClickRow(row, index?) {
    console.log('row, index :>> ', row, index);
    if (selectedRowIndex.value === index) return;
    // emit('selectRow', row);
    selectedRowIndex.value = index;
    selectedRow.value = row;
  }
</script>
