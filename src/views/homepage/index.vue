<template>
  <div>hello, {{ msg }}</div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  const msg = ref('homepage');
</script>
