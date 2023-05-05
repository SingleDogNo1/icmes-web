<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <div class="h-full p-4 mt-4 overflow-auto bg-white">
      <BasicTable @register="registerTable" :loading="loading" @row-click="handleClickRow">
        <template #action="{ record }">
          <TableAction :actions="createActions(record)" />
        </template>
      </BasicTable>
    </div>

    <EditOrganizationModal @register="registerModal" @done="handleEditOrgSuccess" />
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'OrganizationTableTable',
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
  import { delOrganizationApi } from '/@/api/info/organizations';
  import EditOrganizationModal from './editOrganizationModal.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { error } from '/@/utils/log';

  const { createMessage } = useMessage();

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

  const emit = defineEmits(['changePage', 'delRow']);

  const selectedRowIndex = ref<number>(-1);

  const [registerModal, { openModal }] = useModal();

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
          console.log(record);

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
              await delOrganizationApi(record.id);
              createMessage.success('删除成功');
              emit('delRow', record);
            } catch (err: any) {
              error(err);
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

  function handleEditOrgSuccess() {
    // 编辑组织机构成功, 刷新数据
    setTableData(props.data);
  }

  watch(
    () => props.data,
    (value) => {
      setTableData(value);
      setPagination({ total: props.totalCount });
    },
  );
</script>
