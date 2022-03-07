<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <div class="h-full p-4 mt-4 overflow-auto bg-white">
      <BasicTable @register="registerTable" :loading="loading" @row-click="handleClickRow">
        <template #toolbar>
          <!-- <a-button type="primary" @click="openModal(true, {})">新增节点</a-button> -->
          <a-button type="primary">新增节点</a-button>
        </template>

        <template #action="{ record }">
          <TableAction
            :actions="createActions(record)"
            :dropDownActions="createDropDownActions(record)"
          />
        </template>
      </BasicTable>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref, unref, watch } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { workflowNodeTableColumns } from '../data';
  import {
    BasicTable,
    useTable,
    TableAction,
    PaginationProps,
    ActionItem,
  } from '/@/components/Table';
  import { WorkFlowModel } from '/@/api/flow/model/workflowModel';
  import { getWorkflowNodesListByIdApi } from '/@/api/flow/workflow';

  const props = defineProps({
    selectedRow: {
      type: Object as PropType<WorkFlowModel>,
      required: true,
    },
  });

  const loading = ref<boolean>(false);
  const selectedRowIndex = ref<number>(-1);
  const searchNodeForm = ref({
    pageNo: 1,
    pageSize: 10,
  });

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

  function createActions(record): ActionItem[] {
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

  function createDropDownActions(record): ActionItem[] {
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
          // openModal(true, record);
          console.log('record :>> ', record);
        },
      },
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，确认删除数据？',
          confirm: async () => {
            console.log('record :>> ', record);
          },
        },
      },
    ];
  }

  function handleClickRow(_row, index?) {
    if (selectedRowIndex.value === index) return;
    selectedRowIndex.value = index;
  }

  async function getWorkflowNodesListById(id, form) {
    loading.value = true;
    try {
      const { items, totalCount } = await getWorkflowNodesListByIdApi(id, form);
      setTableData(items || []);
      setPagination({
        total: totalCount,
      });
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
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
</script>
