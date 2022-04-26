<template>
  <div class="abcdefg">
    {{ msg }}
  </div>
</template>

<script lang="ts">
  export default {
    name: 'ABCDEFG',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, abcdefg');
</script>

<style lang="less" scoped>
  .abcdefg {
    color: red;
  }
</style>
