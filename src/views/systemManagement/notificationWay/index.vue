<template>
  <PageWrapper contentBackground contentFullHeight>
    <template #title>
      <Radio.Group v-model:value="activeIndex">
        <Radio.Button :value="0">工作流</Radio.Button>
        <Radio.Button :value="1">普通业务</Radio.Button>
      </Radio.Group>
    </template>
    <template #extra>
      <Select v-model:value="businessType" :style="{ width: '200px' }" placeholder="请选择业务类型">
        <Select.Option v-for="item in businessTypeOptions" :key="item.value" :value="item.value">
          {{ item.label }}
        </Select.Option>
      </Select>
    </template>

    <WorkflowTable :workflow-flag="workflowFlag" />
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'NotificationWay',
  };
</script>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { Radio, Select } from 'ant-design-vue';
  import WorkflowTable from './components/workFlowTable.vue';
  import { PageWrapper } from '/@/components/Page';
  import { useUserState } from '/@/hooks/web/useUserState';

  const { getDictOptions } = useUserState();

  const businessTypeOptions = getDictOptions('DT_BUSINESS_TYPE');

  const activeIndex = ref<number>(0);
  const workflowFlag = ref<boolean>(true);
  const businessType = ref();

  watch(
    () => activeIndex.value,
    (value) => {
      workflowFlag.value = value === 0;
    },
  );
</script>
