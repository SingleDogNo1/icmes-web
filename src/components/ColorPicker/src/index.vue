<template>
  <Popover
    v-model:visible="visible"
    :overlayClassName="`${prefixCls}-popover`"
    placement="bottomRight"
    trigger="click"
  >
    <template #content>
      <div :class="[prefixCls, { light: isLightTheme }]" :style="{ width: totalWidth + 'px' }">
        <div class="flex">
          <Saturation
            ref="saturation"
            :color="rgbString"
            :hsv="hsv"
            :size="data.hueHeight"
            @selectSaturation="selectSaturation"
          />
          <Hue
            ref="hue"
            :hsv="hsv"
            :width="data.hueWidth"
            :height="data.hueHeight"
            @selectHue="selectHue"
          />
          <Alpha
            ref="alpha"
            :color="rgbString"
            :rgba="rgba"
            :width="data.hueWidth"
            :height="data.hueHeight"
            @selectAlpha="selectAlpha"
          />
        </div>
        <Box name="HEX" :color="data.modelHex" @inputColor="inputHex" />
        <Box name="RGBA" :color="data.modelRgba" @inputColor="inputRgba" />
        <Colors
          :color="rgbaString"
          :colors-default="colorsDefault"
          :colors-history-key="colorsHistoryKey"
          @selectColor="selectColor"
        />
        <a-button class="mt-2" size="small" @click="chooseColor">确认</a-button>
      </div>
    </template>
    <div :class="`${prefixCls}-trigger`">
      <span :style="{ background: color_new }"></span>
    </div>
  </Popover>
</template>

<script lang="ts" setup>
  import { ref, computed, nextTick, watch, PropType } from 'vue';
  import { Popover } from 'ant-design-vue';
  import { setColorValue, rgb2hex } from './composible';
  import Saturation from './Saturation.vue';
  import Hue from './Hue.vue';
  import Alpha from './Alpha.vue';
  import Box from './Box.vue';
  import Colors from './Colors.vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  const props = defineProps({
    color: {
      type: String,
      default: '#000000',
    },
    theme: {
      type: String as PropType<'dark' | 'light'>,
      default: 'dark',
    },
    colorsDefault: {
      type: Array as PropType<string[]>,
      default: () => [
        '#000000',
        '#FFFFFF',
        '#FF1900',
        '#F47365',
        '#FFB243',
        '#FFE623',
        '#6EFF2A',
        '#1BC7B1',
        '#00BEFF',
        '#2E81FF',
        '#5D61FF',
        '#FF89CF',
        '#FC3CAD',
        '#BF3DCE',
        '#8E00A7',
        'rgba(0,0,0,0)',
      ],
    },
    colorsHistoryKey: {
      type: String,
      default: 'vue-colorpicker-history',
    },
  });

  const emit = defineEmits(['changeColor']);
  const { prefixCls } = useDesign('color-picker');

  const data = ref({
    hueWidth: 15,
    hueHeight: 152,
    previewHeight: 30,
    modelRgba: '',
    modelHex: '',
    r: 0,
    g: 0,
    b: 0,
    a: 1,
    h: 0,
    s: 0,
    v: 0,
  });

  const saturation = ref();
  const hue = ref();
  const color_new = ref(props.color);
  const visible = ref<boolean>(false);

  const isLightTheme = computed(() => props.theme === 'light');
  const totalWidth = computed(() => data.value.hueHeight + (data.value.hueWidth + 8) * 2);
  const rgba = computed(() => {
    return {
      r: data.value.r,
      g: data.value.g,
      b: data.value.b,
      a: data.value.a,
    };
  });

  const hsv = computed(() => {
    return {
      h: data.value.h,
      s: data.value.s,
      v: data.value.v,
    };
  });

  const rgbString = computed(() => `rgb(${data.value.r}, ${data.value.g}, ${data.value.b})`);
  const rgbaStringShort = computed(
    () => `${data.value.r}, ${data.value.g}, ${data.value.b}, ${data.value.a}`,
  );
  const rgbaString = computed(() => `rgba(${rgbaStringShort.value})`);
  const hexString = computed(() => rgb2hex(rgba.value, true));

  function selectSaturation(color: any) {
    const { r, g, b, h, s, v } = setColorValue(color);
    Object.assign(data.value, { r, g, b, h, s, v });
    setText();
  }

  function selectHue(color: any) {
    const { r, g, b, h, s, v } = setColorValue(color);
    Object.assign(data.value, { r, g, b, h, s, v });
    setText();
    nextTick(() => {
      saturation.value.renderColor();
      saturation.value.renderSlide();
    });
  }

  function selectAlpha(a: any) {
    data.value.a = a;
    setText();
  }

  function inputHex(color: string) {
    const { r, g, b, a, h, s, v } = setColorValue(color);
    Object.assign(data.value, { r, g, b, a, h, s, v });
    data.value.modelHex = color;
    data.value.modelRgba = rgbaStringShort.value;
    nextTick(() => {
      saturation.value.renderColor();
      saturation.value.renderSlide();
      hue.value.renderSlide();
    });
  }

  function inputRgba(color: string) {
    const { r, g, b, a, h, s, v } = setColorValue(color);
    Object.assign(data.value, { r, g, b, a, h, s, v });
    data.value.modelHex = hexString.value;
    data.value.modelRgba = color;
    nextTick(() => {
      saturation.value.renderColor();
      saturation.value.renderSlide();
      hue.value.renderSlide();
    });
  }

  function setText() {
    data.value.modelHex = hexString.value;
    data.value.modelRgba = rgbaStringShort.value;
  }

  function selectColor(color: string) {
    const { r, g, b, a, h, s, v } = setColorValue(color);
    Object.assign(data.value, { r, g, b, a, h, s, v });
    setText();
    nextTick(() => {
      saturation.value.renderColor();
      saturation.value.renderSlide();
      hue.value.renderSlide();
    });
  }

  function chooseColor() {
    visible.value = false;
    emit('changeColor', {
      rgba: rgba.value,
      hsv: hsv.value,
      hex: data.value.modelHex,
    });
  }

  Object.assign(data.value, setColorValue(props.color));
  setText();

  watch(
    () => rgba.value,
    (value) => {
      color_new.value = `rgba(${value.r},${value.g},${value.b},${value.a})`;
    },
  );
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-color-picker';
  @prefix-type-cls: ~'@{prefix-cls}-type';
  @prefix-colors-cls: ~'@{prefix-cls}-colors';
  @prefix-popover-cls: ~'@{prefix-cls}-popover';
  @prefix-trigger-cls: ~'@{prefix-cls}-trigger';

  .@{prefix-cls} {
    box-sizing: content-box;
    padding: 10px;
    background: #1d2024;
    border-radius: 4px;

    &.light {
      background: #f7f8f9;
      .@{prefix-type-cls} {
        .name {
          background: #e7e8e9;
        }

        .value {
          color: #666;
          background: #eceef0;
        }
      }
      .@{prefix-colors-cls}.history {
        border-top: 1px solid #eee;
      }
    }

    canvas {
      vertical-align: top;
    }
  }

  .@{prefix-popover-cls} {
    .ant-popover-inner-content {
      padding: 0;
    }
  }
  .@{prefix-trigger-cls} {
    @apply border bg-white p-1;
    width: 40px;
    height: 40px;

    span {
      @apply w-full h-full block;
    }
  }
</style>
