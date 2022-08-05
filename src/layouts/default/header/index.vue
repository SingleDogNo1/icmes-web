<template>
  <Header :class="getHeaderClass">
    <div :class="`${prefixCls}-left`">
      <AppLogo
        v-if="getShowHeaderLogo || getIsMobile"
        :class="`${prefixCls}-logo`"
        :theme="getHeaderTheme"
        :style="getLogoWidth"
      />
      <AppLogo :class="`${prefixCls}-logo`" :theme="getHeaderTheme" :style="getLogoWidth" />
      <LayoutTrigger
        v-if="
          (getShowContent && getShowHeaderTrigger && !getSplit && !getIsMixSidebar) || getIsMobile
        "
        :theme="getHeaderTheme"
        :sider="false"
      />
      <LayoutBreadcrumb v-if="getShowContent && getShowBread" :theme="getHeaderTheme" />
    </div>

    <div :class="`${prefixCls}-menu`" v-if="getShowTopMenu && !getIsMobile">
      <LayoutMenu
        :isHorizontal="true"
        :theme="getHeaderTheme"
        :splitType="getSplitType"
        :menuMode="getMenuMode"
      />
    </div>

    <div :class="`${prefixCls}-action`">
      <AppSearch :class="`${prefixCls}-action__item`" v-if="getShowSearch" />

      <ErrorAction v-if="getUseErrorHandle" :class="`${prefixCls}-action__item error-action`" />

      <Tooltip>
        <template #title> 我的审批 </template>
        <Audit :class="`${prefixCls}-action__item notify-item`" :count="approvalNum" />
      </Tooltip>

      <Tooltip>
        <template #title> 我的任务 </template>
        <Task :class="`${prefixCls}-action__item notify-item`" :count="taskNum" />
      </Tooltip>

      <Tooltip>
        <template #title> 我的消息 </template>
        <Notify
          v-if="getShowNotice"
          :class="`${prefixCls}-action__item notify-item`"
          :count="messageNum"
        />
      </Tooltip>

      <FullScreen v-if="getShowFullScreen" :class="`${prefixCls}-action__item fullscreen-item`" />

      <Tooltip>
        <template #title> 选择语言 </template>
        <AppLocalePicker
          v-if="getShowLocalePicker"
          :reload="true"
          :showText="false"
          :class="`${prefixCls}-action__item`"
        />
      </Tooltip>

      <UserDropDown :theme="getHeaderTheme" />

      <Tooltip>
        <template #title> 设置 </template>
        <SettingDrawer v-if="getShowSetting" :class="`${prefixCls}-action__item`" />
      </Tooltip>
    </div>
  </Header>
</template>

<script lang="ts">
  export default {
    name: 'LayoutHeader',
  };
</script>

<script lang="ts" setup>
  import { ref, unref, computed } from 'vue';
  import { Layout, Tooltip } from 'ant-design-vue';
  import { AppLogo } from '/@/components/Application';
  import LayoutMenu from '../menu/index.vue';
  import LayoutTrigger from '../trigger/index.vue';
  import { AppSearch } from '/@/components/Application';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum';
  import { SettingButtonPositionEnum } from '/@/enums/appEnum';
  import { AppLocalePicker } from '/@/components/Application';
  import {
    UserDropDown,
    LayoutBreadcrumb,
    FullScreen,
    Notify,
    ErrorAction,
    Audit,
    Task,
  } from './components';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useLocale } from '/@/locales/useLocale';
  import { getUnreadNoticeApi } from '/@/api/notice/basic';

  const Header = Layout.Header;
  const SettingDrawer = createAsyncComponent(() => import('/@/layouts/default/setting/index.vue'), {
    loading: true,
  });

  const props = defineProps({
    fixed: Boolean,
  });

  const { prefixCls } = useDesign('layout-header');
  const {
    getShowTopMenu,
    getShowHeaderTrigger,
    getSplit,
    getIsMixMode,
    getMenuWidth,
    getIsMixSidebar,
  } = useMenuSetting();

  const { getUseErrorHandle, getShowSettingButton, getSettingButtonPosition } = useRootSetting();

  const {
    getHeaderTheme,
    getShowFullScreen,
    getShowNotice,
    getShowContent,
    getShowBread,
    getShowHeaderLogo,
    getShowHeader,
    getShowSearch,
  } = useHeaderSetting();

  const getHeaderClass = computed(() => {
    const theme = unref(getHeaderTheme);
    return [
      prefixCls,
      {
        [`${prefixCls}--fixed`]: props.fixed,
        [`${prefixCls}--mobile`]: unref(getIsMobile),
        [`${prefixCls}--${theme}`]: theme,
      },
    ];
  });

  const { getShowLocalePicker } = useLocale();

  const { getIsMobile } = useAppInject();

  const getShowSetting = computed(() => {
    if (!unref(getShowSettingButton)) {
      return false;
    }
    const settingButtonPosition = unref(getSettingButtonPosition);

    if (settingButtonPosition === SettingButtonPositionEnum.AUTO) {
      return unref(getShowHeader);
    }
    return settingButtonPosition === SettingButtonPositionEnum.HEADER;
  });

  const getLogoWidth = computed(() => {
    if (!unref(getIsMixMode) || unref(getIsMobile)) {
      return {};
    }
    const width = unref(getMenuWidth) < 180 ? 180 : unref(getMenuWidth);
    return { width: `${width}px` };
  });

  const getSplitType = computed(() => {
    return unref(getSplit) ? MenuSplitTyeEnum.TOP : MenuSplitTyeEnum.NONE;
  });

  const getMenuMode = computed(() => {
    return unref(getSplit) ? MenuModeEnum.HORIZONTAL : null;
  });

  const approvalNum = ref(0); // 审批数
  const taskNum = ref(0); // 任务数
  const messageNum = ref(0); // 未读消息数

  getUnreadNoticeApi().then((data) => {
    approvalNum.value = data.approvalNum;
    taskNum.value = data.taskNum;
    messageNum.value = data.messageNum;
  });
</script>
<style lang="less">
  @import './index.less';
</style>
