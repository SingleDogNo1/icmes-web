<template>
  <PageWrapper :content-full-height="true" content-background>
    <Tabs v-model:activeKey="activeKey">
      <TabPane :key="1" tab="我的审批">
        <ApprovalPane />
      </TabPane>
      <TabPane :key="2" tab="我的任务">
        <TaskPane />
      </TabPane>
    </Tabs>
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'TaskBoard',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Tabs } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import ApprovalPane from './approval.vue';
  import TaskPane from './task.vue';

  const TabPane = Tabs.TabPane;

  const activeKey = ref<number>(1);
</script>

<style scoped>
  .task-board {
    color: red;
  }
</style>
