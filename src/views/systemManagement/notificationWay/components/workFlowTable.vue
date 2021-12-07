<template>
  <div class="work-flow-table">
    <PageWrapper>
      <div class="h-full p-4 mt-4 overflow-auto bg-white"> </div>
      <BasicTable @register="registerTable" :loading="loading" @row-click="handleClickRow" />
    </PageWrapper>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page/index';
  import { BasicTable, useTable } from '/@/components/Table/index';
  import { GetNoticeSettingConfigListParams } from '/@/api/notice/model/settingModel';
  import { getNoticeSettingConfigList } from '/@/api/notice/setting';

  const selectedRowIndex = ref<number>(-1);
  const selectedRow = ref({});
  const loading = ref<boolean>(false);
  const searchForm = ref<GetNoticeSettingConfigListParams>({
    businessType: '',
    workflowFlag: true,
    pageNo: 1,
    pageSize: 10,
  });

  const [registerTable, { setTableData, setPagination, getDataSource }] = useTable({
    columns: [
      { title: '业务类型', dataIndex: 'businessType' },
      { title: '通知类型', dataIndex: 'notificationType' },
      {
        title: '手机推送',
        dataIndex: 'mobilePush',
        slots: { customRender: 'img' },
      },
      { title: 'WEB推送', dataIndex: 'webPush' },
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
      emit('changePage', { pageNo: page.current, pageSize: page.pageSize });
    },
  });

  getWorkFlowList();

  async function getWorkFlowList() {
    try {
      loading.value = true;
      const { items, totalCount } = await getNoticeSettingConfigList(searchForm.value);
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
</script>

<style scoped>
  .work-flow-table {
    color: red;
  }
</style>
