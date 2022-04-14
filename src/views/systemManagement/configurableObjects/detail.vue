<template>
  <PageWrapper contentBackground contentFullHeight :title="title">
    {{ msg }}
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'ConfigurableObjectDetail',
  };
</script>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useRoute } from 'vue-router';

  const {
    query: { type: routeType, id },
  } = useRoute();

  console.log('a :>> ', routeType, id);

  const title = computed(() => {
    let title;

    if (routeType === 'create') {
      title = '新建配点对象';
    } else if (routeType === 'edit') {
      title = '编辑配点对象';
    } else if (routeType === 'view') {
      title = '查看配点对象';
    }

    return title;
  });

  const msg = ref('hello, ConfigurableObjectDetail');
</script>
