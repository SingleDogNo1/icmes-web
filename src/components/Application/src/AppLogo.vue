<template>
  <div class="anticon" :class="getAppLogoClass" @click="goHome">
    <div class="logo"></div>
    <div class="ml-2 truncate md:opacity-100" :class="`${prefixCls}__title`" v-show="showTitle">
      {{ title }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, unref } from 'vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useGo } from '/@/hooks/web/usePage';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { PageEnum } from '/@/enums/pageEnum';

  const props = defineProps({
    theme: { type: String, validator: (v: string) => ['light', 'dark'].includes(v) },
    showTitle: { type: Boolean, default: true },
  });

  const { prefixCls } = useDesign('app-logo');
  const { getCollapsedShowTitle } = useMenuSetting();
  const { title } = useGlobSetting();
  const go = useGo();

  const getAppLogoClass = computed(() => [
    prefixCls,
    props.theme,
    { 'collapsed-show-title': unref(getCollapsedShowTitle) },
  ]);

  function goHome() {
    go(PageEnum.BASE_HOME);
  }
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-app-logo';

  .@{prefix-cls} {
    display: flex;
    align-items: center;
    padding-left: 7px;
    cursor: pointer;
    transition: all 0.2s ease;

    .logo {
      background: url('../../../assets/images/logo.png') 0 / contain no-repeat;
    }

    // &.light {
    //   border-bottom: 1px solid @border-color-base;
    // }

    &.collapsed-show-title {
      padding-left: 20px;
    }

    &.light &__title {
      color: @primary-color;
    }

    &.dark &__title {
      color: @white;
    }

    &__title {
      font-size: 16px;
      font-weight: 700;
      transition: all 0.5s;
    }
  }
</style>
