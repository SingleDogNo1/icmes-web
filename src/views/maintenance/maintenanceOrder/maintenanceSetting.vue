<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    title="检修单配置"
    width="50%"
    @close="initData"
  >
    <Tabs v-model:activeKey="activeKey" animated>
      <Tabs.TabPane key="supply" tab="基本" forceRender>
        <BasicTable @register="registerSupplyTable" />
      </Tabs.TabPane>
      <Tabs.TabPane key="range" tab="通用措施" forceRender>
        <span>12313</span>
      </Tabs.TabPane>
    </Tabs>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Tabs } from 'ant-design-vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTable, useTable } from '/@/components/Table';

  const activeKey = ref<'cut' | 'supply' | 'range'>('cut');
  const stepParam = {
    showIndexColumn: false,
    pagination: false,
    resizeHeightOffset: 124,
    columns: [{}],
  };

  const [register, { setDrawerProps }] = useDrawerInner(async () => {
    try {
      setDrawerProps({ loading: true });

      // setTableData([]);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setDrawerProps({ loading: false });
    }
  });

  const [registerSupplyTable, { setTableData }] = useTable(stepParam);

  function initData() {
    setTableData([]);
  }
</script>
