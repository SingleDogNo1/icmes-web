<template>
  <div
    :style="{ cursor: cursor, userSelect: userSelect }"
    class="vue-splitter-container"
    @mouseup="onMouseUp"
    @mousemove="onMouseMove"
  >
    <Panel class="splitter-pane splitter-paneL" :split="split" :style="{ [type]: percent + '%' }">
      <slot name="paneL"></slot>
    </Panel>

    <Resizer
      :className="className"
      :style="{ [resizeType]: percent + '%' }"
      :split="split"
      @mousedown="onMouseDown"
      @click="onClick"
    />

    <Panel
      class="splitter-pane splitter-paneR"
      :split="split"
      :style="{ [type]: 100 - percent + '%' }"
    >
      <slot name="paneR"></slot>
    </Panel>
    <div class="vue-splitter-container-mask" v-if="active"></div>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'SplitPanel',
  };
</script>

<script lang="ts" setup>
  import { computed, ref, unref, watch } from 'vue';
  import Resizer from './Resizer.vue';
  import Panel from './Panel.vue';

  const props = defineProps({
    minPercent: {
      type: Number,
      default: 10,
    },
    defaultPercent: {
      type: Number,
      default: 50,
    },
    className: {
      type: String,
    },
    split: {
      type: String,
      required: true,
      validator: (v: string) => ['vertical', 'horizontal'].includes(v),
    },
  });

  const emit = defineEmits(['resize']);

  const active = ref<boolean>(false);
  const hasMoved = ref<boolean>(false);
  const percent = ref(props.defaultPercent);
  const type = props.split === 'vertical' ? 'width' : 'height';
  const resizeType = props.split === 'vertical' ? 'left' : 'top';

  const userSelect = computed(() => (unref(active) ? 'none' : 'auto'));
  const cursor = computed(() =>
    unref(active) ? (props.split === 'vertical' ? 'col-resize' : 'row-resize') : '',
  );

  function onClick() {
    if (!unref(hasMoved)) {
      percent.value = 50;
      emit('resize', percent.value);
    }
  }

  function onMouseDown() {
    active.value = true;
    hasMoved.value = false;
  }

  function onMouseUp() {
    active.value = false;
  }

  function onMouseMove(e) {
    if (e.buttons === 0 || e.which === 0) {
      active.value = false;
    }

    if (active.value) {
      let offset = 0;
      let target = e.currentTarget;
      if (props.split === 'vertical') {
        while (target) {
          offset += target.offsetLeft;
          target = target.offsetParent;
        }
      } else {
        while (target) {
          offset += target.offsetTop;
          target = target.offsetParent;
        }
      }

      const currentPage = props.split === 'vertical' ? e.pageX : e.pageY;
      const targetOffset =
        props.split === 'vertical' ? e.currentTarget.offsetWidth : e.currentTarget.offsetHeight;
      const PERCENT = Math.floor(((currentPage - offset) / targetOffset) * 10000) / 100;

      if (PERCENT > props.minPercent && PERCENT < 100 - props.minPercent) {
        percent.value = PERCENT;
      }

      emit('resize', percent.value);
      hasMoved.value = true;
    }
  }

  watch(
    () => props.defaultPercent,
    (val) => {
      percent.value = val;
    },
  );
</script>

<style scoped>
  .vue-splitter-container {
    position: relative;
    height: 100%;
  }

  .vue-splitter-container-mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
  }
</style>
