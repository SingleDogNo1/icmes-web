<template>
  <div class="h-full p-4 mt-4 overflow-auto bg-white">
    <BasicTable @register="registerTable" :loading="loading" @row-click="handleClickRow">
      <template #action="{ record }">
        <TableAction :actions="createActions(record)" />
      </template>
    </BasicTable>
  </div>

  <EditLocationModal @register="register" @done="handleEditLocationSuccess" />
</template>

<script lang="ts">
  export default {
    name: 'LocationTable',
  };
</script>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import {
    ActionItem,
    BasicTable,
    useTable,
    TableAction,
    PaginationProps,
  } from '/@/components/Table';
  import { columns } from '../data';
  import EditLocationModal from './editLocationModal.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { delLocationApi } from '/@/api/info/location';

  const emit = defineEmits(['changePage', 'delRow']);

  const { createMessage } = useMessage();

  const selectedRowIndex = ref<number>(-1);

  const props = defineProps({
    data: {
      type: Array,
      default: () => [],
    },
    totalPages: {
      type: Number,
    },
    totalCount: {
      type: Number,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const [register, { openModal }] = useModal();

  const [registerTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    columns,
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
    onChange: () => {
      const page = getPaginationRef() as PaginationProps;
      setPagination({
        current: page.current,
        pageSize: page.pageSize,
      });
      emit('changePage', { pageNo: page.current, pageSize: page.pageSize });
    },
  });

  function createActions(record): ActionItem[] {
    return [
      {
        label: '编辑',
        onClick: () => {
          openModal(true, { ...record, ...{ type: 'edit' } });
        },
      },
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，确认删除数据？',
          confirm: async () => {
            console.log('record :>> ', record);
            if (record.id === 0) {
              createMessage.error('根节点不能删除');
              return;
            }
            try {
              await delLocationApi(record.id);
              createMessage.success('删除成功');
              emit('delRow');
            } catch (error: any) {
              throw new Error(error);
            }
          },
        },
      },
    ];
  }

  function handleClickRow(_row, index) {
    if (selectedRowIndex.value === index) return;
    selectedRowIndex.value = index;
  }

  function handleEditLocationSuccess() {
    // 编辑位置信息成功, 刷新数据
    setTableData(props.data);
  }

  watch(
    () => props.data,
    (data) => {
      console.log('data', data);
      setTableData(data);
      setPagination({ total: props.totalCount });
    },
  );
</script>
