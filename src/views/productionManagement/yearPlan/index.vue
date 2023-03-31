<template>
  <PageWrapper content-background content-full-height>
    <BasicTable :loading="loading" @register="registerTable">
      <template #tableTitle>
        <a-button
          type="primary"
          :disabled="!editPermission"
          @click="openEditYearPlanDrawer(true, {})"
        >
          新建
        </a-button>
      </template>

      <!-- 操作 -->
      <template #action="{ record }">
        <TableAction :actions="createActions(record)" />
      </template>
    </BasicTable>
  </PageWrapper>

  <ViewYearPlanDrawer @register="registerViewDrawer" />
  <EditYearPlanDrawer @register="registerEditDrawer" />
</template>

<script lang="ts" setup name="YearPlan">
  import { ref, nextTick, onMounted, reactive } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import {
    BasicTable,
    useTable,
    PaginationProps,
    TableAction,
    ActionItem,
  } from '/@/components/Table';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getyearPlansListApi, deleteYearPlanApi } from '/@/api/production/yearPlan';
  import {
    GetProductionYearPlanParams,
    ProductionYearPlanBaseModel,
  } from '/@/api/production/model/yearPlanModel';
  import { useDrawer } from '/@/components/Drawer';
  import ViewYearPlanDrawer from './ViewYearPlanDrawer.vue';
  import EditYearPlanDrawer from './EditYearPlanDrawer.vue';
  import { parseFloatNumber } from './helper';

  const { createMessage } = useMessage();
  const { getPermissionList } = usePermission();

  const loading = ref(false);
  const editPermission = !!getPermissionList()?.PROD_YEAR_PLAN_EDIT;
  const formData = reactive({ ascending: false, orderBy: 'Year', pageNo: 1, pageSize: 10 });

  const [registerViewDrawer, { openDrawer: openViewYearPlanDrawer }] = useDrawer();
  const [registerEditDrawer, { openDrawer: openEditYearPlanDrawer }] = useDrawer();

  const [registerTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    columns: [
      {
        title: '生产年度',
        dataIndex: 'year',
      },
      {
        title: '计划入洗原煤(万吨)',
        dataIndex: 'planInTotalAmount',
        format: (amount: ProductionYearPlanBaseModel['planInTotalAmount']) => {
          if (!amount) return '';
          return parseFloatNumber(amount);
        },
      },
      {
        title: '计划产出精煤(万吨)',
        dataIndex: 'cleanCoalAmount',
        format: (amount: ProductionYearPlanBaseModel['cleanCoalAmount']) => {
          if (!amount) return '';
          return parseFloatNumber(amount);
        },
      },
      {
        title: '精煤产率',
        dataIndex: 'cleanCoalProductivity',
        format: (amount: ProductionYearPlanBaseModel['cleanCoalProductivity']) => {
          if (!amount) return '';
          return parseFloatNumber(amount * 100) + '%';
        },
      },
    ],
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
    onChange: () => {
      const page = getPaginationRef() as PaginationProps;
      nextTick(() => {
        const form = { ...formData, ...{ pageNo: page.current!, pageSize: page.pageSize! } };
        getTableData(form);
      });
    },
  });

  function createActions(record: ProductionYearPlanBaseModel): ActionItem[] {
    if (!editPermission) return [];

    return [
      {
        label: '查看',
        onClick: () => {
          openViewYearPlanDrawer(true, record.id);
        },
      },
      {
        label: '编辑',
        onClick: () => {
          console.log('编辑操作 :>> ', record);
          openEditYearPlanDrawer(true, { id: record.id });
        },
      },
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，确认删除数据？',
          confirm: async () => {
            try {
              loading.value = true;
              await deleteYearPlanApi(record.id);
              createMessage.success('删除成功');
              await getTableData(formData);
            } catch (error) {
              throw new Error(JSON.stringify(error));
            } finally {
              loading.value = false;
            }
          },
        },
      },
    ];
  }

  onMounted(() => {
    getTableData(formData);
  });

  async function getTableData(data: GetProductionYearPlanParams) {
    try {
      loading.value = true;
      const { items, totalCount } = await getyearPlansListApi(data);

      setTableData(items || []);
      setPagination({ total: totalCount });
    } catch (error) {
      throw new Error(JSON.stringify(error));
    } finally {
      loading.value = false;
    }
  }
</script>
