<template>
  <div>
    <ul :class="prefixCls">
      <li v-for="item in colorsDefault" :key="item" class="item" @click="selectColor(item)">
        <div :style="{ background: `url(${imgAlphaBase64})` }" class="alpha"></div>
        <div :style="{ background: item }" class="color"></div>
      </li>
    </ul>
    <ul v-if="colorsHistory.length" :class="[prefixCls, 'history']">
      <li v-for="item in colorsHistory" :key="item" class="item" @click="selectColor(item)">
        <div :style="{ background: `url(${imgAlphaBase64})` }" class="alpha"></div>
        <div :style="{ background: item }" class="color"></div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'ColorPickerColors',
  };
</script>

<script lang="ts" setup>
  import { onUnmounted, ref, PropType } from 'vue';
  import { createAlphaSquare } from './composible';
  import { useDesign } from '/@/hooks/web/useDesign';

  const props = defineProps({
    color: {
      type: String,
      default: '#000000',
    },
    colorsDefault: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    colorsHistoryKey: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['selectColor']);
  const { prefixCls } = useDesign('color-picker-colors');

  const colorsHistory = ref<string[]>([]);
  const imgAlphaBase64 = ref();
  if (props.colorsHistoryKey && localStorage) {
    colorsHistory.value = JSON.parse(localStorage.getItem(props.colorsHistoryKey) as string) || [];
  }

  imgAlphaBase64.value = createAlphaSquare(4).toDataURL();

  onUnmounted(() => {
    setColorsHistory(props.color);
  });

  function setColorsHistory(color: string) {
    if (!color) {
      return;
    }
    const colors: string[] = colorsHistory.value || [];
    const index = colors.indexOf(color);
    if (index >= 0) {
      colors.splice(index, 1);
    }
    if (colors.length >= 8) {
      colors.length = 7;
    }
    colors.unshift(color);
    colorsHistory.value = colors || [];
    if (localStorage && props.colorsHistoryKey)
      localStorage.setItem(props.colorsHistoryKey, JSON.stringify(colors));
  }
  function selectColor(color: any) {
    emit('selectColor', color);
  }
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-color-picker-colors';
  .@{prefix-cls} {
    padding: 0;
    margin: 0;

    &.history {
      margin-top: 10px;
      border-top: 1px solid #2e333a;
    }

    .item {
      position: relative;
      width: 16px;
      height: 16px;
      margin: 10px 0 0 10px;
      border-radius: 3px;
      box-sizing: border-box;
      vertical-align: top;
      display: inline-block;
      transition: all 0.1s;
      cursor: pointer;

      &:nth-child(8n + 1) {
        margin-left: 0;
      }

      &:hover {
        transform: scale(1.4);
      }

      .alpha {
        height: 100%;
        border-radius: 4px;
      }

      .color {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 3px;
      }
    }
  }
</style>
