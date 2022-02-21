<template>
  <PageWrapper contentFullHeight dense class="bg-white">
    <BasicTable @register="registerTable" :loading="loading" @row-click="handleClickRow">
      <template #monthTitle>
        <Select
          v-model:value="currentYear"
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
  import { ref, PropType, watch, toRefs } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { Select } from 'ant-design-vue';
  import { getCalendarsStatisticsApi } from '/@/api/info/calendar';
  import { cloneDeep } from 'lodash-es';
  import dayjs from 'dayjs';
  import type { Date } from './types';

  const props = defineProps({
    date: {
      type: Object as PropType<Date>,
      required: true,
    },
  });
  const emit = defineEmits(['initTable', 'selectRow']);

  const originData = ref();
  const loading = ref<boolean>(false);
  const selectedRowIndex = ref<number>(-1);
  const selectedRow = ref({});
  const currentYear = ref(dayjs().year());
  const yearOptions = genYearsOptions();

  // 生成年份下拉选项(最近15年, 保持与日历相同)
  function genYearsOptions() {
    const cur_year = dayjs().year();
    const options: any[] = [];
    for (let index = cur_year - 7; index <= cur_year + 7; index++) {
      options.push({ value: index, label: index });
    }
    return options;
  }

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

  async function getCalendarsStatistics() {
    loading.value = true;
    try {
      const { items, year } = await getCalendarsStatisticsApi({ year: currentYear.value });

      const list: any[] = cloneDeep(items);
      const { date } = toRefs(props);

      list.map((item) => {
        item.month = item.month + '月';
      });

      originData.value = list; // 备份后台数据, 保证触发 handleClickRow 方法时可以找到源数据
      setTableData(list);
      handleClickRow(list[date.value.month - 1], date.value.month - 1);
      emit('initTable', list, year);
    } catch (error) {
      throw new Error(JSON.stringify(error));
    } finally {
      loading.value = false;
    }
  }

  function handleClickRow(row, index?) {
    if (selectedRowIndex.value === index) return;
    const { date } = toRefs(props);

    emit('selectRow', index || date.value.month - 1);
    selectedRowIndex.value = index;
    selectedRow.value = row;
  }

  getCalendarsStatistics();

  watch(
    () => props.date,
    (val) => {
      currentYear.value = val.year;
      handleClickRow(originData.value[val.month - 1], val.month - 1);
    },
  );

  watch(
    () => currentYear.value,
    () => {
      getCalendarsStatistics();
    },
  );

  defineExpose({ getCalendarsStatistics });
</script>
