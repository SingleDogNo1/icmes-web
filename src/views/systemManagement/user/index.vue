<template>
  <div class="user">
    {{ msg }}
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, user');
</script>

<style scoped>
  .user {
    color: red;
  }
</style>
