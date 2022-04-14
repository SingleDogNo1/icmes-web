<template>
  <div class="plc-judgment-rule">
    <BasicForm class="bg-white" @register="register" @submit="handleSubmit" />
  </div>
</template>

<script lang="ts">
  export default {
    name: 'PlcJudgmentRule',
  };
</script>

<script lang="ts" setup>
  import { BasicForm } from '/@/components/Form';
</script>

<style lang="less" scoped>
  .plc-judgment-rule {
    color: red;
  }
</style>
