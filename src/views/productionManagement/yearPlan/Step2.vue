<template>
  <div class="step2">
    <BasicTable @register="registerMonthPlanTable" title="每月明细表" class="month-plan-table">
      <template #toolbar>
        <Description @register="registerDesc" />
      </template>

      <template v-for="item in monthCols" :key="item" #[item]="{ record }">
        <span v-if="record.productVarieties.match(/总量|合计|平均/g)"> {{ record[item] }} </span>
        <a-input v-else v-model:value="record[item]" @blur="handleChangeCol" />
      </template>

      <template #summary>
        <Table.Summary fixed="top">
          <Table.Summary.Row>
            <Table.Summary.Cell style="background: #d8eaff" :col-span="2" :index="0">
              工作天数
            </Table.Summary.Cell>
            <!-- 遍历 12 个月的数据 -->
            <Table.Summary.Cell
              v-for="item in monthWorkDays"
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

    <BasicTable @register="registerYearPlanTable" />
  </div>
</template>

<script lang="ts" setup name="EditYearPlanStep2">
  import { ref, unref, watch, toRefs, computed } from 'vue';
  import { Table } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { dateUtil } from '/@/utils/dateUtil';
  import { BasicTable, useTable } from '/@/components/Table';
  import { Description, useDescription } from '/@/components/Description';
  import { parseFloatNumber } from '/@/utils';
  import { basicTableCellStyle, parseMonthPlanTableData, parseStep2FormTable } from './helper';
  import { ProductionYearPlanProductionAdvanceModel } from '/@/api/production/model/yearPlanModel';
  import { MonthDetailData } from './types';

  const props = defineProps<{
    schemas: any;
    monthWorkDays: any[];
    monthDetailsData: MonthDetailData | null;
  }>();

  const monthPlanTableData = ref<ProductionYearPlanProductionAdvanceModel[]>([]);
  const yearPlanTableData = ref<Record<string, string | number>[]>([]);

  const { schemas, monthWorkDays, monthDetailsData } = toRefs(props);

  const monthCols = new Array(12).fill(0).map((_v, i) => 'month' + (i + 1));
  const monthsColumns = new Array(12).fill(0).map((_v, i) => ({
    title: i + 1 + '月',
    dataIndex: 'month' + (i + 1),
    slots: { customRender: 'month' + (i + 1) },
    customCell: (_, i) => basicTableCellStyle(i, monthPlanTableData.value),
  }));

  const totalWorkDays = computed(() => {
    return monthWorkDays.value.reduce((res, pre) => {
      res += pre.workDayTotal;
      return res;
    }, 0);
  });
  const descData = ref({ year: '', weight: '万吨' });
  const [registerDesc] = useDescription({
    data: descData,
    labelStyle: { width: '100px' },
    column: 2,
    schema: [
      { field: 'year', label: '生产年度' },
      { field: 'weight', label: '重量单位' },
    ],
  });

  const [registerMonthPlanTable, { setTableData: setMonthPlanTableData, getDataSource }] = useTable(
    {
      showIndexColumn: false,
      pagination: false,
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
              return {
                rowSpan: list.length - rawCoalList.length,
                style: { background: '#d8eaff' },
              };
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
    },
  );

  const [
    registerYearPlanTable,
    {
      // setTableData: setYearPlanTableData
    },
  ] = useTable({
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

  watch(
    [monthWorkDays, schemas, monthDetailsData],
    ([monthWorkDays, schemas, monthDetailsData]) => {
      if (!monthWorkDays.length || !schemas || !monthDetailsData) return;
      console.log(
        'monthWorkDays, schemas, monthDetailsData :>> ',
        monthWorkDays,
        schemas,
        monthDetailsData,
      );
      descData.value.year = dateUtil(monthDetailsData.year).format('YYYY');

      const monthProductions = cloneDeep(monthDetailsData.monthProductions);

      schemas.forEach((schema) => {
        const monthProductionItem = monthProductions?.find(
          (v) => v.productionId === schema.productionId,
        );
        if (monthProductionItem) {
          schema.monthAmounts = monthProductionItem.monthAmounts;
        } else {
          schema.monthAmounts = new Array(12).fill(0).map((_, i) => {
            return {
              amount: 0,
              month: i + 1,
              productionId: schema.productionId,
            };
          });
        }
      });

      const monthPlanList = parseMonthPlanTableData(schemas, monthWorkDays);
      monthPlanTableData.value = monthPlanList; // 备份表格数据，用做单元格合并时判断的条件
      setMonthPlanTableData(monthPlanList); // 拼接原始数据，生成每月明细表格展示的格式
    },
    {
      immediate: true,
    },
  );

  function handleChangeCol() {
    const tableData = getDataSource();
    const data = parseStep2FormTable(tableData, monthWorkDays.value);
    setMonthPlanTableData(data); // 拼接原始数据，生成每月明细表格展示的格式
  }

  function submit() {
    const tableData = getDataSource();
    console.log('tableData :>> ', tableData);
  }

  defineExpose({
    submit,
  });
</script>

<style scoped>
  .month-plan-table :deep(.ant-table-summary) td {
    text-align: center;
  }
</style>
