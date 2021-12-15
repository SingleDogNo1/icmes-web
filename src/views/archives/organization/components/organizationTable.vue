<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <div class="h-full p-4 mt-4 overflow-auto bg-white">
      <BasicTable @register="registerTable" :loading="loading" @row-click="handleClickRow">
        <template #action="{ record }">
          <TableAction :actions="createActions(record)" />
        </template>
      </BasicTable>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'Table',
  };
</script>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import {
    BasicTable,
    useTable,
    TableAction,
    PaginationProps,
    ActionItem,
  } from '/@/components/Table';
  import { columns } from '../data';

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

  const emit = defineEmits(['changePage']);

  const selectedRowIndex = ref<number>(-1);

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
            // loading.value = false;
            // try {
            //   await deleteRoleApi(record.id);
            //   createMessage.success('删除成功');
            //   await getRolesList(props.searchData);
            // } catch (error) {
            //   throw new Error(JSON.stringify(error));
            // } finally {
            //   loading.value = false;
            // }
          },
        },
      },
    ];
  }

  function handleClickRow(_row, index) {
    if (selectedRowIndex.value === index) return;
    selectedRowIndex.value = index;
  }

  watch(
    () => props.data,
    (value) => {
      setTableData(value);
      setPagination({ total: props.totalCount });
    },
  );
</script>
