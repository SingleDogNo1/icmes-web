<template>
  <div class="MonthPlan">
    {{ msg }}
  </div>
</template>

<script lang="ts" setup name="MonthPlan">
  // !组件名不能只有一个单词构成，并且遵循首字母大写的驼峰命名
  import { ref } from 'vue';

  const msg = ref('hello, MonthPlan');
</script>

<style lang="less" scoped>
  .MonthPlan {
    color: red;
  }
</style>
