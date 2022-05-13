<template>
  <BasicDrawer v-bind="$attrs" @register="register" :title="title" width="50%" @close="initData">
    <Tabs v-model:activeKey="activeKey" tab-position="left" animated>
      <Tabs.TabPane key="cut" tab="停电步骤" forceRender>
        <BasicTable @register="registerCutTable" />
      </Tabs.TabPane>
      <Tabs.TabPane key="supply" tab="送电步骤" forceRender>
        <BasicTable @register="registerSupplyTable" />
      </Tabs.TabPane>
      <Tabs.TabPane key="range" tab="适用范围" forceRender>
        <BasicTable @register="registerRangeTable" />
      </Tabs.TabPane>
    </Tabs>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Tabs } from 'ant-design-vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getHvOperationApi } from '/@/api/power/hvOperation';
  import {
    HvOperateTemplateAdvanceModel,
    HvOperationTemplateStepModel,
  } from '/@/api/power/model/hvOperationModel';
  import { HvOperationTemplateTypeEnum } from '/@/enums/powerCutEnum';
  import { hvTicketStepColumns, hvTicketRangeColumns } from '../data';

  const activeKey = ref<'cut' | 'supply' | 'range'>('cut');
  const title = ref('');
  const stepParam = {
    showIndexColumn: false,
    pagination: false,
    resizeHeightOffset: 124,
    columns: hvTicketStepColumns,
  };
  const rangeParam = { pagination: false, resizeHeightOffset: 124, columns: hvTicketRangeColumns };

  const [register, { setDrawerProps }] = useDrawerInner(
    async (data: HvOperateTemplateAdvanceModel) => {
      try {
        setDrawerProps({ loading: true });
        const { steps, name, devices } = await getHvOperationApi(data.id.toString());

        title.value = name;

        const cut_tickets = steps?.reduce((res, pre) => {
          if (pre.type === HvOperationTemplateTypeEnum.CUT) res.push(pre);
          return res;
        }, [] as HvOperationTemplateStepModel[]);

        const supply_tickets = steps?.reduce((res, pre) => {
          if (pre.type === HvOperationTemplateTypeEnum.SUPPLY) res.push(pre);
          return res;
        }, [] as HvOperationTemplateStepModel[]);

        setCutTableData(cut_tickets || []);
        setSupplyTableData(supply_tickets || []);
        setRangeTableData(devices || []);
      } catch (error: any) {
        throw new Error(error);
      } finally {
        setDrawerProps({ loading: false });
      }
    },
  );

  const [registerCutTable, { setTableData: setCutTableData }] = useTable({
    ...stepParam,
    /**
     * // TODO
     * ? ant-design-vue bug: Tabs完全为静态数据时，tabPane 高度不会自动计算，导致隐藏的 tabPane 比默认显示的高度高
     * ? 所以默认加载的 tab 不需要去掉高度，默认隐藏的 tab 需要减去 124px 以保证不会出现滚动
     * ? 如何优化？
     */
    ...{ resizeHeightOffset: 0 },
  });
  const [registerSupplyTable, { setTableData: setSupplyTableData }] = useTable(stepParam);
  const [registerRangeTable, { setTableData: setRangeTableData }] = useTable(rangeParam);

  function initData() {
    activeKey.value = 'cut';
    title.value = '';
    setCutTableData([]);
    setSupplyTableData([]);
    setRangeTableData([]);
  }
</script>
