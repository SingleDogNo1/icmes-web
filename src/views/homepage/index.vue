<template>
  <PageWrapper>
    <div>hello, {{ msg }}</div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  const msg = ref('homepage');
</script>
