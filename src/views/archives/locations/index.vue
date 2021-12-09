<template>
  <div class="location">
    {{ msg }}
  </div>
</template>

<script lang="ts">
  export default {
    name: 'Location',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, location');
</script>

<style scoped>
  .location {
    color: red;
  }
</style>
