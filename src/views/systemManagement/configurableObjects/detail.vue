<template>
  <PageWrapper contentBackground contentFullHeight :title="`${typeTxtMap[routeType]}配点对象`">
    <Spin :spinning="spinning">
      <BasicForm @register="register" @submit="handleSubmit" />
    </Spin>

    <template #rightFooter>
      <a-button v-if="editable" type="primary" @click="handleSubmit" :loading="loading">
        提交审批
      </a-button>
    </template>
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'ConfigurableObjectDetail',
  };
</script>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';
  import { Spin } from 'ant-design-vue';
  import { useRoute } from 'vue-router';
  import { useGo } from '/@/hooks/web/usePage';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ConfigurableObjectModel } from '/@/api/info/model/configurableObjectModel';
  import { detailFormSchemas as schemas } from './data';
  import {
    getConfigurableObjectsDetailApi,
    createConfigurableObjectApi,
    editConfigurableObjectApi,
  } from '/@/api/info/configurableObject';

  const {
    query: { type: routeType, id: routeId },
  } = useRoute();
  const go = useGo();
  const { createMessage } = useMessage();

  const typeTxtMap = ref({
    create: '新建',
    edit: '编辑',
    view: '查看',
  });
  const spinning = ref(false);
  const loading = ref(false);
  const editable = computed(() => routeType !== 'view');
  const [register, { getFieldsValue, setFieldsValue, setProps, validate }] = useForm({
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 10,
    },
    showActionButtonGroup: false,
    schemas,
    autoSubmitOnEnter: true,
  });

  onMounted(async () => {
    setProps({ disabled: !editable.value });
    if (routeId) {
      try {
        spinning.value = true;
        const data = await getConfigurableObjectsDetailApi(routeId as unknown as number);
        console.log('data :>> ', data);
        setFieldsValue({
          code: data.code,
          name: data.name,
          processNo: data.processNo,
          processId: data.processId,
          organizationFullName: data.organizationFullName,
          locationId: data.locationId,
          model: data.model,
          memo: data.memo,
          createTime: data.createTime,
          createUserId: data.createUserId,
          id: data.id,
          updateTime: data.updateTime,
          updateUserId: data.updateUserId,
          versionTag: data.versionTag,
        });
      } catch (error: any) {
        throw new Error(error);
      } finally {
        spinning.value = false;
      }
    }
  });

  async function handleSubmit() {
    const values = getFieldsValue() as ConfigurableObjectModel;

    await validate();
    try {
      loading.value = true;
      if (routeId) {
        await editConfigurableObjectApi(parseInt(routeId as unknown as number), values);
      } else {
        await createConfigurableObjectApi(values);
      }
      createMessage.success('保存成功');
      go({ name: 'systemManagementConfigurableObjects' });
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }
</script>
