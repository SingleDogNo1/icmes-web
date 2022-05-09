import { ref } from 'vue';
import { updatePowerCutConfigApi } from '/@/api/power/config';
import { PowerCutConfigModel } from '/@/api/power/model/configModel';
import { useMessage } from '/@/hooks/web/useMessage';

export function useOperatingConfig() {
  const { createMessage } = useMessage();

  async function updatePowerCutConfig(name: keyof PowerCutConfigModel, value: any) {
    try {
      await updatePowerCutConfigApi({ name, value });
      createMessage.success('保存成功');
      return new Promise<void>((resolve) => {
        resolve();
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }

  const needGuardianLoading = ref(false);
  function toggleNeedGuardian(value: boolean) {
    needGuardianLoading.value = true;
    updatePowerCutConfig('needGuardian', value).then(() => {
      needGuardianLoading.value = false;
    });
  }

  const needTicketLoading = ref(false);
  function toggleNeedTicket(value: boolean) {
    needTicketLoading.value = true;
    updatePowerCutConfig('needTicket', value).then(() => {
      needTicketLoading.value = false;
    });
  }

  const guardianVerificationLoading = ref(false);
  function toggleGuardianVerification(value: string) {
    guardianVerificationLoading.value = true;
    updatePowerCutConfig('guardianVerification', Number(value)).then(() => {
      guardianVerificationLoading.value = false;
    });
  }

  const guardianExpirationLoading = ref(false);
  function changeGuardianExpiration(value: number) {
    guardianExpirationLoading.value = true;
    updatePowerCutConfig('guardianExpiration', value).then(() => {
      guardianExpirationLoading.value = false;
    });
  }

  const logoutCountdownLoading = ref(false);
  function changeLogoutCountdown(value: number) {
    logoutCountdownLoading.value = true;
    updatePowerCutConfig('logoutCountdown', value).then(() => {
      logoutCountdownLoading.value = false;
    });
  }

  const taskFreshIntervalLoading = ref(false);
  function changeTaskFreshInterval(value) {
    taskFreshIntervalLoading.value = true;
    updatePowerCutConfig('taskFreshInterval', value).then(() => {
      taskFreshIntervalLoading.value = false;
    });
  }

  const applyVerificationLoading = ref(false);
  function toggleApplyVerification(value: boolean) {
    applyVerificationLoading.value = true;
    updatePowerCutConfig('applyVerification', value).then(() => {
      applyVerificationLoading.value = false;
    });
  }

  const autoCloseFormLoading = ref(false);
  function toggleAutoCloseForm(value: boolean) {
    autoCloseFormLoading.value = true;
    updatePowerCutConfig('autoCloseForm', value).then(() => {
      autoCloseFormLoading.value = false;
    });
  }

  const remoteCutIntervalLoading = ref(false);
  function changeRemoteCutInterval(value: number) {
    remoteCutIntervalLoading.value = true;
    updatePowerCutConfig('remoteCutInterval', value).then(() => {
      remoteCutIntervalLoading.value = false;
    });
  }

  const remoteSupplyIntervalLoading = ref(false);
  function changeRemoteSupplyInterval(value: number) {
    remoteSupplyIntervalLoading.value = true;
    updatePowerCutConfig('remoteSupplyInterval', value).then(() => {
      remoteSupplyIntervalLoading.value = false;
    });
  }

  const remoteNeedGuardianLoading = ref(false);
  function toggleRemoteNeedGuardian(value: boolean) {
    remoteNeedGuardianLoading.value = true;
    updatePowerCutConfig('remoteNeedGuardian', value).then(() => {
      remoteNeedGuardianLoading.value = false;
    });
  }

  return {
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
  };
}
