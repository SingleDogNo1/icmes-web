<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="查看年度计划" width="80%">
    321
  </BasicDrawer>
</template>

<script lang="ts" setup>
  // import { ref, unref, computed } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (record) => {
    setDrawerProps({ loading: true });
    try {
      console.log('record :>> ', record);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setDrawerProps({ loading: false });
    }
  });
</script>
