<template>
  <div class="operationTicket">
    {{ msg }}
  </div>
</template>

<script lang="ts">
  export default {
    name: 'OperationTicket',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, operationTicket');
</script>

<style lang="less" scoped>
  .operationTicket {
    color: red;
  }
</style>
