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
          <PageWrapper contentFullHeight dense> 接手代理 </PageWrapper>
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
  import { getFeaturesListByIdApi } from '/@/api/account/basic';

  const TabPane = Tabs.TabPane;

  const props = defineProps({
    selectedRow: {
      type: Object as PropType<AccountModel>,
      required: true,
    },
  });

  const userPermission = ref<string[]>([]);
  const loading = ref<boolean>(false);

  watch(
    () => props.selectedRow,
    (value) => {
      loading.value = true;
      getFeaturesListByIdApi(value.employeeId)
        .then((data) => {
          userPermission.value = data.reduce((res, pre) => {
            res.push(pre.id + '');
            return res;
          }, [] as string[]);
        })
        .finally(() => {
          loading.value = false;
        });
    },
    {
      deep: true,
    },
  );
</script>
