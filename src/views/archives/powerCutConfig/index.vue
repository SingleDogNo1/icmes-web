<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <div ref="wrapperRef" :class="prefixCls">
      <Tabs tab-position="left" :tabBarStyle="{ width: '150px' }">
        <template v-for="item in tabsList" :key="item.key">
          <TabPane :tab="item.name">
            <component :is="regComponent(item.component)" />
          </TabPane>
        </template>
      </Tabs>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { Tabs } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import PowerCutType from './powerCutType/index.vue';
  import DeviceChargedType from './deviceChargedType/index.vue';
  import PLCJudgmentRule from './plcJudgmentRule.vue';
  import SafetyTechnology from './safetyTechnology.vue';
  import OperationTicket from './operationTicket.vue';
  import PowerSystemList from './powerSystemList.vue';
  import ElectricianSetting from './electricianSetting.vue';
  import ErrorMessage from './errorMessage.vue';
  import { tabsList } from './powerCutType/data';
  import { useDesign } from '/@/hooks/web/useDesign';

  const TabPane = Tabs.TabPane;
  const { prefixCls } = useDesign('power-cut-config');

  function regComponent(comp) {
    let res;
    switch (comp) {
      case 'PowerCutType':
        res = PowerCutType;
        break;
      case 'DeviceChargedType':
        res = DeviceChargedType;
        break;
      case 'PLCJudgmentRule':
        res = PLCJudgmentRule;
        break;
      case 'SafetyTechnology':
        res = SafetyTechnology;
        break;
      case 'OperationTicket':
        res = OperationTicket;
        break;
      case 'PowerSystemList':
        res = PowerSystemList;
        break;
      case 'ElectricianSetting':
        res = ElectricianSetting;
        break;
      case 'ErrorMessage':
        res = ErrorMessage;
        break;
    }
    return res;
  }
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-power-cut-config';

  .@{prefix-cls} {
    margin: 12px;
    background-color: @component-background;

    .base-title {
      padding-left: 0;
    }

    .ant-tabs-tab-active {
      background-color: @item-active-bg;
    }
  }
</style>
