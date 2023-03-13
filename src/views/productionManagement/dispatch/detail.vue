<template>
  <PageWrapper title="title" contentFullHeight contentBackground>
    <div> {{ msg }} </div>
  </PageWrapper>
</template>

<script lang="ts" setup name="ProdManageDispatchDetail">
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';

  const {
    params: { id: routeId },
  } = useRoute();
  const msg = ref(`hello, ProdManageDispatchDetail, id = ${routeId}`);
</script>
