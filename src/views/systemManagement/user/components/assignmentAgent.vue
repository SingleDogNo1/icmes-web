<template>
  <BasicTable @register="registerTable" :loading="loading">
    <template #toolbar>
      <a-button type="primary" @click="openModal(true, {})">指派代理</a-button>
    </template>
    <template #startDate="{ record }">{{ formatToDate(record.proxyStartDate) }}</template>
    <template #endDate="{ record }">{{ formatToDate(record.proxyEndDate) }}</template>
    <template #proxyType="{ record }">{{ parseProxyType(record.periodDays) }}</template>
    <template #proxyCycle="{ record }">{{ parseProxyCycle(record.periodDays) }}</template>
    <template #action="{ record }">
      <TableAction :actions="createActions(record)" />
    </template>
  </BasicTable>

  <EditAssignmentAgentModal @register="registerModal" @submit="handleAssignmentAgent" />
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
  import { getAssignmentAgentListApi } from '/@/api/account/basic';
  import {
    getAssignmentAgentParams,
    AccountModel,
    AccountConsignProxyModel,
  } from '/@/api/account/model/basicModel';
  import EditAssignmentAgentModal from './editAssignmentAgentModal.vue';
  import { RoleProxyType } from '/@/enums/roleEnum';
  import { formatDate } from '/@/utils/dateUtil';

  const props = defineProps({
    user: {
      type: Object as PropType<AccountModel>,
      required: true,
    },
  });

  const loading = ref<boolean>(false);
  const searchForm = ref<getAssignmentAgentParams>({
    ascending: true,
    orderBy: 'proxyStartDate',
    pageNo: 1,
    pageSize: 10,
  });

  const [registerTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    columns: [
      { title: '组织机构', dataIndex: 'fullOrgName', fixed: 'left' },
      { title: '角色', dataIndex: 'roleName' },
      { title: '接手人', dataIndex: 'assignProxyName' },
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
  const formatToDate = (date: string | number) => formatDate(date, 'YYYY-MM-DD');

  /**
   * @description 计算代理类型和代理周期
   * 代理类型为 corn 表达式格式, 共七个占位符, 每个占位符索引指代对应星期几. 1 表示已代理, 0 表示未代理
   * 所以如果是七个1，表示每天都被代理，及全时段代理，否则为代理周期内的某几天
   */
  const parseProxyType = (type: string) => {
    return type.includes('0') ? RoleProxyType.PERIOD : RoleProxyType.ALL;
  };

  const parseProxyCycle = (type: string) => {
    const weekdayDict = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    if (!type.includes('0')) {
      return '全周期';
    } else {
      const cycleArr: string[] = [];
      for (let i = 0; i < type.length; i++) {
        const item = type[i];
        if (item === '1') {
          cycleArr.push(weekdayDict[i]);
        }
      }
      return cycleArr.join('、');
    }
  };

  function createActions(record: AccountConsignProxyModel): ActionItem[] {
    return [
      {
        label: '编辑',
        onClick: () => {
          openModal(true, record);
        },
      },
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，确认删除数据？',
          confirm: () => {
            loading.value = true;
            console.log('record :>> ', record);
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

  function handleAssignmentAgent(val) {
    loading.value = true;
    console.log('val :>> ', val);
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
