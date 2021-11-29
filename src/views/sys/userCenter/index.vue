<template>
  <div class="user-center">
    {{ msg }}
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, user-center');
</script>

<style scoped>
  .user-center {
    color: red;
  }
</style>
