<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    title="查看工作流节点"
    width="50%"
    @close="clearDrawerData"
  >
    <Description class="shadow-md" @register="registerDesc" />

    <BasicTable class="shadow-lg mt-4" @register="registerReminderTable">
      <template #toolbar>
        <div
          v-if="workflowNodeData"
          class="w-full h-10 bg-gray-100 px-4 flex justify-between items-center"
        >
          <div>
            <Icon icon="carbon:warning-filled" class="waning-icon" :color="disabledColor" />
            <span class="mr-2"> 任务未完成是否需要提醒 </span>
            <Radio.Group v-model:value="workflowNodeData.isReminderOn">
              <Radio :value="true" disabled>是</Radio>
              <Radio :value="false" disabled>否</Radio>
            </Radio.Group>
          </div>
          <div>
            <Icon icon="ant-design:bell-outlined" :color="disabledColor" />
            <span>
              每 {{ workflowNodeData.reminderInterval }} 分钟提醒一次，最多
              {{ workflowNodeData.reminderMaxNum }} 次
            </span>
          </div>
        </div>
      </template>

      <template #notificationPhase="{ record }">
        {{ parseNotificationPhaseText(record.notificationPhase) }}
      </template>

      <template #type="{ record }">
        {{ parseReminderTypeText(workflowNodeData, record.type) }}
      </template>

      <template #notificationObjectType="{ record }">
        {{ parseWorkflowObjectTypeText(record.notificationObjectType) }}
      </template>

      <template #isWorkingShiftNoticeOn="{ record }">
        <Switch v-model:checked="record.isWorkingShiftNoticeOn" disabled />
      </template>
    </BasicTable>

    <BasicTable class="shadow-lg mt-4" @register="registerReportTable">
      <template #toolbar>
        <div
          v-if="workflowNodeData"
          class="w-full h-10 bg-gray-100 px-4 flex justify-between items-center"
        >
          <div>
            <Icon icon="carbon:warning-filled" class="waning-icon" :color="disabledColor" />
            <span class="mr-2"> 任务超时未完成是否上报 </span>
            <Radio.Group v-model:value="workflowNodeData.isReportOn">
              <Radio :value="true" disabled>是</Radio>
              <Radio :value="false" disabled>否</Radio>
            </Radio.Group>
          </div>
        </div>
      </template>

      <template #type="{ record }">
        {{ parseWorkflowObjectTypeText(record.reportingObjectType) }}
      </template>

      <template #isWorkingShiftNoticeOn="{ record }">
        <Switch v-model:checked="record.isWorkingShiftNoticeOn" disabled />
      </template>
    </BasicTable>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { h, ref } from 'vue';
  import { Checkbox, Switch, Radio } from 'ant-design-vue';
  import { disabledColor } from '/@/settings/designSetting';
  import { Icon } from '/@/components/Icon';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTable, useTable } from '/@/components/Table';
  import { Description, useDescription } from '/@/components/Description';
  import { getWorkflowNodeInfoApi, getWorkflowNodesListByIdApi } from '/@/api/flow/workflow';
  import type { WorkflowNodeModel } from '/@/api/flow/model/workflowModel';
  import { getReminderListApi } from '/@/api/flow/reminder';
  import { getReportingListApi } from '/@/api/flow/reporting';
  import { nodeTypeEnum, workflowNodeTypeEnum } from '/@/enums/workflowEnum';
  import { useUserState } from '/@/hooks/web/useUserState';
  import { reminderTableColumns, reportTableColumns } from '../data';
  import {
    parseNotificationPhaseText,
    parseReminderTypeText,
    parseWorkflowObjectTypeText,
  } from '../helper';
  import { error } from '/@/utils/log';

  const { getDictName } = useUserState();

  const workflowNodeData = ref<Nullable<WorkflowNodeModel>>(null);
  const [registerDesc, { setDescProps }] = useDescription({
    column: 3,
    data: [],
    schema: [],
  });
  const basicTableProps = { canResize: false, scroll: { y: 400 }, pagination: false };
  const [registerReminderTable, { setTableData: setReminderTableData }] = useTable({
    ...{ columns: reminderTableColumns },
    ...basicTableProps,
  });

  const [registerReportTable, { setTableData: setReportTableData }] = useTable({
    ...{ columns: reportTableColumns },
    ...basicTableProps,
  });

  const [register, { setDrawerProps }] = useDrawerInner(
    async (params: { businessType: string; nodeId: number; workflowId: number }) => {
      setDrawerProps({ loading: true });
      try {
        const { items: workflowNodesList } = await getWorkflowNodesListByIdApi(params.workflowId, {
          pageSize: 0,
          pageNo: 0,
        });

        const data = await getWorkflowNodeInfoApi(params.workflowId, params.nodeId);
        workflowNodeData.value = data; // 备份工作流节点数据，下面会用到

        // 渲染工作流节点数据
        setDescProps({
          data,
          schema: [
            { label: '步骤序号', field: 'order' },
            {
              label: '系统自动执行',
              field: 'isSystemAutoExec',
              render: (val) => h(Checkbox, { checked: val, disabled: true }),
            },
            {
              label: '即时业务流转',
              field: 'isImmediatelyExecute',
              render: (val) => h(Checkbox, { checked: val, disabled: true }),
            },
            { label: '节点编码', field: 'code' },
            { label: '节点名称', field: 'name' },
            {
              label: '工作类型',
              field: 'type',
              render: (val: nodeTypeEnum) => {
                switch (val) {
                  case nodeTypeEnum.OPERATION:
                    return '操作';
                  case nodeTypeEnum.APPROVE:
                    return '审批';
                  default:
                    return '';
                }
              },
            },
            {
              label: data.type === nodeTypeEnum.APPROVE ? '审批通过状态' : '操作完成状态',
              field: 'operateSuccessStatus',
              render: (val) => getDictName(params.businessType + '_STATUS', val),
            },
            {
              label: '操作方式',
              field: 'method',
              render: (val, data) => {
                switch (val) {
                  case workflowNodeTypeEnum.ADD:
                    return '会签';
                  case workflowNodeTypeEnum.OR:
                    return `或签(${data.numberOfSigned}人)`;
                  default:
                    return '';
                }
              },
            },
            {
              label: '审批驳回状态',
              field: 'operateFailureStatus',
              render: (val) => getDictName(params.businessType + '_STATUS', val),
            },
            {
              label: '审批驳回后返回节点',
              field: 'redirectToNodeId',
              render: (val) => {
                const node = (workflowNodesList || []).find((item) => item.id === val);
                return node?.name ?? '';
              },
            },
          ],
        });

        // 渲染通知表格数据
        const { items: reminderData } = await getReminderListApi({ workflowNodeId: params.nodeId });
        setReminderTableData(reminderData || []);

        // 渲染上报表格数据
        const { items: reportData } = await getReportingListApi({ workflowNodeId: params.nodeId });
        setReportTableData(reportData || []);
      } catch (err: any) {
        error(err);
      } finally {
        setDrawerProps({ loading: false });
      }
    },
  );

  function clearDrawerData() {
    setDescProps({ data: {}, schema: [] });
  }
</script>
