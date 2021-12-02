<template>
  <CollapseContainer title="修改密码" :canExpan="false">
    <div class="py-8 bg-white flex flex-col justify-center items-center">
      <BasicForm @register="register" />
      <div class="flex justify-center">
        <a-button @click="resetFields"> 重置 </a-button>
        <a-button class="!ml-4" type="primary" @click="handleSubmit"> 确认 </a-button>
      </div>
    </div>
  </CollapseContainer>
</template>

<script lang="ts">
  export default {
    name: 'ChangePassword',
  };
</script>

<script lang="ts" setup>
  import { BasicForm, useForm } from '/@/components/Form';
  import { CollapseContainer } from '/@/components/Container';
  import { PageEnum } from '/@/enums/pageEnum';
  import { changePWDSchemas } from './data';
  import { useGo } from '/@/hooks/web/usePage';
  import { getPublicKeyApi } from '/@/api/sys/user';
  import { encryptPwd, encryptSalt } from '/@/utils/helper/sha1Helper';
  import { ChangePWDParams } from '/@/api/account/model/basicModel';
  import { changePasswordApi } from '/@/api/account/basic';
  import { useMessage } from '/@/hooks/web/useMessage';

  const go = useGo();
  const { createMessage } = useMessage();

  const [register, { validate, resetFields }] = useForm({
    labelWidth: 100,
    showActionButtonGroup: false,
    schemas: changePWDSchemas,
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      const { oldPassword, newPassword } = values;
      const orgPassword = encryptSalt(oldPassword);
      const password = encryptSalt(newPassword);
      const { key, codeList } = await getPublicKeyApi();
      const aesKey = codeList.reduce((res, pre, index) => {
        res += pre[index];
        return res;
      }, '');
      const obj: ChangePWDParams = {
        key,
        orgPassword,
        password,
        confirmPassword: password,
      };
      const data = encryptPwd(obj, aesKey) as ChangePWDParams;
      console.log('data :>> ', data);
      await changePasswordApi(data);

      createMessage.success('密码修改成功', 2, () => {
        go(PageEnum.BASE_LOGIN);
      });
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }
</script>
