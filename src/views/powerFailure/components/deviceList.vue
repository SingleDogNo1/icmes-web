<template>
  <ASelect
    v-model:value="$value"
    allowClear
    show-search
    optionFilterProp="title"
    mode="multiple"
    optionLabelProp="title"
    @change="change"
  >
    <ASelect.Option
      v-for="item in options"
      :key="item.id"
      :value="item.id"
      :title="item.label"
      :powerType="item.powerType"
      :code="item.code"
      :processNo="item.processNo"
    >
      <section class="flex">
        <div class="flex-1">
          <span> {{ item.label }} </span>
          <span class="text-disabled ml-4">
            {{ !item.isPrimary ? `${item.primaryName}/` : '' }}
          </span>
        </div>
        <div class="text-disabled ml-4">{{ item.powerTypeText }}</div>
      </section>
    </ASelect.Option>
    <template #suffixIcon v-if="loading">
      <LoadingOutlined spin />
    </template>
    <template #notFoundContent v-if="loading">
      <span>
        <LoadingOutlined spin class="mr-1" />
        {{ t('component.form.apiSelectNotFound') }}
      </span>
    </template>
  </ASelect>
</template>

<script lang="ts">
  export default {
    name: 'PowerCutDeviceListComp',
  };
</script>

<script lang="ts" setup>
  import { PropType, toRef } from 'vue';
  import { Select as ASelect } from 'ant-design-vue'; // select 是 html 标签的关键字，最好不要直接使用
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { PowerCutDeviceModel } from '/@/api/info/model/devicesModel';
  import { useI18n } from '/@/hooks/web/useI18n';

  type DeviceModel = PowerCutDeviceModel & { powerTypeText?: string; label?: string };

  const props = defineProps({
    value: {
      type: Array as PropType<any[]>,
      required: true,
    },
    options: {
      type: Array as PropType<DeviceModel[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const $value = toRef(props, 'value');
  const { t } = useI18n();

  const emit = defineEmits(['change']);

  function change(value, options) {
    emit('change', value, options);
  }
</script>
