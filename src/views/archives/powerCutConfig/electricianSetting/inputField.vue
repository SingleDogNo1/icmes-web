<template>
  <div class="flex items-center">
    <InputNumber v-model:value="_value" :min="min" :max="max">
      <template #addonAfter>
        <a-button type="text" size="small" :loading="loading" @click="handleClick"> 修改 </a-button>
      </template>
    </InputNumber>
    <span class="text-disabled ml-2 text-sm">{{ desc }}</span>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'ElectricianSettingInputField',
  };
</script>

<script lang="ts" setup>
  import { toRef, watch, ref } from 'vue';
  import { InputNumber } from 'ant-design-vue';

  const props = defineProps({
    value: {
      type: [Number, String],
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['change']);

  const _value = ref<string | number>('');
  const value = toRef(props, 'value');
  watch(value, (value) => {
    if (value) _value.value = value;
  });

  watch(
    () => props.value,
    (val) => {
      if (val) _value.value = val;
    },
  );

  function handleClick() {
    emit('change', _value.value);
  }
</script>
