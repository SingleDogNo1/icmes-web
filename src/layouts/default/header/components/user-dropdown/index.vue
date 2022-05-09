<template>
  <Dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex items-center">
      <img :class="`${prefixCls}__header`" :src="getUserInfo.avatar" />
      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name truncate`">
          {{ getUserInfo.name }}
        </span>
      </span>
    </span>

    <template #overlay>
      <Menu @click="handleMenuClick">
        <MenuItem
          key="doc"
          :text="t('layout.header.dropdownItemDoc')"
          icon="ion:document-text-outline"
          v-if="getShowDoc"
        />
        <MenuDivider v-if="getShowDoc" />
        <MenuItem
          v-if="getUseLockPage"
          key="lock"
          :text="t('layout.header.tooltipLock')"
          icon="ion:lock-closed-outline"
        />
        <MenuItem
          key="user"
          :text="t('layout.header.userCenter')"
          icon="ant-design:user-outlined"
        />
        <MenuItem
          key="logout"
          :text="t('layout.header.dropdownItemLoginOut')"
          icon="ion:power-outline"
        />
      </Menu>
    </template>
  </Dropdown>
  <LockAction @register="register" />
</template>

<script lang="ts">
  export default {
    name: 'UserDropdown',
  };
</script>

<script lang="ts" setup>
  import { Dropdown, Menu } from 'ant-design-vue';
  import { computed, PropType } from 'vue';
  import { DOC_URL } from '/@/settings/siteSetting';
  import { useUserStore } from '/@/store/modules/user';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useModal } from '/@/components/Modal';
  import headerImg from '/@/assets/images/avatar.png';
  import { openWindow } from '/@/utils';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useGo } from '/@/hooks/web/usePage';

  type MenuEvent = 'logout' | 'doc' | 'lock' | 'user';

  const go = useGo();

  const MenuDivider = Menu.Divider;
  const MenuItem = createAsyncComponent(() => import('./DropMenuItem.vue'));
  const LockAction = createAsyncComponent(() => import('../lock/LockModal.vue'));

  defineProps({
    theme: { type: String as PropType<'dark' | 'light'> },
  });

  const { prefixCls } = useDesign('header-user-dropdown');
  const { t } = useI18n();
  const { getShowDoc, getUseLockPage } = useHeaderSetting();
  const userStore = useUserStore();

  const getUserInfo = computed(() => {
    const { name = '', avatar } = userStore.getUserInfo || {};
    return { name, avatar: avatar || headerImg };
  });

  const [register, { openModal }] = useModal();

  function handleMenuClick(e: { key: MenuEvent }) {
    switch (e.key) {
      case 'logout':
        userStore.confirmLoginOut();
        break;
      case 'doc':
        openWindow(DOC_URL);
        break;
      case 'lock':
        openModal(true);
        break;
      case 'user':
        go({ name: 'AccountCenter' });
        break;
    }
  }
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    height: @header-height;
    padding: 0 0 0 10px;
    padding-right: 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;
    align-items: center;

    img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }

    &__header {
      border-radius: 50%;
    }

    &__name {
      font-size: 14px;
    }

    &--dark {
      &:hover {
        background-color: @header-dark-bg-hover-color;
      }
    }

    &--light {
      &:hover {
        background-color: @header-light-bg-hover-color;
      }

      .@{prefix-cls}__name {
        color: @text-color-base;
      }

      .@{prefix-cls}__desc {
        color: @header-light-desc-color;
      }
    }

    &-dropdown-overlay {
      .ant-dropdown-menu-item {
        min-width: 160px;
      }
    }
  }
</style>
