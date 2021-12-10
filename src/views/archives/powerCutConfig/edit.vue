<template>
  <div class="power-cut-config-edit">
    {{ msg }}
  </div>
</template>

<script lang="ts">
  export default {
    name: 'PowerCutConfigEdit',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, power-cut-config-edit');
</script>

<style scoped>
  .power-cut-config-edit {
    color: red;
  }
</style>
