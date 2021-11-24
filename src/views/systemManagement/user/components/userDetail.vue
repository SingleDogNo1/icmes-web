<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <div class="h-full overflow-auto mt-4 p-4 bg-white">
      <Tabs type="card">
        <TabPane key="user" tab="用户角色" forceRender>
          <PageWrapper contentFullHeight dense>
            <AccountRole :user="selectedRow" />
          </PageWrapper>
        </TabPane>
        <TabPane key="permission" tab="菜单权限" forceRender>
          <PageWrapper fixedHeight dense>
            <Spin :spinning="loading">
              <RoleTree :disabled="true" :checked-keys="userPermission" />
            </Spin>
          </PageWrapper>
        </TabPane>
        <TabPane key="agentAppoint" tab="指派代理" forceRender>
          <PageWrapper contentFullHeight dense>
            <AssignmentAgent :user="selectedRow" />
          </PageWrapper>
        </TabPane>
        <TabPane key="agentTake" tab="接手代理" forceRender>
          <PageWrapper contentFullHeight dense>
            <BasicTable @register="registerTakeAgentTable" :loading="loading">
              <template #startDate="{ record }">{{ formatToDate(record.proxyStartDate) }}</template>
              <template #endDate="{ record }">{{ formatToDate(record.proxyEndDate) }}</template>
              <template #proxyType="{ record }">{{ parseProxyType(record.periodDays) }}</template>
              <template #proxyCycle="{ record }">{{ parseProxyCycle(record.periodDays) }}</template>
            </BasicTable>
          </PageWrapper>
        </TabPane>
      </Tabs>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { PropType, watch, ref } from 'vue';
  import { Tabs, Spin } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { AccountModel } from '/@/api/account/model/basicModel';
  import AccountRole from './accountRole.vue';
  import AssignmentAgent from './assignmentAgent.vue';
  import { RoleTree } from '/@/components/Business';
  import { getFeaturesListByIdApi, getAssignmentProxiesListApi } from '/@/api/account/basic';
  import { BasicTable, useTable, PaginationProps } from '/@/components/Table';
  import { formatToDate, parseProxyType, parseProxyCycle } from '../helper';

  const TabPane = Tabs.TabPane;

  const props = defineProps({
    selectedRow: {
      type: Object as PropType<AccountModel>,
      required: true,
    },
  });

  const userPermission = ref<string[]>([]);
  const loading = ref<boolean>(false);

  const getProxyForm = ref({
    ascending: true,
    pageNo: 1,
    pageSize: 10,
  });

  const [registerTakeAgentTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    columns: [
      { title: '组织机构', dataIndex: 'fullOrgName', fixed: 'left' },
      { title: '角色', dataIndex: 'roleName', fixed: 'left' },
      { title: '指派人', dataIndex: 'consignProxyName', fixed: 'left' },
      { title: '开始时间', dataIndex: 'proxyStartDate', slots: { customRender: 'startDate' } },
      { title: '结束时间', dataIndex: 'proxyEndDate', slots: { customRender: 'endDate' } },
      { title: '代理类型', dataIndex: 'periodDays', slots: { customRender: 'proxyType' } },
      { title: '周期', dataIndex: 'periodDays', slots: { customRender: 'proxyCycle' } },
    ],
    striped: false,
    ellipsis: false,
    onChange: () => {
      loading.value = true;
      const page = getPaginationRef() as PaginationProps;
      const options = {
        ...getProxyForm.value,
        ...{ pageNo: page.current!, pageSize: page.pageSize! },
      };
      getAssignmentProxiesListApi(props.selectedRow?.employeeId, options)
        .then(({ items, totalCount }) => {
          setTableData(items || []);
          setPagination({
            current: page.current,
            pageSize: page.pageSize,
            total: totalCount,
          });
        })
        .finally(() => {
          loading.value = false;
        });
    },
  });

  watch(
    () => props.selectedRow,
    async (value) => {
      loading.value = true;
      try {
        const permission = await getFeaturesListByIdApi(value.employeeId);
        userPermission.value = permission.reduce((res, pre) => {
          res.push(pre.id + '');
          return res;
        }, [] as string[]);

        const { items: proxiesList, totalCount } = await getAssignmentProxiesListApi(
          value.employeeId,
          getProxyForm.value,
        );

        setTableData(proxiesList || []);
        setPagination({ total: totalCount });
      } catch (error) {
        console.log('error :>> ', error);
      } finally {
        loading.value = false;
      }
    },
    {
      deep: true,
    },
  );
</script>
