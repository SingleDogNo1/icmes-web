<template>
  <BasicTable @register="registerTable" :loading="loading">
    <template #toolbar>
      <a-button type="primary" @click="openModal(true, {})">分配角色</a-button>
    </template>
    <template #action="{ record }">
      <TableAction :actions="createActions(record)" />
    </template>
  </BasicTable>

  <DistributionRoleModal @register="registerModal" @submit="handleDistributionRole" />
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
  import { getRolesListByIdApi } from '/@/api/account/roles';
  import { distributionRoleByIdApi, delRoleByIdApi } from '/@/api/account/basic';
  import { GetRoleListByIdParams, AccountRoleModel } from '/@/api/account/model/rolesModel';
  import { AccountModel } from '/@/api/account/model/basicModel';
  import DistributionRoleModal from './distributionRoleModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();

  const props = defineProps({
    user: {
      type: Object as PropType<AccountModel>,
      required: true,
    },
  });

  const loading = ref<boolean>(false);
  const searchForm = ref<GetRoleListByIdParams>({
    ascending: true,
    orderBy: 'organizationId',
    pageNo: 1,
    pageSize: 10,
  });

  const [registerTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    columns: [
      {
        title: '组织机构',
        dataIndex: 'fullOrgName',
        fixed: 'left',
      },
      { title: '角色', dataIndex: 'roleName' },
    ],
    striped: false,
    ellipsis: false,
    actionColumn: {
      width: 160,
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

  function createActions(record: AccountRoleModel): ActionItem[] {
    return [
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，确认删除数据？',
          confirm: () => {
            loading.value = true;
            delRoleByIdApi(props.user.employeeId, record.organizationId, record.roleId)
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
    getRolesListByIdApi(id, options)
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

  function handleDistributionRole({ orgId, roleId }) {
    loading.value = true;
    console.log('val :>> ', orgId, roleId);
    const { employeeId } = props.user;
    distributionRoleByIdApi(employeeId, {
      orgId,
      roleId,
    })
      .then(() => {
        createMessage.success('保存成功');
        refreshData();
      })
      .finally(() => {
        loading.value = false;
      });
  }

  watch(
    () => props.user,
    () => {
      loading.value = true;
      refreshData();
    },
    {
      deep: true,
    },
  );
</script>
