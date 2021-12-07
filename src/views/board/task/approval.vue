<template>
  <div class="approval-pane">
    {{ msg }}
  </div>
</template>

<script lang="ts">
  export default {
    name: 'ApprovalPane',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, approval-pane');
</script>

<style scoped>
  .approval-pane {
    color: red;
  }
</style>
