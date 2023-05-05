<template>
  <PageWrapper contentFullHeight :contentBackground="true">
    <BasicForm @register="register" @submit="handleSubmit" />
    <Row justify="end">
      <Col :span="24" class="text-right">
        <a-button-group>
          <a-button class="mr-2" @click="toWarningSettings">PLC 报警配置</a-button>
          <a-button class="mr-2" @click="toWarningRules">推送配置</a-button>
        </a-button-group>
      </Col>
    </Row>
    <BasicTable @register="registerTable" :loading="loading">
      <template #warningSource="{ record }">
        {{ alarmSrcMap[record.warningSource] || record.warningSource }}
      </template>

      <template #kind="{ record }"> {{ alarmKindMap[record.kind] || record.kind }} </template>

      <template #level="{ record }"> {{ alarmLevelMap[record.level] || record.level }} </template>

      <template #startTime="{ record }">
        {{ formatDate(record.startTime, 'YYYY-MM-DD HH:mm') }}
      </template>

      <template #endTime="{ record }">
        <span v-if="record.warningSource === '离线点检'"> -- </span>
        <span v-else></span>
        {{ formatDate(record.endTime, 'YYYY-MM-DD HH:mm') }}
      </template>

      <template #durationTime="{ record }">
        <span v-if="record.warningSource === '离线点检'"> -- </span>
        <span v-else> {{ calcDurationTime(record.endTime, record.startTime) }}</span>
      </template>

      <template #optionStatus="{ record }">
        <AlertTwoTone :two-tone-color="alarmOptionsMap[record.optionStatus].color" />
        <span class="ml-2.5"> {{ alarmOptionsMap[record.optionStatus].text }} </span>
      </template>

      <template #action="{ record }">
        <TableAction :actions="createActions(record)" />
      </template>
    </BasicTable>

    <ProcessModal @register="registerProcessModal" @done="initAlarmListData" />
    <RepairModal @register="registerRepairModal" @done="initAlarmListData" />
    <DetailModal @register="registerDetailModal" @done="initAlarmListData" />
  </PageWrapper>
</template>

<!-- <script lang="ts">
  export default {
    name: 'AlarmBoard',
  };
</script> -->

<script lang="ts" setup name="AlarmBoard">
  import { Row, Col } from 'ant-design-vue';
  // TODO 咱们这个灯能不能导出成 SVG 格式，可以省很多事
  import { AlertTwoTone } from '@ant-design/icons-vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import {
    BasicTable,
    useTable,
    PaginationProps,
    TableAction,
    ActionItem,
  } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { onMounted, nextTick, ref } from 'vue';
  import { error } from '/@/utils/log';
  import { getAlarmsListApi } from '/@/api/info/alarms';
  import type { GetAlarmsListParam, AlarmObjectModel } from '/@/api/info/model/alarmModel';
  import { schemas, columns } from './data';
  import { useUserState } from '/@/hooks/web/useUserState';
  import { formatDate } from '/@/utils/dateUtil';
  import { calcDurationTime } from './helper';
  import {
    disabledColor,
    warningColor,
    successColor,
    primaryColor,
  } from '/@/settings/designSetting';
  // import { useGo } from '/@/hooks/web/usePage';
  import { useModal } from '/@/components/Modal';
  import ProcessModal from './components/processModal.vue';
  import RepairModal from './components/repairModal.vue';
  import DetailModal from './components/detailModal.vue';

  const { getDictMap } = useUserState();
  // const go = useGo();

  const alarmSrcMap = getDictMap('DT_ALARM_SOURCE');
  const alarmKindMap = getDictMap('DT_ALARM_KIND');
  const alarmLevelMap = getDictMap('DT_ALARM_LEVEL');
  const alarmOptionsMap = {
    '1': { color: warningColor, text: '待处理' },
    '2': { color: successColor, text: '已处理' },
    '3': { color: primaryColor, text: '已报修' },
    '4': { color: disabledColor, text: '已关闭' },
  };
  const loading = ref(false);

  const [register, { getFieldsValue }] = useForm({
    labelWidth: 80,
    actionColOptions: { span: 24 },
    schemas,
  });

  const [registerTable, { setTableData, setPagination, getPaginationRef }] = useTable({
    columns,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
    onChange: async () => {
      const page = getPaginationRef() as PaginationProps;
      setPagination({ current: page.current, pageSize: page.pageSize });
      await nextTick();
      const form = getFieldsValue() as GetAlarmsListParam;

      const params: GetAlarmsListParam = {
        ...form,
        ...{ pageNo: page.current!, pageSize: page.pageSize! },
      };
      console.log('params :>> ', params);
      getAlarmsList(params);
    },
  });

  const [registerProcessModal, { openModal: openProcessModal }] = useModal();
  const [registerRepairModal, { openModal: openRepairModal }] = useModal();
  const [registerDetailModal, { openModal: openDetailModal }] = useModal();

  function createActions(record: AlarmObjectModel): ActionItem[] {
    if (record.optionStatus === 1) {
      return [
        {
          label: '处理',
          onClick: () => {
            openProcessModal(true, record);
          },
        },
        {
          label: '报修',
          onClick: () => {
            openRepairModal(true, record);
          },
        },
      ];
    } else {
      if (record.optionStatus === 3) {
        return [
          {
            label: '查看',
            onClick: () => {
              openDetailModal(true, record);
            },
          },
          {
            label: '报修单',
            onClick: () => {
              if (!record.maintenanceCode) return;
              // TODO 暂无该路由
              // go({
              //   name: 'CheckDeviceRepair',
              //   query: {
              //     maintenanceCode: record.maintenanceCode,
              //     act: 'view',
              //   },
              // });
            },
          },
        ];
      } else {
        return [
          {
            label: '查看',
            onClick: () => {
              openDetailModal(true, record);
            },
          },
        ];
      }
    }
  }

  async function getAlarmsList(params: GetAlarmsListParam) {
    loading.value = true;
    try {
      const { items, totalCount } = await getAlarmsListApi(params);
      setTableData(items || []);
      setPagination({ total: totalCount });
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }

  async function initAlarmListData() {
    await nextTick();
    const form = getFieldsValue() as GetAlarmsListParam;
    await getAlarmsList(form);
  }

  onMounted(() => {
    initAlarmListData();
  });

  function toWarningSettings() {
    console.log('跳转到PLC报警配置 >> ');
  }

  function toWarningRules() {
    console.log('跳转到报警推送配置 >> ');
  }

  function handleSubmit(values) {
    getAlarmsList(values);
  }
</script>
