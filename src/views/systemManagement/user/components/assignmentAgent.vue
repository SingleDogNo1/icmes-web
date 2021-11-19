<template>
  <BasicTable @register="registerTable" :loading="loading">
    <template #toolbar>
      <a-button type="primary" @click="openModal(true, { employeeId: user.employeeId })">
        指派代理
      </a-button>
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
</template>

<script lang="ts" setup>
  import { ref, watch, PropType } from 'vue';
  import {
    BasicTable,
    useTable,
    TableAction,
    PaginationProps,
    ActionItem,
  } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getAssignmentAgentListApi } from '/@/api/account/basic';
  import {
    getAssignmentParams,
    AccountModel,
    AccountConsignProxyModel,
  } from '/@/api/account/model/basicModel';
  import EditAssignmentAgentModal from './editAssignmentAgentModal.vue';
  import { delProxyByIdApi } from '/@/api/account/proxies';
  import { formatToDate, parseProxyType, parseProxyCycle } from '../helper';

  const props = defineProps({
    user: {
      type: Object as PropType<AccountModel>,
      required: true,
    },
  });

  const { createMessage } = useMessage();

  const loading = ref<boolean>(false);
  const searchForm = ref<getAssignmentParams>({
    ascending: true,
    orderBy: 'proxyStartDate',
    pageNo: 1,
    pageSize: 10,
  });

  const [registerTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    columns: [
      { title: '组织机构', dataIndex: 'fullOrgName', fixed: 'left' },
      { title: '角色', dataIndex: 'roleName', fixed: 'left' },
      { title: '接手人', dataIndex: 'assignProxyName', fixed: 'left' },
      { title: '开始时间', dataIndex: 'proxyStartDate', slots: { customRender: 'startDate' } },
      { title: '结束时间', dataIndex: 'proxyEndDate', slots: { customRender: 'endDate' } },
      { title: '代理类型', dataIndex: 'periodDays', slots: { customRender: 'proxyType' } },
      { title: '周期', dataIndex: 'periodDays', slots: { customRender: 'proxyCycle' } },
    ],
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
      getRolesListById(props.user?.employeeId, options);
    },
  });

  const [registerModal, { openModal }] = useModal();

  function createActions(record: AccountConsignProxyModel): ActionItem[] {
    return [
      {
        label: '编辑',
        onClick: () => {
          openModal(true, { ...record, ...{ employeeId: props.user.employeeId } });
        },
      },
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，确认删除数据？',
          confirm: () => {
            loading.value = true;
            delProxyByIdApi(record.id)
              .then(() => {
                createMessage.success('删除成功');
                refreshData();
              })
              .finally(() => {
                loading.value = false;
              });
          },
        },
      },
    ];
  }

  function getRolesListById(id, options) {
    loading.value = true;
    getAssignmentAgentListApi(id, options)
      .then((data) => {
        loading.value = false;
        setTableData(data.items || []);
        setPagination({
          total: data.totalCount,
        });
      })
      .catch(() => {
        loading.value = false;
      });
  }

  function refreshData() {
    // 重置分页
    setPagination({ current: 1, pageSize: 10 });
    const options = { ...searchForm.value, ...{ pageNo: 1, pageSize: 10 } };
    getRolesListById(props.user.employeeId, options);
  }

  watch(
    () => props.user,
    (val) => {
      console.log('val :>> ', val);
      loading.value = true;
      refreshData();
    },
    {
      deep: true,
    },
  );
</script>
