<template>
  <BasicForm @register="registerForm" @submit="handleSubmit" />

  <BasicTable @register="registerTable" :loading="loading" @row-click="handleClickRow">
    <template #code="{ record }">
      <span
        v-if="record.businessData.projectStatus !== 'MAINT_ORDER_CHECKED'"
        :class="[
          clickable(record.businessType, record.businessStepKey)
            ? 'cursor-not-allowed'
            : 'cursor-pointer',
          { 'text-primary': !clickable(record.businessType, record.businessStepKey) },
        ]"
        @click="handleClickItem(record)"
      >
        {{ record.businessKey }}
      </span>

      <span
        v-else-if="record.businessData.orderStatus === 'REPAIR_ORDER_WAIT_PROCESS'"
        :class="[
          clickable(record.businessType, record.businessStepKey)
            ? 'cursor-not-allowed'
            : 'cursor-pointer',
          { 'text-primary': !clickable(record.businessType, record.businessStepKey) },
        ]"
        @click="handleClickItem(record)"
      >
        {{ record.businessKey }}
      </span>

      <span
        v-else
        :class="[
          clickable(record.businessType, record.businessStepKey)
            ? 'cursor-not-allowed'
            : 'cursor-pointer',
          { 'text-primary': !clickable(record.businessType, record.businessStepKey) },
        ]"
        @click="handleCheckItem(record)"
      >
        {{ record.businessKey }}
      </span>

      <!--如果是检修单，显示是否带电图标-->
      <span v-if="record.businessType === 'BT_MAINT_ORDER'">
        <Icon
          icon="ph:lightning-slash-fill"
          :class="[record.businessData.powerCut ? 'text-primary' : 'text-gray-400']"
        />
      </span>
    </template>

    <template #businessType="{ record }">
      {{ allBusinessTypeMap[record.businessType] }}
    </template>

    <template #content="{ record }">
      <span v-if="record.businessType === 'BT_REPAIR_ORDER'">
        {{ record.businessData.title }}{{ record.businessData.stepDesc }}
      </span>

      <span v-else-if="['BT_POWER_CUT', 'BT_MAINT_ORDER'].includes(record.businessType)">
        {{ record.businessData.stepDesc }}
      </span>

      <span v-else> {{ record.businessData.title }} </span>
    </template>

    <template #updateTime="{ record }">
      {{ formatDate(record.updateTime, 'YYYY-MM-DD HH:mm') }}
    </template>

    <template #approvalStatus="{ record }">
      {{ parseTaskStatusText(record.taskStatus) }}
    </template>

    <template #action="{ record }">
      <TableAction :actions="createActions(record)" />
    </template>
  </BasicTable>
</template>

<script lang="ts">
  export default {
    name: 'ApprovalPane',
  };
</script>

<script lang="ts" setup>
  import { onMounted, ref, nextTick } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { Icon } from '/@/components/Icon';
  import {
    BasicTable,
    useTable,
    TableAction,
    PaginationProps,
    ActionItem,
  } from '/@/components/Table';
  import { taskSchemas as schemas, taskTableColumns as columns } from './data';
  import { getTasksListApi } from '/@/api/notice/task';
  import { GetTaskListParams, TaskModel } from '/@/api/notice/model/taskModel';
  import { cloneDeep } from 'lodash-es';
  import { useUserState } from '/@/hooks/web/useUserState';
  import { formatDate } from '/@/utils/dateUtil';

  enum TaskStatusEnum {
    /** 待执行 */
    PENDING = 0,
    /** 已执行 */
    APPROVED = 1,
    /** 已关闭 */
    CLOSED = 2,
    /** 已驳回 */
    REJECTED = 3,
  }

  const { getDictMap } = useUserState();

  const businessTypeMap = getDictMap('DT_BUSINESS_TYPE');
  const noticeBusinessTypeMap = getDictMap('DT_NOTICE_BUSINESS_TYPE');
  const allBusinessTypeMap = { ...businessTypeMap, ...noticeBusinessTypeMap };

  const loading = ref(false);
  const selectedRowIndex = ref<number>(-1);

  const clickable = (businessType: string, businessStepKey: string) => {
    if (
      (businessType === 'BT_MAINT_ORDER' && businessStepKey === 'JX_CHECK') ||
      (businessType === 'BT_MAINT_ORDER' && businessStepKey === 'MIAN_COMPLELTE') ||
      (businessType === 'BT_MAINT_PLAN' && businessStepKey === 'MAINT_PLAN_TECHNICIAN_COMMIT')
    ) {
      return false;
    } else {
      return !['BT_REPAIR_ORDER', 'BT_POWER_CUT'].includes(businessType);
    }
  };

  const parseTaskStatusText = (status: number) => {
    if (status === TaskStatusEnum['PENDING']) {
      return '待执行';
    } else if (status === TaskStatusEnum['APPROVED']) {
      return '已执行';
    } else if (status === TaskStatusEnum['CLOSED']) {
      return '已关闭';
    }
  };

  const [registerForm, { getFieldsValue }] = useForm({
    layout: 'inline',
    schemas,
    labelWidth: 80,
    autoSubmitOnEnter: true,
  });

  const [registerTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    columns,
    striped: false,
    ellipsis: false,
    rowClassName: (_, index) => {
      return selectedRowIndex.value === index ? 'ant-table-row-hover' : '';
    },
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
    onChange: async (_pagination, _filters, sorter) => {
      const page = getPaginationRef() as PaginationProps;
      setPagination({ current: page.current, pageSize: page.pageSize });

      const value = getFieldsValue();
      const orderBy = sorter.order ? sorter.field : '';
      const ascending = sorter.order === 'ascend';
      const form = {
        ...value,
        ...{ pageNo: page.current, pageSize: page.pageSize, orderBy, ascending },
      };
      console.log('form :>> ', form);

      handleSubmit(form);
    },
  });

  function createActions(record: TaskModel): ActionItem[] {
    if (record.taskStatus === 0) {
      return [
        {
          label: '执行',
          disabled: clickable(record.businessType, record.businessStepKey),
          onClick: () => {
            handleClickItem(record);
          },
        },
      ];
    } else {
      return [
        {
          label: '查看',
          disabled: clickable(record.businessType, record.businessStepKey),
          onClick: () => {
            handleCheckItem(record);
          },
        },
      ];
    }
  }

  function handleClickRow(_, index?) {
    if (selectedRowIndex.value === index) return;
    selectedRowIndex.value = index;
  }

  function handleClickItem(record: TaskModel) {
    console.log('record :>> ', record);
  }

  function handleCheckItem(record: TaskModel) {
    console.log('record :>> ', record);
  }

  async function handleSubmit(value) {
    const form = cloneDeep(value);

    if (form.status === TaskStatusEnum['APPROVED']) {
      form.status = [TaskStatusEnum['APPROVED'], TaskStatusEnum['REJECTED']];
    } else {
      form.status = [form.status];
    }

    console.log('value :>> ', form);
    const { items, totalCount } = await getTasksListApi(form as GetTaskListParams);

    items?.map((item) => {
      item.businessData = JSON.parse(item.businessData);
    });

    setTableData(items || []);
    setPagination({ total: totalCount });

    console.log('items, totalCount :>> ', items, totalCount);
  }

  onMounted(async () => {
    await nextTick();
    const value = getFieldsValue();

    handleSubmit(value);
  });
</script>
