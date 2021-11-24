<template>
  <div class="power-failure">
    <header>
      <BasicForm
        autoFocusFirstItem
        :labelWidth="100"
        :schemas="schemas"
        :actionColOptions="{ span: 24 }"
      />
    </header>
  </div>
</template>

<script lang="ts" setup>
  import { BasicForm } from '/@/components/Form/index';
  import { schemas } from './data';
</script>

<style lang="less" scoped>
  .power-failure {
    header {
      padding: 30px;
    }
  }
</style>
