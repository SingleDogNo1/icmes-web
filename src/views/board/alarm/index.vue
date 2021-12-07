<template>
  <PageWrapper contentFullHeight :contentBackground="true">
    <a-button @click="getFormValues" class="mr-2"> 获取表单值 </a-button>
    <BasicForm @register="register" @submit="handleSubmit" />
    <Row justify="end">
      <Col :span="24" class="text-right">
        <a-button-group>
          <a-button class="mr-2" @click="toWarningSettings">PLC 报警配置</a-button>
          <a-button class="mr-2" @click="toWarningRules">推送配置</a-button>
        </a-button-group>
      </Col>
    </Row>

    <BasicTable @register="registerTable" @change="change" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { Row, Col } from 'ant-design-vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PageWrapper } from '/@/components/Page';
  import { useUserState } from '/@/hooks/web/useUserState';
  import { onMounted, nextTick } from 'vue';
  import { getAlarmsListApi } from '/@/api/info/alarms';
  import type { GetAlarmsListParam } from '/@/api/info/model/alarmModel';

  const { getDictOptions } = useUserState();
  const { createMessage } = useMessage();

  // 报警来源
  const warningSourceOptions = getDictOptions('DT_ALARM_SOURCE');
  warningSourceOptions.unshift({ label: '全部', value: '' });

  // 报警类别
  const warningKindOptions = getDictOptions('DT_ALARM_KIND');
  warningKindOptions.unshift({ label: '全部', value: '' });

  // 报警级别
  const warningLevelOptions = getDictOptions('DT_ALARM_LEVEL');
  warningLevelOptions.unshift({ label: '全部', value: '' });

  const schemas: FormSchema[] = [
    {
      component: 'Checkbox',
      label: '升序',
      field: 'ascending',
      required: true,
      defaultValue: true,
      show: false,
    },
    {
      component: 'Input',
      label: '排序字段',
      field: 'orderBy',
      required: true,
      defaultValue: 'startTime',
      show: false,
    },
    {
      component: 'Input',
      label: '报警对象或报警内容',
      field: 'globalName',
      colProps: { span: 6 },
      componentProps: {
        maxlength: 20,
        placeholder: '设备编号/对象名称',
      },
    },
    {
      component: 'Select',
      label: '报警来源',
      field: 'warningSource',
      defaultValue: '',
      colProps: { span: 6 },
      componentProps: {
        options: warningSourceOptions,
      },
    },
    {
      component: 'Select',
      label: '报警类别',
      field: 'kind',
      defaultValue: '',
      colProps: { span: 6 },
      componentProps: {
        options: warningKindOptions,
      },
    },
    {
      component: 'Select',
      label: '报警级别',
      field: 'level',
      defaultValue: '',
      colProps: { span: 6 },
      componentProps: {
        options: warningLevelOptions,
      },
    },
    {
      component: 'Select',
      label: '处理状态',
      field: 'status',
      defaultValue: 1,
      colProps: { span: 6 },
      componentProps: {
        options: [
          { value: 1, label: '待处理' },
          { value: 2, label: '已处理' },
          { value: 3, label: '已报修' },
          { value: 4, label: '已关闭' },
        ],
      },
    },
  ];

  const [register, { getFieldsValue }] = useForm({
    labelWidth: 150,
    actionColOptions: { span: 24 },
    schemas,
  });

  const [registerTable, { setTableData, getPaginationRef }] = useTable({
    columns: [
      {
        title: 'ID',
        dataIndex: 'id',
        fixed: 'left',
        width: 200,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        width: 150,
        filters: [
          { text: 'Male', value: 'male' },
          { text: 'Female', value: 'female' },
        ],
      },
      {
        title: '地址',
        dataIndex: 'address',
      },
      {
        title: '编号',
        dataIndex: 'no',
        width: 150,
        sorter: true,
        defaultHidden: true,
      },
      {
        title: '开始时间',
        width: 150,
        sorter: true,
        dataIndex: 'beginTime',
      },
      {
        title: '结束时间',
        width: 150,
        sorter: true,
        dataIndex: 'endTime',
      },
    ],
  });

  onMounted(async () => {
    await nextTick();
    const form = getFieldsValue() as GetAlarmsListParam;
    console.log('form :>> ', form);
    const { items } = await getAlarmsListApi(form);
    setTableData(items || []);
  });

  function toWarningSettings() {
    console.log('跳转到PLC报警配置 >> ');
  }

  function toWarningRules() {
    console.log('跳转到报警推送配置 >> ');
  }

  function handleSubmit(values) {
    createMessage.success('click search,values:' + JSON.stringify(values));
  }

  function getFormValues() {
    const values = getFieldsValue();
    console.log('values :>> ', values);
    createMessage.success('values:' + JSON.stringify(values));
  }

  function change() {
    const pagination = getPaginationRef();
    console.log('1111 :>> ', pagination);
  }
</script>
