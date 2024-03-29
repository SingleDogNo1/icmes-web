<template>
  <BasicModal
    :loading="loading"
    v-bind="$attrs"
    :title="`${editType === 'create' ? '新建' : '编辑'}组织机构`"
    @register="register"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { getOrganizationsListApi } from '/@/api/info/organizations';
  import { listToTreeAsParentId } from '/@/utils/helper/treeHelper';
  import { editPowerCutConfigSchema as schemas } from './data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    EditPowerCutConfigModel,
    PowerCutConfigExtendEntity,
  } from '/@/api/info/model/powerCutConfigModel';
  import {
    createPowerCutConfigApi,
    editPowerCutConfigApi,
    getPowerCutConfigApi,
  } from '/@/api/info/powerCutConfig';
  import { map } from 'lodash-es';
  import { error } from '/@/utils/log';

  const { createMessage } = useMessage();

  const emit = defineEmits(['done']);

  const loading = ref<boolean>(false);
  const editType = ref<'create' | 'edit' | ''>('');

  const [registerForm, { getFieldsValue, setFieldsValue, updateSchema, validate, resetFields }] =
    useForm({
      schemas,
      labelWidth: 120,
      showActionButtonGroup: false,
    });

  const [register, { closeModal }] = useModalInner(async (config: PowerCutConfigExtendEntity) => {
    loading.value = true;
    editType.value = config.configId ? 'edit' : 'create';
    resetFields();

    try {
      const { items } = await getOrganizationsListApi({
        ascending: true,
        orderBy: 'Code',
        parentId: 0,
      });
      const list = items || [];
      const treeData = listToTreeAsParentId(list);
      setFieldsValue({ configId: config.configId });
      updateSchema([
        { field: 'powerCutType', componentProps: { disabled: editType.value === 'edit' } },
        { field: 'workFlowCode', componentProps: { disabled: editType.value === 'edit' } },
        {
          field: 'organizationIds',
          componentProps: {
            treeData,
            onChange: async (_val, _label, { triggerNode: { dataRef: checkedNode } }) => {
              setFieldsValue({
                parentId: checkedNode.id,
                parentFullName: checkedNode.parentFullName,
              });
            },
          },
        },
      ]);

      if (editType.value === 'edit') {
        const data = await getPowerCutConfigApi(config.configId);
        console.log('data :>> ', data.organizationEntityList);
        const organizationIds = map(data.organizationEntityList, 'organizationId');
        setFieldsValue({
          name: data.name,
          organizationIds,
          powerCutType: data.powerCutType,
          workFlowCode: data.workFlowCode,
          remark: data.remark,
        });
      }
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  });

  async function handleSubmit() {
    loading.value = true;
    await validate();
    const values = getFieldsValue() as EditPowerCutConfigModel;
    console.log('values :>> ', values);
    try {
      if (editType.value === 'create') {
        await createPowerCutConfigApi(values);
      } else if (editType.value === 'edit') {
        await editPowerCutConfigApi(values);
      }

      createMessage.success('保存成功');
      closeModal();
      emit('done');
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }
</script>
