<template>
  <div class="editLocationModal">
    <BasicModal
      :loading="loading"
      v-bind="$attrs"
      :title="`${editType === 'create' ? '新建' : '编辑'}位置信息`"
      :height="400"
      @register="register"
      @ok="handleSubmit"
    >
      <BasicForm @register="registerForm" />
    </BasicModal>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'EditLocationModal',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { schemas } from '../data';
  import { LocationFullNameModel, LocationModel } from '/@/api/info/model/locationModel';
  import { createLocationApi, getLocationTreeApi } from '/@/api/info/location';
  import { listToTreeAsParentId } from '/@/utils/helper/treeHelper';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { editLocationApi } from '../../../../api/info/location';

  const loading = ref(false);
  const editType = ref<'create' | 'edit' | ''>('');
  const editId = ref<number>();

  const emit = defineEmits(['done']);

  const { createMessage } = useMessage();

  const [registerForm, { getFieldsValue, setFieldsValue, updateSchema, validate }] = useForm({
    schemas,
    labelWidth: 120,
    showActionButtonGroup: false,
  });

  const [register, { closeModal }] = useModalInner(
    async (data: LocationFullNameModel & { type: string }) => {
      console.log('data', data);
      loading.value = true;
      editType.value = data.type === 'edit' ? 'edit' : 'create';

      try {
        const { items } = await getLocationTreeApi({
          parentId: 0,
          orderBy: 'Code',
          ascending: true,
        });
        const list: LocationFullNameModel[] = items || [];

        const treeData = listToTreeAsParentId(list);
        console.log('treeData', treeData);

        updateSchema([
          { field: 'code', componentProps: { disabled: data.type === 'edit' } },
          {
            field: 'parentOrganization',
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
        console.log('data', data);

        switch (data.type) {
          case 'createSiblings': // 新建同级
            setFieldsValue({
              parentId: data.parentId,
              parentOrganization: data.fullName,
            });
            break;
          case 'createChildren': // 新建子级
            setFieldsValue({
              parentId: data.id,
              parentOrganization: data.fullName,
            });
            break;
          case 'edit': // 编辑
            editId.value = data.id;
            setFieldsValue({
              id: data.id,
              code: data.code,
              name: data.name,
              parentId: data.parentId,
              versionTag: data.versionTag,
              parentOrganization: data.fullName,
            });
            break;
        }
      } catch (error) {
      } finally {
        loading.value = false;
      }
    },
  );

  async function handleSubmit() {
    loading.value = true;
    await validate();
    const values = getFieldsValue() as LocationModel;
    console.log('values', values);
    try {
      if (editType.value === 'create') {
        await createLocationApi(values);
      } else if (editType.value === 'edit') {
        await editLocationApi(editId.value!, values);
      }
      createMessage.success('保存成功');
      closeModal();
      emit('done');
    } catch (error: any) {
      loading.value = false;
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }
</script>

<style lang="less" scoped></style>
