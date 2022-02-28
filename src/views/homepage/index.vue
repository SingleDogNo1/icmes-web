<template>
  <PageWrapper dense contentFullHeight :class="prefixCls" />
</template>

<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { useDesign } from '/@/hooks/web/useDesign';

  const { prefixCls } = useDesign('home');
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-home';

  .@{prefix-cls} {
    background: url('./welcome.png') center/cover no-repeat;
  }
</style>
