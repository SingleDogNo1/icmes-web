<template>
  <PageWrapper dense contentFullHeight contentBackground title="新建停送电单">
    <BasicForm @register="register">
      <!-- 停送电联系人 -->
      <template #contactUser="{ model, field }">
        <ASelect v-model:value="model[field]" allowClear show-search optionFilterProp="title">
          <ASelect.Option
            v-for="item in contactUserOptions"
            :key="item.userId"
            :value="item.userId"
            :title="item.name"
          >
            <span> {{ item.name }} </span>
            <span class="text-disabled ml-4"> {{ item.fullOrgName }} </span>
          </ASelect.Option>
          <template #suffixIcon v-if="loadingContactUserOptions">
            <LoadingOutlined spin />
          </template>
          <template #notFoundContent v-if="loadingContactUserOptions">
            <span>
              <LoadingOutlined spin class="mr-1" />
              {{ t('component.form.apiSelectNotFound') }}
            </span>
          </template>
        </ASelect>
      </template>
    </BasicForm>

    <template #rightFooter>
      <a-button type="primary" @click="handleSubmit" :loading="loading">提交审批</a-button>
    </template>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';
  import { Select as ASelect } from 'ant-design-vue'; // select 是 html 标签的关键字，最好不要直接使用
  import { useMessage } from '/@/hooks/web/useMessage';
  import { editPowerCutSchemas as schemas } from './editPowerCutData';
  import { useGlobSetting } from '/@/hooks/setting';
  import { getAllAccountTreeApi } from '/@/api/info/organizations';
  import { sortBy } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { LoadingOutlined } from '@ant-design/icons-vue';

  const { projectName } = useGlobSetting();
  const { createMessage } = useMessage();
  const { t } = useI18n();

  const loading = ref(false);
  const loadingContactUserOptions = ref(false);
  const contactUserOptions = ref<Record<string, any>[]>([]);

  const [register, { validate, getFieldsValue }] = useForm({
    labelCol: { span: 7 },
    wrapperCol: { span: 10 },
    schemas,
    showActionButtonGroup: false,
    fieldMapToTime: [['scheduledTimeRange', ['scheduledCutOffTime', 'scheduledSupplyTime'], 'x']],
  });

  onMounted(() => {
    getAllAccountTree();
  });

  async function getAllAccountTree() {
    loadingContactUserOptions.value = true;
    try {
      const { items } = await getAllAccountTreeApi({});
      const accountList = sortBy(items, 'code').filter((v) => v.fullOrgName !== null);
      const contact_user_options = accountList.reduce((res, pre) => {
        res.push({
          userId: pre.userId,
          name: pre.name,
          fullOrgName:
            pre.fullOrgName === projectName
              ? pre.fullOrgName
              : pre.fullOrgName?.replace(`${projectName}/`, ''),
        });
        return res;
      }, [] as { userId: number; name: string; fullOrgName: string }[]);
      contactUserOptions.value = contact_user_options;
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loadingContactUserOptions.value = false;
    }
  }

  async function handleSubmit() {
    try {
      await validate();
      loading.value = true;
      setTimeout(() => {
        createMessage.success('提交成功！');
        const value = getFieldsValue();
        console.log('value :>> ', value);
      }, 2000);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }
</script>
