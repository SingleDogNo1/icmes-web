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
  import { reactive, ref, computed, unref, toRaw, watch, Ref } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { Form, Input, Button } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLoginState, LoginStateEnum } from './useLogin';
  import { useUserStore } from '/@/store/modules/user';
  import { ContainStatus, PasswordValidationModel } from '/@/api/sys/model/userModel';

  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { getLoginState } = useLoginState();
  const userStore = useUserStore();
  let passwordValidation: Ref<PasswordValidationModel> | Ref<null> = ref(null);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.RESET_PASSWORD);
  watch(
    () => getShow.value,
    (value) => {
      if (value) {
        passwordValidation.value = userStore.getPasswordValidation;
      }
    },
  );

  console.log('getShow :>> ', getShow.value);

  const formRef = ref();
  const loading = ref(false);

  /**
   * @description 校验密码框输入
   * @param {string} inputVal 输入框中的值
   * @param {number} value 需要校验的参数对应的标识。 0 - 不可以包含; 1 - 可以包含; 2 - 必须包含
   * @param {string} key 需要校验的参数
   * @params {RegExp} reg 校验使用的正则表达式
   */

  function validate(inputVal: string, value: ContainStatus, key: string, reg: RegExp) {
    const Key = key.replace(key[0], key[0].toUpperCase());
    if (value === ContainStatus.CANT_BE) {
      if (inputVal.match(reg)) {
        const $key = 'excluding' + Key;
        return Promise.reject(passwordValidation.value?.errorMessage[$key]);
      }
    } else if (value === ContainStatus.MUST_BE) {
      if (!inputVal.match(reg)) {
        const $key = 'contain' + Key;
        return Promise.reject(passwordValidation.value?.errorMessage[$key]);
      }
    }
  }

  async function complex(value) {
    const number = /[0-9]/;
    const lowercase = /[a-z]/;
    const capital = /[A-Z]/;
    const character = /[#?!@$%^&*+-.]/;

    const complex = passwordValidation.value?.complex;
    const maxLength = passwordValidation.value?.length.max;
    const minLength = passwordValidation.value?.length.min;
    const lengthTips = passwordValidation.value?.errorMessage.lengthTips;
    const spaceErrorTip = passwordValidation.value?.errorMessage.containSpace;

    if (value.includes(' ')) {
      // 校验密码有空格
      return Promise.reject(spaceErrorTip);
    }
    if (value.length < minLength! || value.length > maxLength!) {
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
      // if (!userInfo) return;
      loading.value = false;
    } catch (error) {
      loading.value = false;
    }
  }
</script>
