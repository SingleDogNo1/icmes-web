<template>
  <div class="quark-ash">
    {{ msg }}
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, quark-ash');
</script>

<style scoped>
  .quark-ash {
    color: red;
  }
</style>
