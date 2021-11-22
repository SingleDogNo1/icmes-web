<template>
  <BasicModal
    v-bind="$attrs"
    :title="'编辑指派代理'"
    @register="register"
    destroy-on-close
    @ok="handleSubmit"
  >
    <PageWrapper dense fixedHeight>
      <BasicForm @register="registerForm" :show-action-button-group="false" />
      <PageWrapper dense fixedHeight>
        <BasicTable @register="registerTable" :max-height="300" />
      </PageWrapper>
    </PageWrapper>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, Ref, nextTick } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { useUserState } from '/@/hooks/web/useUserState';
  import { PageWrapper } from '/@/components/Page';
  import { AccountConsignProxyModel } from '/@/api/account/model/basicModel';
  import { getRolesListByIdApi } from '/@/api/account/roles';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addProxyApi, EditProxyByIdApi } from '/@/api/account/proxies';
  import { addProxyParam, EditProxyParam } from '/@/api/account/model/proxiesModel';

  const userStore = useUserStoreWithOut();
  const { createMessage } = useMessage();

  const { getDictOptions } = useUserState();

  const emit = defineEmits(['done']);

  const loading = ref<boolean>(false);
  const allAccountTree = userStore.getAllAccountTree;
  // 编辑的类型，通过参数中是否存在versionTag，判断是新建还是编辑
  const editType: Ref<'create' | 'edit' | ''> = ref('');

  const editId = ref<string | number | null>(null);

  const [
    registerTable,
    { setTableData, setPagination, setShowPagination, getSelectRows, setSelectedRowKeys, setProps },
  ] = useTable({
    columns: [
      { title: '组织机构', dataIndex: 'fullOrgName', fixed: 'left' },
      { title: '角色', dataIndex: 'roleName' },
    ],
    rowKey: 'assId',
    clickToRowSelect: false,
    rowSelection: {
      type: 'radio',
    },
  });

  const [registerForm, { getFieldsValue, setFieldsValue, updateSchema, validate }] = useForm({
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
            defaultValue: [dateUtil().startOf('day'), dateUtil().endOf('day')],
          },
        },
        rules: [
          {
            required: true,
            message: '请选择代理时间',
          },
        ],
      },
      {
        field: 'periodType',
        label: '代理类型',
        component: 'Select',
        colProps: { span: 12 },
        required: true,
        componentProps: ({ formActionType }) => {
          return {
            options: getDictOptions('DT_PROXY_TYPE'),
            placeholder: '省份与城市联动',
            onChange: (type) => {
              const { updateSchema } = formActionType;
              if (type === 'PERIOD') {
                updateSchema({ field: 'periodCycle', show: true, required: true });
              } else {
                updateSchema({ field: 'periodCycle', show: false, required: false });
              }
            },
          };
        },
      },
      {
        field: 'periodCycle',
        label: '代理周期',
        component: 'Select',
        colProps: { span: 12 },
        show: false,
        required: false,
        componentProps: {
          options: [
            { value: 0, label: '周一' },
            { value: 1, label: '周二' },
            { value: 2, label: '周三' },
            { value: 3, label: '周四' },
            { value: 4, label: '周五' },
            { value: 5, label: '周六' },
            { value: 6, label: '周日' },
          ],
          mode: 'multiple',
        },
      },
      {
        field: 'assignUserId',
        label: '代理人',
        component: 'TreeSelect',
        defaultValue: '',
        required: true,
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
      {
        field: 'versionTag',
        label: '版本标签',
        component: 'Input',
        defaultValue: null,
        show: false,
      },
    ],
    fieldMapToTime: [['timeRange', ['proxyStartDate', 'proxyEndDate'], 'x']],
    autoSubmitOnEnter: true,
  });

  const [register, { closeModal }] = useModalInner(
    async (data: AccountConsignProxyModel & { employeeId: number }) => {
      console.log('data :>> ', data);
      loading.value = true;

      const values = getFieldsValue();
      console.log('values :>> ', values);

      const { items: allRolesList, totalCount } = await getRolesListByIdApi(data.employeeId, {
        pageNo: 0,
        pageSize: 0,
      });

      setTableData(
        allRolesList.reduce((res, pre, index) => {
          res.push({ ...pre, ...{ id: index } });
          return res;
        }, [] as any[]),
      );
      // 设置当前页显示条数 = 总条数 & 隐藏分页器
      setPagination({ pageSize: totalCount });
      setShowPagination(false);

      // 如果存在versionTag 字段，是编辑，否则是新建。并且编辑时，code 选项不可操作
      editType.value = data.versionTag ? 'edit' : 'create';

      if (editType.value === 'edit') {
        // 设置修改当前行的 id
        editId.value = data.id;
        // 设置表单值
        setFieldsValue({
          timeRange: [data.proxyStartDate, data.proxyEndDate],
          periodType: data.periodDays === '1111111' ? 'ALL' : 'PERIOD',
          periodCycle: data.periodDays.split('').reduce((res, pre, index) => {
            if (pre === '1') {
              res.push(index);
            }
            return res;
          }, [] as number[]),
          assignUserId: data.assignProxyUserId,
          consignUserRoleAss: data.assId,
          versionTag: data.versionTag,
        });
        // 设置代理周期选项是否显示
        updateSchema({
          field: 'periodCycle',
          show: data.periodDays !== '1111111',
          required: data.periodDays !== '1111111',
        });

        await nextTick();
        // 设置选中的代理角色，并禁用选择角色功能
        setSelectedRowKeys([data.assId]);

        console.log('getSelectRows :>> ', getSelectRows());
        setProps({
          rowSelection: {
            type: 'radio',
            getCheckboxProps() {
              return { disabled: true };
            },
          },
        });
      }
    },
  );

  async function handleSubmit() {
    await validate();
    const values = getFieldsValue();
    const selectRole = getSelectRows();
    if (!selectRole.length) {
      createMessage.error('请选择代理角色');
      return;
    }

    const options = { ...values, ...{ consignUserRoleAss: selectRole[0].assId } } as any;

    /**
     * 生成periodDays，格式为 corn 表达式格式, 共七个占位符, 每个占位符索引指代对应星期几. 1 表示已代理, 0 表示未代理
     * 生成逻辑: 默认值为 0000000,
     * 如果选择全时段代理，则等于 1111111;
     * 如果选择周期性代理，按照所选代理日，将对应位置的 0 替换为 1
     */
    let periodDays = '0000000';

    if (options.periodType === 'ALL') {
      options.periodDays = '1111111';
    } else if (options.periodType === 'PERIOD') {
      let daysArr = periodDays.split('');
      options.periodCycle.map((i) => {
        daysArr.splice(i, 1, '1');
      });
      options.periodDays = daysArr.join('');
    }
    // 这两个参数用来生成 periodDays 参数,接口不需要这两个参数
    delete options.periodType;
    delete options.periodCycle;

    console.log('options :>> ', options);

    loading.value = true;

    try {
      if (editType.value === 'create') {
        await addProxyApi(options as addProxyParam);
      } else if (editType.value === 'edit') {
        await EditProxyByIdApi(editId.value!, options as EditProxyParam);
      }
      createMessage.success('保存成功!');
      emit('done');
      closeModal();
    } finally {
      loading.value = false;
    }
  }
</script>
