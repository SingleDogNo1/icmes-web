<template>
  <div class="p-4 pl-0">
    <Spin :spinning="pageLoading">
      <BasicForm @register="register">
        <template #needGuardian="{ model, field }: any">
          <Switch
            v-model:checked="model[field]"
            :loading="needGuardianLoading"
            @change="toggleNeedGuardian"
          />
        </template>

        <template #needTicket="{ model, field }: any">
          <Switch
            v-model:checked="model[field]"
            :loading="needTicketLoading"
            @change="toggleNeedTicket"
          />
        </template>

        <template #guardianVerification="{ model, field }: any">
          <Select
            v-model:value="model[field]"
            :disabled="!getNeedFaceRecognition"
            :loading="guardianVerificationLoading"
            :style="{ width: '120px' }"
            @change="toggleGuardianVerification"
          >
            <Select.Option :value="GuardianVerificationEnum.QRCODE + ''">二维码签核</Select.Option>
            <Select.Option :value="GuardianVerificationEnum.FACE + ''">人脸识别</Select.Option>
          </Select>
        </template>

        <template #guardianExpiration="{ model, field }: any">
          <InputField
            :value="model[field]"
            :min="1"
            :max="60"
            :loading="guardianExpirationLoading"
            desc="（限制1 ~ 60，单位：分钟）"
            @change="changeGuardianExpiration"
          />
        </template>

        <template #logoutCountdown="{ model, field }: any">
          <InputField
            :value="model[field]"
            :min="5"
            :max="3600"
            :loading="logoutCountdownLoading"
            desc="（限制5 ~ 3600，单位：秒）"
            @change="changeLogoutCountdown"
          />
        </template>

        <template #taskFreshInterval="{ model, field }: any">
          <InputField
            :value="model[field]"
            :min="1"
            :max="60"
            :loading="taskFreshIntervalLoading"
            desc="（限制1 ~ 60，单位：分钟）"
            @change="changeTaskFreshInterval"
          />
        </template>

        <template #applyVerification="{ model, field }: any">
          <Switch
            v-model:checked="model[field]"
            :loading="applyVerificationLoading"
            @change="toggleApplyVerification"
          />
        </template>

        <template #autoCloseForm="{ model, field }: any">
          <Switch
            v-model:checked="model[field]"
            :loading="autoCloseFormLoading"
            @change="toggleAutoCloseForm"
          />
        </template>

        <template #remoteCutInterval="{ model, field }: any">
          <InputField
            :value="model[field]"
            :min="0"
            :max="60000"
            :loading="remoteCutIntervalLoading"
            desc="（限制0 ~ 60000，单位：毫秒）"
            @change="changeRemoteCutInterval"
          />
        </template>

        <template #remoteSupplyInterval="{ model, field }: any">
          <InputField
            :value="model[field]"
            :min="0"
            :max="60000"
            :loading="remoteSupplyIntervalLoading"
            desc="（限制0 ~ 60000，单位：毫秒）"
            @change="changeRemoteSupplyInterval"
          />
        </template>

        <template #remoteNeedGuardian="{ model, field }: any">
          <Switch
            v-model:checked="model[field]"
            :loading="remoteNeedGuardianLoading"
            @change="toggleRemoteNeedGuardian"
          />
        </template>
      </BasicForm>
    </Spin>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'ElectricianSetting',
  };
</script>

<script lang="ts" setup>
  import { onMounted, PropType, ref, unref, watchEffect } from 'vue';
  import { Switch, Select, Spin } from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import InputField from './inputField.vue';
  import { GuardianVerificationEnum } from '/@/enums/powerCutEnum';
  import { useUserStore } from '/@/store/modules/user';
  import { PowerCutConfigModel } from '/@/api/power/model/configModel';
  import { schemas } from './data';
  import { useOperatingConfig } from './hooks';

  const props = defineProps({
    form: {
      type: Object as PropType<PowerCutConfigModel>,
      required: true,
    },
  });

  const powerCutConfigForm = ref<Nullable<PowerCutConfigModel>>(null);
  const { getNeedFaceRecognition } = useUserStore();
  const pageLoading = ref(false);

  const {
    needGuardianLoading,
    toggleNeedGuardian,
    needTicketLoading,
    toggleNeedTicket,
    guardianVerificationLoading,
    toggleGuardianVerification,
    guardianExpirationLoading,
    changeGuardianExpiration,
    logoutCountdownLoading,
    changeLogoutCountdown,
    taskFreshIntervalLoading,
    changeTaskFreshInterval,
    applyVerificationLoading,
    toggleApplyVerification,
    autoCloseFormLoading,
    toggleAutoCloseForm,
    remoteCutIntervalLoading,
    changeRemoteCutInterval,
    remoteSupplyIntervalLoading,
    changeRemoteSupplyInterval,
    remoteNeedGuardianLoading,
    toggleRemoteNeedGuardian,
  } = useOperatingConfig();

  watchEffect(() => {
    pageLoading.value = true;
    if (props.form) {
      powerCutConfigForm.value = props.form;
      pageLoading.value = false;
    }
  });

  const [register, { setFieldsValue }] = useForm({
    showActionButtonGroup: false,
    labelWidth: '170px',
    schemas,
  });

  onMounted(() => {
    unref(powerCutConfigForm) &&
      setFieldsValue({
        needGuardian: unref(powerCutConfigForm)?.needGuardian,
        needTicket: unref(powerCutConfigForm)?.needTicket,
        guardianVerification: unref(powerCutConfigForm)?.guardianVerification,
        guardianExpiration: unref(powerCutConfigForm)?.guardianExpiration,
        logoutCountdown: unref(powerCutConfigForm)?.logoutCountdown,
        taskFreshInterval: unref(powerCutConfigForm)?.taskFreshInterval,
        applyVerification: unref(powerCutConfigForm)?.applyVerification,
        autoCloseForm: unref(powerCutConfigForm)?.autoCloseForm,
        remoteCutInterval: unref(powerCutConfigForm)?.remoteCutInterval,
        remoteSupplyInterval: unref(powerCutConfigForm)?.remoteSupplyInterval,
        remoteNeedGuardian: unref(powerCutConfigForm)?.remoteNeedGuardian,
      });
  });
</script>
