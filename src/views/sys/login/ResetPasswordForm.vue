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

  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { getLoginState } = useLoginState();
  const userStore = useUserStore();
  const passwordValidation = userStore.getPasswordValidation;

  const formRef = ref();
  const loading = ref(false);

  /**
   * @description 校验密码框输入
   * @param {string} inputVal 输入框中的值
   * @param {number} value 需要校验的参数对应的标识。 0 - 不可以包含; 1 - 可以包含; 2 - 必须包含
   * @param {string} key 需要校验的参数
   * @params {RegExp} reg 校验使用的正则表达式
   */
  enum ContainStatus {
    /** 不可以包含 */
    CANT_BE = 0,
    /** 可以包含 */
    MAY_BE = 1,
    /** 必须包含 */
    MUST_BE = 2,
  }
  function validate(inputVal: string, value: ContainStatus, key: string, reg: RegExp) {
    const Key = key.replace(key[0], key[0].toUpperCase());
    if (value === ContainStatus.CANT_BE) {
      if (inputVal.match(reg)) {
        const $key = 'excluding' + Key;
        return Promise.reject(passwordValidation.errorMessage[$key]);
      }
    } else if (value === ContainStatus.MUST_BE) {
      if (!inputVal.match(reg)) {
        const $key = 'contain' + Key;
        return Promise.reject(passwordValidation.errorMessage[$key]);
      }
    }
  }

  async function complex(value) {
    const number = /[0-9]/;
    const lowercase = /[a-z]/;
    const capital = /[A-Z]/;
    const character = /[#?!@$%^&*+-.]/;

    const complex = passwordValidation.complex;
    const maxLength = passwordValidation.length.max;
    const minLength = passwordValidation.length.min;
    const lengthTips = passwordValidation.errorMessage.lengthTips;
    const spaceErrorTip = passwordValidation.errorMessage.containSpace;

    if (value.includes(' ')) {
      // 校验密码有空格
      return Promise.reject(spaceErrorTip);
    }
    if (value.length < minLength || value.length > maxLength) {
      // 校验密码长度
      return Promise.reject(lengthTips);
    }

    for (const key in complex) {
      const val = complex[key];
      if (key === 'number') {
        await validate(value, val, key, number);
      } else if (key === 'lowercase') {
        await validate(value, val, key, lowercase);
      } else if (key === 'capital') {
        await validate(value, val, key, capital);
      } else if (key === 'character') {
        await validate(value, val, key, character);
      }
    }
  }

  const checkNewPassword = async (_rule, value) => {
    if (value === '') {
      return Promise.reject(t('sys.login.passwordPlaceholder'));
    } else {
      await complex(value);
    }
  };

  const checkConfirmPassword = async (_rules, value) => {
    if (value === '') {
      return Promise.reject(t('sys.login.passwordPlaceholder'));
    } else if (value !== formData.password) {
      return Promise.reject(t('sys.login.diffPwd'));
    } else {
      await complex(value);
    }
  };

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.RESET_PASSWORD);

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

      // if (!userInfo) return;
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
