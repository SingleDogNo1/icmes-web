<template>
  <div class="">
    {{ msg }}
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, quick-sand');
</script>

<style scoped></style>
