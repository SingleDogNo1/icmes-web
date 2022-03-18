<template>
  <!-- 定制停送电设备 api-select 样式 -->
  <Select
    @dropdown-visible-change="handleFetch"
    v-bind="$attrs"
    @change="handleChange"
    :options="getOptions"
    v-model:value="state"
    :loading="loading"
  >
    <!-- label: option 显示标题; subtitle: 补充说明的二级标题; powerTypeText: 停送电类型转换为汉字显示 -->
    <template #option="{ label, subtitle, powerTypeText }">
      <ul class="flex justify-between mb-0">
        <li class="flex items-center">
          <span>{{ label }}</span>
          <span v-if="subtitle" class="text-disabled text-xs ml-2">{{ subtitle }}</span>
        </li>
        <li class="text-disabled">{{ powerTypeText }}</li>
      </ul>
    </template>
    <template #suffixIcon v-if="loading">
      <LoadingOutlined spin />
    </template>
    <template #notFoundContent v-if="loading">
      <span>
        <LoadingOutlined spin class="mr-1" />
        {{ t('component.form.apiSelectNotFound') }}
      </span>
    </template>
  </Select>
</template>

<script lang="ts">
  export default {
    name: 'PowerCutDevicesList',
    inheritAttrs: false,
  };
</script>

<script lang="ts" setup>
  import { PropType, ref, watchEffect, computed, unref, watch } from 'vue';
  import { Select } from 'ant-design-vue';
  import { isFunction } from '/@/utils/is';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { get, omit } from 'lodash-es';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  type OptionsItem = { label: string; value: string; disabled?: boolean };

  const props = defineProps({
    value: {
      type: [Array, Object, String, Number],
    },
    numberToString: {
      type: Boolean,
    },
    api: {
      type: Function as PropType<(arg?: Recordable) => Promise<OptionsItem[]>>,
      default: null,
    },
    params: {
      type: Object as PropType<Recordable>,
      default: () => ({}),
    },
    resultField: {
      type: String,
      default: '',
    },
    labelField: {
      type: String,
      default: 'label',
    },
    valueField: {
      type: String,
      default: 'value',
    },
    immediate: {
      type: Boolean,
      default: true,
    },
  });
  const emit = defineEmits(['options-ready', 'options-change', 'change']);

  const options = ref<OptionsItem[]>([]);
  const loading = ref(false);
  const isFirstLoad = ref(true);
  const emitData = ref<any[]>([]);
  const { t } = useI18n();

  // Embedded in the form, just use the hook binding to perform form verification
  const [state] = useRuleFormItem(props, 'value', 'change', emitData);

  const getOptions = computed(() => {
    const { labelField, valueField, numberToString } = props;

    return unref(options).reduce((prev, next: Recordable) => {
      if (next) {
        const value = next[valueField];
        prev.push({
          label: next[labelField],
          value: numberToString ? `${value}` : value,
          ...omit(next, [labelField, valueField]),
        });
      }
      return prev;
    }, [] as OptionsItem[]);
  });

  watchEffect(() => {
    props.immediate && fetch();
  });

  watch(
    () => props.params,
    () => {
      !unref(isFirstLoad) && fetch();
    },
    { deep: true },
  );

  async function fetch() {
    const api = props.api;
    if (!api || !isFunction(api)) return;
    options.value = [];
    try {
      loading.value = true;
      const res = await api(props.params);
      if (Array.isArray(res)) {
        emit('options-ready', res); // 请求到结果, 未赋值
        options.value = res;
        emitChange();
        return;
      }
      if (props.resultField) {
        emit('options-ready', get(res, props.resultField) || []); // 请求到结果, 未赋值
        options.value = get(res, props.resultField) || [];
      }
      emitChange();
    } catch (error) {
      console.warn(error);
    } finally {
      loading.value = false;
    }
  }

  async function handleFetch() {
    if (!props.immediate && unref(isFirstLoad)) {
      await fetch();
      isFirstLoad.value = false;
    }
  }

  function emitChange() {
    emit('options-change', unref(getOptions));
  }

  function handleChange(_, ...args) {
    emitData.value = args;
  }
</script>
