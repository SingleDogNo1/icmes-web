<template>
  <div class="plcJudgmentRule">
    {{ msg }}
  </div>
</template>

<script lang="ts">
  export default {
    name: 'PLCJudgmentRule',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, plcJudgmentRule');
</script>

<style lang="less" scoped>
  .plcJudgmentRule {
    color: red;
  }
</style>
