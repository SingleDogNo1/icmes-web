<template>
  <div class="role">
    {{ msg }}
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, role');
</script>

<style scoped>
  .role {
    color: red;
  }
</style>
