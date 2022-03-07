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
  import { getRolesListByIdApi } from '/@/api/account/basic';
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
      const options = {
        ...searchForm.value,
        ...{ pageNo: page.current!, pageSize: page.pageSize! },
      };
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
          confirm: async () => {
            loading.value = true;

            try {
              await delRoleByIdApi(props.user.employeeId, record.organizationId, record.roleId);
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

  async function getRolesListById(id: number, options: GetRoleListByIdParams) {
    loading.value = true;
    try {
      const { items, totalCount } = await getRolesListByIdApi(id, options);
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
    getRolesListById(props.user.employeeId, options);
  }

  async function handleDistributionRole({ orgId, roleId }: { orgId: number; roleId: number }) {
    loading.value = true;
    const { employeeId } = props.user;
    try {
      await distributionRoleByIdApi(employeeId, { orgId, roleId });
      createMessage.success('保存成功');
      await refreshData();
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
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
