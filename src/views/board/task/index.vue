<template>
  <div class="task-board">
    {{ msg }}
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, task-board');
</script>

<style scoped>
  .task-board {
    color: red;
  }
</style>
