<template>
  <ScrollContainer>
    <div ref="wrapperRef" :class="prefixCls">
      <Tabs tab-position="left" :tabBarStyle="{ width: '200px' }">
        <template v-for="item in settingList" :key="item.key">
          <TabPane :tab="item.name">
            <component :is="regComponent(item.component)" />
          </TabPane>
        </template>
      </Tabs>
    </div>
  </ScrollContainer>
</template>

<script lang="ts">
  export default {
    name: 'UserCenter',
  };
</script>

<script lang="ts" setup>
  import { Tabs } from 'ant-design-vue';
  import { ScrollContainer } from '/@/components/Container';
  import BaseSetting from './BaseSetting.vue';
  import ChangePassword from './ChangePassword.vue';
  import Role from './Role.vue';
  import AssignAgent from './AssignAgent.vue';
  import TakeAgent from './TakeAgent.vue';
  import { settingList } from './data';
  import { useDesign } from '/@/hooks/web/useDesign';

  const TabPane = Tabs.TabPane;
  const { prefixCls } = useDesign('user-center');

  function regComponent(comp) {
    let res;
    switch (comp) {
      case 'BaseSetting':
        res = BaseSetting;
        break;
      case 'ChangePassword':
        res = ChangePassword;
        break;
      case 'Role':
        res = Role;
        break;
      case 'AssignAgent':
        res = AssignAgent;
        break;
      case 'TakeAgent':
        res = TakeAgent;
        break;
    }
    return res;
  }
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-user-center';

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
