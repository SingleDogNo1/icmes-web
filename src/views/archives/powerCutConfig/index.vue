<template>
  <PageWrapper contentFullHeight fixedHeight>
    <div ref="wrapperRef" :class="prefixCls">
      <Tabs tab-position="left" :tabBarStyle="{ width: '150px' }">
        <template v-for="item in tabsList" :key="item.key">
          <Tabs.TabPane :tab="item.name">
            <component :is="item.component" :form="form" />
          </Tabs.TabPane>
        </template>
      </Tabs>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { readonly, ref } from 'vue';
  import { Tabs } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import PowerCutType from './powerCutType/index.vue';
  import DeviceChargedType from './deviceChargedType/index.vue';
  import PLCJudgmentRule from './plcJudgmentRule/index.vue';
  import SafetyTechnology from './safetyTechnology/index.vue';
  import OperationTicket from './operationTicket.vue';
  import PowerSystemList from './powerSystemList.vue';
  import ElectricianSetting from './electricianSetting.vue';
  import ErrorMessage from './errorMessage.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getPowerCutConfigApi } from '/@/api/power/config';
  import { PowerCutConfigModel } from '/@/api/power/model/configModel';

  const { prefixCls } = useDesign('power-cut-config');
  const form = ref<PowerCutConfigModel>();
  const tabsList = readonly([
    {
      key: '1',
      name: '停送电类型',
      component: PowerCutType,
    },
    {
      key: '2',
      name: '设备带电类型',
      component: DeviceChargedType,
    },
    {
      key: '3',
      name: 'PLC判断规则',
      component: PLCJudgmentRule,
    },
    {
      key: '4',
      name: '安全技术措施',
      component: SafetyTechnology,
    },
    {
      key: '5',
      name: '高压操作票',
      component: OperationTicket,
    },
    {
      key: '6',
      name: '供电系统图',
      component: PowerSystemList,
    },
    {
      key: '7',
      name: '验证配置',
      component: ElectricianSetting,
    },
    {
      key: '8',
      name: '异常消息',
      component: ErrorMessage,
    },
  ]);

  getPowerCutConfigApi()
    .then((formData) => {
      form.value = formData;
    })
    .catch((error) => {
      throw new Error(error);
    });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-power-cut-config';

  .@{prefix-cls} {
    background-color: @component-background;

    .base-title {
      padding-left: 0;
    }

    .ant-tabs-tab-active {
      background-color: @item-active-bg;
    }
  }
</style>
