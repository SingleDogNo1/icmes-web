<template>
  <PageWrapper>
    <div>hello, {{ msg }}</div>
    <Pagination :total="100" @change="handlePageChange" @size-change="handleSizeChange" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import Pagination from '/@/components/Pagination/index.vue';
  import { PageWrapper } from '/@/components/Page';
  const msg = ref('homepage');

  function handlePageChange(pageNo) {
    console.log('pageNo :>> ', pageNo);
  }

  function handleSizeChange(pageNo, pageSize) {
    console.log('pageNo, pageSize :>> ', pageNo, pageSize);
  }
</script>
