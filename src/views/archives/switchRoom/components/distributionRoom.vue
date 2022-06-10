<template
  ><PageWrapper contentFullHeight fixedHeight dense>
    <div class="h-full p-4 mt-4 bg-white"
      ><a-button class="mb-2.5" type="primary" @click="openModal(true, {})">新建</a-button
      ><BasicTable @register="registerTable" :loading="loading" @row-click="handleRowClick">
        <template #action="{ record }">
          <TableAction :actions="createActions(record)" />
        </template>
      </BasicTable>
      <EditDistributionRoomModal
        @register="registerModal"
        @done="getDistributionRoomList(searchData)"
      /> </div></PageWrapper
></template>

<script lang="ts">
  export default {
    name: 'DistributionRoom',
  };
</script>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { PageWrapper } from '/@/components/Page/index';
  import {
    ActionItem,
    BasicTable,
    useTable,
    TableAction,
    PaginationProps,
  } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { distributionRoomColumns as columns } from '../data';
  import EditDistributionRoomModal from './editDistributionRoomModal.vue';
  import {
    DistributionRoomCollection,
    GetDistributionRoomListParam,
  } from '/@/api/info/model/distributionroomModel';
  import { getDistributionRoomListApi, delDistributionRoomApi } from '/@/api/info/distributionroom';
  import { useMessage } from '/@/hooks/web/useMessage';

  const loading = ref(false);
  const selectedRowIndex = ref<number>(-1);
  const searchData = reactive({
    ascending: true,
    orderBy: 'code',
    pageNo: 1,
    pageSize: 10,
  }) as GetDistributionRoomListParam;

  const emit = defineEmits(['selectedRow']);

  const { createMessage } = useMessage();

  const [registerTable, { setTableData, getPaginationRef, setPagination, getDataSource }] =
    useTable({
      columns,
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
      onChange: () => {
        const page = getPaginationRef() as PaginationProps;
        setPagination({
          current: page.current,
          pageSize: page.pageSize,
        });
        getDistributionRoomList({
          ...searchData,
          ...{ pageNo: page.current, pageSize: page.pageSize },
        });
      },
    });

  const [registerModal, { openModal }] = useModal();

  function createActions(record: DistributionRoomCollection): ActionItem[] {
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
            try {
              await delDistributionRoomApi(record.id);
              createMessage.success('删除成功');
              getDistributionRoomList(searchData);
            } catch (error: any) {
              throw new Error(error);
            }
          },
        },
      },
    ];
  }

  async function getDistributionRoomList(searchData) {
    try {
      loading.value = true;
      const { items, totalCount } = await getDistributionRoomListApi(searchData);
      setTableData(items || []);
      setPagination({
        total: totalCount,
      });
      if (items) {
        selectedRowIndex.value = -1;
        const tableData = getDataSource();
        handleRowClick(tableData[0], 0);
      }
    } catch (error: any) {
      loading.value = false;
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }

  function handleRowClick(row, index?) {
    if (selectedRowIndex.value === index) return;
    selectedRowIndex.value = index;
    emit('selectedRow', row);
  }

  getDistributionRoomList(searchData);
</script>
