<template>
  <div class="create-production-board">
    {{ msg }}
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, create-production-board');
</script>

<style scoped>
  .create-production-board {
    color: red;
  }
</style>
