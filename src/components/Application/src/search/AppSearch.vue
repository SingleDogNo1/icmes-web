<template>
  <div class="p-1" @click="changeModal(true)">
    <Tooltip>
      <template #title>{{ t('common.searchText') }}</template>
      <SearchOutlined />
    </Tooltip>
    <AppSearchModal @close="changeModal(false)" :visible="showModal" />
  </div>
</template>

<script lang="ts">
  export default {
    name: 'AppSearch',
  };
</script>

<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { useMagicKeys } from '@vueuse/core';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import AppSearchModal from './AppSearchModal.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const showModal = ref(false);

  const { shift, ctrl, f } = useMagicKeys();

  watchEffect(() => {
    if (shift.value && ctrl.value && f.value) {
      changeModal(true);
    }
  });

  function changeModal(show: boolean) {
    showModal.value = show;
  }
</script>
