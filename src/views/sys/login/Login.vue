<template>
  <div :class="prefixCls" class="w-full h-full">
    <div class="relative container w-full h-full mx-auto">
      <div class="flex h-full">
        <AppLogo class="-enter-x" />
        <div class="flex w-full h-full">
          <div
            :class="`${prefixCls}-form`"
            class="relative w-full px-5 py-8 mx-auto my-auto rounded-md shadow-md enter-x"
          >
            <LoginForm />
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { AppLogo } from '/@/components/Application';
  import LoginForm from './LoginForm.vue';
  import ResetPasswordForm from './ResetPasswordForm.vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  defineProps({
    sessionTimeout: {
      type: Boolean,
    },
  });

  const { prefixCls } = useDesign('login');
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-login';
  @logo-prefix-cls: ~'@{namespace}-app-logo';
  @countdown-prefix-cls: ~'@{namespace}-countdown-input';
  @dark-bg: #293146;

  .@{prefix-cls} {
    height: 100%;
    overflow: hidden;
    background: url('/@/assets/images/loginBg.png') no-repeat left top;

    .@{logo-prefix-cls} {
      position: absolute;
      display: flex;
      top: 12px;

      &__title {
        font-size: 24px;
        color: #fff;
      }

      img {
        width: 48px;
      }
    }

    &-form {
      width: 600px;
      background: rgba(0, 0, 0, 0.5);
      padding: 24px 50px 0;
    }
  }
</style>
