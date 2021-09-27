<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <ElForm
    class="p-4 enter-x"
    :model="formData"
    :rules="formRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <ElFormItem prop="employeeCode" class="enter-x">
      <ElInput
        v-model="formData.employeeCode"
        size="large"
        :placeholder="t('sys.login.userName')"
        class="fix-auto-fill"
        clearable
        maxlength="20"
        @keyup.enter="handleLogin"
      />
    </ElFormItem>
    <ElFormItem prop="password" class="enter-x">
      <ElInput
        size="large"
        v-model="formData.password"
        :placeholder="t('sys.login.password')"
        show-password
        clearable
      />
    </ElFormItem>

    <ElFormItem>
      <!-- No logic, you need to deal with it yourself -->
      <ElCheckbox v-model:checked="rememberMe" size="small">
        {{ t('sys.login.rememberMe') }}
      </ElCheckbox>
    </ElFormItem>

    <ElFormItem class="enter-x">
      <ElButton type="primary" size="large" block @click="handleLogin" :loading="loading">
        {{ t('sys.login.loginButton') }}
      </ElButton>
      <!-- <Button size="large" class="mt-4 enter-x" block @click="handleRegister">
        {{ t('sys.login.registerButton') }}
      </Button> -->
    </ElFormItem>
  </ElForm>
</template>
<script lang="ts" setup>
  import { reactive, ref, toRaw, unref, computed } from 'vue';

  import { ElForm, ElFormItem, ElInput, ElCheckbox, ElButton } from 'element-plus';

  import LoginFormTitle from './LoginFormTitle.vue';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { useUserStore } from '/@/store/modules/user';
  import { LoginStateEnum, useLoginState } from './useLogin';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { LoginParams } from '/@/api/sys/model/userModel';

  const { t } = useI18n();
  const { notification, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();

  const { getLoginState } = useLoginState();

  const formRef = ref();
  const loading = ref(false);
  const rememberMe = ref(false);

  const formData = reactive<LoginParams>({
    employeeCode: 'TJDT0327',
    password: '123456',
  });

  const formRules = ref({
    employeeCode: [
      {
        required: true,
        message: t('sys.login.accountPlaceholder'),
        trigger: ['blur', 'change'],
      },
    ],
    password: [
      {
        required: true,
        message: t('sys.login.passwordPlaceholder'),
        trigger: ['blur', 'change'],
      },
    ],
  });

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  async function handleLogin() {
    formRef.value.validate((validate) => {
      if (!validate) return;
      loading.value = true;
      userStore
        .login(
          toRaw({
            password: formData.password,
            employeeCode: formData.employeeCode,
            mode: 'none', //不要默认的错误提示
          }),
        )
        .then((res) => {
          if (res) {
            notification.success({
              message: t('sys.login.loginSuccessTitle'),
              description: `${t('sys.login.loginSuccessDesc')}: ${res.name}`,
              duration: 3,
            });
          }
        })
        .catch((error) => {
          createErrorModal({
            title: t('sys.api.errorTip'),
            content:
              (error as { [index: string]: string }).message || t('sys.api.networkExceptionMsg'),
            getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
          });
        })
        .finally(() => {
          loading.value = false;
        });
    });
  }
</script>
