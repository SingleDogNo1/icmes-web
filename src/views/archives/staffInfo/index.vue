<template>
  <div class="staff-info">
    {{ msg }}
  </div>
</template>

<script lang="ts">
  export default {
    name: 'StaffInfo',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, staffInfo');
</script>

<style lang="less" scoped>
  .staff-info {
    color: red;
  }
</style>
