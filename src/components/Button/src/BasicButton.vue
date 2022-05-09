<template>
  <Button v-bind="getBindValue" :class="getButtonClass" @click="onClick">
    <template #[item]="data" v-for="item in Object.keys($slots)" :key="item">
      <template v-if="item === 'default'">
        <Icon :icon="preIcon" v-if="preIcon" :size="iconSize" class="mr-1.5" />
        <slot v-bind="data || {}"></slot>
        <Icon :icon="postIcon" v-if="postIcon" :size="iconSize" class="ml-1.5" />
      </template>

      <slot v-else :name="item" v-bind="data || {}"></slot>
    </template>
  </Button>
</template>

<script lang="ts">
  export default {
    name: 'AButton',
    inheritAttrs: false,
  };
</script>

<script lang="ts" setup>
  import { computed, unref } from 'vue';
  import { Button } from 'ant-design-vue';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { buttonProps } from './props';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { useDesign } from '/@/hooks/web/useDesign';

  const props = defineProps(buttonProps);
  const { prefixCls } = useDesign('button');
  // get component class
  const attrs = useAttrs({ excludeDefaultKeys: false });
  const getButtonClass = computed(() => {
    const { color, disabled } = props;
    return [
      prefixCls,
      {
        [`ant-btn-${color}`]: !!color,
        [`is-disabled`]: disabled,
      },
    ];
  });

  // get inherit binding value
  const getBindValue = computed(() => ({ ...unref(attrs), ...props }));
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-button';

  .@{prefix-cls} {
    display: inline-flex;
    align-items: center;
  }
</style>
