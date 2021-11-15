<template>
  <BasicModal
    v-bind="$attrs"
    width="650px"
    :title="'编辑指派代理'"
    @register="register"
    destroy-on-close
    @ok="handleSubmit"
  >
    <PageWrapper>
      <BasicForm
        @register="registerForm"
        @submit="handleSubmit"
        :show-action-button-group="false"
      />
      <BasicTable @register="registerTable" />
    </PageWrapper>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import moment from 'moment';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { useUserState } from '/@/hooks/web/useUserState';
  import { PageWrapper } from '/@/components/Page';

  const userStore = useUserStoreWithOut();

  const { getDictOptions } = useUserState();

  // const emit = defineEmits(['submit']);

  const loading = ref<boolean>(false);
  const allAccountTree = userStore.getAllAccountTree;

  const [
    registerTable,
    {
      /* setTableData, setPagination, getSelectRows */
    },
  ] = useTable({
    columns: [
      { title: '组织机构', dataIndex: 'fullOrgName', fixed: 'left' },
      { title: '角色', dataIndex: 'roleName' },
    ],
    rowSelection: { type: 'radio' },
  });

  const [registerForm, { getFieldsValue }] = useForm({
    labelWidth: 80,
    schemas: [
      {
        field: 'timeRange',
        label: '代理时间',
        component: 'RangePicker',
        colProps: { span: 24 },
        componentProps: {
          defaultPickerValue: [],
          format: 'YYYY-MM-DD',
          showTime: {
            defaultValue: [moment().startOf('day'), moment().endOf('day')],
          },
        },
      },
      {
        field: 'periodDays',
        label: '代理类型',
        component: 'Select',
        colProps: { span: 12 },
        componentProps: ({ formModel, formActionType }) => {
          return {
            options: getDictOptions('DT_PROXY_TYPE'),
            placeholder: '省份与城市联动',
            onChange: (e) => {
              console.log('formModel :>> ', formModel, e);
              const { updateSchema } = formActionType;
              updateSchema({
                field: 'periodCycle',
                show: true,
              });
            },
          };
        },
      },
      {
        field: 'periodCycle',
        label: '代理日',
        component: 'Select',
        colProps: { span: 12 },
        show: false,
        componentProps: {
          options: [
            {
              value: 0,
              label: '周一',
            },
          ],
        },
      },
      {
        field: 'assignUserId',
        label: '接手人',
        component: 'TreeSelect',
        defaultValue: '',
        colProps: { span: 12 },
        componentProps: {
          showSearch: true,
          maxTagCount: 5,
          treeData: allAccountTree,
          dropdownStyle: { maxHeight: '200px', overflow: 'auto' },
          placeholder: '请选择',
          replaceFields: {
            title: 'name',
            key: 'id',
            value: 'userId',
          },
        },
      },
    ],
    fieldMapToTime: [['timeRange', ['proxyStartDate', 'proxyEndDate'], 'x']],
    autoSubmitOnEnter: true,
  });

  const [
    register,
    {
      /* closeModal */
    },
  ] = useModalInner(async (data) => {
    console.log('data :>> ', data);
    loading.value = true;

    const values = getFieldsValue();
    console.log('values :>> ', values);
  });

  function handleSubmit() {
    const values = getFieldsValue();
    console.log('values :>> ', values);
    // emit('submit', values);
    // closeModal();
  }
</script>
