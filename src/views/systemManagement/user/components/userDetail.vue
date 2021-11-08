<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <div class="h-full overflow-auto mt-4 p-4 bg-white">
      <Tabs type="card">
        <TabPane key="user" tab="用户角色" forceRender>
          <PageWrapper contentFullHeight fixedHeight dense>
            <AccountRole :user="selectedRow" />
          </PageWrapper>
        </TabPane>
        <TabPane key="permission" tab="菜单权限" forceRender>
          <PageWrapper contentFullHeight dense> 菜单权限 </PageWrapper>
        </TabPane>
        <TabPane key="agentAppoint" tab="指派代理" forceRender>
          <PageWrapper contentFullHeight dense> 指派代理 </PageWrapper>
        </TabPane>
        <TabPane key="agentTake" tab="接手代理" forceRender>
          <PageWrapper contentFullHeight dense> 接手代理 </PageWrapper>
        </TabPane>
      </Tabs>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { Tabs } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import AccountRole from './accountRole.vue';
  import { AccountModel } from '/@/api/account/model/basicModel';

  defineProps({
    selectedRow: {
      type: Object as PropType<AccountModel>,
      required: true,
    },
  });

  const TabPane = Tabs.TabPane;
</script>
