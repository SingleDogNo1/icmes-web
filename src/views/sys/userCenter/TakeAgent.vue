<template>
  <CollapseContainer title="接手代理" :canExpan="false">
    <BasicTable @register="registerTable" :loading="loading">
      <template #startDate="{ record }">{{ formatToDate(record.proxyStartDate) }}</template>
      <template #endDate="{ record }">{{ formatToDate(record.proxyEndDate) }}</template>
      <template #proxyType="{ record }">{{ parseProxyType(record.periodDays) }}</template>
      <template #proxyCycle="{ record }">{{ parseProxyCycle(record.periodDays) }}</template>
    </BasicTable>
  </CollapseContainer>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { BasicTable, useTable, PaginationProps } from '/@/components/Table';
  import { CollapseContainer } from '/@/components/Container';
  import { getAssignmentProxiesListApi } from '/@/api/account/basic';
  import {
    formatToDate,
    parseProxyType,
    parseProxyCycle,
  } from '/@/views/systemManagement/user/helper';
  import { useUserStore } from '/@/store/modules/user';
  import { agentTableColumns } from './data';

  const { getUserInfo: userInfo } = useUserStore();

  const loading = ref<boolean>(false);
  const getProxyForm = ref({
    ascending: true,
    pageNo: 1,
    pageSize: 10,
  });

  const [registerTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    columns: agentTableColumns,
    striped: false,
    ellipsis: false,
    onChange: async () => {
      loading.value = true;
      const page = getPaginationRef() as PaginationProps;
      const options = {
        ...getProxyForm.value,
        ...{ pageNo: page.current!, pageSize: page.pageSize! },
      };

      getRolesListById(options);
    },
  });

  async function getRolesListById(params) {
    loading.value = true;

    try {
      const { employeeId } = userInfo!;
      const { items, totalCount } = await getAssignmentProxiesListApi(employeeId, params);
      setTableData(items || []);
      setPagination({ total: totalCount });
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    getRolesListById(getProxyForm.value);
  });
</script>
