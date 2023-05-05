<template>
  <PageWrapper content-background content-full-height>
    <BasicForm @register="registerForm" @submit="getTableData(formData)" />

    <BasicTable :loading="loading" @register="registerTable">
      <template #tableTitle>
        <a-button
          type="primary"
          :disabled="!editPermission"
          @click="openEditYearPlanDrawer(true, { type: 'create', recordId: null })"
        >
          新建
        </a-button>
      </template>

      <template #status="{ record }: { record: ProductionPlanBaseModel }">
        <Icon v-if="record.status === 0" icon="mdi:alarm-light" :color="warningColor" />
        <Icon v-if="record.status === 1" icon="mdi:alarm-light" :color="successColor" />
        <Icon v-if="record.status === 2" icon="mdi:alarm-light-off" :color="disabledColor" />
        {{ genStatusText(record.status) }}
      </template>

      <template #process="{ record }: { record: ProductionPlanBaseModel }">
        <Popover v-if="record.statistics">
          <template #content>
            <Descriptions bordered :column="2">
              <Descriptions.Item label="计划入洗总量">
                {{ parseFloatNumber(record.statistics.planWashingTotal) }}吨
              </Descriptions.Item>
              <Descriptions.Item label="已完成入洗总量">
                {{ parseFloatNumber(record.statistics.currentRealWashing) }}吨
              </Descriptions.Item>
              <Descriptions.Item label="截止今日应入洗">
                {{ parseFloatNumber(record.statistics.currentPlanWashing) }}吨
              </Descriptions.Item>
              <Descriptions.Item label="进度差距">
                {{
                  parseFloatNumber(
                    record.statistics.currentRealWashing - record.statistics.currentPlanWashing,
                  )
                }}吨
              </Descriptions.Item>
            </Descriptions>
          </template>
          <Progress
            :stroke-color="
              parseFloatNumber(
                record.statistics.currentRealWashing - record.statistics.currentPlanWashing,
              ) >= 0
                ? successColor
                : errorColor
            "
            :percent="
              parseFloatNumber(
                (record.statistics.currentRealWashing / record.statistics.planWashingTotal) * 100,
                0,
              )
            "
          />
        </Popover>
        <Progress v-else :percent="0" />
      </template>

      <!-- 操作 -->
      <template #action="{ record }">
        <TableAction :actions="createActions(record)" />
      </template>
    </BasicTable>
  </PageWrapper>

  <EditPlanDrawer @register="registerEditDrawer" />
</template>

<script lang="ts" setup name="MonthPlan">
  import { ref, nextTick, onMounted, reactive } from 'vue';
  import { Descriptions, Progress, Popover } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';
  import {
    BasicTable,
    useTable,
    PaginationProps,
    TableAction,
    ActionItem,
  } from '/@/components/Table';
  import { Icon } from '/@/components/Icon';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getProductionPlanListApi, delProductionPlanApi } from '/@/api/production/plan';
  import { GetProductionPlanParams, ProductionPlanBaseModel } from '/@/api/production/model/plan';
  import { ProductionPlanStatusEnum } from '/@/api/production/model/basicModel';
  import { useDrawer } from '/@/components/Drawer';
  import EditPlanDrawer from './EditPlanDrawer.vue';
  import { successColor, warningColor, disabledColor, errorColor } from '/@/settings/designSetting';
  import { dateUtil } from '/@/utils/dateUtil';
  import { parseFloatNumber } from '/@/utils';
  import { error } from '/@/utils/log';

  const { createMessage } = useMessage();
  const { getPermissionList } = usePermission();

  const loading = ref(false);
  const editPermission = !!getPermissionList()?.PROD_PLAN_EDIT;
  const formData = reactive<GetProductionPlanParams>({
    ascending: false,
    orderBy: 'startDate',
    pageSize: 10,
    pageNo: 1,
  });

  const [registerEditDrawer, { openDrawer: openEditYearPlanDrawer }] = useDrawer();

  const [registerForm] = useForm({
    layout: 'inline',
    schemas: [
      {
        field: 'timeRange',
        component: 'RangePicker',
        label: '生产日期',
        colProps: {
          span: 6,
        },
        componentProps: {
          format: 'YYYY-MM-DD',
          showTime: {
            defaultValue: [dateUtil().startOf('day'), dateUtil().endOf('day')],
          },
        },
      },
    ],
    labelWidth: 60,
    autoSubmitOnEnter: true,
    fieldMapToTime: [['timeRange', ['startDate', 'endDate'], 'x']],
  });

  const [registerTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    columns: [
      {
        title: '计划单号',
        dataIndex: 'code',
      },
      {
        title: '生产开始时间',
        dataIndex: 'startDate',
        format: (date: ProductionPlanBaseModel['startDate']) => {
          if (!date) return '';
          return dateUtil(date).format('YYYY-MM-DD');
        },
      },
      {
        title: '生产结束时间',
        dataIndex: 'endDate',
        format: (date: ProductionPlanBaseModel['endDate']) => {
          if (!date) return '';
          return dateUtil(date).format('YYYY-MM-DD');
        },
      },
      {
        title: '计划入洗原煤',
        dataIndex: 'productionName',
      },
      {
        title: '数量',
        dataIndex: 'statistics',
        format: (statistics: ProductionPlanBaseModel['statistics']) => {
          if (!statistics) return '';
          return parseFloatNumber(statistics.planWashingTotal, 0) + '吨';
        },
      },
      {
        title: '计划状态',
        dataIndex: 'status',
        slots: { customRender: 'status' },
      },
      {
        title: '入洗原煤进度',
        dataIndex: 'process',
        slots: { customRender: 'process' },
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

  onMounted(() => {
    getTableData(formData);
  });

  function genStatusText(status: ProductionPlanBaseModel['status']) {
    let text = '';
    switch (status) {
      case ProductionPlanStatusEnum['PENDING']:
        text = '待生产';
        break;
      case ProductionPlanStatusEnum['DURING']:
        text = '生产中';
        break;
      case ProductionPlanStatusEnum['END']:
        text = '已结束';
        break;
    }
    return text;
  }

  function createActions(record: ProductionPlanBaseModel): ActionItem[] {
    if (!editPermission) return [];

    return [
      {
        label: '查看',
        onClick: () => {
          openEditYearPlanDrawer(true, { type: 'view', recordId: record.id });
        },
      },
      {
        label: '编辑',
        onClick: () => {
          console.log('编辑操作 :>> ', record);
          openEditYearPlanDrawer(true, { type: 'edit', recordId: record.id });
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
              await delProductionPlanApi(record.id);
              createMessage.success('删除成功');
              await getTableData(formData);
            } catch (err: any) {
              error(err);
            } finally {
              loading.value = false;
            }
          },
        },
      },
    ];
  }

  async function getTableData(data: GetProductionPlanParams) {
    try {
      loading.value = true;
      const { items, totalCount } = await getProductionPlanListApi(data);

      setTableData(items || []);
      setPagination({ total: totalCount });
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }
</script>
