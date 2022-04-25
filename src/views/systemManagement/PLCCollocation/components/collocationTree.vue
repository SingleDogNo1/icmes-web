<template>
  <div class="w-full h-full bg-white">
    {{ msg }}
  </div>
</template>

<script lang="ts">
  export default {
    name: 'CollocationTree',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, ');
</script>
