<template>
  <div class="powerSystemList">
    {{ msg }}
  </div>
</template>

<script lang="ts">
  export default {
    name: 'PowerSystemList',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, powerSystemList');
</script>

<style lang="less" scoped>
  .powerSystemList {
    color: red;
  }
</style>
