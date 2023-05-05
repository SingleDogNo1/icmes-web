<template>
  <PageWrapper contentBackground>
    <BasicForm @register="register" @submit="handleSubmit" />
    <BasicTable @register="registerTable" :loading="loading">
      <template #toolbar>
        <a-button :disabled="!has_edit_permission" type="primary" @click="openDrawer(true, {})">
          新建
        </a-button>
      </template>

      <template #action="{ record }">
        <TableAction :actions="createActions(record)" />
      </template>
    </BasicTable>

    <StaffInfoDrawer @register="registerDrawer" @done="getInitData" />
  </PageWrapper>
</template>
<script lang="ts">
  export default {
    name: 'StaffInfo',
  };
</script>

<script lang="ts" setup>
  import { ref, nextTick, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import {
    BasicTable,
    useTable,
    TableAction,
    PaginationProps,
    ActionItem,
  } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import StaffInfoDrawer from './staffInfoDrawer.vue';
  import { PageWrapper } from '/@/components/Page';
  import { getEmployeesListSchemas as schemas, getEmployeesListColumns as columns } from './data';
  import { getEmployeeListApi, deleteEmployeeInfoByIdApi } from '/@/api/info/employee';
  import { GetEmployeesListParams, EmployeeFullNameModel } from '/@/api/info/model/employeeModel';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { error } from '/@/utils/log';

  const { getPermissionList } = usePermission();
  const { createMessage } = useMessage();

  const loading = ref(false);
  const has_edit_permission = getPermissionList()?.EMPLOYEE_EDIT;
  const [register, { getFieldsValue }] = useForm({
    labelWidth: 120,
    schemas,
    actionColOptions: {
      span: 24,
    },
    compact: true,
    showAdvancedButton: true,
    fieldMapToTime: [['join_time_range', ['joinDateStart', 'joinDateEnd'], 'x']],
  });
  const [registerTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    columns,
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

      const value = getFieldsValue() as GetEmployeesListParams;
      const form = {
        ...value,
        ...{ pageNo: page.current!, pageSize: page.pageSize! },
      };

      getEmployeeList(form);
    },
  });
  const [registerDrawer, { openDrawer }] = useDrawer();

  onMounted(() => {
    getInitData();
  });

  function createActions(record: EmployeeFullNameModel): ActionItem[] {
    return [
      {
        label: '编辑',
        onClick: () => {
          openDrawer(true, record);
        },
      },
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，确认删除数据？',
          confirm: async () => {
            try {
              await deleteEmployeeInfoByIdApi(record.id);
              createMessage.success('删除成功');
              await getInitData();
            } catch (err: any) {
              error(err);
            }
          },
        },
      },
    ];
  }

  async function getEmployeeList(params: GetEmployeesListParams) {
    try {
      loading.value = true;
      const { items, totalCount } = await getEmployeeListApi(params);
      setTableData(items || []);
      setPagination({ total: totalCount });
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }

  async function getInitData() {
    await nextTick();
    const values = getFieldsValue() as GetEmployeesListParams;
    getEmployeeList(values);
  }

  function handleSubmit(values: GetEmployeesListParams) {
    getEmployeeList(values);
  }
</script>
