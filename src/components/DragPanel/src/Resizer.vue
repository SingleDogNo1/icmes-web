<template>
  <div :class="classes"></div>
</template>

<script lang="ts">
  export default {
    name: 'DragPanelResizer',
  };
</script>

<script lang="ts" setup>
  import { computed } from 'vue';

  const props = defineProps({
    className: {
      type: String,
    },
    split: {
      type: String,
      validator: (v: string) => ['vertical', 'horizontal'].includes(v),
    },
  });

  const classes = computed(() => ['splitter-pane-resizer', props.split, props.className].join(' '));
</script>

<style scoped lang="less">
  .splitter-pane-resizer {
    position: absolute;
    z-index: 1;
    background: @border-color-base;
    box-sizing: border-box;
    background-clip: padding-box;

    &.horizontal {
      width: 100%;
      height: 11px;
      margin: -5px 0;
      cursor: row-resize;
      border-top: 5px solid rgba(255, 255, 255, 0);
      border-bottom: 5px solid rgba(255, 255, 255, 0);
    }

    &.vertical {
      width: 11px;
      height: 100%;
      margin-left: -5px;
      cursor: col-resize;
      border-right: 5px solid rgba(255, 255, 255, 0);
      border-left: 5px solid rgba(255, 255, 255, 0);
    }

    &:hover {
      border-color: fade(@primary-color, 10%);
    }
  }
</style>
