<template>
  <BasicTable @register="registerTable" :loading="loading" @row-click="handleClickRow">
    <template #businessType="{ record }">
      {{ businessTypeMap[record.businessType] }}
    </template>
    <template #notificationType="{ record }">
      {{ notificationTypeMap[record.notificationType] || '通知' }}
    </template>
    <template #mobilePush="{ record }">
      <Switch v-model:checked="record.mobilePush" @change="handleChange(record, 0)" />
    </template>
    <template #webPush="{ record }">
      <Switch v-model:checked="record.webPush" @change="handleChange(record, 1)" />
    </template>
  </BasicTable>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { BasicTable, useTable, PaginationProps } from '/@/components/Table';
  import { GetNoticeSettingConfigListParams } from '/@/api/notice/model/settingModel';
  import {
    getNoticeSettingConfigListApi,
    updateNoticeSettingConfigApi,
  } from '/@/api/notice/setting';
  import { Switch } from 'ant-design-vue';
  import { useUserState } from '/@/hooks/web/useUserState';

  const props = defineProps({
    workflowFlag: {
      type: Boolean,
      require: true,
    },
  });

  const selectedRowIndex = ref<number>(-1);
  const selectedRow = ref({});
  const loading = ref<boolean>(false);
  const searchForm = ref<GetNoticeSettingConfigListParams>({
    businessType: '',
    workflowFlag: props.workflowFlag,
    pageNo: 1,
    pageSize: 10,
  });

  const emit = defineEmits(['selectRow', 'changePage']);

  const { getDictMap } = useUserState();

  console.log(props.workflowFlag);
  let businessTypeMap = ref({});
  const notificationTypeMap = {
    0: '任务',
    1: '抄送',
  };

  const [registerTable, { setTableData, getPaginationRef, setPagination, getDataSource }] =
    useTable({
      columns: [
        { title: '业务类型', dataIndex: 'businessType', slots: { customRender: 'businessType' } },
        {
          title: '通知类型',
          dataIndex: 'notificationType',
          slots: { customRender: 'notificationType' },
        },
        {
          title: '手机推送',
          dataIndex: 'mobilePush',
          slots: { customRender: 'mobilePush' },
        },
        { title: 'WEB推送', dataIndex: 'webPush', slots: { customRender: 'webPush' } },
      ],
      ellipsis: false,
      rowClassName: (_, index) => {
        return selectedRowIndex.value === index ? 'row__active' : '';
      },
      onChange: () => {
        const page = getPaginationRef() as PaginationProps;
        setPagination({
          current: page.current,
          pageSize: page.pageSize,
        });

        Object.assign(searchForm.value, { pageNo: page.current, pageSize: page.pageSize });
        emit('changePage', { pageNo: page.current, pageSize: page.pageSize });
      },
    });

  getWorkFlowList();

  async function getWorkFlowList() {
    try {
      loading.value = true;
      const { items, totalCount } = await getNoticeSettingConfigListApi(searchForm.value);
      setTableData(items || []);
      setPagination({ total: totalCount });
      if (items) {
        // 有数据，默认选中第一条，查询详情
        selectedRowIndex.value = -1;
        const tableData = getDataSource();
        handleClickRow(tableData[0], 0);
      }
    } catch (error) {
    } finally {
      loading.value = false;
    }
  }

  function handleClickRow(row, index?) {
    if (selectedRowIndex.value === index) return;
    emit('selectRow', row);
    selectedRowIndex.value = index;
    selectedRow.value = row;
  }

  async function updateNoticeSettingConfig(record) {
    try {
      loading.value = true;
      await updateNoticeSettingConfigApi(record);
      getWorkFlowList();
    } catch (error) {
    } finally {
      loading.value = false;
    }
  }
  function handleChange(record, index) {
    updateNoticeSettingConfig(record);
    console.log(record, index);
  }

  watch(
    () => props.workflowFlag,
    (value) => {
      businessTypeMap.value = value
        ? getDictMap('DT_BUSINESS_TYPE')
        : getDictMap('DT_NOTICE_BUSINESS_TYPE');
      searchForm.value.workflowFlag = value;
      getWorkFlowList();
    },
    {
      deep: true,
    },
  );

  // 监听翻页
  watch(
    () => searchForm.value,
    () => {
      getWorkFlowList();
    },
    {
      deep: true,
    },
  );
</script>

<style scoped>
  .work-flow-table {
    color: red;
  }
</style>
