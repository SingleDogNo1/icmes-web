<template>
  <PageWrapper contentFullHeight>
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

<script lang="ts" setup name="PowerCutConfig">
  import { ref } from 'vue';
  import { Tabs } from 'ant-design-vue';
  import { error } from '/@/utils/log';
  import { PageWrapper } from '/@/components/Page';
  import { tabsList } from './components';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getPowerCutConfigApi } from '/@/api/power/config';
  import { PowerCutConfigModel } from '/@/api/power/model/configModel';

  const { prefixCls } = useDesign('power-cut-config');
  const form = ref<PowerCutConfigModel>();

  getPowerCutConfigApi()
    .then((formData) => {
      form.value = formData;
    })
    .catch((err: any) => {
      error(err);
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
