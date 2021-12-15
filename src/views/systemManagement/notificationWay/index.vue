<template>
  <div class="notification-way">
    <div class="h-full p-4 mt-4 overflow-auto bg-white">
      <header>
        <RadioGroup v-model:value="activeIndex">
          <RadioButton :value="0">工作流</RadioButton>
          <RadioButton :value="1">普通业务</RadioButton>
        </RadioGroup>
      </header>

      <WorkflowTable :workflow-flag="workflowFlag" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { Radio } from 'ant-design-vue';
  import WorkflowTable from './components/workFlowTable.vue';

  const RadioGroup = Radio.Group;
  const RadioButton = Radio.Button;

  const activeIndex = ref<number>(0);
  const workflowFlag = ref<boolean>(true);

  watch(
    () => activeIndex.value,
    (value) => {
      workflowFlag.value = value === 0;
    },
  );
</script>

<style scoped lang="less"></style>
