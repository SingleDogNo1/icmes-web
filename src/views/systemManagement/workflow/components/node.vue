<template>
  <div class="h-full p-4 mt-4 overflow-auto bg-white">
    <BasicTable @register="registerTable" :loading="loading" @row-click="handleClickRow">
      <template #toolbar>
        <a-button type="primary" @click="createNode">新增节点</a-button>
      </template>

      <template #workType="{ record }">
        <template v-if="record.type === nodeTypeEnum.OPERATION">
          <Icon icon="bi:hand-index-fill" :color="primaryColor" />
          <span class="ml-2">操作</span>
        </template>
        <template v-if="record.type === nodeTypeEnum.APPROVE">
          <Icon icon="fa-solid:stamp" :color="errorColor" />
          <span class="ml-2">审批</span>
        </template>
      </template>

      <template #nodeState="{ record, index }">
        <!-- 开关显示逻辑刚好与 disabled 逻辑相反，所以需要把显示的值颠倒过来 -->
        <Switch
          v-model:checked="record.isDisabled"
          :checkedValue="false"
          :uncheckedValue="true"
          :loading="switchLoading[index]"
          @change="toggleDisableRow(record, index)"
        />
      </template>

      <template #action="{ record }">
        <TableAction
          :actions="createActions(record)"
          :dropDownActions="createDropDownActions(record)"
        />
      </template>
    </BasicTable>

    <ViewWorkflowNodeDrawer @register="registerViewDrawer" />

    <EditNodeModal
      @register="registerNodeModal"
      @done="getWorkflowNodesListById(props.selectedRow.id, searchNodeForm)"
    />
  </div>
</template>

<script lang="ts">
  export default {
    name: 'WorkflowNode',
  };
</script>

<script lang="ts" setup>
  import { ref, unref, watch } from 'vue';
  import { Switch } from 'ant-design-vue';
  import { workflowNodeTableColumns } from '../data';
  import {
    BasicTable,
    useTable,
    TableAction,
    PaginationProps,
    ActionItem,
  } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';
  import { Icon } from '/@/components/Icon';
  import {
    getWorkflowNodesListByIdApi,
    disableWorkflowNodeApi,
    enableWorkflowNodeApi,
    deleteWorkflowNodeApi,
  } from '/@/api/flow/workflow';
  import { WorkFlowModel, WorkflowNodeModel } from '/@/api/flow/model/workflowModel';
  import { primaryColor, errorColor } from '/@/settings/designSetting';
  import { nodeTypeEnum } from '/@/enums/workflowEnum';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ViewWorkflowNodeDrawer from './viewWorkflowNodeDrawer.vue';
  import EditNodeModal from './editNodeModal.vue';
  import { error } from '/@/utils/log';

  const props = defineProps({
    selectedRow: {
      type: Object as PropType<WorkFlowModel>,
      required: true,
    },
  });

  const loading = ref<boolean>(false);
  const switchLoading = ref<boolean[]>([]);
  const { createMessage } = useMessage();
  const selectedRowIndex = ref<number>(-1);
  const searchNodeForm = ref({
    pageNo: 1,
    pageSize: 10,
  });
  const tableList = ref<WorkflowNodeModel[]>([]);

  const [registerTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    columns: workflowNodeTableColumns,
    showIndexColumn: false,
    striped: false,
    ellipsis: false,
    rowClassName: (_, index) => {
      return selectedRowIndex.value === index ? 'ant-table-row-hover' : '';
    },
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
    onChange: async () => {
      const page = getPaginationRef() as PaginationProps;
      setPagination({
        current: page.current,
        pageSize: page.pageSize,
      });
      await getWorkflowNodesListById(props.selectedRow.id, {
        pageNo: page.current,
        pageSize: page.pageSize,
      });
    },
  });
  const [registerViewDrawer, { openDrawer: openWorkflowNodeDrawer }] = useDrawer();
  const [registerNodeModal, { openModal: openWorkflowNodeModal }] = useModal();

  function createActions(record: WorkflowNodeModel): ActionItem[] {
    return [
      {
        label: '查看',
        onClick: () => {
          openWorkflowNodeDrawer(true, {
            workflowId: props.selectedRow.id,
            businessType: props.selectedRow.businessType,
            nodeId: record.id,
          });
        },
      },
    ];
  }

  function createDropDownActions(record: WorkflowNodeModel): ActionItem[] {
    if (record.isDisabled) {
      return [];
    } else {
      return [
        {
          label: '配置通知',
          onClick: () => {
            console.log('record :>> ', record);
          },
        },
        {
          label: '编辑',
          onClick: () => {
            console.log('record :>> ', record);
            openWorkflowNodeModal(true, {
              ...{
                workflowId: props.selectedRow.id,
                businessType: props.selectedRow.businessType,
                tableList: tableList.value,
              },
              ...record,
            });
          },
        },
        {
          label: '删除',
          color: 'error',
          popConfirm: {
            title: '数据删除后将无法恢复，确认删除数据？',
            confirm: async () => {
              console.log('record :>> ', record);
              try {
                await deleteWorkflowNodeApi(props.selectedRow.id, record.id);
                createMessage.success('删除成功');
                await getWorkflowNodesListById(props.selectedRow.id, unref(searchNodeForm));
              } catch (err: any) {
                error(err);
              }
            },
          },
        },
      ];
    }
  }
  watch(
    () => props.selectedRow,
    (val) => {
      getWorkflowNodesListById(val.id, unref(searchNodeForm));
    },
    {
      deep: true,
    },
  );

  function handleClickRow(_row, index?) {
    if (selectedRowIndex.value === index) return;
    selectedRowIndex.value = index;
  }

  async function getWorkflowNodesListById(id, form) {
    loading.value = true;
    try {
      const { items, totalCount } = await getWorkflowNodesListByIdApi(id, form);
      tableList.value = items || [];
      setTableData(items || []);
      setPagination({
        total: totalCount,
      });
      // 生成与表格数据等量的集合用来表示每一行数据的 loading 状态
      switchLoading.value = Array(items?.length || 0).fill(false);
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }

  async function toggleDisableRow(row: WorkflowNodeModel, i: number) {
    const workflowId = props.selectedRow.id;
    const nodeId = row.id;
    const params = {
      versionTag: row.versionTag,
    };

    try {
      switchLoading.value[i] = true;
      if (row.isDisabled) {
        await disableWorkflowNodeApi(workflowId, nodeId, params);
      } else {
        await enableWorkflowNodeApi(workflowId, nodeId, params);
      }

      createMessage.success(`${row.isDisabled ? '停用' : '启用'}成功`);
      await getWorkflowNodesListById(props.selectedRow.id, unref(searchNodeForm));
    } catch (err: any) {
      row.isDisabled = !row.isDisabled;
      error(err);
    } finally {
      switchLoading.value[i] = false;
    }
  }

  function createNode() {
    openWorkflowNodeModal(true, {
      workflowId: props.selectedRow.id,
      businessType: props.selectedRow.businessType,
      tableList: tableList.value,
    });
  }
</script>
