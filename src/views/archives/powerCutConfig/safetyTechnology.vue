<template>
  <div class="safetyTechnology">
    {{ msg }}
  </div>
</template>

<script lang="ts">
  export default {
    name: 'SafetyTechnology',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, safetyTechnology');
</script>

<style lang="less" scoped>
  .safetyTechnology {
    color: red;
  }
</style>
