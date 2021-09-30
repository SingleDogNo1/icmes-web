<template>
  <div class="production-board">
    {{ msg }}
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, production-board');
</script>

<style scoped>
  .production-board {
    color: red;
  }
</style>
