<template>
  <Tooltip placement="top">
    <template #title>
      <span>{{ t('component.table.settingDens') }}</span>
    </template>

    <Dropdown placement="bottom" :trigger="['click']" :getPopupContainer="getPopupContainer">
      <ColumnHeightOutlined />
      <template #overlay>
        <AMenu @click="(handleTitleClick as any)" selectable v-model:selectedKeys="selectedKeysRef">
          <AMenu.Item key="default">
            <span>{{ t('component.table.settingDensDefault') }}</span>
          </AMenu.Item>
          <AMenu.Item key="middle">
            <span>{{ t('component.table.settingDensMiddle') }}</span>
          </AMenu.Item>
          <AMenu.Item key="small">
            <span>{{ t('component.table.settingDensSmall') }}</span>
          </AMenu.Item>
        </AMenu>
      </template>
    </Dropdown>
  </Tooltip>
</template>

<script lang="ts">
  export default {
    name: 'TableSizeSetting',
  };
</script>

<script lang="ts" setup>
  import type { SizeType } from '../../types/table';
  import { ref } from 'vue';
  import { Tooltip, Dropdown, Menu as AMenu } from 'ant-design-vue';
  import { ColumnHeightOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTableContext } from '../../hooks/useTableContext';
  import { getPopupContainer } from '/@/utils';

  const table = useTableContext();
  const { t } = useI18n();

  const selectedKeysRef = ref<SizeType[]>([table.getSize()]);

  function handleTitleClick({ key }: { key: SizeType }) {
    selectedKeysRef.value = [key];
    table.setProps({
      size: key,
    });
  }
</script>
