<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="formRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <FormItem name="employeeCode" class="enter-x">
      <Input
        v-model:value="formData.employeeCode"
        size="large"
        :placeholder="t('sys.login.userName')"
        class="fix-auto-fill"
        allow-clear
        @keyup.enter="handleLogin"
      />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        allow-clear
        :placeholder="t('sys.login.password')"
      />
    </FormItem>

    <ARow justify="end" class="enter-x">
      <ACol :span="4">
        <FormItem>
          <Checkbox v-model:checked="rememberMe" size="small">
            <span style="color: #fff">
              {{ t('sys.login.rememberMe') }}
            </span>
          </Checkbox>
        </FormItem>
      </ACol>
    </ARow>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        {{ t('sys.login.loginButton') }}
      </Button>
    </FormItem>
  </Form>
</template>
<script lang="ts" setup>
  import { reactive, ref, toRaw, unref, computed } from 'vue';
  import { Checkbox, Form, Input, Row, Col, Button } from 'ant-design-vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  // import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { LoginStateEnum, useLoginState } from './useLogin';
  import { LoginParams } from '/@/api/sys/model/userModel';

  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;

  const { t } = useI18n();
  // const { notification } = useMessage();
  const userStore = useUserStore();

  const { getLoginState } = useLoginState();

  const formRef = ref();
  const loading = ref(false);
  const rememberMe = ref(false);

  const formData = reactive<LoginParams>({
    employeeCode: 'TJDT3213',
    password: '123456',
  });

  const formRules = {
    employeeCode: [
      {
        required: true,
        message: t('sys.login.accountPlaceholder'),
        trigger: 'change',
      },
    ],
    password: [
      {
        required: true,
        message: t('sys.login.passwordPlaceholder'),
        trigger: 'change',
      },
    ],
  };

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  async function handleLogin() {
    const validate = await formRef.value.validate();

    if (!validate) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login(
        toRaw({
          password: formData.password,
          employeeCode: formData.employeeCode,
          mode: 'message',
        }),
      );

      if (!userInfo) return;
      loading.value = false;

      console.log('userInfo :>> ', userInfo);

      // notification.success({
      //   message: t('sys.login.loginSuccessTitle'),
      //   description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.name}`,
      //   duration: 3,
      // });
    } catch (error) {
      loading.value = false;
    }
  }
</script>
