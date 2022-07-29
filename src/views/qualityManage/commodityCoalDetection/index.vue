<template>
  <PageWrapper>
    <template #headerContent>
      <BasicForm @register="register" @submit="getLogList" />
    </template>

    <div class="flex">
      <div class="w-6/10 !mr-4 enter-y bg-white">
        <LineChart :loading="loading" :data="data" />
      </div>
      <div class="w-4/10 enter-y bg-white">
        <PieChart :loading="loading" :data="pieChartData!" />
      </div>
    </div>

    <BasicTable class="mt-4" @register="registerTable" :loading="loading">
      <template #toolbar>
        <a-button type="primary">新建商品煤检测</a-button>
        <a-button>数据导入</a-button>
      </template>

      <template #qualified="{ record }">
        <span :class="record.qualified === 0 ? 'text-danger' : ''">
          {{ qualifiedTextArr[record.qualified] }}
        </span>
      </template>
      <template #stable="{ record }">
        <span :class="record.qualified === 0 ? 'text-danger' : ''">
          {{ stablesTextArr[record.stable] }}
        </span>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'CommodityCoalDetection',
  };
</script>

<script lang="ts" setup>
  import { ref, nextTick, onMounted } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTable, useTable } from '/@/components/Table';
  import { schemas } from './data';
  import LineChart from './components/lineChart.vue';
  import PieChart from './components/pieChart.vue';
  import { getApprovalsListApi } from '/@/api/quality/commercialCoalInspection';
  import {
    GetCommercialCoalInspectionListParams,
    CommercialCoalInspectionModel,
  } from '/@/api/quality/model/commercialCoalInspectionModel';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useUserState } from '/@/hooks/web/useUserState';

  const { getDictMap } = useUserState();

  const coalTypeMap = getDictMap('DT_PROD_CHECK_MINE');
  const directionMap = getDictMap('DT_PROD_CHECK_ DIREC');

  const [register, { getFieldsValue }] = useForm({
    labelWidth: 60,
    layout: 'inline',
    schemas,
    fieldMapToTime: [['timeRange', ['startTime', 'endTime'], 'x']],
  });

  const [registerTable, { setTableData }] = useTable({
    pagination: false,
    canResize: false,
    maxHeight: 200, // TODO 不生效？
    columns: [
      {
        title: '日期',
        dataIndex: 'inspectionDate',
        fixed: 'left',
        customRender: ({ record }) => {
          return dateUtil(record.inspectionDate, 'YYYY-MM-DD');
        },
      },
      {
        title: '矿别',
        dataIndex: 'coalType',
        fixed: 'left',
        customRender: ({ record }) => {
          return coalTypeMap[record.loadingPlanBaseModel.coalType];
        },
      },
      {
        title: '流向',
        dataIndex: 'direction',
        customRender: ({ record }) => {
          return directionMap[record.loadingPlanBaseModel.direction];
        },
      },
      {
        title: '产品',
        dataIndex: 'productionVariety',
        customRender: ({ record }) => {
          return record.loadingPlanBaseModel.productionVariety;
        },
      },
      {
        title: '发运量(T)',
        dataIndex: 'tonnage',
        customRender: ({ record }) => {
          return record.loadingPlanBaseModel.tonnage ?? '-';
        },
      },
      { title: '化验编号', dataIndex: 'batchNumber' },
      {
        title: '全水分Mt(%)',
        dataIndex: 'mt',
        customRender: ({ record }) => {
          return record.mt ?? '-';
        },
      },
      {
        title: '灰分Ad(%)',
        dataIndex: 'ad',
        customRender: ({ record }) => {
          return record.ad ?? '-';
        },
      },
      {
        title: '挥发分Vdaf(%)',
        dataIndex: 'vdaf',
        customRender: ({ record }) => {
          return record.vdaf ?? '-';
        },
      },
      {
        title: '全硫St,d(%)',
        dataIndex: 'std',
        customRender: ({ record }) => {
          return record.std ?? '-';
        },
      },
      {
        title: 'Qnet,ar(Cal/g)',
        dataIndex: 'qnetArCal',
        customRender: ({ record }) => {
          return record.qnetArCal ?? '-';
        },
      },
      {
        title: '质量区间',
        dataIndex: 'qualityRange',
        customRender: ({ record }) => {
          return record.qualityRange ?? '-';
        },
      },
      { title: '合格', dataIndex: 'qualified', slots: { customRender: 'qualified' } },
      { title: '稳定', dataIndex: 'stable', slots: { customRender: 'stable' } },
    ],
  });

  const loading = ref(false);
  const data = ref<CommercialCoalInspectionModel[]>([]);
  const pieChartData = ref<Nullable<{ batchQualifiedRate: number; batchStableRate: number }>>(null);
  const qualifiedTextArr = ref(['不合格', '合格', '空', '无']);
  const stablesTextArr = ref(['不稳定', '稳定', '空', '无']);

  onMounted(() => {
    getLogList();
  });

  async function getLogList() {
    loading.value = true;
    await nextTick();
    const values = getFieldsValue() as GetCommercialCoalInspectionListParams;

    try {
      const { items, batchQualifiedRate, batchStableRate } = await getApprovalsListApi(values);
      data.value = items || [];
      pieChartData.value = { batchQualifiedRate, batchStableRate };
      setTableData(items || []);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }
</script>
