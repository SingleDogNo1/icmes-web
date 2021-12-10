<template>
  <div class="power-cut-config">
    {{ msg }}
    <a-button @click="to">jdsakdjakja</a-button>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'PowerCutConfig',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useGo } from '/@/hooks/web/usePage';

  const go = useGo();

  function to() {
    go({ name: 'ArchivesEditPowerCutConfig' });
  }

  const msg = ref('hello, power-cut-config');
</script>

<style scoped>
  .power-cut-config {
    color: red;
  }
</style>
