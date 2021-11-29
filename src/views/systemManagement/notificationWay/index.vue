<template>
  <div class="notification-way">
    <div class="h-full p-4 mt-4 overflow-auto bg-white">
      <header>
        <RadioGroup v-model:value="value" @change="onChange">
          <RadioButton :value="0">工作流</RadioButton>
          <RadioButton :value="1">普通业务</RadioButton>
        </RadioGroup>
      </header>

      <WorkflowTable />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { RadioGroup, RadioButton } from 'ant-design-vue';
  import WorkflowTable from './components/workFlowTable.vue';

  const value = ref<number>(0);
  console.log(value);

  function onChange() {}
</script>

<style scoped lang="less"></style>
