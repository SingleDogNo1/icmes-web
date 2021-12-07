<template>
  <div class="task-pane">
    {{ msg }}
  </div>
</template>

<script lang="ts">
  export default {
    name: 'TaskPane',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, task-pane');
</script>

<style scoped>
  .task-pane {
    color: red;
  }
</style>
