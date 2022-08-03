<template>
  <PageWrapper>
    <template #headerContent>
      <BasicForm @register="register" @submit="getData" />
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
        <a-button type="primary" @click="openEditDataDrawer(true, {})">新建商品煤检测</a-button>
        <a-button type="primary" @click="openExportReportModal(true, {})">导出整月</a-button>
        <a-button>数据导入</a-button>
        <span class="text-disabled">
          上次导入时间: {{ formatDate(synchroDataTime, 'YYYY-MM-DD HH:mm') }}
        </span>
      </template>

      <template #qualified="{ record }">
        <span :class="record.qualified === 0 ? 'text-error' : ''">
          {{ qualifiedTextArr[record.qualified] }}
        </span>
      </template>
      <template #stable="{ record }">
        <span :class="record.qualified === 0 ? 'text-error' : ''">
          {{ stablesTextArr[record.stable] }}
        </span>
      </template>

      <template #action="{ record }">
        <TableAction :actions="createActions(record)" />
      </template>
    </BasicTable>

    <EditDataDrawer @register="editDataDrawer" @submit="getData" />
    <ExportReportModal @register="exportReportModal" @submit="getData" />
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
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { schemas, columns } from './data';
  import LineChart from './components/lineChart.vue';
  import PieChart from './components/pieChart.vue';
  import {
    getApprovalsListApi,
    delCommercialCoalInspectionApi,
  } from '/@/api/quality/commercialCoalInspection';
  import {
    GetCommercialCoalInspectionListParams,
    CommercialCoalInspectionModel,
  } from '/@/api/quality/model/commercialCoalInspectionModel';
  import { formatDate } from '/@/utils/dateUtil';
  import EditDataDrawer from './components/editDataDrawer.vue';
  import ExportReportModal from './components/exportReportModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();

  const [register, { getFieldsValue }] = useForm({
    labelWidth: 60,
    layout: 'inline',
    schemas,
    fieldMapToTime: [['timeRange', ['startTime', 'endTime'], 'x']],
  });

  const [registerTable, { setTableData }] = useTable({
    canResize: false,
    columns,
    actionColumn: {
      width: 160,
      title: '操作',
      fixed: 'right',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });

  const [editDataDrawer, { openDrawer: openEditDataDrawer }] = useDrawer();
  const [exportReportModal, { openModal: openExportReportModal }] = useModal();

  const loading = ref(false);
  const data = ref<CommercialCoalInspectionModel[]>([]);
  const pieChartData = ref<Nullable<{ batchQualifiedRate: number; batchStableRate: number }>>(null);
  const synchroDataTime = ref<number>();
  const qualifiedTextArr = ref(['不合格', '合格', '空', '无']);
  const stablesTextArr = ref(['不稳定', '稳定', '空', '无']);

  onMounted(() => {
    getData();
  });

  async function getData() {
    loading.value = true;
    await nextTick();
    const values = getFieldsValue() as GetCommercialCoalInspectionListParams;

    try {
      const {
        items,
        batchQualifiedRate,
        batchStableRate,
        synchroDataTime: synchro_data_time,
      } = await getApprovalsListApi(values);
      data.value = items || [];
      pieChartData.value = { batchQualifiedRate, batchStableRate };
      synchroDataTime.value = synchro_data_time;

      setTableData(items || []);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }

  function createActions(record: CommercialCoalInspectionModel): ActionItem[] {
    return [
      {
        label: '查看',
        onClick: () => {
          openEditDataDrawer(true, { data: record, edit: false });
        },
      },
      {
        label: '编辑',
        onClick: () => {
          openEditDataDrawer(true, { data: record, edit: true });
        },
      },
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，确认删除数据？',
          placement: 'left',
          confirm: async () => {
            try {
              await delCommercialCoalInspectionApi(record.id);
              createMessage.success('删除成功');
              await getData();
            } catch (error: any) {
              throw new Error(error);
            }
          },
        },
      },
    ];
  }
</script>
