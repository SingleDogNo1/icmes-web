<template>
  <PageWrapper contentFullHeight dense contentBackground :class="prefixCls" ref="powerFailureRef">
    <PowerCutNotice :data="todayPowerCutCount" @choose="handleChooseNotice" />
    <BasicForm :class="`${prefixCls}-form`" @register="register" @submit="getTableData" />

    <BasicTable
      :loading="loading"
      @register="registerTable"
      @selection-change="handleSelectionChange"
    >
      <template #tableTitle>
        <Tag closable @close.prevent>筛选条件：当日终止</Tag>
      </template>

      <template #toolbar>
        <a-button type="primary">新建</a-button>
        <Tooltip
          :title="dispatchFlag ? '先勾选“待确认的”的停送电单，一次最多批量操作10单。' : null"
          placement="bottom"
        >
          <!-- disable 状态的 button 不能作为子元素出现(https://next.antdv.com/components/tooltip-cn#注意) -->
          <div>
            <a-button type="primary" :disabled="dispatchFlag" @click="handleDispatchConfirm">
              调度确认
            </a-button>
          </div>
        </Tooltip>
        <Tooltip
          :title="exportTicketFlag ? '请先勾选含高压设备的单据(也可筛选后再批量勾选)' : null"
          placement="bottom"
        >
          <!-- disable 状态的 button 不能作为子元素出现(https://next.antdv.com/components/tooltip-cn#注意) -->
          <div>
            <a-button
              type="primary"
              postIcon="ph:warning-circle-light"
              :iconSize="16"
              :disabled="exportTicketFlag"
              @click="handleExportTicket"
            >
              导出高压工作票
            </a-button>
          </div>
        </Tooltip>
      </template>

      <!-- 计划停电时间 -->
      <template #scheduledCutOffTime="{ record }">
        <Tooltip placement="bottom">
          <template #title>
            <p>计划停电时间: {{ formatDate(record.scheduledCutOffTime, 'YYYY-MM-DD HH:mm') }}</p>
            <p>计划送电时间: {{ formatDate(record.scheduledSupplyTime, 'YYYY-MM-DD HH:mm') }}</p>
            <p>
              计划时长: {{ diffDateTime(record.scheduledSupplyTime, record.scheduledCutOffTime) }}
            </p>
          </template>
          <span> {{ formatDate(record.scheduledCutOffTime, 'YYYY-MM-DD HH:mm') }}</span>
        </Tooltip>
      </template>

      <!-- 停送电设备 -->
      <template #mainDevices="{ record }">
        <!-- 以ELEC_SP开头的设备表示为特殊设备 -->
        <div v-if="record.type.startsWith('ELEC_SP')">
          <Tooltip placement="bottom">
            <template #title>
              <p>停送电内容</p>
              <span>{{ record.content }}</span>
            </template>
            <Tag :color="primaryColor"> {{ record.content }} </Tag>
          </Tooltip>
        </div>
        <div v-else>
          <DeviceTooltip desc="停送电设备" :devicesList="record.mainDevices" @choose="toDetail" />
        </div>
      </template>

      <!-- 关联设备 && 非常规设备 -->
      <template #otherDevices="{ record }">
        <div v-if="!record.type.startsWith('ELEC_SP')">
          <DeviceTooltip desc="关联设备等" :devicesList="record.otherDevices" @choose="toDetail" />
        </div>
      </template>

      <!-- 关联检修单 -->
      <template #outerAssModel="{ record }">
        <div v-if="record.outerAssModel">
          <Tooltip placement="bottom">
            <template #title>
              <p>检修单号: {{ record.outerAssModel.code || '' }}</p>
              <p>检修项目名称: {{ record.outerAssModel.name || '' }}</p>
            </template>
            <span class="text-primary" @click="toMaintenanceDetail(record)">
              {{ record.outerAssModel.name }}
            </span>
          </Tooltip>
        </div>
      </template>

      <!-- 部门 -->
      <template #department="{ record }">
        <Tooltip placement="bottom" :title="record.contactOrgName">
          {{
            record.contactOrgName === '赵楼选煤厂'
              ? record.contactOrgName
              : record.contactOrgName.replace('赵楼选煤厂/', '')
          }}
        </Tooltip>
      </template>

      <!-- 状态 -->
      <template #status="{ record }">
        <span class="text-primary mr-1 cursor-pointer" @click="openWorkflowModal(record)">
          {{ powerCutStatusMap[record.status] }}
        </span>
        <Tooltip placement="bottom">
          <template #title>
            <div v-if="record.testSupplyDevices.length > 0">
              <p>送电试车</p>
              <div v-for="(item, index) in record.testSupplyDevices" :key="index">
                <span class="mr-2"> {{ item.processNo || item.deviceCode }} </span>
              </div>
            </div>
            <div v-if="record.testCutDevices.length > 0">
              <p>试车停电</p>
              <div v-for="(item, index) in record.testCutDevices" :key="index">
                <span class="mr-2"> {{ item.processNo || item.deviceCode }} </span>
              </div>
            </div>
          </template>
          <ExclamationCircleOutlined
            v-if="
              record.status === 'POWER_CUT_WAIT_DISPATCH_TEST' &&
              (record.testSupplyDevices.length > 0 || record.testCutDevices.length > 0)
            "
            :style="{ color: errorColor }"
            class="cursor-pointer"
          />
        </Tooltip>
      </template>

      <!-- 操作 -->
      <template #action="{ record }">
        <TableAction
          :actions="createActions(record)"
          :dropDownActions="createDropDownActions(record)"
        />
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { nextTick, onMounted, ref } from 'vue';
  import { Tooltip, Tag } from 'ant-design-vue';
  import { map } from 'lodash-es';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import {
    BasicTable,
    useTable,
    PaginationProps,
    TableAction,
    ActionItem,
  } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import DeviceTooltip from './components/deviceTooltip.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { schemas, columns } from './data';
  import PowerCutNotice from './components/notification.vue';
  import {
    getPowerCutFormListApi,
    getPowerCutTodayCountApi,
    withdrawPowerCutFormApi,
    exportPowerCutTicketApi,
  } from '/@/api/power/form';
  import { GetPowerCutFormListParams } from '/@/api/power/model/formModel';
  import { PowerCutFormFullModel, DeviceInfoModel } from '/@/api/power/model/basicModel';
  import { useWebSocket } from '/@/hooks/web/useWebSocket';
  import { formatDate, diffDateTime } from '/@/utils/dateUtil';
  import { primaryColor, errorColor } from '/@/settings/designSetting';
  import { cloneDeep } from 'lodash-es';
  import { useUserState } from '/@/hooks/web/useUserState';
  import { useUserStore } from '/@/store/modules/user';
  import { useRoute } from 'vue-router';
  import { downloadByData } from '/@/utils/file/download';

  const { getDictMap } = useUserState();
  const powerCutStatusMap = getDictMap('BT_POWER_CUT_STATUS');
  const {
    meta: { code: routeCode },
  } = useRoute();

  const { prefixCls } = useDesign('power-failure');
  const powerFailureRef = ref<any>(null);
  const loading = ref(false);
  const todayPowerCutCount = ref(); // 当日各停送电单数量
  const { getUserInfo, getFeature } = useUserStore();
  const userId = getUserInfo.userId;
  const routePermission = getFeature[routeCode!];
  const dispatchFlag = ref(true); // 表格头部, 调度确认按钮是否可操作
  const exportTicketFlag = ref(false); // 表格头部, 导出操作票按钮是否可操作
  const waitConfirmList = ref<PowerCutFormFullModel[]>([]); // 待调度确认状态的停送电单
  const exportFormCodes = ref<string[]>([]); // 选中的导出高压操作票停送电单的 code 集合

  const [register, { getFieldsValue, setFieldsValue }] = useForm({
    schemas,
    labelWidth: 60,
    autoSubmitOnEnter: true,
    fieldMapToTime: [['timeRange', ['cutStartTime', 'cutEndTime'], 'x']],
  });

  const [registerTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    columns,
    rowSelection: {
      type: 'checkbox',
    },
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
    onChange: () => {
      const page = getPaginationRef() as PaginationProps;
      setFieldsValue({ pageNo: page.current, pageSize: page.pageSize });
      nextTick(() => {
        const data = getFieldsValue() as GetPowerCutFormListParams;
        getPowerCutFormList({ ...data, ...{ pageNo: page.current, pageSize: page.pageSize } });
      });
    },
  });

  async function getPowerCutFormList(params: GetPowerCutFormListParams) {
    try {
      loading.value = true;
      const { items, totalCount } = await getPowerCutFormListApi(params);

      const list = cloneDeep(items || []) as unknown as (PowerCutFormFullModel & {
        // 除主设备外其他设备的列表
        otherDevices: DeviceInfoModel[];
        // 送点试车中设备列表
        testSupplyDevices: DeviceInfoModel[];
        // 送点试车中设备列表
        testCutDevices: DeviceInfoModel[];
      })[];

      list.map((item) => {
        item.otherDevices = [...(item.assDevices || []), ...(item.irregularDevices || [])];

        // 主设备送电试车设备列表
        const mainDeviceTestSupplyList = (item.mainDevices || []).filter(
          (val) => val.status === 'POWER_DETAIL_WAIT_DISPATCH',
        );
        // 附属设备送电试车设备列表
        const assDeviceTestSupplyList = (item.assDevices || []).filter(
          (val) => val.status === 'POWER_DETAIL_WAIT_DISPATCH',
        );
        // 送电试车设备列表
        item.testSupplyDevices = [...mainDeviceTestSupplyList, ...assDeviceTestSupplyList];

        // 主设备停电试车设备列表
        const mainDeviceTestCutList = (item.mainDevices || []).filter((val) => {
          return val.status === 'POWER_DETAIL_WAIT_DISPATCH_CUT';
        });
        // 附属设备停电试车设备列表
        const assDeviceTestCutList = (item.assDevices || []).filter((val) => {
          return val.status === 'POWER_DETAIL_WAIT_DISPATCH_CUT';
        });
        // 停电试车设备列表
        item.testCutDevices = [...mainDeviceTestCutList, ...assDeviceTestCutList];
      });

      setTableData(list);
      setPagination({ total: totalCount });
    } catch (error) {
      throw new Error(JSON.stringify(error));
    } finally {
      loading.value = false;
    }
  }

  async function getTableData() {
    await nextTick();
    const data = getFieldsValue() as GetPowerCutFormListParams;
    console.log('data :>> ', data);
    getPowerCutFormList(data);
  }

  useWebSocket({
    onPowerCutFormTodayCount: (data) => {
      console.log('businessData :>> ', data);
      todayPowerCutCount.value = data;
    },
  });

  onMounted(async () => {
    try {
      const data = await getPowerCutTodayCountApi();
      todayPowerCutCount.value = data;

      await getTableData();
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  });

  function createActions(record: PowerCutFormFullModel): ActionItem[] {
    return [
      {
        label: '查看',
        onClick: () => {
          console.log('查看操作 :>> ', record);
        },
      },
    ];
  }

  function createDropDownActions(record: PowerCutFormFullModel) {
    const actions: ActionItem[] = [];

    if (
      record.createUserId === userId &&
      ['POWER_CUT_TICKET', 'POWER_CUT_COMMIT'].includes(record.status)
    ) {
      // 当前用户为单据创建者, 且停送电单状态为 填写高压操作票 / 待审批, 有权限执行撤回操作
      actions.push({
        label: '撤回',
        color: 'warning',
        popConfirm: {
          title: '是否确认撤回?',
          confirm: async () => {
            console.log('撤回操作 :>> ', record);
            try {
              await withdrawPowerCutFormApi(record.code);

              await getTableData();
            } catch (error) {
              throw new Error(JSON.stringify(error));
            }
          },
        },
      });
    }

    if (
      record.createUserId === userId &&
      ['POWER_CUT_RECALL', 'POWER_CUT_REJECTED'].includes(record.status)
    ) {
      // 当前用户为单据创建者, 且停送电单状态为 撤回 / 审批驳回, 有权限执行编辑操作
      actions.push({
        label: '编辑',
        onClick: () => {
          console.log('编辑操作 :>> ', record);
        },
      });
    }

    if (record.executable && record.status === 'POWER_CUT_TICKET') {
      // 当前用户有操作权限, 且停送电单状态为 填写高压操作票, 有权限执行填写高压操作票
      actions.push({
        label: '工作票',
        onClick: () => {
          console.log('工作票操作 :>> ', record);
        },
      });
    }

    if (
      (userId === record.createUserId || routePermission.POWER_CUT_DELETE) &&
      ['POWER_CUT_REJECTED', 'POWER_CUT_RECALL'].includes(record.status)
    ) {
      // 当前用户为单据创建者或者账号有删除权限, 且停送电单状态为 撤回 / 审批驳回, 有权限执行删除操作
      actions.push({
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，确认删除数据？',
          confirm: async () => {
            console.log('删除操作 :>> ', record);
          },
        },
      });
    }

    if (
      record.executable &&
      routePermission.POWER_CUT_DISPATCH &&
      [
        'POWER_CUT_WAIT_CONFIRM',
        'POWER_CUT_WAIT_DISPATCH',
        'POWER_CUT_WAIT_DISPATCH_TEST',
      ].includes(record.status)
    ) {
      // 当前用户有操作权限, 且停送电单状态为 待调度确认, 有权限执行调度确认
      actions.push({
        label: '调度确认',
        onClick: () => {
          console.log('调度确认操作 :>> ', record);
        },
      });
    }

    if (
      record.executable &&
      routePermission.POWER_CUT_DISPATCH &&
      !record.type.startsWith('ELEC_SP') &&
      record.status === 'POWER_CUT_WAIT_CONFIRM'
    ) {
      // 当前用户有操作权限, 停送电单不是特殊停送电, 且停送电单状态为 待调度确认, 有权限执行调度确认(部分确认)
      actions.push({
        label: '部分确认',
        onClick: () => {
          console.log('部分确认操作 :>> ', record);
        },
      });
    }

    if (
      record.executable &&
      routePermission.POWER_CUT_DISPATCH &&
      record.status === 'POWER_CUT_WAIT_CONFIRM'
    ) {
      // 当前用户有操作权限, 且停送电单状态为 待调度确认, 有权限执行调度终止
      actions.push({
        label: '调度终止',
        onClick: () => {
          console.log('调度终止操作 :>> ', record);
        },
      });
    }

    if (
      routePermission.POWER_CUT_CLOSE &&
      [
        'POWER_CUT_DURING',
        'POWER_CUT_WAIT_DISPATCH',
        'POWER_CUT_WAIT_DISPATCH_TEST',
        'POWER_CUT_WAIT_SUPPLY',
      ].includes(record.status)
    ) {
      // 当前用户有终止权限, 且停送电单状态为 停送电中 / 待调度确认(试车) / 待调度确认(流程结束) / 待电工送电(非常规停电), 有权限执行终止
      actions.push({
        label: '终止',
        onClick: () => {
          console.log('终止操作 :>> ', record);
        },
      });
    }

    if (
      routePermission.POWER_CUT_CHANGE &&
      [
        'POWER_CUT_APPROVED',
        'POWER_CUT_WAIT_CONFIRM',
        'POWER_CUT_DURING',
        'POWER_CUT_WAIT_DISPATCH',
        'POWER_CUT_WAIT_DISPATCH_TEST',
        'POWER_CUT_WAIT_SUPPLY',
      ].includes(record.status)
    ) {
      // 当前用户有变更联系人权限, 且停送电单状态为 待联系人申请停电 / 待调度确认 / 停送电中, 有权限执行变更联系人
      actions.push({
        label: '变更联系人',
        onClick: () => {
          console.log('变更联系人操作 :>> ', record);
        },
      });
    }

    if (
      routePermission.POWER_CUT_EDIT &&
      [
        'POWER_CUT_APPROVED',
        'POWER_CUT_WAIT_CONFIRM',
        'POWER_CUT_DURING',
        'POWER_CUT_COMPLETE',
        'POWER_CUT_CLOSE',
        'POWER_CUT_ONLY_APPROVAL',
        'POWER_CUT_WAIT_DISPATCH',
        'POWER_CUT_WAIT_DISPATCH_TEST',
        'POWER_CUT_WAIT_SUPPLY',
      ].includes(record.status)
    ) {
      // 当前用户有编辑停送电单权限, 且停送电单状态为 待联系人申请停电 / 待调度确认 / 待调度确认(试车) / 待调度确认(流程结束) / 停送电中 / 已完成 / 终止 / 已完成(只审批) / 待电工送电(非常规停电), 有权限执行复制
      actions.push({
        label: '复制',
        onClick: () => {
          console.log('复制操作 :>> ', record);
        },
      });
    }

    return actions;
  }

  function handleSelectionChange({ rows }: { rows: PowerCutFormFullModel[] }) {
    console.log('val :>> ', rows);
    if (rows.length === 0) {
      dispatchFlag.value = true;
      exportTicketFlag.value = true;
      waitConfirmList.value = [];
    } else {
      // 选中的状态是且只是 待调度确认 相关状态
      const waitConfirmOnly = rows.every((item) =>
        [
          'POWER_CUT_WAIT_CONFIRM',
          'POWER_CUT_WAIT_DISPATCH',
          'POWER_CUT_WAIT_DISPATCH_TEST',
        ].includes(item.status),
      );

      rows.map((item) => {
        // 获取待调度确认状态的停送电单数组
        if (
          [
            'POWER_CUT_WAIT_CONFIRM',
            'POWER_CUT_WAIT_DISPATCH',
            'POWER_CUT_WAIT_DISPATCH_TEST',
          ].includes(item.status)
        ) {
          waitConfirmList.value.push(item);
        }
        // 获取所有高压设备code
        if (
          map(item.mainDevices, 'powerType').includes(1) ||
          map(item.assDevices, 'powerType').includes(1) ||
          map(item.irregularDevices, 'powerType').includes(1) ||
          item.hvFlag === true
        ) {
          exportFormCodes.value.push(item.code);
        }
      });

      dispatchFlag.value =
        !waitConfirmOnly || (waitConfirmOnly && waitConfirmList.value.length >= 11);

      // 查看每一个选择的单据状态，是不是全都含有高压设备
      const highVoltageFlag = rows.every(
        (item) =>
          map(item.mainDevices, 'powerType').includes(1) ||
          map(item.assDevices, 'powerType').includes(1) ||
          map(item.irregularDevices, 'powerType').includes(1) ||
          item.hvFlag === true,
      );
      exportTicketFlag.value = !highVoltageFlag;
    }
  }

  function handleDispatchConfirm() {
    console.log('批量操作调度确认 :>> ', waitConfirmList.value);
  }

  async function handleExportTicket() {
    console.log('导出高压操作票 :>> ', exportFormCodes.value);
    // if (exportFormCodes.value.length === 1) {
    try {
      // const data = await exportPowerCutTicketApi('pdf', exportFormCodes.value.join(','));
      const data = await exportPowerCutTicketApi('pdf', 'PC20211122005');
      console.log('data :>> ', data);
      downloadByData(data, `${exportFormCodes.value[0]}.pdf`, 'application/pdf;charset=utf-8');
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
    // }
  }

  function handleChooseNotice(item) {
    console.log('item :>> ', item);
  }

  function toDetail(item) {
    console.log('item :>> ', item);
  }

  function toMaintenanceDetail(record) {
    console.log('record :>> ', record);
  }

  function openWorkflowModal(record) {
    console.log('record :>> ', record);
  }
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-power-failure';
  @form-prefix-cls: ~'@{prefix-cls}-form';

  .@{form-prefix-cls} {
    @apply pt-5 px-4;
  }
</style>

<style lang="less">
  @prefix-cls: ~'@{namespace}-power-failure';
  @tooltip-prefix-cls: ~'@{prefix-cls}-device-tooltip';
  .@{tooltip-prefix-cls} {
    .device-item {
      display: flex;
      font-size: 14px;
      margin-bottom: 10px;

      img {
        height: 20px;
        margin-right: 10px;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>
