<template>
  <div class="electricianSetting">
    {{ msg }}
  </div>
</template>

<script lang="ts">
  export default {
    name: 'ElectricianSetting',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, electricianSetting');
</script>

<style lang="less" scoped>
  .electricianSetting {
    color: red;
  }
</style>
