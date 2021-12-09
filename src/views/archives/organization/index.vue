<template>
  <div class="organization">
    {{ msg }}
  </div>
</template>

<script lang="ts">
  export default {
    name: 'Organization',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, organization');
</script>

<style scoped>
  .organization {
    color: red;
  }
</style>
