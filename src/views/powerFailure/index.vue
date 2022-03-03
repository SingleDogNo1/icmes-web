<template>
  <PageWrapper contentFullHeight dense contentBackground :class="prefixCls" ref="powerFailureRef">
    <PowerCutNotice :data="todayPowerCutCount" @choose="handleChooseNotice" />
    <BasicForm :class="`${prefixCls}-form`" @register="register" @submit="handleSubmit" />

    <BasicTable @register="registerTable" :loading="loading">
      <!-- 计划停电时间 -->
      <template #scheduledCutOffTime="{ record }">
        <Tooltip placement="bottom">
          <template #title>
            <p>计划停电时间: {{ formatDate(record.scheduledCutOffTime, 'YYYY-MM-DD HH:mm') }}</p>
            <p>计划送电时间: {{ formatDate(record.scheduledSupplyTime, 'YYYY-MM-DD HH:mm') }}</p>
            <p
              >计划时长: {{ diffDateTime(record.scheduledSupplyTime, record.scheduledCutOffTime) }}
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
            <Tag :color="primaryColor" @click="toMaintenanceDetail(record)">
              {{ record.content }}
            </Tag>
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
  import { getPowerCutFormListApi, getPowerCutTodayCountApi } from '/@/api/power/form';
  import { GetPowerCutFormListParams } from '/@/api/power/model/formModel';
  import { PowerCutFormFullModel, DeviceInfoModel } from '/@/api/power/model/basicModel';
  import { useWebSocket } from '/@/hooks/web/useWebSocket';
  import { formatDate, diffDateTime } from '/@/utils/dateUtil';
  import { primaryColor, errorColor } from '/@/settings/designSetting';
  import { cloneDeep } from 'lodash-es';
  import { useUserState } from '/@/hooks/web/useUserState';
  import { useUserStore } from '/@/store/modules/user';

  const { getDictMap } = useUserState();
  const powerCutStatusMap = getDictMap('BT_POWER_CUT_STATUS');

  const { prefixCls } = useDesign('power-failure');
  const powerFailureRef = ref<any>(null);
  const loading = ref(false);
  const todayPowerCutCount = ref();
  const { getUserInfo } = useUserStore();
  const userId = getUserInfo.userId;

  const [register, { getFieldsValue, setFieldsValue }] = useForm({
    schemas,
    labelWidth: 60,
    autoSubmitOnEnter: true,
    fieldMapToTime: [['timeRange', ['cutStartTime', 'cutEndTime'], 'x']],
  });

  const [registerTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    columns,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
    onChange: () => {
      const page = getPaginationRef() as PaginationProps;
      setFieldsValue({
        pageNo: page.current,
        pageSize: page.pageSize,
      });
      nextTick(() => {
        const data = getFieldsValue() as GetPowerCutFormListParams;
        getPowerCutFormList(data);
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

  async function handleSubmit() {
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

      await handleSubmit();
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  });

  function createActions(record: PowerCutFormFullModel): ActionItem[] {
    return [
      {
        label: '查看',
        onClick: () => {
          console.log('record :>> ', record);
          // openModal(true, record);
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
      // 当停送电单状态为 填写高压操作票 / 待审批, 且当前用户为单据创建者, 有权限执行撤回操作
      actions.push({
        label: '撤回',
        onClick: () => {
          // openModal(true, record);
          console.log('撤回操作 :>> ', record);
        },
      });
    }

    if (
      record.createUserId === userId &&
      ['POWER_CUT_RECALL', 'POWER_CUT_REJECTED'].includes(record.status)
    ) {
      // 当停送电单状态为 撤回 / 审批驳回, 且当前用户为单据创建者, 有权限执行编辑操作
      actions.push({
        label: '编辑',
        onClick: () => {
          // openModal(true, record);
          console.log('编辑操作 :>> ', record);
        },
      });
    }

    if (record.executable && record.status === 'POWER_CUT_TICKET') {
      // 当停送电单状态为 填写高压操作票, 且当前用户有操作权限, 有权限执行编辑操作
      actions.push({
        label: '编辑',
        onClick: () => {
          // openModal(true, record);
          console.log('编辑操作 :>> ', record);
        },
      });
    }

    return actions;
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
