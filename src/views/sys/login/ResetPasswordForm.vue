<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="formRules" ref="formRef">
      <FormItem name="password" class="enter-x">
        <InputPassword
          size="large"
          visibilityToggle
          v-model:value="formData.password"
          allow-clear
          :placeholder="t('sys.login.password')"
        />
      </FormItem>

      <FormItem name="confirmPassword" class="enter-x">
        <InputPassword
          size="large"
          visibilityToggle
          v-model:value="formData.confirmPassword"
          allow-clear
          :placeholder="t('sys.login.confirmPassword')"
        />
      </FormItem>

      <FormItem class="enter-x">
        <Button type="primary" size="large" block @click="handleConfirm" :loading="loading">
          {{ t('sys.login.confirmChangePassword') }}
        </Button>
      </FormItem>
    </Form>
  </template>
</template>
<script lang="ts" setup>
  import { reactive, ref, computed, unref, toRaw } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { Form, Input, Button } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLoginState, LoginStateEnum } from './useLogin';
  import { useUserStore } from '/@/store/modules/user';
  import { validPassword } from '/@/utils/validPassword';

  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { getLoginState } = useLoginState();
  const userStore = useUserStore();

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.RESET_PASSWORD);

  console.log('getShow :>> ', getShow.value);

  const formRef = ref();
  const loading = ref(false);

  const checkNewPassword = async (_rule, value) => {
    if (value === '') {
      return Promise.reject(t('sys.login.passwordPlaceholder'));
    } else {
      await validPassword(value);
    }
  };

  const checkConfirmPassword = async (_rules, value) => {
    if (value === '') {
      return Promise.reject(t('sys.login.passwordPlaceholder'));
    } else if (value !== formData.password) {
      return Promise.reject(t('sys.login.diffPwd'));
    } else {
      await validPassword(value);
    }
  };

  const formData = reactive({
    password: '',
    confirmPassword: '',
  });

  const formRules = {
    password: [{ validator: checkNewPassword, trigger: 'change' }],
    confirmPassword: [{ validator: checkConfirmPassword, trigger: 'change' }],
  };

  async function handleConfirm() {
    const validate = await formRef.value.validate();

    if (!validate) return;
    try {
      loading.value = true;
      const userInfo = await userStore.resetPassword(
        toRaw({
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          mode: 'message',
        }),
      );
      console.log('userInfo :>> ', userInfo);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }
</script>
