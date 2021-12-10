<template>
  <div ref="colorAlphaRef" :class="prefixCls" @mousedown.prevent.stop="handleSelectAlpha">
    <canvas ref="canvasAlpha"></canvas>
    <div :style="slideAlphaStyle" class="slide"></div>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'ColorPickerAlpha',
  };
</script>

<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';
  import { createAlphaSquare, createLinearGradient } from './helper';
  import { useDesign } from '/@/hooks/web/useDesign';

  const props = defineProps({
    color: {
      type: String,
      default: '#000000',
    },
    rgba: {
      type: Object,
      default: null,
    },
    width: {
      type: Number,
      default: 15,
    },
    height: {
      type: Number,
      default: 152,
    },
  });

  const emit = defineEmits(['selectAlpha']);

  const { prefixCls } = useDesign('color-picker-alpha');
  const slideAlphaStyle = ref({});
  const alphaSize = ref(5);
  const canvasAlpha = ref();
  const colorAlphaRef = ref();

  function renderColor() {
    const { width, height, color } = props;
    const canvasSquare = createAlphaSquare(alphaSize.value);

    const ctx = canvasAlpha.value.getContext('2d');
    canvasAlpha.value.width = width;
    canvasAlpha.value.height = height;

    ctx.fillStyle = ctx.createPattern(canvasSquare, 'repeat');
    ctx.fillRect(0, 0, width, height);

    createLinearGradient('p', ctx, width, height, 'rgba(255,255,255,0)', color);
  }

  function renderSlide() {
    slideAlphaStyle.value = {
      top: props.rgba.a * props.height - 2 + 'px',
    };
  }

  function handleSelectAlpha(e: any) {
    const { top: hueTop } = colorAlphaRef.value.getBoundingClientRect();

    const mousemove = (e: any) => {
      let y = e.clientY - hueTop;

      if (y < 0) {
        y = 0;
      }
      if (y > props.height) {
        y = props.height;
      }

      let a = parseFloat((y / props.height).toFixed(2));
      emit('selectAlpha', a);
    };

    mousemove(e);

    const mouseup = () => {
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
    };

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
  }

  watch(
    () => props.color,
    () => {
      renderColor();
    },
  );

  watch(
    () => props.rgba.a,
    () => {
      renderSlide();
    },
  );

  onMounted(() => {
    renderColor();
    renderSlide();
  });
</script>

<style scoped lang="less">
  @prefix-cls: ~'@{namespace}-color-picker-alpha';
  .@{prefix-cls} {
    position: relative;
    margin-left: 8px;
    cursor: pointer;

    .slide {
      position: absolute;
      left: 0;
      top: 100px;
      width: 100%;
      height: 4px;
      background: #fff;
      box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.3);
      pointer-events: none;
    }
  }
</style>
