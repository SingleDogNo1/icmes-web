<template>
  <BasicTable @register="registerTable" :loading="loading">
    <template #toolbar>
      <a-button type="primary" @click="openDialog">分配角色</a-button>
    </template>
    <template #action="{ record }">
      <TableAction :actions="createActions(record)" />
    </template>
  </BasicTable>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import {
    BasicTable,
    useTable,
    TableAction,
    PaginationProps,
    ActionItem,
  } from '/@/components/Table';
  import { getRolesListByIdApi } from '/@/api/account/roles';
  import { GetRoleListByIdParams } from '/@/api/account/model/rolesModel';

  const props = defineProps({
    user: {
      type: Object,
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

  function createActions(record): ActionItem[] {
    return [
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，确认删除数据？',
          confirm: () => {
            console.log('删除 :>> ', record);
          },
        },
      },
    ];
  }

  function openDialog() {
    console.log('分配角色 :>> ');
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

  watch(
    () => props.user,
    (value) => {
      loading.value = true;
      // 重置分页
      setPagination({ current: 1, pageSize: 10 });
      const options = { ...searchForm.value, ...{ pageNo: 1, pageSize: 10 } };
      getRolesListById(value?.employeeId, options);
    },
    {
      deep: true,
    },
  );
</script>
