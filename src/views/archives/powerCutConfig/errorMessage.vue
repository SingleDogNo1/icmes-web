<template>
  <div class="errorMessage">
    {{ msg }}
  </div>
</template>

<script lang="ts">
  export default {
    name: 'ErrorMessage',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, errorMessage');
</script>

<style lang="less" scoped>
  .errorMessage {
    color: red;
  }
</style>
