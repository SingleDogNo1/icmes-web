<template>
  <div class="alarm-board">
    {{ msg }}
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, alarm-board');
</script>

<style scoped>
  .alarm-board {
    color: red;
  }
</style>
