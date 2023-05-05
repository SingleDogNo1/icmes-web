<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="查看年度计划" width="80%">
    <Description :column="1" @register="registerDesc" class="mb-4" />
    <BasicTable @register="registerYearPlanTable" title="年度计划" />
    <BasicTable @register="registerMonthPlanTable" title="每月明细表" class="month-plan-table">
      <template #summary>
        <Table.Summary fixed="top">
          <Table.Summary.Row>
            <Table.Summary.Cell style="background: #d8eaff" :col-span="2" :index="0">
              工作天数
            </Table.Summary.Cell>
            <!-- 遍历 12 个月的数据 -->
            <Table.Summary.Cell
              v-for="item in monthDetailList"
              :key="item.month"
              style="background: #f2f7ff"
            >
              {{ item.workDayTotal }}
            </Table.Summary.Cell>
            <!-- 手动添加工作天数总计 -->
            <Table.Summary.Cell style="background: #f2f7ff" :index="14">
              {{ totalWorkDays }}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      </template>
    </BasicTable>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { ref, unref, computed } from 'vue';
  import { Table } from 'ant-design-vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Description, useDescription } from '/@/components/Description';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getYearPlanDetailApi, getYearPlanMonthDetailApi } from '/@/api/production/yearPlan';
  import { getCalendarsStatisticsApi } from '/@/api/info/calendar';
  import { ProductionYearPlanProductionAdvanceModel } from '/@/api/production/model/yearPlanModel';
  import { CalendarStatisticsItemModel } from '/@/api/info/model/calendarModel';
  import { parseFloatNumber } from '/@/utils';
  import { parseYearPlanTableData, basicTableCellStyle, parseMonthPlanTableData } from './helper';
  import { error } from '/@/utils/log';

  const descData = ref({});
  const monthDetailList = ref<CalendarStatisticsItemModel[]>([]);
  const yearPlanTableData = ref<ProductionYearPlanProductionAdvanceModel[]>([]);
  const monthPlanTableData = ref<ProductionYearPlanProductionAdvanceModel[]>([]);

  const totalWorkDays = computed(() => {
    return monthDetailList.value.reduce((res, pre) => {
      res += pre.workDayTotal;
      return res;
    }, 0);
  });

  const [registerDesc] = useDescription({
    data: descData,
    labelStyle: { width: '100px' },
    schema: [
      { field: 'year', label: '生产年度' },
      { field: 'memo', label: '备注说明' },
    ],
  });

  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (id: number) => {
    setDrawerProps({ loading: true });
    try {
      const { year, memo, productions } = await getYearPlanDetailApi(id);
      descData.value = { year, memo }; // 拼接生产年度 && 备注说明
      const list = parseYearPlanTableData(productions || []); // 拼接原始数据，生成年度计划表格展示的格式
      yearPlanTableData.value = list; // 备份表格数据，用做单元格合并时判断的条件
      setYearPlanTableData(list);

      const { items: monthWorkDays } = await getCalendarsStatisticsApi({ year });
      const { monthProductions } = await getYearPlanMonthDetailApi(id);
      monthDetailList.value = monthWorkDays; // 工作日历，查询每月实际工作天数，插入表格

      const monthPlanList = parseMonthPlanTableData(monthProductions, monthWorkDays);
      monthPlanTableData.value = monthPlanList; // 备份表格数据，用做单元格合并时判断的条件
      setMonthPlanTableData(monthPlanList); // 拼接原始数据，生成每月明细表格展示的格式
    } catch (err: any) {
      error(err);
    } finally {
      setDrawerProps({ loading: false });
    }
  });

  const [registerYearPlanTable, { setTableData: setYearPlanTableData }] = useTable({
    showIndexColumn: false,
    pagination: false,
    striped: false,
    canResize: false,
    columns: [
      {
        title: '',
        width: 90,
        dataIndex: 'title',
        fixed: true,
        customCell: (_, index) => {
          console.log('yearPlanTableData :>> ', yearPlanTableData);
          const list = unref(yearPlanTableData);
          // 获取列表中最后一条原煤数据所在的索引
          const rawCoalIndex = list.findLastIndex((v) => v.productType === 0);
          // 获取列表中原煤数据的条数
          const rawCoalList = list.filter((v) => v.productType === 0);
          // 从第一条原煤开始，合并${原煤数据条数}行数据
          if (index === 0) {
            return { rowSpan: rawCoalList.length, style: { background: '#d9f2cb' } };
          }
          if (index > 0 && index <= rawCoalIndex) {
            return { rowSpan: 0 };
          }
          // 原煤位置之后为产出煤种，起始位置为${最后一条原煤索引 + 1}，到数据结束
          if (index === rawCoalIndex + 1) {
            return { rowSpan: list.length - rawCoalList.length, style: { background: '#d8eaff' } };
          }
          if (index > rawCoalIndex + 1) {
            return { rowSpan: 0 };
          }
        },
      },
      {
        title: '',
        dataIndex: 'productVarieties',
        fixed: true,
        format: (amount) => amount || '/',
        customCell: (_, index) => {
          const list = unref(yearPlanTableData);
          // 获取列表中最后一条原煤数据所在的索引
          const rawCoalIndex = list.findLastIndex((v) => v.productType === 0);
          // 从第一条原煤开始，合并${原煤数据条数}行数据
          if (index < rawCoalIndex) {
            return { style: { background: '#d9f2cb' } };
          }

          if (index === rawCoalIndex) {
            return { style: { color: '#ff6702', background: '#d9f2cb' } };
          }

          // 原煤位置之后为产出煤种，起始位置为${最后一条原煤索引 + 1}，到数据结束
          if (index > rawCoalIndex && index < list.length - 1) {
            return { style: { background: '#d8eaff' } };
          }

          if (index === list.length - 1) {
            return { style: { color: '#ff6702', background: '#d8eaff' } };
          }
        },
      },
      {
        title: '数量(万吨)',
        dataIndex: 'productAmount',
        format: (amount) => {
          if (!amount) return '/';
          return parseFloatNumber(amount);
        },
        customCell: (_record, index) => basicTableCellStyle(index, yearPlanTableData.value),
      },
      {
        title: '产率（%）',
        dataIndex: 'productivity',
        format: (amount) => {
          if (!amount) return '/';
          return parseFloatNumber(amount * 100) + '%';
        },
        customCell: (_record, index) => basicTableCellStyle(index, yearPlanTableData.value),
      },
      {
        title: '灰分（%）',
        dataIndex: 'ash',
        format: (ash) => {
          if (!ash) return '/';
          return parseFloatNumber(ash * 100) + '%';
        },
        customCell: (_record, index) => basicTableCellStyle(index, yearPlanTableData.value),
      },
      {
        title: '水分（%）',
        dataIndex: 'moisture',
        format: (moisture) => {
          if (!moisture) return '/';
          return parseFloatNumber(moisture * 100) + '%';
        },
        customCell: (_record, index) => basicTableCellStyle(index, yearPlanTableData.value),
      },
      {
        title: '发热量(大卡)',
        dataIndex: 'mj',
        format: (mj) => {
          if (!mj) return '/';
          return parseFloatNumber(mj * 100) + '%';
        },
        customCell: (_record, index) => basicTableCellStyle(index, yearPlanTableData.value),
      },
    ],
  });

  const monthsColumns = new Array(12).fill(0).map((_v, i) => ({
    title: i + 1 + '月',
    dataIndex: 'month' + (i + 1),
    customCell: (_, i) => basicTableCellStyle(i, monthPlanTableData.value),
  }));

  const [registerMonthPlanTable, { setTableData: setMonthPlanTableData }] = useTable({
    showIndexColumn: false,
    pagination: false,
    striped: false,
    sticky: true,
    canResize: false,
    showSummary: true,
    columns: [
      {
        title: '',
        width: 90,
        dataIndex: 'title',
        fixed: true,
        customCell: (_, index) => {
          const list = unref(monthPlanTableData);
          // 获取列表中最后一条原煤数据所在的索引
          const rawCoalIndex = list.findLastIndex((v) => v.productType === 0);
          // 获取列表中原煤数据的条数
          const rawCoalList = list.filter((v) => v.productType === 0);
          // 从第一条原煤开始，合并${原煤数据条数}行数据
          if (index === 0) {
            return { rowSpan: rawCoalList.length, style: { background: '#d9f2cb' } };
          }
          if (index > 0 && index <= rawCoalIndex) {
            return { rowSpan: 0 };
          }
          // 原煤位置之后为产出煤种，起始位置为${最后一条原煤索引 + 1}，到数据结束
          if (index === rawCoalIndex + 1) {
            return { rowSpan: list.length - rawCoalList.length, style: { background: '#d8eaff' } };
          }
          if (index > rawCoalIndex + 1) {
            return { rowSpan: 0 };
          }
        },
      },
      {
        title: '',
        dataIndex: 'productVarieties',
        fixed: true,
        format: (amount) => {
          return amount || '/';
        },
        customCell: (_, index) => {
          const list = unref(monthPlanTableData);
          // 获取列表中最后一条原煤数据所在的索引
          const rawCoalIndex = list.findLastIndex((v) => v.productType === 0);
          // 从第一条原煤开始，合并${原煤数据条数}行数据
          if (index < rawCoalIndex) {
            return { style: { background: '#d9f2cb' } };
          }

          if (index === rawCoalIndex) {
            return { style: { color: '#ff6702', background: '#d9f2cb' } };
          }

          // 原煤位置之后为产出煤种，起始位置为${最后一条原煤索引 + 1}，到数据结束
          if (index > rawCoalIndex && index < list.length - 1) {
            return { style: { background: '#d8eaff' } };
          }

          if (index === list.length - 1) {
            return { style: { color: '#ff6702', background: '#d8eaff' } };
          }
        },
      },
      ...monthsColumns,
      {
        title: '全年累计',
        dataIndex: 'total',
        fixed: 'right',
        customCell: (_record, index) => basicTableCellStyle(index, monthPlanTableData.value),
      },
    ],
  });
</script>

<style scoped>
  .month-plan-table :deep(.ant-table-summary) td {
    text-align: center;
  }
</style>
