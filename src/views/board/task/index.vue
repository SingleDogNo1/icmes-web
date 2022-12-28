<template>
  <PageWrapper :content-full-height="true" content-background>
    <Tabs v-model:activeKey="activeKey" type="card">
      <TabPane key="1" tab="我的审批">
        <ApprovalPane />
      </TabPane>
      <TabPane key="2" tab="我的任务">
        <TaskPane />
      </TabPane>
    </Tabs>
  </PageWrapper>
</template>

<script lang="ts" setup name="TaskBoard">
  import { ref } from 'vue';
  import { Tabs } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import ApprovalPane from './approval.vue';
  import TaskPane from './task.vue';
  import { useRoute } from 'vue-router';

  const TabPane = Tabs.TabPane;

  const { query } = useRoute();
  const activeKey = ref<string>('1');
  activeKey.value = query.tab === 'task' ? '2' : '1';
</script>
