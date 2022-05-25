<template>
  <CollapseContainer title="用户角色" :canExpan="false">
    <BasicForm @register="register" />
    <BasicTable @register="registerTable" :loading="loading" />
  </CollapseContainer>
</template>

<script lang="ts">
  export default {
    name: 'UserRole',
  };
</script>

<script lang="ts" setup>
  import { onMounted, nextTick, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTable, useTable, PaginationProps } from '/@/components/Table';
  import { CollapseContainer } from '/@/components/Container';
  import { RoleSearchSchemas, RoleTableColumns } from './data';
  import { getRolesListByIdApi } from '/@/api/account/basic';
  import { GetRoleListByIdParams } from '/@/api/account/model/rolesModel';
  import { useUserStore } from '/@/store/modules/user';

  const { getUserInfo: userInfo } = useUserStore();

  const loading = ref<boolean>(false);

  const [register, { getFieldsValue, setFieldsValue }] = useForm({
    showActionButtonGroup: false,
    schemas: RoleSearchSchemas,
  });

  const [registerTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    columns: RoleTableColumns,
    onChange: async () => {
      const page = getPaginationRef() as PaginationProps;
      await nextTick();
      setFieldsValue({
        pageNo: page.current,
        pageSize: page.pageSize,
      });
      getRolesListById({ pageNo: page.current!, pageSize: page.pageSize! });
    },
  });

  async function getRolesListById(params: GetRoleListByIdParams) {
    const { employeeId } = userInfo!;
    loading.value = true;
    try {
      const { items, totalCount } = await getRolesListByIdApi(employeeId, params);
      setTableData(items || []);
      setPagination({ total: totalCount });
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }

  onMounted(async () => {
    const value = getFieldsValue() as GetRoleListByIdParams;
    console.log('value :>> ', value);
    getRolesListById(value);
  });
</script>
