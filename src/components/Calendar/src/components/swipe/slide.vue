<template>
  <div :class="[{ [className]: !!className }, useSwipe ? prefixCls : '']">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  import { useDesign } from '/@/hooks/web/useDesign';

  defineProps({
    className: {
      type: String,
      default: '',
    },
    useSwipe: {
      type: Boolean,
      default: false,
    },
  });

  const { prefixCls } = useDesign('calendar-swipe-slide');
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-calendar-swipe-slide';

  .@{prefix-cls} {
    width: 100%;
    height: 100%;
    float: left;
    position: relative;
  }
</style>
