<template>
  <div :class="prefixCls">
    <span class="name"> {{ name }} </span>
    <input v-model="modelColor" class="value" />
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  const props = defineProps({
    name: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['inputColor']);
  const { prefixCls } = useDesign('color-picker-type');

  const modelColor = computed({
    get() {
      return props.color || '';
    },
    set(val) {
      emit('inputColor', val);
    },
  });
</script>

<style scoped lang="less">
  @prefix-cls: ~'@{namespace}-color-picker-type';
  .@{prefix-cls} {
    display: flex;
    margin-top: 8px;
    font-size: 12px;

    .name {
      width: 60px;
      height: 30px;
      float: left;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #999;
      background: #252930;
    }

    .value {
      flex: 1;
      height: 30px;
      min-width: 100px;
      padding: 0 12px;
      border: 0;
      color: #fff;
      background: #2e333a;
      box-sizing: border-box;
    }
  }
</style>
