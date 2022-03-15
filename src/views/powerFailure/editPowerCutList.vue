<template>
  <PageWrapper dense contentFullHeight contentBackground>
    <template #headerContent>
      <div class="flex">
        <Icon icon="ep:back" :size="28" />
        <p class="text-lg ml-2">新建停送电单</p>
      </div>
    </template>

    <BasicForm @register="register">
      <!-- 停送电联系人 -->
      <template #contactUser="{ model, field }">
        <Select v-model:value="model[field]" allowClear>
          <Select.Option
            v-for="item in getAllAccount"
            :key="item.userId"
            :value="item.userId"
            :title="item.name"
          >
            <span> {{ item.name }} </span>
            <span class="text-disabled ml-4">
              {{ item.fullOrgName }}
            </span>
          </Select.Option>
        </Select>
      </template>
    </BasicForm>

    <template #rightFooter>
      <a-button type="primary" @click="handleSubmit" :loading="loading">提交审批</a-button>
    </template>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Icon } from '/@/components/Icon';
  import { BasicForm, useForm } from '/@/components/Form';
  import { Select } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  // import { getPowerCutConfigListApi } from '/@/api/info/powerCutConfig';
  import { editPowerCutSchemas as schemas } from './data';

  const { createMessage } = useMessage();
  const { getAllAccount } = useUserStore();
  const loading = ref(false);

  getAllAccount?.map((item) => {
    item.fullOrgName =
      item.fullOrgName === '赵楼选煤厂'
        ? item.fullOrgName
        : item.fullOrgName?.replace('赵楼选煤厂/', '');
  });

  const [register, { validate, getFieldsValue }] = useForm({
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 10,
    },
    schemas,
    showActionButtonGroup: false,
    fieldMapToTime: [['scheduledTimeRange', ['scheduledCutOffTime', 'scheduledSupplyTime'], 'x']],
  });

  async function handleSubmit() {
    try {
      await validate();
      (loading.value = true),
        setTimeout(() => {
          loading.value = false;
          const value = getFieldsValue();
          createMessage.success('提交成功！');
          console.log('value :>> ', value);
        }, 2000);
    } catch (error: any) {
      throw new Error(error);
    }
  }
</script>
