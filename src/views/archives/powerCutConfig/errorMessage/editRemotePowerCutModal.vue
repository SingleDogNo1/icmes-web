<template>
  <BasicModal
    :loading="loading"
    v-bind="$attrs"
    :title="`${editType === 'create' ? '新建' : '编辑'}异常消息通知`"
    @register="register"
    @ok="handleSubmit"
    @visible-change="toggleShow"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { schemas } from './data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    createRemotePowerCutConfigReminderApi,
    updatePowerCutReminderConfigApi,
  } from '/@/api/power/config';
  import { ConfigReminderModel, ConfigReminderParams } from '/@/api/power/model/configModel';
  import { useUserStore } from '/@/store/modules/user';

  const { createMessage } = useMessage();
  const { getAllAccount: employeesList } = useUserStore();

  const emit = defineEmits(['done']);

  const loading = ref<boolean>(false);
  const editType = ref<'create' | 'edit' | ''>('');
  const editId = ref<number>();

  const [registerForm, { getFieldsValue, setFieldsValue, validate, resetFields }] = useForm({
    schemas,
    labelWidth: 120,
    showActionButtonGroup: false,
  });

  const [register, { closeModal, changeOkLoading }] = useModalInner(
    async (data: ConfigReminderModel | null) => {
      editType.value = data?.id ? 'edit' : 'create';
      if (data?.id) {
        editId.value = data.id;
        // 不知道为什么 noticeObject 字段需要处理成以下的样子，参考原项目逻辑
        // data.noticeObject = "{employees: [{employeeId: 'id', fullOrgName: 'orgName', employeeName: "name"}]}"
        const employeesList = JSON.parse(data.noticeObject)?.employees ?? [];

        const employeeIds = employeesList.reduce((res, pre) => {
          res.push(pre.employeeId);
          return res;
        }, [] as number[]);

        setFieldsValue({
          noticeObjectType: data.noticeObjectType,
          noticeObject: employeeIds,
          workingShift: data.workingShift,
        });
      }
    },
  );

  function toggleShow(show: boolean) {
    if (!show) {
      resetFields();
    }
  }

  async function handleSubmit() {
    changeOkLoading(true);
    await validate();
    const values = getFieldsValue();

    // 不知道为什么 noticeObject 字段需要处理成以下的样子，参考原项目逻辑
    const employees = employeesList?.reduce((res, pre) => {
      if (values.noticeObject.includes(pre.realEmployeeId)) {
        res.push({
          employeeId: pre.realEmployeeId,
          employeeName: pre.name,
          fullOrgName: pre.fullOrgName,
        });
      }
      return res;
    }, [] as { employeeId: number; fullOrgName: string; employeeName: string }[]);

    values.noticeObject = JSON.stringify({ employees });
    try {
      if (editType.value === 'create') {
        await createRemotePowerCutConfigReminderApi(values as ConfigReminderParams);
      } else if (editType.value === 'edit') {
        await updatePowerCutReminderConfigApi(editId.value!, values as ConfigReminderParams);
      }
      createMessage.success('保存成功');
      emit('done');
      closeModal();
    } catch (error: any) {
      throw new Error(error);
    } finally {
      changeOkLoading(false);
    }
  }
</script>
