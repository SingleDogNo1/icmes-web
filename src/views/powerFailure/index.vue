<template>
  <div class="power-failure">
    {{ msg }}
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, power-failure');
</script>

<style scoped>
  .power-failure {
    color: red;
  }
</style>
