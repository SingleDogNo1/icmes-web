<template>
  <div class="">
    {{ msg }}
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello,rawCoalStorage ');
</script>

<style scoped></style>
