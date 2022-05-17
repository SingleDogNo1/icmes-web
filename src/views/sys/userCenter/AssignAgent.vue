<template>
  <CollapseContainer title="指派代理" :canExpan="false">
    <BasicTable @register="registerTable" :loading="loading">
      <template #toolbar>
        <a-button type="primary" @click="openModal(true, { employeeId })"> 指派代理 </a-button>
      </template>
      <template #startDate="{ record }">{{ formatToDate(record.proxyStartDate) }}</template>
      <template #endDate="{ record }">{{ formatToDate(record.proxyEndDate) }}</template>
      <template #proxyType="{ record }">{{ parseProxyType(record.periodDays) }}</template>
      <template #proxyCycle="{ record }">{{ parseProxyCycle(record.periodDays) }}</template>
      <template #action="{ record }">
        <TableAction :actions="createActions(record)" />
      </template>
    </BasicTable>

    <EditAssignmentAgentModal @register="registerModal" @done="refreshData" />
  </CollapseContainer>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import {
    BasicTable,
    useTable,
    TableAction,
    PaginationProps,
    ActionItem,
  } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { CollapseContainer } from '/@/components/Container';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getAssignmentAgentListApi } from '/@/api/account/basic';
  import { getAssignmentParams, AccountConsignProxyModel } from '/@/api/account/model/basicModel';
  import EditAssignmentAgentModal from '/@/views/systemManagement/user/components/editAssignmentAgentModal.vue';
  import { delProxyByIdApi } from '/@/api/account/proxies';
  import {
    formatToDate,
    parseProxyType,
    parseProxyCycle,
  } from '/@/views/systemManagement/user/helper';
  import { useUserStore } from '/@/store/modules/user';
  import { agentTableColumns } from './data';

  const userStore = useUserStore();

  const { employeeId } = userStore.getUserInfo!;

  const { createMessage } = useMessage();

  const loading = ref<boolean>(false);
  const searchForm = ref<getAssignmentParams>({
    ascending: true,
    orderBy: 'proxyStartDate',
    pageNo: 1,
    pageSize: 10,
  });

  const [registerTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    columns: agentTableColumns,
    striped: false,
    ellipsis: false,
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
      const options = { ...searchForm.value, ...{ pageNo: page.current, pageSize: page.pageSize } };
      getRolesListById(employeeId, options);
    },
  });

  const [registerModal, { openModal }] = useModal();

  function createActions(record: AccountConsignProxyModel): ActionItem[] {
    return [
      {
        label: '编辑',
        onClick: () => {
          openModal(true, { ...record, ...{ employeeId } });
        },
      },
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，确认删除数据？',
          confirm: async () => {
            loading.value = true;
            try {
              await delProxyByIdApi(record.id);
              createMessage.success('删除成功');
              await refreshData();
            } catch (error: any) {
              throw new Error(error);
            } finally {
              loading.value = false;
            }
          },
        },
      },
    ];
  }

  async function getRolesListById(id, options) {
    loading.value = true;

    try {
      const { items, totalCount } = await getAssignmentAgentListApi(id, options);
      setTableData(items || []);
      setPagination({ total: totalCount });
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }

  function refreshData() {
    // 重置分页
    setPagination({ current: 1, pageSize: 10 });
    const options = { ...searchForm.value, ...{ pageNo: 1, pageSize: 10 } };
    getRolesListById(employeeId, options);
  }

  getRolesListById(employeeId, searchForm.value);
</script>
