<template>
  <div> {{ msg }} </div>
</template>

<script lang="ts">
  export default {
    name: 'ProdManageDispatchDetail',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';

  const {
    params: { id: routeId },
  } = useRoute();
  const msg = ref(`hello, ProdManageDispatchDetail, id = ${routeId}`);
</script>
