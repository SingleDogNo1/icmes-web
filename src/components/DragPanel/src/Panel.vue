<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'Panel',
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

  const classes = computed(() => [props.split, props.className].join(' '));
</script>

<style scoped>
  .splitter-pane.vertical.splitter-paneL {
    position: absolute;
    left: 0;
    height: 100%;
    padding-right: 3px;
  }

  .splitter-pane.vertical.splitter-paneR {
    position: absolute;
    right: 0;
    height: 100%;
    padding-left: 3px;
  }

  .splitter-pane.horizontal.splitter-paneL {
    position: absolute;
    top: 0;
    width: 100%;
  }

  .splitter-pane.horizontal.splitter-paneR {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding-top: 3px;
  }
</style>
